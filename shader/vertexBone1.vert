#version 300 es
//使用sampler2D存储模型矩阵      使用骨骼矩阵
precision highp float;//highp
uniform sampler2D animationData;
uniform sampler2D matrixData0;
uniform sampler2D matrixData1;
uniform sampler2D matrixData2;
uniform sampler2D matrixData3;

uniform mat4 modelViewMatrix,projectionMatrix;
uniform float time,cameraX,cameraY,cameraZ;//0-10000
uniform float neckPosition;
in float speed;
in vec3 position;
in vec3 position2;
in float index;
in vec2 inUV;
//in vec3 normal;
in vec3 mcol0,mcol1,mcol2,mcol3;


in vec4 type;//设置贴图0-2,type[3]用处不明
in vec3 color;
in vec4 bonesWidth;//选出4个部位
in float faceShape;

//4个部位
//0躯干 0-3
//1头部 4-6
//2手臂 7-10，11-14
//3腿部 15-19-20-24

out vec2 outUV;
//out vec3 outNormal;
//out vec3 lightDirection;
out vec3 varyColor,varyType;
out float type_part;//,texType;
out vec3 myTest01;
out float outfaceShape;

float get0(float n);
float get1(float n);
float get2(float n);
float get3(float n);
void main(){
    outUV = inUV;
    outfaceShape=faceShape;
    varyColor=color;
    varyType=vec3(type[0], type[1], type[2]);
    if (position.y<0.15&&(position.z<0.35&&position.z>-0.35))type_part=0.0;//下身
    else if (position.y<neckPosition) type_part=1.0;//上身
    else type_part=2.0;//头部

    mat4 matrix2 = mat4(//确定位置//最后一列是 0 0 0 1
    //vec4(mcol0, 0),
    vec4(get0(3.*index),get0(3.*index+1.),get0(3.*index+2.), 0),
    vec4(get1(3.*index),get1(3.*index+1.),get1(3.*index+2.), 0),
    vec4(get2(3.*index),get2(3.*index+1.),get2(3.*index+2.), 0),
    vec4(mcol3, 1)//vec4(get3(3.*index),get3(3.*index+1.),get3(3.*index+2.), 1)
    );

    vec4 position=modelViewMatrix * matrix2   * vec4(
    speed*position2.x+(1.-speed)*position.x,
    speed*position2.y+(1.-speed)*position.y,
    speed*position2.z+(1.-speed)*position.z,
    1.0);
    gl_Position = projectionMatrix * position;
}
//尽可能按照面向对象的编程思想来编写下面的代码
struct Tool{
    int a;
}oTool;
void noShader(){
    gl_Position=vec4(0.0, 0.0, 0.0, 0.0);
}
float modFloor(float a, float b){
    return float(int(a)%int(b));
}

void Tool_init(){}


float get0(float n){//通过矩阵序号获取动画矩阵
    //sampler2D smp=matrixData;
    float h=2000.*3.;
    vec3 tttt=texture(matrixData0, vec2(
    (0.5+0.0)/1.0, //宽width
    (0.5+floor(n/3.0))/(h/3.0)//除3是指每个像素点可存储3个数据
    )).xyz;
    float m=modFloor(n, 3.0);
    if (m<0.5)return tttt.x;
    else if (m<1.5)return tttt.y;
    else return tttt.z;
}
float get1(float n){//通过矩阵序号获取动画矩阵
    //sampler2D smp=matrixData;
    float h=2000.*3.;
    vec3 tttt=texture(matrixData1, vec2(
    (0.5+0.0)/1.0, //宽width
    (0.5+floor(n/3.0))/(h/3.0)//除3是指每个像素点可存储3个数据
    )).xyz;
    float m=modFloor(n, 3.0);
    if (m<0.5)return tttt.x;
    else if (m<1.5)return tttt.y;
    else return tttt.z;
}
float get2(float n){//通过矩阵序号获取动画矩阵
    //sampler2D smp=matrixData;
    float h=2000.*3.;
    vec3 tttt=texture(matrixData2, vec2(
    (0.5+0.0)/1.0, //宽width
    (0.5+floor(n/3.0))/(h/3.0)//除3是指每个像素点可存储3个数据
    )).xyz;
    float m=modFloor(n, 3.0);
    if (m<0.5)return tttt.x;
    else if (m<1.5)return tttt.y;
    else return tttt.z;
}
float get3(float n){//通过矩阵序号获取动画矩阵
    //sampler2D smp=matrixData;
    float h=2000.*3.;
    vec3 tttt=texture(matrixData3, vec2(
    (0.5+0.0)/1.0, //宽width
    (0.5+floor(n/3.0))/(h/3.0)//除3是指每个像素点可存储3个数据
    )).xyz;
    float m=modFloor(n, 3.0);
    if (m<0.5)return tttt.x;
    else if (m<1.5)return tttt.y;
    else return tttt.z;
}
