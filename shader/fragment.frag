#version 300 es
//shader里面使用8位二进制数0-255表示颜色，形式为0-1 x/255
precision highp float;
uniform sampler2D text0;
uniform float textNum;//贴图个数

in float type_part;//,texType;//身体的哪个部分，贴图类型
in vec3 varyColor,varyType;//,outNormal,lightDirection;
in vec2 outUV;
in float outfaceShape;
out vec4 myOutputColor;

float texType;
in vec3 myTest01;//用于测试
vec4 TextureController_computeMyTexture();
void main(){
    if (type_part<0.5)texType=varyType[0];//下身//0
    else if (type_part<1.5)texType=varyType[1];//1
    else texType=varyType[2];//2

    vec4 myTexture=TextureController_computeMyTexture();

    vec3 color;
    if (type_part<0.5){ //下身
        color = vec3 (
            myTexture.r+varyColor[0],
            myTexture.g+varyColor[1],
            myTexture.b+varyColor[2]
        );
    }else{//上身或头部
        color = vec3 (
            myTexture.r+varyColor[1]/2.0,
            myTexture.g+varyColor[2]/2.0,
            myTexture.b+varyColor[0]/2.0
        );
    }
    //float diffuse = dot( outNormal, lightDirection );
    //myOutputColor = vec4 (diffuse *color,myTexture[3]);
    myOutputColor = vec4 (color,myTexture[3]);
    //myOutputColor =vec4 (myTest01,1.0);//用于测试
}

struct TextureController{
    float widthOneImg;//一张图片的宽度
    float imgStart;//当前像素点对应图片的起始位置
    float uPixel;//当前像素点的横坐标
    vec4 myTexture;
}oTextureController;
vec2 scaling(vec2 uv,float x1,float x2,float y1,float y2,float k1,float k2,float xx1,float xx2,float yy1,float yy2){
    float u=uv.x,v=uv.y;//uv的横坐标
    float x0 =(x1+x2)/2.  ,y0 =(y1+y2)/2.  ;
    if(xx1<u&&u<xx2&&yy1<v&&v<yy2){
        float f1,f2,t1,t2;
        //横向设置
        if(u<=x1){//左边缘
            f1=k1*(x1-x0)+x0;
            f2=xx1;
            t1=x1;
            t2=xx1;
            u=(u-t1)*(f1-f2)/(t1-t2)+f1;
        }else if(u>=x2){//右边缘
            f1=k1*(x2-x0)+x0;
            f2=xx2;
            t1=x2;
            t2=xx2;
            u=(u-t1)*(f1-f2)/(t1-t2)+f1;
        }else{
            u=k1*(u-x0)+x0;
        }
        //纵向设置
        if(v<=y1){//上边缘
            f1=k2*(y1-y0)+y0;
            f2=yy1;
            t1=y1;
            t2=yy1;
        }else if(v>=y2){//下边缘
            f1=k2*(y2-y0)+y0;
            f2=yy2;
            t1=y2;
            t2=yy2;
        }else{
            v=k2*(v-y0)+y0;
        }
    }
    vec2 uv2=vec2(u,v);
    return uv2;
}
vec4 TextureController_computeMyTexture(){
    float x1,x2,y1,y2,k1,k2,xx1,xx2,yy1,yy2,u,v;
    vec2 uv=outUV;

    //调整左眼大小
    /*
    xx1=0.444,  yy1=0.752,
    x1 =0.452,  y1 =0.811,
    x2 =0.491,  y2 =0.850,
    xx2=0.500,  yy2=0.94,
    k1=1.0, k2=1.0;
    */
    //uv=scaling(outUV,x1,x2,y1,y2,k1,k2,xx1,xx2,yy1,yy2);

    //调整嘴巴大小

    xx1=0.474,  yy1=1.-0.936,
    x1 =0.483,  y1 =1.-0.921,
    x2 =0.517,  y2 =1.-0.887,
    xx2=0.536,  yy2=1.-0.878,
    k1=outfaceShape, k2=1.0;

    /*xx1=0.474,  yy1=0.878,
    x1 =0.483,  y1 =0.887,
    x2 =0.517,  y2 =0.921,
    xx2=0.536,  yy2=0.936,
    k1=outfaceShape, k2=1.0;*/

    //k1:0.1-3.5
    uv=scaling(outUV,x1,x2,y1,y2,k1,k2,xx1,xx2,yy1,yy2);


    u=uv.x,v=uv.y;//uv的横坐标

    if(u>0.5)u=1.0-u;//例：0.8->0.2
    //去除中间缝隙
    float x0=0.48;
    if(u>x0){
        float k1=0.5;
        u=x0+k1*(u-x0);
    }

    u=u*2.0;//去掉右半部分
    oTextureController.widthOneImg=1.0/textNum;//每张图片的宽度
    oTextureController.imgStart=texType/textNum;//当前图片的起始位置
    oTextureController.uPixel=oTextureController.imgStart+u/textNum;

    oTextureController.myTexture =texture(
            text0,
            vec2(oTextureController.uPixel,v)
    );
    return oTextureController.myTexture;
}
