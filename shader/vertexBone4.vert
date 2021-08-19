#version 300 es
precision highp float;//highp
uniform sampler2D animationData;
uniform float animationDataLength;//动画数据的数据个数
uniform mat4 modelViewMatrix,projectionMatrix;
uniform float time,cameraX,cameraY,cameraZ;//0-10000
uniform float neckPosition;

in vec3 position;
in float index;
in vec2 inUV;
//in vec3 normal;
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
//out vec3 outNormal;
//out vec3 lightDirection;
out vec3 varyColor,varyType;
out float type_part;//,texType;
out vec3 myTest01;
out float outfaceShape;

void Animation_init();
vec4 Animation_compute();
float Animation_getNumByAnim(sampler2D smp,float n);//通过矩阵序号获取动画矩阵
void main(){
    outUV = inUV;
    outfaceShape=faceShape;
    varyColor=color;
    //outNormal=normal;
    varyType=vec3(type[0], type[1], type[2]);
    if (position.y<0.15&&(position.z<0.35&&position.z>-0.35))type_part=0.0;//下身
    else if (position.y<neckPosition) type_part=1.0;//上身
    else type_part=2.0;//头部

    Animation_init();
    vec4 p=Animation_compute();//计算动画的变换矩阵

    /*mat4 matrix = mat4(//确定位置//最后一列是 0 0 0 1
        vec4(mcol0, 0),
        vec4(mcol1, 0),
        vec4(mcol2, 0),
        vec4(mcol3, 1)//实例化物体对象世界矩阵
    );
    gl_Position=projectionMatrix * modelViewMatrix * matrix *  p;
    */


    /*gl_Position=projectionMatrix * modelViewMatrix *vec4(
        p.x*mcol0.x+p.y*mcol1.x+p.z*mcol2.x+mcol3.x,
        p.x*mcol0.y+p.y*mcol1.y+p.z*mcol2.y+mcol3.y,
        p.x*mcol0.z+p.y*mcol1.z+p.z*mcol2.z+mcol3.z,
        1.
    );*/
    //减少6次乘法

    gl_Position=projectionMatrix * modelViewMatrix *vec4(5.*p.x+mcol3.x, 5.*p.y+mcol3.y, 5.*p.z+mcol3.z, 1.);
    //gl_Position=projectionMatrix * modelViewMatrix *   vec4(5.*animationPos.x,5.*animationPos.y,5.*animationPos.z,1.);
    //lightDirection=normalize(vec3(cameraX,cameraY,cameraZ)-mcol3);

    //Test_init();
    //if(!Test_meetExpectations())gl_Position =vec4(0.,0.,0.,0.);
    //myTest01=vec3(index/6000.,Animation_getElem2(1.),Animation_getElem2(2.)*10.);

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
        float frameIndex_f;
}oAnimation;
float Animation_getNumByAnim(sampler2D smp,float n){//通过矩阵序号获取动画矩阵
    float k=floor(n/3.);

    float w=1000.;
    float h=(animationDataLength/3.)/w;//除3是指每个像素点可存储3个数据
    //按列存储数据
    float x = mod(k,w);
    float y = floor(k/w);

    //float dx=1./w;//横向像素个数
    //float dy=1./h;//height纵向像素个数
    float px=(x+0.5)/w;
    float py=(y+0.5)/h;
    vec3 tttt=texture(smp, vec2(px,py)).xyz;
    float m=mod(n, 3.0);
    if (m<0.5)return tttt.x;
    else if (m<1.5)return tttt.y;
    else return tttt.z;
}
void Animation_frameIndexSet(float frameNum){ //求帧序号//int frame_index;
    float t=modFloor(time*speed, frameNum*2.);//((time*speed)/16.0-floor((time*speed)/16.0))*16.0;//将time*speed对8取余结果：[0，7)
    int frame_index;//0-15
    float frameIndex_f;

    if(t<frameNum-0.5)frameIndex_f=round(t);
    else frameIndex_f=frameNum*2.-1.-round(t);
    oAnimation.frameIndex_f=frameIndex_f;
}
vec4 Animation_compute(){
    float vi=index;
    float fi=oAnimation.frameIndex_f;;
    float bn=33.;
    float vn=6606.;
    float x=Animation_getNumByAnim(animationData,fi*vn*3.+vi*3.);
    float y=Animation_getNumByAnim(animationData,fi*vn*3.+vi*3.+1.);
    float z=Animation_getNumByAnim(animationData,fi*vn*3.+vi*3.+2.);
    return  vec4(x,y,z,1.);
}
void Animation_init(){
    oAnimation.skeletonPos0=0.;
    oAnimation.frameIndex_f=0.;
    Animation_frameIndexSet(12.);//计算帧序号frame_index
}
