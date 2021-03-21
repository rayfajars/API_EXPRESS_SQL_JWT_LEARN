const express = require('express');
var bodyParser = require('body-parser');

var morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000

// parse application/json
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'))
// panggil routes
const routes = require('./routes');
routes(app);

// daftar menu auth routes dari index
app.use('/auth', require('./midleware'));
//file index js itu untuk saat membuka halaman otomatis membaca index

app.listen(port, () => {
    console.log(`Template API Running on PORT - ${port}`);
});




