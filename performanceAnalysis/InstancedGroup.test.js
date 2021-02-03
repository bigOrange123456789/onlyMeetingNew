//InstancedGroup.test
function InstancedGroupTest(){
        this.scene;
        this.camera;

        this.tag;
        this.button_flag;
        this.referee;
        this.frameIndex;
        this.frameIndexPre;
        this.frameIndexPre_10s;
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
                            16000,
                            [mesh],//这些mesh的网格应该一致
                            glb.animations[0]
                        );
                        peoples.init(['./img/texture/w/w0.jpg'],16);
                        for (var i = 0; i < peoples.instanceCount; i++) {
                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(i, [3 * i, 0, 0]);
                                peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                peoples.speedSet(i,0.5);
                                peoples.animationSet(i,0);
                        }
                        scope.scene.add(peoples.obj);


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },
        //进行轻量化处理帧数统计
        test6:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        //console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        this.frameIndexPre_10s=this.frameIndex;
                        var peoples=null;
                        var result="";
                        var myInterval=setInterval(function () {
                                var count=100;
                                var FPS,obj;
                                if(peoples){
                                        FPS=scope.frameIndex-scope.frameIndexPre_10s;
                                        console.log("人数:"+peoples.instanceCount+
                                            ",帧数:"+FPS
                                        );
                                        //scope.scene.remove(peoples.obj);
                                        obj=peoples.obj;
                                        count+=peoples.instanceCount;
                                }else{
                                        FPS=60;
                                        obj=null;
                                }
                                peoples = new InstancedGroup(
                                    count,
                                    [mesh],//这些mesh的网格应该一致
                                    glb.animations[0]
                                );
                                peoples.init(['./img/texture/w/w0.jpg'],16);
                                for (var i = 0; i < peoples.instanceCount; i++) {
                                        peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                        peoples.positionSet(i, [3 * i, 0, 0]);
                                        peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                        peoples.speedSet(i,0.5);
                                        peoples.animationSet(i,0);
                                }
                                if(obj)scope.scene.remove(obj);
                                scope.scene.add(peoples.obj);
                                scope.frameIndexPre_10s=scope.frameIndex;
                                if(FPS<30){
                                        window.clearInterval(myInterval);
                                        console.log(result);
                                }
                                result+=(","+FPS);
                                //60,58,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,58,55,52,48,47,46,44,44,41,41,39,37,37,34,34,31
                        },1000);


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },
        //不进行轻量化处理帧数统计
        test7:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        //console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        this.frameIndexPre_10s=this.frameIndex;





                        var peoples=null;
                        var result="";
                        var myInterval=setInterval(function () {
                                var count=100;
                                var FPS,obj;
                                if(peoples){
                                        FPS=scope.frameIndex-scope.frameIndexPre_10s;
                                        console.log("人数:"+peoples.instanceCount+
                                            ",帧数:"+FPS
                                        );
                                        //scope.scene.remove(peoples.obj);
                                        obj=peoples.obj;
                                        count+=peoples.instanceCount;
                                }else{
                                        FPS=60;
                                        obj=null;
                                }


                                peoples = new InstancedGroup2(
                                    count,
                                    [mesh],//这些mesh的网格应该一致
                                    glb.animations[0]
                                );
                                var srcs=[];
                                for(var i=0;i<16;i++){
                                        srcs.push("performanceAnalysis/texture/m/m"+i+".jpg");
                                }
                                peoples.init(srcs,16);
                                for (var i = 0; i < peoples.instanceCount; i++) {
                                        peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                        peoples.positionSet(i, [5 * i, 0, 0]);
                                        peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                        peoples.textureSet(i,Math.floor(Math.random()*16));
                                        //peoples.speedSet(i,0.5);
                                        //peoples.animationSet(i,0);
                                }
                                if(obj)scope.scene.remove(obj);
                                scope.scene.add(peoples.obj);

                                scope.frameIndexPre_10s=scope.frameIndex;
                                if(FPS<30){
                                        window.clearInterval(myInterval);
                                        console.log(result);
                                }
                                result+=(","+FPS);
                        },1000);



                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },

        //场景中人数变化的帧数统计
        test8:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        //console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        this.frameIndexPre_10s=this.frameIndex;
                        var peoples=null;
                        var result="";
                        var myInterval=setInterval(function () {
                                var count=100;
                                var FPS;
                                if(peoples){
                                        FPS=scope.frameIndex-scope.frameIndexPre_10s;
                                        console.log("人数:"+peoples.instanceCount+
                                            ",帧数:"+FPS
                                        );
                                        scope.scene.remove(peoples.obj);
                                        count+=peoples.instanceCount;
                                }else{
                                        FPS=60;
                                }
                                peoples = new InstancedGroup(
                                    count,
                                    [mesh],//这些mesh的网格应该一致
                                    glb.animations[0]
                                );
                                peoples.init(['./img/texture/w/w0.jpg'],16);
                                for (var i = 0; i < peoples.instanceCount; i++) {
                                        peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                        peoples.positionSet(i, [3 * i, 0, 0]);
                                        peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                        peoples.speedSet(i,0.5);
                                        peoples.animationSet(i,0);
                                }
                                scope.scene.add(peoples.obj);
                                scope.frameIndexPre_10s=scope.frameIndex;
                                if(FPS<30){
                                        window.clearInterval(myInterval);
                                        console.log(result);
                                }
                                result+=(","+FPS);
                                //60,58,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,58,55,52,48,47,46,44,44,41,41,39,37,37,34,34,31
                        },1000);


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },

}
var myInstancedGroupTest=new InstancedGroupTest();
myInstancedGroupTest.test6();
