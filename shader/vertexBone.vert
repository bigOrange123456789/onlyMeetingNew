#version 300 es
precision highp float;//highp
uniform sampler2D animL;
uniform sampler2D animR;
uniform sampler2D test;
uniform mat4 modelViewMatrix,projectionMatrix;
uniform float time;//0-10000
uniform float neckPosition;

in vec3 position;
in vec2 inUV;
in vec4 skinIndex,skinWeight;
in float speed;
in vec3 mcol0,mcol1,mcol2,mcol3;
in vec4 type;//设置贴图0-2,type[3]用处不明
in vec3 color;
in vec4 bonesWidth;//选出4个部位
//4个部位
//0躯干 0-3
//1头部 4-6
//2手臂 7-10，11-14
//3腿部 15-19-20-24

out vec2 outUV;
out vec3 varyColor,varyType;
out float type_part;//,texType;
out vec3 myTest01;

//void Test_init();
//bool Test_meetExpectations();float Animation_getNumByTexture(float n);
void Animation_init();
mat4 Animation_computeMatrix();
float SKELETON_SIZE0=204.0; //用于求不动位置的骨骼//骨骼(25-8)*12=204//骨骼矩阵
float SKELETON_SIZE1=768.0;//鼓掌动画//8个手臂骨骼的数据//帧数8*骨骼8*12=768
float SKELETON_SIZE2=96.0;//96.0//举手动作//8*12=96
float SKELETON_SIZE3=96.0;//96.0//举手动作//8*12=96
float SKELETON_SIZE4=96.0;
void main(){

    float tttt=texture(test, vec2(
        (0.5+0.0)/1.0, //宽width
        (0.5+floor(0./3.0))/(1.)//高height
        )
    ).x;
    //if(floor(tttt*1.)!=1.)return;
    if(tttt!=301.5)return;


    outUV = inUV;
    varyColor=color;
    varyType=vec3(type[0], type[1], type[2]);
    if (position.y<0.15&&(position.z<0.35&&position.z>-0.35))type_part=0.0;//下身
    else if (position.y<neckPosition) type_part=1.0;//上身
    else type_part=2.0;//头部

    Animation_init();
    mat4 matrix1=Animation_computeMatrix();//计算动画的变换矩阵

    mat4 matrix2 = mat4(//确定位置//最后一列是 0 0 0 1
        vec4(mcol0, 0),
        vec4(mcol1, 0),
        vec4(mcol2, 0),
        vec4(mcol3, 1)//实例化物体对象世界矩阵
    );

    float w;
    //0躯干 0-3
    //1头部 4-6
    //2手臂 7-10，11-14
    //3腿部 15-19-20-24
    if(skinIndex[0]<3.5)w=bonesWidth[0];//0躯干
    else if(3.5<skinIndex[0]&&skinIndex[0]<6.5)w=bonesWidth[1];//1头部
    else if(skinIndex[0]>14.5)w=bonesWidth[3];//3腿部
    else w=bonesWidth[2];//2手臂
    w=w+1.;

    gl_Position = projectionMatrix * modelViewMatrix * matrix2 * matrix1  * vec4(position.x*w,position.y,position.z*w, 1.0);

    //Test_init();
    //if(!Test_meetExpectations())gl_Position =vec4(0.,0.,0.,0.);
}
//尽可能按照面向对象的编程思想来编写下面的代码
struct Tool{
    int a;
}oTool;
void noShader(){
    gl_Position=vec4(0.0, 0.0, 0.0, 0.0);
}
float modFloor(float a, float b){
    //return float(int(a)%int(b));
    return (a/b-floor(a/b))*b;
}

void Tool_init(){}

struct Animation{
        float skeletonPos0;
        float skeletonPos1;
        float skeletonPos2;
        float skeletonPos3;
        float skeletonPos4;
        float skeletonLast;
        float dataTextureHeight;

