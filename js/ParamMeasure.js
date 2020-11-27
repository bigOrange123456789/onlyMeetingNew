function ParamMeasure(obj,type){
    this.obj=obj;
    this.type=type;
    this.beforeKey=-1;//type记录是THREEJS对象(0)还是引擎对象（1）
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
    if(this.type==0)this.ControlTJSObj(this.obj);
    else if(this.type==1)this.ControlENGObj(this.obj);
}