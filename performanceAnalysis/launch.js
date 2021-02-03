//这一部分用于单元测试
var  myTestFilePath=[
    //"Template",
    "InstancedGroup",
    //"MyPMLoader"
];
var path1="performanceAnalysis";
document.write("<script language=javascript src="+path1+"/tool/OrbitControls.js></script>");
document.write("<script language=javascript src="+path1+"/tool/UI.js></script>");
document.write("<script language=javascript src="+path1+"/tool/Referee.js></script>");
for(var i=0;i<myTestFilePath.length;i++){
    console.log("The file being tested is "+myTestFilePath[i]+".js");
    document.write("<script language=javascript src="+path1+"/"+myTestFilePath[i]+".test.js></script>");
}