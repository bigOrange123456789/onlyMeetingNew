const express = require('express');
var app = express();
app.use(express.static(__dirname));//开放给客户端的一些地址

var config = {ip:"0.0.0.0",port:8080}//require('./config.json');
const port = config.port;
require('http').createServer(app).listen(port,"0.0.0.0",() => {
    console.log("success!");
});