        int frameIndex;
        float frameIndex_f;
}oAnimation;
float Animation_getNumByAnimL(float n){
    vec3 tttt=texture(animL, vec2(
    (0.5+0.0)/1.0, //宽width
    (0.5+floor(n/3.0))/(oAnimation.dataTextureHeight/2.)//高height
    )).xyz;
    float m=modFloor(n, 3.0);
    if (m<0.5)return tttt.x;
    else if (m<1.5)return tttt.y;
    else return tttt.z;
}
float Animation_getNumByAnimR(float n){
    vec3 tttt=texture(animR, vec2(
    (0.5+0.0)/1.0, //宽width
    (0.5+floor(n/3.0))/(oAnimation.dataTextureHeight/2.)//高height
    )).xyz;
    float m=modFloor(n, 3.0);
    if (m<0.5)return tttt.x;
    else if (m<1.5)return tttt.y;
    else return tttt.z;
}
float Animation_decode(float A, float B){ //0-1
    A=round(A*255.0);//解决了移动端的问题
    B=round(B*255.0);//解决了移动端的问题
    float a, b, c, d;
    a=floor(A/128.0);
    b=floor((modFloor(A, 128.0))/16.0);
    c=modFloor(A, 16.0);
    d=B;

    float c_d=c*256.0+d;
    float num=c_d*pow(10.0, b-5.0);
    if (a==1.0)num*=-1.0;
    return num;
}
float Animation_getElem5(float n){ //静止//取手臂骨骼数据
    float A=Animation_getNumByAnimL(n+oAnimation.skeletonPos4), B=Animation_getNumByAnimR(n+oAnimation.skeletonLast+oAnimation.skeletonPos4);
    return Animation_decode(A, B);
}
float Animation_getElem4(float n){ //静止//取手臂骨骼数据
    float A=Animation_getNumByAnimL(n+oAnimation.skeletonPos3), B=Animation_getNumByAnimR(n+oAnimation.skeletonPos3);
    return Animation_decode(A, B);
}
float Animation_getElem3(float n){ //举手//取手臂骨骼数据
    float A=Animation_getNumByAnimL(n+oAnimation.skeletonPos2), B=Animation_getNumByAnimR(n+oAnimation.skeletonPos2);
    return Animation_decode(A, B);
}
float Animation_getElem2(float n){ //鼓掌//取手臂骨骼数据
    float A=Animation_getNumByAnimL(n+oAnimation.skeletonPos1), B=Animation_getNumByAnimR(n+oAnimation.skeletonPos1);
    return Animation_decode(A, B);
}
float Animation_getElem1(float n){ //求不动位置的骨骼
    float A=Animation_getNumByAnimL(n+oAnimation.skeletonPos0), B=Animation_getNumByAnimR(n+oAnimation.skeletonPos0);
    return Animation_decode(A, B);
}
mat4 Animation_getMatrix2(float iii){ //求手臂骨骼
    float frame_index=oAnimation.frameIndex_f;
    float i=iii-7.0;//iii的取值范围是7-14 -> 0-7
    if (type[3]<0.5){
        return mat4(//最后一列是：0 0 0 1
            Animation_getElem2(frame_index*96.+i*12.+0.), Animation_getElem2(frame_index*96.+i*12.+1.), Animation_getElem2(frame_index*96.+i*12.+2.), 0,
            Animation_getElem2(frame_index*96.+i*12.+3.), Animation_getElem2(frame_index*96.+i*12.+4.), Animation_getElem2(frame_index*96.+i*12.+5.), 0,
            Animation_getElem2(frame_index*96.+i*12.+6.), Animation_getElem2(frame_index*96.+i*12.+7.), Animation_getElem2(frame_index*96.+i*12.+8.), 0,
            Animation_getElem2(frame_index*96.+i*12.+9.), Animation_getElem2(frame_index*96.+i*12.+10.), Animation_getElem2(frame_index*96.+i*12.+11.), 1
        );
    } else if (type[3]<1.5){
        return mat4(//最后一列是：0 0 0 1
            Animation_getElem3(i*12.+0.), Animation_getElem3(i*12.+1.), Animation_getElem3(i*12.+2.), 0,
            Animation_getElem3(i*12.+3.), Animation_getElem3(i*12.+4.), Animation_getElem3(i*12.+5.), 0,
            Animation_getElem3(i*12.+6.), Animation_getElem3(i*12.+7.), Animation_getElem3(i*12.+8.), 0,
            Animation_getElem3(i*12.+9.), Animation_getElem3(i*12.+10.), Animation_getElem3(i*12.+11.), 1
        );
    }else if (type[3]<2.5){
        return mat4(//最后一列是：0 0 0 1
            Animation_getElem4(i*12.+0.), Animation_getElem4(i*12.+1.), Animation_getElem4(i*12.+2.), 0,
            Animation_getElem4(i*12.+3.), Animation_getElem4(i*12.+4.), Animation_getElem4(i*12.+5.), 0,
            Animation_getElem4(i*12.+6.), Animation_getElem4(i*12.+7.), Animation_getElem4(i*12.+8.), 0,
            Animation_getElem4(i*12.+9.), Animation_getElem4(i*12.+10.), Animation_getElem4(i*12.+11.), 1
        );
    } else {
        return mat4(//最后一列是：0 0 0 1
            Animation_getElem5(i*12.+0.), Animation_getElem5(i*12.+1.), Animation_getElem5(i*12.+2.), 0,
            Animation_getElem5(i*12.+3.), Animation_getElem5(i*12.+4.), Animation_getElem5(i*12.+5.), 0,
            Animation_getElem5(i*12.+6.), Animation_getElem5(i*12.+7.), Animation_getElem5(i*12.+8.), 0,
            Animation_getElem5(i*12.+9.), Animation_getElem5(i*12.+10.), Animation_getElem5(i*12.+11.), 1
        );
    }


}
mat4 Animation_getMatrix1(float i){ //求不动位置的骨骼
    if (i>14.0)i=i-8.0;
    return mat4(//最后一列是：0 0 0 1
    Animation_getElem1(i*12.+0.), Animation_getElem1(i*12.+1.), Animation_getElem1(i*12.+2.), 0.,
    Animation_getElem1(i*12.+3.), Animation_getElem1(i*12.+4.), Animation_getElem1(i*12.+5.), 0.,
    Animation_getElem1(i*12.+6.), Animation_getElem1(i*12.+7.), Animation_getElem1(i*12.+8.), 0.,
    Animation_getElem1(i*12.+9.), Animation_getElem1(i*12.+10.), Animation_getElem1(i*12.+11.), 1.
    );
}
mat4 Animation_getMatrix(float i_f){ //求骨骼
    if (i_f>=7.&&i_f<=14.) return Animation_getMatrix2(i_f);
    else return Animation_getMatrix1(i_f);
}
void Animation_frameIndexSet(){ //求帧序号//int frame_index;
    float t=modFloor(time*speed, 16.0);//((time*speed)/16.0-floor((time*speed)/16.0))*16.0;//将time*speed对8取余结果：[0，7)
    int frame_index;
    float frameIndex_f;
    //t=1.0;
    if (t>-0.5&&t<=0.5){ frame_index=0; frameIndex_f=0.0;}
    else if (t>0.5&&t<=1.5){ frame_index=1; frameIndex_f=1.0;}
    else if (t>1.5&&t<=2.5){ frame_index=2; frameIndex_f=2.0;}
    else if (t>2.5&&t<=3.5){ frame_index=3; frameIndex_f=3.0;}
    else if (t>3.5&&t<=4.5){ frame_index=4; frameIndex_f=4.0;}
    else if (t>4.5&&t<=5.5){ frame_index=5; frameIndex_f=5.0;}
    else if (t>5.5&&t<=6.5){ frame_index=6; frameIndex_f=6.0;}
    else if (t>6.5&&t<=7.5){ frame_index=7; frameIndex_f=7.0;}
    else if (t>7.5&&t<=8.5){ frame_index=7; frameIndex_f=7.0;}
    else if (t>8.5&&t<=9.5){ frame_index=6; frameIndex_f=6.0;}
    else if (t>9.5&&t<=10.5){ frame_index=5; frameIndex_f=5.0;}
    else if (t>10.5&&t<=11.5){ frame_index=4; frameIndex_f=4.0;}
    else if (t>11.5&&t<=12.5){ frame_index=3; frameIndex_f=3.0;}
    else if (t>12.5&&t<=13.5){ frame_index=2; frameIndex_f=2.0;}
    else if (t>13.5&&t<=14.5){ frame_index=1; frameIndex_f=1.0;}
    else { frame_index=0; frameIndex_f=0.0;}
    oAnimation.frameIndex=frame_index;
    oAnimation.frameIndex_f=frameIndex_f;
}
mat4 Animation_computeMatrix(){
    //计算动画的变换矩阵：matrix1=skinWeight[0]*matrixs[mySkinIndex[0]]+...
    mat4 matrix1;//每个点只与一个骨骼相关
    matrix1=Animation_getMatrix(skinIndex[0]);
    /*matrix1=skinWeight[0]*Animation_getMatrix(skinIndex[0])
   +skinWeight[1]*Animation_getMatrix(skinIndex[1])
   +skinWeight[2]*Animation_getMatrix(skinIndex[2])
   +skinWeight[3]*Animation_getMatrix(skinIndex[3]);*/

    return matrix1;
}
void Animation_init(){
    oAnimation.skeletonPos0=0.0;
    oAnimation.skeletonPos1=(oAnimation.skeletonPos0+SKELETON_SIZE0);
    oAnimation.skeletonPos2=(oAnimation.skeletonPos1+SKELETON_SIZE1);
    oAnimation.skeletonPos3=(oAnimation.skeletonPos2+SKELETON_SIZE2);
    oAnimation.skeletonPos4=(oAnimation.skeletonPos3+SKELETON_SIZE3);
    oAnimation.skeletonLast=(oAnimation.skeletonPos4+SKELETON_SIZE4);
    oAnimation.dataTextureHeight=(oAnimation.skeletonLast*2.0/3.0);

    Animation_frameIndexSet();//设置全局变量frame_index的值
}

