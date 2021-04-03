function ResourceLoader(url,camera,unitProcess) {
    this.url;//资源路径
    this.camera;
    this.cameraPre;
    this.unitProcess;

    this.object;
    this.loader;
    this.resourceList;

    this.init(url,camera,unitProcess);
}
ResourceLoader.prototype={
    init:function (url,camera,unitProcess) {
        this.url=url;
        this.camera=camera;
        this.unitProcess=unitProcess;

        this.cameraPre={};
        this.object=new THREE.Object3D();
        this.loader= new THREE.GLTFLoader();
        var scope=this;
        var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        loader.load(this.url+"resourceInfo.json", function(str){//dataTexture
            var resourceInfo=JSON.parse(str);
            scope.resourceList=new ResourceList(resourceInfo,scope.camera);
            scope.loadGeometry();
            scope.loadMap();
        });
    },
    updateCameraPre:function(){
        this.cameraPre.position=this.camera.position.clone();
        this.cameraPre.rotation=this.camera.rotation.clone();
    },
    cameraHasChanged:function(){
        return this.camera.position.x !== this.cameraPre.position.x ||
            this.camera.position.y !== this.cameraPre.position.y ||
            this.camera.position.z !== this.cameraPre.position.z ||
            this.camera.rotation.x !== this.cameraPre.rotation.x ||
            this.camera.rotation.y !== this.cameraPre.rotation.y ||
            this.camera.rotation.z !== this.cameraPre.rotation.z;
    },
    loadGeometry:function(){
        var scope=this;
        load(scope.resourceList.getOneModelFileName());
        function load(fileName) {
            if(!fileName){//如果当前没有需要加载的几何文件
                scope.updateCameraPre();
                var myInterval=setInterval(function () {
                    if(scope.cameraHasChanged()){//如果相机位置和角度发生了变化
                        load(scope.resourceList.getOneModelFileName());
                        clearInterval(myInterval);
                    }
                },100);
            }else{
                scope.loader.load(scope.url+fileName, (gltf) => {
                    var scene=gltf.scene;
                    var mesh0=scene.children[0];
                    mesh0.nameFlag=fileName;
                    scope.unitProcess(gltf);
                    scope.object.add(scene);
                    load(scope.resourceList.getOneModelFileName());
                });
            }
        }
    },
    loadMap:function(){
        var scope=this;
        load();
        function load() {
            var fileName=scope.resourceList.getOneMapFileName();
            if(!fileName){//如果当前没有需要加载的贴图文件
                scope.updateCameraPre();
                var myInterval=setInterval(function () {
                    if(scope.cameraHasChanged()){//如果相机位置和角度发生了变化
                        load(scope.resourceList.getOneMapFileName());
                        clearInterval(myInterval);
                    }
                },100);
            }else{
                var myMap=scope.resourceList.getMapByName(fileName);
                var texture=THREE.ImageUtils.loadTexture( scope.url+fileName,null,function () {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    scope.object.traverse(node => {
                        if (node.nameFlag===myMap.modelName) {
                            node.material = new THREE.MeshBasicMaterial({
                                map: texture,//设置颜色贴图属性值
                            });
                        }
                    });
                    load();
                });
            }
        }

    },
}
//下面这个对象主要负责资源列表的生成和管理
function ResourceList(resourceInfo,camera) {
    this.maps;//说明信息
    this.models;//说明信息
    this.mapsIndex;
    this.camera;
    this.frustum;
    this.testObj=new THREE.Object3D();
    //
    this.init(resourceInfo,camera);
    //每接收一次数据进行一次计算
}
ResourceList.prototype={
    init:function (resourceInfo,camera) {
        this.camera=camera;
        this.maps=resourceInfo.maps;
        //fileName;modelName;
        for(i=0;i<this.maps.length;i++){
            this.maps[i].finishLoad=false;
            this.maps[i].modelFinishLoad=false;
        }
        this.models=resourceInfo.models;
        //fileName;interest;boundingSphere{x,y,z,r};MapName;spaceVolume;
        for(i=0;i<this.models.length;i++){
            this.models[i].finishLoad=false;
            this.models[i].inView=false;
        }

        this.mapsIndex=resourceInfo.mapsIndex;
        //开始测试
        //this.testObjMesh();
        //完成测试
    },
    testObjMesh:function(){
        for(i=0;i<this.models.length;i++){
            var r=this.models[i].boundingSphere.r;
            var geometry= new THREE.SphereGeometry(r, 60, 60);//(r,60,16);
            var material = new THREE.MeshNormalMaterial();
            var mesh= new THREE.Mesh(geometry, material);
            mesh.position.set(
                this.models[i].boundingSphere.x,
                this.models[i].boundingSphere.y,
                this.models[i].boundingSphere.z
            );
            this.testObj.add(mesh);
        }
    },
    getOneModelFileName:function(){
        var list=this.getModelList();
        if(list.length===0)return null;
        var _model= {interest:-1};//记录兴趣度最大的资源


        for(i=0;i<list.length;i++){
            var model=this.getModelByName(list[i]);
            if(model.interest>_model.interest){
                _model=model;
            }
        }
        _model.finishLoad=true;
        return _model.fileName;
    },
    getModelList:function(){//返回在视锥内且未被加载的资源列表
        this.update();//计算每个模型的inView
        var list=[];
        for(i=0;i<this.models.length;i++){
            if(this.models[i].inView&&!this.models[i].finishLoad)
                list.push(this.models[i].fileName);
        }
        return list;
    },
    getOneMapFileName:function(){
        var list=this.getMapList();
        if(list.length===0)return null;
        var _map={interest:-1};//记录兴趣度最大的资源
        for(i=0;i<list.length;i++){
            var map=this.getMapByName(list[i]);
            if(map.interest>_map.interest){
                _map=map;
            }
        }
        _map.finishLoad=true;
        return _map.fileName;
    },
    getMapList:function(){
        //对应模型已被加载
        // 且对应模型现在视锥内
        // 且贴图本身未被加载的贴图资源列表
        this.update();//计算每个模型的inView
        var list=[];
        for(let i=0;i<this.maps.length;i++){
            var model=this.getModelByName(this.maps[i].modelName);
            if(model.finishLoad
                &&model.inView
                &&!this.maps[i].finishLoad)
                list.push(this.maps[i].fileName);
        }
        return list;
    },
    update:function(){//判断哪些资源在视锥内
        this.computeFrustumFromCamera();
        for(i=0;i<this.models.length;i++){
            this.models[i].inView= this.intersectsSphere(
                this.models[i].boundingSphere.x,
                this.models[i].boundingSphere.y,
                this.models[i].boundingSphere.z,
                this.models[i].boundingSphere.r
            )
        }
    },
    computeFrustumFromCamera:function(){//求视锥体
        var camera=this.camera;
        var frustum = new THREE.Frustum();
        //frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix,camera.matrixWorldInverse ) );

        const projScreenMatrix = new THREE.Matrix4();
        projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
        frustum.setFromProjectionMatrix(projScreenMatrix);
        this.frustum=frustum;
    },
    intersectsSphere:function(x,y,z,radius ) {
        var center=new THREE.Vector3(x,y,z)
        const planes = this.frustum.planes;
        //const center = sphere.center;
        const negRadius = - radius;
        for ( let i = 0; i < 6; i ++ ) {
            const distance = planes[ i ].distanceToPoint( center );//平面到点的距离，
            if ( distance < negRadius ) {//内正外负
                return false;//不相交
            }
        }
        //console.log(center);
        return true;//相交
    },
    getMapByName:function (name) {
        for(i=0;i<this.maps.length;i++){
            if(this.maps[i].fileName===name)
                return this.maps[i];
        }
    },
    getModelByName:function (name) {
        for(i=0;i<this.models.length;i++){
            if(this.models[i].fileName===name)
                return this.models[i];
        }
    },
}
