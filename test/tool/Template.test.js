function Describe(){
        this.scene;
        this.camera;

        this.tag;
        this.button_flag;
        this.referee;
}
Describe.prototype={
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
                        renderer.render( scene, camera );
                        requestAnimationFrame(render);
                }
                this.scene=scene;
                this.camera=camera;
        },//console.log('finish context:'+nameContext);
        test1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="";
                console.log('start test:'+nameTest);
                //开始测试
                //完成测试
        },//console.log('complete test:'+nameTest);
}
var myDescribe=new Describe();
myDescribe.test1();