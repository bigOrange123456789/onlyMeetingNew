const express = require('express');//Express是目前最流行的基于Node.js的Web开发框架
const app = express();
app.listen(8080);
console.log("localhost:8080");

app.use('/', express.static('../'));
app.get('/communication', function (req, res) {
    var fs = require('fs');
    fs.writeFile('data.txt' ,req.query.data, function(){});
    res.send("success");
});