//InstancedGroup.test
function InstancedGroupTest(){
        this.scene;
        this.camera;

        this.tag;
        this.button_flag;
        this.referee;
        this.frameIndex;
        this.frameIndexPre;
        this.frameIndexPre_10s;
}
InstancedGroupTest.prototype={
        setContext:function () {
                this.frameIndex=this.frameIndexPre=0;
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
                function computeFPS() {
                        scope.tag.reStr((scope.frameIndex-scope.frameIndexPre));
                        //scope.tag.reStr("FPS:"+(scope.frameIndex-scope.frameIndexPre));
                        scope.frameIndexPre=scope.frameIndex;
                }
                setInterval(computeFPS,1000);
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
                        scope.frameIndex++;
                        renderer.render( scene, camera );
                        requestAnimationFrame(render);
                }
                this.scene=scene;
                this.camera=camera;
        },
        //有动画测试
        test5_0:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"

                        var peoples = new InstancedGroup(
                            16000,
                            [mesh],//这些mesh的网格应该一致
                            glb.animations[0]
                        );
                        peoples.init(['./img/texture/w/w0.jpg'],16);
                        for (var i = 0; i < peoples.instanceCount; i++) {
                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(i, [3 * i, 0, 0]);
                                peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                peoples.speedSet(i,0.5);
                                peoples.animationSet(i,0);
                        }
                        scope.scene.add(peoples.obj);


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },
        //行轻量化处理帧数统计
        test6:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        //预先加载一下资源
                        var peoples = new InstancedGroup(
                            1,
                            [glb.scene.children[0].children[1]],//这些mesh的网格应该一致
                            glb.animations[0]
                        );
                        peoples.init(['./img/texture/w/w0.jpg'],16,false);
                        scope.scene.add(peoples.obj);
                        scope.scene.remove(peoples.obj);


                        //console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        this.frameIndexPre_10s=this.frameIndex;
                        peoples=null;
                        var result="";
                        var count0=1;
                        var countStep=10;
                        var countLast=200;
                        var count=count0;
                        var myInterval=setInterval(function () {
                                var FPS,obj;
                                if(peoples){
                                        FPS=scope.tag.element.innerHTML;//scope.frameIndex-scope.frameIndexPre_10s;
                                        console.log("人数:"+peoples.instanceCount+
                                            ",帧数:"+FPS
                                        );
                                        //scope.scene.remove(peoples.obj);
                                        obj=peoples.obj;
                                        count+=countStep;
                                        if(result==="")result+=FPS;
                                        else result+=(","+FPS);
                                }else{
                                        FPS=60;
                                        obj=null;
                                }
                                peoples = new InstancedGroup(
                                    count,
                                    [mesh],//这些mesh的网格应该一致
                                    glb.animations[0]
                                );
                                peoples.init(['./img/texture/w/w0.jpg'],16,false);
                                for (var i = 0; i < peoples.instanceCount; i++) {
                                        peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                        peoples.positionSet(i, [3 * i, 0, 0]);
                                        peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                        peoples.speedSet(i,0.5);
                                        peoples.animationSet(i,0);
                                }
                                if(obj)scope.scene.remove(obj);
                                scope.scene.add(peoples.obj);
                                scope.frameIndexPre_10s=scope.frameIndex;
                                if(FPS<5||count>countLast){
                                        window.clearInterval(myInterval);
                                        console.log(result);

                                        /*let link = document.createElement('a');
                                        link.style.display = 'none';
                                        document.body.appendChild(link);
                                        link.href = URL.createObjectURL(new Blob([
                                            "result=getAvatarNumber(result,"+
                                            "["+result+"]"+","+count0+","+countStep
                                            +");"
                                        ], { type: 'text/plain' }));
                                        link.download = name;
                                        link.click();*/

                                        communication(
                                            "result=getAvatarNumber(result,"+
                                            "["+result+"]"+","+count0+","+countStep
                                            +");"
                                        );
                                        alert("result=getAvatarNumber(result,"+
                                            "["+result+"]"+","+count0+","+countStep
                                            +");");
                                }

                                //台式机测试结果

                                //笔记本测试结果
                                //60,60,60,60,51,42,35,30,27,24,22,20,17,17,16,15,14,12,12,11,10,10,9,9,8,8,8,7,7,9,6,7,5,6,6,6,6,5,6,5
                        },2500);


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },
        //不进行轻量化处理帧数统计
        test7:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        //预先加载一下资源
                        var peoples = new InstancedGroup2(
                            1,
                            [glb.scene.children[0].children[1]],//这些mesh的网格应该一致
                            glb.animations[0]
                        );
                        peoples.init(['./img/texture/w/w0.jpg'],16,false);
                        scope.scene.add(peoples.obj);
                        scope.scene.remove(peoples.obj);


                        //console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        this.frameIndexPre_10s=this.frameIndex;
                        peoples=null;
                        var result="";
                        var count0=71;
                        var countStep=2;
                        var countLast=100;
                        var count=count0;
                        var myInterval=setInterval(function () {
                                var FPS,obj;
                                if(peoples){
                                        FPS=scope.tag.element.innerHTML;//scope.frameIndex-scope.frameIndexPre_10s;
                                        console.log("人数:"+peoples.instanceCount+
                                            ",帧数:"+FPS
                                        );
                                        //scope.scene.remove(peoples.obj);
                                        obj=peoples.obj;
                                        count+=countStep;
                                        if(result==="")result+=FPS;
                                        else result+=(","+FPS);
                                }else{
                                        FPS=60;
                                        obj=null;
                                }
                                peoples = new InstancedGroup2(
                                    count,
                                    [mesh],//这些mesh的网格应该一致
                                    glb.animations[0]
                                );
                                peoples.init(['./img/texture/w/w0.jpg'],16,false);
                                for (var i = 0; i < peoples.instanceCount; i++) {
                                        peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                        peoples.positionSet(i, [3 * i, 0, 0]);
                                        peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                        peoples.speedSet(i,0.5);
                                        peoples.animationSet(i,0);
                                }
                                if(obj)scope.scene.remove(obj);
                                scope.scene.add(peoples.obj);
                                scope.frameIndexPre_10s=scope.frameIndex;
                                if(FPS<5||count>countLast){
                                        window.clearInterval(myInterval);
                                        console.log(result);

                                        communication(
                                            "result=getAvatarNumber(result,"+
                                            "["+result+"]"+","+count0+","+countStep
                                            +");"
                                        );
                                        alert("result=getAvatarNumber(result,"+
                                            "["+result+"]"+","+count0+","+countStep
                                            +");");
                                }

                                //台式机测试结果

                                //笔记本测试结果
                        },2500);


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },


        //采用轻量化处理与不采用的比较//输出//帧数，进行和不进行帧数统计
        test11:function (PCType){
                //PCType:1手机,2笔记本,3电脑
                var count0,countStep,count0OPT,countStepOPT,resultType;
                resultType=0;//0：x(人数)y(帧数)//1：x(帧数)y(人数)
                if(PCType===1){
                        count0=80;
                        countStep=20;

                        count0OPT=80;
                        countStepOPT=20;

                        countLast=1700;//正无穷
                }else if(PCType===2){//2笔记本
                        count0=150;
                        countStep=10;

                        count0OPT=150;
                        countStepOPT=30;

                        countLast=1700;//正无穷
                }else{//3电脑
                        count0=100;
                        countStep=25;

                        count0OPT=1;
                        countStepOPT=1500;

                        countLast=1700;//正无穷
                }

                this.setContext();
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        analysis(1);
                        function analysis(time) {//time为1或2

                                //预先加载一下资源
                                var peoples = time===1?new InstancedGroup(
                                    1,
                                    [glb.scene.children[0].children[1]],//这些mesh的网格应该一致
                                    glb.animations[0]
                                ):new InstancedGroup2(
                                    1,
                                    [glb.scene.children[0].children[1]],//这些mesh的网格应该一致
                                    glb.animations[0]
                                );
                                peoples.init(['./img/texture/w/w0.jpg'],16,false);
                                scope.scene.add(peoples.obj);
                                scope.scene.remove(peoples.obj);


                                //console.log(glb);//OnlyArm
                                var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                                this.frameIndexPre_10s=this.frameIndex;
                                peoples=null;
                                var result=[];
                                var count=time===1?count0OPT:count0;
                                if(PCType)timeInterval=3000;
                                else timeInterval=1500;
                                var myInterval=setInterval(function () {
                                        var FPS,obj;
                                        if(peoples){
                                                FPS=scope.tag.element.innerHTML;//scope.frameIndex-scope.frameIndexPre_10s;
                                                console.log("人数:"+peoples.instanceCount+
                                                    ",帧数:"+FPS
                                                );
                                                //scope.scene.remove(peoples.obj);
                                                obj=peoples.obj;
                                                count=time===1?count+countStepOPT:count+countStep;
                                                result.push(FPS);
                                        }else{
                                                FPS=60;
                                                obj=null;
                                        }
                                        peoples = time===1?new InstancedGroup(
                                            count,
                                            [mesh],//这些mesh的网格应该一致
                                            glb.animations[0]
                                        ):new InstancedGroup2(
                                            count,
                                            [mesh],//这些mesh的网格应该一致
                                            glb.animations[0]
                                        );
                                        if(time===1)peoples.init(['./img/texture/w/w0.jpg'],16,false);
                                        else {
                                                var srcs=[];
                                                for(i=0;i<16;i++)
                                                        srcs.push("performanceAnalysis/texture/w/w"+i+".jpg");
                                                peoples.init(srcs);
                                        }
                                        for (var i = 0; i < peoples.instanceCount; i++) {
                                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                                peoples.positionSet(i, [3 * i, 0, 0]);
                                                peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                                peoples.speedSet(i,0.5);
                                                peoples.animationSet(i,0);
                                        }
                                        if(obj)scope.scene.remove(obj);
                                        scope.scene.add(peoples.obj);
                                        scope.frameIndexPre_10s=scope.frameIndex;
                                        console.log(FPS,count);
                                        if(FPS<5||count>countLast){
                                                window.clearInterval(myInterval);
                                                scope.scene.remove(peoples.obj);
                                                console.log(result);

                                                if(time===1){
                                                        window.result1=result;
                                                        analysis(2);
                                                }else{
                                                        result1=window.result1;
                                                        result2=result;
                                                        if(resultType===0){
                                                                console.log(
                                                                    print0(
                                                                        result2,count0   ,countStep   ,""
                                                                    )+print0(
                                                                    result1,count0OPT,countStepOPT,"OPT"
                                                                    )
                                                                )
                                                                communication(
                                                                    print0(
                                                                        result2,count0   ,countStep   ,""
                                                                    )+print0(
                                                                        result1,count0OPT,countStepOPT,"OPT"
                                                                    )
                                                                );
                                                                function print0(data,c0,cStep,name){
                                                                        var X=[],Y=[];
                                                                        for(i=0;i<data.length;i++)
                                                                        if(data[i]<=60){//大于60的数据显然为错误数据
                                                                                X.push(c0+cStep*i);
                                                                                Y.push(data[i])
                                                                        }
                                                                        return (
                                                                            "X"+PCType+name+"=["+X.toString()+"];"+
                                                                            "Y"+PCType+name+"=["+Y.toString()+"];"
                                                                        );
                                                                }
                                                        }else{
                                                                communication(
                                                                    print(
                                                                        getAvatarNumber(result2,count0   ,countStep   ),""
                                                                    )+print(
                                                                        getAvatarNumber(result1,count0OPT,countStepOPT),"OPT"
                                                                    )
                                                                );
                                                                function getAvatarNumber(FNS,PN0,step) {
                                                                        var ANS=[];
                                                                        for(i=0;i<=60;i++)ANS.push(0);

                                                                        var PN=PN0;
                                                                        for(i=0;i<FNS.length;i++){
                                                                                if(FNS[i]<=60)
                                                                                        ANS[Math.floor(FNS[i])]=PN;
                                                                                PN+=step;
                                                                        }
                                                                        return ANS;
                                                                }
                                                                function print(arr0,name) {//name:"","OPT"
                                                                        var X=[],Y=[];//X是帧数，Y是人数
                                                                        for(i=0;i<arr0.length;i++){
                                                                                if(arr0[i]!==0){
                                                                                        X.push(i);
                                                                                        Y.push(arr0[i]);
                                                                                }
                                                                        }
                                                                        for(i=Y.length-1;i>0;i--)
                                                                                if(Y[i-1]<Y[i])Y[i-1]=Y[i];
                                                                        return (
                                                                            "X"+PCType+name+"=["+X.toString()+"];"+
                                                                            "Y"+PCType+name+"=["+Y.toString()+"];"
                                                                        );
                                                                }
                                                        }
                                                        alert("finished!");
                                                }

                                        }

                                        //台式机测试结果

                                        //笔记本测试结果
                                        //60,60,60,60,51,42,35,30,27,24,22,20,17,17,16,15,14,12,12,11,10,10,9,9,8,8,8,7,7,9,6,7,5,6,6,6,6,5,6,5
                                },2500);
                        }

                });//
                //完成测试
        },

        //场景中人数变化的帧数统计
        test8:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        //console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        this.frameIndexPre_10s=this.frameIndex;
                        var peoples=null;
                        var result="";
                        var myInterval=setInterval(function () {
                                var count=100;
                                var FPS;
                                if(peoples){
                                        FPS=scope.frameIndex-scope.frameIndexPre_10s;
                                        console.log("人数:"+peoples.instanceCount+
                                            ",帧数:"+FPS
                                        );
                                        scope.scene.remove(peoples.obj);
                                        count+=peoples.instanceCount;
                                }else{
                                        FPS=60;
                                }
                                peoples = new InstancedGroup(
                                    count,
                                    [mesh],//这些mesh的网格应该一致
                                    glb.animations[0]
                                );
                                peoples.init(['./img/texture/w/w0.jpg'],16);
                                for (var i = 0; i < peoples.instanceCount; i++) {
                                        peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                        peoples.positionSet(i, [3 * i, 0, 0]);
                                        peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                        peoples.speedSet(i,0.5);
                                        peoples.animationSet(i,0);
                                }
                                scope.scene.add(peoples.obj);
                                scope.frameIndexPre_10s=scope.frameIndex;
                                if(FPS<30){
                                        window.clearInterval(myInterval);
                                        console.log(result);
                                }
                                result+=(","+FPS);
                                //60,58,59,59,59,59,59,59,59,59,59,59,59,59,59,59,59,58,55,52,48,47,46,44,44,41,41,39,37,37,34,34,31
                        },1000);


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },

        //进行轻量化处理的人数统计//不低于某帧的最大人数
        test9:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        //console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        this.frameIndexPre_10s=this.frameIndex;
                        var peoples=null;
                        var result="";
                        var count=1;
                        var countStep=1;
                        var resultNew=[];
                        for(i=0;i<=60;i++)resultNew.push(-1);
                        computePeoplesNum(60);
                        function computePeoplesNum(FPS) {//获取一个就行，不用最大

                        }
                        function getFPS(PSN) {//获取某个人的帧数

                        }
                        var myInterval=setInterval(function () {
                                var FPS,obj;
                                FPS=scope.tag.element.innerHTML;
                                if(peoples){
                                        if(FPS<=60)resultNew[Math.floor(FPS)]=count;

                                        //if(FPS<45)
                                        if(countStep>0){//帧数减小
                                                if(//按照期望人数多
                                                    FPS>=40||
                                                    resultNew[Math.floor(FPS)-1]>resultNew[Math.floor(FPS)]
                                                )countStep*=2;
                                                else//中间有跳过//退后一步
                                                        countStep=-Math.floor(countStep/2);//countStep*=-1;//
                                        }else{//帧数增多
                                                if(//纠正了异常
                                                    Math.floor(FPS)>=60||(
                                                        resultNew[Math.floor(FPS)-1]>resultNew[Math.floor(FPS)]&&
                                                        resultNew[Math.floor(FPS)]>resultNew[Math.floor(FPS)+1]
                                                    )
                                                )countStep=-Math.floor(countStep/2);
                                                else//没有纠正异常
                                                        countStep*=2;
                                        }
                                        firstFlag=false;

                                        console.log("人数:"+peoples.instanceCount+
                                            ",帧数:"+FPS
                                        );
                                        //scope.scene.remove(peoples.obj);
                                        obj=peoples.obj;
                                        count+=countStep;
                                }else{
                                        obj=null;
                                }
                                peoples = new InstancedGroup(
                                    count,
                                    [mesh],//这些mesh的网格应该一致
                                    glb.animations[0]
                                );
                                peoples.init(['./img/texture/w/w0.jpg'],16,false);
                                for (var i = 0; i < peoples.instanceCount; i++) {
                                        peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                        peoples.positionSet(i, [3 * i, 0, 0]);
                                        peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                        peoples.speedSet(i,0.5);
                                        peoples.animationSet(i,0);
                                }
                                if(obj)scope.scene.remove(obj);
                                scope.scene.add(peoples.obj);
                                scope.frameIndexPre_10s=scope.frameIndex;
                                if(FPS<5){
                                        window.clearInterval(myInterval);
                                        console.log(resultNew);
                                }
                                result+=(","+FPS);
                                //台式机测试结果

                                //笔记本测试结果
                                //60,60,60,60,51,42,35,30,27,24,22,20,17,17,16,15,14,12,12,11,10,10,9,9,8,8,8,7,7,9,6,7,5,6,6,6,6,5,6,5
                        },3000);


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },
        //获取不低于某帧的最大人数
        test10:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female.glb", (glb) => {
                        //console.log(glb);//OnlyArm
                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"
                        this.frameIndexPre_10s=this.frameIndex;
                        var peoples=null;
                        var result="";
                        var count=1;
                        var countStep=1;
                        var resultNew=[];
                        for(i=0;i<=60;i++)resultNew.push(-1);
                        //computePeoplesNum(60);
                        function computePeoplesNum(FPS) {//获取一个就行，不用最大

                        }
                        function getFPS(PSN) {//获取某个人数的帧数

                        }
                        var myInterval=setInterval(function () {
                                var FPS,obj;
                                FPS=scope.tag.element.innerHTML;
                                if(peoples){
                                        if(FPS<=60)resultNew[Math.floor(FPS)]=count;

                                        //if(FPS<45)
                                        if(countStep>0){//帧数减小
                                                if(//按照期望人数多
                                                    FPS>=40||
                                                    resultNew[Math.floor(FPS)-1]>resultNew[Math.floor(FPS)]
                                                )countStep*=2;
                                                else//中间有跳过//退后一步
                                                        countStep=-Math.floor(countStep/2);//countStep*=-1;//
                                        }else{//帧数增多
                                                if(//纠正了异常
                                                    Math.floor(FPS)>=60||(
                                                        resultNew[Math.floor(FPS)-1]>resultNew[Math.floor(FPS)]&&
                                                        resultNew[Math.floor(FPS)]>resultNew[Math.floor(FPS)+1]
                                                    )
                                                )countStep=-Math.floor(countStep/2);
                                                else//没有纠正异常
                                                        countStep*=2;
                                        }
                                        firstFlag=false;

                                        console.log("人数:"+peoples.instanceCount+
                                            ",帧数:"+FPS
                                        );
                                        //scope.scene.remove(peoples.obj);
                                        obj=peoples.obj;
                                        count+=countStep;
                                }else{
                                        obj=null;
                                }
                                peoples = new InstancedGroup(
                                    count,
                                    [mesh],//这些mesh的网格应该一致
                                    glb.animations[0]
                                );
                                peoples.init(['./img/texture/w/w0.jpg'],16,false);
                                for (var i = 0; i < peoples.instanceCount; i++) {
                                        peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                        peoples.positionSet(i, [3 * i, 0, 0]);
                                        peoples.scaleSet(i, [0.03, 0.03, 0.03]);
                                        peoples.speedSet(i,0.5);
                                        peoples.animationSet(i,0);
                                }
                                if(obj)scope.scene.remove(obj);
                                scope.scene.add(peoples.obj);
                                scope.frameIndexPre_10s=scope.frameIndex;
                                if(FPS<5){
                                        window.clearInterval(myInterval);
                                        console.log(resultNew);
                                }
                                result+=(","+FPS);
                                //台式机测试结果

                                //笔记本测试结果
                                //60,60,60,60,51,42,35,30,27,24,22,20,17,17,16,15,14,12,12,11,10,10,9,9,8,8,8,7,7,9,6,7,5,6,6,6,6,5,6,5
                        },3000);


                        updateAnimation();//
                        function updateAnimation() {//每帧更新一次动画
                                requestAnimationFrame(updateAnimation);
                        }
                });//
                //完成测试
        },
}
var myInstancedGroupTest=new InstancedGroupTest();
myInstancedGroupTest.test11(1);
