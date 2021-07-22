//位移产生的原因，像跑步之类的动画，整体有位移
function AnimationProcessor(animation,mesh){
    this.animation=animation;
    this.boneInverses;
    this.stepPosition=1;//
    this.stepRotation=1;
    this.boneIndex=7;
    this.frameIndex=0;
    this.boneOne=new THREE.Object3D();//{position:{},scale:{},rotation:{}};//与ui显示的情况对应

    //this.axis=new THREE.Object3D();

    this.init(mesh);
    //this.set();
}
AnimationProcessor.prototype={
    quaternion2euler:function (quaternion) {
        var euler=new THREE.Euler(0,0,0, 'XYZ');
        euler.setFromQuaternion(quaternion);
        return euler;
    },
    euler2quaternion:function (euler) {
        var quaternion=new THREE.Quaternion();
        quaternion.setFromEuler(euler);
        return quaternion;
    },
    init:function (mesh) {


        this.boneInverses=mesh.skeleton.boneInverses;


        /*let axisX = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: 0xff0000,depthTest: false}));
        //axisX.translateX(10.25);
        let axisY = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 500, 0.1), new THREE.MeshBasicMaterial({ color: 0x00ff00,depthTest: false }));
        //axisY.translateY(100.25);
        let axisZ = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 0.1, 500), new THREE.MeshBasicMaterial({ color: 0x0000ff,depthTest: false }));
        //axisZ.translateZ(1000.25);

        this.axis.add(axisX);
        this.axis.add(axisY);
        this.axis.add(axisZ);*/

        var This=this;
        //console.log(This.boneInverses[This.boneIndex].toArray());
        loop();
        function loop() {//animation->one //当前数据显示为骨骼的数据
            var i=This.boneIndex;
            var time=This.frameIndex;//修改地0帧的数据
            var animation=This.animation;

            This.boneOne.position.x=animation.tracks[3*i].values[3*time];
            This.boneOne.position.y=animation.tracks[3*i].values[3*time+1];
            This.boneOne.position.z=animation.tracks[3*i].values[3*time+2];

            var quaternion=new THREE.Quaternion();
            quaternion.set(
                animation.tracks[3*i+1].values[4*time],
                animation.tracks[3*i+1].values[4*time+1],
                animation.tracks[3*i+1].values[4*time+2],
                animation.tracks[3*i+1].values[4*time+3],
            );
            var euler=This.quaternion2euler(quaternion);
            This.boneOne.rotation.x=euler.x;
            This.boneOne.rotation.y=euler.y;
            This.boneOne.rotation.z=euler.z;

            //This.boneOne.updateMatrix();//更新对象的矩阵
            /*This.boneOne.matrix.multiplyMatrices(
                This.boneInverses[This.boneIndex]
                ,This.boneOne.matrix
            );*/
            //This.boneOne.matrixWorldNeedsUpdate=true;//使用矩阵更新对象
            //This.boneOne.

            /*This.axis.rotation.set(
                This.boneOne.rotation.x,
                This.boneOne.rotation.z,
                This.boneOne.rotation.z
            );
            This.axis.position.set(
                This.boneOne.position.x,
                This.boneOne.position.y,
                This.boneOne.position.z-10,
            );*/

            //alert(This.boneOne.matrix.toArray());
            //console.log(This.boneOne.matrix.toArray());

            //This.axis.matrixWorld=This.axis.matrix=This.boneOne.matrix;
            //This.axis.matrixWorldNeedsUpdate=true;//使用矩阵更新对象
            //This.axis.updateMatrix();
            //console.log(This.axis);

            requestAnimationFrame(loop);
        }
    },

    update:function () {//one->animation
        var This=this;
        var time=this.frameIndex;
        var i=This.boneIndex;
        This.animation.tracks[3*i].values[3*time]=this.boneOne.position.x;
        This.animation.tracks[3*i].values[3*time+1]=this.boneOne.position.y;
        This.animation.tracks[3*i].values[3*time+2]=this.boneOne.position.z;
        quaternion=This.euler2quaternion(new THREE.Euler(
            this.boneOne.rotation.x,
            this.boneOne.rotation.y,
            this.boneOne.rotation.z,
            'XYZ'));
        This.animation.tracks[3*i+1].values[4*time]=quaternion.x;
        This.animation.tracks[3*i+1].values[4*time+1]=quaternion.y;
        This.animation.tracks[3*i+1].values[4*time+2]=quaternion.z;
        This.animation.tracks[3*i+1].values[4*time+3]=quaternion.w;
    },
    frameCopy:function (i_start,i_end) {
        animation=this.animation;
        var time0=i_start,time1=i_end;
        for(var i=0;i<25;i++){//25个骨头
            var position=animation.tracks[3*i].values;
            var quaternion=animation.tracks[3*i+1].values;
            position[3*time1  ]=position[3*time0  ];
            position[3*time1+1]=position[3*time0+1];
            position[3*time1+2]=position[3*time0+2];

            quaternion[4*time1  ]=quaternion[4*time0  ];
            quaternion[4*time1+1]=quaternion[4*time0+1];
            quaternion[4*time1+2]=quaternion[4*time0+2];
            quaternion[4*time1+3]=quaternion[4*time0+3];
        }
    },

    //控制部分
    //frameIndex
    setFrameIndex:function (n) {
        this.frameIndex=n;
    },
    //boneIndex
    nextBoneIndex:function () {
        this.boneIndex++;
        if(this.boneIndex>=25)this.boneIndex=0;
    },
    preBoneIndex:function () {
        this.boneIndex--;
        if(this.boneIndex<=-1)this.boneIndex=24;
    },
    //boneOne
    modifyBoneOne:function (x_y_z ,add_sub) {//x,y,z 1,2,3 //+,- 1,-1
        //console.log(this.boneOne);
        //this.boneOne.matrixWorldNeedsUpdate=true;//使用矩阵更新对象
        //this.boneOne.updateMatrix();

        //if(x_y_z===1)this.boneOne.rotationX (add_sub*this.stepRotation);
        //else if(x_y_z===2)this.boneOne.rotationY (add_sub*this.stepRotation);
        //else this.boneOne.rotationZ (add_sub*this.stepRotation);

        if(x_y_z===1)
            this.boneOne.rotateOnAxis(
            new THREE.Vector3(1,0,0),
            add_sub*this.stepRotation
            );
        else if(x_y_z===2)
            this.boneOne.rotateOnAxis(
            new THREE.Vector3(0,1,0),
            add_sub*this.stepRotation
            );
        else
            this.boneOne.rotateOnAxis(
            new THREE.Vector3(0,0,1),
            add_sub*this.stepRotation
            );

        //this.boneOne.matrixWorldNeedsUpdate=true;//使用矩阵更新对象

        /*if(add_sub===1){
            if(x_y_z===1)this.boneOne.rotation.x+=this.stepRotation;
            else if(x_y_z===2)this.boneOne.rotation.y+=this.stepRotation;
            else this.boneOne.rotation.z+=this.stepRotation;
        }else{
            if(x_y_z===1)this.boneOne.rotation.x-=this.stepRotation;
            else if(x_y_z===2)this.boneOne.rotation.y-=this.stepRotation;
            else this.boneOne.rotation.z-=this.stepRotation;
        }*/
        this.update();
    },

    //以下是用于初始化时修改动画的代码
    setAnimation:function (data,time) {
        //举起左手
        var datas=data;
        for(var i=0;i<datas.length;i++)
            this.setBone(datas[i],time);
    },
    setBone:function (data,time) {
        var i=data[0];
        if(typeof(time)==="undefined")time=data[1];

        this.animation.tracks[3*i].values[3*time]=data[2];
        this.animation.tracks[3*i].values[3*time+1]=data[3];
        this.animation.tracks[3*i].values[3*time+2]=data[4];

        this.animation.tracks[3*i+1].values[4*time]=data[5];
        this.animation.tracks[3*i+1].values[4*time+1]=data[6];
        this.animation.tracks[3*i+1].values[4*time+2]=data[7];
        this.animation.tracks[3*i+1].values[4*time+3]=data[8];
    },
    set:function () {

        this.setAnimation(
            [[0,0,-0.21575161814689636,-38.924495697021484,-54.877281188964844,-0.5608370900154114,-0.4222858250141144,0.5853126645088196,0.40564215183258057],[1,0,2.512575626373291,7.927768707275391,0,-0.13790616393089294,0.026372253894805908,-0.5669452548027039,0.8117015957832336],[2,0,-1.4999942779541016,9.266521453857422,0,-0.025545058771967888,-0.007012464571744204,0.1996641308069229,0.979506254196167],[3,0,-0.4999961853027344,10.590322494506836,-5.790239675410951e-23,-0.012126646935939789,-0.015186376869678497,-0.09867768734693527,0.9949296712875366],[4,0,0.000006661340194114018,11.914095878601074,-1.9360365699808287e-22,-0.0823596864938736,-0.05276050046086311,0.12452980875968933,0.9873831868171692],[5,0,0.40158843994140625,6.922981262207031,2.0293120059111961e-16,0.0006014829850755632,-0.13030898571014404,-0.013215044513344765,0.9913851618766785],[6,0,1.1744370460510254,20.246105194091797,-2.3841856489070778e-7,-1.4699557127073604e-9,-4.529880115455853e-8,0.009999834932386875,0.9999499917030334],[7,0,-3.5900611877441406,5.171510696411133,-7.664562702178955,-0.26210975646972656,0.6807560920715332,-0.45095762610435486,0.5143023133277893],[8,0,-2.9999921321868896,3.021270751953125,5.999990463256836,0.6259027123451233,0.4355146288871765,0.12285132706165314,0.6352010369300842],[9,0,4.8170545596804e-7,21.837299346923828,-0.000002384185791015625,0.7159470319747925,-0.1194019690155983,0.6844746470451355,-0.06824561953544617],[10,0,-1.788135932656587e-7,23.69284439086914,-0.0000031925742405292112,0.18595586717128754,0.710597038269043,0.16973142325878143,0.6570110321044922],[11,0,0.8759207725524902,15.173603057861328,2.6645607948303223,-0.6457534432411194,-0.2867811620235443,-0.6486972570419312,-0.28275594115257263],[12,0,1.9999961853027344,10.021260261535645,2.999997854232788,-0.25361010432243347,0.8702214360237122,0.22805750370025635,-0.3555085361003876],[13,0,0.000004834797437069938,24.83322525024414,2.384185791015625e-7,-0.6175274848937988,-0.6143128275871277,-0.05018659681081772,0.48863160610198975],[14,0,0.000015541911125183105,23.693950653076172,-0.0000048577762754575815,0.16907894611358643,0.6861494183540344,0.14224565029144287,0.6930926442146301],[15,0,0.057089537382125854,-4.416308403015137,-7.831920623779297,-0.13836848735809326,0.12225011736154556,-0.8125196695327759,0.5529202818870544],[16,0,-4.598636849095783e-8,45.40013885498047,-4.556457255944224e-8,0.14034801721572876,0.028014546260237694,-0.7749055624008179,0.6156614422798157],[17,0,-7.536504540439637e-7,48.852088928222656,-0.0000018591993011796148,0.4355934262275696,-0.5844413638114929,0.4463110566139221,0.5191272497177124],[18,0,3.3840262858575443e-7,12.231062889099121,0.000012429474736563861,0.2526429295539856,-0.04377632215619087,-0.07898641377687454,0.9633360505104065],[19,0,0.0000014156109955365537,6.133963108062744,0.000004917388196190586,-3.8770548371758196e-7,-0.0000026660356979846256,0.14943817257881165,0.9887710809707642],[20,0,0.03117653727531433,-4.416308403015137,7.8319196701049805,0.09360373020172119,-0.07613173127174377,-0.7944486737251282,0.5952256917953491],[21,0,-0.000003877175004163291,45.39842224121094,-2.8251480443941546e-7,0.08326634764671326,0.05841420963406563,-0.8003187775611877,0.5908843278884888],[22,0,4.795434733750881e-7,48.84587860107422,-0.0000016073043980213697,0.38370779156684875,-0.5564094185829163,0.4918127655982971,0.5489053726196289],[23,0,-0.000001947792725331965,12.336885452270508,9.849327398114838e-7,0.24478314816951752,0.06870441138744354,-0.017395444214344025,0.9669841527938843],[24,0,-0.00000412762119594845,6.175222873687744,-0.0000022500257728097495,9.125316751124046e-7,0.000007174165602918947,0.2955201268196106,0.9553365111351013]]


        );
    },
}
/*仿射变换的操纵顺序：缩放->旋转->平移
* 缩放变换不改变坐标轴的走向，也不改变原点的位置，所以两个坐标系仍然重合。
旋转变换改变坐标轴的走向，但不改变原点的位置，所以两个坐标系坐标轴不再处于相同走向。
平移变换不改变坐标轴走向，但改变原点位置，两个坐标系原点不再重合。

这样就可以解释问什么缩放不能在旋转之后，而缩放和旋转都不能在平移之后了。 于是没有问题的顺序只能是 缩放 -> 旋转 -> 平移 。
* */