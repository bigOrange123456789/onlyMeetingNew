//这一部分用于单元测试
var  myTestFilePath=[
    //"Template",
    "InstancedGroup",
    //"MyPMLoader"
];
document.write("<script language=javascript src=test/tool/OrbitControls.js></script>");
document.write("<script language=javascript src=test/tool/UI.js></script>");
document.write("<script language=javascript src=test/tool/Referee.js></script>");
for(var i=0;i<myTestFilePath.length;i++){
    console.log("The file being tested is "+myTestFilePath[i]+".js");
    document.write("<script language=javascript src=test/"+myTestFilePath[i]+".test.js></script>");
}