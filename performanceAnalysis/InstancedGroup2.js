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
        //this.type.array[4*i+3]=animationType;//动画类型 0,1
    },
    colorSet:function (i,color) {
        this.colors.array[3*i  ]=color[0];
        this.colors.array[3*i+1]=color[1];
        this.colors.array[3*i+2]=color[2];
    },
    speedSet:function (i,speed) {//设置动画速度
        //this.speed.array[i]=speed;
    },

}