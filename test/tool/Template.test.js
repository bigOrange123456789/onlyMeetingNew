function Describe(mainScene){
        this.testObj;
        mainScene.add(this.testObj);
}
Describe.prototype={
        setContext1:function (testType) {
                var nameContext="";
                console.log('set context:'+nameContext);
                if(testType===1)this.test1();
                console.log('finish context:'+nameContext);
        },
        test1:function () {
                var nameTest="";
                console.log('start test:'+nameTest);

                console.log('complete test:'+nameTest);
        },
}
var myDescribe=new Describe();
myDescribe.setContext1(1);