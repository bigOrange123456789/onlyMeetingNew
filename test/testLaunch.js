//这一部分用于单元测试
var  myTestFilePath=[
    //"Template",
    "InstancedGroup",
    "MyPMLoader",
    //"Compute",
];

//以下是对预处理部分需要测试代码的导入
document.write("<script src='pretreatment/computeTextureType/Compute.js'></script>");
for(var i=0;i<myTestFilePath.length;i++){
    console.log("The file being tested is "+myTestFilePath[i]+".js");
    document.write("<script src=test/"+myTestFilePath[i]+".test.js></script>");
}

//document_color('#0a0');//窗体
var mainPanel=new Panel('#00f',40,document.body);

var oButton1=new Button('InstancedGroup','#00f',20,mainPanel.element);
oButton1.rePos(0,0);
oButton1.element.onclick=function(){
    oButton1.element.style.color="#0ff";
    var panel1=new Panel('#0ff',20,mainPanel.element);
    panel1.rePos(100,50);

    var xc=document.body.clientWidth-50;
    var oButton1_t5_0=new Button('5_0:有动画测试','#0ff',10,panel1.element);
    oButton1_t5_0.element.style.background="#000";
    oButton1_t5_0.rePos(xc,50);
    oButton1_t5_0.element.onclick=function(){
        mainPanel.hide();
        myInstancedGroupTest.test5_0();
    }

    var oButton1_t5_01=new Button('5_01:PM结合instancing','#0ff',10,panel1.element);
    oButton1_t5_01.element.style.background="#000";
    oButton1_t5_01.rePos(xc,150);
    oButton1_t5_01.element.onclick=function(){
        mainPanel.hide();
        myInstancedGroupTest.test5_01();
    }

    var oButton1_t5_02=new Button('5_02:多样性结果记录','#0ff',10,panel1.element);
    oButton1_t5_02.element.style.background="#000";
    oButton1_t5_02.rePos(xc,250);
    oButton1_t5_02.element.onclick=function(){
        mainPanel.hide();
        myInstancedGroupTest.test5_02();
    }
    //al
};

var oButton2=new Button('MyPMLoader','#00f',20,mainPanel.element);
oButton2.rePos(0,100);
oButton2.element.onclick=function(){
    oButton2.element.style.color="#0ff";
    var panel2=new Panel('#0ff',20,mainPanel.element);
    panel2.rePos(200,50);

    var oButton2_t1=new Button('1:有动画测试','#0ff',10,panel2.element);
    oButton2_t1.rePos(500,50);
    oButton2_t1.element.onclick=function(){
        mainPanel.hide();
        myMyPMLoaderTest.test1();
    }

    //alert(0)
};
