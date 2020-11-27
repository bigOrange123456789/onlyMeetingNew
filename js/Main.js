function Main(){
    var scope=this;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera( 70,window.innerWidth /window.innerHeight, 0.1, 1000 );;
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.divInfo = document.getElementById('pminfo');//用于呈现文字
    this.start=function () {
        this.init();
        this.animate();

    }
    this.init=function()
    {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
        renderer.autoClear = false;
        renderer.setPixelRatio( window.devicePixelRatio );

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        winWidth = window.innerWidth;
        winHeight = window.innerHeight;

        renderer.setSize(winWidth, winHeight);
        document.body.appendChild( renderer.domElement );

        // CAMERAS
        //this.camera = new THREE.PerspectiveCamera( 70, winWidth / winHeight, 0.1, 1000 );

        //console.log(this.camera)
        //camera.position.set(0,0.42,0);
        this.camera.position.set(-156.5,43.42,24.47);//copy(new THREE.Vector3(-30, 0.5, 25));
        //this.camera.rotation.set(Math.PI/3,Math.PI/7,Math.PI);

        //controls= new OrbitControls(camera , renderer.domElement);
        //controls.target.copy(new THREE.Vector3(-156.0,43.42,24.47));
        this.camera.rotation.set(0,-Math.PI/2,0);
        //console.log(1122);
        //console.log(10)


        //开始创建PM对象
        var LODArray=[45,46,50,55]//4个数字表示距离，可以将模型分为5级;
        //var path='/myModel/childFemale_idle';//childFemale_crawl
        //var path='/myModel/childFemale_crawl';
        //var path='/myModel/Female01';
        var path='/myModel/dongshizhang5';
        var pmLoader = new MyPMLoader(
            path,    //模型路径
            LODArray,//LOD等级的数组
            this.camera,  //LOD需要判断到相机的距离
            0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
            0.02     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
        );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
        var myModel=pmLoader.obj;
        myModel.scale.set(1.5,1.5,1.5);
        myModel.position.set(0,-11.5,25);
        myModel.rotation.set(0,-Math.PI/2,0);
        this.scene.add(myModel);
        //完成创建PM对象

        var ambient = new THREE.AmbientLight(0xffffff , 1 );
        this.scene.add( ambient );


        var targetObject = new THREE.Object3D();
        this.scene.add(targetObject);
    }
    this._onResize=function()
    {
        this.winWidth = window.innerWidth;
        this.winHeight = window.innerHeight;

        this.camera.aspect = winWidth / winHeight;
        this.camera.updateProjectionMatrix();

        renderer.setSize(winWidth, winHeight);
    }
    this.animate=function()
    {
        renderer.render(scope.scene,scope.camera);
        scope.divInfo.textContent='三角面数量(LOD变化范围3039-15990): ' + renderer.info.render.triangles;
        if (window.innerWidth !== scope.winWidth || window.innerHeight !== scope.winHeight) scope._onResize();
        requestAnimationFrame(scope.animate);
    }
}