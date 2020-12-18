function InstancedGroup(instanceCount){
    this.obj=new THREE.Object3D();
    this.instanceCount=instanceCount;

    this.mesh=null;//实例化渲染对象的网格

    this.mcol0;//变换矩阵的一部分
    this.mcol1;
    this.mcol2;
    this.mcol3;

    this.dummy=new THREE.Object3D();//dummy仿制品//工具对象

    //this.instanceMatrix=null;
    this.init=function (originMesh,animations){
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

        /*for(var k=0,kl=2,il=this.instanceCount ,i=0;k<kl&&i<il;k++)
            for(var b=0,bl=2;b<bl&&i<il;b++,i++){

                this.mcol0.setXYZ(i, Math.random()/2+0.75,0,0);//随机长宽高
                this.mcol1.setXYZ(i, 0,Math.random()/2+0.75,0);//四元数、齐次坐标
                this.mcol2.setXYZ(i, 0,0,Math.random()/2+0.75);//mcol3.setXYZ(i, 0,0,0);
                this.mcol3.setXYZ(i, k-kl/2,b-bl/2,0);//500*200//type.setX(i, 1.0);
                this.mcol3.setXYZ(i, k-kl/2,b-bl/2,0);

                type.setXYZ(i, Math.floor(Math.random() * texs_length), Math.floor(Math.random() * texs_length),Math.floor(Math.random() * texs_length));
            }*/
        for(var i=0;i<this.instanceCount;i++){
                this.mcol0.setXYZ(i, 1,0,0);//随机长宽高
                this.mcol1.setXYZ(i, 0,1,0);//四元数、齐次坐标
                this.mcol2.setXYZ(i, 0,0,1);//mcol3.setXYZ(i, 0,0,0);
                this.mcol3.setXYZ(i, 0,0,0);//500*200//type.setX(i, 1.0);
                type.setXYZ(i, Math.floor(Math.random() * texs_length), Math.floor(Math.random() * texs_length),Math.floor(Math.random() * texs_length));
        }


        geometry.addAttribute('mcol0', this.mcol0);//四元数、齐次坐标
        geometry.addAttribute('mcol1', this.mcol1);
        geometry.addAttribute('mcol2', this.mcol2);
        geometry.addAttribute('mcol3', this.mcol3);

        geometry.addAttribute('type', type);

        let texs=[];
        for(i=0;i<texs_length;i++){
            texs.push( THREE.ImageUtils.loadTexture('texture/'+i+'.jpg') ) ;
            texs[i].flipY=false;
            texs[i].wrapS = texs[i].wrapT = THREE.ClampToEdgeWrapping;
        }

        var skeletonData=[];//16*25//400
        for(i=0;i<originMesh.skeleton.boneInverses.length;i++){
            var temp1=originMesh.skeleton.boneInverses[i].clone();//.toArray();
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
        geometry.addAttribute('skinIndex' ,originMesh.geometry.attributes.skinIndex);
        geometry.addAttribute('skinWeight',originMesh.geometry.attributes.skinWeight);
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
        function test12() {

            animationMixer0.update( 0.05 );
            requestAnimationFrame(test12);

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

        }test12();
        //完成设置动画

        originMesh.scale.set(0.01,0.01,0.01);

        this.obj.add(originMesh);
        this.obj.add(this.mesh);
        //this.positionSet(1,[1,0,0])
        //完成进行实例化渲染
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
    this.move=function (i,dPos){//第几个对象，位置数组【x,y,z】
        this.dummy.applyMatrix(this.getMatrix(i));
        this.dummy.position.set(dPos[0],dPos[1],dPos[2]);
        this.dummy.updateMatrix();
        this.setMatrix(i,this.dummy.matrix);
    }
    this.positionSet=function (i,pos){
        this.dummy.applyMatrix(this.getMatrix(i));
        this.dummy.position.set(
            pos[0],
            pos[1],
            pos[2]);
        this.dummy.updateMatrix();
        this.setMatrix(i,this.dummy.matrix);
    }
    this.rotationSet=function (i,rot){
        this.dummy.applyMatrix(this.getMatrix(i));
        this.dummy.rotation.set(
            rot[0],
            rot[1],
            rot[2]);
        this.dummy.updateMatrix();
        this.setMatrix(i,this.dummy.matrix);
    }
    this.scaleSet=function (i,size){
        this.dummy.applyMatrix(this.getMatrix(i));
        this.dummy.scale.set(
            size[0],
            size[1],
            size[2]);
        this.dummy.updateMatrix();
        this.setMatrix(i,this.dummy.matrix);
    }
}