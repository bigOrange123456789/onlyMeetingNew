var  myTestFilePath=[
    //"Template",
    "InstancedGroup",
    //"MyPMLoader"
];
for(var i=0;i<myTestFilePath.length;i++){
    console.log("The file being tested is "+myTestFilePath[i]+".js");
    document.write("<script language=javascript src=test/"+myTestFilePath[i]+".test.js></script>");
}