import{Network}from'../Network.js'
import {InstancedGroup}from "../lib/instancedLib/InstancedGroup.js"
class AvatarManager{//camera用于LOD
    constructor(mySeatManager,camera){
        this.obj=new THREE.Object3D();
        //this.obj.visible=false;
        this.myNetwork=new Network();

        this.positions=mySeatManager.positions;
        this.types=[];//贴图类型
        this.animations=[];//动画类型
        this.colors=[];
        this.sexs=[];//0表示女性，1表示男性
        this.manNum=0;

        this.camera=camera;
    }


    create1(finishFunction0) {
        var scope=this;
        this.host();
        var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        loader.load("json/crowdData.json", function(str){//dataTexture
            var crowdData_json=JSON.parse(str);
            for(var i=0;i<scope.positions.length;i++){//共有1677张椅子
                scope.colors.push([
                    Math.random()/4 ,
                    Math.random()/4 ,
                    Math.random()/4
                ]);
                scope.animations[i]=Math.floor(Math.random()*3);
            }

            //var data=crowdData_json.textureSet;//种类分布
            //for(i=0;i<data.length;i++){
            /*for(i=0;i<scope.positions.length;i++)
                if(data[i]%3===2){// 有1/3是女性
                    scope.sexs[i]=0;//女性
                    scope.types[i]=Math.floor(data[i]/3);
                    scope.animations[i]=0;
                }else{
                    scope.sexs[i]=1;//男性
                    scope.types[i]=Math.floor(data[i]/3)+(data[i]%3)*16;
                    //if(scope.animations[i]===1)scope.animations[i]=0;
                    scope.manNum++;
                }*/
            //}
            for(i=0;i<scope.positions.length;i++)
                if(Math.random()<0.33){// 有1/3是女性
                    scope.sexs[i]=0;//女性
                    scope.types[i]=Math.floor(Math.random()*16);
                    scope.animations[i]=0;
                }else{
                    scope.sexs[i]=1;//男性
                    scope.types[i]=Math.floor(Math.random()*32);
                    //if(scope.animations[i]===1)scope.animations[i]=0;
                    scope.manNum++;
                }
            scope.createWoman(crowdData_json,function () {
                scope.createMan(crowdData_json,function () {
                    if(finishFunction0)finishFunction0();
                });
            });

        });
    }
    createMan(crowdData_json,finishFunction2) {
        var scope=this;
        //男性开始
        window.myClock_Male0=window.myClock;
        var pmLoader2 = new MyPMLoader(
            {animations: []},
            './myModel/Male',    //模型路径
            [],//没有LOD分级//LOD等级的数组
            this.camera,  //LOD需要判断到相机的距离
            0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
            0,     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
            [],
            function () {
                var mesh2 = pmLoader2.rootObject.children[0];
                var peoples2 = new InstancedGroup(
                    scope.manNum,//908
                    [mesh2],//这些mesh的网格应该一致
                    true,
                    crowdData_json,
                    scope.camera//添加光线效果
                );
                peoples2.neckPosition=0.68;
                //peoples2.vertURL="shader/vertexBone2.vert";
                //peoples2.fragURL="shader/fragment2.frag";
                peoples2.init(["./img/texture/m/m0.jpg","./img/texture/m/m1.jpg","./img/texture/m/m2.jpg"],
                    32,
                    ['#a9a541','#726050','#836557','#5a4c40','#716365',
                        '#483530','#695148','#917a6e','#786861','#4d453f','#553531','#8b7a73',
                        '#5d5146','#6c5b58','#656261','#646058','#5c5653','#5f5042','#6b6665',
                        '#6e5b4c','#82756d','#8f7462','#8e6b5d','#5a4c40','#6c6f72','#8e7f78',
                        '#514d50','#423e3f','#644e40','#746255','#524946','#56453d','#60564d'],
                    true,
                    finishFunction2,
                    scope.camera
                );
                var index = 0;
                for (var i = 0; i < scope.positions.length; i++)
                    if (scope.sexs[i] === 1) {
                        peoples2.rotationSet(index, [Math.PI / 2, 0, 3 * Math.PI / 2]);
                        peoples2.positionSet(index, [scope.positions[i][0] + 1.8, scope.positions[i][1] + 1.5, scope.positions[i][2]]);
                        var symm=1,k=0.5;
                        //if(Math.random()<0.5)symm=-1;
                        peoples2.scaleSet(index, [(0.04 + Math.random() * 0.01)*symm*k, (0.04 + Math.random() * 0.01) *k,(0.04 + Math.random() * 0.01)*k]);//最后一个是高
                        peoples2.animationSet(index, scope.animations[i]);
                        peoples2.colorSet(index, scope.colors[i]);
                        peoples2.speedSet(index, 0.6 + Math.random() * 0.4);
                        peoples2.textureSet0(index, scope.types[i]);
                        peoples2.faceShapeSet(index,Math.random()*3.5)
                        //peoples2.textureSet1(index, scope.types[i]);
                        index++;
                    }
                scope.obj.add(peoples2.obj);
                //console.log("男性模型加载时间"+(window.myClock-window.myClock_Male0));
                var timeId2 = setInterval(function () {
                    if(window.roamFinish){
                        mesh2 = pmLoader2.rootObject.children[0];
                        peoples2.updateGeometry(mesh2);
                        console.log(pmLoader2.finished);
                        if (pmLoader2.finished) window.clearInterval(timeId2)
                    }
                }, 1000);
            }
        );
        //男性结束
    }
    createWoman(crowdData_json,finishFunction1) {
        var scope=this;
        //女性开始
        window.myClock_Female0=window.myClock;
        var pmLoader = new MyPMLoader(
            {animations: []},
            './myModel/Female',    //模型路径
            [],//没有LOD分级//LOD等级的数组
            this.camera,  //LOD需要判断到相机的距离
            0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
            0,     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
            [],
            function() {
                var mesh = pmLoader.rootObject.children[0];
                var peoples = new InstancedGroup(
                    scope.positions.length - scope.manNum,
                    [mesh],//这些mesh的网格应该一致
                    true,
                    crowdData_json,
                    scope.camera//添加光线效果
                );
                peoples.init(
                    ["./img/texture/w/w0.jpg","./img/texture/w/w1.jpg","./img/texture/w/w2.jpg"],
                    16,
                    ['#b9b9b9','#a48e78','#9a6f49','#684e41','#5e4b46',
                        '#647357','#8d7b66','#7f7e6b','#414544','#95835d','#856064',
                        '#5a544e','#a37d67','#a8816f','#b18175','#7b6764','#a3877b'],
                    true,
                    finishFunction1,
                    scope.camera
                );
                var index = 0;
                for (var i = 0; i < scope.positions.length; i++)//1677
                    if (scope.sexs[i] === 0) {
                        peoples.rotationSet(index, [Math.PI / 2, 0, 3 * Math.PI / 2]);
                        peoples.positionSet(index, [scope.positions[i][0] + 1.8, scope.positions[i][1] + 1.5, scope.positions[i][2]]);
                        var symm=1,k=0.5;
                        //if(Math.random()<0.5)symm=-1;
                        peoples.scaleSet(index, [(0.04 + Math.random() * 0.01)*symm*k, (0.04 + Math.random() * 0.01)*k, (0.04 + Math.random() * 0.01)*k]);

                        peoples.animationSet(index, scope.animations[i]);//
                        peoples.colorSet(index, scope.colors[i]);
                        peoples.speedSet(index, 0.6 + Math.random() * 0.4);
                        peoples.textureSet0(index, scope.types[i]);
                        peoples.faceShapeSet(index,Math.random()*3.5)
                        //peoples.textureSet1(index, scope.types[i]);
                        index++;
                    }
                scope.obj.add(peoples.obj);
                console.log("女性模型加载时间"+(window.myClock-window.myClock_Female0));
                var timeId1 = setInterval(function () {
                    if(window.roamFinish){
                        mesh = pmLoader.rootObject.children[0];
                        peoples.updateGeometry(mesh);
                        console.log(pmLoader.finished);
                        if (pmLoader.finished) window.clearInterval(timeId1)
                    }
                }, 1000);
            },
            3000
        );
        //女性结束
    }

