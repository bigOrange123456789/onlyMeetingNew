import{Network}from'../Network.js'
class SeatManager{
    constructor() {
        this.positions=[];//1677
        this.chairs=new THREE.Object3D();
        //this.chairs.visible=false;
        this.url="myModel/chair.glb";
        this.myNetwork=new Network()
        //一楼前部分
        var k,i,j;
        for(k=0;k<3;k++)//3部分
            for(i=0;i<12*2;i++)//后小前大
                for(j=0;j<13*2;j++)//右小左大
                    this.positions.push([103-5*i/2,0.01+i*0.25/2,85-4.1*j/2-k*75]);//前后、上下、左右
        for(k=0;k<3;k++)//一楼后部分
            for(i=0;i<17*2;i++)
                for(j=0;j<13*2;j++)
                    this.positions.push([31-9.1*i/2,4.1+i*1.5/2,85-4.1*j/2-k*75]);//前后、上下、左右
        for(var k=0;k<3;k++)//二楼//
            for(var i=0;i<14*2;i++)
                for(var j=0;j<13*2;j++)
                    this.positions.push([-15-9*i/2,88.55+i*5.0/2,85-4.1*j/2-k*75]);//前后、上下、左右

    }
    create(){
        var scope=this;
        scope.myNetwork.getGlb(this.url, (gltf) => {
            var obj=gltf.scene.children[0];

            var geometry1=obj.children[0].geometry;
            var material1=obj.children[0].material;
            var mesh1=new THREE.InstancedMesh(geometry1,material1,scope.positions.length);

            var geometry2=obj.children[1].geometry;
            var material2=obj.children[1].material;
            var mesh2=new THREE.InstancedMesh(geometry2,material2,scope.positions.length);

            var dummy=new THREE.Object3D();
            var k=0.5;
            for(var i=0;i<scope.positions.length;i++){
                dummy.position.set(
                    scope.positions[i][0]+0.5,
                    scope.positions[i][1]+1.0,
                    scope.positions[i][2]);
                dummy.rotation.set(0,-Math.PI/2,0);
                dummy.scale.set(1.3*k,0.33*k,1.3*k);
                dummy.updateMatrix();//由位置计算齐次坐标变换矩阵
                mesh1.setMatrixAt(i, dummy.matrix);
                mesh2.setMatrixAt(i, dummy.matrix);
            }

            scope.chairs.add(mesh1);
            scope.chairs.add(mesh2);
        })
    }
    myLoad0(url){
        var scope=this;
        var loader= new THREE.GLTFLoader();
        loader.load(url, (gltf) => {
            var obj=gltf.scene.children[0];

            var geometry1=obj.children[0].geometry;
            var material1=obj.children[0].material;
            var mesh1=new THREE.InstancedMesh(geometry1,material1,scope.positions.length);

            var geometry2=obj.children[1].geometry;
            var material2=obj.children[1].material;
            var mesh2=new THREE.InstancedMesh(geometry2,material2,scope.positions.length);

            var dummy=new THREE.Object3D();
            for(var i=0;i<scope.positions.length;i++){
                dummy.position.set(
                    scope.positions[i][0],
                    scope.positions[i][1],
                    scope.positions[i][2]);
                dummy.rotation.set(0,-Math.PI/2,0);
                dummy.scale.set(0.95,0.35,0.95);
                dummy.updateMatrix();//由位置计算齐次坐标变换矩阵
                mesh1.setMatrixAt(i, dummy.matrix);
                mesh2.setMatrixAt(i, dummy.matrix);
            }

            scope.chairs.add(mesh1);
            scope.chairs.add(mesh2);
        })
    }
}
export {SeatManager}
