function PreviewManager(camera,roamPath){//var myPreviewManager=new PreviewManager();
    var scope=this;
    this.camera=camera;
    this.roamPath=roamPath;
    this.myPreviewflag=1;//确定目标节点
    this.stopFlag=false;
    this.isLoop=false;//如果不进行循环漫游的话，第一行的初始状态就没用了

    this.myMakeOneRoamStep=new MakeOneRoamStep();

    this.autoRoam=function () {
        if(!scope.stopFlag)//是否停止自动漫游
            if(scope.myMakeOneRoamStep.preview(scope.myPreviewflag,scope.camera,scope.roamPath)) {
                scope.myPreviewflag++;
                if(scope.myPreviewflag=== scope.roamPath.length)
                    if(scope.isLoop)scope.myPreviewflag = 0;
                    else scope.stopFlag=true;
            }
        requestAnimationFrame(scope.autoRoam);
    }
    //this.autoRoam();//创建后自动执行

}
function MakeOneRoamStep(){
    var scope=this;
    this.stepIndex=1;//记录这是第几步//第一步更新参数，最后一步纠正状态
    this.stepIndex_max;

    this.targetStatus;

    this.dx;
    this.dy;
    this.dz;

    this.da;
    this.db;
    this.dc;

    this.updateParam=function(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time){
        //console.log(x1,y1,z1,a1,b1,c1,x2,y2,z2,a2,b2,c2,);
        this.stepIndex_max=time;

        this.dx=(x2-x1)/time;
        this.dy=(y2-y1)/time;
        this.dz=(z2-z1)/time;

        this.da=(a2-a1)/time;
        this.db=(b2-b1)/time;
        this.dc=(c2-c1)/time;

        this.targetStatus=[x2,y2,z2,a2,b2,c2];
    }
    this.preview=function(mystate,camera,mydata){//thisObj,time,mycamera,k//thisObj,x1,y1,z1,x2,y2,z2,time,mycamera,k
        if(this.stepIndex===1){
            var x1,y1,z1,x2,y2,z2,//位置
                a1,b1,c1,a2,b2,c2;//角度//a=c
            var time=mydata[mystate][6];

            x1=camera.position.x;
            y1=camera.position.y;
            z1=camera.position.z;
            a1=camera.rotation.x;
            b1=camera.rotation.y;
            c1=camera.rotation.z;

            x2=mydata[mystate][0];
            y2=mydata[mystate][1];
            z2=mydata[mystate][2];
            a2=mydata[mystate][3];
            b2=mydata[mystate][4];
            c2=mydata[mystate][5];
            this.updateParam(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time);
        }
        return movetoPos(camera,scope);
    }
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
function PreviewManagerpPro(camera,roamPath){//var myPreviewManager=new PreviewManager();
    var scope=this;
    this.camera=camera;
    this.roamPath=roamPath;
    this.myPreviewflag=0;//用于标注自动漫游是否正在进行
    this.stopFlag=false;
    this.isLoop=true;

    this.autoRoam=function () {
        if(!scope.stopFlag)//是否停止自动漫游
            if(preview(scope.myPreviewflag,scope.camera,scope.roamPath)) {
                scope.myPreviewflag++;
                if(scope.myPreviewflag=== scope.roamPath.length)
                    if(scope.isLoop)scope.myPreviewflag = 0;
                    else scope.stopFlag=true;
            }
        requestAnimationFrame(scope.autoRoam);
    }
    //this.autoRoam();//创建后自动执行
    function preview(mystate,camera,mydata){//thisObj,time,mycamera,k//thisObj,x1,y1,z1,x2,y2,z2,time,mycamera,k
        var x1,y1,z1,x2,y2,z2,//位置
            a1,b1,c1,a2,b2,c2;//角度//a=c
        //console.log(mystate,camera,mydata);
        var time=mydata[mystate][6];
        var k;//前一个
        if(mystate===0)k=mydata.length-1;
        else k=mystate-1;
        x1=mydata[k][0];
        y1=mydata[k][1];
        z1=mydata[k][2];
        a1=mydata[k][3];
        b1=mydata[k][4];
        c1=mydata[k][5];

        x2=mydata[mystate][0];
        y2=mydata[mystate][1];
        z2=mydata[mystate][2];
        a2=mydata[mystate][3];
        b2=mydata[mystate][4];
        c2=mydata[mystate][5];


        return movetoPos(camera,x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time);
    }
    function movetoPos(camera,x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time){//移动
        var x=camera.position.x;
        var y=camera.position.y;
        var z=camera.position.z;
        var a=camera.rotation.x;
        var b=camera.rotation.y;
        var c=camera.rotation.z;

        camera.position.set(
            x+(x2-x1)/time,
            y+(y2-y1)/time,
            z+(z2-z1)/time
        );

        camera.rotation.set(
            a+(a2-a1)/time,
            b+(b2-b1)/time,
            c+(c2-c1)/time
        );

        //if(z1==3.8)console.log(x1,x,x2,';',z1,z,z2);
        var flag=0;
        if(z1!=z2&&!(z1<=z&&z<=z2)&&!(z2<=z&&z<=z1))flag=1;
        else if(x1!=x2&&!(x1<=x&&x<=x2)&&!(x2<=x&&x<=x1))flag=1;//已到达目的地
        else if(x1==x2&&z1==z2)flag=1;//else if(x1==x2&&y1==y2)flag=1;
        if(flag==1){
            camera.position.set(x2,y2,z2);
            return true;
        }
        return false;
    }
}