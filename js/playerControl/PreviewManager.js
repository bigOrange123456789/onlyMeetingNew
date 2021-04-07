export {PreviewManager};
class PreviewManager{
    myVideoManager;
    camera;
    roamPath;
    myPreviewflag;//确定目标节点
    stopFlag;
    isLoop;//如果不进行循环漫游的话，第一行的初始状态就没用了

    myMakeOneRoamStep=new MakeOneRoamStep();
    constructor(camera,roamPath,myVideoManager){
        var scope=this;
        scope.myVideoManager=myVideoManager;
        scope.camera=camera;
        scope.roamPath=roamPath;
        scope.myPreviewflag=1;//确定目标节点
        scope.stopFlag=true;
        scope.isLoop=false;//如果不进行循环漫游的话，第一行的初始状态就没用了

        scope.myMakeOneRoamStep=new MakeOneRoamStep();
        this.#autoRoam();//创建后自动执行
    }
    #autoRoam=function () {
        var scope=this;
        autoRoam0();
        function autoRoam0(){
            if(!scope.stopFlag)//是否停止自动漫游
                if(scope.myMakeOneRoamStep.preview(scope.myPreviewflag,scope.camera,scope.roamPath)) {
                    scope.myPreviewflag++;
                    if(scope.myPreviewflag=== scope.roamPath.length)
                        if(scope.isLoop)scope.myPreviewflag = 0;
                        else scope.stopFlag=true;
                }
            requestAnimationFrame(autoRoam0);
        }
    }
    #cameraImg1;
    #cameraImg2;
    createCameraButton=function(src1,src2){
        var scope=this;
        scope.#cameraImg1=new ImageMove(src1,window.innerHeight/13,window.innerHeight/13,window.innerWidth/25,window.innerHeight-80,document.body);
        scope.#cameraImg2=new ImageMove(src2,window.innerHeight/13,window.innerHeight/13,window.innerWidth/25,window.innerHeight-80,document.body);
        if(!scope.stopFlag)scope.#cameraImg2.img.style.display='none';
        scope.#cameraImg1.img.onclick = function () {
            scope.myVideoManager.setPlay();
            if (scope.stopFlag=== true) {
                scope.stopFlag = false;
                scope.#cameraImg2.img.style.display = 'none';
            } else {
                scope.stopFlag = true;
                scope.#cameraImg2.img.style.display = 'block';
            }
        };
        scope.#cameraImg2.img.onclick = function () {
            scope.myVideoManager.setPlay();
            if (scope.stopFlag === true) {
                scope.stopFlag = false;
                scope.#cameraImg2.img.style.display = 'none';
            } else {
                scope.stopFlag = true;
                scope.#cameraImg2.img.style.display = 'block';
            }
        };
        //stopFlagControl();
        function ImageMove(src,w,h,x,y,parent){//添加的是image对象，而不是ImageMove对象
            if (typeof(parent) == "undefined") parent = document.body;
            this.w = w;
            this.h = h;
            this.x = x;//在parent中的位置
            this.y = y;//在parent中的位置
            this.ratio = w / h;

            this.img = new Image();
            this.img.src = src;
            this.img.width = w;
            this.img.height = h;
            this.img.style.cssText = 'display:block;' +
                'position:absolute;' +//位置可变
                'left:' + x + 'px;' +//到部件左边距离
                'top:' + y + 'px;'; //到部件右边 距离
            parent.appendChild(this.img);

            this.setX=function(x){
                this.x=x;
                this.img.style.left=x+'px';
            }
            this.setY=function(y){
                this.y=y;
                this.img.style.top=y+'px';
            }
            this.setXY=function(x,y){
                this.x=x;
                this.img.style.left=x+'px';
                this.y=y;
                this.img.style.top=y+'px';
            }
            this.move=function(direction,step){
                if(typeof(step) == "undefined")step=0.1;
                if(direction<0){//字母与数字比较大小结果始终为false
                    step*=-1;
                    direction*=-1;
                }
                if(direction==='x'||direction===1)this.setX(this.x+step);
                else if(direction==='y'||direction===2)this.setY(this.y+step);
            }
            this.setW=function(w){
                this.w=w;
                this.img.width=w;
            }
            this.setH=function(h){
                this.h=h;
                this.img.height=h;
            }
            this.left=function(n){
                this.x=this.x-n;
                this.img.style.left=this.x+'px';
            }
            this.scale=function(direction,step){//direction为3意思是成比例的放缩,ratio是w/h
                if(typeof(step) == "undefined")step=0.1;
                if(direction<0){//字母与数字比较大小结果始终为false
                    step*=-1;
                    direction*=-1;
                }
                if(direction==='w'||direction===1)this.setW(this.w+step);
                else if(direction==='h'||direction===2)this.setH(this.h+step);
                else if(direction===3){this.setW(this.w+step);this.setH(this.h+step/this.ratio);}
            }
        }

    }
}
class MakeOneRoamStep{
    pattern;
    rectify;//记录这是第几步//第一步更新参数，最后一步纠正状态
    stepIndex_max;

