function SkinnedMeshController() {
    this.mesh;
    this.animation;
    this.frameMax;//帧数
    this.boneNum;//骨骼个数
    this.time;
    this.speed;
}
SkinnedMeshController.prototype={
    init:function (originMesh,animation) {
        this.animation=animation;
        this.mesh=originMesh.clone();//new THREE.SkinnedMesh(originMesh.geometry.clone(),originMesh.material)
        //return;
        this.frameMax=this.animation.tracks[0].times.length;
        //this.boneNum=;
        this.speed=0.5;
        this.time=0;

        this.mesh.geometry=this.mesh.geometry.clone();
        this.mesh.material=this.mesh.material.clone();
        this.mesh.skeleton=this.mesh.skeleton.clone();
        this.mesh.matrixWorld=this.mesh.matrixWorld.clone();
        this.bones = [];
        cloneBones(this.mesh.skeleton.bones[0], this.bones);
        this.mesh.skeleton=new THREE.Skeleton(this.bones, this.mesh.skeleton.boneInverses);

        this.mesh.add(this.mesh.skeleton.bones[0]);//添加骨骼
        this.mesh.bind(this.mesh.skeleton,this.mesh.matrixWorld);//绑定骨架

        //this.autoTest();
        this.autoPlay0();
        function cloneBones(rootBone , boneArray){//用于加载完gltf文件后的骨骼动画的处理
            var rootBoneClone=rootBone.clone();
            rootBoneClone.children.splice(0,rootBoneClone.children.length);
            boneArray.push(rootBoneClone);
            for (var i = 0 ; i < rootBone.children.length ; ++i)
                rootBoneClone.add(cloneBones(rootBone.children[i], boneArray));
            return rootBoneClone;
        }

        function updateAnimation3() {//每帧更新一次动画--失败
            t+=0.2;
            var time=Math.floor(t%36);

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
            t+=scope.speed;//t=0;
            var time=Math.floor(t%scope.frameMax);
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
    },
    autoTest:function(){
        var scope=this;
        myPlay();
        function myPlay() {
            scope.setTime(0);
            requestAnimationFrame(myPlay);
        }

        //for(var k=0;k<this.animation.tracks.length;k+=3){
        //Shoulder  肩膀
        //Arm
        //ForeArm  前臂
        //Hand
        for(var k=7*3;k<=10*3;k+=3){
            //mixamo
            var str=this.animation.tracks[k].name;
            str=str.replace('mixamo', '');
            str=str.replace('.position', '');
        }

        var i=7;
        var time=0;
        //new ParamMeasure(this.animation,2);
    },
    autoPlay:function() {//每帧更新一次动画--
        scope.time+=scope.speed;//t=0;
        var time=Math.floor(scope.time%scope.frameMax);
        scope.setTime(time);
        requestAnimationFrame(scope.autoPlay);
    },
    autoPlay0:function () {
        var scope=this;
        var animationMixer=new THREE.AnimationMixer(this.mesh);//搞清动画混合器AnimationMixer的作用至关重要
        animationMixer.clipAction(this.animation).play();//不清楚这里的作用//可能是进行帧的插值
        myPlay();
        function myPlay() {
            animationMixer.update(scope.speed);
            requestAnimationFrame(myPlay);
        }
    },
    setTime:function (time) {
        var animation=this.animation;
        var bones=this.bones;
        for(i=0;i<bones.length;i++){
            bones[i].matrixAutoUpdate=false;
            bones[i].matrix=this.compose(
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
    },
    compose:function(x,y,z,w,sx,sy,sz,px,py,pz) {
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
    },
}
//以下代码用于项目性能的分析
/*
function InstancedGroup2(instanceCount,originMesh,animationClip ){
    //若有骨骼，则需要源mesh是skinnedMesh
    this.obj=new THREE.Object3D();
    this.instanceCount=instanceCount;

    //记录有无骨骼动画
    this.haveSkeleton = !(typeof (animationClip) == "undefined" || animationClip === false);
    this.originMeshs=originMesh;//这是一个数组，每个元素播放一种动画
    this.animationClip=animationClip;
    this.obj=new THREE.Object3D();//实例化渲染对象的网格
    this.meshs=[];

    this.speed;
    this.mcol0;//变换矩阵的一部分
    this.mcol1;
    this.mcol2;
    this.mcol3;
    this.type;
    this.colors;
    this.texSrc;

    this.time=0;//每帧自动加1，加到一定值之后自动归0

    this.dummy=new THREE.Object3D();//dummy仿制品//工具对象
}
InstancedGroup2.prototype={

    init:function (texSrc){//纹理贴图资源路径，贴图中包含纹理的个数
        this.texSrc=texSrc;
        for(var i=0;i<this.instanceCount;i++){
            var controller=new SkinnedMeshController();
            controller.init(this.originMeshs[0],this.animationClip);
            var mesh=controller.mesh;
            this.meshs.push(mesh);
            this.obj.add(mesh);
        }
        //this.meshs[0].position.set(10,0,0);
        //console.log(this.meshs);
        //完成进行实例化渲染
    },
    handleSkeletonAnimation:function(){
        var scope=this;
        //var scope=this;//scope范围//为了避免this重名
        updateAnimation();
        function updateAnimation() {//每帧更新一次动画
            requestAnimationFrame(updateAnimation);
            scope.time=(scope.time+1.0)%60000;
            scope.mesh.material.uniforms.time={value: scope.time};
        }
    },

    setMatrix:function (i,matrix){//获取实例化对象第i个成员的变换矩阵
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
    },
    getMatrix:function (i){//获取实例化对象第i个成员的变换矩阵
        var matrix=new THREE.Matrix4();
        matrix.set(
            this.mcol0.array[3*i  ],this.mcol1.array[3*i  ],this.mcol2.array[3*i  ],this.mcol3.array[3*i  ],
            this.mcol0.array[3*i+1],this.mcol1.array[3*i+1],this.mcol2.array[3*i+1],this.mcol3.array[3*i+1],
            this.mcol0.array[3*i+2],this.mcol1.array[3*i+2],this.mcol2.array[3*i+2],this.mcol3.array[3*i+2],
            0                      ,0                      ,0                      ,1
        );
        return matrix;
    },

    positionSet:function (i,pos){
        this.meshs[i].position.set(pos[0],pos[1],pos[2]);
    },
    rotationSet:function (i,rot){
        this.meshs[i].rotation.set(rot[0],rot[1],rot[2]);
    },
    scaleSet:function(i,size){
        this.meshs[i].scale.set(size[0],size[1],size[2]);
    },
    typeSet:function (i,type) {//设置贴图和动画类型
        this.type.array[4*i  ]=type[0];
        this.type.array[4*i+1]=type[1];
        this.type.array[4*i+2]=type[2];
        this.type.array[4*i+3]=type[3];//动画类型 0,1
    },
    textureSet: function (i, type) {//设置贴图和动画类型
        var material=THREE.ImageUtils.loadTexture(this.texSrc[type]);
        material.flipY=false;
        material.wrapS = material.wrapT = THREE.ClampToEdgeWrapping;
        this.meshs[i].material.map=material;
    },
    animationSet:function(i,animationType){
        this.type.array[4*i+3]=animationType;//动画类型 0,1
    },
    colorSet:function (i,color) {
        this.colors.array[3*i  ]=color[0];
        this.colors.array[3*i+1]=color[1];
        this.colors.array[3*i+2]=color[2];
    },
    speedSet:function (i,speed) {//设置动画速度
        this.speed.array[i]=speed;
    },

}
*/