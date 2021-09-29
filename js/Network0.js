export{Network}
class Network{
    constructor(){
        this.testFlag=false;
        if(this.testFlag)this.test={}
        this.ips=[
            "100.67.7.193"//"101.34.166.68",
            //"101.34.166.68",
            //"110.40.255.87",
            //"101.34.161.225",
            //"81.71.38.168"
        ]
        this.count= {}//记录每一个地址承担请求的个数
        window.countFinish=[];//已加载资源的总个数
        for(var i=0;i<this.ips.length;i++)
            this.count[this.ips[i]]=0
    }
    getIP(){
        return this.ips[Math.floor(Math.random()*this.ips.length)]
    }
    myRequest(path,callback) {
        var scope=this;
        if(this.testFlag)var time0= performance.now()
        var ip=this.getIP()
        this.count[ip]++

        var oReq = new XMLHttpRequest();
        oReq.open("POST", "http://"+ip+":8081", true);
        oReq.responseType = "arraybuffer";
        oReq.onload = ()=>{
            this.count[ip]--
            var data=oReq.response;//ArrayBuffer
            var imageType = oReq.getResponseHeader("Content-Type");
            var blob = new Blob([data], { type: imageType });//用于图片解析
            var unityArray=new Uint8Array(data)//用于glb文件解析
            callback(unityArray,blob)
            if(this.testFlag){
                this.send({
                    path:path,
                    ip:ip,
                    time0:time0,
                    time1:performance.now()
                },str=>console.log(str))
                window.countFinish.push(0)
                console.log("window.countFinish",window.countFinish.length)
                if(window.countFinish.length>=42){
                    alert("finish!",window.countFinish.length)
                }
            }
        }//接收数据
        oReq.onerror=(e)=>{
            console.log(e,path)//异常处理
        }
        oReq.send(path);//发送请求
        console.log(ip,path)
    }
    getGlb(path,cb) {
        this.myRequest(path,unitArray=>{
            new THREE.GLTFLoader().parse(unitArray.buffer, './',glb=>
                cb(glb)
            );
        })
    }
    getTexture(path,cb) {
        this.myRequest(path,(unityArray,blob)=>{
            var image = document.createElement('img')
            image.src =(window.URL || window.webkitURL).createObjectURL(blob);
            image.onload=function(){
                var texture = new THREE.Texture();
                texture.image =image;
                texture.needsUpdate = true;
                cb(texture)
            }
        })
    }
    send(json0,cb) {
        var oReq = new XMLHttpRequest();
        oReq.open("POST", "http://localhost:8888", true);
        oReq.responseType = "arraybuffer";
        oReq.onload = function () {//接收数据
            var unitArray=new Uint8Array(oReq.response) //网络传输基于unit8Array
            //解析为文本
            var str=String.fromCharCode.apply(null,unitArray)
            cb(str)
        };
        oReq.send(JSON.stringify(json0));//发送请求
    }
}

