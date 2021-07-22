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
        //console.log(originMesh);
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
        //this.autoPlay0();
        function cloneBones(rootBone , boneArray){//用于加载完gltf文件后的骨骼动画的处理
            var rootBoneClone=rootBone.clone();
            rootBoneClone.children.splice(0,rootBoneClone.children.length);
            boneArray.push(rootBoneClone);
            for (var i = 0 ; i < rootBone.children.length ; ++i)
                rootBoneClone.add(cloneBones(rootBone.children[i], boneArray));
            return rootBoneClone;
        }
        var scope=this;
        loop();
        function loop() {
            scope.computeIntermediateFrame(scope.animation);
            requestAnimationFrame(loop);
        }
    },
    //帧动画
    autoPlay2:function(){
        var scope=this;
        var frameIndex=0;

        updateAnimation();//
        function updateAnimation() {//每帧更新一次动画
            if(frameIndex>=35)scope.setTime(70-frameIndex);
            else scope.setTime(frameIndex);
            frameIndex++;
            if(frameIndex===70)frameIndex=0;
            requestAnimationFrame(updateAnimation);
        }
    },
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

    //保存下载骨骼动画的代码
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
    computeIntermediateFrame:function (animation) {
        for(var i=0;i<25;i++){//25个骨头
            var position=animation.tracks[3*i].values;
            var quaternion=animation.tracks[3*i+1].values;
            for(var time=1;time<=34;time++){
                position[3*time  ]=get(time,position[0],position[3*35  ]);
                position[3*time+1]=get(time,position[1],position[3*35+1]);
                position[3*time+2]=get(time,position[2],position[3*35+2]);

                quaternion[4*time  ]=get(time,quaternion[0],quaternion[4*35  ]);
                quaternion[4*time+1]=get(time,quaternion[1],quaternion[4*35+1]);
                quaternion[4*time+2]=get(time,quaternion[2],quaternion[4*35+2]);
                quaternion[4*time+3]=get(time,quaternion[3],quaternion[4*35+3]);
            }
        }
        function get(k,begin,end) {
            var k_max=35;
            return (k/k_max)*(end-begin)+begin;
        }
        return animation;
    },
    //下载为gltf格式
    download:function (animation) {
        var scene=new THREE.Scene();
        scene.add(this.mesh);
        console.log(this.mesh.material.map)
        console.log(this.mesh.material.map.image)
        animation=this.computeIntermediateFrame(animation);
        var gltfExporter = new THREE.GLTFExporter();
        gltfExporter.parse(scene, function (result) {
            var name="test.gltf";
            let link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.href = URL.createObjectURL(new Blob([JSON.stringify(result)], { type: 'text/plain' }));
            link.download = name;
            link.click();
        },{animations: [animation]});
    },
    //下载为json格式
    download2:function (animation) {
        console.log(animation);

        var datas=[];

        for(var time=0;time<36;time++)
            for(var boneIndex=0;boneIndex<25;boneIndex++){
                var pos=animation.tracks[3*boneIndex];
                var qua=animation.tracks[3*boneIndex+1];
                //var pos=animation.tracks[3*boneIndex+2];
                //console.log(time,qua.values[time*4]);
                datas.push([
                    boneIndex,
                    time,
                    pos.values[time*3],
                    pos.values[time*3+1],
                    pos.values[time*3+2],
                    qua.values[time*4],
                    qua.values[time*4+1],
                    qua.values[time*4+2],
                    qua.values[time*4+3]
                ]);
            }

        computeArmData(
            this.mesh,
            this.animation,
            function (data) {
                //console.log("数组的长度为：",data.length);

                let link = document.createElement('a');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.href = URL.createObjectURL(new Blob([JSON.stringify({data:data})], { type: 'text/plain' }));
                link.download = "animationData.json";
                link.click();

            }
        );
    },
    //将整个动画数据下载为json格式
    download3:function (animation) {
        console.log(animation);

        var datas=[];

        for(var time=0;time<36;time++)
            for(var boneIndex=0;boneIndex<25;boneIndex++){
                var pos=animation.tracks[3*boneIndex];
                var qua=animation.tracks[3*boneIndex+1];
                //var pos=animation.tracks[3*boneIndex+2];
                //console.log(time,qua.values[time*4]);
                datas.push([
                    boneIndex,
                    time,
                    pos.values[time*3],
                    pos.values[time*3+1],
                    pos.values[time*3+2],
                    qua.values[time*4],
                    qua.values[time*4+1],
                    qua.values[time*4+2],
                    qua.values[time*4+3]
                ]);
            }

        computeAllData(
            this.mesh,
            this.animation,
            function (data) {
                //console.log("数组的长度为：",data.length);

                let link = document.createElement('a');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.href = URL.createObjectURL(new Blob([JSON.stringify({data:data})], { type: 'text/plain' }));
                link.download = "animationData.json";
                link.click();

            }
        );
    },
    //计算shader中所需的数据
    computeShaderData:function (glb,group) {
        var animation=this.animation;
        //console.log(animation);

        var datas=[];

        for(var time=0;time<36;time++)
            for(var boneIndex=0;boneIndex<25;boneIndex++){
                var pos=animation.tracks[3*boneIndex];
                var qua=animation.tracks[3*boneIndex+1];
                //var pos=animation.tracks[3*boneIndex+2];
                datas.push([
                    boneIndex,
                    time,
                    pos.values[time*3],
                    pos.values[time*3+1],
                    pos.values[time*3+2],
                    qua.values[time*4],
                    qua.values[time*4+1],
                    qua.values[time*4+2],
                    qua.values[time*4+3]
                ]);
            }
        //datas
        computeArmData(
            this.mesh,
            this.animation,
            function (data) {
                group.updateAnimationData5(data);
            }
        );


    },
}
