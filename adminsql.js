var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootpassword",
  database: "pbs"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Attempting to Insert...");
  var sql = "INSERT INTO ACCOUNT ( firstName, lastName, email, passwordHash) VALUES ('Rodney', 'Preston', 'admin@prestigeboilers.com', '525754101dc5789bfc1e2cf28ff5f999a691187ce096bb9f0a0529416bcd8db0')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});