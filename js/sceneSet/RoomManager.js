import { ResourceLoader } from '../ResourceLoader.js';
import{Network}from'../Network.js'
class RoomManager{
    loader;
    room;
    //this.room.visible=false;
    myVideoManager;
    mid;
    url;
    camera;

    resourceManager;

    myResourceLoader;
    myNetwork;

    constructor(myVideoManager0,camera){
        var scope=this;
        scope.loader= new THREE.GLTFLoader();
        scope.room=new THREE.Object3D();
        scope.myNetwork=new Network()
        //this.room.visible=false;
        scope.myVideoManager=myVideoManager0;
        scope.mid=20;
        scope.url="./myModel/room/";
        scope.camera=camera;

        scope.firstLoad(scope.url)
        scope.init();
    }
    firstLoad(url) {//scope.url+"first.glb"
        var scope=this;
        scope.myNetwork.getGlb(url+"first.glb", (glb) => {
            //每个材质一个mesh
            scope.room.add(glb.scene)
            new THREE.XHRLoader(THREE.DefaultLoadingManager).load(url+"test.json", function (data) {
                var json=JSON.parse(data);
                var list=json.list;
                var mapsIndex=json.mapsIndex;

                glb.scene.traverse(function (node) {
                    if(node instanceof THREE.Mesh){
                        if( node.name==="室内-小显示器屏幕（非）"||
                            node.name==="室内-大显示器屏幕（非）"){//室内-大显示器屏幕（非）
                            //var screen=node;
                            //if(scope.myVideoManager.video)scope.myVideoManager.init();
                            //scope.myVideoManager.setMaterial(screen);
                            node.material=window.videoMaterial;
                        }
                        var index=parseInt(list[node.name])
                        if(mapsIndex[index]){
                            scope.myNetwork.getTexture(url+"ConferenceRoom"+index+".jpg",texture => {
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.wrapT = THREE.RepeatWrapping;
                                node.material=new THREE.MeshBasicMaterial({map: texture});
                            })
                        }
                    }
                })

            });
        });
    }
}
RoomManager.prototype.init=function(){
    this.myResourceLoader=new ResourceLoader(
        this.url,
        this.camera,
        function (gltf) {}
        );
    this.room.add(this.myResourceLoader.object);
    this.room.scale.set(10,10,10);//这里在预处理计算包围球时，可以通过设置scene来处理
    this.myLoad_door('myModel/room/door.gltf');
}
RoomManager.prototype.myLoad_door=function(url){
    var scope=this;
    scope.loader.load(url, (gltf) => {
        //console.log(gltf);
        var geometry0=gltf.scene.children[0].children[0].geometry;
        var geometry1=gltf.scene.children[0].children[1].geometry;
        var geometry2=gltf.scene.children[0].children[2].geometry;

        var material0=gltf.scene.children[0].children[0].material;
        var material1=gltf.scene.children[0].children[1].material;
        var material2=gltf.scene.children[0].children[2].material;

        var mesh0=new THREE.InstancedMesh(geometry0,material0,4);
        var mesh1=new THREE.InstancedMesh(geometry1,material1,4);
        var mesh2=new THREE.InstancedMesh(geometry2,material2,4);

        var d0=new THREE.Object3D();
        d0.rotation.set(Math.PI/2,0,Math.PI/2);
        d0.position.set(-12.52, 2.741,3.290);
        d0.scale.set(-0.001,-0.001,-0.001);
        var d1=new THREE.Object3D();
        d1.rotation.set(Math.PI/2,Math.PI,3*Math.PI/2);
        d1.position.set(-12.5244207382, 2.7411997318,1.50942);
        d1.scale.set(-0.001,-0.001,-0.001);

        set(d0,[mesh0,mesh1,mesh2],0);
        //set(d1,[mesh0,mesh1,mesh2],0);

        var pre1=[
            1,0,0,0,
            0,-1,0,0,
            0,0,1,0,
            0,0,0,1
        ];
        var pre2=[
            1,0,0,0,
            0,1,0,0,
            0,0,-1,0,
            0,0,0,1
        ];
        var pre3=[
            1,0,0,0,
            0,-1,0,0,
            0,0,-1,0,
            0,0,0,1
        ];
        set(d0,[mesh0,mesh1,mesh2],1,pre1);
        set(d1,[mesh0,mesh1,mesh2],2,pre2);
        set(d1,[mesh0,mesh1,mesh2],3,pre3);


        //move();
        function move(){
            if(d0.rotation.z>0) {
                d0.rotation.z-=0.02;
                d1.rotation.z-=0.02;
                set(d0, [mesh0,mesh1,mesh2], 0);
                set(d0, [mesh0,mesh1,mesh2], 1,pre1);
                set(d1, [mesh0,mesh1,mesh2], 2,pre2);
                set(d1, [mesh0,mesh1,mesh2], 3,pre3);
                requestAnimationFrame(move);
            }
        }

        var myInterval=setInterval(function () {
            if(d0.rotation.z>0) {
                d0.rotation.z-=0.02;
                d1.rotation.z-=0.02;
                set(d0, [mesh0,mesh1,mesh2], 0);
                set(d0, [mesh0,mesh1,mesh2], 1,pre1);
                set(d1, [mesh0,mesh1,mesh2], 2,pre2);
                set(d1, [mesh0,mesh1,mesh2], 3,pre3);
            }else clearInterval(myInterval);
        },10);

        function set(du,m,i,pre) {
            if(typeof (pre)==="undefined"){
                if(typeof (m.length)==="undefined"){
                    du.updateMatrix();
                    m.setMatrixAt(i, du.matrix);
                    m.instanceMatrix.needsUpdate=true;
                }else
                    for(var j=0;j<m.length;j++)
                        set(du,m[j],i);
            }else{
                if(typeof (m.length)==="undefined"){
                    var m1 = new THREE.Matrix4();
                    m1.set(
                        pre[0],pre[1],pre[2],pre[3],
                        pre[4],pre[5],pre[6],pre[7],
                        pre[8],pre[9],pre[10],pre[11],
                        pre[12],pre[13],pre[14],pre[15]
                    );
                    du.updateMatrix();

                    m.setMatrixAt(i, du.matrix.multiply(m1));
                    m.instanceMatrix.needsUpdate=true;
                }else
                    for(j=0;j<m.length;j++)
                        set(du,m[j],i,pre);
            }

        }
        function set1(du,m,i) {
            if(typeof (m.length)==="undefined"){
                var m1 = new THREE.Matrix4();
                m1.set(
                    1,0,0,0,
                    0,-1,0,0,
                    0,0,1,0,
                    0,0,0,1);
                du.updateMatrix();

                m.setMatrixAt(i, du.matrix.multiply(m1));
                m.instanceMatrix.needsUpdate=true;
            }else
                for(var j=0;j<m.length;j++)
                    set1(du,m[j],i);
        }

        scope.room.add(mesh0);
        scope.room.add(mesh1);
        scope.room.add(mesh2);
    })
}
export {RoomManager};
