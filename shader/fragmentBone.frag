//shader里面使用8位二进制数0-255表示颜色，形式为0-1 x/255
precision highp float;

uniform sampler2D text0;
uniform sampler2D text1;
uniform sampler2D text2;
uniform sampler2D text3;
uniform sampler2D text4;
uniform sampler2D text5;
uniform sampler2D text6;
uniform sampler2D text7;
uniform sampler2D text8;
uniform sampler2D text9;
uniform sampler2D text10;
uniform sampler2D text11;
uniform sampler2D text12;
uniform sampler2D text13;
uniform sampler2D text14;
uniform sampler2D text15;

varying float type_part;

varying vec3 varyType;
varying vec3 varyColor;
varying vec2 outUV;

varying float myTest00;
varying vec3 myTest01;

void main(){
    gl_FragColor = vec4 (
    myTest01.x,
    myTest01.y,
    myTest01.z,
    1.0
    );
    return;
    vec4 myTexture;
    float type;

    if (floor(type_part)==0.0)type=varyType[0];//下身
    else if (floor(type_part)==1.0)type=varyType[1];
    else if (floor(type_part)==2.0)type=varyType[2];

    if (type>-0.1&&type<0.1)myTexture =texture2D(text0, outUV);
    else if (type>0.9&&type<1.1)myTexture =texture2D(text1, outUV);
    else if (type>1.9&&type<2.1)myTexture =texture2D(text2, outUV);
    else if (type>2.9&&type<3.1)myTexture =texture2D(text3, outUV);
    else if (type>3.9&&type<4.1)myTexture =texture2D(text4, outUV);
    else if (type>4.9&&type<5.1)myTexture =texture2D(text5, outUV);
    else if (type>5.9&&type<6.1)myTexture =texture2D(text6, outUV);
    else if (type>6.9&&type<7.1)myTexture =texture2D(text7, outUV);
    else if (type>7.9&&type<8.1)myTexture =texture2D(text8, outUV);
    else if (type>8.9&&type<9.1)myTexture =texture2D(text9, outUV);
    else if (type>9.9&&type<10.1)myTexture =texture2D(text10, outUV);
    else if (type>10.9&&type<11.1)myTexture =texture2D(text11, outUV);
    else if (type>11.9&&type<12.1)myTexture =texture2D(text12, outUV);
    else if (type>12.9&&type<13.1)myTexture =texture2D(text13, outUV);
    else if (type>13.9&&type<14.1)myTexture =texture2D(text14, outUV);
    else myTexture =texture2D(text15, outUV);

    if (floor(type_part)==0.0){ //下身
        gl_FragColor = vec4 (
        myTexture.r+varyColor[0],
        myTexture.g+varyColor[1],
        myTexture.b+varyColor[2],
        1.0);
    } else if (floor(type_part)==1.0){ //上身
        gl_FragColor = vec4 (
        myTexture.r, //0-255
        myTexture.g,
        myTexture.b,
        1.0);
    } else if (floor(type_part)==2.0){ //头部
        gl_FragColor = vec4 (
        myTexture.r,
        myTexture.g,
        myTexture.b,
        1.0);
    }
}