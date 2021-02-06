function ComputeTest(){
    this.scene;
    this.camera;

    this.tag;
    this.button_flag;
    this.referee;
}
ComputeTest.prototype={
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
        var myCompute=new Compute();
        //myCompute.init(1,2,2);

        myCompute.init(9,9,10);
        //myCompute.setMatOne(0,0);
        //myCompute.setMatOne(0,1);
        console.log(myCompute.mat);
        //myCompute.mat[0][1]=1;
        console.log(myCompute.computeF())
        /*var result=[
            [-1,-1],[-1,-1],[-1,-1],
        ];
        this.referee.assertion(myCompute.mat,result,"Compute初始化测试")

        this.referee.assertion(myCompute.symmetry([
            [0,1,0,0,1,0],
            [1,1,0,0,0,1],
        ],0),[
            [0,1,0,0,1,0],
            [1,0,0,0,1,1],
        ]);
        this.referee.assertion(myCompute.symmetry([
            [0,1,0,0,1,0],
            [1,1,0,0,0,1],
        ],2),[
            [0,1],
            [1,1],
            [0,0],
            [0,0],
            [1,0],
            [0,1],
        ]);

        this.referee.assertion(myCompute.computeMinLength([
            [0,1,0,0,1,0],
            [1,1,0,0,0,1],
            [0,1,0,0,0,1],
            [1,0,1,0,0,1],
        ]),[
            [0,1,0,0,3,0],
            [1,1,0,0,0,1],
            [0,1,0,0,0,1],
            [2,0,2,0,0,1],
        ]);

        var A=[
            [1,3,6,10],
            [2,5,9,13],
            [4,8,12,15],
            [7,11,14,16]
        ];
        for(i0=0;i0<4;i0++)
            for(j0=0;j0<4;j0++)
                A[i0][j0]=""+i0+","+j0;
        var test2=myCompute.symmetry(A,3);//symmetry
        myCompute.mat=[
            [1,3,6,10],
            [2,1,9,13],
            [4,8,12,15],
            [7,11,14,16]
        ];
        myCompute.mat_h=myCompute.mat.length;
        myCompute.mat_w=myCompute.mat[0].length;*/

        //完成测试
    },//console.log('complete test:'+nameTest);
}
var myComputeTest=new ComputeTest();
myComputeTest.test1();