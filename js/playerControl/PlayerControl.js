function PlayerControl(camera){
    this.camera=camera;
    var scope=this;
    var myMouseManager=new MouseManager();
    myMouseManager.dragMouse=function (dx,dy) {
        scope.rotation1(-0.02*dx);
        //scope.rotation2(-0.02*dy);
        //console.log(scope.camera);
    }
    var myKeyboardManager=new KeyboardManager();
    myKeyboardManager.onKeyDown=function(event){
        var step=30;
        if(event.key==="W"||event.key==="w")scope.forward(step);
        else if(event.key==="S"||event.key==="s")scope.forward(-step);
        else if(event.key==="Q"||event.key==="q")scope.up(step);
        else if(event.key==="E"||event.key==="e")scope.up(-step);
        else if(event.key==="A"||event.key==="a")scope.left(step);
        else if(event.key==="D"||event.key==="d")scope.left(-step);
    }
    myKeyboardManager.init();
    //console.log(120)

    this.rotation1=function(step){//水平旋转
        var direction = new THREE.Vector3(//up方向
            this.camera.matrixWorld.elements[4]
            ,this.camera.matrixWorld.elements[5]
            ,this.camera.matrixWorld.elements[6]
        );
        this.camera.rotateOnAxis(direction,step);
    }
    this.rotation2=function(step){//俯仰角
        /*var direction1 = new THREE.Vector3(//forward
            this.camera.matrixWorld.elements[8]
            ,this.camera.matrixWorld.elements[9]
            ,this.camera.matrixWorld.elements[10]
        );
        var direction2 = new THREE.Vector3(//up方向
            this.camera.matrixWorld.elements[4]
            ,this.camera.matrixWorld.elements[5]
            ,this.camera.matrixWorld.elements[6]
        );
        console.log(10)
        var direction=direction1.cross(direction2);
        this.camera.rotateOnAxis(direction,step);*/
        var dummy=new THREE.Object3D()//dummy仿制品
        dummy.rotation.set(step,0,0);
        dummy.updateMatrix();
        this.camera.updateMatrix();
        dummy.matrix.multiply(this.camera.matrix);
        //this.camera.matrix.multiply(dummy.matrix);
        console.log(this.camera);
        //this.camera.matrix.multiply(dummy.matrix);
        this.camera.matrix=dummy.matrix;
        this.camera.rotation.setFromRotationMatrix(this.camera.matrix)
    }
    this.move=function(x,y,z){
        this.forward(x);
        this.up(y);
        this.left(z);
    }
    this.forward=function (step) {//相机的初始方向是（0，0，-1）//对y旋转-90度后相机为水平方向camera.rotation.set(0,-Math.PI/2,0);
        var direction = new THREE.Vector3(
            -0.1*this.camera.matrixWorld.elements[8]*step
            ,-0.1*this.camera.matrixWorld.elements[9]*step
            ,-0.1*this.camera.matrixWorld.elements[10]*step
        );
        this.camera.position.set(
            this.camera.position.x+direction.x,
            this.camera.position.y+direction.y,
            this.camera.position.z+direction.z
        );
    }
    this.up=function (step) {//相机的上方向是（0，1，0）
        var direction = new THREE.Vector3(
            0.1*this.camera.matrixWorld.elements[4]*step
            ,0.1*this.camera.matrixWorld.elements[5]*step
            ,0.1*this.camera.matrixWorld.elements[6]*step
        );
        this.camera.position.set(
            this.camera.position.x+direction.x,
            this.camera.position.y+direction.y,
            this.camera.position.z+direction.z
        );
    }
    this.left=function (step) {//相机的左方向是（-1，0，0）
        var direction = new THREE.Vector3(
            -0.1*this.camera.matrixWorld.elements[0]*step
            ,-0.1*this.camera.matrixWorld.elements[1]*step
            ,-0.1*this.camera.matrixWorld.elements[2]*step
        );
        this.camera.position.set(
            this.camera.position.x+direction.x,
            this.camera.position.y+direction.y,
            this.camera.position.z+direction.z
        );
    }
}
function MouseManager(){
    var scope=this;
    this.press=false;//鼠标未处于按下状态
    this.preX=-1;
    this.preY=-1;
    this.dragMouse=function(dx,dy){
        console.log(dx,dy);
    }
    this.onMouseMove=function( event ) {//鼠标移动事件监听
        if(scope.press&&scope.preX!==-1&&scope.preY!==-1)
            scope.dragMouse(event.x-scope.preX,event.y-scope.preY);
        scope.preX=event.x;
        scope.preY=event.y;
    }
    this.onMouseUp=function( event ) {//鼠标移动事件监听
        scope.press=false;
        //console.log(1);
    }
    this.onMouseDown=function( event ) {//鼠标移动事件监听
        scope.press=true;
        //console.log(2);
    }
    this.init=function(  ) {
        document.addEventListener( 'mousemove',scope.onMouseMove, false );
        document.addEventListener( 'mouseup', scope.onMouseUp, false );
        document.addEventListener( 'mousedown',scope.onMouseDown, false );
    }
    this.init();
}
function KeyboardManager(){
    var scope=this;
    this.onKeyDown=function(event){
        console.log(event);
    }
    this.init=function(){
        window.addEventListener( 'keydown',scope.onKeyDown, false );
    }
}