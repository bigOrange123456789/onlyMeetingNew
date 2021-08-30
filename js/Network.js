class Network{
    constructor(){

    }
    myRequest(path,callback) {
        window.flagNumber++
        var ips=[
            "localhost"
            //"101.34.166.68",
            //"110.40.255.87",
            //"101.34.161.225",
            //"81.71.38.168"
        ]
        var ip=ips[Math.floor(Math.random()*ips.length)]
        var oReq = new XMLHttpRequest();
        oReq.open("POST", "http://"+ip+":8081", true);
        oReq.responseType = "arraybuffer";
        oReq.onload = ()=>{
            var data=oReq.response;//ArrayBuffer
            var imageType = oReq.getResponseHeader("Content-Type");
            var blob = new Blob([data], { type: imageType });//用于图片解析
            var unityArray=new Uint8Array(data)//用于glb文件解析
            callback(unityArray,blob)
        }//接收数据
        oReq.send(path);//发送请求
        console.log(ip,path)
    }
    getGlb(path,cb) {
        this.myRequest(path,unitArray=>{
            new THREE.GLTFLoader().parse(unitArray.buffer, './',glb=>{
                cb(glb)
            });
        })
    }
    getTexture(path,cb) {
        this.myRequest(path,(unityArray,blob)=>{
            var image = document.createElement('img')
            image.src =(window.URL || window.webkitURL).createObjectURL(blob);

            console.log(THREE.ImageUtils.loadTexture)
            //console.log(typeof ( THREE.ImageUtils.getDataURL(image) ))
            //console.log(THREE.ImageUtils.getDataURL(image))
            //console.log(THREE.ImageUtils)
            //THREE.ImageUtils.loadTexture('img/fly.png');

            var texture = new THREE.Texture();
            texture.image =image;
            texture.needsUpdate = true;
            //console.log(texture.needsUpdate)
            var time=1;
            function nextFrame(){
                if(time<=100){
                    if(time===100){
                        cb(texture,image)
                    }
                    time++;
                    requestAnimationFrame(nextFrame);
                }
            }//nextFrame()
            cb(texture)
            //setTimeout(()=>cb(texture),10000)
        })
    }
}
export {Network}
