function ParamMeasure(obj,type,myData0){
    this.obj=obj;
    this.type=type;
    this.beforeKey=-1;//type记录是THREEJS对象(0)还是引擎对象（1）
    this.stepPosition=1;//
    this.stepRotation=1;
    this.stepScale=1;
    this.boneIndex=7;
    this.ControlTJSObj=function (obj) {
        var step=1,stepScale=1;
        //开始测试
        var This=this;//beforeKey = -1;
        document.onkeydown = function (e) {
            if (e.key === "t") obj.position.x += step;
            else if (e.key === "g") obj.position.x -= step;
            else if (e.key === "r") obj.position.y += step;
            else if (e.key === "y") obj.position.y -= step;
            else if (e.key === "f") obj.position.z += step;
            else if (e.key === "h") obj.position.z -= step;
            else if (e.key === "v")
                console.log(
                    Math.round(obj.position.x*100)/100+','
                    +Math.round(obj.position.y*100)/100+','
                    +Math.round(obj.position.z*100)/100,

                    Math.round(obj.scale.x*100)/100+','
                    +Math.round(obj.scale.y*100)/100+','
                    +Math.round(obj.scale.z*100)/100,

                    Math.round(obj.rotation.x*10000)/10000+','
                    +Math.round(obj.rotation.y*10000)/10000+','
                    +Math.round(obj.rotation.z*10000)/10000
                );
            var rx=obj.rotation.x,ry=obj.rotation.y,rz=obj.rotation.z;
            //console.log(obj.rotation,rx,ry,rz,1,"stepScale"+stepScale);
            if (e.key === '=') {
                if (This.beforeKey === '1') obj.scale.x +=stepScale;
                else if (This.beforeKey === '2') obj.scale.y +=stepScale;
                else if (This.beforeKey === '3') obj.scale.z +=stepScale;
                else if (This.beforeKey === '4') rx +=stepScale;
                else if (This.beforeKey === '5') ry +=stepScale;
                else if (This.beforeKey === '6') rz +=stepScale;
            } else if (e.key === '-') {
                if (This.beforeKey === '1') obj.scale.x -=stepScale;
                else if (This.beforeKey === '2') obj.scale.y -=stepScale;
                else if (This.beforeKey === '3') obj.scale.z -=stepScale;
                else if (This.beforeKey === '4') rx -=stepScale;
                else if (This.beforeKey === '5') ry -=stepScale;
                else if (This.beforeKey === '6') rz -=stepScale;
            }
            obj.rotation.set(rx,ry,rz);
            if (e.key === '1' || e.key === '2' || e.key === '3'||e.key === '4' || e.key === '5' || e.key === '6') This.beforeKey = e.key;
        }
        //完成测试
    }
    this.ControlENGObj=function (obj) {
        //开始测试
        var This=this;//beforeKey = -1;
        document.onkeydown = function (e) {
            var x=obj.getComponent(Web3DEngine.Transform).localPosition.x;
            var y=obj.getComponent(Web3DEngine.Transform).localPosition.y;
            var z=obj.getComponent(Web3DEngine.Transform).localPosition.z;
            var a1=obj.getComponent(Web3DEngine.Transform).localEulerAngles.x;
            var a2=obj.getComponent(Web3DEngine.Transform).localEulerAngles.y;
            var a3=obj.getComponent(Web3DEngine.Transform).localEulerAngles.z;
            if (e.key == "t")x+=0.1;
            else if (e.key == "g")x-=0.1;
            else if (e.key == "r")y+=0.1;
            else if (e.key == "y")y-=0.1;
            else if (e.key == "f")z+=0.1;
            else if (e.key == "h")z-=0.1;
            else if (e.key == "v") console.log(Math.round(x*100)/100+','
                +Math.round(y*100)/100+','
                +Math.round(z*100)/100,
                obj.getComponent(Web3DEngine.Transform).localEulerAngles);
            else if (e.key == '=') {
                if (This.beforeKey == '1') a1 += 1;
                else if (This.beforeKey == '2') a2 += 1;
                else if (This.beforeKey == '3') a3 += 1;
            } else if (e.key == '-') {
                //if (This.beforeKey == '1') a2 -= 1;
                //else if (This.beforeKey == '2') a2-= 1;
                //else if (This.beforeKey == '3') a3-= 1;
                a1 -= 1;
            }
            if (e.key == '1' || e.key == '2' || e.key == '3') This.beforeKey = e.key;
            obj.getComponent(Web3DEngine.Transform).localPosition=new THREE.Vector3(x,y,z);
            obj.getComponent(Web3DEngine.Transform).localEulerAngles=new THREE.Vector3(a1,a2,a3);
        }
        //完成测试
    }
    this.quaternion2euler=function (quaternion) {
        var euler=new THREE.Euler(0,0,0, 'XYZ');
        euler.setFromQuaternion(quaternion);
        return euler;
    }
    this.euler2quaternion=function (euler) {
        var quaternion=new THREE.Quaternion();
        quaternion.setFromEuler(euler);
        return quaternion;
    }
    this.AnimationObj=function (animation,datas) {
        this.setAnimation(datas);
        //开始测试
        var This=this;//beforeKey = -1;
        var step=this.stepPosition;//
        var stepRotation=0.3;
        var stepScale=this.stepScale;
        document.onkeydown = function (e) {
            //7,8,9,10
            var i=This.boneIndex;
            var time=0;
            var obj={};
            var animation=This.obj;
            obj.position={};
            obj.position.x=animation.tracks[3*i].values[3*time];
            obj.position.y=animation.tracks[3*i].values[3*time+1];
            obj.position.z=animation.tracks[3*i].values[3*time+2];
            obj.rotation={};
            var quaternion=new THREE.Quaternion();
            quaternion.set(
                animation.tracks[3*i+1].values[4*time],
                animation.tracks[3*i+1].values[4*time+1],
                animation.tracks[3*i+1].values[4*time+2],
                animation.tracks[3*i+1].values[4*time+3],
            );
            var euler=This.quaternion2euler(quaternion);
            obj.rotation.x=euler.x;
            obj.rotation.y=euler.y;
            obj.rotation.z=euler.z;


            if (e.key === "t") obj.position.x += step;
            else if (e.key === "g") obj.position.x -= step;
            else if (e.key === "r") obj.position.y += step;
            else if (e.key === "y") obj.position.y -= step;
            else if (e.key === "f") obj.position.z += step;
            else if (e.key === "h") obj.position.z -= step;
            else if (e.key === "v")
                console.log(
                    "["+
                        i+","+
                        time+","+
                        obj.position.x+","+obj.position.y+","+obj.position.z+","+
                        quaternion.x+","+quaternion.y+","+quaternion.z+","+quaternion.w+
                    "],"
                );
            var rx=obj.rotation.x,ry=obj.rotation.y,rz=obj.rotation.z;
            //console.log(obj.rotation,rx,ry,rz,1,"stepScale"+stepScale);
            if (e.key === '=') {
                if (This.beforeKey === '1') obj.scale.x +=stepScale;
                else if (This.beforeKey === '2') obj.scale.y +=stepScale;
                else if (This.beforeKey === '3') obj.scale.z +=stepScale;
                else if (This.beforeKey === '4') rx +=stepRotation;
                else if (This.beforeKey === '5') ry +=stepRotation;
                else if (This.beforeKey === '6') rz +=stepRotation;
            } else if (e.key === '-') {
                if (This.beforeKey === '1') obj.scale.x -=stepScale;
                else if (This.beforeKey === '2') obj.scale.y -=stepScale;
                else if (This.beforeKey === '3') obj.scale.z -=stepScale;
                else if (This.beforeKey === '4') rx -=stepRotation;
                else if (This.beforeKey === '5') ry -=stepRotation;
                else if (This.beforeKey === '6') rz -=stepRotation;
            }
            if (e.key === '1' || e.key === '2' || e.key === '3'||e.key === '4' || e.key === '5' || e.key === '6') This.beforeKey = e.key;

            This.obj.tracks[3*i].values[3*time]=obj.position.x;
            This.obj.tracks[3*i].values[3*time+1]=obj.position.y;
            This.obj.tracks[3*i].values[3*time+2]=obj.position.z;

            euler.x=rx;
            euler.y=ry;
            euler.z=rz;

            quaternion=This.euler2quaternion(euler);
            animation.tracks[3*i+1].values[4*time]=quaternion.x;
            animation.tracks[3*i+1].values[4*time+1]=quaternion.y;
            animation.tracks[3*i+1].values[4*time+2]=quaternion.z;
            animation.tracks[3*i+1].values[4*time+3]=quaternion.w;

        }
    }
    this.setAnimation=function (datas) {
        console.log(datas);
        if(typeof(datas)==="undefined"){
            datas=[//举起左手
                //骨骼，帧数，位置，旋转
                [7,0,-0.09006024897098541,10.171510696411133,-4.664562702178955,0.081243135035038,-0.8884621262550354,0.4515543580055237,0.011543878354132175],
                [8,0,-1.9999921321868896,1.021270751953125,7.999990463256836,-0.18097123503684998,0.6422032713890076,-0.06342826038599014,0.7421598434448242],
                //[8,0,-1.9999921321868896,10.021270751953125,-0.000008984548912849277,-0.18097218871116638,0.6422032713890076,-0.06342554837465286,0.7421598434448242],
                [9,0,4.8170545596804e-7,21.837299346923828,-0.000002384185791015625,-0.25288084149360657,-0.7204176187515259,0.023216012865304947,0.645376443862915],
                //[9,0,4.8170545596804e-7,25.837299346923828,-0.000002416199549770681,-0.25288084149360657,-0.7204176187515259,0.023216119036078453,0.645376443862915],
                [10,0,-1.788135932656587e-7,23.69284439086914,-0.0000031925742405292112,-0.00407734140753746,-0.7832242250442505,-0.004076814278960228,0.6217125654220581],
            ];
        }//骨骼，帧数，旋转，位置
        for(var i=0;i<datas.length;i++)
            this.setBone(datas[i]);
    }
    this.setBone=function (data) {
        var i=data[0];
        var time=data[1];

        this.obj.tracks[3*i].values[3*time]=data[2];
        this.obj.tracks[3*i].values[3*time+1]=data[3];
        this.obj.tracks[3*i].values[3*time+2]=data[4];

        this.obj.tracks[3*i+1].values[4*time]=data[5];
        this.obj.tracks[3*i+1].values[4*time+1]=data[6];
        this.obj.tracks[3*i+1].values[4*time+2]=data[7];
        this.obj.tracks[3*i+1].values[4*time+3]=data[8];
    }
    if(this.type===0)this.ControlTJSObj(this.obj);
    else if(this.type===1)this.ControlENGObj(this.obj);
    else if(this.type===2)this.AnimationObj(this.obj,myData0);
}