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

    Test_assertFloat(Animation_getNumByTexture(10.0)*255.0,193.0);
    Test_assertFloat(Animation_getNumByTexture(100.0)*255.0,67.0);
    Test_assertFloat(Animation_getNumByTexture(500.0)*255.0,195.0);
    Test_assertFloat(Animation_getNumByTexture(974.0)*255.0,194.0);
    Test_assertFloat(Animation_getNumByTexture(975.0)*255.0,162.0);

    //Test_assertFloat(Animation_getNumByTexture(0.0),177.0);
    //oAnimation.skeletonLast
    //Test_assertFloat(oAnimation.skeletonPos1,204.0);
    //Test_assertFloat(SKELETON_SIZE0,204.0);
    //Test_assertFloat(oAnimation.skeletonPos0,0.0);
    //Test_assertFloat(floor(oAnimation.skeletonPos1+0.5),204.0);
    Test_assertFloat(oAnimation.skeletonLast,975.);//972.0+3.0
    //Test_assertFloat(oAnimation.dataTextureHeight,712.0);//712

    Test_assertFloat(Animation_getNumByTexture(0.0)*255.0,177.0);
    //Test_assertFloat(Animation_getNumByTexture(973.0)*255.0,162.0);//这里遇到了问题
    Test_assertFloat(Animation_decode(177.0/255.0,162.0/255.0),-4.18);//Animation_decode


    if(true){//开始解码部分代码测试
        //[50,106]期望对应6.18,实际对应6.6~

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
    float result=-1.0*Animation_getElem1(0.0)*255.0;


    myTest01=vec3(
        //Animation_getNumByTexture(0.0),
        Animation_getNumByTexture(100.0),//64
        floor(result*10.0)/255.0,//9
        floor(result*100.0)/255.0//99
        //modFloor(floor(result*10.0),10.0)/255.0//Test_computeErr(446)
    );

}