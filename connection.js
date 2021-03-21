const mysql = require('mysql');

// buat koneksi database
const conn = mysql.createConnection({
    // konek ke local
  host: "localhost",
  user: "root",
  password: "",
  database: "db_restapi",
  multipleStatements: true
})

conn.connect(function(err) {
    if (err) throw err;
    console.log("Database terkoneksi")
  });
  
  module.exports = conn;