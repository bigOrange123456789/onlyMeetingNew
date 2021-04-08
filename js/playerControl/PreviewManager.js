import {MoveManager} from './MoveManager.js';
export {PreviewManager};
class PreviewManager{
    myVideoManager;
    myMoveManager;
    constructor(camera,roamPath,myVideoManager){
        var scope=this;
        scope.myVideoManager=myVideoManager;
        scope.myMoveManager=new MoveManager(camera,roamPath);
    }
    #cameraImg1;
    #cameraImg2;
    createCameraButton=function(src1,src2){
        var scope=this;
        scope.#cameraImg1=new MyImage(src1,window.innerHeight/13,window.innerHeight/13,window.innerWidth/25,window.innerHeight-80,document.body);
        scope.#cameraImg2=new MyImage(src2,window.innerHeight/13,window.innerHeight/13,window.innerWidth/25,window.innerHeight-80,document.body);
        if(!scope.stopFlag)scope.#cameraImg2.img.style.display='none';
        scope.#cameraImg1.img.onclick = function () {
            scope.myVideoManager.setPlay();
            if (scope.myMoveManager.stopFlag=== true) {
                scope.myMoveManager.stopFlag = false;
                scope.#cameraImg2.img.style.display = 'none';
            } else {
                scope.myMoveManager.stopFlag = true;
                scope.#cameraImg2.img.style.display = 'block';
            }
        };
        scope.#cameraImg2.img.onclick = function () {
            scope.myVideoManager.setPlay();
            if (scope.myMoveManager.stopFlag === true) {
                scope.myMoveManager.stopFlag = false;
                scope.#cameraImg2.img.style.display = 'none';
            } else {
                scope.myMoveManager.stopFlag = true;
                scope.#cameraImg2.img.style.display = 'block';
            }
        };
        function MyImage(src,w,h,x,y,parent){//添加的是image对象，而不是ImageMove对象
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