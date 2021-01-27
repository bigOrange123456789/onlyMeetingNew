precision highp float;//highp
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float skeletonMatrix[204];//骨骼(25-8)*12=204//骨骼矩阵//用于求不动位置的骨骼
uniform float skeletonData[768];//帧数8*骨骼8*12=768//用于求手臂骨骼//8个手臂骨骼的数据//uniform float[]最大长度4088//变化范围12(0-11)

uniform float time;//0-10000

attribute vec3 position;
attribute vec2 inUV;
attribute vec4 skinIndex;
attribute vec4 skinWeight;

attribute float random;

attribute float speed;

attribute vec3 mcol0;
attribute vec3 mcol1;
attribute vec3 mcol2;
attribute vec3 mcol3;

attribute vec4 type;   //type[3]是0或1，用于表示动画
attribute vec3 color;

varying vec2 outUV;
varying vec3 varyType;
varying vec3 varyColor;
varying float type_part;
varying float myTest00;

int frame_index;
mat4 matrixs[25];//所有的骨骼矩阵//matrixsSet()

void frame_indexSet(){//求帧序号//int frame_index;
    float t=((time*speed)/16.0-floor((time*speed)/16.0))*16.0;//将time*speed对8取余结果：[0，7)

    if(t>-0.5&&t<=0.5)frame_index=0;
    else if(t>0.5&&t<=1.5)frame_index=1;
    else if(t>1.5&&t<=2.5)frame_index=2;
    else if(t>2.5&&t<=3.5)frame_index=3;
    else if(t>3.5&&t<=4.5)frame_index=4;
    else if(t>4.5&&t<=5.5)frame_index=5;
    else if(t>5.5&&t<=6.5)frame_index=6;
    else if(t>6.5&&t<=7.5)frame_index=7;
    else if(t>7.5&&t<=8.5)frame_index=7;
    else if(t>8.5&&t<=9.5)frame_index=6;
    else if(t>9.5&&t<=10.5)frame_index=5;
    else if(t>10.5&&t<=11.5)frame_index=4;
    else if(t>11.5&&t<=12.5)frame_index=3;
    else if(t>12.5&&t<=13.5)frame_index=2;
    else if(t>13.5&&t<=14.5)frame_index=1;
    else frame_index=0;
}
mat4 getMatrixs_i(int i){//求不动位置的骨骼
    if(i>14)i=i-8;
    return mat4(//最后一列是：0 0 0 1
    skeletonMatrix[i*12+0] ,skeletonMatrix[i*12+1] ,skeletonMatrix[i*12+2] ,0 ,
    skeletonMatrix[i*12+3] ,skeletonMatrix[i*12+4] ,skeletonMatrix[i*12+5] ,0 ,
    skeletonMatrix[i*12+6] ,skeletonMatrix[i*12+7] ,skeletonMatrix[i*12+8] ,0 ,
    skeletonMatrix[i*12+9],skeletonMatrix[i*12+10],skeletonMatrix[i*12+11] ,1
    );
}
mat4 getMatrixs0_i(int iii){//求手臂骨骼
    int i=iii-7;//iii的取值范围是7-14 -> 0-7
    return mat4(//最后一列是：0 0 0 1
    skeletonData[frame_index*96+i*12+0] ,skeletonData[frame_index*96+i*12+1] ,skeletonData[frame_index*96+i*12+2] ,0,
    skeletonData[frame_index*96+i*12+3] ,skeletonData[frame_index*96+i*12+4] ,skeletonData[frame_index*96+i*12+5] ,0 ,
    skeletonData[frame_index*96+i*12+6] ,skeletonData[frame_index*96+i*12+7] ,skeletonData[frame_index*96+i*12+8] ,0,
    skeletonData[frame_index*96+i*12+9] ,skeletonData[frame_index*96+i*12+10],skeletonData[frame_index*96+i*12+11],1
    );
}


void matrixsSet(){
    frame_indexSet();//设置全局变量frame_index的值

    for(int i=0;i<7;i++)matrixs[i]=getMatrixs_i(i);
    for(int i=7;i<15;i++)matrixs[i]=getMatrixs0_i(i);//胳膊
    for(int i=15;i<25;i++)matrixs[i]=getMatrixs_i(i);
}
void main(){
    vec3 vPosition = position;

    outUV = inUV;
    varyType=vec3(type[0],type[1],type[2]);
    varyColor=vec3(color[0],color[1],color[2]);
    myTest00=type[3];

    if(vPosition.y<0.15)type_part=0.0;//下身
    else if(vPosition.y<0.59) type_part=1.0;//上身
    else type_part=2.0;//头部

    matrixsSet();//求所有的骨骼矩阵

    int mySkinIndex[4];//求skinIndex的近似整数，结果存入mySkinIndex
    for(int j=0;j<4;j++){
        float i0=0.0;
        for(int i=0;i<25;i++){
            if((skinIndex[j]-i0)>-0.5&&(skinIndex[j]-i0)<0.5){
                mySkinIndex[j]=i;
            }
            i0=i0+1.0;
        }
    }
    //计算动画的变换矩阵：matrix1=skinWeight[0]*matrixs[mySkinIndex[0]]+...
    mat4 matrix1=mat4(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    mat4 matrix_temp;
    for(int i=0;i<25;i++)
    if(i==mySkinIndex[0]){
        matrix_temp=matrixs[i];
        matrix1=matrix1+skinWeight[0]*matrix_temp;
    }else if(i==mySkinIndex[1]){
        matrix_temp=matrixs[i];
        matrix1=matrix1+skinWeight[1]*matrix_temp;
    }else if(i==mySkinIndex[2]){
        matrix_temp=matrixs[i];
        matrix1=matrix1+skinWeight[2]*matrix_temp;
    }else if(i==mySkinIndex[3]){
        matrix_temp=matrixs[i];
        matrix1=matrix1+skinWeight[3]*matrix_temp;
    }

    mat4 matrix2 = mat4(//确定位置//最后一列是 0 0 0 1
    vec4( mcol0, 0),
    vec4( mcol1, 0),
    vec4( mcol2, 0),
    vec4( mcol3, 1)
    );

    gl_Position = projectionMatrix * modelViewMatrix*  matrix2  * matrix1 * vec4( position, 1.0 );

}