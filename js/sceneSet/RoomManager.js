function RoomManager(){//myVideoManager_
    this.loader= new THREE.GLTFLoader();
    this.room=new THREE.Object3D();
}
RoomManager.prototype={
    loadRoom:function(){
        this.room.scale.set(10,10,10);
        this.myLoad('myModel/room/new24.gltf');//外墙
        this.myLoad('myModel/room/new33.gltf');//地面

        for(var i=0;i<90;i++)
            if(!fileError(i))
                this.myLoad('myModel/room/new'+i+'.gltf');
        this.myLoad_door('myModel/room/door.gltf');
        function fileError(k){
            var arr=[//以下两个数组记录需要特殊处理的模型资源路径
                33,24,//提前加载的部件
                0,21,37
            ]
            var arrRange=[
                41,84
            ];
            for(var i=0;i<arr.length;i++)
                if(arr[i]===k)return true;
            for(i=0;i<arrRange.length/2;i++)
                if(arrRange[2*i]<=k&&k<=arrRange[2*i+1])return true;
            return false;
        }
    },
    myLoad:function(url){
        var scope=this;
        this.loader.load(url, (gltf) => {
            if(url==="myModel/room/new24.gltf"){//外墙
                var mesh=gltf.scene.children[0];
                mesh.material=new THREE.MeshBasicMaterial({color:0xf0f0c8});
                var myText0= THREE.ImageUtils.loadTexture("myModel/room/new24.jpg",null,function () {
                    myText0.wrapS = THREE.RepeatWrapping;
                    myText0.wrapT = THREE.RepeatWrapping;
                    myText0.repeat.set(2,2);
                    mesh.material = new THREE.MeshBasicMaterial({
                        map: myText0,//设置颜色贴图属性值
                    });
                });
            }else if(url==="myModel/room/new33.gltf"){//地面
                var mesh2=gltf.scene.children[0];
                mesh2.material=new THREE.MeshBasicMaterial({color:0x4c1c18});//76 28 24
                var myText2= THREE.ImageUtils.loadTexture("myModel/room/new33.jpg",null,function () {
                    myText2.flipY=false;
                    myText2.wrapS = THREE.RepeatWrapping;
                    myText2.wrapT = THREE.RepeatWrapping;
                    myText2.needsUpdate = true;
                    mesh2.material = new THREE.MeshBasicMaterial({
                        map: myText2,//设置颜色贴图属性值
                    });
                });
            }
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
    },
    myLoad_door:function(url){
        var scope=this;
        this.loader.load(url, (gltf) => {
            var obj=gltf.scene;
            var door1,door2;
            for(var i=0;i<gltf.scene.children.length;i++){
                if(gltf.scene.children[i].name==="室内-可动门01")door1=gltf.scene.children[i];
                else if(gltf.scene.children[i].name==="室内-可动门02")door2=gltf.scene.children[i];
            }
            scope.room.add(obj);
            var z=Math.PI/2;
            function test(){
                if(door1.rotation.z>0){
                    z-=0.02;
                    door1.rotation.z=z;
                    door2.rotation.z+=0.02;//-1*gltf.scene.children[30].rotation.z;
                }
                requestAnimationFrame(test);
            }
            test();
            //timeoutId = setTimeout(function () {clearTimeout(timeoutId);}, 500);
        })
    },
}