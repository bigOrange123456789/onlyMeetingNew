function AvatarManager(mySeatManager,camera){//camera用于LOD
    var scope=this;
    this.obj=new THREE.Object3D();
    //this.obj1=new THREE.Object3D();
    //this.obj2=new THREE.Object3D();

    this.positions=mySeatManager.positions;
    //this.types=[];//贴图类型
    this.animations=[];//动画类型
    this.colors=[];
    this.sexs=[];//0表示女性，1表示男性
    this.manNum=0;

    for(var i=0;i<scope.positions.length;i++){//共有1677张椅子
        this.colors.push([
            Math.random()/4 ,
            Math.random()/4 ,
            Math.random()/4
        ]);
        if(Math.random()<0.33)this.sexs.push(0);
        else {
            this.sexs.push(1);
            this.manNum++;
        }
        if(Math.random()<0.7)this.animations.push(0);
        else this.animations.push(1);
    }



    this.camera=camera;
    this.positionsType=[];


    this.init=function () {
        this.obj.name="AvatarManager_obj";
        for(var i=0;i<this.positions.length;i++)//共有1677个位置
            this.positionsType.push(Math.floor(Math.random()*4)+1);//1-4
        this.loadAvatar();
    }

    this.loadAvatar=function () {
        this.host();
        var animLoader = new THREE.GLTFLoader();//= new PMAnimLoader();//估计是通过gltf文件加载的动画
        animLoader.load('./myModel/skeleton/scene.gltf', function (glbObj){
            glbObj.scene.visible=false;
            //scope.loadGuest1(glbObj);
            scope.loadGuest2(glbObj);
        });
        this.createPeople_haveAnimation();
        //this.analysis2();
    }
    this.createPeople_haveAnimation=function(){
        var loader= new THREE.GLTFLoader();
        //加载女性
        loader.load('myModel/avatar/Female.glb', (glb) => {
            //console.log(glb.scene.children[0].children[1])
            var peoples=new InstancedGroup(
                scope.positions.length-this.manNum,
                [glb.scene.children[0].children[1].clone()],//这些mesh的网格应该一致
                glb.animations[0].clone()
            );
            peoples.init(['./img/texture/w/w00.jpg','./img/texture/w/w0.jpg'],16);

            var index=0;
            for(var i=0;i<scope.positions.length;i++)
            if(this.sexs[i]===0){
                peoples.rotationSet(index,[Math.PI/2,0,3*Math.PI/2]);
                peoples.positionSet(index,[scope.positions[i][0]+1.8,scope.positions[i][1]+1.5,scope.positions[i][2]]);
                peoples.scaleSet(index,[0.045,0.045,0.04+Math.random()*0.01]);

                peoples.animationSet(index,scope.animations[i]);
                peoples.colorSet(index,scope.colors[i]);
                peoples.speedSet(index,0.15+Math.random()*1.5);
                //else peoples.speedSet(i,2+Math.random()*1.92);
                index++;
            }

            scope.obj.add(peoples.obj);
            //开始加载男性听众
            //loader.load('myModel/avatar/1.glb', (glb2) => {//console.log(glb2.scene.children[0].children[3]);
                //return;
                //console.log(glb2);
                //console.log(glb2.scene.children[0].children[0].children[2]);
                var peoples=new InstancedGroup(
                    scope.manNum,
                    [glb.scene.children[0].children[1]],
                    //[glb2.scene.children[0].children[0].children[2]],//这些mesh的网格应该一致
                    glb.animations[0]
                );
                peoples.init(['./img/texture/m/m00.jpg','./img/texture/m/m0.jpg'],32);

                var index=0;
                for(var i=0;i<scope.positions.length;i++)
                    if(this.sexs[i]===1){
                        peoples.rotationSet(index,[Math.PI/2,0,3*Math.PI/2]);
                        peoples.positionSet(index,[scope.positions[i][0]+1.8,scope.positions[i][1]+1.5,scope.positions[i][2]]);
                        peoples.scaleSet(index,[0.045,0.045,0.04+Math.random()*0.01]);

                        peoples.animationSet(index,scope.animations[i]);
                        peoples.colorSet(index,scope.colors[i]);
                        peoples.speedSet(index,0.15+Math.random()*1.5);
                        //else peoples.speedSet(i,2+Math.random()*1.92);
                        index++;
                    }

                scope.obj.add(peoples.obj);
            //});
            //完成加载男性听众
        });
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
        var LODArray=[150]//4个数字表示距离，可以将模型分为5级;
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
        var LODArray=[50]//4个数字表示距离，可以将模型分为5级;
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
        myModel.scale.set(0.024,0.024,0.024);
        myModel.position.set(191,18.1,-11);//191,9,-11
        myModel.rotation.set(0,Math.PI,0);
        //new ParamMeasure(myModel,0);
        this.obj.add(myModel);
        //完成创建PM对象
    }
    this.analysis=function () {
        var loader= new THREE.GLTFLoader();
        loader.load('myModel/avatar/Female.glb', (glb) => {
            //console.log(glb.scene.children[0].children[1])
            var peoples=new InstancedGroup(
                1,
                [glb.scene.children[0].children[1].clone()],//这些mesh的网格应该一致
                glb.animations[0].clone()
            );
            peoples.init(['./img/texture/m/m00.jpg','./img/texture/m/m0.jpg'],32);
            for(var index=0;index<peoples.instanceCount;index++)
                {
                    peoples.rotationSet(index,[Math.PI/2,0,3*Math.PI/2]);
                    peoples.positionSet(index,[scope.positions[index][0]+1.8,scope.positions[index][1]+1.5,scope.positions[index][2]]);
                    peoples.scaleSet(index,[0.045,0.045,0.04+Math.random()*0.01]);

                    peoples.animationSet(index,scope.animations[index]);
                    peoples.colorSet(index,scope.colors[index]);
                    peoples.speedSet(index,0.15+Math.random()*1.5);
                }
            scope.obj.add(peoples.obj);

            //先等待贴图的加载，以防初始时贴图未完全加载影响测量结果
            setTimeout(function () {
                var result="";
                var myInterval=setInterval(function () {
                    result=result+","+tag.innerHTML;
                    //console.log(tag)
                    if(peoples.instanceCount>=scope.positions.length){
                        window.clearInterval(myInterval);
                        console.log(result);
                        return;
                    }else console.log(parseInt(tag.innerHTML),peoples.instanceCount);
                    var obj0=peoples.obj;
                    var count=peoples.instanceCount;
                    peoples=new InstancedGroup(
                        count+10,
                        [glb.scene.children[0].children[1].clone()],//这些mesh的网格应该一致
                        glb.animations[0].clone()
                    );
                    peoples.init(['./img/texture/m/m00.jpg','./img/texture/m/m0.jpg'],32);
                    for(var index=0;index<peoples.instanceCount;index++)
                    {
                        peoples.rotationSet(index,[Math.PI/2,0,3*Math.PI/2]);
                        peoples.positionSet(index,[scope.positions[index][0]+1.8,scope.positions[index][1]+1.5,scope.positions[index][2]]);
                        peoples.scaleSet(index,[0.045,0.045,0.04+Math.random()*0.01]);

                        peoples.animationSet(index,scope.animations[index]);
                        peoples.colorSet(index,scope.colors[index]);
                        peoples.speedSet(index,0.15+Math.random()*1.5);
                    }
                    scope.obj.remove(obj0);
                    scope.obj.add(peoples.obj);


                },2000);
            },10000);

        });
    }
    this.analysis2=function () {
        var loader= new THREE.GLTFLoader();
        loader.load('myModel/avatar/Female.glb', (glb) => {
            //console.log(glb.scene.children[0].children[1])
            //开始
            var peoples = new InstancedGroup2(
                1,
                [glb.scene.children[0].children[1].clone()],//这些mesh的网格应该一致
                glb.animations[0].clone()
            );
            var srcs=[];
            for(var i=0;i<16;i++){
                srcs.push("performanceAnalysis/texture/m/m"+i+".jpg");
            }
            peoples.init(srcs,16);
            for(var index=0;index<peoples.instanceCount;index++){
                peoples.rotationSet(index,[Math.PI/2,0,3*Math.PI/2]);
                peoples.positionSet(index,[scope.positions[index][0]+1.8,scope.positions[index][1]+1.5,scope.positions[index][2]]);
                peoples.scaleSet(index,[0.045,0.045,0.04+Math.random()*0.01]);

                peoples.textureSet(index,Math.floor(Math.random()*16));
            }
            //完成
            scope.obj.add(peoples.obj);

            //先等待贴图的加载，以防初始时贴图未完全加载影响测量结果
            setTimeout(function () {
                var result="";
                var myInterval=setInterval(function () {
                    result=result+","+tag.innerHTML;
                    //console.log(tag)
                    if(peoples.instanceCount>=scope.positions.length){
                        window.clearInterval(myInterval);
                        console.log(result);
                        return;
                    }else console.log(parseInt(tag.innerHTML),peoples.instanceCount);
                    var obj0=peoples.obj;
                    var count=peoples.instanceCount;
                    peoples = new InstancedGroup2(
                        count+10,
                        [glb.scene.children[0].children[1].clone()],//这些mesh的网格应该一致
                        glb.animations[0].clone()
                    );
                    var srcs=[];
                    for(var i=0;i<16;i++){
                        srcs.push("performanceAnalysis/texture/m/m"+i+".jpg");
                    }
                    peoples.init(srcs,16);
                    for(var index=0;index<peoples.instanceCount;index++){
                        peoples.rotationSet(index,[Math.PI/2,0,3*Math.PI/2]);
                        peoples.positionSet(index,[scope.positions[index][0]+1.8,scope.positions[index][1]+1.5,scope.positions[index][2]]);
                        peoples.scaleSet(index,[0.045,0.045,0.04+Math.random()*0.01]);

                        peoples.textureSet(index,Math.floor(Math.random()*16));
                    }
                    scope.obj.remove(obj0);
                    scope.obj.add(peoples.obj);


                },2000);
            },10000);

        });
    }
}