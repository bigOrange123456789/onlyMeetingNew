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
        test3:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="固定姿势模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        console.log(glb);
                        var mesh=glb.scene.children[0].children[1];
                        var myMesh=new MySkinnedMesh();
                        myMesh.init(
                            mesh,
                            glb.animations[0]
                        );
                        var peoples = new InstancedGroup(
                            2,
                            [myMesh.mesh,myMesh.mesh],//这些mesh的网格应该一致
                            true
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
}
var myInstancedGroupTest=new InstancedGroupTest();
myInstancedGroupTest.test3();