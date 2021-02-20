function SkinnedMeshController() {
    this.mesh;
    this.animation;
    this.frameMax;//帧数
    this.boneNum;//骨骼个数
    this.time;
    this.speed;

    this.animationMixer;//动画混合器
}
SkinnedMeshController.prototype={
    init:function (originMesh,animation) {
        this.animation=animation;
        this.mesh=originMesh.clone();//new THREE.SkinnedMesh(originMesh.geometry.clone(),originMesh.material)
        this.frameMax=this.animation.tracks[0].times.length;
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
    init2:function (originMesh,animation,scene) {
        console.log(originMesh);
        this.animation=animation;
        this.mesh=originMesh;//new THREE.SkinnedMesh(originMesh.geometry.clone(),originMesh.material)
        this.frameMax=this.animation.tracks[0].times.length;
        this.speed=0.5;
        this.time=0;

        this.bones = [];
        cloneBones(this.mesh.skeleton.bones[0], this.bones);
        this.mesh.skeleton=new THREE.Skeleton(this.bones, this.mesh.skeleton.boneInverses);

        this.mesh.add(this.mesh.skeleton.bones[0]);//添加骨骼
        this.mesh.matrixWorldNeedsUpdate=true;
        this.mesh.bind(this.mesh.skeleton,this.mesh.matrixWorld);//绑定骨架


        this.animationMixer=new THREE.AnimationMixer(scene);//搞清动画混合器AnimationMixer的作用至关重要
        this.animationMixer.clipAction(this.animation).play();//不清楚这里的作用//可能是进行帧的插值
        var scope=this;
        myPlay();
        function myPlay() {
            scope.animationMixer.update(scope.speed);
            requestAnimationFrame(myPlay);
        }
        function cloneBones(rootBone , boneArray){//用于加载完gltf文件后的骨骼动画的处理
            var rootBoneClone=rootBone.clone();
            rootBoneClone.children.splice(0,rootBoneClone.children.length);
            boneArray.push(rootBoneClone);
            for (var i = 0 ; i < rootBone.children.length ; ++i)
                rootBoneClone.add(cloneBones(rootBone.children[i], boneArray));
            return rootBoneClone;
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
    //帧动画
    autoPlay:function() {//每帧更新一次动画--
        this.time+=this.speed;//t=0;
        var time=Math.floor(this.time%this.frameMax);
        this.setTime(time);
        requestAnimationFrame(this.autoPlay);
    },
    //使用AnimationMixer
    autoPlay0:function () {
        var scope=this;
        this.animationMixer=new THREE.AnimationMixer(this.mesh);//搞清动画混合器AnimationMixer的作用至关重要
        this.animationMixer.clipAction(this.animation).play();//不清楚这里的作用//可能是进行帧的插值
        myPlay();
        function myPlay() {
            scope.animationMixer.update(scope.speed);
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
SkinnedMeshController.prototype.pmHandle=function (obj,animation) {
    this.animationMixer=new THREE.AnimationMixer(obj);//动画混合器animationMixer是用于场景中特定对象的动画的播放器
    this.animationMixer.clipAction(animation).play();//动画剪辑AnimationClip是一个可重用的关键帧轨道集，它代表动画。
    return this.animationMixer;
}