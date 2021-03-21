"use strict";

const response = require("./res");
const connection = require("./connection");

// test konek file mahasiswa
exports.index = function (req, res) {
  response.ok("konek table mahasiswa", res);
};

// get table mahasiswa
exports.mahasiswa = (req, res) => {
  var sql = `SELECT * FROM mahasiswa`;

  // var sql = `SELECT * FROM mahasiswa WHERE deleted_at IS NULL`; --> mencari data yg tidak dihapus
  connection.query(sql, function (error, rows, fields) {
    if (error) {
      response.notfound("Terjadi Kesalahan!", res);
    } else {
      response.ok(rows, res);
    }
  });
};

//   get mahasiswa berdasarkan id
exports.mahasiswaById = (req, res) => {
  var id_mahasiswa = req.params.id;
  var sql = `SELECT * FROM mahasiswa WHERE id_mahasiswa = ${id_mahasiswa}`;
  connection.query(sql, function (error, rows, fields) {
    if (error) {
      response.notfound("Terjadi Kesalahan!", res);
    } else {
      response.ok(rows, res);
    }
  });
};

// post ataut tambah data
exports.tambahMahasiswa = (req, res) => {
  var nim = req.body.nim;
  var nama = req.body.nama;
  var jurusan = req.body.jurusan;

  var sql = `INSERT INTO mahasiswa (nim,nama,jurusan) VALUES(?,?,?)`;
  var values = [nim, nama, jurusan]
  connection.query(sql, values, function (error, rows, fields) {
    if (error) {
      response.notfound("Terjadi Kesalahan!", res);
    } else {
      response.ok(`tambah data berhasil`, res);
    }
  });
};

// put atau edit data
exports.ubahMahasiswa = (req, res) => {
  var id_mahasiswa = req.body.id_mahasiswa;
  var nim = req.body.nim;
  var nama = req.body.nama;
  var jurusan = req.body.jurusan;
  var sql = `UPDATE mahasiswa SET nim=?, nama=?,jurusan=? WHERE id_mahasiswa = ${id_mahasiswa}`
  var values = [nim, nama, jurusan]
  connection.query(sql, values, function (error, rows, fields) {
    if (error) {
      response.notfound("Terjadi Kesalahan!", res);
    } else {
      response.ok(`edit data berhasil`, res);
    }
  });
}

// menghapus data berdasarkan id
exports.hapusMahasiswa = (req, res) => {
  
  //untuk project selanjutnya data nya jgn dihapus, tapi tambahin delete_at dikolomnya
  // jadi kaya yg di ajarin di BWA, pake sistem softdelete 


  var id_mahasiswa = req.body.id_mahasiswa
  var sql = `DELETE FROM mahasiswa WHERE id_mahasiswa = ${id_mahasiswa}`
  connection.query(sql, function (error, rows, fields) {
    if (error) {
      response.notfound("Terjadi Kesalahan!", res);
    } else {
      response.ok(`hapus data berhasil`, res);
    }
  });
}


// kaya yg ini nih, nanti pas get nya kalo ada deleted_at jgn dimunculin gitu ajaaa (WHERE deleted_at IS NULL)
exports.softDeleteMahasiswa = (req, res) => {
  var id_mahasiswa = req.body.id_mahasiswa;
 
  var sql = `UPDATE mahasiswa SET deleted_at= now() WHERE id_mahasiswa = ${id_mahasiswa}`

  connection.query(sql, function (error, rows, fields) {
    if (error) {
      response.notfound("Terjadi Kesalahan!", res);
    } else {
      response.ok(`edit data berhasil`, res);
    }
  });
}


// menampilkan matakuliah group
exports.tampilGroupMatakuliah = (req,res)=>{

  var sql = `SELECT mahasiswa.id_mahasiswa, mahasiswa.nim,mahasiswa.nama,mahasiswa.jurusan, matakuliah.matakuliah, matakuliah.sks FROM krs JOIN matakuliah JOIN mahasiswa WHERE krs.id_matakuliah = matakuliah.id_matakuliah AND krs.id_mahasiswa = mahasiswa.id_mahasiswa ORDER BY mahasiswa.id_mahasiswa`
  connection.query(sql, function (error, rows, fields) {
    if (error) {
      response.notfound("Terjadi Kesalahan!", res);
    } else {
      response.oknested(rows, res);
    }
  });
}


exports.kelas = (req,res)=>{

  var sql = `SELECT kelas.nama_kelas, mahasiswa.nama FROM data_kelas JOIN kelas JOIN mahasiswa ON data_kelas.id_mahasiswa = mahasiswa.id_mahasiswa AND data_kelas.id_kelas = kelas.id_kelas`
  connection.query(sql, function (error, rows, fields) {
    if (error) {
      response.notfound("Terjadi Kesalahan!", res);
    } else {
      response.oknestedkelas(rows, res);
    }
  });
}