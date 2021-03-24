function ResourceManager(resourceInfo,camera) {
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
ResourceManager.prototype={
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
        var list=this.getList();
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
    getList:function(){//返回在视锥内且未被加载的资源列表
        this.update();//计算每个模型的inView
        var list=[];
        for(i=0;i<this.models.length;i++){
            if(this.models[i].inView&&!this.models[i].finishLoad)
                list.push(this.models[i].fileName);
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
