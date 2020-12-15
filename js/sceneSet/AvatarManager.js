function AvatarManager(mySeatManager,camera){//camera用于LOD
    var scope=this;
    this.obj=new THREE.Object3D();

    this.avatar1=[null,null,null,null];//new Array(4);
    this.avatar2=[null,null,null,null];//new Array(4);
    this.frameFlag=1;//1-8
    this.frameAnimation=function () {
        requestAnimationFrame(scope.frameAnimation);
        //if(Math.random()<0.5)return;
        if(scope.avatar1[0]&&scope.avatar1[1]&&scope.avatar1[2]&&scope.avatar1[3]
        &&scope.avatar2[0]&&scope.avatar2[1]&&scope.avatar2[2]&&scope.avatar2[3])
        if(scope.frameFlag===1){
            scope.obj.remove(scope.avatar1[0]);
            scope.obj.add(scope.avatar2[0]);
        }else if(scope.frameFlag===2){
            scope.obj.remove(scope.avatar1[1]);
            scope.obj.add(scope.avatar2[1]);
        }else if(scope.frameFlag===3){
            scope.obj.remove(scope.avatar1[2]);
            scope.obj.add(scope.avatar2[2]);
        } else if(scope.frameFlag===4){
            scope.obj.remove(scope.avatar1[3]);
            scope.obj.add(scope.avatar2[3]);
        }else if(scope.frameFlag===5){
            scope.obj.remove(scope.avatar2[0]);
            scope.obj.add(scope.avatar1[0]);
        }else if(scope.frameFlag===6){
            scope.obj.remove(scope.avatar2[1]);
            scope.obj.add(scope.avatar1[1]);
        }else if(scope.frameFlag===7){
            scope.obj.remove(scope.avatar2[2]);
            scope.obj.add(scope.avatar1[2]);
        }else if(scope.frameFlag===8){
            scope.obj.remove(scope.avatar2[3]);
            scope.obj.add(scope.avatar1[3]);
        }
        if(scope.frameFlag===8)scope.frameFlag=1;
        else scope.frameFlag++;
    }

    this.positions=mySeatManager.positions;
    this.camera=camera;
    this.positionsType=[];

    this.init=function () {
        this.obj.name="AvatarManager_obj";
        for(var i=0;i<this.positions.length;i++)
            this.positionsType.push(Math.floor(Math.random()*4)+1);//1-4
        this.loadAvatar();
        this.frameAnimation();
    }

    this.loadAvatar=function () {
        this.host();
        this.loadGuest1();
        this.loadGuest2();
        this.loadAvatarTool(1,'myModel/avatar/Man01_2.glb','myModel/avatar/Man02.glb');
        this.loadAvatarTool(2,'myModel/avatar/Female01_2.glb','myModel/avatar/Female02.glb');
        this.loadAvatarTool(3,'myModel/avatar/Ganpa01_2.glb','myModel/avatar/Ganpa02.glb');
        this.loadAvatarTool(4,'myModel/avatar/Granny01_2.glb','myModel/avatar/Granny02.glb');/**/
    }
    this.loadAvatarTool=function(type,url,url2){
        //var type=4;
        var loader1= new THREE.GLTFLoader();
        loader1.load(url, (glb) => {
            var mesh0=glb.scene.children[0];//console.log(mesh0);
            console.log(glb);
            //导入后的对象是Object类型
            //  animations
            //  scenes
            //  scene//Group类型//核心//的内容
            //      children//
            //          mesh
            //              geometry
            //                  attributes(normal position uv)\index
            //              material
            //                  map(image)
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
            scope.obj.add(mesh);
            scope.avatar1[type-1]=mesh;
            //开始加载另外一帧模型
            var loader2= new THREE.GLTFLoader();
            loader2.load(url2, (glb) => {
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
                        dummy.updateMatrix();
                        mesh.setMatrixAt(j, dummy.matrix);
                        j++;
                    }
                //scope.obj.add(mesh);
                scope.avatar2[type-1]=mesh;
            });
            //完成加载另外一帧模型
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
        var LODArray=[200,300]//4个数字表示距离，可以将模型分为5级;
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
        var LODArray=[200,300]//4个数字表示距离，可以将模型分为5级;
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