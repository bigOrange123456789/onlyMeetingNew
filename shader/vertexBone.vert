#define dataTextureHeight 512.0

precision highp float;//highp

uniform sampler2D dataTexture;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float skeletonMatrix[204];//骨骼(25-8)*12=204//骨骼矩阵//用于求不动位置的骨骼
uniform float skeletonData[768];//帧数8*骨骼8*12=768//用于求手臂骨骼//8个手臂骨骼的数据//uniform float[]最大长度4088//变化范围12(0-11)

uniform float time;//0-10000

attribute vec3 position;
attribute vec2 inUV;
attribute vec4 skinIndex;

attribute float random;

attribute float speed;

attribute vec3 mcol0;
attribute vec3 mcol1;
attribute vec3 mcol2;
attribute vec3 mcol3;

attribute vec4 type;//type[3]是0或1，用于表示动画
attribute vec3 color;

varying vec2 outUV;
varying vec3 varyType;
varying vec3 varyColor;
varying float type_part;
varying float myTest00;
varying vec3 myTest01;

int frame_index;

float modFloor(float a, float b);//取余数
int float2int(float n);//小数化整数
float int2float(int n);//整数化小数
float decode(float A, float B);//数据解码
void noShader();//不进行渲染

float getNumByTexture(float n);
float getI(int m);//取手臂骨骼数据
void frame_indexSet();//求帧序号
mat4 getMatrixs_i(int i);//求不动位置的骨骼
mat4 getMatrixs0_i(int iii);//求手臂骨骼
mat4 getMatrix(int i);//求骨骼

float computeErr_i(int b);//计算误差
float computeErr(int type);
int computeErr_();

