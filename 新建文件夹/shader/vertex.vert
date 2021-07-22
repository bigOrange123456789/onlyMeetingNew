#version 300 es
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;
in vec2 inUV;

in float random;

in vec3 mcol0;
in vec3 mcol1;
in vec3 mcol2;
in vec3 mcol3;

in vec4 type;   //type[3]是0或1，用于表示动画
in vec3 color;

out vec2 outUV;
out vec3 varyColor;
out float type_part,texType;
out float myTest00;

void main(){
    vec3 vPosition = position;
    //if(random<0.8)//显示百分之80三角面
    //if(vPosition.y<1.8)//全身显示
    //if(vPosition.y>0.61&&vPosition.x>0.0)//只显示脸

    if(true)//全身显示
    //if(vPosition.x>-0.09)//前半部分
    //if((vPosition.x>-0.01&&vPosition.y>0.1)||vPosition.y>0.65)//只显示前半部分的上半身和头
    //if(vPosition.x>-0.01&&vPosition.y>0.1)//只显示前半部分的上半身
    {
        outUV = inUV;
        varyColor=vec3(color[0],color[1],color[2]);
        myTest00=type[3];

        if (vPosition.y<0.15&&(vPosition.z<0.35&&vPosition.z>-0.35)){
            type_part=0.0;//下身
            texType=floor(type[0]+0.5);
        } else if (vPosition.y<0.59) {
            type_part=1.0;//上身
            texType=floor(type[1]+0.5);
        } else{
            type_part=2.0;//头部
            texType=floor(type[2]+0.5);
        }

        //if(position.z<-1.0)type_part=0.0;
        //else type_part=1.0;

        mat4 matrix2 = mat4(//确定位置//最后一列是 0 0 0 1
        vec4( mcol0, 0),
        vec4( mcol1, 0),
        vec4( mcol2, 0),
        vec4( mcol3, 1)
        );

        gl_Position = projectionMatrix * modelViewMatrix*  matrix2  *  vec4( position, 1.0 );
        //gl_Position = projectionMatrix * modelViewMatrix*  matrix2  * matrix1 * vec4( position, 1.0 );
    }
}