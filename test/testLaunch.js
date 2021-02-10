//这一部分用于单元测试
var  myTestFilePath=[
    //"Template",
    //"InstancedGroup",
    "MyPMLoader",
    //"Compute",
];

document.write("<script src='test/tool/OrbitControls.js'></script>");
document.write("<script src='test/tool/UI.js'></script>");
document.write("<script src='test/tool/Referee.js'></script>");

//以下是对预处理部分需要测试代码的导入
document.write("<script src='pretreatment/computeTextureType/Compute.js'></script>");
for(var i=0;i<myTestFilePath.length;i++){
    console.log("The file being tested is "+myTestFilePath[i]+".js");
    document.write("<script src=test/"+myTestFilePath[i]+".test.js></script>");
}