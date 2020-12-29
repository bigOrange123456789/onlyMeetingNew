function Describe(){
        this.testObj;
}
Describe.prototype={
        setContext:function () {
        },
        test:function () {
                var nameObject="";
                console.log('start test:'+nameObject);
                function before(){
                        //console.log("before");
                }before();
                function beforeEach(){
                        //console.log("beforeEach");
                }
                (function (){
                        beforeEach();
                        console.log("测试用例01");


                        console.log("测试用例01");
                        afterEach();
                });
                function afterEach(){
                        //console.log("afterEach");
                }
                function after(){
                        //console.log("after");
                }after();
                console.log('complete test:'+nameObject);
        },
}
new Describe();
