function VideoManager() {
    this.div;
    this.video;
    this.videoTexture;
    this.finish;
}
VideoManager.prototype={
    init:function () {
        this.finish=false;
        if(this.div!==undefined)return;
        this.div=getDiv();
        this.video=getVideo();
        this.div.append(this.video);
        this.videoTexture=getVideoTexture(this.video);
        window.videoMaterial.map1=this.videoTexture;
        //window.videoMaterial.map=this.videoTexture;
        function getDiv(){
            return document.createElement('div');
        }
        function getVideo(){
            var oPanel=document.createElement('video');
            oPanel.style.cssText= 'loop;';
            oPanel.src="video.mp4";
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
    setMaterial0:function (mesh) {
        if(this.div===undefined)this.init();
        mesh.material=new THREE.MeshStandardMaterial();
        mesh.material.map=this.videoTexture;
        window.videoMaterial=mesh.material;
    },
    setPlay:function () {
        window.start=true;
        if(this.div===undefined)this.init();
        this.video.volume=0.7;
        //this.video.play();
        //this.video.pause();
        window.video=this.video;
    },
}
