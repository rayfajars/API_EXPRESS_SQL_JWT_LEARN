var express = require('express'); 
var auth = require('./auth');
var router = express.Router();
var verifikasi = require('./verifikasi');


// daftar menu registrasi
router.post('/api/v1/register', auth.registrasi);

// daftar login 
router.post('/api/v1/login', auth.login);

// daftar ganti password
router.post('/api/v1/ubahpassword', verifikasi(), auth.ubahPassword);



// daftar ganti password
router.post('/api/v1/logout',  auth.logout);

// halaman yg perlu otorisasi
//alamat yang perlu otorisasi
//halaman menampilkan data tabel oleh administrator
router.get('/api/v1/admin/mahasiswa', verifikasi(), auth.adminmahasiswa);
router.get('/api/v1/rahasia', verifikasi(), auth.halamanrahasia)


module.exports = router;