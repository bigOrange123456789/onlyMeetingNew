#version 300 es
precision highp float;//highp
uniform sampler2D animationData;
uniform float animationDataLength;//动画数据的数据个数
uniform mat4 modelViewMatrix,projectionMatrix;
uniform float time,cameraX,cameraY,cameraZ;//0-10000
uniform float neckPosition;

in vec3 position;
in vec2 inUV;
in vec3 normal;
in vec4 skinIndex,skinWeight;
in float speed;
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
out vec3 outNormal;
out vec3 lightDirection;
out vec3 varyColor,varyType;
out float type_part;//,texType;
out vec3 myTest01;
out float outfaceShape;

void Animation_init();
mat4 Animation_computeMatrix();
float Animation_getElem2(float n);
void main(){
    outUV = inUV;
    outfaceShape=faceShape;
    varyColor=color;
    outNormal=normal;
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
    w=w+1.;w=1.;

    //vec4 position=modelViewMatrix * matrix2  * vec4(position.x*w,position.y,position.z*w, 1.0);

    //去除局部变换，预处理动画
    vec4 position=modelViewMatrix * matrix2 *  vec4(position.x,position.y,position.z, 1.0);
    //vec4 position=modelViewMatrix * matrix2 * matrix1  * vec4(position.x*w,position.y,position.z*w, 1.0);
    lightDirection=normalize(vec3(cameraX,cameraY,cameraZ)-mcol3);
    //lightDirection=normalize(mcol3-vec3(cameraX,cameraY,cameraZ));
    //lightDirection=normalize(vec3(position.x-cameraX,position.y-cameraY,position.z-cameraZ));
    gl_Position = projectionMatrix * position;

    //Test_init();
    //if(!Test_meetExpectations())gl_Position =vec4(0.,0.,0.,0.);
    myTest01=vec3(Animation_getElem2(0.),Animation_getElem2(1.),Animation_getElem2(2.));

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

struct Animation{
        float skeletonPos0;

        int frameIndex;
        float frameIndex_f;
}oAnimation;
float Animation_getNumByAnim(sampler2D smp,float n){//通过矩阵序号获取动画矩阵
    vec3 tttt=texture(smp, vec2(
        (0.5+0.0)/1.0, //宽width
        (0.5+floor(n/3.0))/(animationDataLength/3.0)//除3是指每个像素点可存储3个数据
    )).xyz;
    float m=modFloor(n, 3.0);
    if (m<0.5)return tttt.x;
    else if (m<1.5)return tttt.y;
    else return tttt.z;
}
float Animation_getElem2(float n){ //取手臂骨骼数据
    return Animation_getNumByAnim(animationData,n);
}
mat4 Animation_getMatrix(float i){ //求骨骼
    float frame_index=oAnimation.frameIndex_f;
    float startPos=i*12.+frame_index*12.*33.;//动画编号{帧序号{骨骼序号}}
    //1个动画，8帧，33根骨头
    /*if (type[3]<0.5){
        startPos+=oAnimation.skeletonPos0;
    }
    return mat4(//最后一列是：0 0 0 1
        Animation_getElem2(startPos+0.), Animation_getElem2(startPos+4.), Animation_getElem2(startPos+8.), 0,
        Animation_getElem2(startPos+1.), Animation_getElem2(startPos+5.), Animation_getElem2(startPos+9.), 0,
        Animation_getElem2(startPos+2.), Animation_getElem2(startPos+6.), Animation_getElem2(startPos+10.), 0,
        Animation_getElem2(startPos+3.), Animation_getElem2(startPos+7.), Animation_getElem2(startPos+11.), 1
    );
}
    */
    return mat4(//最后一列是：0 0 0 1
        Animation_getElem2(startPos+0.), Animation_getElem2(startPos+1.), Animation_getElem2(startPos+2.), 0,
        Animation_getElem2(startPos+3.), Animation_getElem2(startPos+4.), Animation_getElem2(startPos+5.), 0,
        Animation_getElem2(startPos+6.), Animation_getElem2(startPos+7.), Animation_getElem2(startPos+8.), 0,
        Animation_getElem2(startPos+9.), Animation_getElem2(startPos+10.), Animation_getElem2(startPos+11.), 1
    );
}


void Animation_frameIndexSet(float frameNum){ //求帧序号//int frame_index;
    float t=modFloor(time*speed, frameNum*2.);//((time*speed)/16.0-floor((time*speed)/16.0))*16.0;//将time*speed对8取余结果：[0，7)
    int frame_index;//0-15
    float frameIndex_f;

    if(t<frameNum-0.5)frameIndex_f=round(t);
    else frameIndex_f=frameNum*2.-1.-round(t);
    frame_index=int(frameIndex_f);

    oAnimation.frameIndex=frame_index;
    oAnimation.frameIndex_f=frameIndex_f;
    //oAnimation.frameIndex=1;
    //oAnimation.frameIndex_f=1.;
}
mat4 Animation_computeMatrix(){
    //计算动画的变换矩阵：matrix1=skinWeight[0]*matrixs[mySkinIndex[0]]+...
    mat4 matrix1;//每个点只与一个骨骼相关
    matrix1=Animation_getMatrix(skinIndex[0]);

    return matrix1;
}
void Animation_init(){
    oAnimation.skeletonPos0=0.0;

    Animation_frameIndexSet(12.);//设置全局变量frame_index的值
}
