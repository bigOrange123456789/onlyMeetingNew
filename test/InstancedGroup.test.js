//InstancedGroup.test
function InstancedGroupTest(){
        this.scene;
        this.camera;

        this.tag;
        this.button_flag;
        this.referee;
}
InstancedGroupTest.prototype={
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
                        renderer.setClearColor(0xff00ff);
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
        },
        test1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="固定姿势模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female02.glb", (glb) => {
                        //console.log(glb.scene.children[0]);
                        var mesh=glb.scene.children[0];
                        var peoples = new InstancedGroup(
                            2,
                            [mesh, mesh],//这些mesh的网格应该一致
                            false
                        );
                        var texSrc = [];
                        for (i = 0; i < 16; i++) texSrc.push('./texture/' + i + '.jpg');
                        peoples.init(
                            texSrc
                        );
                        for (var i = 0; i < 2; i++) {
                                peoples.rotationSet(i, [Math.PI / 2, 0, 0]);
                                peoples.positionSet(i, [3 * i, 0, 0]);
                                peoples.scaleSet(i, [4.5, 4.5, 4.5]);
                        }
                        peoples.animationSpeed = 0.1;
                        scope.scene.add(peoples.obj);
                        console.log(mesh)
                });//

                //完成测试
        },
        test2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="多模块模型";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/host.glb", (glb) => {
                        glb.scene.traverse(node => {
                                if (node.geometry) {
                                        createObj(node);
                                }
                        });

                        function createObj(mesh) {
                                var peoples = new InstancedGroup(
                                    2,
                                    [mesh, mesh],//这些mesh的网格应该一致
                                    false
                                );
                                var texSrc = [];
                                for (i = 0; i < 16; i++) texSrc.push('./texture/' + i + '.jpg');
                                peoples.init(
                                    texSrc
                                );
                                for (var i = 0; i < 2; i++) {
                                        //peoples.rotationSet(i,[Math.PI/2,0,0]);
                                        peoples.positionSet(i, [3 * i, 0, 0]);
                                        peoples.scaleSet(i, [4.5, 4.5, 4.5]);
                                }
                                peoples.animationSpeed = 0.1;
                                scope.scene.add(peoples.obj);
                        }
                });//

                //完成测试
        },
        test3:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="非单元测试，测试能否删除网格上的点，以此来进行模型坍塌:可以压缩为原来的86.3%";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female02.glb", (glb) => {
                        //console.log(glb.scene.children[0]);
                        var mesh=glb.scene.children[0];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log(mesh.geometry.index.array.length/3)
                        for(var k=0;k<60;k++){//1830//1731
                                flag=false;
                                while(!flag){
                                        var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                        flag=deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                        console.log(mesh);
                                        console.log(geometry);
                                        console.log(attributes);
                                }

                        }/**/

                        /*window.setInterval((function(){
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                console.log(mesh);
                                console.log(geometry);
                                console.log(attributes);
                        }),10);*/

                        mesh.scale.set(10,10,10);
                        //deleteMeshTriangle(mesh);


                       /*var index=mesh.geometry.index;
                        //for(var i=0;i<index.count;i++)
                                //console.log(index.array[i]);
                        var index2=new THREE.InstancedBufferAttribute(new Uint16Array(804), 1);//头部、上衣、裤子、动作
                        for(var i=0;i<804;i++)
                                index2.array[i]=index.array[i];
                        mesh.geometry.index=index2;*/

                        scope.scene.add(mesh);
                        function deleteMeshPoint(mesh,p1,p2){//将mesh中的p1点删除，对应为p2点
                                var distance=
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1]-mesh.geometry.attributes.position.array[3*p2],2)+
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1+1]-mesh.geometry.attributes.position.array[3*p2+1],2)+
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1+2]-mesh.geometry.attributes.position.array[3*p2+2],2);
                                if(distance>0.005)return false;
                                console.log(distance);


                                mesh.geometry.attributes.position.array[3*p2]
                                =(mesh.geometry.attributes.position.array[3*p1]+mesh.geometry.attributes.position.array[3*p2])/2;
                                mesh.geometry.attributes.position.array[3*p2+1]
                                    =(mesh.geometry.attributes.position.array[3*p1+1]+mesh.geometry.attributes.position.array[3*p2+1])/2;
                                mesh.geometry.attributes.position.array[3*p2+2]
                                    =(mesh.geometry.attributes.position.array[3*p1+2]+mesh.geometry.attributes.position.array[3*p2+2])/2;


                                var index=mesh.geometry.index;
                                for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1)index.array[i]=p2;

                                var needDeleteTriangle=0;
                                for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }
                                //console.log(needDeleteTriangle);//有两个三角形需要删除
                                //如果一个三角形点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3)
                                        if(!(index.array[i]===index.array[i+1]||
                                            index.array[i+1]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])){
                                                index2.array[j]=index.array[i];
                                                index2.array[j+1]=index.array[i+1];
                                                index2.array[j+2]=index.array[i+2];
                                                j=j+3;
                                }
                                mesh.geometry.index=index2;

                                return true;
                        }
                        function deleteMeshTriangle(mesh){//将mesh中的p1点删除，对应为p2点
                                var index=mesh.geometry.index;
                                /*for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1)index.array[i]=p2;*/
                                var needDeleteTriangle=0;
                                /*for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }*/
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count/2-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+6){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                        function updateIndex(mesh){
                                var index=mesh.geometry.index;
                                var needDeleteTriangle=0;
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                });//

                //完成测试
        },
        test4:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("/test/zhao.glb", (glb) => {
                        console.log(glb)
                        //console.log(glb.scene.children[0]);//scene.children[1].children[3]
                        //scene.children[1].children[2].children[0]
                        //scene.children[1].children[3]
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log(mesh);
                        console.log(geometry);//index 48612
                        console.log(attributes);
                        //console.log(mesh.geometry.index.array.length/3)
                        for(var k=0;k<1500;k++){//1830//1731//
                                //flag=false;
                                //while(!flag){//index 34077//14525//14046//4446
                                        var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                        flag=deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                        console.log(mesh);
                                        console.log(geometry);
                                        console.log(attributes);
                                //}

                        }/**/

                        /*window.setInterval((function(){
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                console.log(mesh);
                                console.log(geometry);
                                console.log(attributes);
                        }),10);*/

                        mesh.scale.set(4,4,4);
                        //deleteMeshTriangle(mesh);


                        /*var index=mesh.geometry.index;
                         //for(var i=0;i<index.count;i++)
                                 //console.log(index.array[i]);
                         var index2=new THREE.InstancedBufferAttribute(new Uint16Array(804), 1);//头部、上衣、裤子、动作
                         for(var i=0;i<804;i++)
                                 index2.array[i]=index.array[i];
                         mesh.geometry.index=index2;*/

                        scope.scene.add(glb.scene.children[1]);
                        function deleteMeshPoint(mesh,p1,p2){//将mesh中的p1点删除，对应为p2点
                                var distance=
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1]-mesh.geometry.attributes.position.array[3*p2],2)+
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1+1]-mesh.geometry.attributes.position.array[3*p2+1],2)+
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1+2]-mesh.geometry.attributes.position.array[3*p2+2],2);
                                //if(distance>0.005)return false;
                                console.log(distance);


                                mesh.geometry.attributes.position.array[3*p2]
                                    =(mesh.geometry.attributes.position.array[3*p1]+mesh.geometry.attributes.position.array[3*p2])/2;
                                mesh.geometry.attributes.position.array[3*p2+1]
                                    =(mesh.geometry.attributes.position.array[3*p1+1]+mesh.geometry.attributes.position.array[3*p2+1])/2;
                                mesh.geometry.attributes.position.array[3*p2+2]
                                    =(mesh.geometry.attributes.position.array[3*p1+2]+mesh.geometry.attributes.position.array[3*p2+2])/2;


                                var index=mesh.geometry.index;
                                for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1)index.array[i]=p2;

                                var needDeleteTriangle=0;
                                for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }
                                //console.log(needDeleteTriangle);//有两个三角形需要删除
                                //如果一个三角形点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3)
                                        if(!(index.array[i]===index.array[i+1]||
                                            index.array[i+1]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])){
                                                index2.array[j]=index.array[i];
                                                index2.array[j+1]=index.array[i+1];
                                                index2.array[j+2]=index.array[i+2];
                                                j=j+3;
                                        }
                                mesh.geometry.index=index2;

                                return true;
                        }
                        function deleteMeshTriangle(mesh){//将mesh中的p1点删除，对应为p2点
                                var index=mesh.geometry.index;
                                /*for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1)index.array[i]=p2;*/
                                var needDeleteTriangle=0;
                                /*for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }*/
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count/2-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+6){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                        function updateIndex(mesh){
                                var index=mesh.geometry.index;
                                var needDeleteTriangle=0;
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                });//

                //完成测试
        },
        test5:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="每个点与自己的初始位置相差为判断条件--似乎没啥效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        console.log(glb)
                        //console.log(glb.scene.children[0]);//scene.children[1].children[3]
                        //scene.children[1].children[2].children[0]
                        //scene.children[1].children[3]
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var geometryClone=geometry.clone();
                        var attributes=geometry.attributes;
                        console.log(mesh);
                        console.log(geometry.index);//index 48612
                        //console.log(attributes);
                        //console.log(mesh.geometry.index.array.length/3)
                        /*for(var k=0;k<1500;k++){//1830//1731//
                                //flag=false;
                                //while(!flag){//index 34077//14525//14046//4446
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                flag=deleteMeshPoint(geometry,geometryClone,geometry.index.array[rand*3],geometry.index.array[rand*3+1]);
                                console.log(mesh);
                                console.log(geometry);
                                console.log(attributes);
                                //}

                        }*/

                        window.setInterval((function(){
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                deleteMeshPoint(geometry,geometryClone,geometry.index.array[rand*3],geometry.index.array[rand*3+1]);
                                console.log(mesh);
                                console.log(geometry);
                                console.log(attributes);
                        }),10);/**/

                        mesh.scale.set(4,4,4);
                        //deleteMeshTriangle(mesh);


                        /*var index=mesh.geometry.index;
                         //for(var i=0;i<index.count;i++)
                                 //console.log(index.array[i]);
                         var index2=new THREE.InstancedBufferAttribute(new Uint16Array(804), 1);//头部、上衣、裤子、动作
                         for(var i=0;i<804;i++)
                                 index2.array[i]=index.array[i];
                         mesh.geometry.index=index2;*/

                        scope.scene.add(glb.scene.children[1]);
                        function deleteMeshPoint(geometry,geometryClone,p1,p2){//将mesh中的p1点删除，对应为p2点
                                var distance=
                                    Math.pow(geometry.attributes.position.array[3*p1]-geometryClone.attributes.position.array[3*p1],2)+
                                    Math.pow(geometry.attributes.position.array[3*p1+1]-geometryClone.attributes.position.array[3*p1+1],2)+
                                    Math.pow(geometry.attributes.position.array[3*p1+2]-geometryClone.attributes.position.array[3*p1+2],2);
                                console.log(distance);
                                if(distance>0.007)return false;



                                geometry.attributes.position.array[3*p2]
                                    =(geometry.attributes.position.array[3*p1]+geometry.attributes.position.array[3*p2])/2;
                                geometry.attributes.position.array[3*p2+1]
                                    =(geometry.attributes.position.array[3*p1+1]+geometry.attributes.position.array[3*p2+1])/2;
                                geometry.attributes.position.array[3*p2+2]
                                    =(geometry.attributes.position.array[3*p1+2]+geometry.attributes.position.array[3*p2+2])/2;


                                var index=geometry.index;
                                var indexClone=geometryClone.index;
                                for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1){
                                                index.array[i]=p2;
                                                indexClone.array[i]=p2;
                                        }

                                var needDeleteTriangle=0;
                                for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }
                                //console.log(needDeleteTriangle);//有两个三角形需要删除
                                //如果一个三角形点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var index2Clone=new THREE.InstancedBufferAttribute(new Uint16Array(index.count-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3)
                                        if(!(index.array[i]===index.array[i+1]||
                                            index.array[i+1]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])){
                                                index2.array[j]=index.array[i];
                                                index2.array[j+1]=index.array[i+1];
                                                index2.array[j+2]=index.array[i+2];
                                                index2Clone.array[j]=indexClone.array[i];
                                                index2Clone.array[j+1]=indexClone.array[i+1];
                                                index2Clone.array[j+2]=indexClone.array[i+2];
                                                j=j+3;
                                        }
                                geometry.index=index2;

                                return true;
                        }
                        function deleteMeshTriangle(mesh){//将mesh中的p1点删除，对应为p2点
                                var index=mesh.geometry.index;
                                /*for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1)index.array[i]=p2;*/
                                var needDeleteTriangle=0;
                                /*for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }*/
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count/2-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+6){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                        function updateIndex(mesh){
                                var index=mesh.geometry.index;
                                var needDeleteTriangle=0;
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                });//

                //完成测试
        },
}
var myInstancedGroupTest=new InstancedGroupTest();
myInstancedGroupTest.test5();