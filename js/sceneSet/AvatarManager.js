function AvatarManager(mySeatManager,camera){//camera用于LOD
    var scope=this;
    this.obj=new THREE.Object3D();
    this.obj1=new THREE.Object3D();
    this.obj2=new THREE.Object3D();



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
    this.types=[];
    this.colors=[];
    for(var i=0;i<scope.positions.length;i++){
        this.types.push([
            Math.floor(Math.random() * 16),
            Math.floor(Math.random() * 16),
            Math.floor(Math.random() * 16),
            Math.floor(Math.random() *2)
        ]);
        this.colors.push([
            Math.random()/4 ,
            Math.random()/4 ,
            Math.random()/4
        ]);
    }



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

        this.createPeopleDouble('myModel/avatar/Female02.glb','myModel/avatar/Female01_2.glb',2);
    }
    this.createPeopleDouble=function(src1,src2,index){
        var src;
        if(index===2)src=src2;
        else if(index===1)src=src1;
        else return;
        var loader= new THREE.GLTFLoader();
        loader.load(src, (glb) => {
            var peoples=new InstancedGroup(
                scope.positions.length,
                [glb.scene.children[0],glb.scene.children[0]],//这些mesh的网格应该一致
                false
            );
            var texSrc=[];
            for(i=0;i<16;i++)texSrc.push('./texture/'+i+'.jpg');
            peoples.init(
                texSrc
            );
            for(var i=0;i<scope.positions.length;i++){
                peoples.rotationSet(i,[Math.PI/2,0,3*Math.PI/2]);
                peoples.positionSet(i,[scope.positions[i][0]+2,scope.positions[i][1]+1.5,scope.positions[i][2]]);
                peoples.scaleSet(i,[4.5,4.5,4.5]);
                peoples.typeSet(i,scope.types[i]);
                peoples.colorSet(i,scope.colors[i]);
            }
            peoples.animationSpeed=0.1;
            if(index===2){
                scope.obj2.add(peoples.obj);
                scope.obj.add(scope.obj2);
            }else if(index===1){
                scope.obj1.add(peoples.obj);
                scope.obj.add(scope.obj1);
                scope.obj1.visible=false;
                var flag=0;
                function mytest000() {
                    requestAnimationFrame(mytest000);
                    if(flag<3){
                        flag++;
                    }else{
                        scope.obj1.visible=scope.obj2.visible;
                        scope.obj2.visible=!scope.obj1.visible;
                        flag=0;
                    }
                }
                mytest000();
            }
            scope.createPeopleDouble(
                'myModel/avatar/Female02.glb',
                'myModel/avatar/Female01_2.glb',
                index-1
            );
        });
    }
    this.createPeople=function(src,parentObj){
        var loader= new THREE.GLTFLoader();
        loader.load(src, (glb) => {
            var peoples=new InstancedGroup(
                scope.positions.length,
                [glb.scene.children[0],glb.scene.children[0]],//这些mesh的网格应该一致
                false
            );
            var texSrc=[];
            for(i=0;i<16;i++)texSrc.push('./texture/'+i+'.jpg');
            peoples.init(
                texSrc
            );
            for(var i=0;i<scope.positions.length;i++){
                peoples.rotationSet(i,[Math.PI/2,0,3*Math.PI/2]);
                peoples.positionSet(i,[scope.positions[i][0]+2,scope.positions[i][1]+1.5,scope.positions[i][2]]);
                peoples.scaleSet(i,[4.5,4.5,4.5]);
            }
            peoples.animationSpeed=0.1;
            parentObj.add(peoples.obj);
        });
    }
    this.createPeople_haveAnimation=function(){
        var loader= new THREE.GLTFLoader();
        loader.load('myModel/avatar/test2.glb', (glb) => {
            //测试
            var myMesh=new MySkinnedMesh();
            myMesh.init(
                glb.scene.children[0].children[1],
                glb.animations[0]
            );
            var myMesh2=new MySkinnedMesh();
            myMesh2.init(
                glb.scene.children[0].children[1],
                glb.animations[1]
            );
            //测试
            var peoples=new InstancedGroup(
                10,
                [myMesh.mesh,myMesh2.mesh],//这些mesh的网格应该一致
                true
            );
            var texSrc=[];
            for(i=0;i<16;i++)texSrc.push('./texture/'+i+'.jpg');
            peoples.init(
                texSrc
            );
            for(var i=0;i<10;i++){
                peoples.rotationSet(i,[Math.PI/2,0,3*Math.PI/2]);
                peoples.positionSet(i,[scope.positions[i][0],scope.positions[i][1]+1.5,scope.positions[i][2]]);
                peoples.scaleSet(i,[0.045,0.045,0.045]);
            }
            //peoples.obj.rotation.set(Math.PI/2,0,0);
            peoples.animationSpeed=0.1;
            scope.obj.add(peoples.obj);
        });
    }
    this.host=function () {
        var loader= new THREE.GLTFLoader();
        loader.load("myModel/avatar/host.glb", (glb) => {
            glb.scenes[0].position.set(198,9,-65);
            glb.scenes[0].rotation.set(0,-Math.PI/2,0);
            glb.scenes[0].scale.set(10,10,10);
            scope.obj.add(glb.scenes[0]);
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