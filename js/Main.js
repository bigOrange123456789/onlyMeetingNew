function Main(){
    //console.log(2);
    var scope=this;
    this.VR=false;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera( 70,window.innerWidth /window.innerHeight, 0.1, 1000 );;
    this.render;
    this.effect;
    //this.camera = new THREE.OrthographicCamera(window.innerWidth/ - 1,window.innerWidth,window.innerHeight,window.innerHeight/ - 1, 0, 100000 );
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    //this.divInfo = document.getElementById('pminfo');//用于呈现文字
    this.start=function () {
        this.init();
        this.animate();
    }
    this.init=function()
    {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        winWidth = window.innerWidth;
        winHeight = window.innerHeight;

        this.renderer.setSize(winWidth, winHeight);
        if(scope.VR)this.effect = new THREE.StereoEffect(this.renderer)
        document.body.appendChild( this.renderer.domElement );

        // CAMERAS
        this.camera.position.set(-155,41,22,-2.07);//-155,41,22,-2.07,-1.49,-2.07
        this.camera.rotation.set(-1.5572,-1.47875,-1.55714);//

        var ambient = new THREE.AmbientLight(0xffffff , 1 );
        this.scene.add( ambient );


        //性能监视器stats.js开始
        /*var stats = new Stats();
        //stats.setMode(0);
        //stats.domElement.style.position = 'absolute';
        //stats.domElement.style.left = '0px';
        //stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
        setInterval(function () {
            stats.begin();
            stats.end();
        }, 100)*/
        //性能监视器stats.js结束

    }
    this._onResize=function()
    {
        this.winWidth = window.innerWidth;
        this.winHeight = window.innerHeight;

        this.camera.aspect = winWidth / winHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(winWidth, winHeight);
    }
    this.animate=function()
    {
        if(scope.VR)scope.effect.render(scope.scene, scope.camera);
        else scope.renderer.render(scope.scene,scope.camera);
        //scope.divInfo.textContent='场景中三角面个数:' + renderer.info.render.triangles;
        if (window.innerWidth !== scope.winWidth || window.innerHeight !== scope.winHeight) scope._onResize();
        requestAnimationFrame(scope.animate);
    }
}