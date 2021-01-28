#define skeletonSize0 204.0 //用于求不动位置的骨骼//骨骼(25-8)*12=204//骨骼矩阵
#define skeletonSize1 768.0 //8个手臂骨骼的数据//帧数8*骨骼8*12=768
precision highp float;//highp
uniform sampler2D dataTexture;//帧数8*骨骼8*12=768//用于求手臂骨骼//8个手臂骨骼的数据
uniform mat4 modelViewMatrix,projectionMatrix;
uniform float time;//0-10000

attribute vec3 position;
attribute vec2 inUV;
attribute vec4 skinIndex;
attribute float speed;
attribute vec3 mcol0,mcol1,mcol2,mcol3;
attribute vec4 type;//设置贴图0-2,type[3]用处不明
attribute vec3 color;

varying vec2 outUV;
varying vec3 varyType,varyColor;
varying float type_part;
varying float myTest00;
varying vec3 myTest01;

//void Test_init();
//bool Test_meetExpectations();
void Animation_init();
mat4 Animation_computeMatrix();

void main(){
    //Test_init();
    //if(!Test_meetExpectations())return;
    vec3 vPosition = position;

    outUV = inUV;
    varyType=vec3(type[0], type[1], type[2]);
    varyColor=vec3(color[0], color[1], color[2]);

    if (vPosition.y<0.15&&(vPosition.z<0.35&&vPosition.z>-0.35))type_part=0.0;//下身
    else if (vPosition.y<0.59) type_part=1.0;//上身
    else type_part=2.0;//头部

    Animation_init();
    mat4 matrix1=Animation_computeMatrix();//计算动画的变换矩阵

    mat4 matrix2 = mat4(//确定位置//最后一列是 0 0 0 1
        vec4(mcol0, 0),
        vec4(mcol1, 0),
        vec4(mcol2, 0),
        vec4(mcol3, 1)
    );
    gl_Position = projectionMatrix * modelViewMatrix * matrix2  * matrix1 * vec4(position, 1.0);
}
//尽可以按照面向对象的编程思想来编写下面的代码
struct Tool{
    int a;
}oTool;
void noShader(){
    gl_Position=vec4(0.0, 0.0, 0.0, 0.0);
}
float modFloor(float a, float b){
    return (a/b-floor(a/b))*b;
}
int float2int(float n){
    if (n>0.0){
        int a=0;
        for (float b=0.0;b<=1000.0;b+=1.0){
            if (b>n)break;
            a++;
        }
        return a-1;
    } else {
        return -1;
    }
}
float int2float(int n){
    if (n>0){
        float b=0.0;
        for (int a=0;a<=1000;a++){
            if (a>n)break;
            b+=1.0;
        }
        return b-1.0;
    } else {
        return -1.0;
    }
}
void Tool_init(){}

struct Animation{
    float skeletonPos0;
    float skeletonPos1;
    float skeletonLast;
    float dataTextureHeight;

