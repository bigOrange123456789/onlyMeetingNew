//InstancedGroup.test
function InstancedGroupTest(){
        this.scene;
        this.camera;

        this.tag;
        this.button_flag;
        this.referee;
}
InstancedGroupTest.prototype={
        setContext:function () {
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
                        renderer.setClearColor(0xff00ff);
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
                        var mesh=glb.scene.children[0].children[1];
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
                loader.load("myModel/avatar/host.glb", (glb) => {
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
                        console.log(mesh)


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                                //输出帧序号，用于验证
                                var time=peoples.time; var frame_index;
                                var speed=peoples.speed.array[1],
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
                                else if(t>13.5&&t<=14.5)frame_index=14;
                                else frame_index=15;

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
        //编码测试
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
                        var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
                        loader.load("skeletonData.json", function(str)
                        {
                                var data0=JSON.parse(str).data;//768;
                        });
                        updateAnimation();//
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

                        for(var k=0;k<18;k++){
                                var peoples = new InstancedGroup(1, [mesh], glb.animations[0]);
                                var texSrc = [];
                                for (i = 0; i < 16; i++) texSrc.push('./test/img/texture/w/w'+k+'.jpg');
                                peoples.init(texSrc);
                                peoples.rotationSet(0, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(0, [2*k, 0, 0]);
                                peoples.scaleSet(0, [0.03, 0.03, 0.03]);
                                peoples.speedSet(0,0.1);
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
        //求skeletonData.json//手臂骨骼动画的数据
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
        //求skeletonMatrix.json////求不动位置的骨骼//肢体动作的数据
        test7:function (contextType){
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
        //使用男性模型
        //求skeletonData.json//手臂骨骼动画的数据
        test6_1:function (contextType){
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


        //探索如何使用新的男性模型
        //无骨骼动画
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
myInstancedGroupTest.test5_1();