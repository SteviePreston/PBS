const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt"); //! check if it needed at the end
const crypto = require("crypto");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

//? =======================================================================================================================

//* Intialise express + Dotenv
const app = express();
app.use(cors());
app.use(bodyparser.json());

dotenv.config();

//? =======================================================================================================================

//* Initalise Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
});

//* Check db connection
db.connect(function(err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Connected to the database...");
  });

//? =======================================================================================================================

API_VERSION = "/v1";
API_PATH = API_VERSION + "/api";

// //* get customer data from the database
// app.get(API_PATH + "/customer", (req, res)=>{
//     let qr = "SELECT * FROM CUSTOMER";
//     db.query(qr, (err, result)=>{
//         if (err) console.error(err, 'errs');

//         if (result.length>0) {
//             res.send({
//                 message:"All customer data...",
//                 data:result,
//             });
//         }
//     });
// });
  
// //* Get a singular user from the database from their customerID
// app.get(API_PATH +"/customer/:customerID", (req, res)=>{
//     let customerID = req.params.customerID;
//     let qr = `SELECT * FROM CUSTOMER WHERE customerID = ?`;

//     db.query(qr, [customerID], (err, result)=>{
//         if (err) {
//             console.error(err);
//             res.status(500).send('Error retrieving customer data');
//         } else {
//             if (result.length > 0) {
//                 res.status(200).send({
//                     message: "Singular customer data...",
//                     data: result,
//                 });
//             } else {
//                 res.status(404).send("Data not found...");
//             }
//         }
//     });
// });

// //* Post a singular user into the database.
// app.post(API_PATH +"/customer", (req, res) => {

//     let houseNumber = req.body.houseNumber;
//     let address = req.body.address;
//     let city = req.body.city;
//     let county = req.body.county;
//     let postCode = req.body.postCode;
//     let phoneNumber = req.body.phoneNumber;
  
//     let qr = `INSERT INTO CUSTOMER (houseNumber, address, city, county, postCode, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)`;
  
//     db.query(qr, [houseNumber, address, city, county, postCode, phoneNumber], (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Error inserting record");
//       } else {
//         console.log(result, "result");
//         res.status(201).send("Record inserted successfully");
//       }
//     });
// });

//* user register endpoint
app.post(API_PATH +"/register", (req, res) => {
    let houseNumber = req.body.houseNumber;
    let address = req.body.address;
    let city = req.body.city;
    let county = req.body.county;
    let postCode = req.body.postCode;
    let phoneNumber = req.body.phoneNumber;
  
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;

    let salt = process.env.PASSWORD_SALT;
    let saltedPassword = password + salt;
    let passwordHash = crypto.createHash('sha256').update(saltedPassword).digest('hex');

    let checkEmailQuery = `SELECT COUNT(*) AS count FROM ACCOUNT WHERE email=?`;
    let insertCustomerQuery = `INSERT INTO CUSTOMER (houseNumber, address, city, county, postCode, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)`;
    let getMaxCustomerIdQuery = `SELECT MAX(customerID) AS maxID FROM CUSTOMER`;
    let insertAccountQuery = `INSERT INTO ACCOUNT (customerID, firstName, lastName, email, passwordHash) VALUES (?, ?, ?, ?, ?)`;
  
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({message: 'Internal Server Error'});
        } else {
            if (result[0].count > 0) {
                res.status(401).json({message: 'Email already in use'});
            } else {
                db.query(insertCustomerQuery, [houseNumber, address, city, county, postCode, phoneNumber], (err, result) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({message: 'Internal Server Error'});
                    } else {
                        db.query(getMaxCustomerIdQuery, (err, result) => {
                            if (err) console.error(err);
                            maxID = result[0].maxID;
                            db.query(insertAccountQuery, [maxID, firstName, lastName, email, passwordHash], (err, result) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).json({message: 'Internal Server Error'});
                                } else {
                                    res.status(201).json({message: 'Registration successful'});
                                    
                                }
                            });
                        });
                    }
                });
            }
        }
    });
});

