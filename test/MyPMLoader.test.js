function MyPMLoaderTest(mainScene,mainCamera){
    this.scene=mainScene;
    this.camera=mainCamera;
}
MyPMLoaderTest.prototype={
    setContext1:function (testType) {
        var nameContext="";
        console.log('set context:'+nameContext);
        if(testType===1)this.test1();
        else if(testType===2)this.test2();
        console.log('finish context:'+nameContext);
    },
    test1:function () {
        var nameTest="赵院士模型";
        var scope=this;
        console.log('start test:'+nameTest);
        var animLoader = new PMAnimLoader();//估计是通过gltf文件加载的动画
        animLoader.load('./myModel/skeleton/scene.gltf', function (glbObj){
            //var loader= new THREE.GLTFLoader();
            //loader.load('./myModel/skeleton/scene.gltf', (glbObj) => {
            glbObj.scene.visible=false;
            loadGuest1(glbObj);
            //loadGuest2(glbObj);
            function loadGuest1(glbObj) {
                //开始创建PM对象
                var LODArray=[200,300]//4个数字表示距离，可以将模型分为5级;
                //var path='/myModel/childFemale_idle';//childFemale_crawl
                //var path='/myModel/childFemale_crawl';
                //var path='/myModel/Female01';
                var path='./myModel/zhao1';
                var pmLoader = new MyPMLoader(
                    glbObj,
                    path,    //模型路径
                    LODArray,//LOD等级的数组
                    scope.camera,  //LOD需要判断到相机的距离
                    0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
                    0.02     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
                );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
                var myModel=pmLoader.obj;
                //myModel.scale.set(1.5,1.5,1.5);
                //myModel.position.set(191,9,-26);
                //myModel.rotation.set(0,-Math.PI/2,0);
                //new ParamMeasure(myModel,0);
                scope.scene.add(myModel);
                //完成创建PM对象
            }
        });

        console.log('complete test:'+nameTest);
    },
    test2:function () {
        var nameTest="董事长模型";
        var scope=this;
        console.log('start test:'+nameTest);
        var animLoader = new PMAnimLoader();//估计是通过gltf文件加载的动画
        animLoader.load('./myModel/skeleton/scene.gltf', function (glbObj){
            //var loader= new THREE.GLTFLoader();
            //loader.load('./myModel/skeleton/scene.gltf', (glbObj) => {
            glbObj.scene.visible=false;
            loadGuest1(glbObj);
            //loadGuest2(glbObj);
            function loadGuest1(glbObj) {
                //开始创建PM对象
                var LODArray=[200,300]//4个数字表示距离，可以将模型分为5级;
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
                var myModel=pmLoader.obj;
                //myModel.scale.set(1.5,1.5,1.5);
                //myModel.position.set(191,9,-26);
                //myModel.rotation.set(0,-Math.PI/2,0);
                //new ParamMeasure(myModel,0);
                scope.scene.add(myModel);
                //完成创建PM对象
            }
        });

        console.log('complete test:'+nameTest);
    },
}
var myMyPMLoaderTest=new MyPMLoaderTest(scene,camera);
myMyPMLoaderTest.setContext1(2);