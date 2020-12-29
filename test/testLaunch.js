let camera, scene, renderer;
let light;
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
var  myTestFilePath=[
    //"Template",
    "InstancedGroup"
];
for(var i=0;i<myTestFilePath.length;i++){
    document.write("<script language=javascript src=test/"+myTestFilePath[i]+".test.js></script>");
}