function VideoManager() {
    this.div;
    this.video;
    this.videoTexture;
}
VideoManager.prototype={
    init:function () {
        if(this.div!==undefined)return;
        this.div=getDiv();
        this.video=getVideo();
        this.div.append(this.video);
        this.videoTexture=getVideoTexture(this.video);
        function getDiv(){
            var oPanel=document.createElement('div');
            oPanel.style.cssText=
                'display:none;'+
                //'width:300px;'+
                //'background:#01f;'+//背景颜色
                //'width:'+width+'px;height:'+height+'px;'+//面板大小
                //'border:1px solid #fff;'+//显示边框
                'margin:0px auto;'+//居于窗口中间
                'text-align:center;'+//内部文本居中
                'position:fixed;'+//到窗体的位置
                'left:'+(window.innerWidth/2-80)+'px;'+//到部件左边距离
                'top:'+10+'px;'; //到部件右边 距离
            'overflow:hidden;';//超出部分隐藏
            document.body.appendChild(oPanel);//document.body浏览器窗口
            return oPanel;
        }
        function getVideo(){
            var oPanel=document.createElement('video');
            oPanel.style.cssText=
                //controls="controls" loop
                'loop;'+
                //'width:300px;'+
                //'background:#01f;'+//背景颜色
                //'width:'+width+'px;height:'+height+'px;'+//面板大小
                //'border:1px solid #fff;'+//显示边框
                'margin:0px auto;'+//居于窗口中间
                'text-align:center;'+//内部文本居中
                'position:fixed;'+//到窗体的位置
                'left:'+(window.innerWidth/2-80)+'px;'+//到部件左边距离
                'top:'+10+'px;'; //到部件右边 距离
            'overflow:hidden;';//超出部分隐藏
            oPanel.src="video.mp4";
            oPanel.controls="controls";
            //document.body.appendChild(oPanel);//document.body浏览器窗口
            return oPanel;
        }
        function getVideoTexture(video){
            var texture=new THREE.VideoTexture(video);
            texture.flipY=false;
            texture.wrapS=texture.wrapT=THREE.ClampToEdgeWrapping;
            texture.minFilter=THREE.LinearFilter;
            texture.magFilter=THREE.LinearFilter;
            texture.format=THREE.RGBFormat;
            return texture;
        }
    },
    setMaterial:function (mesh) {
        if(this.div===undefined)this.init();
        mesh.material=new THREE.MeshStandardMaterial();
        mesh.material.map=this.videoTexture;
    },
    setPlay:function () {
        if(this.div===undefined)this.init();
        this.video.volume=0.7;
        this.video.play();
    },
}