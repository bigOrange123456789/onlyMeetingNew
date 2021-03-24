function RoomManager(myVideoManager0,camera){//myVideoManager_
    this.loader= new THREE.GLTFLoader();
    this.room=new THREE.Object3D();
    //this.room.visible=false;
    this.myVideoManager=myVideoManager0;
    this.mid=20;
    this.url="./myModel/room/";
    this.camera=camera;

    this.resourceManager;

    this.init();
}
RoomManager.prototype={
    init:function(){
        var scope=this;
        var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        loader.load(this.url+"resourceInfo.json", function(str){//dataTexture
            var resourceInfo=JSON.parse(str);
            scope.resourceManager=new ResourceManager(resourceInfo,scope.camera);

            scope.room.add(scope.resourceManager.testObj);
            //console.log(scope.resourceManager);
            setInterval(function () {
                //console.log(scope.resourceManager.getList());
            },2000)
        });
    },
    create1:function(){
        var scope=this;
        if(!this.resourceManager){
            requestAnimationFrame(function () {scope.create1();});
            return;
        }
        this.room.scale.set(10,10,10);
        this.myLoad_door('myModel/room/door.gltf');

        var mapsIndex=this.resourceManager.mapsIndex;
        var roomFileName="ConferenceRoom";
        for(var i=0;i<mapsIndex.length;i++)
                this.myLoad1('myModel/room/'+roomFileName+i+'.gltf',
                    mapsIndex[i]===1?'myModel/room/'+roomFileName+i+'.jpg':null
                );
    },
    create2:function(){
        var scope=this;
        if(!this.resourceManager){
            requestAnimationFrame(function () {scope.create2();});
            return;
        }
        this.room.scale.set(10,10,10);

        var mapsIndex=this.resourceManager.mapsIndex;
        var roomFileName="ConferenceRoom";
        function load(tex_url_index) {
            if (tex_url_index < mapsIndex.length) {
                if (mapsIndex[tex_url_index] === 0) load(tex_url_index + 1);
                else
                    scope.myLoad2(
                        'myModel/room/' + roomFileName + tex_url_index + '.jpg',
                        function () {
                            load(tex_url_index + 1)
                        }
                    );
            }
        }
        load(0);
    },
    myLoad1:function(url,mapUrl){
        var scope=this;
        this.loader.load(url, (gltf) => {
            var scene=gltf.scene;
            var mesh0=scene.children[0];
            console.log(mesh0)
            mesh0.mapUrl=mapUrl;
            //console.log(url+":"+gltf.scene.children[0].name);
            for(var i=0;i<gltf.scene.children.length;i++){
                if( gltf.scene.children[i].name==="室内-小显示器屏幕（非）"||
                    gltf.scene.children[i].name==="室内-大显示器屏幕（非）"){//室内-大显示器屏幕（非）
                    var screen=gltf.scene.children[i];
                    if(scope.myVideoManager.video)scope.myVideoManager.init();
                    scope.myVideoManager.setMaterial(screen);
                }
                //室内-电子显示屏（非）
            }
            scope.room.add(scene);
        })
    },
    myLoad2:function(mapUrl,finishFunction){
        var scope=this;
        var texture=THREE.ImageUtils.loadTexture( mapUrl,null,function () {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            scope.room.traverse(node => {
                if (node.mapUrl===mapUrl) {
                    node.material = new THREE.MeshBasicMaterial({
                        map: texture,//设置颜色贴图属性值
                    });
                }
            });
            if(finishFunction)finishFunction();
        });
    },
    myLoad_door:function(url){
        var scope=this;
        this.loader.load(url, (gltf) => {
            //console.log(gltf);
            var geometry0=gltf.scene.children[0].children[0].geometry;
            var geometry1=gltf.scene.children[0].children[1].geometry;
            var geometry2=gltf.scene.children[0].children[2].geometry;

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