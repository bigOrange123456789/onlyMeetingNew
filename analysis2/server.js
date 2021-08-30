var json0=[]
require('http').createServer(function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    request.on('data', function (data) {//接受请求
        json0.push(JSON.parse(data));
        saveJson("data.json",json0)
    });
    request.on('end', function () {//返回数据
        //response.write(buffer);//发送文件
        response.write("success");//发送字符串
        response.end();
    });
}).listen(8888, '0.0.0.0', function () {
    console.log("listening to client");
});
function saveJson(name,data) {
    require('fs').writeFile(name, JSON.stringify(data , null, "\t") , function(){});
}
