function RoomManager(){//myVideoManager_
    var scope=this;
    //this.myVideoManager=myVideoManager_;
    this.loader= new THREE.GLTFLoader();
    this.room=new THREE.Object3D();
    this.myLoad=function(url){
        var scope=this;
        //var door1=new THREE.
        this.loader.load(url, (gltf) => {
            console.log(gltf);
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
    this.myLoad2=function(url){
        this.loader.load(url, (gltf) => {
            var obj=gltf.scene;
            //console.log(url+":"+gltf.scene.children[0].name);
            for(var i=0;i<gltf.scene.children.length;i++){
                if( gltf.scene.children[i].name==="室内-小显示器屏幕（非）"||
                    gltf.scene.children[i].name==="室内-大显示器屏幕（非）"){//室内-大显示器屏幕（非）
                    var screen=gltf.scene.children[i];
                    myVideoManager.setMaterial(screen);
                }
                //室内-电子显示屏（非）
            }
            scope.room.add(obj);
        })
    }
    this.myLoad_door=function(url){
        this.loader.load(url, (gltf) => {
            var obj=gltf.scene;
            //console.log(url);
            //alert(url+":"+gltf.scene.children[0].name);
            var door1,door2;
            //console.log(gltf)
            for(var i=0;i<gltf.scene.children.length;i++){
                if(gltf.scene.children[i].name==="室内-可动门01")door1=gltf.scene.children[i];
                else if(gltf.scene.children[i].name==="室内-可动门02")door2=gltf.scene.children[i];
            }
            scope.room.add(obj);
            var z=Math.PI/2;
            function test(){
                //console.log(door1.rotation.z,door2.rotation.y)
                if(door1.rotation.z>0){
                    z-=0.01;
                    door1.rotation.z=z;
                    door2.rotation.z+=0.01;//-1*gltf.scene.children[30].rotation.z;
                }
                requestAnimationFrame(test);
            }test();/**/
        })
    }
    this.loadRoom=function(){
        this.room.scale.set(10,10,10);
        /*var urls=[];
        //urls.push('myModel/room/component/0010.glb');
        for(var i=1;i<=9;i++)
             urls.push('myModel/room/component/00'+i+'.glb');
        urls.push('myModel/room/room.glb');
        for(var i=0;i<urls.length;i++)this.myLoad(urls[i]);*/

        for(var i=0;i<90;i++)


        //for(var i=60;i<90;i++)
        //for(var i=80;i<85;i++)
        //for(var i=45;i<50;i++)
        //i=46;
        if(!fileError(i))
        this.myLoad2('myModel/room/new'+i+'.gltf');
        this.myLoad_door('myModel/room/door.glb');
        //this.myLoad3('myModel/room/door.glb');
        //var test=new THREE.Box3();
        //console.log(test);
        //var test2=new THREE.Sphere();
        function fileError(k){
            var arr=[
                0,37
            ];
            var arrRange=[
                41,84
            ];
            for(var i=0;i<arr.length;i++)
                if(arr[i]===k)return true;
            for(var i=0;i<arrRange.length/2;i++)
                if(arrRange[2*i]<=k&&k<=arrRange[2*i+1])return true;
            return false;
        }
    }
}