void main(){
    vec3 tttt=texture2D(dataTexture, vec2(
    (0.5+0.0)/1.0, //宽width
    (0.5+floor(4.0/3.0))/dataTextureHeight//高height
    )).xyz;
    float a=1.0;
    float aa=1.0;
    int bb=1;
    float err=
    (
    decode(getNumByTexture(aa+0.0), getNumByTexture(aa+768.0))
    -
    skeletonData[bb]
    )/(skeletonData[bb]*2.56);
    myTest01=vec3(
    getNumByTexture(0.0), //computeErr(0),
    computeErr_i(0),
    computeErr_i(446)
    );

    vec3 vPosition = position;

    outUV = inUV;
    varyType=vec3(type[0], type[1], type[2]);
    varyColor=vec3(color[0], color[1], color[2]);

    if (vPosition.y<0.15&&(vPosition.z<0.35&&vPosition.z>-0.35))type_part=0.0;//下身
    else if (vPosition.y<0.59) type_part=1.0;//上身
    else type_part=2.0;//头部

    frame_indexSet();//设置全局变量frame_index的值

    //计算动画的变换矩阵：matrix1=skinWeight[0]*matrixs[mySkinIndex[0]]+...
    mat4 matrix1;//每个点只与一个骨骼相关
    float i0=0.0;
    for (int i=0;i<25;i++){
        if ((skinIndex[0]-i0)>-0.5&&(skinIndex[0]-i0)<0.5){
            matrix1=getMatrix(i);
        }
        i0=i0+1.0;
    }

    mat4 matrix2 = mat4(//确定位置//最后一列是 0 0 0 1
    vec4(mcol0, 0),
    vec4(mcol1, 0),
    vec4(mcol2, 0),
    vec4(mcol3, 1)
    );

    gl_Position = projectionMatrix * modelViewMatrix * matrix2  * matrix1 * vec4(position, 1.0);
}
float computeErr_i(int b){ //0-1
    float a=int2float(b);
    return
    (
    decode(getNumByTexture(a+0.0), getNumByTexture(a+768.0))
    -
    skeletonData[b]
    )/(skeletonData[b]*2.56);
}
float computeErr(int type){
    float a=1.0;
    float aMax=1.0;
    int   bMax=1;
    float errMax=computeErr_i(0);
    /*for(int b=1;b<760;b++){//760
            float err0=computeErr_i(b);
            if(errMax<err0){
                errMax=err0;
                aMax=a;
                bMax=b;
            }
            a+=1.0;
        }
    if(type==0)return errMax;
    else return aMax;*/
    return computeErr_i(0);
}
int computeErr_(){
    float a=1.0;
    float aMax=1.0;
    int   bMax=1;
    float errMax=computeErr_i(0);
    for (int b=1;b<760;b++){
        float err0=computeErr_i(b);
        if (errMax<err0){
            errMax=err0;
            aMax=a;
            bMax=b;
        }
        a+=1.0;
    }
    return bMax;
}
float getNumByTexture(float n){
    vec3 tttt=texture2D(dataTexture, vec2(
    (0.5+0.0)/1.0, //宽width
    (0.5+floor(n/3.0))/dataTextureHeight//高height
    )).xyz;
    float m=modFloor(n, 3.0);
    //return m/256.0;
    if (m<0.5)return tttt.x;
    else if (m<1.5)return tttt.y;
    else return tttt.z;
}
float decode(float A, float B){ //0-1
    A*=256.0;
    B*=256.0;
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
float getI(int m){ //取手臂骨骼数据
    float n=int2float(m);
    float A=getNumByTexture(n), B=getNumByTexture(n+dataTextureHeight*3.0/2.0);
    return decode(A, B);
}
void noShader(){
    gl_Position=vec4(0.0, 0.0, 0.0, 0.0);
}
float modFloor(float a, float b){
    return (a/b-floor(a/b))*b;
}
void frame_indexSet(){ //求帧序号//int frame_index;
    //mod(time*speed,16.0);
    //mod(2,1);
    //int a=2 mod 1;
    //mod(2.0,1.0);
    float t=modFloor(time*speed, 16.0);//((time*speed)/16.0-floor((time*speed)/16.0))*16.0;//将time*speed对8取余结果：[0，7)

    if (t>-0.5&&t<=0.5)frame_index=0;
    else if (t>0.5&&t<=1.5)frame_index=1;
    else if (t>1.5&&t<=2.5)frame_index=2;
    else if (t>2.5&&t<=3.5)frame_index=3;
    else if (t>3.5&&t<=4.5)frame_index=4;
    else if (t>4.5&&t<=5.5)frame_index=5;
    else if (t>5.5&&t<=6.5)frame_index=6;
    else if (t>6.5&&t<=7.5)frame_index=7;
    else if (t>7.5&&t<=8.5)frame_index=7;
    else if (t>8.5&&t<=9.5)frame_index=6;
    else if (t>9.5&&t<=10.5)frame_index=5;
    else if (t>10.5&&t<=11.5)frame_index=4;
    else if (t>11.5&&t<=12.5)frame_index=3;
    else if (t>12.5&&t<=13.5)frame_index=2;
    else if (t>13.5&&t<=14.5)frame_index=1;
    else frame_index=0;
}
mat4 getMatrixs_i(int i){ //求不动位置的骨骼
    if (i>14)i=i-8;
    return mat4(//最后一列是：0 0 0 1
    skeletonMatrix[i*12+0], skeletonMatrix[i*12+1], skeletonMatrix[i*12+2], 0,
    skeletonMatrix[i*12+3], skeletonMatrix[i*12+4], skeletonMatrix[i*12+5], 0,
    skeletonMatrix[i*12+6], skeletonMatrix[i*12+7], skeletonMatrix[i*12+8], 0,
    skeletonMatrix[i*12+9], skeletonMatrix[i*12+10], skeletonMatrix[i*12+11], 1
    );
}
mat4 getMatrixs0_i(int iii){ //求手臂骨骼
    int i=iii-7;//iii的取值范围是7-14 -> 0-7
    return mat4(//最后一列是：0 0 0 1
    getI(frame_index*96+i*12+0), getI(frame_index*96+i*12+1), getI(frame_index*96+i*12+2), 0,
    getI(frame_index*96+i*12+3), getI(frame_index*96+i*12+4), getI(frame_index*96+i*12+5), 0,
    getI(frame_index*96+i*12+6), getI(frame_index*96+i*12+7), getI(frame_index*96+i*12+8), 0,
    getI(frame_index*96+i*12+9), getI(frame_index*96+i*12+10), getI(frame_index*96+i*12+11), 1
    );
    /*return mat4(//最后一列是：0 0 0 1
            getI(frame_index*96+i*12+0) ,getI(frame_index*96+i*12+1) ,getI(frame_index*96+i*12+2) ,0,
                getI(frame_index*96+i*12+3) ,getI(frame_index*96+i*12+4) ,getI(frame_index*96+i*12+5) ,0 ,
            getI(frame_index*96+i*12+6) ,getI(frame_index*96+i*12+7) ,getI(frame_index*96+i*12+8) ,0,
            getI(frame_index*96+i*12+9) ,getI(frame_index*96+i*12+10),getI(frame_index*96+i*12+11),1
        );
    return mat4(//最后一列是：0 0 0 1
            skeletonData[frame_index*96+i*12+0] ,skeletonData[frame_index*96+i*12+1] ,skeletonData[frame_index*96+i*12+2] ,0,
                skeletonData[frame_index*96+i*12+3] ,skeletonData[frame_index*96+i*12+4] ,skeletonData[frame_index*96+i*12+5] ,0 ,
            skeletonData[frame_index*96+i*12+6] ,skeletonData[frame_index*96+i*12+7] ,skeletonData[frame_index*96+i*12+8] ,0,
            skeletonData[frame_index*96+i*12+9] ,skeletonData[frame_index*96+i*12+10],skeletonData[frame_index*96+i*12+11],1
        );*/
}
mat4 getMatrix(int i){ //求骨骼
    if (i>=7&&i<=14) return getMatrixs0_i(i);
    else return getMatrixs_i(i);
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