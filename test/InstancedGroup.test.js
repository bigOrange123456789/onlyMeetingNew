//InstancedGroup.test
function InstancedGroupTest(){
        this.scene;
        this.camera;

        this.tag;
        this.button_flag;
        this.referee;
        this.frameIndex;
        this.frameIndexPre;
}
InstancedGroupTest.prototype={
        setContext:function () {
                this.frameIndex=this.frameIndexPre=0;
                var nameContext="";
                console.log('set context:'+nameContext);

                var scope=this;
                this.referee=new Referee();
                this.tag=new Text("","green",25);
                this.button_flag=true;
                var button=new Button("test","green",25);
                button.addEvent(function () {
                        scope.button_flag=!scope.button_flag;
                });

                var camera, scene, renderer;
                var light;
                init();
                render();
                function computeFPS() {
                        scope.tag.reStr("FPS:"+(scope.frameIndex-scope.frameIndexPre));
                        scope.frameIndexPre=scope.frameIndex;
                }
                setInterval(computeFPS,1000);
                function init() {
                        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000);
                        camera.position.z = 20;

                        scene = new THREE.Scene();

                        renderer = new THREE.WebGLRenderer();
                        renderer.setPixelRatio(window.devicePixelRatio);
                        renderer.setSize(window.innerWidth, window.innerHeight);
                        renderer.setClearColor(0xffffff);
                        document.body.appendChild( renderer.domElement );
                        //container.appendChild(renderer.domElement);

                        if (renderer.capabilities.isWebGL2 === false && renderer.extensions.has('ANGLE_instanced_arrays') === false) {
                                document.getElementById('notSupported').style.display = '';
                                return;
                        }
                        light = new THREE.AmbientLight(0xffffff,1.0)
                        scene.add(light);
                        new PlayerControl(camera);
                }
                function render(){
                        scope.frameIndex++;
                        renderer.render( scene, camera );
                        requestAnimationFrame(render);
                }
                this.scene=scene;
                this.camera=camera;
        },
        setContext2:function () {
                this.frameIndex=this.frameIndexPre=0;
                var nameContext="";
                console.log('set context:'+nameContext);

                var scope=this;
                this.referee=new Referee();
                this.tag=new Text("","green",25);
                this.button_flag=true;
                var button=new Button("test","green",25);
                button.addEvent(function () {
                        scope.button_flag=!scope.button_flag;
                });

                var camera, scene, renderer;
                var light;
                init();
                render();
                function init() {
                        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000);
                        camera.position.z = 20;

                        scene = new THREE.Scene();

                        renderer = new THREE.WebGLRenderer();
                        renderer.setPixelRatio(window.devicePixelRatio);
                        renderer.setSize(window.innerWidth, window.innerHeight);
                        renderer.setClearColor(0xffffff);
                        document.body.appendChild( renderer.domElement );
                        //container.appendChild(renderer.domElement);

                        if (renderer.capabilities.isWebGL2 === false && renderer.extensions.has('ANGLE_instanced_arrays') === false) {
                                document.getElementById('notSupported').style.display = '';
                                return;
                        }
                        light = new THREE.AmbientLight(0xffffff,1.0)
                        scene.add(light);
                        new OrbitControls(camera , renderer.domElement);
                        //new PlayerControl(camera);
                }
                function render(){
                        scope.frameIndex++;
                        renderer.render( scene, camera );
                        requestAnimationFrame(render);
                }
                this.scene=scene;
                this.camera=camera;
        },
        //无动画测试
        test1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="固定姿势模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        //console.log(glb.scene.children[0]);
                        //console.log(glb.scene.children[0].children[0].children[2]);
                        console.log(glb.scene.children[0].children[1])
                        var mesh=glb.scene.children[0].children[1];
                        var peoples = new InstancedGroup(
                            1,
                            [mesh],//这些mesh的网格应该一致
                            glb.animations[0]
                        );
                        peoples.init(
                            ['./img/texture/w/w0.jpg'],16
                        );
                        for (var i = 0; i < 1; i++) {
                                peoples.rotationSet(i, [Math.PI/2 ,0, 0]);
                                peoples.positionSet(i, [0, 0, 0]);//(i-2)*9
                                peoples.scaleSet(i, [4.5, 4.5, 4.5]);
                                peoples.typeSet(i,[5,5,5,0]);
                                //peoples.colorSet(i,[Math.random()/3,Math.random()/3,Math.random()/3]);
                        }
                        //peoples.animationSpeed = 0.1;
                        scope.scene.add(peoples.obj);
                        console.log(mesh)
                });//

                //完成测试
        },
        //无动画测试
        test2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="多模块模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("test/avatar/mm.glb", (glb) => {
                        glb.scene.traverse(node => {
                                if (node.geometry) {
                                        createObj(node);
                                }
                        });

                        function createObj(mesh) {
                                var peoples = new InstancedGroup(
                                    2,
                                    [mesh, mesh],//这些mesh的网格应该一致
                                    false
                                );
                                var texSrc = [];
                                for (i = 0; i < 16; i++) texSrc.push('./img/texture/' + i + '.jpg');
                                peoples.init(
                                    texSrc
                                );
                                for (var i = 0; i < 2; i++) {
                                        //peoples.rotationSet(i,[Math.PI/2,0,0]);
                                        peoples.positionSet(i, [3 * i, 0, 0]);
                                        peoples.scaleSet(i, [4.5, 4.5, 4.5]);
                                }
                                peoples.animationSpeed = 0.1;
                                scope.scene.add(peoples.obj);
                        }
                });//

                //完成测试
        },
        //glb模型，非专门代码测试，有动画测试
        test2_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="多模块模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                //"test/avatar/male_run.glb"
                //"myModel/avatar/Female.glb"
                loader.load("test/model/avatar/childMale_run.glb", (glb1) => {
                        //console.log(glb0);
                        loader.load("test/model/female_bend.glb", (glb2) => {
                                console.log(glb1);//scene.children[0].children[1].children
                                console.log(glb2);
                                var myGlb=glb1;
                                console.log(myGlb.scene.children[0].children[3]);
                                /*myGlb.scene.children[0].traverse(node => {
                                        if (node instanceof THREE.SkinnedMesh) {
                                                createObj(node,myGlb.animations[0]);
                                        }
                                });*/
                                //var myMesh=glb.scene.children[0].children[3].children[0];
                                //createObj(myMesh);
                                //console.log(myMesh);
                                createObj2(myGlb);
                                function createObj2(G) {
                                        //console.log(mesh);

                                        var meshMixer2 = new THREE.AnimationMixer(G.scene);
                                        meshMixer2.clipAction(glb1.animations[0]).play();
                                        setInterval(function () {
                                                meshMixer2.update(0.01);
                                        },100)
                                        //scope.scene.add(G.scene);
                                        //console.log(G.scene.children[0].children[3].children[0]);
                                        var mesh=G.scene.children[0].children[3];
                                        var mesh0=new THREE.Mesh();
                                        mesh0.rotation.set(3*Math.PI/2,0,0);
                                        mesh0.scale.set(10,10,10);
                                        mesh0.geometry=mesh.geometry;
                                        mesh0.material=mesh.material;

                                        mesh0.material.map= THREE.ImageUtils.loadTexture('test/texture/m/m1.jpg', {}, function() {
                                                //console.log(m)
                                                mesh0.material.map.flipY=false;//true;//
                                                console.log(mesh0.material.map);
                                        });
                                        scope.scene.add(mesh0);
                                }
                                function createObj(mesh,animation) {
                                        //console.log(mesh);
                                        var myController=new SkinnedMeshController();
                                        //myController.init(mesh,animation);
                                        myController.init2(mesh,animation,myGlb.scene);
                                        myController.speed=0.01;
                                        myController.mesh.position.set(0,0,0);
                                        myController.mesh.scale.set(1,1,1);
                                        scope.scene.add(myController.mesh);
                                        var mesh0=new THREE.Mesh();
                                        mesh0.geometry=myController.mesh.geometry;
                                        mesh0.material=myController.mesh.material;
                                        //scope.scene.add(mesh0);
                                        //console.log(mesh0)
                                }
                        });//
                });

                //完成测试
        },
        //只有手臂的模型
        test3:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="固定姿势模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/FemaleOnlyArm2.glb", (glb) => {
                        console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"

                        var myMesh=new SkinnedMeshController();
                        myMesh.init(
                            mesh,
                            glb.animations[0]
                        );/**/
                        var peoples = new InstancedGroup(
                            2,
                            [myMesh.mesh,myMesh.mesh],//这些mesh的网格应该一致
                            glb.animations[0]
                        );
                        var texSrc = [];
                        for (i = 0; i < 16; i++) texSrc.push('./img/texture/' + i + '.jpg');
                        peoples.init(
                            texSrc
                        );
                        for (var i = 0; i < 2; i++) {
                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(i, [3 * i, 0, 0]);
                                peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                        }
                        peoples.animationSpeed = 0.1;
                        scope.scene.add(peoples.obj);
                        console.log(mesh)
                });//
                //完成测试
        },
        //glb模型的场景测试
        test4:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="固定姿势模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("test/city2.glb", (glb) => {
                        console.log(glb);
                        //console.log(glb.scene.children[0].children[0]);//OnlyArm
                        glb.scene.traverse(node=>{
                                if(typeof(node.material!=="undefined")){
                                        scope.scene.add(node);
                                        node.material=new THREE.MeshBasicMaterial();
                                }
                        });
                        //var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        //scope.scene.add(mesh);

                });//

                //完成测试
        },
        //输出帧序号，用于验证
        test5:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"

                        var peoples = new InstancedGroup(
                            1,
                            [mesh],//这些mesh的网格应该一致
                            glb.animations[0]
                        );
                        peoples.init(
                            ['./img/texture/w/w0.jpg']
                        );
                        for (var i = 0; i < 1; i++) {
                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(i, [3 * i, 0, 0]);
                                peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                peoples.speedSet(i,0.1);
                        }
                        scope.scene.add(peoples.obj);


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                                //输出帧序号，用于验证
                                var time=peoples.time; var frame_index;
                                var speed=peoples.speed.array[0],
                                    t=((time*speed)/16.0-Math.floor((time*speed)/16.0))*16.0;//将time*speed对8取余结果：[0，7)

                                if(t>-0.5&&t<=0.5)frame_index=0;
                                else if(t>0.5&&t<=1.5)frame_index=1;
                                else if(t>1.5&&t<=2.5)frame_index=2;
                                else if(t>2.5&&t<=3.5)frame_index=3;
                                else if(t>3.5&&t<=4.5)frame_index=4;
                                else if(t>4.5&&t<=5.5)frame_index=5;
                                else if(t>5.5&&t<=6.5)frame_index=6;
                                else if(t>6.5&&t<=7.5)frame_index=7;
                                else if(t>7.5&&t<=8.5)frame_index=8;
                                else if(t>8.5&&t<=9.5)frame_index=9;
                                else if(t>9.5&&t<=10.5)frame_index=10;
                                else if(t>10.5&&t<=11.5)frame_index=11;
                                else if(t>11.5&&t<=12.5)frame_index=12;
                                else if(t>12.5&&t<=13.5)frame_index=13;
                                //else if(t>13.5&&t<=14.5)frame_index=14;
                                else frame_index=14;

                                console.log(frame_index);
                                //完成验证
                        }
                });//
                //完成测试
        },
        //有动画测试
        test5_0:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"

                        var peoples = new InstancedGroup(
                            1,
                            [mesh],//这些mesh的网格应该一致
                            glb.animations[0]
                        );
                        var texSrc = [];
                        for (i = 0; i < 16; i++) texSrc.push('./img/texture/w/w' + i + '.jpg');
                        peoples.init(
                            texSrc
                        );
                        for (var i = 0; i < 1; i++) {
                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(i, [3 * i, 0, 0]);
                                peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                peoples.speedSet(i,0.5);
                        }
                        scope.scene.add(peoples.obj);

                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },
        //动画修改测试
        test5_2:function (){
                this.setContext2();
                console.log(this,this.camera)
                //this.camera.position.set(0,0,-20);
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"

                        var controller=new SkinnedMeshController();
                        controller.init(mesh,glb.animations[0]);
                        controller.mesh.rotation.set(Math.PI / 2, 0, 0);
                        controller.mesh.scale.set(0.5,0.5,0.5);
                        controller.mesh.position.set(0,-25,-100);
                        scope.scene.add(controller.mesh);

                        var measure=new ParamMeasure(glb.animations[0],2);
                        measure.boneIndex=8;
                        scope.tag.reStr("骨骼序号："+measure.boneIndex);

                        //updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },

        //观察贴图效果，区分男女贴图
        test_texture:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="贴图测试";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"


                        var peoples = new InstancedGroup(11, [mesh], glb.animations[0]);
                        peoples.init(['./img/texture/m/m'+0+'.jpg'],32);
                        for(var k=0;k<peoples.instanceCount;k++){
                                        peoples.rotationSet(k, [Math.PI / 2, 0, 0]);
                                        peoples.positionSet(k, [2*k, 0, 0]);
                                        peoples.scaleSet(k, [0.03, 0.03, 0.03]);
                                        //peoples.speedSet(0,0.1);
                                        peoples.textureSet(k,[k,k,k])
                                        scope.scene.add(peoples.obj);

                                }



                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },

        //求预处理的骨骼数据
        //使用女性模型
        //求skeletonData.json//鼓掌动画的数据//手臂骨骼动画的数据
        test6:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        //开始计算matrix
                        var animation=glb.animations[0];
                        var data=[];
                        for(var Time=0;Time<8;Time++){//0-7
                                var time=Time/2;
                                //console.log(time);
                                matrixs0=[];matrixs=[];
                                for(i=0;i<25;i++){
                                        if(time===Math.floor(time)){
                                                //console.log(Time);
                                                matrixs0.push(
                                                    compose(
                                                        animation.tracks[3*i+1].values[4*time],
                                                        animation.tracks[3*i+1].values[4*time+1],
                                                        animation.tracks[3*i+1].values[4*time+2],
                                                        animation.tracks[3*i+1].values[4*time+3],

                                                        animation.tracks[3*i+2].values[3*time],
                                                        animation.tracks[3*i+2].values[3*time+1],
                                                        animation.tracks[3*i+2].values[3*time+2],

                                                        animation.tracks[3*i].values[3*time],
                                                        animation.tracks[3*i].values[3*time+1],
                                                        animation.tracks[3*i].values[3*time+2]
                                                    )
                                                );
                                        }else{
                                                var time1=Math.floor(time);
                                                var time2=(time1+1)//%8;
                                                //console.log(time,time2);
                                                var q1,q2,q3,q4;
                                                q1=animation.tracks[3*i+1].values[4*time1];
                                                q2=animation.tracks[3*i+1].values[4*time1+1];
                                                q3=animation.tracks[3*i+1].values[4*time1+2];
                                                q4=animation.tracks[3*i+1].values[4*time1+3];

                                                var p1,p2,p3,p4;
                                                p1=animation.tracks[3*i+1].values[4*time2];
                                                p2=animation.tracks[3*i+1].values[4*time2+1];
                                                p3=animation.tracks[3*i+1].values[4*time2+2];
                                                p4=animation.tracks[3*i+1].values[4*time2+3];
                                                /*console.log(Math.pow(
                                                    q1*q1+q2*q2+q3*q3+q4*q4,0.5
                                                ));*/

                                                var A={},B={};
                                                B.x=q1;
                                                B.y=q2;
                                                B.z=q3;
                                                B.w=q4;
                                                A.x=p1;
                                                A.y=p2;
                                                A.z=p3;
                                                A.w=p4;

                                                var OUT=makeInterpolated(A,B,0.5);
                                                //console.log(A,B,OUT, (p1+q1)/2, (p2+q2)/2, (p3+q3)/2, (p4+q4)/2);

                                                function makeInterpolated(a,b,t) {//(Quaternion a, Quaternion b, float t)
                                                                 var out = {};
                                                                 //计算夹角的cos值//计算两个向量的内积
                                                                 var cosHalfTheta = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
                                                                 //如果两个向量的夹角大于180
                                                                 if(cosHalfTheta < 0.0) {
                                                                             //b = new Quaternion(b);
                                                                             cosHalfTheta = -cosHalfTheta;
                                                                             b.x = -b.x;
                                                                             b.y = -b.y;
                                                                             b.z = -b.z;
                                                                             b.w = -b.w;
                                                                         }

                                                                 //计算两个向量的夹角
                                                                 var halfTheta = Math.floor(Math.acos(cosHalfTheta));
                                                                 //计算夹角的sin值
                                                                 var sinHalfTheta = Math.floor(
                                                                     Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta)
                                                                 );
                                                                 var ratioA;
                                                                 var ratioB;
                                                                 if(Math.abs(sinHalfTheta) > 0.001) {
                                                                             var oneOverSinHalfTheta = 1.0 / sinHalfTheta;
                                                                             ratioA = Math.floor(
                                                                                 Math.sin((1.0 - t) * halfTheta) * oneOverSinHalfTheta
                                                                             );
                                                                             ratioB =Math.floor(
                                                                                 Math.sin(t * halfTheta) * oneOverSinHalfTheta
                                                                             );
                                                                 } else {
                                                                             ratioA = 1.0 - t;
                                                                             ratioB = t;
                                                                 }

                                                                 //out= ratioA*a + ratioB*b
                                                                 out.x = ratioA * a.x + ratioB * b.x;
                                                                 out.y = ratioA * a.y + ratioB * b.y;
                                                                 out.z = ratioA * a.z + ratioB * b.z;
                                                                 out.w = ratioA * a.w + ratioB * b.w;
                                                                 var l=Math.pow(
                                                                     out.x*out.x+out.y*out.y+out.z*out.z+out.w*out.w,
                                                                     0.5
                                                                 );//out.normalizeInPlace();
                                                                 out.x/=l;out.y/=l;out.z/=l;out.w/=l;
                                                                 return out;
                                                             }
                                                matrixs0.push(
                                                    compose(//quaternion scale,position
                                                        //quaternion
                                                        //OUT.x,OUT.y,OUT.z,OUT.w,
                                                        (p1+q1)/2,
                                                        (p2+q2)/2,
                                                        (p3+q3)/2,
                                                        (p4+q4)/2,
                                                        //scale
                                                        1,//animation.tracks[3*i+2].values[3*time],
                                                        1,//animation.tracks[3*i+2].values[3*time+1],
                                                        1,//animation.tracks[3*i+2].values[3*time+2],
                                                        //position
                                                        (animation.tracks[3*i].values[3*time1  ]+animation.tracks[3*i].values[3*time2])/2,
                                                        (animation.tracks[3*i].values[3*time1+1]+animation.tracks[3*i].values[3*time2+1])/2,
                                                        (animation.tracks[3*i].values[3*time1+2]+animation.tracks[3*i].values[3*time2+2])/2
                                                    )
                                                );
                                                /*console.log(
                                                    time1,
                                                    time2,
                                                    (p1+q1)/2,
                                                    (p2+q2)/2,
                                                    (p3+q3)/2,
                                                    (p4+q4)/2,
                                                    (animation.tracks[3*i].values[3*time1  ],animation.tracks[3*i].values[3*time2])/2,
                                                    (animation.tracks[3*i].values[3*time1+1],animation.tracks[3*i].values[3*time2+1])/2,
                                                    (animation.tracks[3*i].values[3*time1+2],animation.tracks[3*i].values[3*time2+2])/2
                                                );*/
                                                /*var m1=compose(
                                                    animation.tracks[3*i+1].values[4*time],
                                                    animation.tracks[3*i+1].values[4*time+1],
                                                    animation.tracks[3*i+1].values[4*time+2],
                                                    animation.tracks[3*i+1].values[4*time+3],

                                                    animation.tracks[3*i+2].values[3*time],
                                                    animation.tracks[3*i+2].values[3*time+1],
                                                    animation.tracks[3*i+2].values[3*time+2],

                                                    animation.tracks[3*i].values[3*time],
                                                    animation.tracks[3*i].values[3*time+1],
                                                    animation.tracks[3*i].values[3*time+2]
                                                );
                                                time=(time+1)%8;
                                                var m2=compose(
                                                    animation.tracks[3*i+1].values[4*time],
                                                    animation.tracks[3*i+1].values[4*time+1],
                                                    animation.tracks[3*i+1].values[4*time+2],
                                                    animation.tracks[3*i+1].values[4*time+3],

                                                    animation.tracks[3*i+2].values[3*time],
                                                    animation.tracks[3*i+2].values[3*time+1],
                                                    animation.tracks[3*i+2].values[3*time+2],

                                                    animation.tracks[3*i].values[3*time],
                                                    animation.tracks[3*i].values[3*time+1],
                                                    animation.tracks[3*i].values[3*time+2]
                                                );
                                                var m= new THREE.Matrix4();
                                                m.set(
                                                    (m1.elements[0]+m2.elements[0])/2,
                                                    (m1.elements[1]+m2.elements[1])/2,
                                                    (m1.elements[2]+m2.elements[2])/2,
                                                    (m1.elements[3]+m2.elements[3])/2,
                                                    (m1.elements[4]+m2.elements[4])/2,
                                                    (m1.elements[5]+m2.elements[5])/2,
                                                    (m1.elements[6]+m2.elements[6])/2,
                                                    (m1.elements[7]+m2.elements[7])/2,
                                                    (m1.elements[8]+m2.elements[8])/2,
                                                    (m1.elements[9]+m2.elements[9])/2,
                                                    (m1.elements[10]+m2.elements[10])/2,
                                                    (m1.elements[11]+m2.elements[11])/2,
                                                    (m1.elements[12]+m2.elements[12])/2,
                                                    (m1.elements[13]+m2.elements[13])/2,
                                                    (m1.elements[14]+m2.elements[14])/2,
                                                    (m1.elements[15]+m2.elements[15])/2
                                                );
                                                matrixs0.push(m);*/
                                        }

                                        matrixs.push(
                                            mesh.skeleton.boneInverses[i].clone()
                                        );
                                }


                                /////矩阵3没有乘以逆矩阵
                                var tool=matrixs0[0];
                                matrixs[0]=tool.clone().multiply(matrixs[0]);tool=tool.clone().multiply(matrixs0[1]);
                                matrixs[1]=tool.clone().multiply(matrixs[1]);tool=tool.clone().multiply(matrixs0[2]);
                                matrixs[2]=tool.clone().multiply(matrixs[2]);tool=tool.clone().multiply(matrixs0[3]);  var  _tool3=tool;
                                matrixs[3]=tool.clone().multiply(matrixs[3]);tool=tool.clone().multiply(matrixs0[4]);
                                matrixs[4]=tool.clone().multiply(matrixs[4]);tool=tool.clone().multiply(matrixs0[5]);
                                matrixs[5]=tool.clone().multiply(matrixs[5]);tool=tool.clone().multiply(matrixs0[6]);
                                matrixs[6]=tool.clone().multiply(matrixs[6]);

                                tool=_tool3;
                                tool=tool.clone().multiply(matrixs0[7]);
                                matrixs[7]=tool.clone().multiply(matrixs[7]);tool=tool.clone().multiply(matrixs0[8]);
                                matrixs[8]=tool.clone().multiply(matrixs[8]);tool=tool.clone().multiply(matrixs0[9]);
                                matrixs[9]=tool.clone().multiply(matrixs[9]);tool=tool.clone().multiply(matrixs0[10]);
                                matrixs[10]=tool.clone().multiply(matrixs[10]);

                                tool=_tool3;
                                tool=tool.clone().multiply(matrixs0[11]);
                                matrixs[11]=tool.clone().multiply(matrixs[11]);tool=tool.clone().multiply(matrixs0[12]);
                                matrixs[12]=tool.clone().multiply(matrixs[12]);tool=tool.clone().multiply(matrixs0[13]);
                                matrixs[13]=tool.clone().multiply(matrixs[13]);tool=tool.clone().multiply(matrixs0[14]);
                                matrixs[14]=tool.clone().multiply(matrixs[14]);

                                tool=matrixs0[0].clone().multiply(matrixs0[15]);
                                matrixs[15]=tool.clone().multiply(matrixs[15]);tool=tool.clone().multiply(matrixs0[16]);
                                matrixs[16]=tool.clone().multiply(matrixs[16]);tool=tool.clone().multiply(matrixs0[17]);
                                matrixs[17]=tool.clone().multiply(matrixs[17]);tool=tool.clone().multiply(matrixs0[18]);
                                matrixs[18]=tool.clone().multiply(matrixs[18]);tool=tool.clone().multiply(matrixs0[19]);
                                matrixs[19]=tool.clone().multiply(matrixs[19]);

                                tool=matrixs0[0].clone().multiply(matrixs0[20]);
                                matrixs[20]=tool.clone().multiply(matrixs[20]);tool=tool.clone().multiply(matrixs0[21]);
                                matrixs[21]=tool.clone().multiply(matrixs[21]);tool=tool.clone().multiply(matrixs0[22]);
                                matrixs[22]=tool.clone().multiply(matrixs[22]);tool=tool.clone().multiply(matrixs0[23]);
                                matrixs[23]=tool.clone().multiply(matrixs[23]);tool=tool.clone().multiply(matrixs0[24]);
                                matrixs[24]=tool.clone().multiply(matrixs[24]);
                                //完成计算matrix

                                for (i of [7, 8, 9, 10, 11, 12, 13, 14]) {
                                        var temp = matrixs[i].toArray();
                                        for (j = 0; j < 16; j++) {
                                                //data.push(arr[j]);
                                        }
                                        data.push(temp[0]);
                                        data.push(temp[1]);
                                        data.push(temp[2]);
                                        data.push(temp[4]);
                                        data.push(temp[5]);
                                        data.push(temp[6]);
                                        data.push(temp[8]);
                                        data.push(temp[9]);
                                        data.push(temp[10]);
                                        data.push(temp[12]);
                                        data.push(temp[13]);
                                        data.push(temp[14]);
                                }


                        }//iii
                        let link = document.createElement('a');
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.href = URL.createObjectURL(new Blob([JSON.stringify({data:data})], { type: 'text/plain' }));
                        link.download ="skeletonData.json";
                        //console.log(data);
                        link.click();
                        function compose(x,y,z,w,sx,sy,sz,px,py,pz ) {//quaternion scale,position
                                var x2 = x + x,	y2 = y + y, z2 = z + z;
                                var xx = x * x2, xy = x * y2, xz = x * z2;
                                var yy = y * y2, yz = y * z2, zz = z * z2;
                                var wx = w * x2, wy = w * y2, wz = w * z2;
                                te = new THREE.Matrix4();
                                te.set(
                                    ( 1.0-( yy + zz ) ) * sx,( xy - wz ) * sy        ,( xz + wy ) * sz        ,px,
                                    ( xy + wz ) * sx        ,( 1.0-( xx + zz ) ) * sy,( yz - wx ) * sz        ,py,
                                    ( xz - wy ) * sx        ,( yz + wx ) * sy        ,( 1.0-( xx + yy ) ) * sz,pz,
                                    0.0                     ,0.0                     ,0.0                     ,1.0
                                );
                                return te;
                        }
                });//
                //完成测试
        },
        //举手动作的数据
        test6_2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        new ParamMeasure(glb.animations[0],2);//设置举手动作

                        console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"

                        //开始计算matrix
                        var animation=glb.animations[0];
                        var data=[];
                        for(var Time=0;Time<1;Time++){//只输出一帧
                                var time=Time/2;
                                //console.log(time);
                                matrixs0=[];matrixs=[];
                                for(i=0;i<25;i++){
                                        if(time===Math.floor(time)){
                                                //console.log(Time);
                                                matrixs0.push(
                                                    compose(
                                                        animation.tracks[3*i+1].values[4*time],
                                                        animation.tracks[3*i+1].values[4*time+1],
                                                        animation.tracks[3*i+1].values[4*time+2],
                                                        animation.tracks[3*i+1].values[4*time+3],

                                                        animation.tracks[3*i+2].values[3*time],
                                                        animation.tracks[3*i+2].values[3*time+1],
                                                        animation.tracks[3*i+2].values[3*time+2],

                                                        animation.tracks[3*i].values[3*time],
                                                        animation.tracks[3*i].values[3*time+1],
                                                        animation.tracks[3*i].values[3*time+2]
                                                    )
                                                );
                                        }else{
                                                var time1=Math.floor(time);
                                                var time2=(time1+1)//%8;//console.log(time,time2);
                                                var q1,q2,q3,q4;
                                                q1=animation.tracks[3*i+1].values[4*time1];
                                                q2=animation.tracks[3*i+1].values[4*time1+1];
                                                q3=animation.tracks[3*i+1].values[4*time1+2];
                                                q4=animation.tracks[3*i+1].values[4*time1+3];

                                                var p1,p2,p3,p4;
                                                p1=animation.tracks[3*i+1].values[4*time2];
                                                p2=animation.tracks[3*i+1].values[4*time2+1];
                                                p3=animation.tracks[3*i+1].values[4*time2+2];
                                                p4=animation.tracks[3*i+1].values[4*time2+3];

                                                var A={},B={};
                                                B.x=q1;
                                                B.y=q2;
                                                B.z=q3;
                                                B.w=q4;
                                                A.x=p1;
                                                A.y=p2;
                                                A.z=p3;
                                                A.w=p4;

                                                var OUT=makeInterpolated(A,B,0.5);
                                                //console.log(A,B,OUT, (p1+q1)/2, (p2+q2)/2, (p3+q3)/2, (p4+q4)/2);

                                                function makeInterpolated(a,b,t) {//(Quaternion a, Quaternion b, float t)
                                                        var out = {};
                                                        //计算夹角的cos值//计算两个向量的内积
                                                        var cosHalfTheta = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
                                                        //如果两个向量的夹角大于180
                                                        if(cosHalfTheta < 0.0) {
                                                                //b = new Quaternion(b);
                                                                cosHalfTheta = -cosHalfTheta;
                                                                b.x = -b.x;
                                                                b.y = -b.y;
                                                                b.z = -b.z;
                                                                b.w = -b.w;
                                                        }

                                                        //计算两个向量的夹角
                                                        var halfTheta = Math.floor(Math.acos(cosHalfTheta));
                                                        //计算夹角的sin值
                                                        var sinHalfTheta = Math.floor(
                                                            Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta)
                                                        );
                                                        var ratioA;
                                                        var ratioB;
                                                        if(Math.abs(sinHalfTheta) > 0.001) {
                                                                var oneOverSinHalfTheta = 1.0 / sinHalfTheta;
                                                                ratioA = Math.floor(
                                                                    Math.sin((1.0 - t) * halfTheta) * oneOverSinHalfTheta
                                                                );
                                                                ratioB =Math.floor(
                                                                    Math.sin(t * halfTheta) * oneOverSinHalfTheta
                                                                );
                                                        } else {
                                                                ratioA = 1.0 - t;
                                                                ratioB = t;
                                                        }

                                                        //out= ratioA*a + ratioB*b
                                                        out.x = ratioA * a.x + ratioB * b.x;
                                                        out.y = ratioA * a.y + ratioB * b.y;
                                                        out.z = ratioA * a.z + ratioB * b.z;
                                                        out.w = ratioA * a.w + ratioB * b.w;
                                                        var l=Math.pow(
                                                            out.x*out.x+out.y*out.y+out.z*out.z+out.w*out.w,
                                                            0.5
                                                        );//out.normalizeInPlace();
                                                        out.x/=l;out.y/=l;out.z/=l;out.w/=l;
                                                        return out;
                                                }
                                                matrixs0.push(
                                                    compose(//quaternion scale,position
                                                        (p1+q1)/2,
                                                        (p2+q2)/2,
                                                        (p3+q3)/2,
                                                        (p4+q4)/2,
                                                        1,//scale//animation.tracks[3*i+2].values[3*time],
                                                        1,//animation.tracks[3*i+2].values[3*time+1],
                                                        1,//animation.tracks[3*i+2].values[3*time+2],
                                                        (animation.tracks[3*i].values[3*time1  ]+animation.tracks[3*i].values[3*time2])/2,//position
                                                        (animation.tracks[3*i].values[3*time1+1]+animation.tracks[3*i].values[3*time2+1])/2,
                                                        (animation.tracks[3*i].values[3*time1+2]+animation.tracks[3*i].values[3*time2+2])/2
                                                    )
                                                );
                                        }

                                        matrixs.push(
                                            mesh.skeleton.boneInverses[i].clone()
                                        );
                                }


                                /////矩阵3没有乘以逆矩阵
                                var tool=matrixs0[0];
                                matrixs[0]=tool.clone().multiply(matrixs[0]);tool=tool.clone().multiply(matrixs0[1]);
                                matrixs[1]=tool.clone().multiply(matrixs[1]);tool=tool.clone().multiply(matrixs0[2]);
                                matrixs[2]=tool.clone().multiply(matrixs[2]);tool=tool.clone().multiply(matrixs0[3]);  var  _tool3=tool;
                                matrixs[3]=tool.clone().multiply(matrixs[3]);tool=tool.clone().multiply(matrixs0[4]);
                                matrixs[4]=tool.clone().multiply(matrixs[4]);tool=tool.clone().multiply(matrixs0[5]);
                                matrixs[5]=tool.clone().multiply(matrixs[5]);tool=tool.clone().multiply(matrixs0[6]);
                                matrixs[6]=tool.clone().multiply(matrixs[6]);

                                tool=_tool3;
                                tool=tool.clone().multiply(matrixs0[7]);
                                matrixs[7]=tool.clone().multiply(matrixs[7]);tool=tool.clone().multiply(matrixs0[8]);
                                matrixs[8]=tool.clone().multiply(matrixs[8]);tool=tool.clone().multiply(matrixs0[9]);
                                matrixs[9]=tool.clone().multiply(matrixs[9]);tool=tool.clone().multiply(matrixs0[10]);
                                matrixs[10]=tool.clone().multiply(matrixs[10]);

                                tool=_tool3;
                                tool=tool.clone().multiply(matrixs0[11]);
                                matrixs[11]=tool.clone().multiply(matrixs[11]);tool=tool.clone().multiply(matrixs0[12]);
                                matrixs[12]=tool.clone().multiply(matrixs[12]);tool=tool.clone().multiply(matrixs0[13]);
                                matrixs[13]=tool.clone().multiply(matrixs[13]);tool=tool.clone().multiply(matrixs0[14]);
                                matrixs[14]=tool.clone().multiply(matrixs[14]);

                                tool=matrixs0[0].clone().multiply(matrixs0[15]);
                                matrixs[15]=tool.clone().multiply(matrixs[15]);tool=tool.clone().multiply(matrixs0[16]);
                                matrixs[16]=tool.clone().multiply(matrixs[16]);tool=tool.clone().multiply(matrixs0[17]);
                                matrixs[17]=tool.clone().multiply(matrixs[17]);tool=tool.clone().multiply(matrixs0[18]);
                                matrixs[18]=tool.clone().multiply(matrixs[18]);tool=tool.clone().multiply(matrixs0[19]);
                                matrixs[19]=tool.clone().multiply(matrixs[19]);

                                tool=matrixs0[0].clone().multiply(matrixs0[20]);
                                matrixs[20]=tool.clone().multiply(matrixs[20]);tool=tool.clone().multiply(matrixs0[21]);
                                matrixs[21]=tool.clone().multiply(matrixs[21]);tool=tool.clone().multiply(matrixs0[22]);
                                matrixs[22]=tool.clone().multiply(matrixs[22]);tool=tool.clone().multiply(matrixs0[23]);
                                matrixs[23]=tool.clone().multiply(matrixs[23]);tool=tool.clone().multiply(matrixs0[24]);
                                matrixs[24]=tool.clone().multiply(matrixs[24]);
                                //完成计算matrix

                                for (i of [7, 8, 9, 10, 11, 12, 13, 14]) {
                                        var temp = matrixs[i].toArray();
                                        for (j = 0; j < 16; j++) {
                                                //data.push(arr[j]);
                                        }
                                        data.push(temp[0]);
                                        data.push(temp[1]);
                                        data.push(temp[2]);
                                        data.push(temp[4]);
                                        data.push(temp[5]);
                                        data.push(temp[6]);
                                        data.push(temp[8]);
                                        data.push(temp[9]);
                                        data.push(temp[10]);
                                        data.push(temp[12]);
                                        data.push(temp[13]);
                                        data.push(temp[14]);
                                }


                        }//iii
                        console.log(data);
                        //骨骼数据
                        var myInstanceGroup=new InstancedGroup();
                        var data=[177,67,193,160,193,195,195,177,48,160,193,193,177,67,192,49,192,195,195,177,176,163,193,193,178,67,48,49,49,195,195,178,177,176,193,193,179,67,65,49,65,195,195,178,178,176,194,193,178,67,64,49,64,195,195,178,177,163,193,193,177,67,32,177,1,195,195,177,49,49,193,193,195,177,49,177,1,195,49,195,160,48,193,193,176,177,195,179,195,49,195,51,35,35,192,194,65,67,64,49,64,195,195,65,48,49,64,195,65,67,0,1,0,195,195,65,129,49,49,195,65,67,0,1,0,195,195,65,129,49,49,195,65,67,0,1,0,195,195,65,129,49,49,195,49,176,195,64,195,49,195,192,177,176,192,193,193,67,64,49,64,195,195,193,179,178,64,195,193,67,0,130,0,195,195,193,1,192,49,195,193,67,0,130,0,195,195,193,1,192,49,195,193,67,0,130,0,195,195,193,1,192,49,195,50,67,65,50,65,195,195,51,177,176,194,193,194,66,193,66,64,195,194,194,194,192,194,194,48,193,195,67,192,51,192,195,65,192,194,194,48,193,195,67,192,51,192,195,65,192,194,194,192,67,65,48,65,195,195,179,178,161,194,193,65,67,193,194,49,195,194,66,65,64,194,194,64,192,195,195,193,178,193,67,192,64,194,194,64,192,195,195,193,178,193,67,192,64,194,194,50,67,65,50,65,195,195,50,177,176,194,193,194,67,193,66,64,195,194,194,194,192,194,194,35,193,195,67,193,51,193,195,64,192,194,194,35,193,195,67,193,51,193,195,64,192,194,194,192,67,65,48,65,195,195,179,178,161,194,193,65,67,193,194,17,195,194,65,65,64,193,194,64,192,195,195,193,178,193,67,192,65,194,194,64,192,195,195,193,178,193,67,192,65,194,194,49,67,65,50,65,195,195,50,177,176,194,193,194,67,193,66,64,195,194,194,194,192,194,194,34,193,195,67,193,51,193,195,64,192,194,194,34,193,195,67,193,51,193,195,64,192,194,194,192,67,65,48,65,195,195,179,178,161,194,193,65,67,193,194,177,195,194,65,65,65,193,194,64,192,195,195,193,178,193,67,192,65,193,194,64,192,195,195,193,178,193,67,192,65,193,194,49,67,65,50,65,195,195,50,177,176,194,193,193,67,193,66,51,195,194,194,194,193,194,194,32,192,195,67,193,51,193,195,64,192,194,194,32,192,195,67,193,51,193,195,64,192,194,194,192,67,65,48,65,195,195,179,178,161,194,193,65,67,193,194,178,195,195,65,65,65,193,194,64,192,195,195,194,178,194,67,192,65,193,194,64,192,195,195,194,178,194,67,192,65,193,194,49,67,65,50,65,195,195,50,178,176,194,193,193,67,193,66,51,195,194,194,194,193,194,194,160,192,195,67,193,51,193,195,64,193,194,194,160,192,195,67,193,51,193,195,64,193,194,194,192,67,65,48,65,195,195,192,178,161,194,193,65,67,193,194,179,195,195,65,65,65,193,194,64,192,195,195,194,178,194,67,192,65,193,194,64,192,195,195,194,178,194,67,192,65,193,194,49,67,65,50,65,195,195,50,178,176,194,193,193,67,193,66,50,195,194,194,194,193,194,194,33,192,195,67,193,51,193,195,64,193,194,194,33,192,195,67,193,51,193,195,64,193,194,194,192,67,65,48,65,195,195,192,178,161,194,193,64,67,193,194,192,195,195,65,65,65,193,194,64,192,195,195,194,177,194,67,192,65,193,194,64,192,195,195,194,177,194,67,192,65,193,194,49,67,65,50,65,195,195,50,178,176,194,193,193,67,193,66,50,195,194,193,194,193,194,194,48,192,195,67,193,64,193,195,64,193,194,194,48,192,195,67,193,64,193,195,64,193,194,194,192,67,65,48,65,195,195,192,178,160,194,193,64,67,193,194,192,195,195,65,65,65,193,194,64,192,195,194,194,177,194,66,192,65,193,194,64,192,195,194,194,177,194,66,192,65,193,194,49,67,65,50,65,195,195,50,178,176,194,193,193,67,193,66,49,194,194,193,194,193,193,194,48,192,195,67,193,64,193,195,64,193,194,194,48,192,195,67,193,64,193,195,64,193,194,194,192,67,65,48,65,195,195,192,177,147,194,193,64,67,193,194,192,195,195,65,65,65,193,194,64,192,195,194,194,176,194,66,192,65,193,194,64,192,195,194,194,176,194,66,192,65,193,194,162,180,57,118,58,181,231,137,142,217,78,142,175,199,249,6,249,200,230,227,146,107,93,136,108,229,253,76,18,231,229,99,93,113,185,122,45,183,41,136,45,184,227,146,106,144,50,136,214,223,107,38,110,225,228,177,115,100,198,119,89,231,143,150,95,231,230,89,150,105,129,118,230,89,150,150,97,231,89,231,143,231,143,118,109,7,231,98,227,15,228,101,89,43,249,2,8,181,168,33,166,217,195,9,165,243,159,89,156,142,0,85,0,231,142,156,31,142,139,111,156,142,0,83,0,231,142,156,30,142,139,111,156,142,0,83,0,231,142,156,30,142,139,111,250,241,230,157,219,62,218,158,205,211,251,254,64,167,146,58,165,217,178,55,56,165,153,81,133,153,203,59,0,231,153,133,235,100,8,111,133,153,205,59,0,231,153,133,235,100,8,111,133,153,205,59,0,231,153,133,235,100,8,111,106,180,54,116,50,181,228,14,150,230,46,137,64,254,29,65,134,37,66,116,7,242,63,38,125,16,194,201,233,19,246,165,4,236,87,102,125,16,194,201,233,19,246,165,4,236,87,102,105,177,53,196,56,181,226,174,3,206,54,138,222,66,16,18,22,79,187,37,200,248,5,22,147,199,200,150,135,75,111,130,240,253,26,83,147,199,200,150,135,75,111,130,240,253,26,83,44,181,53,126,49,181,228,214,180,232,46,136,39,15,29,73,120,33,82,97,12,246,53,40,81,10,195,193,6,43,18,159,254,241,76,104,81,10,195,193,6,43,18,159,254,241,76,104,107,177,51,202,55,182,226,190,13,188,54,138,173,93,14,21,168,77,216,251,203,253,241,24,155,187,201,126,187,61,162,108,237,2,5,85,155,187,201,126,187,61,162,108,237,2,5,85,238,182,51,136,48,182,228,157,209,234,45,136,15,32,29,81,106,30,96,78,18,251,42,42,9,5,197,185,35,71,46,152,247,247,66,106,9,5,197,185,35,71,46,152,247,247,66,106,109,177,49,207,53,182,225,205,22,169,53,138,123,116,14,24,21,75,241,209,208,1,220,26,161,176,202,100,236,36,212,84,232,7,240,87,161,176,202,100,236,36,212,84,232,7,240,87,176,182,50,147,47,182,228,101,239,236,45,136,246,48,28,88,154,26,110,58,24,0,31,44,167,255,198,175,63,91,74,144,240,251,55,108,167,255,198,175,63,91,74,144,240,251,55,108,110,178,48,213,52,182,225,220,32,151,53,138,71,137,13,24,43,73,9,164,211,3,200,28,168,164,203,71,28,24,4,56,228,11,219,89,168,164,203,71,28,24,4,56,228,11,219,89,114,183,49,157,46,182,229,44,12,238,45,136,220,63,28,95,11,22,123,37,30,4,20,47,107,249,200,165,91,115,102,135,232,0,43,111,107,249,200,165,91,115,102,135,232,0,43,111,112,178,46,219,51,183,225,100,41,132,53,138,19,155,12,24,72,71,29,119,216,5,179,29,172,152,205,39,74,2,51,27,224,13,198,91,172,152,205,39,74,2,51,27,224,13,198,91,107,184,47,166,44,183,229,39,24,241,44,136,194,77,28,107,159,14,130,17,41,10,12,52,160,242,202,154,116,201,129,127,221,6,34,116,160,242,202,154,116,201,129,127,221,6,34,116,112,178,45,204,49,183,225,101,25,28,52,138,234,164,18,33,107,63,36,89,227,10,163,35,164,146,207,16,106,140,85,4,216,17,182,97,164,146,207,16,106,140,85,4,216,17,182,97,100,184,45,176,42,183,228,34,37,245,44,136,168,91,28,118,47,5,137,252,53,16,3,58,100,235,203,143,141,105,155,118,210,11,25,122,100,235,203,143,141,105,155,118,210,11,25,122,112,179,43,189,47,184,225,101,9,181,51,138,194,171,24,41,130,54,41,59,238,14,147,42,155,140,209,248,136,18,118,235,207,21,166,103,155,140,209,248,136,18,118,235,207,21,166,103,93,185,44,185,41,184,228,29,49,248,43,136,142,104,27,129,189,253,143,230,65,21,250,64,158,228,205,131,166,113,181,109,198,16,16,128,158,228,205,131,166,113,181,109,198,16,16,128,112,179,42,173,46,185,225,102,249,15,51,138,153,178,29,48,154,45,45,28,250,17,131,48,146,135,211,222,165,161,150,210,198,24,149,109,146,135,211,222,165,161,150,210,198,24,149,109];

                        //一帧的举起动作数据
                        var data0=[5.976657588905034, 98.48375054948563, 16.285904180278756, -80.3511186825539, 14.426877434095344, -57.75434378553895, -59.22819985564254, -9.63412027793715, 79.99503635395334, 46.296978542202666, -47.76764014205489, -55.88020736336959, 76.80771442140902, -1.7139102478996069, 64.01276819602492, -50.61358157784039, 59.61286858661085, 62.32637210898638, -39.228060227016066, -80.27062820113241, 44.919793775065365, 33.070708949926896, -82.61428855447156, -108.22070224396808, -35.15087842356431, 85.53226333659336, 38.06118679422992, -80.82899685709455, -48.239942021032725, 33.75776304074927, 47.23445907341313, -18.89831054024354, 86.09157315203186, 64.9931792203358, -23.001560557750718, -82.84258606974103, -79.9110397847895, -38.47499452887394, -46.1941581701171, 26.18537423053942, -91.44250849202878, 30.864239695198055, -54.11611107369065, 12.567834034794274, 83.14745778649501, -6.904969876230663, -3.1346654276780193, -86.40805754652862, -10.56613686978628, 94.5151954686116, 30.906898146858126, 1.9610022844431718, 31.27289622694558, -94.96405153282026, -99.42091936222543, -9.427947825516808, -5.157758387904945, -0.462845552415049, -56.692662147534904, -39.457180631456595, 47.84985831041387, 83.48888311332851, -27.2029617519698, -53.037092097749294, 2.789504884055482, -84.73068013874388, -69.98183640049139, 54.97112628857072, 45.61485916502842, 24.876558985522053, -51.708040707870545, -53.48582351901744, 14.720548879193661, -19.951909135007188, -96.8774455662211, -91.81039601632807, -39.19571027042463, -5.8782502987165905, -36.79889979718007, 89.80880501081667, -24.087755775660234, 25.30285156677777, -53.81970786742822, -59.57225724640013, 14.720549386919787, -19.951909900929138, -96.87744415602877, -91.81040867921745, -39.19570177386595, -5.878252853666185, -36.798908162806924, 89.80880334197744, -24.0877570617659, 25.302859705842934, -53.81970410154432, -59.5722723162082];
                        var data1=[],data2=[];
                        for(var i=0;i<data0.length;i++){
                                var result=myInstanceGroup.encode(data0[i]);
                                data1.push(result[0]);
                                data2.push(result[1]);
                        }
                        var kk=data.length/2;
                        console.log(data1.length)//96
                        console.log(data.length/2)//972
                        for(var k=0;k<data1.length;k++){
                                data.splice(k+kk,0,data1[k]);
                                //console.log(k+kk,data0);
                        }
                        for(var k=0;k<data1.length;k++){
                                data.push(data2[k]);
                        }
                        console.log(data);
                        console.log(data.length/2)//1068
                        let link = document.createElement('a');
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.href = URL.createObjectURL(new Blob([JSON.stringify({data:data})], { type: 'text/plain' }));
                        link.download ="skeletonData.json";
                        link.click();
                        function compose(x,y,z,w,sx,sy,sz,px,py,pz ) {//quaternion scale,position
                                var x2 = x + x,	y2 = y + y, z2 = z + z;
                                var xx = x * x2, xy = x * y2, xz = x * z2;
                                var yy = y * y2, yz = y * z2, zz = z * z2;
                                var wx = w * x2, wy = w * y2, wz = w * z2;
                                te = new THREE.Matrix4();
                                te.set(
                                    ( 1.0-( yy + zz ) ) * sx,( xy - wz ) * sy        ,( xz + wy ) * sz        ,px,
                                    ( xy + wz ) * sx        ,( 1.0-( xx + zz ) ) * sy,( yz - wx ) * sz        ,py,
                                    ( xz - wy ) * sx        ,( yz + wx ) * sy        ,( 1.0-( xx + yy ) ) * sz,pz,
                                    0.0                     ,0.0                     ,0.0                     ,1.0
                                );
                                return te;
                        }
                });//
                //完成测试
        },
        //求skeletonMatrix.json////求不动位置的骨骼//肢体动作的数据
        test7:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        //开始计算matrix
                        var animation=glb.animations[0];
                        var data=[];
                        //for(var Time=0;Time<16;Time++){//0-7
                        var time=0;
                                //var time=Time/2;
                                //console.log(time);
                                matrixs0=[];matrixs=[];
                                for(i=0;i<25;i++){
                                        matrixs0.push(
                                            compose(
                                                animation.tracks[3 * i + 1].values[4 * time],
                                                animation.tracks[3 * i + 1].values[4 * time + 1],
                                                animation.tracks[3 * i + 1].values[4 * time + 2],
                                                animation.tracks[3 * i + 1].values[4 * time + 3],

                                                animation.tracks[3 * i + 2].values[3 * time],
                                                animation.tracks[3 * i + 2].values[3 * time + 1],
                                                animation.tracks[3 * i + 2].values[3 * time + 2],

                                                animation.tracks[3 * i].values[3 * time],
                                                animation.tracks[3 * i].values[3 * time + 1],
                                                animation.tracks[3 * i].values[3 * time + 2]
                                            )
                                        );
                                        matrixs.push(
                                            mesh.skeleton.boneInverses[i].clone()
                                        );
                                }


                                /////矩阵3没有乘以逆矩阵
                                var tool=matrixs0[0];
                                matrixs[0]=tool.clone().multiply(matrixs[0]);tool=tool.clone().multiply(matrixs0[1]);
                                matrixs[1]=tool.clone().multiply(matrixs[1]);tool=tool.clone().multiply(matrixs0[2]);
                                matrixs[2]=tool.clone().multiply(matrixs[2]);tool=tool.clone().multiply(matrixs0[3]);  var  _tool3=tool;
                                matrixs[3]=tool.clone().multiply(matrixs[3]);tool=tool.clone().multiply(matrixs0[4]);
                                matrixs[4]=tool.clone().multiply(matrixs[4]);tool=tool.clone().multiply(matrixs0[5]);
                                matrixs[5]=tool.clone().multiply(matrixs[5]);tool=tool.clone().multiply(matrixs0[6]);
                                matrixs[6]=tool.clone().multiply(matrixs[6]);

                                tool=_tool3;
                                tool=tool.clone().multiply(matrixs0[7]);
                                matrixs[7]=tool.clone().multiply(matrixs[7]);tool=tool.clone().multiply(matrixs0[8]);
                                matrixs[8]=tool.clone().multiply(matrixs[8]);tool=tool.clone().multiply(matrixs0[9]);
                                matrixs[9]=tool.clone().multiply(matrixs[9]);tool=tool.clone().multiply(matrixs0[10]);
                                matrixs[10]=tool.clone().multiply(matrixs[10]);

                                tool=_tool3;
                                tool=tool.clone().multiply(matrixs0[11]);
                                matrixs[11]=tool.clone().multiply(matrixs[11]);tool=tool.clone().multiply(matrixs0[12]);
                                matrixs[12]=tool.clone().multiply(matrixs[12]);tool=tool.clone().multiply(matrixs0[13]);
                                matrixs[13]=tool.clone().multiply(matrixs[13]);tool=tool.clone().multiply(matrixs0[14]);
                                matrixs[14]=tool.clone().multiply(matrixs[14]);

                                tool=matrixs0[0].clone().multiply(matrixs0[15]);
                                matrixs[15]=tool.clone().multiply(matrixs[15]);tool=tool.clone().multiply(matrixs0[16]);
                                matrixs[16]=tool.clone().multiply(matrixs[16]);tool=tool.clone().multiply(matrixs0[17]);
                                matrixs[17]=tool.clone().multiply(matrixs[17]);tool=tool.clone().multiply(matrixs0[18]);
                                matrixs[18]=tool.clone().multiply(matrixs[18]);tool=tool.clone().multiply(matrixs0[19]);
                                matrixs[19]=tool.clone().multiply(matrixs[19]);

                                tool=matrixs0[0].clone().multiply(matrixs0[20]);
                                matrixs[20]=tool.clone().multiply(matrixs[20]);tool=tool.clone().multiply(matrixs0[21]);
                                matrixs[21]=tool.clone().multiply(matrixs[21]);tool=tool.clone().multiply(matrixs0[22]);
                                matrixs[22]=tool.clone().multiply(matrixs[22]);tool=tool.clone().multiply(matrixs0[23]);
                                matrixs[23]=tool.clone().multiply(matrixs[23]);tool=tool.clone().multiply(matrixs0[24]);
                                matrixs[24]=tool.clone().multiply(matrixs[24]);
                                //完成计算matrix

                                //for (i of [7, 8, 9, 10, 11, 12, 13, 14]) {
                                for (i of [
                                                0,1,2,3,4,5,6,
                                                15,16,17,18,18,20,21,22,23,24
                                          ]) {
                                        var temp = matrixs[i].toArray();
                                        for (j = 0; j < 16; j++) {
                                                //data.push(arr[j]);
                                        }
                                        data.push(temp[0]);
                                        data.push(temp[1]);
                                        data.push(temp[2]);
                                        data.push(temp[4]);
                                        data.push(temp[5]);
                                        data.push(temp[6]);
                                        data.push(temp[8]);
                                        data.push(temp[9]);
                                        data.push(temp[10]);
                                        data.push(temp[12]);
                                        data.push(temp[13]);
                                        data.push(temp[14]);
                                }


                        //}//iii
                        let link = document.createElement('a');
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.href = URL.createObjectURL(new Blob([JSON.stringify({data:data})], { type: 'text/plain' }));
                        link.download ="skeletonMatrix.json";
                        //console.log(data);
                        link.click();
                        function compose(x,y,z,w,sx,sy,sz,px,py,pz ) {//quaternion scale,position
                                var x2 = x + x,	y2 = y + y, z2 = z + z;
                                var xx = x * x2, xy = x * y2, xz = x * z2;
                                var yy = y * y2, yz = y * z2, zz = z * z2;
                                var wx = w * x2, wy = w * y2, wz = w * z2;
                                te = new THREE.Matrix4();
                                te.set(
                                    ( 1.0-( yy + zz ) ) * sx,( xy - wz ) * sy        ,( xz + wy ) * sz        ,px,
                                    ( xy + wz ) * sx        ,( 1.0-( xx + zz ) ) * sy,( yz - wx ) * sz        ,py,
                                    ( xz - wy ) * sx        ,( yz + wx ) * sy        ,( 1.0-( xx + yy ) ) * sz,pz,
                                    0.0                     ,0.0                     ,0.0                     ,1.0
                                );
                                return te;
                        }
                });//
                //完成测试
        },

        //使用男性模型//求skeletonData.json//手臂骨骼动画的数据
        test6_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        console.log(glb);//scene.children[3].children[3]
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        for(var i=0;i<mesh.skeleton.boneInverses.length;i++){
                                var mat=mesh.skeleton.boneInverses[i] ;
                                var a=new THREE.Vector3();
                                var b=new THREE.Quaternion();
                                var c=new THREE.Vector3();
                                mat.decompose(a,b,c);
                                console.log(a,b,c);
                        }

                        //开始计算matrix
                        var animation=glb.animations[0];
                        var data=[];
                        for(var Time=0;Time<8;Time++){//0-7
                                var time=Time/2;
                                //console.log(time);
                                matrixs0=[];matrixs=[];
                                for(i=0;i<25;i++){
                                        if(time===Math.floor(time)){
                                                //console.log(Time);
                                                matrixs0.push(
                                                    compose(
                                                        animation.tracks[3*i+1].values[4*time],
                                                        animation.tracks[3*i+1].values[4*time+1],
                                                        animation.tracks[3*i+1].values[4*time+2],
                                                        animation.tracks[3*i+1].values[4*time+3],

                                                        animation.tracks[3*i+2].values[3*time],
                                                        animation.tracks[3*i+2].values[3*time+1],
                                                        animation.tracks[3*i+2].values[3*time+2],

                                                        animation.tracks[3*i].values[3*time],
                                                        animation.tracks[3*i].values[3*time+1],
                                                        animation.tracks[3*i].values[3*time+2]
                                                    )
                                                );
                                        }else{
                                                var time1=Math.floor(time);
                                                var time2=(time1+1)//%8;
                                                //console.log(time,time2);
                                                var q1,q2,q3,q4;
                                                q1=animation.tracks[3*i+1].values[4*time1];
                                                q2=animation.tracks[3*i+1].values[4*time1+1];
                                                q3=animation.tracks[3*i+1].values[4*time1+2];
                                                q4=animation.tracks[3*i+1].values[4*time1+3];

                                                var p1,p2,p3,p4;
                                                p1=animation.tracks[3*i+1].values[4*time2];
                                                p2=animation.tracks[3*i+1].values[4*time2+1];
                                                p3=animation.tracks[3*i+1].values[4*time2+2];
                                                p4=animation.tracks[3*i+1].values[4*time2+3];
                                                /*console.log(Math.pow(
                                                    q1*q1+q2*q2+q3*q3+q4*q4,0.5
                                                ));*/

                                                var A={},B={};
                                                B.x=q1;
                                                B.y=q2;
                                                B.z=q3;
                                                B.w=q4;
                                                A.x=p1;
                                                A.y=p2;
                                                A.z=p3;
                                                A.w=p4;

                                                var OUT=makeInterpolated(A,B,0.5);
                                                //console.log(A,B,OUT, (p1+q1)/2, (p2+q2)/2, (p3+q3)/2, (p4+q4)/2);

                                                function makeInterpolated(a,b,t) {//(Quaternion a, Quaternion b, float t)
                                                        var out = {};
                                                        //计算夹角的cos值//计算两个向量的内积
                                                        var cosHalfTheta = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
                                                        //如果两个向量的夹角大于180
                                                        if(cosHalfTheta < 0.0) {
                                                                //b = new Quaternion(b);
                                                                cosHalfTheta = -cosHalfTheta;
                                                                b.x = -b.x;
                                                                b.y = -b.y;
                                                                b.z = -b.z;
                                                                b.w = -b.w;
                                                        }

                                                        //计算两个向量的夹角
                                                        var halfTheta = Math.floor(Math.acos(cosHalfTheta));
                                                        //计算夹角的sin值
                                                        var sinHalfTheta = Math.floor(
                                                            Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta)
                                                        );
                                                        var ratioA;
                                                        var ratioB;
                                                        if(Math.abs(sinHalfTheta) > 0.001) {
                                                                var oneOverSinHalfTheta = 1.0 / sinHalfTheta;
                                                                ratioA = Math.floor(
                                                                    Math.sin((1.0 - t) * halfTheta) * oneOverSinHalfTheta
                                                                );
                                                                ratioB =Math.floor(
                                                                    Math.sin(t * halfTheta) * oneOverSinHalfTheta
                                                                );
                                                        } else {
                                                                ratioA = 1.0 - t;
                                                                ratioB = t;
                                                        }

                                                        //out= ratioA*a + ratioB*b
                                                        out.x = ratioA * a.x + ratioB * b.x;
                                                        out.y = ratioA * a.y + ratioB * b.y;
                                                        out.z = ratioA * a.z + ratioB * b.z;
                                                        out.w = ratioA * a.w + ratioB * b.w;
                                                        var l=Math.pow(
                                                            out.x*out.x+out.y*out.y+out.z*out.z+out.w*out.w,
                                                            0.5
                                                        );//out.normalizeInPlace();
                                                        out.x/=l;out.y/=l;out.z/=l;out.w/=l;
                                                        return out;
                                                }
                                                matrixs0.push(
                                                    compose(//quaternion scale,position
                                                        //quaternion
                                                        //OUT.x,OUT.y,OUT.z,OUT.w,
                                                        (p1+q1)/2,
                                                        (p2+q2)/2,
                                                        (p3+q3)/2,
                                                        (p4+q4)/2,
                                                        //scale
                                                        1,//animation.tracks[3*i+2].values[3*time],
                                                        1,//animation.tracks[3*i+2].values[3*time+1],
                                                        1,//animation.tracks[3*i+2].values[3*time+2],
                                                        //position
                                                        (animation.tracks[3*i].values[3*time1  ]+animation.tracks[3*i].values[3*time2])/2,
                                                        (animation.tracks[3*i].values[3*time1+1]+animation.tracks[3*i].values[3*time2+1])/2,
                                                        (animation.tracks[3*i].values[3*time1+2]+animation.tracks[3*i].values[3*time2+2])/2
                                                    )
                                                );
                                                /*console.log(
                                                    time1,
                                                    time2,
                                                    (p1+q1)/2,
                                                    (p2+q2)/2,
                                                    (p3+q3)/2,
                                                    (p4+q4)/2,
                                                    (animation.tracks[3*i].values[3*time1  ],animation.tracks[3*i].values[3*time2])/2,
                                                    (animation.tracks[3*i].values[3*time1+1],animation.tracks[3*i].values[3*time2+1])/2,
                                                    (animation.tracks[3*i].values[3*time1+2],animation.tracks[3*i].values[3*time2+2])/2
                                                );*/
                                                /*var m1=compose(
                                                    animation.tracks[3*i+1].values[4*time],
                                                    animation.tracks[3*i+1].values[4*time+1],
                                                    animation.tracks[3*i+1].values[4*time+2],
                                                    animation.tracks[3*i+1].values[4*time+3],

                                                    animation.tracks[3*i+2].values[3*time],
                                                    animation.tracks[3*i+2].values[3*time+1],
                                                    animation.tracks[3*i+2].values[3*time+2],

                                                    animation.tracks[3*i].values[3*time],
                                                    animation.tracks[3*i].values[3*time+1],
                                                    animation.tracks[3*i].values[3*time+2]
                                                );
                                                time=(time+1)%8;
                                                var m2=compose(
                                                    animation.tracks[3*i+1].values[4*time],
                                                    animation.tracks[3*i+1].values[4*time+1],
                                                    animation.tracks[3*i+1].values[4*time+2],
                                                    animation.tracks[3*i+1].values[4*time+3],

                                                    animation.tracks[3*i+2].values[3*time],
                                                    animation.tracks[3*i+2].values[3*time+1],
                                                    animation.tracks[3*i+2].values[3*time+2],

                                                    animation.tracks[3*i].values[3*time],
                                                    animation.tracks[3*i].values[3*time+1],
                                                    animation.tracks[3*i].values[3*time+2]
                                                );
                                                var m= new THREE.Matrix4();
                                                m.set(
                                                    (m1.elements[0]+m2.elements[0])/2,
                                                    (m1.elements[1]+m2.elements[1])/2,
                                                    (m1.elements[2]+m2.elements[2])/2,
                                                    (m1.elements[3]+m2.elements[3])/2,
                                                    (m1.elements[4]+m2.elements[4])/2,
                                                    (m1.elements[5]+m2.elements[5])/2,
                                                    (m1.elements[6]+m2.elements[6])/2,
                                                    (m1.elements[7]+m2.elements[7])/2,
                                                    (m1.elements[8]+m2.elements[8])/2,
                                                    (m1.elements[9]+m2.elements[9])/2,
                                                    (m1.elements[10]+m2.elements[10])/2,
                                                    (m1.elements[11]+m2.elements[11])/2,
                                                    (m1.elements[12]+m2.elements[12])/2,
                                                    (m1.elements[13]+m2.elements[13])/2,
                                                    (m1.elements[14]+m2.elements[14])/2,
                                                    (m1.elements[15]+m2.elements[15])/2
                                                );
                                                matrixs0.push(m);*/
                                        }

                                        matrixs.push(
                                            mesh.skeleton.boneInverses[i].clone()
                                        );
                                }


                                /////矩阵3没有乘以逆矩阵
                                var tool=matrixs0[0];
                                matrixs[0]=tool.clone().multiply(matrixs[0]);tool=tool.clone().multiply(matrixs0[1]);
                                matrixs[1]=tool.clone().multiply(matrixs[1]);tool=tool.clone().multiply(matrixs0[2]);
                                matrixs[2]=tool.clone().multiply(matrixs[2]);tool=tool.clone().multiply(matrixs0[3]);  var  _tool3=tool;
                                matrixs[3]=tool.clone().multiply(matrixs[3]);tool=tool.clone().multiply(matrixs0[4]);
                                matrixs[4]=tool.clone().multiply(matrixs[4]);tool=tool.clone().multiply(matrixs0[5]);
                                matrixs[5]=tool.clone().multiply(matrixs[5]);tool=tool.clone().multiply(matrixs0[6]);
                                matrixs[6]=tool.clone().multiply(matrixs[6]);

                                tool=_tool3;
                                tool=tool.clone().multiply(matrixs0[7]);
                                matrixs[7]=tool.clone().multiply(matrixs[7]);tool=tool.clone().multiply(matrixs0[8]);
                                matrixs[8]=tool.clone().multiply(matrixs[8]);tool=tool.clone().multiply(matrixs0[9]);
                                matrixs[9]=tool.clone().multiply(matrixs[9]);tool=tool.clone().multiply(matrixs0[10]);
                                matrixs[10]=tool.clone().multiply(matrixs[10]);

                                tool=_tool3;
                                tool=tool.clone().multiply(matrixs0[11]);
                                matrixs[11]=tool.clone().multiply(matrixs[11]);tool=tool.clone().multiply(matrixs0[12]);
                                matrixs[12]=tool.clone().multiply(matrixs[12]);tool=tool.clone().multiply(matrixs0[13]);
                                matrixs[13]=tool.clone().multiply(matrixs[13]);tool=tool.clone().multiply(matrixs0[14]);
                                matrixs[14]=tool.clone().multiply(matrixs[14]);

                                tool=matrixs0[0].clone().multiply(matrixs0[15]);
                                matrixs[15]=tool.clone().multiply(matrixs[15]);tool=tool.clone().multiply(matrixs0[16]);
                                matrixs[16]=tool.clone().multiply(matrixs[16]);tool=tool.clone().multiply(matrixs0[17]);
                                matrixs[17]=tool.clone().multiply(matrixs[17]);tool=tool.clone().multiply(matrixs0[18]);
                                matrixs[18]=tool.clone().multiply(matrixs[18]);tool=tool.clone().multiply(matrixs0[19]);
                                matrixs[19]=tool.clone().multiply(matrixs[19]);

                                tool=matrixs0[0].clone().multiply(matrixs0[20]);
                                matrixs[20]=tool.clone().multiply(matrixs[20]);tool=tool.clone().multiply(matrixs0[21]);
                                matrixs[21]=tool.clone().multiply(matrixs[21]);tool=tool.clone().multiply(matrixs0[22]);
                                matrixs[22]=tool.clone().multiply(matrixs[22]);tool=tool.clone().multiply(matrixs0[23]);
                                matrixs[23]=tool.clone().multiply(matrixs[23]);tool=tool.clone().multiply(matrixs0[24]);
                                matrixs[24]=tool.clone().multiply(matrixs[24]);
                                //完成计算matrix

                                for (i of [7, 8, 9, 10, 11, 12, 13, 14]) {
                                        var temp = matrixs[i].toArray();
                                        for (j = 0; j < 16; j++) {
                                                //data.push(arr[j]);
                                        }
                                        data.push(temp[0]);
                                        data.push(temp[1]);
                                        data.push(temp[2]);
                                        data.push(temp[4]);
                                        data.push(temp[5]);
                                        data.push(temp[6]);
                                        data.push(temp[8]);
                                        data.push(temp[9]);
                                        data.push(temp[10]);
                                        data.push(temp[12]);
                                        data.push(temp[13]);
                                        data.push(temp[14]);
                                }


                        }//iii
                        let link = document.createElement('a');
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.href = URL.createObjectURL(new Blob([JSON.stringify({data:data})], { type: 'text/plain' }));
                        link.download ="skeletonData.json";
                        //console.log(data);
                        //link.click();
                        function compose(x,y,z,w,sx,sy,sz,px,py,pz ) {//quaternion scale,position
                                var x2 = x + x,	y2 = y + y, z2 = z + z;
                                var xx = x * x2, xy = x * y2, xz = x * z2;
                                var yy = y * y2, yz = y * z2, zz = z * z2;
                                var wx = w * x2, wy = w * y2, wz = w * z2;
                                te = new THREE.Matrix4();
                                te.set(
                                    ( 1.0-( yy + zz ) ) * sx,( xy - wz ) * sy        ,( xz + wy ) * sz        ,px,
                                    ( xy + wz ) * sx        ,( 1.0-( xx + zz ) ) * sy,( yz - wx ) * sz        ,py,
                                    ( xz - wy ) * sx        ,( yz + wx ) * sy        ,( 1.0-( xx + yy ) ) * sz,pz,
                                    0.0                     ,0.0                     ,0.0                     ,1.0
                                );
                                return te;
                        }
                });//
                //完成测试
        },
        //求skeletonMatrix.json////求不动位置的骨骼//肢体动作的数据
        test7_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb0) => {
                        loader.load("myModel/avatar/Male.glb", (glb) => {
                                console.log(glb);//OnlyArm
                                var mesh=glb.scene.children[0].children[3];
                                console.log(mesh);
                                //var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                                //开始计算matrix
                                var animation=glb.animations[0];
                                var animation0=glb0.animations[0];
                                var data=[];
                                //for(var Time=0;Time<16;Time++){//0-7
                                var time=0;
                                //var time=Time/2;
                                //console.log(time);
                                matrixs0=[];matrixs=[];
                                for(i=0;i<25;i++){
                                        matrixs0.push(
                                            compose(
                                                animation.tracks[3 * i + 1].values[4 * time],
                                                animation.tracks[3 * i + 1].values[4 * time + 1],
                                                animation.tracks[3 * i + 1].values[4 * time + 2],
                                                animation.tracks[3 * i + 1].values[4 * time + 3],

                                                animation.tracks[3 * i + 2].values[3 * time],
                                                animation.tracks[3 * i + 2].values[3 * time + 1],
                                                animation.tracks[3 * i + 2].values[3 * time + 2],

                                                animation.tracks[3 * i].values[3 * time],
                                                animation.tracks[3 * i].values[3 * time + 1],
                                                animation.tracks[3 * i].values[3 * time + 2]
                                            )
                                        );
                                        matrixs.push(
                                            mesh.skeleton.boneInverses[i].clone()
                                        );
                                }


                                /////矩阵3没有乘以逆矩阵
                                var tool=matrixs0[0];
                                matrixs[0]=tool.clone().multiply(matrixs[0]);tool=tool.clone().multiply(matrixs0[1]);
                                matrixs[1]=tool.clone().multiply(matrixs[1]);tool=tool.clone().multiply(matrixs0[2]);
                                matrixs[2]=tool.clone().multiply(matrixs[2]);tool=tool.clone().multiply(matrixs0[3]);  var  _tool3=tool;
                                matrixs[3]=tool.clone().multiply(matrixs[3]);tool=tool.clone().multiply(matrixs0[4]);
                                matrixs[4]=tool.clone().multiply(matrixs[4]);tool=tool.clone().multiply(matrixs0[5]);
                                matrixs[5]=tool.clone().multiply(matrixs[5]);tool=tool.clone().multiply(matrixs0[6]);
                                matrixs[6]=tool.clone().multiply(matrixs[6]);

                                tool=_tool3;
                                tool=tool.clone().multiply(matrixs0[7]);
                                matrixs[7]=tool.clone().multiply(matrixs[7]);tool=tool.clone().multiply(matrixs0[8]);
                                matrixs[8]=tool.clone().multiply(matrixs[8]);tool=tool.clone().multiply(matrixs0[9]);
                                matrixs[9]=tool.clone().multiply(matrixs[9]);tool=tool.clone().multiply(matrixs0[10]);
                                matrixs[10]=tool.clone().multiply(matrixs[10]);

                                tool=_tool3;
                                tool=tool.clone().multiply(matrixs0[11]);
                                matrixs[11]=tool.clone().multiply(matrixs[11]);tool=tool.clone().multiply(matrixs0[12]);
                                matrixs[12]=tool.clone().multiply(matrixs[12]);tool=tool.clone().multiply(matrixs0[13]);
                                matrixs[13]=tool.clone().multiply(matrixs[13]);tool=tool.clone().multiply(matrixs0[14]);
                                matrixs[14]=tool.clone().multiply(matrixs[14]);

                                tool=matrixs0[0].clone().multiply(matrixs0[15]);
                                matrixs[15]=tool.clone().multiply(matrixs[15]);tool=tool.clone().multiply(matrixs0[16]);
                                matrixs[16]=tool.clone().multiply(matrixs[16]);tool=tool.clone().multiply(matrixs0[17]);
                                matrixs[17]=tool.clone().multiply(matrixs[17]);tool=tool.clone().multiply(matrixs0[18]);
                                matrixs[18]=tool.clone().multiply(matrixs[18]);tool=tool.clone().multiply(matrixs0[19]);
                                matrixs[19]=tool.clone().multiply(matrixs[19]);

                                tool=matrixs0[0].clone().multiply(matrixs0[20]);
                                matrixs[20]=tool.clone().multiply(matrixs[20]);tool=tool.clone().multiply(matrixs0[21]);
                                matrixs[21]=tool.clone().multiply(matrixs[21]);tool=tool.clone().multiply(matrixs0[22]);
                                matrixs[22]=tool.clone().multiply(matrixs[22]);tool=tool.clone().multiply(matrixs0[23]);
                                matrixs[23]=tool.clone().multiply(matrixs[23]);tool=tool.clone().multiply(matrixs0[24]);
                                matrixs[24]=tool.clone().multiply(matrixs[24]);
                                //完成计算matrix

                                //for (i of [7, 8, 9, 10, 11, 12, 13, 14]) {
                                for (i of [
                                        0,1,2,3,4,5,6,
                                        15,16,17,18,18,20,21,22,23,24
                                ]) {
                                        var temp = matrixs[i].toArray();
                                        for (j = 0; j < 16; j++) {
                                                //data.push(arr[j]);
                                        }
                                        data.push(temp[0]);
                                        data.push(temp[1]);
                                        data.push(temp[2]);
                                        data.push(temp[4]);
                                        data.push(temp[5]);
                                        data.push(temp[6]);
                                        data.push(temp[8]);
                                        data.push(temp[9]);
                                        data.push(temp[10]);
                                        data.push(temp[12]);
                                        data.push(temp[13]);
                                        data.push(temp[14]);
                                }


                                //}//iii
                                let link = document.createElement('a');
                                link.style.display = 'none';
                                document.body.appendChild(link);
                                link.href = URL.createObjectURL(new Blob([JSON.stringify({data:data})], { type: 'text/plain' }));
                                link.download ="skeletonMatrix.json";
                                //console.log(data);
                                link.click();
                                function compose(x,y,z,w,sx,sy,sz,px,py,pz ) {//quaternion scale,position
                                        var x2 = x + x,	y2 = y + y, z2 = z + z;
                                        var xx = x * x2, xy = x * y2, xz = x * z2;
                                        var yy = y * y2, yz = y * z2, zz = z * z2;
                                        var wx = w * x2, wy = w * y2, wz = w * z2;
                                        te = new THREE.Matrix4();
                                        te.set(
                                            ( 1.0-( yy + zz ) ) * sx,( xy - wz ) * sy        ,( xz + wy ) * sz        ,px,
                                            ( xy + wz ) * sx        ,( 1.0-( xx + zz ) ) * sy,( yz - wx ) * sz        ,py,
                                            ( xz - wy ) * sx        ,( yz + wx ) * sy        ,( 1.0-( xx + yy ) ) * sz,pz,
                                            0.0                     ,0.0                     ,0.0                     ,1.0
                                        );
                                        return te;
                                }
                        });//

                });
                //完成测试
        },
        //编码测试,输出编码后的骨骼数据
        test5_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"

                        var peoples = new InstancedGroup(
                            1,
                            [mesh],//这些mesh的网格应该一致
                            glb.animations[0]
                        );
                        var texSrc = [];
                        for (i = 0; i < 16; i++) texSrc.push('./img/texture/w/w' + i + '.jpg');
                        peoples.init(
                            texSrc
                        );
                        for (var i = 0; i < 1; i++) {
                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(i, [3 * i, 0, 0]);
                                peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                peoples.speedSet(i,0.5);
                        }
                        scope.scene.add(peoples.obj);
                        //开始解码部分代码测试
                        var A=50,B=160;
                        a=Math.floor(A/128);
                        b=Math.floor((A%128)/16);
                        c=A%16;
                        d=B;

                        var c_d=c*256+d;

                        console.log(a,b,c,d,c_d);

                        var num=c_d*Math.pow(10,b-5);
                        if(a===1)num*=-1;
                        //结束解码部分代码测试



                        scope.referee.assertion(
                            peoples.encode(6.18),[50,106],"6.18编码为[50,106],"
                        );
                        scope.referee.assertion(
                            6.18,peoples.decode(50,106),"[50,106]解码为6.18"
                        );
                        scope.encode=function(floatNum) {
                                var a=0,//正数
                                    b,//值0-7，10^(b-3)
                                    c,
                                    d;
                                //计算a//0+ 1-
                                if(floatNum<0){
                                        a=1;
                                        floatNum*=-1;
                                }
                                //计算b//0~7  -3~4
                                if(floatNum>10000)b=7;
                                else if(floatNum>1000)b=6;
                                else if(floatNum>100)b=5;
                                else if(floatNum>10)b=4;//25.11
                                else if(floatNum>1)b=3;//2.51
                                else if(floatNum>0.1)b=2;//0.512
                                else if(floatNum>0.01)b=1;
                                else if(floatNum>0.001)b=0;
                                else{
                                        return [0,0];
                                }
                                //计算c和d
                                var c_d=floatNum*Math.pow(10,7-b-2);//10^(7-b-2)
                                c_d=Math.floor(c_d);//保留十进制3位有效数组
                                c=Math.floor(c_d/256);
                                d=c_d%256;

                                var A=a*128+b*16+c;
                                var B=d;
                                return [A,B];
                        }
                        var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
                        loader.load("skeletonMatrix.json", function(str0)
                        {
                                var data0=JSON.parse(str0).data;//204
                                //material.uniforms.skeletonMatrix={"value": data0};
                                var data1=[],data2=[];
                                for(var i=0;i<data0.length;i++){
                                        var result=scope.encode(data0[i]);
                                        data1.push(result[0]);
                                        data2.push(result[1]);
                                }
                                //dataTexture


                                var loader2 = new THREE.XHRLoader(THREE.DefaultLoadingManager);
                                loader2.load("skeletonData.json", function(str)
                                {
                                        var data0=JSON.parse(str).data;//768;

                                        //var data1=[],data2=[];
                                        for(var i=0;i<data0.length;i++){//768
                                                var result=scope.encode(data0[i]);
                                                data1.push(result[0]);
                                                data2.push(result[1]);
                                        }
                                        //console.log(data0,data1,data2);
                                        //dataTexture
                                        var width = 1 , height = data1.length*2/3 ;//648
                                        var data = new Uint8Array( data1.length*2);//1944
                                        for(var i=0;i<data1.length;i++){//972
                                                data[i]=data1[i];
                                                data[i+data1.length]=data2[i];
                                        }
                                        var dataArray=[];
                                        for(var i=0;i<data1.length;i++){//972
                                                dataArray[i]=data1[i];
                                                dataArray[i+data1.length]=data2[i];
                                        }
                                        var dataTexture = new THREE.DataTexture(
                                            data,
                                            width,
                                            height,
                                            THREE.RGBFormat
                                        );

                                        let link = document.createElement('a');
                                        link.style.display = 'none';
                                        document.body.appendChild(link);
                                        link.href = URL.createObjectURL(new Blob([JSON.stringify({data:dataArray})], { type: 'text/plain' }));
                                        link.download ="animationData.json";
                                        link.click();
                                });
                        });
                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },


        //探索如何使用新的男性模型//无骨骼动画
        test9:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="固定姿势模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        //console.log(glb.scene.children[0]);
                        var mesh=glb.scene.children[0].children[1];
                        console.log(mesh)
                        console.log(mesh.skeleton.boneInverses[0]);
                        var peoples = new InstancedGroup(
                            2,
                            [mesh],//这些mesh的网格应该一致
                            false
                        );
                        var texSrc = [];
                        for (i = 0; i < 16; i++) texSrc.push('./img/texture/w/w' + i + '.jpg');
                        peoples.init(
                            texSrc
                        );
                        for (var i = 0; i < 2; i++) {
                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(i, [3 * i, 0, 0]);
                                peoples.scaleSet(i, [4.5, 4.5, 4.5]);
                        }
                        peoples.animationSpeed = 0.1;
                        scope.scene.add(peoples.obj);
                        //console.log(mesh)
                });//
                loader.load("myModel/avatar/Male.glb", (glb) => {
                        //console.log(glb.scene.children[0].children[3]);
                        //console.log(glb.scene.children[0]);
                        console.log(glb.scene.children[0].children[0].children[2]);
                        var mesh=glb.scene.children[0].children[0].children[2]//glb.scene.children[0].children[3];
                        console.log(mesh)
                        console.log(mesh.skeleton.boneInverses[0]);
                        var peoples = new InstancedGroup(
                            2,
                            [mesh],//这些mesh的网格应该一致
                            false
                        );
                        var texSrc = [];
                        for (i = 0; i < 16; i++) texSrc.push('./img/texture/m/m' + i + '.jpg');
                        peoples.init(
                            texSrc
                        );
                        for (var i = 0; i < 2; i++) {
                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(i, [-3-3 * i, 0, 0]);
                                peoples.scaleSet(i, [4.5, 4.5, 4.5]);
                        }
                        peoples.animationSpeed = 0.1;
                        scope.scene.add(peoples.obj);
                });//

                //完成测试
        },
        //有骨骼动画
        test10:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="固定姿势模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        var mesh=glb.scene.children[0].children[1];
                        var peoples = new InstancedGroup(
                            2,
                            [mesh],//这些mesh的网格应该一致
                            glb.animations[0]
                        );
                        var texSrc = [];
                        for (i = 0; i < 16; i++) texSrc.push('./img/texture/w/w' + i + '.jpg');
                        peoples.init(
                            texSrc
                        );
                        for (var i = 0; i < 2; i++) {
                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(i, [5 * i, 0, 0]);
                                peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                        }
                        peoples.animationSpeed = 0.1;
                        scope.scene.add(peoples.obj);
                        console.log(mesh)
                });//

                //完成测试
        },
}
var myInstancedGroupTest=new InstancedGroupTest();
myInstancedGroupTest.test2_1();
//myInstancedGroupTest.test1();