    targetStatus;//目标状态

    dx;dy;dz;//一步的位移

    da;db;dc;//一步的旋转

    constructor(){
        var scope=this;
        scope.rectify=true;//
        scope.stepIndex=1;//记录这是第几步//第一步更新参数，最后一步纠正状态
    }
    #updateParam=function(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time){
        var scope=this;
        //console.log(x1,y1,z1,a1,b1,c1,x2,y2,z2,a2,b2,c2,);
        //剩余多少时间
        //console.log(time);
        //scope.stepIndex_max=time;

        scope.dx=(x2-x1)/time;
        scope.dy=(y2-y1)/time;
        scope.dz=(z2-z1)/time;

        scope.da=(a2-a1)/time;
        scope.db=(b2-b1)/time;
        scope.dc=(c2-c1)/time;

        scope.targetStatus=[x2,y2,z2,a2,b2,c2];
    }
    #initParam=function(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time){
        var scope=this;
        scope.stepIndex_max=time;
        scope.#updateParam(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time);
    }
    preview=function(mystate,camera,mydata){//thisObj,time,mycamera,k//thisObj,x1,y1,z1,x2,y2,z2,time,mycamera,k
        var scope=this;
        var x1,y1,z1,x2,y2,z2,//位置
            a1,b1,c1,a2,b2,c2;//角度//a=c

        var time=mydata[mystate][6];
        //当前状态
        x1=camera.position.x;
        y1=camera.position.y;
        z1=camera.position.z;
        a1=camera.rotation.x;
        b1=camera.rotation.y;
        c1=camera.rotation.z;
        //目标状态
        x2=mydata[mystate][0];
        y2=mydata[mystate][1];
        z2=mydata[mystate][2];
        a2=mydata[mystate][3];
        b2=mydata[mystate][4];
        c2=mydata[mystate][5];
        
        if(scope.stepIndex===1){//新的阶段
            scope.#initParam(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time);
        }else if(scope.rectify){//如果有路径纠正功能
            scope.#updateParam(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time-scope.stepIndex+1);
        }
        return movetoPos(camera,scope);
        function movetoPos(camera,scope){//移动
            if(scope.stepIndex<scope.stepIndex_max){
                camera.position.x+=scope.dx;
                camera.position.y+=scope.dy;
                camera.position.z+=scope.dz;
                camera.rotation.x+=scope.da;
                camera.rotation.y+=scope.db;
                camera.rotation.z+=scope.dc;
                scope.stepIndex++;
                return false;
            }else{
                camera.position.set(scope.targetStatus[0],scope.targetStatus[1],scope.targetStatus[2]);
                camera.rotation.set(scope.targetStatus[3],scope.targetStatus[4],scope.targetStatus[5]);
                scope.stepIndex=1;
                return true;
            }
        }
    }
}