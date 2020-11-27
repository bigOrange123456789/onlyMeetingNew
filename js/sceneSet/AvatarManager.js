function AvatarManager(mySeatManager,camera){//camera用于LOD
    var scope=this;
    this.obj=new THREE.Object3D();
    this.avatar1=new THREE.Object3D;
    this.positions=mySeatManager.positions;
    this.camera=camera;
    this.positionsType=[];
    this.init=function () {
        this.obj.name="AvatarManager_obj";
        for(var i=0;i<this.positions.length;i++)
            this.positionsType.push(Math.floor(Math.random()*4)+1);//1-4
        this.loadAvatar();
    }
    this.loadAvatar=function () {
        this.host();
        this.loadGuest1();
        this.loadGuest2();
        this.loadAvatarTool1('myModel/avatar/Man01_3.glb');
        this.loadAvatarTool2('myModel/avatar/Female01_2.glb');
        this.loadAvatarTool3('myModel/avatar/Ganpa01_2.glb');
        this.loadAvatarTool4('myModel/avatar/Granny01_2.glb');/**/
    }
    this.loadAvatarTool4=function(url){
        var type=4;
        var loader= new THREE.GLTFLoader();
        loader.load(url, (glb) => {
            console.log(glb);
            var mesh0=glb.scene.children[0];//console.log(mesh0);
            var geometry=mesh0.geometry;
            var material=mesh0.material;
            var l=0;for(var i=0;i<scope.positionsType.length;i++)
                if(scope.positionsType[i]===type)l++;
            var mesh=new THREE.InstancedMesh(geometry,material,l);//l

            var dummy=new THREE.Object3D();
            var j=0;
            for(var i=0;i<scope.positions.length;i++)
                if(scope.positionsType[i]===type){
                    dummy.rotation.set(Math.PI/2,0,-Math.PI/2);
                    dummy.position.set(
                        scope.positions[i][0]+2.2,
                        scope.positions[i][1]+3,
                        scope.positions[i][2]);
                    dummy.scale.set(5,5,5);//x-y-z
                    //dummy.rotation.set(0,Math.PI/2,Math.PI/2);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(j, dummy.matrix);
                    j++;
                }
            scope.avatar1.add(mesh);
        });
    }
    this.loadAvatarTool3=function(url){
        var type=3;
        var loader= new THREE.GLTFLoader();
        loader.load(url, (glb) => {
            console.log(glb);
            var mesh0=glb.scene.children[0];//console.log(mesh0);
            var geometry=mesh0.geometry;
            var material=mesh0.material;
            var l=0;for(var i=0;i<scope.positionsType.length;i++)
                if(scope.positionsType[i]===type)l++;
            var mesh=new THREE.InstancedMesh(geometry,material,l);//l

            var dummy=new THREE.Object3D();
            var j=0;
            for(var i=0;i<scope.positions.length;i++)
                if(scope.positionsType[i]===type){
                    dummy.rotation.set(Math.PI/2,0,-Math.PI/2);
                    dummy.position.set(
                        scope.positions[i][0]+2.2,
                        scope.positions[i][1]+3,
                        scope.positions[i][2]);
                    dummy.scale.set(5,5,5);//x-y-z
                    //dummy.rotation.set(0,Math.PI/2,Math.PI/2);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(j, dummy.matrix);
                    j++;
                }
            scope.avatar1.add(mesh);
        });
    }
    this.loadAvatarTool2=function(url){
        var type=2;
        var loader= new THREE.GLTFLoader();
        loader.load(url, (glb) => {
            console.log(glb);
            var mesh0=glb.scene.children[0];//console.log(mesh0);
            var geometry=mesh0.geometry;
            var material=mesh0.material;
            var l=0;for(var i=0;i<scope.positionsType.length;i++)
                if(scope.positionsType[i]===type)l++;
            var mesh=new THREE.InstancedMesh(geometry,material,l);//l

            var dummy=new THREE.Object3D();
            var j=0;
            for(var i=0;i<scope.positions.length;i++)
                if(scope.positionsType[i]===type){
                    dummy.rotation.set(Math.PI/2,0,-Math.PI/2);
                    dummy.position.set(
                        scope.positions[i][0]+2.2,
                        scope.positions[i][1]+3,
                        scope.positions[i][2]);
                    dummy.scale.set(5,5,5);//x-y-z
                    //dummy.rotation.set(0,Math.PI/2,Math.PI/2);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(j, dummy.matrix);
                    j++;
                }
            scope.avatar1.add(mesh);
        });
    }
    this.loadAvatarTool1=function(url){
        var type=1;
        var loader= new THREE.GLTFLoader();
        loader.load(url, (glb) => {
            var mesh0=glb.scenes[0].children[2];//console.log(mesh0);
            var geometry=mesh0.geometry;
            var material=mesh0.material;
            var l=0;for(var i=0;i<scope.positionsType.length;i++)
                if(scope.positionsType[i]===type)l++;
            var mesh=new THREE.InstancedMesh(geometry,material,l);//l

            var dummy=new THREE.Object3D();
            var j=0;
            for(var i=0;i<scope.positions.length;i++)
            if(scope.positionsType[i]===type){
                dummy.position.set(
                    scope.positions[i][0]+2.2,
                    scope.positions[i][1]+3,
                    scope.positions[i][2]);
                dummy.scale.set(5,5,5);
                dummy.rotation.set(0,Math.PI/2,0);
                dummy.updateMatrix();
                mesh.setMatrixAt(j, dummy.matrix);
                j++;
            }
            scope.avatar1.add(mesh);
        });
    }
    this.host=function () {
        var loader= new THREE.GLTFLoader();
        loader.load("myModel/avatar/host.glb", (glb) => {
            /*console.log(glb);
            for(var i=0;i<glb.scene.children.length;i++)
                scope.obj.add(glb.scene.children[i]);//scenes*/
            glb.scenes[0].position.set(198,9,-65);
            glb.scenes[0].rotation.set(0,-Math.PI/2,0);
            glb.scenes[0].scale.set(10,10,10);
            scope.obj.add(glb.scenes[0]);
            //glb.scene.children
        });
        //new ParamMeasure(this.obj,0);
    }
    this.loadGuest1=function () {
        //开始创建PM对象
        var LODArray=[100,200]//4个数字表示距离，可以将模型分为5级;
        //var path='/myModel/childFemale_idle';//childFemale_crawl
        //var path='/myModel/childFemale_crawl';
        //var path='/myModel/Female01';
        var path='/myModel/zhao1';
        var pmLoader = new MyPMLoader(
            path,    //模型路径
            LODArray,//LOD等级的数组
            this.camera,  //LOD需要判断到相机的距离
            0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
            0.02     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
        );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
        var myModel=pmLoader.obj;
        //myModel.scale.set(1.5,1.5,1.5);
        myModel.position.set(191,9,-26);
        myModel.rotation.set(0,-Math.PI/2,0);
        //new ParamMeasure(myModel,0);
        this.obj.add(myModel);
        //完成创建PM对象
    }
    this.loadGuest2=function () {
        //开始创建PM对象
        var LODArray=[100,200]//4个数字表示距离，可以将模型分为5级;
        //var path='/myModel/childFemale_idle';//childFemale_crawl
        //var path='/myModel/childFemale_crawl';
        //var path='/myModel/Female01';
        var path='/myModel/dongshizhang5';
        var pmLoader = new MyPMLoader(
            path,    //模型路径
            LODArray,//LOD等级的数组
            this.camera,  //LOD需要判断到相机的距离
            0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
            0.02     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
        );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
        var myModel=pmLoader.obj;
        //myModel.scale.set(1.5,1.5,1.5);
        myModel.position.set(191,9,-11);//191,9,-11
        myModel.rotation.set(0,-Math.PI/2,0);
        //new ParamMeasure(myModel,0);
        this.obj.add(myModel);
        //完成创建PM对象
    }
}