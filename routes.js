'use strict';

module.exports = function(app){
    var controller = require('./controller');
    var mahasiswa = require('./mahasiswa');


    app.route('/').get(controller.index)
    app.route('/mahasiswa').get(mahasiswa.mahasiswa)
    app.route('/mahasiswa/:id').get(mahasiswa.mahasiswaById)
    app.route('/tambah/mahasiswa').post(mahasiswa.tambahMahasiswa)
    app.route('/ubah/mahasiswa').put(mahasiswa.ubahMahasiswa)
    app.route('/hapus/mahasiswa').delete(mahasiswa.hapusMahasiswa)
    app.route('/softdeletes/mahasiswa').put(mahasiswa.softDeleteMahasiswa)

    // tampil data yg digrup
    app.route('/matakuliah/mahasiswa').get(mahasiswa.tampilGroupMatakuliah)
} 