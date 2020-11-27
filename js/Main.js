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
        this.camera.position.set(-156.5,43.42,24.47);
        this.camera.rotation.set(0,-Math.PI/2,0);
        this.camera.rotation.set(Math.PI/3,Math.PI/3,Math.PI/3);

        var ambient = new THREE.AmbientLight(0xffffff , 1 );
        this.scene.add( ambient );
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
        scope.divInfo.textContent='场景中三角面个数:' + renderer.info.render.triangles;
        if (window.innerWidth !== scope.winWidth || window.innerHeight !== scope.winHeight) scope._onResize();
        requestAnimationFrame(scope.animate);
    }
}