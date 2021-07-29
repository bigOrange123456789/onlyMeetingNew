function InstancedGroup(instanceCount,originMesh,animationClip,crowdData_json){
    //若有骨骼，则需要源mesh是skinnedMesh
    this.obj=new THREE.Object3D();
    this.instanceCount=instanceCount;
    this.crowdData_json=crowdData_json;

    //记录有无骨骼动画
    this.haveSkeleton = !(typeof (animationClip) == "undefined" || animationClip === false);
    this.originMeshs=originMesh;//这是一个数组，每个元素播放一种动画
    //this.animationClip=animationClip;
    this.mesh=null;//实例化渲染对象的网格

    this.finishFunction;

    this.speed;
    this.mcol0;//变换矩阵的一部分
    this.mcol1;
    this.mcol2;
    this.mcol3;
    this.type;
    this.colors;
    this.bonesWidth;

    this.time=0;//每帧自动加1，加到一定值之后自动归0

    this.dummy=new THREE.Object3D();//dummy仿制品//工具对象

    //shader地址
    this.vertURL;
    this.fragURL;

    //以下参数用于将模型划分为头、上身、下身三部分
    this.neckPosition;
}
InstancedGroup.prototype={
    updateGeometry:function(mesh){//用于和PM技术相结合
        var position=mesh.geometry.attributes.position,//网格
            uv=mesh.geometry.attributes.uv,//贴图
            skinIndex=mesh.geometry.attributes.skinIndex,//骨骼
            normal=mesh.geometry.attributes.normal;//法线
            //skinWeight=mesh.geometry.attributes.skinWeight;
        //position.array[3*440]+=0.1;
        this.mesh.geometry.setAttribute('position', position);
        this.mesh.geometry.setAttribute('inUV',uv);
        this.mesh.geometry.setAttribute('skinIndex',skinIndex);
        this.mesh.geometry.setAttribute('normal',normal);
        //this.mesh.geometry.setAttribute('skinWeight',skinWeight);
    },
    initGeometry:function(geometryNew){
        var geometryTemp= new THREE.InstancedBufferGeometry();
        geometryTemp.instanceCount = this.instanceCount;
        geometryTemp.setAttribute('position', geometryNew.attributes.position);//Float32Array
        geometryTemp.setAttribute('inUV',geometryNew.attributes.uv);
        geometryTemp.setAttribute('normal',geometryNew.attributes.normal);
        if(this.haveSkeleton){
            //console.log(geometryNew.attributes);//skinWeight
            geometryTemp.setAttribute('skinIndex',geometryNew.attributes.skinIndex);
            geometryTemp.setAttribute('skinWeight',geometryNew.attributes.skinWeight);
        }

        geometryTemp.setAttribute('speed', this.speed);

        geometryTemp.setAttribute('mcol0', this.mcol0);//四元数、齐次坐标
        geometryTemp.setAttribute('mcol1', this.mcol1);
        geometryTemp.setAttribute('mcol2', this.mcol2);
        geometryTemp.setAttribute('mcol3', this.mcol3);

        geometryTemp.setAttribute('type', this.type);
        geometryTemp.setAttribute('color', this.colors);
        geometryTemp.setAttribute('bonesWidth', this.bonesWidth);


        if(this.mesh)this.mesh.geometry=geometryTemp;
        return geometryTemp;
    },
    initMaterial:function(uniforms,texSrc,textNum,colors,texFlipY,finishFunction,camera){
        var canvas=new CanvasControl(textNum,1,colors,texFlipY);//绘制合并纹理贴图的地方
        uniforms.text0={type: 't', value: canvas.getTex()};

        let material = new THREE.RawShaderMaterial();//原始着色器材质//raw未经加工的
        material.side=THREE.DoubleSide;
        material.uniforms= uniforms;

        if(typeof(texSrc[0])==="string")setText0(0);//loadNextMap(0);//setText0();//传入资源地址
        else material.uniforms.text0={value:texSrc[0]};//传入map类型

        return material;

        function setText0(tex_i){
            var myText0= THREE.ImageUtils.loadTexture(texSrc[tex_i],null,function () {
                myText0.flipY=texFlipY;
                myText0.wrapS = myText0.wrapT = THREE.ClampToEdgeWrapping;
                material.uniforms.text0={value: myText0};
                if(tex_i<texSrc.length-1) setText0(tex_i+1);
                else if(finishFunction)finishFunction();
            });
        }
    },
    initAnimation:function(uniforms,camera){
        var scope=this;

        function updateAnimation() {//每帧更新一次动画
            requestAnimationFrame(updateAnimation);
            scope.time=(scope.time+1.0)%60000;

            uniforms.time={value: scope.time};
            //console.log(scope.time,uniforms.cameraX.value)
            uniforms.cameraX={value: camera.position.x};
            uniforms.cameraY={value: camera.position.y};
            uniforms.cameraZ={value: camera.position.z};
        }

        uniforms.time={value: 0.0};
        uniforms.cameraX={value: camera.position.x};
        uniforms.cameraY={value: camera.position.y};
        uniforms.cameraZ={value: camera.position.z};
        uniforms.animationData={type: 't', value:[]};updateAnimation();
        uniforms.animationDataLength={value:0};
        this.animationData=[];
        this.animationConfig=[];
        var animationDataLength=0;

        this.animationConfig=this.crowdData_json.config;
        for(i=0;i<scope.animationConfig.length;i++){
            animationDataLength+=this.animationConfig[i];
            this.animationData= this.animationData.concat(this.crowdData_json.animation[i]);
        }
        uniforms.animationDataLength={value:animationDataLength};
        uniforms.animationData=getTex(this.animationData);


        function getTex(arr) {//(str) {
            //var data0=JSON.parse(str).data;//204
            var data = new Float32Array( arr.length);//1944
            var width = 1 , height = data.length/3 ;//648
            data.set(arr)//for(var i=0;i<data.length;i++)data[i]=arr[i];//972
            var tex=new THREE.DataTexture(data, width, height, THREE.RGBFormat,THREE.FloatType);
            return {"value":tex};
        }
    },
    init:function (texSrc,textNum,colors,texFlipY,finishFunction,camera){//纹理贴图资源路径，贴图中包含纹理的个数
        if(typeof(textNum)=="undefined")textNum=16;
        if(typeof(texFlipY)=="undefined")texFlipY=true;
        this.originMeshs[0].geometry=this.originMeshs[0].geometry.toNonIndexed();

        //InstancedBufferAttribute为每个对象一组数据：先生成空间，再设置数据
        this.speed=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 1), 1);
        this.mcol0=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol1=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol2=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol3=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.type=new THREE.InstancedBufferAttribute(new Uint16Array(this.instanceCount*4), 4);//头部、上衣、裤子、动作
        this.colors=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount*3), 3);
        this.bonesWidth=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount*4), 4);

        for(i=0;i<this.instanceCount;i++){
            this.mcol0.setXYZ(i, 1,0,0);//随机长宽高
            this.mcol1.setXYZ(i, 0,1,0);//四元数、齐次坐标
            this.mcol2.setXYZ(i, 0,0,1);//mcol3.setXYZ(i, 0,0,0);

            this.type.setXYZW(i,
                Math.floor(Math.random() * textNum),
                Math.floor(Math.random() * textNum),
                Math.floor(Math.random() * textNum),
                Math.floor(Math.random() *2)//Math.random()//这个缓冲区是int类型的//所以这里不能传小数
            );

            this.boneWidthSet(i,0,Math.random()/2-0.25);
            this.boneWidthSet(i,1,Math.random()+0.5);//头部
            this.boneWidthSet(i,3,Math.random()/2-0.25);
        }

        var uniforms={
            textNum:{value: textNum},
            neckPosition:{value: (this.neckPosition===undefined)?0.59:this.neckPosition}
        };
        if(this.haveSkeleton)this.initAnimation(uniforms,camera);

        var material=this.initMaterial(uniforms,texSrc,textNum,colors,texFlipY,finishFunction,camera);
        if(this.vertURL===undefined)this.vertURL=this.haveSkeleton?"shader/vertexBone.vert":"shader/vertex.vert";
        if(this.fragURL===undefined)this.fragURL="shader/fragment.frag";
        material.vertexShader=load(this.vertURL);
        material.fragmentShader=load(this.fragURL);
        function load(name) {
            let xhr = new XMLHttpRequest(),
                okStatus = document.location.protocol === "file:" ? 0 : 200;
            xhr.open('GET', name, false);
            xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
            xhr.send(null);
            return xhr.status === okStatus ? xhr.responseText : null;
        }

        this.mesh = new THREE.Mesh(
            this.initGeometry(this.originMeshs[0].geometry),
            material
        );
        console.log(this.mesh);
        this.mesh.frustumCulled=false;
        this.obj.add(this.mesh);
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

    positionGet:function(i){
        return [this.mcol3.array[3*i],this.mcol3.array[3*i+1],this.mcol3.array[3*i+2]];
    },
    rotationGet:function(i){
        var mat4=this.getMatrix(i);
        var position=new THREE.Vector3();
        var quaternion=new THREE.Quaternion();
        var scale=new THREE.Vector3();
        mat4.decompose(position,quaternion,scale);
        var euler=new THREE.Euler(0,0,0, 'XYZ');
        euler.setFromQuaternion(quaternion);
        return [euler.x,euler.y,euler.z];
    },
    scaleGet:function(i){
        var mat4=this.getMatrix(i);
        var position=new THREE.Vector3();
        var quaternion=new THREE.Quaternion();
        var scale=new THREE.Vector3();
        mat4.decompose(position,quaternion,scale);
        return [scale.x,scale.y,scale.z];
    },

    positionSet:function (i,pos){//.instanceMatrix.needsUpdate=true;
        this.mcol3.needsUpdate=true;
        this.mcol3.array[3*i  ]=pos[0];
        this.mcol3.array[3*i+1]=pos[1];
        this.mcol3.array[3*i+2]=pos[2];
    },
    rotationSet:function (i,rot){
        this.mcol0.needsUpdate=true;
        this.mcol1.needsUpdate=true;
        this.mcol2.needsUpdate=true;
        var mat4=this.getMatrix(i);
        var position=new THREE.Vector3();
        var quaternion=new THREE.Quaternion();
        var scale=new THREE.Vector3();
        mat4.decompose(position,quaternion,scale);

        this.dummy.scale.set(scale.x,scale.y,scale.z);
        this.dummy.rotation.set(rot[0],rot[1],rot[2]);
        this.dummy.position.set(position.x,position.y,position.z);
        this.dummy.updateMatrix();

        this.setMatrix(i,this.dummy.matrix);
    },
    scaleSet:function(i,size){
        var mat4=this.getMatrix(i);
        var position=new THREE.Vector3();
        var quaternion=new THREE.Quaternion();
        var scale=new THREE.Vector3();
        mat4.decompose(position,quaternion,scale);
        var euler=new THREE.Euler(0,0,0, 'XYZ');
        euler.setFromQuaternion(quaternion);

        this.dummy.scale.set(size[0],size[1],size[2]);
        this.dummy.rotation.set(euler.x,euler.y,euler.z);
        this.dummy.position.set(position.x,position.y,position.z);
        this.dummy.updateMatrix();

        this.setMatrix(i,this.dummy.matrix);
    },
    typeSet:function (i,type) {//设置贴图和动画类型
        this.type.array[4*i  ]=type[0];
        this.type.array[4*i+1]=type[1];
        this.type.array[4*i+2]=type[2];
        this.type.array[4*i+3]=type[3];//动画类型 0,1
    },
    textureSet: function (i, type) {//设置贴图和动画类型
        this.type.array[4 * i] = type[0];
        this.type.array[4 * i + 1] = type[1];
        this.type.array[4 * i + 2] = type[2];
    },
    textureSet0: function (i, type) {//头部贴图
        this.type.array[4 * i] = type;//设置贴图
    },
    textureSet1: function (i, type) {//设置上身贴图
        this.type.array[4 * i+ 1] = type;//设置贴图
    },
    animationSet:function(i,animationType){
        this.type.array[4*i+3]=animationType;//动画类型 0,1
    },
    colorSet:function (i,color) {
        this.colors.array[3*i  ]=color[0];
        this.colors.array[3*i+1]=color[1];
        this.colors.array[3*i+2]=color[2];
    },
    boneWidthSet:function (avatarIndex,regionIndex,width) {
        this.bonesWidth.array[4*avatarIndex+regionIndex]=width;
    },
    speedSet:function (i,speed) {//设置动画速度
        this.speed.array[i]=speed;
    },

    move:function (i,dPos){
        var pos=this.positionGet(i);
        this.positionSet(i,[pos[0]+dPos[0],pos[1]+dPos[1],pos[2]+dPos[2]]);
    },
    rotation:function (i,dRot){
        var rot=this.rotationGet(i);
        this.rotationSet(i,[rot[0]+dRot[0],rot[1]+dRot[1],rot[2]+dRot[2]]);
    },
}
function CanvasControl(n,h,colors,flipY) {
    this.canvas;
    this.context;
    this.flipY;
    this.w;
    this.h;
    this.init(n,h,colors,flipY);
}
CanvasControl.prototype={
    init:function (n,h,colors,flipY) {
        this.flipY=typeof(flipY)=="undefined"?true:flipY;
        this.h=h;
        this.w=h*n;
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.context = this.canvas.getContext("2d");

        for(var i=0;i<n;i++)
            this.drawColor(colors[i],i);
    },
    drawColor:function(color,k){
        this.context.fillStyle = color;//"#FFFF00";
        this.context.fillRect(k*this.h,0,this.h,this.h);
    },
    drawImg:function(src,k,myOnload){
        var scope=this;
        var myImage = new Image();
        myImage.src = src;   //你自己本地的图片或者在线图片
        myImage.crossOrigin = 'Anonymous';
        myImage.onload = function(){//pos[0],pos[1]是落笔的起始位置，pos[2],pos[3]是落笔区域的大小
            myImage.width=scope.h;
            myImage.height=scope.h;
            scope.context.drawImage(myImage , k*scope.h,0,scope.h,scope.h);
            if(typeof (myOnload)!="undefined")myOnload(scope.getTex());
        }
    },
    getTex:function () {
        var texture=new THREE.CanvasTexture(this.canvas);
        texture.flipY=this.flipY;
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        return texture;
    },
    download:function (name) {//将画布的内容保存为图片
        let url = this.canvas.toDataURL("image/jpeg");
        //let url = this.canvas.toDataURL("image/png"); //得到图片的base64编码数据
        //console.log(url);
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
    },
}