//* Login check endpoint
app.post(API_PATH +"/login", (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let user = null;
    let secret = process.env.TOKEN_SECRET;
    let checkLogin = `SELECT * FROM ACCOUNT WHERE email =?`;
    
    db.query(checkLogin, [email], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({message: 'Error checking login credentials'});
        } else if (result.length === 0){
            res.status(401).json({message: 'Invalid email or password'});
        } else {
            user = result[0];
            let salt = process.env.PASSWORD_SALT;
            let saltedPassword = password + salt;
            let passwordHash = crypto.createHash('sha256').update(saltedPassword).digest('hex');
            if (user.passwordHash !== passwordHash){
                res.status(401).json({message: 'Invalid email or password'});
            } else {
                // Create JWT token
                const token = jwt.sign({ email: user.email }, secret, { expiresIn: '6h' });

                // Return JWT token to client
                res.status(201).json({ token }); 
            }
        }
    });
});

//* check if account is admin
app.get(API_PATH + "/admin/:accountEmail", authenticateToken, (req, res)=>{
    let accountEmail = req.params.accountEmail;
    let admin = false;
    let qr = `SELECT customerID FROM ACCOUNT WHERE email = ?`;

    db.query(qr, [accountEmail], (err, result)=>{
        if (err){
            console.error(err);
            res.status(500).json({message:'Error checking login credentials'});
        } else if (result.length === 0 ){
            res.status(401).json({message:'Invalid email'});
        } else {
            admin = result[0];
            if (admin.customerID !== null){
                res.status(202).json(false);
            } else if (admin.customerID == null) {
                res.status(201).json(true); 
            }
        }
    })
});

// app.get(API_PATH + "/bookings", (req, res) => {
//     const qr = `SELECT b.bookingID, b.customerID, b.bookingDate, b.bookingTime, b.bookingType, b.houseNumber, b.address, b.city, b.county, b.postcode, a.firstName, a.lastName, a.email, c.phoneNumber
//                 FROM BOOKING b
//                 JOIN ACCOUNT a ON b.customerID = a.customerID
//                 JOIN CUSTOMER c ON b.customerID = c.customerID`;
  
//     db.query(qr, (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ message: "Error fetching bookings" });
//       } else {
//         res.status(200).json(result);
//       }
//     });
//   });

//Get Bookings
app.get(API_PATH + "/bookings", (req, res) => {
    const qr = `SELECT b.bookingID, b.customerID, b.bookingDate, b.bookingTime, b.bookingType, b.houseNumber, b.address, b.city, b.county, b.postcode, a.firstName, a.lastName, a.email, c.phoneNumber
                FROM BOOKING b
                JOIN ACCOUNT a ON b.customerID = a.customerID
                JOIN CUSTOMER c ON b.customerID = c.customerID`;
  
    db.query(qr, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching bookings" });
      } else {
        res.status(200).json(result);
      }
    });
  });

// app.get(API_PATH + "/bookings", (req, res) => {
//     const qr = `SELECT * FROM BOOKING`;
  
//     db.query(qr, (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ message: "Error fetching bookings" });
//       } else {
//         res.status(200).json(result);
//       }
//     });
//   });
  

//! LOGOUT SHOULD BE HANDLED IN THE FRONTEND AS JWT IS A CLIENTSIDE TOKEN!
//! EXAMPLE ANGULAR CODE MAKE A BUTTON WITH A FUNCTION CALLED LOGOUT WHICH RUNS ON SUBMIT
//! <button (click)="Logout()"> Logout! </button>
//! Logout(){
//!     localStorage.removeItem("token");
//!     this.router.navigate(['/Home']);
//! }


//? =======================================================================================================================
//* Middleware function
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401); //.json({message: "You are not logged in"})

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); //.json({message: "Invalid or expired token!"})
  
      req.user = user;
      next();
    });
}

//? =======================================================================================================================
// // THREE FILES: 
// // Controller (api endpoints) eg app.post("/login", frontend sends request to backend via /login endpoint then sends to service layer 
// app.post("/login", (req, res)=>{
//     console.log(req.body, "Create data...");

//     let userName = req.body.userName;
//     let Password = req.body.Password;
    
//     //! send to service layer 
//     //compare Username and Password to db_username and db_password
//     //send a response back based on the comparasion
// });
// // Service Layer (validation) backend valiidation eg checks only one email per account

// // Repositiory Layer direct DB access 

//? =======================================================================================================================

app.listen(3000, ()=>{
    console.log("Server is running...");
});