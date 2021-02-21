function RoomManager(myVideoManager0){//myVideoManager_
    this.loader= new THREE.GLTFLoader();
    this.room=new THREE.Object3D();
    //this.room.visible=false;
    this.myVideoManager=myVideoManager0;
}
RoomManager.prototype={
    loadRoom:function(){
        this.room.scale.set(10,10,10);
        this.myLoad_door('myModel/room/door.gltf');
        this.myLoad('myModel/room/new24.gltf');//外墙
        this.myLoad('myModel/room/new33.gltf');//地面

        for(var i=0;i<90;i++)
            if(!fileError(i))
                this.myLoad('myModel/room/new'+i+'.gltf');
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
                    scope.myVideoManager.setMaterial(screen);
                }
                //室内-电子显示屏（非）
            }
            scope.room.add(obj);
        })
    },
    myLoad_door:function(url){
        var scope=this;
        this.loader.load(url, (gltf) => {
            //console.log(gltf);
            var geometry0=gltf.scene.children[0].children[0].geometry;
            var geometry1=gltf.scene.children[0].children[1].geometry;
            var geometry2=gltf.scene.children[0].children[2].geometry;
            //553828
            //var material0=new THREE.MeshBasicMaterial({color:0x37261c});//gltf.scene.children[0].children[0].material;
            //var material1=new THREE.MeshBasicMaterial({color:0xf3f3f3});material1.side=THREE.DoubleSide;//gltf.scene.children[0].children[1].material;
            //var material2=new THREE.MeshBasicMaterial({color:0xc5d8e6});//197 216 230//gltf.scene.children[0].children[2].material;
            var material0=gltf.scene.children[0].children[0].material;
            var material1=gltf.scene.children[0].children[1].material;
            var material2=gltf.scene.children[0].children[2].material;

            var mesh0=new THREE.InstancedMesh(geometry0,material0,4);
            var mesh1=new THREE.InstancedMesh(geometry1,material1,4);
            var mesh2=new THREE.InstancedMesh(geometry2,material2,4);

            var d0=new THREE.Object3D();
            d0.rotation.set(Math.PI/2,0,Math.PI/2);
            d0.position.set(-12.52, 2.741,3.290);
            d0.scale.set(-0.001,-0.001,-0.001);
            var d1=new THREE.Object3D();
            d1.rotation.set(Math.PI/2,Math.PI,3*Math.PI/2);
            d1.position.set(-12.5244207382, 2.7411997318,1.50942);
            d1.scale.set(-0.001,-0.001,-0.001);

            set(d0,[mesh0,mesh1,mesh2],0);
            //set(d1,[mesh0,mesh1,mesh2],0);

            var pre1=[
                1,0,0,0,
                0,-1,0,0,
                0,0,1,0,
                0,0,0,1
            ];
            var pre2=[
                1,0,0,0,
                0,1,0,0,
                0,0,-1,0,
                0,0,0,1
            ];
            var pre3=[
                1,0,0,0,
                0,-1,0,0,
                0,0,-1,0,
                0,0,0,1
            ];
            set(d0,[mesh0,mesh1,mesh2],1,pre1);
            set(d1,[mesh0,mesh1,mesh2],2,pre2);
            set(d1,[mesh0,mesh1,mesh2],3,pre3);


            //move();
            function move(){
                if(d0.rotation.z>0) {
                    d0.rotation.z-=0.02;
                    d1.rotation.z-=0.02;
                    set(d0, [mesh0,mesh1,mesh2], 0);
                    set(d0, [mesh0,mesh1,mesh2], 1,pre1);
                    set(d1, [mesh0,mesh1,mesh2], 2,pre2);
                    set(d1, [mesh0,mesh1,mesh2], 3,pre3);
                    requestAnimationFrame(move);
                }
            }
            var myInterval=setInterval(function () {
                if(d0.rotation.z>0) {
                    d0.rotation.z-=0.02;
                    d1.rotation.z-=0.02;
                    set(d0, [mesh0,mesh1,mesh2], 0);
                    set(d0, [mesh0,mesh1,mesh2], 1,pre1);
                    set(d1, [mesh0,mesh1,mesh2], 2,pre2);
                    set(d1, [mesh0,mesh1,mesh2], 3,pre3);
                }else clearInterval(myInterval);
            },10);


            function set(du,m,i,pre) {
                if(typeof (pre)==="undefined"){
                    if(typeof (m.length)==="undefined"){
                        du.updateMatrix();
                        m.setMatrixAt(i, du.matrix);
                        m.instanceMatrix.needsUpdate=true;
                    }else
                        for(j=0;j<m.length;j++)
                            set(du,m[j],i);
                }else{
                    if(typeof (m.length)==="undefined"){
                        var m1 = new THREE.Matrix4();
                        m1.set(
                            pre[0],pre[1],pre[2],pre[3],
                            pre[4],pre[5],pre[6],pre[7],
                            pre[8],pre[9],pre[10],pre[11],
                            pre[12],pre[13],pre[14],pre[15]
                        );
                        du.updateMatrix();

                        m.setMatrixAt(i, du.matrix.multiply(m1));
                        m.instanceMatrix.needsUpdate=true;
                    }else
                        for(j=0;j<m.length;j++)
                            set(du,m[j],i,pre);
                }

            }
            function set1(du,m,i) {
                if(typeof (m.length)==="undefined"){
                var m1 = new THREE.Matrix4();
                m1.set(
                    1,0,0,0,
                    0,-1,0,0,
                    0,0,1,0,
                    0,0,0,1);
                du.updateMatrix();

                    m.setMatrixAt(i, du.matrix.multiply(m1));
                    m.instanceMatrix.needsUpdate=true;
                }else
                    for(j=0;j<m.length;j++)
                        set1(du,m[j],i);
            }

            scope.room.add(mesh0);
            scope.room.add(mesh1);
            scope.room.add(mesh2);
        })
    },
}