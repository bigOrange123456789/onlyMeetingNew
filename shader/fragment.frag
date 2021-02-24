#version 300 es
//shader里面使用8位二进制数0-255表示颜色，形式为0-1 x/255
precision highp float;
uniform sampler2D text0;
uniform float textNum;//贴图个数

in float type_part;//,texType;//身体的哪个部分，贴图类型
in vec3 varyColor,varyType;
in vec2 outUV;
out vec4 myOutputColor;

float texType;
//varying vec3 myTest01;//用于测试
vec4 TextureController_computeMyTexture();
void main(){
    //gl_FragColor = vec4 (myTest01,1.0);return;//用于测试

    if (type_part<0.5)texType=varyType[0];//下身//0
    else if (type_part<1.5)texType=varyType[1];//1
    else texType=varyType[2];//2

    vec4 myTexture=TextureController_computeMyTexture();

    if (type_part<0.5){ //下身
        myOutputColor = vec4 (
            myTexture.r+varyColor[0],
            myTexture.g+varyColor[1],
            myTexture.b+varyColor[2],
            myTexture.a
        );
    }else{//上身或头部
        myOutputColor = vec4 (
            myTexture.r+varyColor[1]/2.0,
            myTexture.g+varyColor[2]/2.0,
            myTexture.b+varyColor[0]/2.0,
            myTexture[3]
        );
    }
}

struct TextureController{
    float widthOneImg;//一张图片的宽度
    float imgStart;//当前像素点对应图片的起始位置
    float uPixel;//当前像素点的横坐标
    vec4 myTexture;
}oTextureController;
vec4 TextureController_computeMyTexture(){
    float u=outUV.x;
    if(u>0.5)u=1.0-u;
    u=u*2.0;
    oTextureController.widthOneImg=1.0/textNum;
    oTextureController.imgStart=texType/textNum;
    oTextureController.uPixel=oTextureController.imgStart+u/textNum;
    //oTextureController.uPixel=(texType+u)/TEXT_NUM;
    //if(oTextureController.uPixel>)
    oTextureController.myTexture =texture(
            text0,
            vec2(oTextureController.uPixel,outUV.y)
    );
    return oTextureController.myTexture;
}