    create2=function () {
        var scope=this;
        var animLoader = new THREE.GLTFLoader();//= new PMAnimLoader();//估计是通过gltf文件加载的动画
        animLoader.load('./myModel/skeleton/scene.glb', function (glbObj){
            glbObj.scene.visible=false;
            //scope.loadGuest1(glbObj);
            scope.loadGuest2(glbObj);
        });

    }
    host=function () {
        var scope=this;
        let order_list=[
            [1, 2, 3, 3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 3, 1, 2, 1, 4, 0, 3, 1, 2, 1, 4, 0, 3, 1, 2, 1, 4]
        ];
        let time_list=[3845];
        var move_num = order_list[0].length;//面部动作数量
        var move_time = time_list[0]/move_num;//每个动作的时间
        //var model_url = "./voice.gltf";
        var model_url = "./myModel/host/voice2.glb";//"../_DATA_/voice.glb";
        var mp3_url = "./myModel/host/vioce2.m4a";//"../_DATA_/voice.mp3";
        var mp3 = new Audio(mp3_url);

        var mixer = {};
        var clock = new THREE.Clock();
        var upda = 0;
        var past_time =0;//第一次播放时，音频会相对动画延迟。

        initModel()
        function initModel(){//ResourceLoader.js中加载人物模型（function initModel）
            scope.myNetwork.getGlb(model_url, function (obj){
                console.log(obj)
                var model = obj.scene;
                //console.log(model);
                model.position.set(198,9,-65);
                model.rotation.set(0,-Math.PI/2,0);
                model.scale.set(10,10,10);
                model.traverse(function (node) {
                    if(node instanceof THREE.SkinnedMesh){
                        node.material.side=THREE.DoubleSide;
                        node.frustumCulled=false;
                    }
                })
                scope.obj.add(model);
                //将模型绑定到动画混合器里面
                var anima = obj.animations;
                mixer[0] = new Pack.AnimationMixer( model );
                mixer[1] = new Pack.AnimationMixer( model );
                mixer[2] = new Pack.AnimationMixer( model );
                mixer[3] = new Pack.AnimationMixer( model );
                mixer[4] = new Pack.AnimationMixer( model );
                mixer[5] = new Pack.AnimationMixer( model );
                mixer[6] = new Pack.AnimationMixer( model );
                //同时将这个外部模型的动画全部绑定到动画混合器里面
                mixer[0].clipAction(anima[5]).play();//b
                mixer[1].clipAction(anima[7]).play();//d
                mixer[2].clipAction(anima[3]).play();//a
                mixer[3].clipAction(anima[6]).play();//e
                mixer[4].clipAction(anima[10]).play();//u
                mixer[5].clipAction(anima[1]).play();//static
                mixer[6].clipAction(anima[0]).play();//static
            })
        }
        window.play=play;
        function play() {
            var boneArm=[]
            var boneFace=[]
            for(var i=70;i<120;i++){//216
                boneFace.push(i);
            }
            for(i=0;i<216;i++){//216
                boneArm.push(i);
            }
            var stop=false;
            console.log("开始播放动画");

            animate0();//开始播放动画
            function animate0() {
                requestAnimationFrame( animate0 );
                var time = clock.getDelta() * 1000;
                if(stop){
                    mixer[6].update(0.01);//手臂
                }else{
                    upda = getUpda();
                    mixer[5].update(0.01,boneArm);//肢体
                    mixer[upda].update(0.019,boneFace);//口型
                    past_time += time;
                }
            }
            function getUpda(){
                var n=parseInt( past_time / move_time );
                console.log(move_num,n)
                if(n<move_num){
                    upda = order_list[0][n];
                }else{
                    upda = order_list[0][move_num-1]//播放过慢
                }
                return upda;
            }
            mp3.play();

            mp3.addEventListener('ended', function () {//监听到播放结束后，在此处可调用自己的接口
                console.log("完成语音播放！")
                stop=true;
            }, false);
        }


    }
    host0=function () {
        var loader= new THREE.GLTFLoader();
        loader.load("myModel/avatar/host.glb", (glb) => {
            glb.scenes[0].position.set(198,9,-65);
            glb.scenes[0].rotation.set(0,-Math.PI/2,0);
            glb.scenes[0].scale.set(10,10,10);
            scope.obj.add(glb.scenes[0]);
        });
        //new ParamMeasure(this.obj,0);
    }
    loadGuest1=function (glbObj) {
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
    loadGuest2=function (glbObj) {
        //开始创建PM对象
        var LODArray=[30,60,90]//4个数字表示距离，可以将模型分为5级;
        var path='./myModel/dongshizhang5';
        var pmLoader = new MyPMLoader(
            glbObj,
            path,    //模型路径
            LODArray,//LOD等级的数组
            this.camera,  //LOD需要判断到相机的距离
            0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
            0.02,     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
            ["Texture_0_0.jpeg","Texture_0_1.jpeg"],
            function(){
                if(window.myClock_High0)
                    console.log("高模加载时间："+(window.myClock-window.myClock_High0));
            },
            1
        );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
        var myModel=pmLoader.rootObject;
        myModel.scale.set(0.024,0.024,0.024);
        myModel.position.set(191,18.1,-11);//191,9,-11
        myModel.rotation.set(0,Math.PI,0);
        //new ParamMeasure(myModel,0);
        window.guest=myModel
        this.obj.add(myModel);
        //完成创建PM对象
    }
    analysis=function () {
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
    analysis2=function () {
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
            var k=0.5;
            for(var index=0;index<peoples.instanceCount;index++){
                peoples.rotationSet(index,[Math.PI/2,0,3*Math.PI/2]);
                peoples.positionSet(index,[scope.positions[index][0]+1.8,scope.positions[index][1]+1.5,scope.positions[index][2]]);
                peoples.scaleSet(index,[0.045*k,0.045*k,(0.04+Math.random()*0.01)*k]);

                peoples.textureSet(index,Math.floor(Math.random()*16));
                peoples.faceShapeSet(index,Math.random()*3.5)
            }
            //完成
            scope.obj.add(peoples.obj);

            //先等待贴图的加载，以防初始时贴图未完全加载影响测量结果
            setTimeout(function () {
                var result="";
                var myInterval=setInterval(function () {
                    var tag=window.tag;
                    result=result+","+tag.innerHTML;
                    //console.log(tag)
                    if(peoples.instanceCount>=scope.positions.length||parseInt(tag.innerHTML)<=2){
                        window.clearInterval(myInterval);
                        console.log(result);
                        return;
                    }else console.log(result);//console.log(parseInt(tag.innerHTML),peoples.instanceCount);
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
                        peoples.faceShapeSet(index,Math.random()*3.5)
                    }
                    scope.obj.remove(obj0);
                    scope.obj.add(peoples.obj);


                },2500);
            },10000);

        });
    }
}
export{AvatarManager}
