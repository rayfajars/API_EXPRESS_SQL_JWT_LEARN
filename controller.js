// ini template memulai API
'use strict';

var response = require('./res');
var connection = require('./connection');

exports.index = function(req,res){
    response.ok("Template API sudah berjalan (controller)",res)
}