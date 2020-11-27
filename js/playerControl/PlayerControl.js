function PlayerControl(camera){
    this.camera=camera;
    var scope=this;
    var myMouseManager=new MouseManager();
    myMouseManager.dragMouse=function (dx,dy) {
        scope.rotation1(-0.02*dx);
        scope.rotation2(-0.02*dy);
    }
    myMouseManager.onMouseWheel=function(event){
        var delta = 0;
        if ( event.wheelDelta !== undefined )delta = event.wheelDelta;
        else if ( event.detail !== undefined )delta = - event.detail;
        scope.forward(delta);
    }
    var myKeyboardManager=new KeyboardManager();
    myMouseManager.init();
    myKeyboardManager.onKeyDown=function(event){
        var step=30;
        if(event.key==="ArrowUp"||event.key==="W"||event.key==="w")scope.forward(step);
        else if(event.key==="ArrowDown"||event.key==="S"||event.key==="s")scope.forward(-step);
        else if(event.key==="Q"||event.key==="q")scope.up(step);
        else if(event.key==="E"||event.key==="e")scope.up(-step);
        else if(event.key==="ArrowLeft"||event.key==="A"||event.key==="a")scope.left(step);
        else if(event.key==="ArrowRight"||event.key==="D"||event.key==="d")scope.left(-step);
    }
    myKeyboardManager.init();

    this.rotation1=function(step){//水平旋转
        var direction0=this.camera.getWorldDirection();
        var direction = new THREE.Vector3(//up方向
            0,1,0
        );
        var pos=this.camera.position;
        direction0.applyAxisAngle(direction,step);
        this.camera.lookAt(pos.x+direction0.x,
            pos.y+direction0.y,
            pos.z+direction0.z);
        this.camera.updateMatrix();
    }
    this.rotation2=function(step){//俯仰角
        var direction1=this.camera.getWorldDirection();
        var direction2 = new THREE.Vector3(//up方向
            0,1,0
        );
        var direction=new THREE.Vector3();
        direction=direction.crossVectors(direction1,direction2);
        var pos=this.camera.position;
        direction1.applyAxisAngle(direction,step);
        this.camera.lookAt(pos.x+direction1.x,
            pos.y+direction1.y,
            pos.z+direction1.z);
        this.camera.updateMatrix();
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
    this.onMouseWheel=function(event){
        console.log(event);
    }
    this.init=function(  ) {
        document.addEventListener( 'mousemove',scope.onMouseMove, false );
        document.addEventListener( 'mouseup', scope.onMouseUp, false );
        document.addEventListener( 'mousedown',scope.onMouseDown, false );
        document.addEventListener( 'mousewheel', scope.onMouseWheel, false );
    }
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