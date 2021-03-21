// datanya tetap
'use strict';

exports.ok = function(values,res){
    var data = {
        'status':200,
        'values':values
    }
    res.json(data);
    res.end();
}

exports.notfound = function(values,res) {
    var data = {
      'status': 404,
      'values': values
    };
    res.status(404).json(data);
    res.end();
  }

  // response untuk nested matakuliah
  exports.oknested = function(values,res){
    // lakukan akumulasi
    const hasil = values.reduce((akumulasikan,item)=> {
      // tentukan key group
      if(akumulasikan[item.nama]){
        // buat varibel group nama mahasiswa
        const group = akumulasikan[item.nama];
        // cek jik isi array adalah matakuliah
        if(Array.isArray(group.matakuliah)){
          // tambahkan value kedalam group matakuliah
          group.matakuliah.push(item.matakuliah)
        }else {
          group.matakuliah = [group.matakuliah,item.matakuliah]
        }
      }else {
        akumulasikan[item.nama] = item;
      }

      return akumulasikan;
    }, {});

    var data = {
      'status':200,
      'values':hasil
    };

     res.json(data);
     res.end();
  }

  exports.oknestedkelas = function(values,res){
    // lakukan akumulasi
    const hasil = values.reduce((akumulasikan,item)=>{
      // console.log(akumulasikan,item)
      if(akumulasikan[item.nama_kelas]){

        const group = akumulasikan[item.nama_kelas];

        if(Array.isArray(group.nama)){
          group.nama.push(item.nama)
        }else {
          group.nama = [group.nama,item.nama]
        }

        

      }else {
        akumulasikan[item.nama_kelas] = item
      }

      return akumulasikan
    }, {})

    var data = {
      'status':200,
      'values':hasil
    };

     res.json(data);
     res.end();
  }