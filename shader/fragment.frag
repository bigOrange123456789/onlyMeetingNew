//shader里面使用8位二进制数0-255表示颜色，形式为0-1 x/255
#define TEXT_NUM 16.0//贴图个数
precision highp float;

uniform sampler2D text0;

varying float type_part,texType;//身体的哪个部分，贴图类型
varying vec3 varyColor;
varying vec2 outUV;
//varying vec3 myTest01;//用于测试

void main(){
    //gl_FragColor = vec4 (myTest01,1.0);return;//用于测试
    vec4 myTexture;
    myTexture =texture2D(text0, vec2((outUV.x+texType)/TEXT_NUM,outUV.y));

    if (floor(type_part)==0.0){ //下身
        gl_FragColor = vec4 (
        myTexture.r+varyColor[0],
        myTexture.g+varyColor[1],
        myTexture.b+varyColor[2],
        myTexture.a);
    }else{//上身或头部
        gl_FragColor = vec4 (
        myTexture.r+varyColor[1]/2.0,
        myTexture.g+varyColor[2]/2.0,
        myTexture.b+varyColor[0]/2.0,
        myTexture[3]);
    }
}