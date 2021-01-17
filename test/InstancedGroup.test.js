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
        test1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="固定姿势模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female02.glb", (glb) => {
                        //console.log(glb.scene.children[0]);
                        var mesh=glb.scene.children[0];
                        var peoples = new InstancedGroup(
                            2,
                            [mesh, mesh],//这些mesh的网格应该一致
                            false
                        );
                        var texSrc = [];
                        for (i = 0; i < 16; i++) texSrc.push('./texture/' + i + '.jpg');
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
                                for (i = 0; i < 16; i++) texSrc.push('./texture/' + i + '.jpg');
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
                        for (i = 0; i < 16; i++) texSrc.push('./texture/' + i + '.jpg');
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
                        for (i = 0; i < 16; i++) texSrc.push('./texture/' + i + '.jpg');
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

                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                                //输出帧序号，用于验证
                                var time=peoples.time;
                                var speed=peoples.speed.array[1],
                                    t=((time*speed)/36.0-Math.floor((time*speed)/36.0))*36.0;//时间对36取余结果：[0，36)
                                var frame_index;
                                if(t>-0.5&&t<0.5)frame_index=0;
                                else if(t>0.5&&t<1.5)frame_index=1;
                                else if(t>1.5&&t<2.5)frame_index=2;
                                else if(t>2.5&&t<3.5)frame_index=3;
                                else if(t>3.5&&t<4.5)frame_index=4;
                                else if(t>4.5&&t<5.5)frame_index=5;
                                else if(t>5.5&&t<6.5)frame_index=6;
                                else if(t>6.5&&t<7.5)frame_index=7;
                                else if(t>7.5&&t<8.5)frame_index=8;
                                else if(t>8.5&&t<9.5)frame_index=9;
                                else if(t>9.5&&t<10.5)frame_index=10;
                                else if(t>10.5&&t<11.5)frame_index=11;
                                else if(t>11.5&&t<12.5)frame_index=12;
                                else if(t>12.5&&t<13.5)frame_index=13;
                                else if(t>13.5&&t<14.5)frame_index=14;
                                else if(t>14.5&&t<15.5)frame_index=15;
                                else if(t>15.5&&t<16.5)frame_index=16;
                                else if(t>16.5&&t<17.5)frame_index=17;
                                else if(t>17.5&&t<18.5)frame_index=18;
                                else if(t>18.5&&t<19.5)frame_index=19;
                                else if(t>19.5&&t<20.5)frame_index=20;
                                else if(t>20.5&&t<21.5)frame_index=21;
                                else if(t>21.5&&t<22.5)frame_index=22;
                                else if(t>22.5&&t<23.5)frame_index=23;
                                else if(t>23.5&&t<24.5)frame_index=24;
                                else if(t>24.5&&t<25.5)frame_index=25;
                                else if(t>25.5&&t<26.5)frame_index=26;
                                else if(t>26.5&&t<27.5)frame_index=27;
                                else if(t>27.5&&t<28.5)frame_index=28;
                                else if(t>28.5&&t<29.5)frame_index=29;
                                else if(t>29.5&&t<30.5)frame_index=30;
                                else if(t>30.5&&t<31.5)frame_index=31;
                                else if(t>31.5&&t<32.5)frame_index=32;
                                else if(t>32.5&&t<33.5)frame_index=33;
                                else if(t>33.5&&t<34.5)frame_index=34;
                                else frame_index=35;
                                console.log(frame_index);
                                //完成验证
                        }
                });//
                //完成测试
        },
}
var myInstancedGroupTest=new InstancedGroupTest();
myInstancedGroupTest.test5();