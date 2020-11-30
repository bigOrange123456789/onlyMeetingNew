function PreviewManager(camera,roamPath){//var myPreviewManager=new PreviewManager();
    var scope=this;
    this.camera=camera;
    this.roamPath=roamPath;
    this.myPreviewflag=0;//用于标注自动漫游是否正在进行
    this.stopFlag=false;
    this.isLoop=true;

    this.autoRoam=function () {
        if(!scope.stopFlag)//不是用户控制才是自动漫游
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
        //现在的错误：
        //1.直接跳到了本阶段的结束状态
        //不知道是什么原因
        //偏移路线后重启，本阶段会立即结束
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