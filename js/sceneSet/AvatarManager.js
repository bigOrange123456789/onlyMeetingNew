function AvatarManager(mySeatManager,camera){//camera用于LOD
    var scope=this;
    this.obj=new THREE.Object3D();
    this.obj1=new THREE.Object3D();
    this.obj2=new THREE.Object3D();

    this.positions=mySeatManager.positions;
    this.types=[];
    this.colors=[];
    this.sexs=[];//0表示女性，1表示男性
    this.manNum=0;

    for(var i=0;i<scope.positions.length;i++){//共有1677张椅子
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
        if(Math.random()<0.5)this.sexs.push(0);
        else {
            this.sexs.push(1);
            this.manNum++;
        }
    }



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
        var animLoader = new PMAnimLoader();//估计是通过gltf文件加载的动画
        animLoader.load('./myModel/skeleton/scene.gltf', function (glbObj){
            glbObj.scene.visible=false;
            scope.loadGuest1(glbObj);
            scope.loadGuest2(glbObj);
        });


        this.createPeople_haveAnimation();
        //this.createPeopleDouble('myModel/avatar/Female02.glb','myModel/avatar/Female01_2.glb',2);
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
            for(i=0;i<16;i++)texSrc.push('./texture/w/w'+i+'.jpg');
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
        //加载女性
        loader.load('myModel/avatar/Female.glb', (glb) => {
            console.log(glb.scene.children[0].children[1])
            var peoples=new InstancedGroup(
                scope.positions.length-this.manNum,
                [glb.scene.children[0].children[1].clone()],//这些mesh的网格应该一致
                glb.animations[0].clone()
            );
            var texSrc=[];
            for(i=0;i<16;i++)texSrc.push('./texture/w/w'+i+'.jpg');
            peoples.init(
                texSrc
            );

            var index=0;
            for(var i=0;i<scope.positions.length;i++)
            if(this.sexs[i]===0){
                peoples.rotationSet(index,[Math.PI/2,0,3*Math.PI/2]);
                peoples.positionSet(index,[scope.positions[i][0]+1.8,scope.positions[i][1]+1.5,scope.positions[i][2]]);
                peoples.scaleSet(index,[0.045,0.045,0.04+Math.random()*0.01]);

                peoples.typeSet(index,scope.types[i]);
                peoples.colorSet(index,scope.colors[i]);
                peoples.speedSet(index,0.2+Math.random()*3.52);
                //else peoples.speedSet(i,2+Math.random()*1.92);
                index++;
            }

            scope.obj.add(peoples.obj);
            //开始加载男性听众
            //loader.load('myModel/avatar/Male.glb', (glb2) => {//console.log(glb2.scene.children[0].children[3]);
                //return;
                //console.log(glb2);
                var peoples=new InstancedGroup(
                    scope.manNum,
                    [glb.scene.children[0].children[1]],
                    //[glb2.scene.children[0].children[3]],//这些mesh的网格应该一致
                    glb.animations[0]
                );
                var texSrc=[];
                for(i=0;i<16;i++)texSrc.push('./texture/m/m'+i+'.jpg');
                peoples.init(
                    texSrc
                );

                var index=0;
                for(var i=0;i<scope.positions.length;i++)
                    if(this.sexs[i]===1){
                        peoples.rotationSet(index,[Math.PI/2,0,3*Math.PI/2]);
                        peoples.positionSet(index,[scope.positions[i][0]+1.8,scope.positions[i][1]+1.5,scope.positions[i][2]]);
                        peoples.scaleSet(index,[0.045,0.045,0.04+Math.random()*0.01]);

                        peoples.typeSet(index,scope.types[i]);
                        peoples.colorSet(index,scope.colors[i]);
                        peoples.speedSet(index,0.2+Math.random()*3.52);
                        //else peoples.speedSet(i,2+Math.random()*1.92);
                        index++;
                    }

                scope.obj.add(peoples.obj);
            });
            //完成加载男性听众
        //});
        //完成加载女性听众

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
    this.loadGuest1=function (glbObj) {
        //开始创建PM对象
        var LODArray=[200,300]//4个数字表示距离，可以将模型分为5级;
        //var path='/myModel/childFemale_idle';//childFemale_crawl
        //var path='/myModel/childFemale_crawl';
        //var path='/myModel/Female01';
        var path='./myModel/zhao1';
        var pmLoader = new MyPMLoader(
            glbObj,
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
    this.loadGuest2=function (glbObj) {
        //开始创建PM对象
        var LODArray=[200,300]//4个数字表示距离，可以将模型分为5级;
        //var path='/myModel/childFemale_idle';//childFemale_crawl
        //var path='/myModel/childFemale_crawl';
        //var path='/myModel/Female01';
        var path='./myModel/dongshizhang5';
        var pmLoader = new MyPMLoader(
            glbObj,
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