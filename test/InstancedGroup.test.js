//InstancedGroup.test
function InstancedGroupTest(){
        this.testObj;
        this.nameObject="";
}
InstancedGroupTest.prototype={
        setContext:function () {
                this.nameContext="固定姿势模型";
                console.log("context:");
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/Female02.glb", (glb) => {
                        console.log(glb.scene.children[0]);
                        scope.test(glb.scene.children[0]);
                });
        },
        test:function (mesh) {
                var nameObject="";
                console.log('start test:'+this.nameObject);
                function before(){
                }before();//console.log("before");
                function beforeEach(){
                }//console.log("beforeEach");
                //(function (){
                if(1){
                        beforeEach();
                        console.log("测试用例01");
                        //开始测试
                        var peoples=new InstancedGroup(
                            2,
                            [mesh,mesh],//这些mesh的网格应该一致
                            false
                        );
                        var texSrc=[];
                        for(i=0;i<16;i++)texSrc.push('./texture/'+i+'.jpg');
                        peoples.init(
                            texSrc
                        );
                        for(var i=0;i<2;i++){
                                peoples.rotationSet(i,[Math.PI/2,0,0]);
                                peoples.positionSet(i,[3*i,0,0]);
                                peoples.scaleSet(i,[4.5,4.5,4.5]);
                        }
                        peoples.animationSpeed=0.1;
                        scene.add(peoples.obj);
                        console.log(mesh)
                        console.log(scene);
                        //完成测试
                        console.log("测试用例01");
                        afterEach();
                }
                //});
                function afterEach(){
                        //console.log("afterEach");
                }
                function after(){
                        //console.log("after");
                }after();
                console.log('complete test:'+nameObject);
        },

        setContext2:function () {
                var nameContext="分块模型测试";
                console.log("start context:"+nameContext);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("myModel/avatar/host.glb", (glb) => {
                        scope.test2(glb);
                        console.log("complete context:"+nameContext);
                });
        },
        test2:function (glb) {
                var nameTest="";
                if(nameTest!=="")console.log('start test:'+nameTest);
                function before(){
                }before();//console.log("before");
                function beforeEach(){
                }//console.log("beforeEach");
                if(1){
                        var nameExample="";
                        beforeEach();
                        console.log("start case:"+nameExample);
                        //开始测试
                        glb.scene.traverse(node=>{
                                if(node.geometry){
                                        createObj(node);
                                }
                        });
                        function createObj(mesh) {
                                var peoples=new InstancedGroup(
                                    2,
                                    [mesh,mesh],//这些mesh的网格应该一致
                                    false
                                );
                                var texSrc=[];
                                for(i=0;i<16;i++)texSrc.push('./texture/'+i+'.jpg');
                                peoples.init(
                                    texSrc
                                );
                                for(var i=0;i<2;i++){
                                        //peoples.rotationSet(i,[Math.PI/2,0,0]);
                                        peoples.positionSet(i,[3*i,0,0]);
                                        peoples.scaleSet(i,[4.5,4.5,4.5]);
                                }
                                peoples.animationSpeed=0.1;
                                scene.add(peoples.obj);
                        }
                        //完成测试
                        console.log("complete case:"+nameExample);
                        afterEach();
                }
                function afterEach(){
                        //console.log("afterEach");
                }
                function after(){
                        //console.log("after");
                }after();
                if(nameTest!=="")console.log('complete test:'+nameTest);
        },
}
var myInstancedGroupTest=new InstancedGroupTest();
myInstancedGroupTest.setContext2();