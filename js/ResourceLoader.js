export { ResourceLoader };
class ResourceLoader{
    url;//资源路径
    camera;
    cameraPre;
    unitProcess;

    NumberWaitMaps;//等待加载的贴图个数

    object;
    loader;//模型加载器
    resourceList;
    test=false;//true;//
    constructor(url,camera,unitProcess){
        this.NumberWaitMaps=0;//等待加载的贴图个数
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

            scope.resourceList=new ResourceList();
            if(scope.test){
                scope.resourceList.testObj=new THREE.Object3D();
                scope.object.add(scope.resourceList.testObj);
            }
            scope.resourceList.init(resourceInfo,scope.camera);

            scope.#loadGeometry();
            scope.#loadMap();
        });
    }
    #loadGeometry=function(){
        var scope=this;
        load();
        function load() {
            var fileName=scope.resourceList.getOneModelFileName();
            if(!fileName){//如果当前没有需要加载的几何文件
                scope.#updateCameraPre();
                var myInterval=setInterval(function () {
                    if(scope.#cameraHasChanged()){//如果相机位置和角度发生了变化
                        load();
                        clearInterval(myInterval);
                    }
                },100);
            }else{
                scope.loader.load(scope.url+fileName, (gltf) => {
                    if(scope.resourceList.getModelByName(fileName)!=="")
                        scope.NumberWaitMaps++;//如果这个几何数据需要加载对应的贴图资源
                    var mesh0=gltf.scene.children[0];
                    mesh0.nameFlag=fileName;
                    scope.unitProcess(gltf);
                    scope.object.add(mesh0);
                    load();
                });
            }
        }
    }
    #loadMap=function(){
        var scope=this;
        load();
        function load() {
            var fileName=scope.resourceList.getOneMapFileName();
            if(!fileName){//如果当前没有需要加载的贴图文件
                var myInterval=setInterval(function () {
                    if(scope.NumberWaitMaps){//如果相机位置和角度发生了变化
                        load();
                        clearInterval(myInterval);
                    }
                },100);
            }else{
                var myMap=scope.resourceList.getMapByName(fileName);
                new THREE.TextureLoader().load(
                    scope.url+fileName,// resource URL
                    function ( texture ) {// onLoad callback
                        scope.NumberWaitMaps--;//加载了一个贴图资源
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        var myInterval2=setInterval(function () {
                            var mesh0;
                            for(var i=0;i<scope.object.children.length;i++){
                                if (scope.object.children[i].nameFlag===myMap.modelName)
                                    mesh0=scope.object.children[i];
                            }
                            if(mesh0){
                                mesh0.material = new THREE.MeshBasicMaterial({map: texture});
                                clearInterval(myInterval2);
                            }
                        },100)
                        load();
                    }
                );
            }
        }

    }
    #updateCameraPre=function(){
        this.cameraPre.position=this.camera.position.clone();
        this.cameraPre.rotation=this.camera.rotation.clone();
    }
    #cameraHasChanged=function(){
        return this.camera.position.x !== this.cameraPre.position.x ||
            this.camera.position.y !== this.cameraPre.position.y ||
            this.camera.position.z !== this.cameraPre.position.z ||
            this.camera.rotation.x !== this.cameraPre.rotation.x ||
            this.camera.rotation.y !== this.cameraPre.rotation.y ||
            this.camera.rotation.z !== this.cameraPre.rotation.z;
    }
}

class ResourceList{//这个对象主要负责资源列表的生成和管理
    maps;//所有贴图的说明信息
    models;//所有模型几何的说明信息
    mapsIndex;
    camera;
    frustum;

    testObj;//=new THREE.Object3D();
    //this.init(resourceInfo,camera);
    //每接收一次数据进行一次计算
}

ResourceList.prototype.init=function (resourceInfo,camera) {
        window.l=this;
        this.camera=camera;
        this.maps=resourceInfo.maps;
        //fileName;modelName;
        for(var i=0;i<this.maps.length;i++){
            this.maps[i].finishLoad=false;
        }
        this.models=resourceInfo.models;
        //fileName;interest;boundingSphere{x,y,z,r};MapName;spaceVolume;
        for(var i=0;i<this.models.length;i++){
            this.models[i].finishLoad=false;
            this.models[i].inView=false;
        }

        this.mapsIndex=resourceInfo.mapsIndex;

        if(this.testObj){//开始测试
            this.testObjMesh();

        }//完成测试
    }
ResourceList.prototype.testObjMesh=function(){
        for(var i=0;i<this.models.length;i++){
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
    }
ResourceList.prototype.getOneModelFileName=function(){
        var list=this.getModelList();
        if(list.length===0)return null;
        var _model= {interest:-1};//记录兴趣度最大的资源


        for(var i=0;i<list.length;i++){
            var model=this.getModelByName(list[i]);
            if(model.interest>_model.interest){
                _model=model;
            }
        }
        _model.finishLoad=true;
        return _model.fileName;
    }
ResourceList.prototype.getModelList=function(){//返回在视锥内且未被加载的资源列表
        this.update();//计算每个模型的inView
        var list=[];
        for(var i=0;i<this.models.length;i++){
            if(this.models[i].inView&&!this.models[i].finishLoad)
                list.push(this.models[i].fileName);
        }
        return list;
    }
ResourceList.prototype.getOneMapFileName=function(){
        var list=this.getMapList();
        if(list.length===0)return null;
        var _map={interest:-1};//记录兴趣度最大的资源
        for(var i=0;i<list.length;i++){
            var map=this.getMapByName(list[i]);
            if(map.interest>_map.interest){
                _map=map;
            }
        }
        _map.finishLoad=true;
        return _map.fileName;
    }
ResourceList.prototype.getMapList=function(){
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
    }
ResourceList.prototype.update=function(){//判断哪些资源在视锥内
        this.computeFrustumFromCamera();
        for(var i=0;i<this.models.length;i++){
            this.models[i].inView= this.intersectsSphere(
                this.models[i].boundingSphere.x,
                this.models[i].boundingSphere.y,
                this.models[i].boundingSphere.z,
                this.models[i].boundingSphere.r
            )
        }
    }
ResourceList.prototype.computeFrustumFromCamera=function(){//求视锥体
        var camera=this.camera;
        var frustum = new THREE.Frustum();
        //frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix,camera.matrixWorldInverse ) );

        const projScreenMatrix = new THREE.Matrix4();
        projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
        frustum.setFromProjectionMatrix(projScreenMatrix);
        this.frustum=frustum;
    }
ResourceList.prototype.intersectsSphere=function(x,y,z,radius ) {
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
        return true;//相交
    }
ResourceList.prototype.getMapByName=function (name) {
        for(var i=0;i<this.maps.length;i++){
            if(this.maps[i].fileName===name)
                return this.maps[i];
        }
    }
ResourceList.prototype.getModelByName=function (name) {
        for(var i=0;i<this.models.length;i++){
            if(this.models[i].fileName===name)
                return this.models[i];
        }
    }