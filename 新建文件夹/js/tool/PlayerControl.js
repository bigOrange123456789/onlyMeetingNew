function PlayerControl(camera){
    this.controller=new PlayerControl0(camera);
    this.init=function () {
        var scope=this;
        this.controller.KeyboardMoveStep=8;
        function tool(){
            requestAnimationFrame(tool);
            scope.controller.update();
        }tool();
    }
    this.init();
}/**/
function PlayerControl0(camera){
    this.camera=camera;
    var scope=this;
    this.KeyboardMoveStep=3;
    this.autoPath=[];

    this.onceClicked=false;

    this.dposition={
        left:0,
        forward:0,
        up:0
    }//[0,0,0];//left、forward、up

    this.update=function () {
        if(scope.dposition.left)scope.left(scope.dposition.left);
        if(scope.dposition.forward)scope.forward(scope.dposition.forward);
        if(scope.dposition.up)scope.up(scope.dposition.up);
    }
    this.ableRotation=true;

    var myMouseManager=new MouseManager();
    myMouseManager.dragMouse=function (dx,dy) {
        scope.onceClicked=true;
        if(!scope.ableRotation)return;
        scope.rotation1(-0.015*dx);
        scope.rotation2(-0.015*dy);
    }
    myMouseManager.onMouseWheel=function(event){
        var delta = 0;
        if ( event.wheelDelta !== undefined )delta = event.wheelDelta;
        else if ( event.detail !== undefined )delta = - event.detail;
        scope.forward(delta/2);
    }

    var myKeyboardManager=new KeyboardManager();
    myMouseManager.init();
    myKeyboardManager.onKeyDown=function(event){
        var step=scope.KeyboardMoveStep;
        if(event.key==="ArrowUp"||event.key==="w")scope.dposition.forward=step;//forward(step);
        else if(event.key==="ArrowDown"||event.key==="s")scope.dposition.forward=-step;//forward(-step);
        else if(event.key==="q"||event.key==="Q")scope.dposition.up=step;
        else if(event.key==="e"||event.key==="E")scope.dposition.up=-step;
        else if(event.key==="ArrowLeft"||event.key==="a")scope.dposition.left=step;
        else if(event.key==="ArrowRight"||event.key==="d")scope.dposition.left=-step;

        else if(event.key==="W")scope.forward_horizon(step);
        else if(event.key==="S")scope.forward_horizon(-step);
        else if(event.key==="A")scope.left_horizon(step);
        else if(event.key==="D")scope.left_horizon(-step);
        else if(event.key==="v"){
            var a=Math.floor(scope.camera.rotation.x*100000)/100000;
            var b=Math.floor(scope.camera.rotation.y*100000)/100000;
            var c=Math.floor(scope.camera.rotation.z*100000)/100000;
            /*if(a<-Math.PI)a+=Math.PI*2;
            if(b<-Math.PI)b+=Math.PI*2;
            if(c<-Math.PI)c+=Math.PI*2;*/
            var s="["+
                Math.floor(scope.camera.position.x*100)/100+","+
                Math.floor(scope.camera.position.y*100)/100+","+
                Math.floor(scope.camera.position.z*100)/100+","+
                a+","+
                b+","+
                c+",100]"
            console.log(","+s);
            scope.autoPath.push(s);
        }else if(event.key==="V")alert(scope.autoPath);

    }
    myKeyboardManager.onKeyUp=function(event){
        if(event.key==="ArrowUp"||event.key==="w")        scope.dposition.forward=0;//forward(step);
        else if(event.key==="ArrowDown"||event.key==="s") scope.dposition.forward=0;//forward(-step);
        else if(event.key==="q"||event.key==="Q")         scope.dposition.up=0;
        else if(event.key==="e"||event.key==="E")         scope.dposition.up=0;
        else if(event.key==="ArrowLeft"||event.key==="a") scope.dposition.left=0;
        else if(event.key==="ArrowRight"||event.key==="d")scope.dposition.left=0;

    }
    myKeyboardManager.init();

    var myPhoneManager=new PhoneManager();
    myPhoneManager.drag=function(dx,dy){
        if(!scope.ableRotation)return;
        scope.rotation1(-0.015*dx);
        scope.rotation2(-0.015*dy);
    }
    myPhoneManager.dragDouble=function(distanceChange){
        scope.forward(distanceChange);
    }
    myPhoneManager.init();

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
    this.left_horizon=function (step) {//相机的左方向是（-1，0，0）
        var direction = new THREE.Vector3(
            -0.1*this.camera.matrixWorld.elements[0]*step
            ,0
            ,-0.1*this.camera.matrixWorld.elements[2]*step
        );
        this.camera.position.set(
            this.camera.position.x+direction.x,
            this.camera.position.y+direction.y,
            this.camera.position.z+direction.z
        );
    }
    this.forward_horizon=function (step) {//相机的初始方向是（0，0，-1）//对y旋转-90度后相机为水平方向camera.rotation.set(0,-Math.PI/2,0);
        var direction = new THREE.Vector3(
            -0.1*this.camera.matrixWorld.elements[8]*step
            ,0
            ,-0.1*this.camera.matrixWorld.elements[10]*step
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
    this.init=function() {
        document.addEventListener( 'mousemove',scope.onMouseMove, true );
        document.addEventListener( 'mouseup', scope.onMouseUp, true );
        document.addEventListener( 'mousedown',scope.onMouseDown, true );
        document.addEventListener( 'mousewheel', scope.onMouseWheel, false );
    }
}
function KeyboardManager(){
    var scope=this;
    this.onKeyDown=function(event){
        console.log(event);
    }
    this.onKeyUp=function(event){
        console.log(event);
    }
    this.init=function(){
        window.addEventListener( 'keydown',scope.onKeyDown, false );
        window.addEventListener( 'keyup',scope.onKeyUp  , false );
    }
}
function PhoneManager(){
    var scope=this;
    this.preX=-1;
    this.preY=-1;
    this.preDistance=-1;
    this.drag=function(dx,dy){
        console.log(dx,dy);
    }
    this.dragDouble=function(distanceChange){
        console.log(distanceChange);
    }
    this.onTouchMove = function (event) {
        //event.touches.length//同时出现的触摸点个数
        if(event.touches.length===1){
            if(scope.preX>=0&&scope.preY>=0)
                scope.drag(
                    event.touches[ 0 ].pageX-scope.preX,
                    event.touches[ 0 ].pageY-scope.preY
                );
            scope.preX=event.touches[ 0 ].pageX;
            scope.preY=event.touches[ 0 ].pageY;
        }else if(event.touches.length===2){
            var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
            var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
            var distance = Math.sqrt( dx * dx + dy * dy );
            if(scope.preDistance>=0)
                scope.dragDouble(distance-scope.preDistance);
            scope.preDistance=distance;
        }
    }
    this.onTouchEnd=function () {
        scope.preX=-1;
        scope.preY=-1;
        scope.preDistance=-1;
    }
    this.init=function(){
        /*function test(){
            console.log(scope.preY);
            requestAnimationFrame(test);
        }test();*/
        document.addEventListener( 'touchmove', scope.onTouchMove, false );
        document.addEventListener( 'touchend', scope.onTouchEnd, false );
    }
}