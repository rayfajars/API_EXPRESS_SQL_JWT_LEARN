var connection = require('../connection');
var mysql = require("mysql");
var md5 = require('MD5');
var response = require('../res');
var jwt = require('jsonwebtoken');
var config = require('../config/secret');
var ip = require('ip')


//controller untuk register

exports.registrasi = function (req, res) {
    var post = {
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role,
        tanggal_daftar: new Date()
    }

    console.log(post)
    // check email sudah terdaftar atau belum
    var query = "SELECT email FROM ?? WHERE ??=?"
    var table = ['user', "email", post.email]

    query = mysql.format(query, table);
    connection.query(query, function (error, rows) {
        if (error) {
            console.log(query, error)
        } else {
            if (rows.length == 0) {
                var query = "INSERT INTO ?? SET ?";
                var table = ['user'];
                query = mysql.format(query, table);
                connection.query(query, post, function (error, rows) {
                    if (error) {
                        console.log("eror bos", error)
                    } else {
                        response.ok('Berhasil menambahkan data user baru', res)
                    }
                })
            } else {
                response.ok("Email sudah terdaftar!", res);
            }
        }
    })
}


// controller untuk login
exports.login = function (req, res) {
    var post = {
        password: req.body.password,
        email: req.body.email,
    }

    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["user", "password", md5(post.password), "email", post.email]

    query = mysql.format(query, table);
    connection.query(query, function (error, rows) {
        if (error) {
            console.log(error);
        } else {
            // apakah data ada ? pake if else ini
            if (rows.length == 1) {
                // membuat token 
                var token = jwt.sign({
                    rows
                }, config.secret, {
                    expiresIn: "2d",
                    // waktu token selama 1 hari, jika token sudah lewat 2 hari maka token tidak bisa diakses dan harus login kembali untuk mengenrate token aru
                });
                // mengambil data id di database user
                id_user = rows[0].id;
                //1 tambahan row username
                username = rows[0].username;
                //2 tambahan row role
                role = rows[0].role;

                var expired = "2d"

                var data = {
                    id_user: id_user,
                    access_token: token,
                    ip_address: ip.address()
                }

                var query = "INSERT INTO ?? SET ?";
                var table = ["akses_token"];

                query = mysql.format(query, table);
                connection.query(query, data, function (error, rows) {
                    if (error) {
                        console.log(error)
                    } else {
                        res.json({
                            succes: true,
                            message: 'Token JWT tergenerate!',
                            token: token,
                            //4 tambahkan expired time
                            expires: expired,
                            username: username,
                            id_user: data.id_user,
                            //3 tambahkan role
                            role: role,
                        });
                    }
                })
            } else {
                res.json({
                    "Error": true,
                    "Message": "Email atau Password salah!"
                });
            }
        }
    })
}



// controller ubah password
exports.ubahPassword = function (req, res) {

    //buat input req body
    var data = {
        email: req.body.email,
        currpassword: md5(req.body.currpassword),
        newpassword: md5(req.body.newpassword)
    }

    //jalankan kueri
    var query = "SELECT email,password FROM ?? WHERE ??=?";
    var table = ["user", "email", data.email];

    query = mysql.format(query, table);

    connection.query(query, function (error, rows) {
        if (error) {
            console.log(error);
        } else {
            if (rows.length == 1) {
                email = rows[0].email;
                password = rows[0].password;

                if (data.currpassword == password) {
                    if (data.newpassword == data.currpassword) {
                        res.json({
                            success: false,
                            message: "Password masih sama dengan sebelumnya!"
                        }).end()
                    } else {
                        connection.query('UPDATE user SET password=? WHERE email=?',
                            [data.newpassword, email],
                            function (error, rows, fields) {
                                if (error) {
                                    res.json({
                                        success: false,
                                        message: error
                                    }).end()
                                } else {
                                    res.json({
                                        success: true,
                                        message: "Berhasil Update Password!"
                                    }).end()
                                }
                            }
                        )
                    }
                } else {
                    res.json({
                        success: false,
                        message: "Password lama salah!"
                    }).end()
                }
            } else {
                // kalo tokennya beda dan username beda
                res.json({
                    success: false,
                    message: "Email atau Password tidak terdaftar!"
                }).end()
            }
        }
    });
}

// logout and delete token
exports.logout = function (req, res) {

    var data = {
        id_user: req.body.id_user,
        token: req.body.token
    }

    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?"
    var table = ["akses_token", "id_user", data.id_user, "access_token", data.token]
    query = mysql.format(query, table);

    connection.query(query, function (error, rows) {
        if (error) {
            console.log(error);
        } else{
            console.log(rows)
            if (rows.length > 0) {
                id_user = rows[0].id_user
                token = rows[0].access_token
                connection.query("DELETE FROM akses_token WHERE id_user=? AND access_token=?", [id_user, token],
                function(error,rows,fields){
                    if(error){
                        res.json({
                            success: false,
                            message: error
                        }).end()
                    }else {
                        res.json({
                            success: true,
                            message: "Berhasil logout!"
                        }).end()
                    }
                }
                )
            }else {
                res.json({
                    success: false,
                    message: "Logout Gagal!"
                }).end()
            }
        }
    })

    // var sql = `DELETE FROM akses_token where id_user = ${data.id_user}`
    // connection.query(sql, function (error, rows) {
    //     if(error)
    //     console.log(error);
    //     else{
    //         res.json({
    //             success: true,
    //             message: "Logout berhasil!"
    //         }).end()
    //     }
    //   })

}

exports.halamanrahasia = function (req, res) {
    response.ok("Halaman ini hanya untuk user dengan role 2!", res)
}


//menampilkan semua data mahasiswa
exports.adminmahasiswa = function (req, res) {
    connection.query('SELECT * FROM mahasiswa', function (error, rows, fileds) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res)
        }
    });
};