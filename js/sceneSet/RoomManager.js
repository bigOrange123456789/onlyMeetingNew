function RoomManager(){
    this.loader= new THREE.GLTFLoader();
    this.room=new THREE.Object3D();
    this.myLoad=function(url){
        var scope=this;
        //var door1=new THREE.
        this.loader.load(url, (gltf) => {
            var obj=gltf.scene.children[0];
            obj.traverse(node=>{
                if(node.material){
                    if(node.material.map!=null) {
                        var nowMap = node.material.map;
                        nowMap.wrapS = THREE.RepeatWrapping;
                        nowMap.wrapT = THREE.RepeatWrapping;
                        node.material.lightMapIntensity=0.1;
                        nowMap.needsUpdate = true;
                    }
                }
            })
            if(url==="myModel/room/component/009.glb"){
                obj.position.set(-1,0,33);
                obj.scale.set(100,100,377);
            }
            scope.room.add(obj);
        })
    }
    this.loadRoom=function(){
        this.room.scale.set(10,10,10);
        var urls=[];
        //urls.push('myModel/room/component/0010.glb');
        for(var i=1;i<=9;i++)
             ;//urls.push('myModel/room/component/00'+i+'.glb');
        //urls.push('myModel/room/room.glb');
        for(var i=0;i<urls.length;i++)this.myLoad(urls[i]);
        console.log(1122);
        console.log(this.room);
        var test=new THREE.Box3();
        console.log(test);
        var test2=new THREE.Sphere();
    }
}