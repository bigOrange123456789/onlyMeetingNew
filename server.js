require('http').createServer(function (request, response) {
    var filePath;
    response.setHeader("Access-Control-Allow-Origin", "*");
    request.on('data',data=>{filePath=data});//接受请求
    //response.setHeader("Access-Control-Allow-Origin", "*");
    request.on('data', function (data) {//接受请求
        filePath=String.fromCharCode.apply(null,data)
    });
    request.on('end', function () {//返回数据
        require("fs").readFile(filePath, function (err, buffer) {//读取文件//将模型数据读取到buffer中，buffer应该是字符串类型的数据
            response.write(buffer);
            response.end();
        });
    });
}).listen(8081, '0.0.0.0', function () {
    console.log("listening to client:8081");
});
