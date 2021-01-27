function InstancedGroup(instanceCount,originMesh,animationClip ){
    //若有骨骼，则需要源mesh是skinnedMesh
    this.obj=new THREE.Object3D();
    this.instanceCount=instanceCount;

    //记录有无骨骼动画
    this.haveSkeleton = !(typeof (animationClip) == "undefined" || animationClip === false);

    this.originMeshs=originMesh;//这是一个数组，每个元素播放一种动画
    this.animationClip=animationClip;
    this.mesh=null;//实例化渲染对象的网格

    this.speed;
    this.mcol0;//变换矩阵的一部分
    this.mcol1;
    this.mcol2;
    this.mcol3;
    this.scales=[];
    this.rotations=[];
    this.type;
    this.colors;

    this.time=0;//每帧自动加1，加到一定值之后自动归0

    this.dummy=new THREE.Object3D();//dummy仿制品//工具对象

    this.init=function (texSrc){
        for(var i=0;i<this.instanceCount;i++){
            this.scales.push([1,1,1]);
            this.rotations.push([0,0,0]);
        }
        //const instanceCount =2*2;//10 0000//1089
        let texs_length=16;

        this.originMeshs[0].geometry=this.originMeshs[0].geometry.toNonIndexed();

        var geometry = new THREE.InstancedBufferGeometry();//console.log(geometry);
        geometry.instanceCount = this.instanceCount; // set so its initalized for dat.GUI, will be set in first draw otherwise
        //以下是使用geometry设置setAttribute(BufferAttribute/InstancedBufferAttribute)
        //BufferAttribute为每个点分配一组数据:先准备数据再生成空间
        //1-2
        geometry.setAttribute('position', this.originMeshs[0].geometry.attributes.position);//Float32Array
        geometry.setAttribute('inUV',this.originMeshs[0].geometry.attributes.uv);
        //3
        var randoms=new Float32Array(this.originMeshs[0].geometry.attributes.position.count);
        for(i=0;i<randoms.length;i++)
            randoms[i]=Math.random();
        geometry.setAttribute('random',new THREE.BufferAttribute(randoms,1));
        //4-5
        if(this.haveSkeleton){
            geometry.setAttribute('skinIndex',this.originMeshs[0].geometry.attributes.skinIndex);
            geometry.setAttribute('skinWeight',this.originMeshs[0].geometry.attributes.skinWeight);
        }
        //InstancedBufferAttribute为每个对象一组数据：先生成空间，再设置数据
        //6-11
        this.speed=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 1), 1);

        this.mcol0=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol1=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol2=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol3=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);

        this.type=new THREE.InstancedBufferAttribute(new Uint16Array(this.instanceCount*4), 4);//头部、上衣、裤子、动作
        this.colors=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount*3), 3);

        for(i=0;i<this.instanceCount;i++){
                this.speed.setX(i,0.01)//Math.random()*9+0.05);
                //this.speed.setX(i,Math.random()*9+0.05);
                this.mcol0.setXYZ(i, 1,0,0);//随机长宽高
                this.mcol1.setXYZ(i, 0,1,0);//四元数、齐次坐标
                this.mcol2.setXYZ(i, 0,0,1);//mcol3.setXYZ(i, 0,0,0);

                this.mcol3.setXYZ(i, 0,0,0);

                this.type.setXYZW(i,
                    Math.floor(Math.random() * texs_length),
                    Math.floor(Math.random() * texs_length),
                    Math.floor(Math.random() * texs_length),
                    Math.floor(Math.random() *2)//Math.random()//这个缓冲区是int类型的//所以这里不能传小数
                );
                this.colors.setXYZ(i,
                    0.0,0.0,0.0
                );
        }
        geometry.setAttribute('speed', this.speed);

        geometry.setAttribute('mcol0', this.mcol0);//四元数、齐次坐标
        geometry.setAttribute('mcol1', this.mcol1);
        geometry.setAttribute('mcol2', this.mcol2);
        geometry.setAttribute('mcol3', this.mcol3);

        geometry.setAttribute('type', this.type);
        geometry.setAttribute('color', this.colors);

        //以下是根据material设置的uniform
        let texs=[];
        for(i=0;i<texs_length;i++){
            texs.push( THREE.ImageUtils.loadTexture(texSrc[i]) ) ;
            texs[i].flipY=false;
            texs[i].wrapS = texs[i].wrapT = THREE.ClampToEdgeWrapping;
        }
        //开始测试
        // create a buffer with color data

        //var myCode=encode(7900.11);
        //console.log(myCode);
        //console.log(decode(myCode[0],myCode[1]));//25.1
        function decode(A,B) {
            var a,b,c,d;
            a=Math.floor(A/128);
            b=Math.floor((A%128)/16);
            c=A%16;
            d=B;

            var c_d=c*256+d;
            var num=c_d*Math.pow(10,b-5);
            if(a===1)num*=-1;
            return num;
        }
        function encode(floatNum) {
            var a=0,//正数
                b,//值0-7，10^(b-3)
                c,
                d;
            //计算a//0+ 1-
            if(floatNum<0){
                a=1;
                floatNum*=-1;
            }
            //计算b//0~7  -3~4
            if(floatNum>10000)b=7;
            else if(floatNum>1000)b=6;
            else if(floatNum>100)b=5;
            else if(floatNum>10)b=4;//25.11
            else if(floatNum>1)b=3;//2.51
            else if(floatNum>0.1)b=2;//0.512
            else if(floatNum>0.01)b=1;
            else if(floatNum>0.001)b=0;
            else{
                return [0,0];
            }
            //计算c和d
            var c_d=floatNum*Math.pow(10,7-b-2);//10^(7-b-2)
            c_d=Math.floor(c_d);//保留十进制3位有效数组
            c=Math.floor(c_d/256);
            d=c_d%256;

            var A=a*128+b*16+c;
            var B=d;
            return [A,B];
        }

        var test=[
            [1,4,7,10],
            [2,5,8,11],
            [3,6,9,12],
            [0,0,0,1]
        ];

        var width = 1 , height = 12*2 ;
        var size=width * height;
        var data = new Float32Array( 3 * size);
        for ( var i = 0; i < 3*size; i +=3 ){//存完一列再存第二列//width
                data[ i ] =i ;
                data[ i + 1 ] =i+1;
                data[ i + 2 ] =i+2 ;
                //if(j===0&&i===1)data[ stride ]=256;
            }
        //(a+b*height)*3+c
        //console.log(data);
        // used the buffer to create a DataTexture
        var dataTexture = new THREE.DataTexture(
            data,
            width,
            height,
            THREE.RGBFormat
        );
        console.log(dataTexture);
        //完成测试

        let material;
        function load(name) {
            let xhr = new XMLHttpRequest(),
                okStatus = document.location.protocol === "file:" ? 0 : 200;
            xhr.open('GET', name, false);
            xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
            xhr.send(null);
            return xhr.status === okStatus ? xhr.responseText : null;
        }
        if(this.haveSkeleton){

            material = new THREE.RawShaderMaterial({//原始着色器材质
                uniforms: {
                    dataTexture: {type: 't', value:dataTexture}

                    ,text0: {type: 't', value: texs[0]}//textureHandle
                    ,text1: {type: 't', value: texs[1]}
                    ,text2: {type: 't', value: texs[2]}
                    ,text3: {type: 't', value: texs[3]}
                    ,text4: {type: 't', value: texs[4]}
                    ,text5: {type: 't', value: texs[5]}
                    ,text6: {type: 't', value: texs[6]}
                    ,text7: {type: 't', value: texs[7]}
                    ,text8: {type: 't', value: texs[8]}
                    ,text9: {type: 't', value: texs[9]}
                    ,text10: {type: 't', value: texs[10]}//textureHandle
                    ,text11: {type: 't', value: texs[11]}
                    ,text12: {type: 't', value: texs[12]}
                    ,text13: {type: 't', value: texs[13]}
                    ,text14: {type: 't', value: texs[14]}
                    ,text15: {type: 't', value: texs[15]}

                    ,skeletonMatrix:{value: []}////骨骼25*16=400//骨骼矩阵//用于求不动位置的骨骼
                    ,skeletonData:{value:[] }//8个手臂骨骼的数据
                    ,time:{value: 0.0}
                },
                vertexShader: load("shader/vertexBone0.vert"),
                fragmentShader:load("shader/fragmentBone0.frag"),
                side: THREE.DoubleSide
            });

            var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
            loader.load("skeletonData.json", function(str)
            {
                var data0=JSON.parse(str).data;//768;

                /*for(var i=0;i<data0.length;i++){
                    var result0=encode(data0[i]);
                    var a0=result0[0]/255;
                    var b0=result0[1]/255;
                    data0[i]=decode(a0*255,b0*255);
                }*/
                material.uniforms.skeletonData={
                    "value":data0
                };

                /*var data1=[],data2=[];
                for(var i=0;i<768;i++){
                    var result=encode(data0[i]);
                    data1.push(result[0]);
                    data2.push(result[1]);
                    //console.log(data0[i],decode(result[0],result[1]))
                }
                console.log();
                //dataTexture
                var width = 1 , height = data0.length*2/3 ;
                var size=width * height;
                //var data = new Float32Array( data0.length*2);//new Uint8Array( data0.length*2);
                var data = new Uint8Array( data0.length*2);
                for(var i=0;i<data0.length;i++){
                    data[i]=data1[i];
                }
                for(var i=data0.length;i<data0.length*2;i++){
                    data[i]=data2[i-data0.length];
                }
                console.log("data0.length",data0.length);
                console.log(data1[0],data2[0],data0[0]);
                for(var i=0;i<data0.length;i++){
                    var a=data[i]/255;
                    var b=data[i+data0.length]/255;
                    console.log(Math.floor((decode(a*255,b*255)/data0[i])*100)+"%")
                }

                var dataTexture = new THREE.DataTexture(
                    data,
                    width,
                    height,
                    THREE.RGBFormat
                );
                console.log(
                    data,
                    width,
                    height,
                    THREE.RGBFormat
                );
                material.uniforms.dataTexture={
                    "value":dataTexture
                };*/
            });
            loader.load("skeletonMatrix.json", function(str)
            {
                material.uniforms.skeletonMatrix={
                    "value": JSON.parse(str).data
                };
            });
        }else{
            material = new THREE.RawShaderMaterial({//原始着色器材质
                uniforms: {
                    text0: {type: 't', value: texs[0]}//textureHandle
                    ,text1: {type: 't', value: texs[1]}
                    ,text2: {type: 't', value: texs[2]}
                    ,text3: {type: 't', value: texs[3]}
                    ,text4: {type: 't', value: texs[4]}
                    ,text5: {type: 't', value: texs[5]}
                    ,text6: {type: 't', value: texs[6]}
                    ,text7: {type: 't', value: texs[7]}
                    ,text8: {type: 't', value: texs[8]}
                    ,text9: {type: 't', value: texs[9]}
                    ,text10: {type: 't', value: texs[10]}//textureHandle
                    ,text11: {type: 't', value: texs[11]}
                    ,text12: {type: 't', value: texs[12]}
                    ,text13: {type: 't', value: texs[13]}
                    ,text14: {type: 't', value: texs[14]}
                    ,text15: {type: 't', value: texs[15]}
                },
                vertexShader: load("shader/vertex.vert"),
                fragmentShader: load("shader/fragment.frag"),
                side: THREE.DoubleSide
            });
        }

        this.mesh = new THREE.Mesh(geometry, material);//重要
        this.mesh.frustumCulled=false;

        if(this.haveSkeleton){
            this.handleSkeletonAnimation();
            for(i=0;i<this.originMeshs.length;i++){
                this.originMeshs[i].visible=false;
                this.obj.add(this.originMeshs[i]);//threeJS中模型的位置尺寸角度变化，似乎是通过骨骼来实现的
            }
        }

        this.obj.add(this.mesh);

        //完成进行实例化渲染
    }
    this.handleSkeletonAnimation=function(){
        var scope=this;//scope范围//为了避免this重名
        updateAnimation();
        function updateAnimation() {//每帧更新一次动画
            requestAnimationFrame(updateAnimation);
            scope.time=(scope.time+1.0)%60000;
            scope.mesh.material.uniforms.time={value: scope.time};
        }
    }

    this.updateBuffer=function(i){//更新第i个对象对应的缓冲区
        var pos=[
            this.mcol3.array[3*i  ],
            this.mcol3.array[3*i+1],
            this.mcol3.array[3*i+2]
        ];//记录位置
        this.dummy.scale.set(this.scales[i][0],this.scales[i][1],this.scales[i][2]);
        this.dummy.rotation.set(this.rotations[i][0],this.rotations[i][1],this.rotations[i][2]);
        this.dummy.updateMatrix();

        this.dummy.matrix.elements[12]=pos[0];
        this.dummy.matrix.elements[13]=pos[1];
        this.dummy.matrix.elements[14]=pos[2];//恢复位置
        this.setMatrix(i,this.dummy.matrix);
    }
    this.setMatrix=function (i,matrix){//获取实例化对象第i个成员的变换矩阵
        this.mcol0.array[3*i  ]=matrix.elements[0];
        this.mcol0.array[3*i+1]=matrix.elements[1];
        this.mcol0.array[3*i+2]=matrix.elements[2];

        this.mcol1.array[3*i  ]=matrix.elements[4];
        this.mcol1.array[3*i+1]=matrix.elements[5];
        this.mcol1.array[3*i+2]=matrix.elements[6];

        this.mcol2.array[3*i  ]=matrix.elements[8];
        this.mcol2.array[3*i+1]=matrix.elements[9];
        this.mcol2.array[3*i+2]=matrix.elements[10];

        this.mcol3.array[3*i  ]=matrix.elements[12];
        this.mcol3.array[3*i+1]=matrix.elements[13];
        this.mcol3.array[3*i+2]=matrix.elements[14];
    }
    this.getMatrix=function (i){//获取实例化对象第i个成员的变换矩阵
        var matrix=new THREE.Matrix4();
        matrix.set(
            this.mcol0.array[3*i  ],this.mcol1.array[3*i  ],this.mcol2.array[3*i  ],this.mcol3.array[3*i  ],
            this.mcol0.array[3*i+1],this.mcol1.array[3*i+1],this.mcol2.array[3*i+1],this.mcol3.array[3*i+1],
            this.mcol0.array[3*i+2],this.mcol1.array[3*i+2],this.mcol2.array[3*i+2],this.mcol3.array[3*i+2],
            0                      ,0                      ,0                      ,1
        );
        return matrix;
    }

    this.positionGet=function(i){
        return [this.mcol3.array[3*i],this.mcol3.array[3*i+1],this.mcol3.array[3*i+2]];
    }
    this.rotationGet=function(i){
        return this.rotations[i];
    }
    this.scaleGet=function(i){
        return this.scales[i];
    }

    this.positionSet=function (i,pos){
        this.mcol3.array[3*i  ]=pos[0];
        this.mcol3.array[3*i+1]=pos[1];
        this.mcol3.array[3*i+2]=pos[2];
    }
    this.rotationSet=function (i,rot){
        this.rotations[i][0]=rot[0];
        this.rotations[i][1]=rot[1];
        this.rotations[i][2]=rot[2];
        this.updateBuffer(i);
    }
    this.scaleSet=function(i,scale){
        this.scales[i][0]=scale[0];
        this.scales[i][1]=scale[1];
        this.scales[i][2]=scale[2];
        this.updateBuffer(i);
    }
    this.typeSet=function (i,type) {
        this.type.array[4*i  ]=type[0];
        this.type.array[4*i+1]=type[1];
        this.type.array[4*i+2]=type[2];
        this.type.array[4*i+3]=type[3];
    }
    this.colorSet=function (i,color) {
        this.colors.array[3*i  ]=color[0];
        this.colors.array[3*i+1]=color[1];
        this.colors.array[3*i+2]=color[2];
    }
    this.speedSet=function (i,speed) {//设置动画速度
        this.speed.array[i]=speed;
    }

    this.move=function (i,dPos){
        var pos=this.positionGet(i);
        this.positionSet(i,[pos[0]+dPos[0],pos[1]+dPos[1],pos[2]+dPos[2]]);
    }
    this.rotation=function (i,dRot){
        var rot=this.rotationGet(i);
        this.rotationSet(i,[rot[0]+dRot[0],rot[1]+dRot[1],rot[2]+dRot[2]]);
    }
}
function SkinnedMeshController() {
    var scope=this;
    this.mesh;
    this.animation;
    this.init=function (originMesh,animation) {
        this.animation=animation;
        this.mesh=originMesh.clone();//new THREE.SkinnedMesh(originMesh.geometry.clone(),originMesh.material)

        this.mesh.geometry=this.mesh.geometry.clone();
        this.mesh.material=this.mesh.material.clone();
        this.mesh.skeleton=this.mesh.skeleton.clone();
        this.mesh.matrixWorld=this.mesh.matrixWorld.clone();
        this.bones = [];
        cloneBones(this.mesh.skeleton.bones[0], this.bones);
        this.mesh.skeleton=new THREE.Skeleton(this.bones, this.mesh.skeleton.boneInverses);

        this.mesh.add(this.mesh.skeleton.bones[0]);//添加骨骼
        this.mesh.bind(this.mesh.skeleton,this.mesh.matrixWorld);//绑定骨架

        //搞清动画混合器AnimationMixer的作用至关重要
        //开始设置动画//进行这个动画设置的时候可能还只是一个基模
        var animationMixer0=new THREE.AnimationMixer(this.mesh);
        animationMixer0.clipAction(animation).play();//不清楚这里的作用


        //var t=0;
        //updateAnimation2_2();
        function updateAnimation3() {//每帧更新一次动画--失败
            t+=0.2;
            var time=Math.floor(t%36);

            //console.log(time);
            for(i=0;i<bones.length;i++) {
                //position
                x = animation.tracks[3 * i].values[3 * time];
                y = animation.tracks[3 * i].values[3 * time + 1];
                z = animation.tracks[3 * i].values[3 * time + 2];
                var m1 = new THREE.Matrix4();
                m1.set(
                    1, 0, 0, x,
                    0, 1, 0, y,
                    0, 0, 1, z,
                    0, 0, 0, 1
                );
                //var test=m1.clone();

                //Quaternion
                x = animation.tracks[3 * i + 1].values[4 * time];
                y = animation.tracks[3 * i + 1].values[4 * time + 1];
                z = animation.tracks[3 * i + 1].values[4 * time + 2];
                w = animation.tracks[3 * i + 1].values[4 * time + 3];
                var m2 = new THREE.Matrix4();
                m2.set(
                    1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w, 2 * x * z + 2 * y * w, 0,
                    2 * x * y + 2 * z * w, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w, 0,
                    2 * x * z - 2 * y * w, 2 * y * z + 2 * x * w, 1 - 2 * x * x - 2 * y * y, 0,
                    0, 0, 0, 1
                );
                //if(i===0)console.log(m2.elements[0])

                //scale
                x = animation.tracks[3 * i + 2].values[3 * time];
                y = animation.tracks[3 * i + 2].values[3 * time + 1];
                z = animation.tracks[3 * i + 2].values[3 * time + 2];
                var m3 = new THREE.Matrix4();
                m3.set(
                    x, 0, 0, 0,
                    0, y, 0, 0,
                    0, 0, z, 0,
                    0, 0, 0, 1
                );
                m1.multiply(m2.multiply(m3));
                //bones[i].matrix.copy(m1);
                for(j=0;j<16;j++){
                    bones[i].matrix.elements[j]=m1.elements[j]*50;
                    bones[i].matrixAutoUpdate=false;
                }
            }
            requestAnimationFrame(updateAnimation3);
        }
        function updateAnimation2_3() {//每帧更新一次动画
            t+=0.5;
            var time=Math.floor(t%36);
            for(i=0;i<bones.length;i++){
                bones[i].matrixAutoUpdate=false;
                bones[i].quaternion.copy(
                    new THREE.Quaternion(
                        animation.tracks[3*i+1].values[4*time],
                        animation.tracks[3*i+1].values[4*time+1],
                        animation.tracks[3*i+1].values[4*time+2],
                        animation.tracks[3*i+1].values[4*time+3]
                    )
                );
            }
            requestAnimationFrame(updateAnimation2_2);
        }
        function updateAnimation2_2() {//每帧更新一次动画--
            t+=0.5;//t=0;
            var time=Math.floor(t%36);
            scope.setTime(time);
            requestAnimationFrame(updateAnimation2_2);
        }
        function updateAnimation2_1() {//每帧更新一次动画
            t+=0.5;
            var time=Math.floor(t%36);

            for(i=0;i<bones.length;i++){
                bones[i].position.set(
                    animation.tracks[3*i].values[3*time],
                    animation.tracks[3*i].values[3*time+1],
                    animation.tracks[3*i].values[3*time+2]
                );
                bones[i].setRotationFromQuaternion(
                    new THREE.Quaternion(
                        animation.tracks[3*i+1].values[4*time],
                        animation.tracks[3*i+1].values[4*time+1],
                        animation.tracks[3*i+1].values[4*time+2],
                        animation.tracks[3*i+1].values[4*time+3]
                    )
                );
                bones[i].scale.set(
                    animation.tracks[3*i+2].values[3*time],
                    animation.tracks[3*i+2].values[3*time+1],
                    animation.tracks[3*i+2].values[3*time+2]
                );
                bones[i].matrix=compose(
                    bones[i].position, bones[i].quaternion, bones[i].scale
                );
                function compose( position, quaternion, scale ) {

                    //x,y,z,,w,sx,xy,xz,px,py,pz
                    const te = new THREE.Matrix4();

                    const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
                    const x2 = x + x,	y2 = y + y, z2 = z + z;
                    const xx = x * x2, xy = x * y2, xz = x * z2;
                    const yy = y * y2, yz = y * z2, zz = z * z2;
                    const wx = w * x2, wy = w * y2, wz = w * z2;

                    const sx = scale.x, sy = scale.y, sz = scale.z;

                    te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
                    te[ 1 ] = ( xy + wz ) * sx;
                    te[ 2 ] = ( xz - wy ) * sx;
                    te[ 3 ] = 0;

                    te[ 4 ] = ( xy - wz ) * sy;
                    te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
                    te[ 6 ] = ( yz + wx ) * sy;
                    te[ 7 ] = 0;

                    te[ 8 ] = ( xz + wy ) * sz;
                    te[ 9 ] = ( yz - wx ) * sz;
                    te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
                    te[ 11 ] = 0;

                    te[ 12 ] = position.x;
                    te[ 13 ] = position.y;
                    te[ 14 ] = position.z;
                    te[ 15 ] = 1;
                    return te;
                }
            }
            requestAnimationFrame(updateAnimation2_1);
        }
        function updateAnimation2() {//每帧更新一次动画
            t+=0.2;
            var time=Math.floor(t%36);

            for(i=0;i<bones.length;i++){
                bones[i].position.set(
                    animation.tracks[3*i].values[3*time],
                    animation.tracks[3*i].values[3*time+1],
                    animation.tracks[3*i].values[3*time+2]
                );
                bones[i].setRotationFromQuaternion(
                    new THREE.Quaternion(
                        animation.tracks[3*i+1].values[4*time],
                        animation.tracks[3*i+1].values[4*time+1],
                        animation.tracks[3*i+1].values[4*time+2],
                        animation.tracks[3*i+1].values[4*time+3]
                    )
                );
                bones[i].scale.set(
                    animation.tracks[3*i+2].values[3*time],
                    animation.tracks[3*i+2].values[3*time+1],
                    animation.tracks[3*i+2].values[3*time+2]
                );
                bones[i].updateMatrix();
            }
            requestAnimationFrame(updateAnimation2);
        }
        function updateAnimation() {//每帧更新一次动画
            animationMixer0.update(0.05);
            requestAnimationFrame(updateAnimation);
        }

        function cloneBones(rootBone , boneArray){//用于加载完gltf文件后的骨骼动画的处理
            var rootBoneClone=rootBone.clone();
            rootBoneClone.children.splice(0,rootBoneClone.children.length);
            boneArray.push(rootBoneClone);
            for (var i = 0 ; i < rootBone.children.length ; ++i)
                rootBoneClone.add(cloneBones(rootBone.children[i], boneArray));
            return rootBoneClone;
        }
    }
    this.setTime=function (time) {
        var animation=this.animation;
        var bones=this.bones;
        for(i=0;i<bones.length;i++){
            bones[i].matrixAutoUpdate=false;
            bones[i].matrix=scope.compose(
                animation.tracks[3*i+1].values[4*time],
                animation.tracks[3*i+1].values[4*time+1],
                animation.tracks[3*i+1].values[4*time+2],
                animation.tracks[3*i+1].values[4*time+3],

                animation.tracks[3*i+2].values[3*time],
                animation.tracks[3*i+2].values[3*time+1],
                animation.tracks[3*i+2].values[3*time+2],

                animation.tracks[3*i].values[3*time],
                animation.tracks[3*i].values[3*time+1],
                animation.tracks[3*i].values[3*time+2]
            );
        }
    }
    this.compose=function(x,y,z,w,sx,sy,sz,px,py,pz) {
        var x2 = x + x,	y2 = y + y, z2 = z + z;
        var xx = x * x2, xy = x * y2, xz = x * z2;
        var yy = y * y2, yz = y * z2, zz = z * z2;
        var wx = w * x2, wy = w * y2, wz = w * z2;
        te = new THREE.Matrix4();
        te.set(
            ( 1.0-( yy + zz ) ) * sx,( xy - wz ) * sy        ,( xz + wy ) * sz        ,px,
            ( xy + wz ) * sx        ,( 1.0-( xx + zz ) ) * sy,( yz - wx ) * sz        ,py,
            ( xz - wy ) * sx        ,( yz + wx ) * sy        ,( 1.0-( xx + yy ) ) * sz,pz,
            0.0                     ,0.0                     ,0.0                     ,1.0
        );
        return te;
    }
}