    int frameIndex;
    float frameIndex_f;
}oAnimation;
float Animation_getNumByTexture(float n){
    vec3 tttt=texture2D(dataTexture, vec2(
        (0.5+0.0)/1.0, //宽width
        (0.5+floor(n/3.0))/oAnimation.dataTextureHeight//高height
    )).xyz;
    float m=modFloor(n, 3.0);
    //return m/256.0;
    if (m<0.5)return tttt.x;
    else if (m<1.5)return tttt.y;
    else return tttt.z;
}
float Animation_decode(float A, float B){ //0-1
    A*=255.0;
    B*=255.0;
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
float Animation_getElem2(float n){ //取手臂骨骼数据
    float A=Animation_getNumByTexture(n+oAnimation.skeletonPos1), B=Animation_getNumByTexture(n+oAnimation.skeletonLast+oAnimation.skeletonPos1);
    return Animation_decode(A, B);
}
float Animation_getElem1(float n){ //取手臂骨骼数据
    float A=Animation_getNumByTexture(n+oAnimation.skeletonPos0), B=Animation_getNumByTexture(n+oAnimation.skeletonLast+oAnimation.skeletonPos0);
    return Animation_decode(A, B);
}
mat4 Animation_getMatrix2(float iii){ //求手臂骨骼
    float frame_index=oAnimation.frameIndex_f;
    float i=iii-7.0;//iii的取值范围是7-14 -> 0-7
    return mat4(//最后一列是：0 0 0 1
        Animation_getElem2(frame_index*96.+i*12.+0.), Animation_getElem2(frame_index*96.+i*12.+1.), Animation_getElem2(frame_index*96.+i*12.+2.), 0,
        Animation_getElem2(frame_index*96.+i*12.+3.), Animation_getElem2(frame_index*96.+i*12.+4.), Animation_getElem2(frame_index*96.+i*12.+5.), 0,
        Animation_getElem2(frame_index*96.+i*12.+6.), Animation_getElem2(frame_index*96.+i*12.+7.), Animation_getElem2(frame_index*96.+i*12.+8.), 0,
        Animation_getElem2(frame_index*96.+i*12.+9.), Animation_getElem2(frame_index*96.+i*12.+10.), Animation_getElem2(frame_index*96.+i*12.+11.), 1
    );
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

    return matrix1;
}
void Animation_init(){
    oAnimation.skeletonPos0=0.0;
    oAnimation.skeletonPos1=(oAnimation.skeletonPos0+skeletonSize0);
    oAnimation.skeletonLast=(oAnimation.skeletonPos1+skeletonSize1);
    oAnimation.dataTextureHeight=(oAnimation.skeletonLast*2.0/3.0);

    Animation_frameIndexSet();//设置全局变量frame_index的值
}

struct Test{
    //计算误差computeErr
    //int pos;
    float err;
    //整体的最大误差
    float errMax;//最大误差值
    float errMax_pos_float;//出现最大误差的位置
    int errMax_pos_int;//出现最大误差的位置
    //
    bool assertion;
} oTest;
float Test_computeErr(int b){//,pos
    //test.pos=pos;
    //int b=oTest.pos;
    float a=int2float(b);
    float result=
    (
    Animation_decode(Animation_getNumByTexture(a+0.0), Animation_getNumByTexture(a+768.0))
    -
    0.0);//skeletonData[b])/(skeletonData[b]*2.56);
    oTest.err=result;
    return result;
}
void Test_computeErrMax(){//计算整体的最大误差
    float a=1.0;
    float aMax=1.0;
    int   bMax=1;

    float errMax=Test_computeErr(0);

    for(int b=1;b<760;b++){//760
        float err0=Test_computeErr(b);
        if(errMax<err0){
            errMax=err0;
            aMax=a;
            bMax=b;
        }
        a+=1.0;
    }
    oTest.errMax=errMax;
    oTest.errMax_pos_float=aMax;
    oTest.errMax_pos_int=bMax;
}
void Test_assertInt(int a,int b){
    if(a!=b)oTest.assertion=false;
}
void Test_assertFloat(float a,float b){
    if(a!=b)oTest.assertion=false;
}
bool Test_meetExpectations(){//判断代码的测试结果是否符合预期
    oTest.assertion=true;

    //开始测试Animation_getNumByTexture
    //177
    Test_assertFloat(Animation_getNumByTexture(0.0),177.0/255.0);
    Test_assertFloat(Animation_getNumByTexture(1.0),67.0/255.0);
    Test_assertFloat(Animation_getNumByTexture(972.0),162.0/255.0);
    //完成测试Animation_getNumByTexture

    if(true){//开始解码部分代码测试
        //[50,106]期望对应6.18,实际对应6.6~
        float result=Animation_decode(50.0/255.0,106.0/255.0);
        Test_assertFloat(floor(result),6.0);//result个位是6
        //Test_assertFloat(floor(result*10.0),66.0);//result小数点后一位是6

        float A=50.0/255.0,B=106.0/255.0;
        A*=255.0;Test_assertFloat(floor(A),50.0);Test_assertFloat(A,50.0);
        B*=255.0;
        float a, b, c, d;
        a=floor(A/128.0);
        b=floor((modFloor(A, 128.0))/16.0);
        c=modFloor(A, 16.0);
        d=B;
        float c_d=c*256.0+d;
        float num=c_d*pow(10.0, b-5.0);
        if (a==1.0)num*=-1.0;
    }//结束解码部分代码测试



    return oTest.assertion;
}
void Test_init(){//用于测试
    vec3 tttt=texture2D(dataTexture, vec2(
    (0.5+0.0)/1.0, //宽width
    (0.5+floor(4.0/3.0))/oAnimation.dataTextureHeight//高height
    )).xyz;
    float a=1.0;
    float aa=1.0;
    int bb=1;
    float err=
    (
    Animation_decode(Animation_getNumByTexture(aa+0.0), Animation_getNumByTexture(aa+768.0))
    -
    0.0);//skeletonData[bb])/(skeletonData[bb]*2.56);

    //if(Animation_decode(50.0/255.0,106.0/255.0)!=6.18)return;
    float result=Animation_decode(50.0/255.0,106.0/255.0);


    myTest01=vec3(
        Animation_getNumByTexture(0.0),
        floor(result)/255.0,
        modFloor(floor(result*10.0),10.0)/255.0//Test_computeErr(446)
    );

}/**/