//verifikasi untuk mengambil data

const jwt = require("jsonwebtoken");
const config = require('../config/secret');


// check roles user
function verifikasi(){
    // console.log(roles)
    return function(req,res, next){
        // mengambil role body secara manual harus mah bisa otomatis dari database
        var role = req.body.role
        // console.log(role)
        // check authorizzation header / check token
        var tokenWithBearer =  req.headers.authorization;
        // console.log(tokenWithBearer)
        if(tokenWithBearer){
            var token = tokenWithBearer.split(' ')[1];
            // verifikasi
            jwt.verify(token, config.secret, function(err, decoded){
                if(err){
                    console.log(err)
                    return res.status(401).send({auth:false,message:"Token tidak terdaftar"});
                }else{
                    if(role == 1){
                        req.auth = decoded;
                        // console.log(req.auth)
                        next()
                    }else {
                        return res.status(401).send({auth:false,message:"Gagal mengotorisasi role anda!"});
                    }
                }
            });
        }else {
            return res.status(401).send({auth:false,message:"Token tidak tersedia"});
        }

    }
}

module.exports = verifikasi