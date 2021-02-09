function AvatarManager(mySeatManager,camera){//camera用于LOD
    var scope=this;
    this.obj=new THREE.Object3D();

    this.positions=mySeatManager.positions;
    this.types=[];//贴图类型
    this.animations=[];//动画类型
    this.colors=[];
    this.sexs=[];//0表示女性，1表示男性
    this.manNum=0;

    this.camera=camera;
    this.positionsType=[];

    this.init=function () {


        //var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        //loader.load("json/textureSetData.json", function(str){//dataTexture
            for(i=0;i<scope.positions.length;i++){//共有1677张椅子
                scope.colors.push([
                    Math.random()/4 ,
                    Math.random()/4 ,
                    Math.random()/4
                ]);
                /*if(Math.random()<0.33)scope.sexs.push(0);
                 else {
                     scope.sexs.push(1);
                     //scope.manNum++;
                 }*/
                if(Math.random()<0.7)scope.animations.push(0);
                else scope.animations.push(1);
            }
            for(var i=0;i<scope.positions.length;i++)//共有1677个位置
                scope.positionsType.push(Math.floor(Math.random()*4)+1);//1-4


            var data=[0,1,2,3,4,5,6,7,8,9,10,11,12,39,40,41,42,43,44,45,46,47,38,37,36,35,16,17,18,19,20,21,22,23,24,25,26,27,28,11,12,13,14,15,32,31,0,1,2,3,4,5,7,8,9,10,28,29,30,33,16,17,18,19,20,6,24,25,26,27,34,35,39,40,41,42,43,44,0,1,2,3,4,5,6,7,8,9,10,11,0,19,20,21,16,17,11,12,13,14,15,23,24,12,14,15,18,22,23,36,19,20,21,22,25,26,27,5,13,29,30,31,0,1,2,3,4,5,6,7,7,8,9,10,24,28,32,33,16,18,29,30,31,3,4,6,25,26,27,34,35,37,17,36,19,20,13,14,15,16,17,18,19,20,21,22,23,24,25,34,33,32,0,1,2,3,4,5,6,7,8,9,29,30,31,39,40,41,42,43,44,45,46,47,38,6,7,8,9,10,11,12,13,14,15,16,0,1,21,22,23,24,25,26,27,28,29,30,31,32,33,45,46,38,37,36,35,34,17,18,19,20,21,42,1,2,3,4,5,6,0,1,2,3,4,5,12,13,14,15,16,20,21,7,8,9,10,11,22,23,28,17,18,19,30,31,32,33,37,36,26,27,17,8,9,10,11,22,12,13,14,15,16,28,0,1,32,33,23,24,25,27,29,38,35,34,6,7,8,21,34,0,1,2,3,4,5,18,19,20,21,30,26,27,28,29,30,31,32,33,34,35,36,37,38,10,11,12,13,14,15,16,0,1,2,3,4,5,37,39,17,18,19,20,21,6,7,8,9,10,11,2,3,4,5,22,23,24,25,26,27,12,13,14,34,35,36,40,41,42,43,44,45,28,17,18,15,43,6,7,8,9,10,11,29,30,19,20,16,0,13,14,15,0,1,2,3,4,5,22,23,1,2,24,25,16,26,27,12,13,14,31,21,6,7,3,18,19,20,21,28,17,18,32,8,9,10,11,24,2,3,4,5,22,23,24,15,25,26,27,12,4,9,10,11,29,6,7,33,16,0,34,28,13,14,31,32,34,35,36,30,19,1,2,20,17,5,18,0,1,2,12,38,5,7,8,9,10,11,14,15,11,16,17,14,15,21,13,23,39,12,24,38,13,18,19,20,22,36,3,4,6,0,1,2,3,4,5,23,28,29,30,31,18,40,25,22,26,7,8,7,8,9,10,24,11,16,19,20,27,21,28,17,3,4,6,0,1,2,32,33,5,15,29,30,6,12,13,21,25,26,17,7,8,9,10,14,31,32,11,14,15,27,34,35,12,13,3,4,11,16,12,2,16,18,5,22,23,28,6,0,1,2,18,19,10,19,20,29,30,31,36,21,24,25,22,20,33,0,1,8,3,4,11,37,38,27,26,17,23,8,6,7,9,32,33,2,10,14,5,7,15,9,10,12,13,17,24,25,39,16,19,29,12,13,28,31,5,14,15,26,34,0,1,8,3,4,6,30,1,2,18,21,22,23,20,35,18,40,33,11,21,14,3,4,11,27,28,30,31,17,24,22,34,36,19,0,1,8,6,7,5,9,15,2,10,0,5,8,35,37,39,6,26,28,17,40,23,24,12,13,14,16,40,41,36,7,8,9,10,11,22,25,29,33,5,18,12,19,14,15,16,0,1,2,3,4,5,9,10,11,22,20,13,21,30,27,32,28,35,36,23,25,24,29,31,33,34,37,38,39,8,9,10,0,1,2,3,4,5,6,12,18,14,15,23,31,34,35,26,27,28,17,36,7,19,20,13,16,0,13,37,15,38,8,9,10,11,22,24,26,1,2,5,7,21,14,16,0,23,25,3,4,29,27,33,36,39,40,30,20,32,35,31,21,28,37,6,7,3,4,6,22,1,2,33,15,5,8,9,10,11,0,24,11,18,12,13,27,34,14,17,30,23,38,32,25,26,17,19,29,7,36,39,16,12,13,25,2,16,37,5,8,3,4,24,0,1,18,19,15,27,20,15,9,10,21,23,6,20,22,31,29,28,29,7,33,28,30,32,25,11,2,33,35,7,8,3,4,13,0,1,14,38,26,5,9,3,4,21,15,37,38,39,40,41,3,4,37,22,23,29,15,26,16,17,0,8,9,10,11,21,6,7,8,3,18,19,1,2,12,13,5,14,31,24,30,9,1,6,7,20,22,23,15,18,25,26,27,12,0,4,11,21,24,27,28,29,16,17,32,19,28,2,10,30,34,3,4,33,35,36,1,20,34,13,5,11,25,32,14,26,37,6,0,7,3,22,15,18,6,12,17,5,8,9,10,2,21,38,8,14,16,17,18,19,15,13,31,11,12,23,4,24,9,25,1,35,20,22,16,39,25,18,27,26,29,30,0,7,36,21,24,1,28,34,17,5,19,32,10,2,12,3,4,0,29,30,14,33,15,6,13,11,3,20,26,32,2,37,7,35,8,22,16,31,21,18,8,5,27,9,10,23,36,20,38,1,28,23,4,5,14,6,40,12,11,3,41,0,9,24,14,17,15,34,16,17,13,18,19,25,2,26,7,27,19,22,24,1,22,31,4,5,29,30,10,12,32,6,13,0,1,2,3,4,5,6,7,8,9,10,11,12,39,40,41,42,43,44,45,46,47,38,37,36,35,16,17,18,19,20,21,22,23,24,25,26,27,28,11,12,13,14,15,32,31,0,1,2,3,4,5,7,8,9,10,28,29,30,33,16,17,18,19,20,6,24,25,26,27,34,35,39,40,41,42,43,44,0,1,2,3,4,5,6,7,8,9,10,11,0,19,20,21,16,17,11,12,13,14,15,23,24,12,14,15,18,22,23,36,19,20,21,22,25,26,27,5,13,29,30,31,0,1,2,3,4,5,6,7,7,8,9,10,24,28,32,33,16,18,29,30,31,3,4,6,25,26,27,34,35,37,17,36,19,20,0,1,2,12,38,5,7,8,9,10,11,14,15,11,16,17,14,15,21,13,23,39,12,24,38,13,13,14,15,16,17,18,19,20,21,22,23,24,25,34,33,32,0,1,2,3,4,5,6,7,8,9,29,30,31,39,40,41,42,43,44,45,46,47,38,6,7,8,9,10,11,12,13,14,15,16,0,1,21,22,23,24,25,26,27,28,29,30,31,32,33,45,46,38,37,36,35,34,17,18,19,20,21,42,1,2,3,4,5,6,0,1,2,3,4,5,12,13,14,15,16,20,21,7,8,9,10,11,22,23,28,17,18,19,30,31,32,33,37,36,26,27,17,8,9,10,11,22,12,13,14,15,16,28,0,1,32,33,23,24,25,27,29,38,35,34,6,7,8,21,34,0,1,2,3,4,5,18,19,20,21,30,35,37,39,6,26,28,17,40,23,24,12,13,14,16,40,41,36,7,8,9,10,11,22,25,29,33,26,27,28,29,30,31,32,33,34,35,36,37,38,10,11,12,13,14,15,16,0,1,2,3,4,5,37,39,17,18,19,20,21,6,7,8,9,10,11,2,3,4,5,22,23,24,25,26,27,12,13,14,34,35,36,40,41,42,43,44,45,28,17,18,15,43,6,7,8,9,10,11,29,30,19,20,16,0,13,14,15,0,1,2,3,4,5,22,23,1,2,24,25,16,26,27,12,13,14,31,21,6,7,3,18,19,20,21,28,17,18,32,8,9,10,11,24,2,3,4,5,22,23,24,15,25,26,27,12,4,9,10,11,29,6,7,33,16,0,34,28,13,14,31,32,34,35,36,30,19,1,2,20,17,5,18,15,37,38,39,40,41,3,4,37,22,23,29,15,26,16,17,0,8,9,10,11,21,6,7,8,3];
            //var data=JSON.parse(str).data;
            for(i=0;i<data.length;i++){
                if(data[i]<16){
                    scope.sexs[i]=0;
                    scope.types[i]=data[i];
                }else{
                    scope.sexs[i]=1;
                    scope.types[i]=data[i]-16;
                    scope.manNum++;
                }
            }
            scope.loadAvatar();
        //});
    }

    this.loadAvatar=function () {
        this.host();
        var animLoader = new THREE.GLTFLoader();//= new PMAnimLoader();//估计是通过gltf文件加载的动画
        animLoader.load('./myModel/skeleton/scene.gltf', function (glbObj){
            glbObj.scene.visible=false;
            //scope.loadGuest1(glbObj);
            scope.loadGuest2(glbObj);
        });
        this.createPeople_haveAnimation2();
        //this.analysis2();
    }
    this.createPeople_haveAnimation2=function(){
        //加载女性
        var pmLoader = new MyPMLoader(
            {animations: []},
            './myModel/Female',    //模型路径
            [],//LOD等级的数组
            scope.camera,  //LOD需要判断到相机的距离
            0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
            0,     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
            []
        );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
        //完成创建PM对象


        var peoples = null;
        var peoples2 = null;
        var timeId = setInterval(function () {
            if (pmLoader.obj.children[0]) {
                var mesh = pmLoader.obj.children[0].children[0];


                //女性开始
                var peoplesPre = null;
                if (peoples != null) peoplesPre = peoples;//console.log(peoples.obj);
                peoples = new InstancedGroup(
                    scope.positions.length - scope.manNum,
                    [mesh],//这些mesh的网格应该一致
                    true
                );
                peoples.init(['./img/texture/w/w00.jpg', './img/texture/w/w0.jpg'], 16);
                var index = 0;
                for (var i = 0; i < scope.positions.length; i++)//1677
                    if (scope.sexs[i] === 0) {
                        peoples.rotationSet(index, [Math.PI / 2, 0, 3 * Math.PI / 2]);
                        peoples.positionSet(index, [scope.positions[i][0] + 1.8, scope.positions[i][1] + 1.5, scope.positions[i][2]]);
                        peoples.scaleSet(index, [0.045, 0.045, 0.04 + Math.random() * 0.01]);

                        peoples.animationSet(index, scope.animations[i]);
                        peoples.colorSet(index, scope.colors[i]);
                        peoples.speedSet(index, 0.15 + Math.random() * 1.5);
                        peoples.textureSet0(index, scope.types[i]);
                        index++;
                    }
                scope.obj.add(peoples.obj);
                if (peoplesPre != null) scope.obj.remove(peoplesPre.obj);
                //女性结束

                //男性开始
                var peoplesPre2 = null;
                if (peoples2 != null) peoplesPre2 = peoples2;//console.log(peoples.obj);
                peoples2 = new InstancedGroup(
                    scope.manNum,//908
                    [mesh],//这些mesh的网格应该一致
                    true
                );
                peoples2.init(['./img/texture/m/m00.jpg', './img/texture/m/m0.jpg'], 32);
                index = 0;
                for (i = 0; i < scope.positions.length; i++)
                    if (scope.sexs[i] === 1) {
                        peoples2.rotationSet(index, [Math.PI / 2, 0, 3 * Math.PI / 2]);
                        peoples2.positionSet(index, [scope.positions[i][0] + 1.8, scope.positions[i][1] + 1.5, scope.positions[i][2]]);
                        peoples2.scaleSet(index, [0.045, 0.045, 0.04 + Math.random() * 0.01]);

                        peoples2.animationSet(index, scope.animations[i]);
                        peoples2.colorSet(index, scope.colors[i]);
                        peoples2.speedSet(index, 0.15 + Math.random() * 1.5);
                        peoples2.textureSet0(index, scope.types[i]);
                        index++;
                    }
                scope.obj.add(peoples2.obj);
                if (peoplesPre2 != null) scope.obj.remove(peoplesPre2.obj);
                //男性结束
                console.log(pmLoader.finished);
                if (pmLoader.finished) window.clearInterval(timeId)
            }
        }, 1000);
        //完成加载女性听众

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
                    peoples.textureSet0(index,scope.types[i]);
                    //console.log(scope.types[i])
                    //peoples.textureSet(index,[scope.types[i],scope.types[i],scope.types[i]]);
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
                    peoples.textureSet0(index,scope.types[i]);
                    //peoples.textureSet(i,[scope.types[i],scope.types[i],scope.types[i]]);
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
            0.02,     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
            ["Texture_0_0.jpeg","Texture_0_1.jpeg"]
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