function InstancedGroup(instanceCount){
    this.obj=new THREE.Object3D();
    this.instanceCount=instanceCount;

    this.mesh=null;//实例化渲染对象的网格

    this.mcol0;//变换矩阵的一部分
    this.mcol1;
    this.mcol2;
    this.mcol3;
    this.scales=[];
    this.rotations=[];
    this.animationSpeed=0.05;

    this.dummy=new THREE.Object3D();//dummy仿制品//工具对象

    //this.instanceMatrix=null;
    this.init=function (originMesh,animations,texSrc){
        for(var i=0;i<this.instanceCount;i++){
            this.scales.push([1,1,1]);
            this.rotations.push([0,0,0]);
        }
        //const instanceCount =2*2;//10 0000//1089
        let texs_length=16;

        originMesh.geometry=originMesh.geometry.toNonIndexed();

        var geometry = new THREE.InstancedBufferGeometry();//console.log(geometry);
        geometry.instanceCount = this.instanceCount; // set so its initalized for dat.GUI, will be set in first draw otherwise
        geometry.setAttribute('position', originMesh.geometry.attributes.position);//Float32Array
        geometry.setAttribute('inUV',originMesh.geometry.attributes.uv);
        geometry.setAttribute('skinIndex',originMesh.geometry.attributes.skinIndex);
        geometry.setAttribute('skinWeight',originMesh.geometry.attributes.skinWeight);

        this.mcol0=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol1=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol2=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol3=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);

        var type=new THREE.InstancedBufferAttribute(new Uint16Array(this.instanceCount*3), 3);


        for(var i=0;i<this.instanceCount;i++){

                this.mcol0.setXYZ(i, 1,0,0);//随机长宽高
                this.mcol1.setXYZ(i, 0,1,0);//四元数、齐次坐标
                this.mcol2.setXYZ(i, 0,0,1);//mcol3.setXYZ(i, 0,0,0);

            /*this.mcol0.setXYZ(i, 1,0,0);//随机长宽高
            this.mcol1.setXYZ(i, 0,1,0);//四元数、齐次坐标
            this.mcol2.setXYZ(i, 0,0,1);//mcol3.setXYZ(i, 0,0,0);
        */
            this.mcol3.setXYZ(i, 0,0,0);//500*200//type.setX(i, 1.0);

                type.setXYZ(i, Math.floor(Math.random() * texs_length), Math.floor(Math.random() * texs_length),Math.floor(Math.random() * texs_length));
        }


        geometry.setAttribute('mcol0', this.mcol0);//四元数、齐次坐标
        geometry.setAttribute('mcol1', this.mcol1);
        geometry.setAttribute('mcol2', this.mcol2);
        geometry.setAttribute('mcol3', this.mcol3);

        geometry.setAttribute('type', type);

        let texs=[];
        for(i=0;i<texs_length;i++){
            texs.push( THREE.ImageUtils.loadTexture(texSrc[i]) ) ;
            texs[i].flipY=false;
            texs[i].wrapS = texs[i].wrapT = THREE.ClampToEdgeWrapping;
        }

        var skeletonData=[];//16*25//400
        for(i=0;i<originMesh.skeleton.boneInverses.length;i++){
            var temp1=originMesh.skeleton.boneInverses[i];//.toArray();
            var temp2=originMesh.skeleton.bones[i].matrix.clone();//.toArray();
            var temp=temp2.multiply(temp1);
            temp=temp.toArray();
            for(j=0;j<temp.length;j++)
                skeletonData.push(temp[j]);
        }
        //全是0矩阵

        //test10[0]=0.1;
        let material = new THREE.RawShaderMaterial({//原始着色器材质
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

                ,skeletonData:{value: skeletonData}
            },
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,
            side: THREE.DoubleSide
        });

        //开始设置骨骼
        geometry.setAttribute('skinIndex' ,originMesh.geometry.attributes.skinIndex);
        geometry.setAttribute('skinWeight',originMesh.geometry.attributes.skinWeight);
        //完成设置骨骼

        this.mesh = new THREE.Mesh(geometry, material);//重要
        this.mesh.position.set(10,0,0);
        this.mesh.rotation.set(Math.PI,0,0);
        this.mesh.frustumCulled=false;

        handleOriginMesh(originMesh,animations);
        function handleOriginMesh(myOriginMesh,myAnimations){
            myOriginMesh.add(myOriginMesh.skeleton.bones[0]);//添加骨骼
            myOriginMesh.bind(myOriginMesh.skeleton,myOriginMesh.matrixWorld);//绑定骨架

        }


        //开始设置动画//进行这个动画设置的时候可能还只是一个基模
        var animationMixer0=new THREE.AnimationMixer(originMesh);
        var myAnimationAction0=animationMixer0.clipAction(animations[0]);
        myAnimationAction0.play();
        var scope=this;//scope范围//为了避免this重名
        function updateAnimation() {//每帧更新一次动画

            animationMixer0.update( scope.animationSpeed );
            requestAnimationFrame(updateAnimation);

            skeletonData=[];//16*25//400
            for(i=0;i<originMesh.skeleton.boneInverses.length;i++){
                temp1=originMesh.skeleton.boneInverses[i];//.toArray();
                temp2=originMesh.skeleton.bones[i].matrixWorld.clone();//.toArray();
                temp=temp2.multiply(temp1);//逆矩阵在右
                temp=temp.toArray();
                for(j=0;j<temp.length;j++)
                    skeletonData.push(temp[j]);
            }
            scope.mesh.material.uniforms.skeletonData={value: skeletonData};

        }updateAnimation();

        originMesh.visible=false;
        this.obj.add(originMesh);//threeJS中模型的位置尺寸角度变化，似乎是通过骨骼来实现的
        this.obj.add(this.mesh);

        //完成进行实例化渲染
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
        this.mcol3.array[3*i+1]=-pos[1];
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

    this.move=function (i,dPos){
        var pos=this.positionGet(i);
        this.positionSet(i,[pos[0]+dPos[0],pos[1]+dPos[1],pos[2]+dPos[2]]);
    }
    this.rotation=function (i,dRot){
        var rot=this.rotationGet(i);
        this.rotationSet(i,[rot[0]+dRot[0],rot[1]+dRot[1],rot[2]+dRot[2]]);
    }
}
function MySkinnedMesh() {
    this.mesh;
    this.init=function (originMesh,animation) {

        //console.log(originMesh);
        this.mesh=originMesh.clone();//new THREE.SkinnedMesh(originMesh.geometry.clone(),originMesh.material)

        this.mesh.geometry=this.mesh.geometry.clone();
        this.mesh.material=this.mesh.material.clone();
        this.mesh.skeleton=this.mesh.skeleton.clone();
        this.mesh.matrixWorld=this.mesh.matrixWorld.clone();
        var bones = [];
        cloneBones(this.mesh.skeleton.bones[0], bones);
        this.mesh.skeleton=new THREE.Skeleton(bones, this.mesh.skeleton.boneInverses);

        //this.mesh.skeleton.bones[0]=this.mesh.skeleton.bones[0].clone();
        this.mesh.add(this.mesh.skeleton.bones[0]);//添加骨骼
        this.mesh.bind(this.mesh.skeleton,this.mesh.matrixWorld);//绑定骨架

        //开始设置动画//进行这个动画设置的时候可能还只是一个基模
        var animationMixer0=new THREE.AnimationMixer(this.mesh);
        var myAnimationAction0=animationMixer0.clipAction(animation);
        myAnimationAction0.play();

        function updateAnimation() {//每帧更新一次动画
            animationMixer0.update(0.1);
            requestAnimationFrame(updateAnimation);
        }updateAnimation();
        function cloneBones(rootBone, boneArray){//用于加载完gltf文件后的骨骼动画的处理
            var rootBoneClone=rootBone.clone();
            rootBoneClone.children.splice(0,rootBoneClone.children.length);
            boneArray.push(rootBoneClone);
            for (var i = 0 ; i < rootBone.children.length ; ++i)
                rootBoneClone.add(cloneBones(rootBone.children[i], boneArray));
            return rootBoneClone;
        }
    }
}