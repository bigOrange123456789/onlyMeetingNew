var fs      = require('fs');
var path    = require('path');
var archiver  = require('archiver');

let files = fs.readdirSync("./");
console.log(files.length)
    files.forEach(function (item) {
        if(item.split(".")[1]==="jpg"){
	zip(item, item+".zip", (s)=>console.log(s))
	}
    });


function zip(url, name, cb){
    // init
    var output = fs.createWriteStream(name);//创建数据流
    output.on('close',()=> cb('finish'));//创建完成
    // zip
    var archive = archiver('zip', {zlib: { level: 9 }});//设置压缩格式和等级
    archive.on('error', err=> cb(err));
    archive.pipe(output);
    if(fs.statSync(url).isFile()) archive.file(url, {name : path.basename(url)});//文件
    else archive.directory(url, url);//文件夹//archive.directory(url, false);
    archive.finalize();
}