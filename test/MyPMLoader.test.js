function MyPMLoaderTest(){
    this.scene;
    this.camera;


    this.tag;
    this.button_flag;
    this.referee;
}
MyPMLoaderTest.prototype={
    setContext:function (testType) {
        var nameContext="";
        console.log('set context:'+nameContext);

        var scope=this;
        this.referee=new Referee();
        this.tag=new Text("","green",25);
        this.button_flag=true;
        var button=new Button("","green",25);
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
            scope.tag.reStr('三角面数量: ' + renderer.info.render.triangles);
            requestAnimationFrame(render);
        }
        this.scene=scene;
        this.camera=camera;
    },
    //有动画测试
    test1:function (ContextType) {
        if(typeof(ContextType)==="undefined")this.setContext();
        var nameTest="赵院士模型";
        console.log('start test:'+nameTest);
        //开始测试
        var scope=this;
        var loader = new THREE.GLTFLoader();//估计是通过gltf文件加载的动画
        loader.load('./myModel/avatar/Female.glb', function (glbObj){
            //var loader= new THREE.GLTFLoader();
            //loader.load('./myModel/skeleton/scene.gltf', (glbObj) => {
            //glbObj.scene.visible=false;
            loadGuest1(glbObj);
            //loadGuest2(glbObj);
            function loadGuest1(glbObj) {
                //开始创建PM对象
                var LODArray=[200,300]//4个数字表示距离，可以将模型分为5级;
                var path='./myModel/Male';
                var pmLoader = new MyPMLoader(
                    glbObj,
                    path,    //模型路径
                    LODArray,//LOD等级的数组
                    scope.camera,  //LOD需要判断到相机的距离
                    0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
                    0.02,     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
                    ["Texture_0_0.jpeg","Texture_0_1.jpeg"]
                );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
                var myModel=pmLoader.obj;
                myModel.rotation.set(Math.PI/2,0,0);
                myModel.position.set(0,-10,-10);
                myModel.scale.set(0.2,0.2,0.2);
                scope.scene.add(myModel);



                //完成创建PM对象
            }
        });
        //完成测试
    },
    test2:function (ContextType) {
        if(typeof(ContextType)==="undefined")this.setContext();
        var nameTest="董事长模型";
        console.log('start test:'+nameTest);
        //开始测试
        var scope=this;
        var animLoader = new PMAnimLoader();//估计是通过gltf文件加载的动画
        animLoader.load('./myModel/skeleton/scene.gltf', function (glbObj){
            //var loader= new THREE.GLTFLoader();
            //loader.load('./myModel/skeleton/scene.gltf', (glbObj) => {
            glbObj.scene.visible=false;
            loadGuest1(glbObj);
            //loadGuest2(glbObj);
            function loadGuest1(glbObj) {
                //开始创建PM对象
                var LODArray=[20,30]//4个数字表示距离，可以将模型分为5级;
                //var path='/myModel/childFemale_idle';//childFemale_crawl
                //var path='/myModel/childFemale_crawl';
                //var path='/myModel/Female01';
                var path='./myModel/dongshizhang5';
                var pmLoader = new MyPMLoader(
                    glbObj,
                    path,    //模型路径
                    LODArray,//LOD等级的数组
                    scope.camera,  //LOD需要判断到相机的距离
                    0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
                    0.02     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
                );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
                pmLoader.init();
                var myModel=pmLoader.obj;
                //myModel.scale.set(1.5,1.5,1.5);
                //myModel.position.set(191,9,-26);
                //myModel.rotation.set(0,-Math.PI/2,0);
                //new ParamMeasure(myModel,0);
                scope.scene.add(myModel);
                //完成创建PM对象
            }
        });
        //完成测试
    },

    //无动画测试
    test11:function (ContextType) {
        if(typeof(ContextType)==="undefined")this.setContext();
        var nameTest="赵院士模型";
        console.log('start test:'+nameTest);
        //开始测试
        var scope=this;
        var loader = new THREE.GLTFLoader();//估计是通过gltf文件加载的动画
        loader.load('./myModel/avatar/Female.glb', function (glbObj){
            //var loader= new THREE.GLTFLoader();
            //loader.load('./myModel/skeleton/scene.gltf', (glbObj) => {
            //glbObj.scene.visible=false;
            loadGuest1(glbObj);
            //loadGuest2(glbObj);
            function loadGuest1(glbObj) {
                //开始创建PM对象
                var LODArray=[];//[200,300]//4个数字表示距离，可以将模型分为5级;
                var path='./myModel/Male';
                var pmLoader = new MyPMLoader(
                    glbObj,
                    path,    //模型路径
                    LODArray,//LOD等级的数组
                    scope.camera,  //LOD需要判断到相机的距离
                    0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
                    0.02,     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
                    ["Texture_0_0.jpeg","Texture_0_1.jpeg"]
                );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
                var myModel=pmLoader.obj;
                myModel.rotation.set(Math.PI/2,0,0);
                myModel.position.set(0,-10,-10);
                myModel.scale.set(0.2,0.2,0.2);

                var myInterval=setInterval(function () {
                    if(myModel.children[0]){
                        console.log(myModel);
                        console.log(myModel.children[0]);
                        console.log(myModel.children[0].children[0]);
                        var mesh0=myModel.children[0].children[0];

                        console.log(mesh0);
                        var mesh=new THREE.Mesh(
                            mesh0.geometry,
                            mesh0.material);
                        mesh.scale.set(1,1,1);
                        mesh.rotation.set(0,-Math.PI/2,0)
                        mesh.frustumCulled=false;
                        console.log(mesh);
                        scope.scene.add(mesh);
                        clearInterval(myInterval);
                    }
                },100)

                //完成创建PM对象
            }
        });
        //完成测试
    },
    test3:function (ContextType) {
        if(typeof(ContextType)==="undefined")this.setContext();
        var nameTest="董事长模型";
        console.log('start test:'+nameTest);
        //开始测试
        var scope=this;
        var animLoader = new PMAnimLoader();//估计是通过gltf文件加载的动画
        animLoader.load('./myModel/skeleton/scene.gltf', function (glbObj){
            //var loader= new THREE.GLTFLoader();
            //loader.load('./myModel/skeleton/scene.gltf', (glbObj) => {
            glbObj.scene.visible=false;
            loadGuest1(glbObj);
            //loadGuest2(glbObj);
            function loadGuest1(glbObj) {
                //开始创建PM对象
                var LODArray=[50]//4个数字表示距离，可以将模型分为5级;
                //var path='/myModel/childFemale_idle';//childFemale_crawl
                //var path='/myModel/childFemale_crawl';
                //var path='/myModel/Female01';
                var path='./myModel/dongshizhang5';
                var pmLoader = new MyPMLoader(
                    glbObj,
                    path,    //模型路径
                    LODArray,//LOD等级的数组
                    scope.camera,  //LOD需要判断到相机的距离
                    0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
                    0.02     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
                );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
                //pmLoader.init();
                var myModel=pmLoader.obj;
                //myModel.scale.set(1.5,1.5,1.5);
                //myModel.position.set(191,9,-26);
                //myModel.rotation.set(0,-Math.PI/2,0);
                //new ParamMeasure(myModel,0);
                scope.scene.add(myModel);
                //完成创建PM对象
            }
        });
        //完成测试
    },
}
var myMyPMLoaderTest=new MyPMLoaderTest();
//myMyPMLoaderTest.test1();