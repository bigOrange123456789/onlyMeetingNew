function MyPMLoader(glbObj,url,LODArray,camera,animationType,animationSpeed,texNames,finishFunction,delayTime){
    this.url;//=url;
    this.glbObj;//=glbObj;
    this.rootObject;//=new THREE.Object3D();
    this.mesh;//={};
    this.finished;
    this.finishFunction;
    this.PMDelay=typeof(delayTime)==="undefined"?400:delayTime;

    //以下是配合实现动画功能的一些成员变量
    this.animationMixer;//当前动画
    this.animationMixers;//=[];//全部动画
    this.animationSpeed;//=animationSpeed;//动画播放速度

    //以下是配合实现LOD功能的一些成员变量
    this.pmMeshHistory;//=[];
    this.preLODIndex;//=-1;
    this.LODNumber;
    this.LODArray;//=[];
    this.camera;//=null;
    this.skeletonBones;//=null;
    this.skeletonMatrix;//=null;

    //以下是纹理贴图地址信息
    this.texNames;

    this.init(glbObj,url,LODArray,camera,animationType,animationSpeed,texNames,finishFunction);//初始化函数//00001
}
MyPMLoader.prototype={
    init:function(glbObj,url,LODArray,camera,animationType,animationSpeed,texNames,finishFunction){//这里是初始要执行的代码
        this.finishFunction=finishFunction?finishFunction:null;
        this.url=url;
        this.glbObj=glbObj;
        this.rootObject=new THREE.Object3D();
        this.mesh={};
        this.finished=false;

        //以下是配合实现动画功能的一些成员变量
        this.animationMixers=[];
        this.animationSpeed=animationSpeed;
        this.animationType=animationType;

        //以下是配合实现LOD功能的一些成员变量
        this.pmMeshHistory=[];
        this.preLODIndex=-1;
        this.camera=camera;
        this.LODArray=LODArray;
        this.LODNumber=LODArray.length+1;

        //以下是纹理贴图地址信息
        if(texNames===undefined)this.texNames=["Texture_0_0.jpeg","Texture_0_1.jpeg","Texture_0_2.jpeg","Texture_0_3.jpeg"];
        else this.texNames=texNames;

        this.createPmMesh();
    },
    //外界创建这个对象后自动执行init函数，而init只需要执行下面的这个load函数
    createPmMesh:function(){
        var THIS=this;

        //处理骨骼动画
        var animationClips=THIS.glbObj.animations;//获取动画
        if(animationClips.length>0)this.ainmationInit();

        //加载基模的三个JSON文件,然后进行解析、执行parse函数
        var baseMeshUrl = this.url + '/basemesh.json';
        var skeletonUrl = this.url + '/skeleton.json';
        var skeletonIndexUrl = this.url + '/skeletonindex.json';
        var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        loader.load(baseMeshUrl, function(baseMesh){
            loader.load(skeletonUrl, function(skeleton){
                loader.load(skeletonIndexUrl, function(skeletonIndex){
                    THIS.handlePMJson_i( baseMesh, skeleton, skeletonIndex, animationClips);
                });
            });
        });
    },
    handlePMJson_i:function(baseMesh, skeleton, skeletonIndex, animationClips) {
        var THIS=this;
        THIS.mesh={};
        var skeletonBones=this.skeletonBones;
        var skeletonMatrix=this.SkeletonMatrix;
        var rootObject =this.rootObject ;// new THREE.Object3D();

        var pmFilesUrl = this.url + '/pm/';
        var texFilesUrl = this.url;

        var pmDeltaTime =0;

        var meshMat = {};
        var pmCount = 0;//PM的json文件总个数
        var splitCount = 0;//已加载的json文件总个数

        var incidentFaces = {};
        var meshData = {vertices:[] ,faces:[] ,uvs:[] ,materials:[] ,Uvfaces:[], joints:[], weights:[]};
        var mapMaterial={};

        var material_id=0;
        //var mesh=this.mesh;

        var meshMaterialMap = {};

        //基网格信息
        var jsonData = JSON.parse(baseMesh);
        var skeletonData = JSON.parse(skeleton);
        var skeletonIndexData = JSON.parse(skeletonIndex);

        ////用于图片LOD
        var imageLodLevel = 0;
        var MaxLODLevel = 5;//LOD图片的个数

        //用于模型网格LOD
        var pmMeshHistory=this.pmMeshHistory;//[];
        var numberLOD=this.LODNumber;


        //设置新网格//复制vertices
        for (i = 0 ; i < jsonData.geometries[0].data.vertices.length / 3 ; ++i)
            meshData.vertices.push([
                jsonData.geometries[0].data.vertices[i * 3    ] ,
                jsonData.geometries[0].data.vertices[i * 3 + 1] ,
                jsonData.geometries[0].data.vertices[i * 3 + 2]
            ]);
        //joints、weights
        for (var i = 0 ; i < jsonData.geometries[0].data.vertices.length / 3 ; ++i)
        {
            var skeletonId = skeletonIndexData[i];
            meshData.joints.push(skeletonData.joints[skeletonId]);
            meshData.weights.push(skeletonData.weights[skeletonId]);
        }
        //uvs
        for(i = 0 ; i < jsonData.geometries[0].data.uvs.length / 2 ; ++i)
        {
            meshData.uvs.push([
                jsonData.geometries[0].data.uvs[i * 2    ] ,
                jsonData.geometries[0].data.uvs[i * 2 + 1]
            ]);
        }
        //
        for(i = 0 ; i < jsonData.geometries[0].data.faces.length; ++i)
        {
            if(jsonData.geometries[0].data.faces[i].length>0)
            {
                mapMaterial[i]=material_id;
                meshData.materials.push(jsonData.geometries[0].data.materials[i]);
                var tmpfaces=[];
                var tmpUvfaces=[];
                for (var j = 0 ; j < jsonData.geometries[0].data.faces[i].length / 3 ; ++j)
                {
                    tmpfaces.push([
                        jsonData.geometries[0].data.faces[i][j * 3    ] ,
                        jsonData.geometries[0].data.faces[i][j * 3 + 1] ,
                        jsonData.geometries[0].data.faces[i][j * 3 + 2]
                    ]);
                    tmpUvfaces.push([
                        jsonData.geometries[0].data.Uvfaces[i][j*3  ],
                        jsonData.geometries[0].data.Uvfaces[i][j*3+1],
                        jsonData.geometries[0].data.Uvfaces[i][j*3+2]
                    ]);
                }
                meshData.faces.push(tmpfaces);
                meshData.Uvfaces.push(tmpUvfaces);
                material_id++;
            }
        }

        computeIncidentFaces();

        for(i=0; i< meshData.materials.length;i++)
        {
            meshMat[i] = new THREE.MeshStandardMaterial(
                {
                    metalness : 0.2,
                    roughness : 0.8,
                    map: null,//ImageUtils.loadTexture(texFilesUrl + '/' + meshData.materials[i]),
                    transparent: false,
                    opacity : true,
                    skinning : true
                });
            if(THIS.texNames.length>0)
                startLogImageLoading(meshMat[i], meshData.materials[i]);
        }

        restoreMesh(0);//应该是处理基模时使用的，只被执行一次
        if(THIS.finishFunction!==null)THIS.finishFunction();

        loadLocalFile(pmFilesUrl + 'desc.json',function (data) {
            var jsonData = JSON.parse(data);
            splitCount = jsonData.splitCount;
            startPmLoading(THIS);
        });


        if(animationClips.length>0)this.aimationMixerInit(animationClips);


        /***********************程序到此执行结束，以下为工具函数****************************************************************************************/
        function startLogImageLoading(srcMtl , imgFile)
        {
            if (!srcMtl || !imgFile) return;

            var imgFileNameWithoutEx = imgFile.substring(0, imgFile.lastIndexOf('.'));
            var imgFileExtension = imgFile.substring(imgFile.lastIndexOf('.') + 1 , imgFile.length);

            meshMaterialMap[imgFileNameWithoutEx] = srcMtl;

            loadLodImage(imgFileNameWithoutEx, imgFileExtension);
        }

        function loadLodImage(imageFileNameWithoutEx, imageFileExtension, isSrcImage)
        {
            var loader = new THREE.TextureLoader();
            loader.load(texFilesUrl + '/' +THIS.texNames[imageLodLevel], function ( texture )
                {//贴图加载成功
                    var lodImgName = texture.image.src.substring(texture.image.src.lastIndexOf('/') + 1, texture.image.src.length);
                    var srcImgName = isSrcImage ? lodImgName.substring(0, lodImgName.lastIndexOf('.')) : lodImgName.substring(0, lodImgName.lastIndexOf('_'));
                    if(meshMaterialMap[srcImgName])
                    {
                        meshMaterialMap[srcImgName].map = texture;
                        meshMaterialMap[srcImgName].needsUpdate = true;
                    }

                    imageLodLevel++;

                    if ( imageLodLevel <THIS.texNames.length)//setTimeout(function(){} , imgLoadingGapTime);
                        loadLodImage(imageFileNameWithoutEx, imageFileExtension, imageLodLevel === MaxLODLevel);
                },
                undefined,
                function () {//贴图加载失败
                    loadLodImage(imageFileNameWithoutEx, imageFileExtension, true);
                });
        }

        function setupPmSkinnedMesh(rootObject, skeletonBones , skeletonMatrix)
        {//set up设置//设置PM骨骼网格//00001
            var skinnedMesh = rootObject.children[0];
            skinnedMesh.add(skeletonBones.bones[0]);
            skinnedMesh.bind(skeletonBones,skeletonMatrix);
        }

        function loadLocalFile(fileName , loadCallback)
        {//window.XMLHttpRequest
            var xmlhttp =new XMLHttpRequest();//这个对象应该是js语言自带的http服务，不需要导入额外的包
            xmlhttp.onreadystatechange = function ()//第二次执行这个函数时rootObject.position被改变//存有 XMLHttpRequest 的状态。从 0 到 4 发生变化
            {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
                    loadCallback(xmlhttp.responseText);
            }
            xmlhttp.open("GET", fileName, true);
            xmlhttp.send();
        }

        function computeIncidentFaces()
        {
            for (var i = 0 ; i < meshData.vertices.length ; ++i)
                incidentFaces[i] = [];
            for (var fi=0;fi<meshData.faces.length;fi++)
                for (var vi = 0 ; vi < meshData.faces[fi].length ; ++vi)
                    for(var faceIndex=0;faceIndex<3;faceIndex++)
                        incidentFaces[meshData.faces[fi][vi][faceIndex]].push(vi);
        }

        function isOriginalFaceOfT(tIndex ,objectF,Meshid, face , vsData)
        {
            for (var vsfi = 0 ; vsfi < vsData.Faces.length ; vsfi+=6)
            {
                var index = -1;
                var isFace = true;


                for (var i = 0 ; i < 3 ; ++i)
                {
                    if(vsData.Faces[vsfi+2*i] === meshData.faces[Meshid][face][i])
                    {
                        objectF.faceSIndex=(vsfi/6);
                    }
                    if (vsData.Faces[vsfi+2*i] === tIndex && meshData.faces[Meshid][face][i]== vsData.S)
                    {
                        index = i;
                        objectF.faceIndex=(vsfi/6);
                    }
                    else if (vsData.Faces[vsfi+2*i] !== meshData.faces[Meshid][face][i])
                    {
                        isFace = false;
                    }
                }

                if (isFace)
                {
                    return index;
                }
            }
            return -1;
        }

        //pm的json文件内的每一段都需要这函数的处理
        function restoreVertexSplit(si,vsData)//si是段号（数组下标）,vsData是一段（数组中的一个元素）
        {
            var Meshid=mapMaterial[vsData.FacesMaterial[0]];

            //段中的S是要修改的点，SPosition是改动后的位置
            meshData.vertices[vsData.S][0] = vsData.SPosition[0];
            meshData.vertices[vsData.S][1] = vsData.SPosition[1];
            meshData.vertices[vsData.S][2] = vsData.SPosition[2];

            for(var i=0;i<vsData.UVs.length/2;i++)
                meshData.uvs.push([vsData.UVs[2*i+0],vsData.UVs[2*i+1]]);

            //段中的TPosition是要添加的点
            meshData.vertices.push([vsData.TPosition[0] , vsData.TPosition[1] , vsData.TPosition[2]]);

            meshData.joints.push(skeletonData.joints[vsData.T]);
            meshData.weights.push(skeletonData.weights[vsData.T]);

            var t = meshData.vertices.length - 1;
            incidentFaces[t] = [];

            var newFacesOfS = [];
            var addnum=0;
            for (var fosi = 0 ; fosi < incidentFaces[vsData.S].length ; ++fosi)
            {
                var bufferIndex=incidentFaces[vsData.S][fosi];
                var objectF={faceIndex:0,faceSIndex:0};
                var c = isOriginalFaceOfT(t,objectF,Meshid,bufferIndex,vsData);

                if (c < 0)
                {
                    var faceIndexS=objectF.faceSIndex;
                    newFacesOfS.push(bufferIndex);
                    var newfUVs=[
                        vsData.Faces[faceIndexS*6+1],
                        vsData.Faces[faceIndexS*6+3],
                        vsData.Faces[faceIndexS*6+5]
                    ];
                    meshData.Uvfaces[Meshid][bufferIndex]=newfUVs;
                    continue;
                }
                addnum++;
                meshData.faces[Meshid][bufferIndex][c]=t;
                incidentFaces[t].push(bufferIndex);
                var faceIndex=objectF.faceIndex;
                var newfUV=[
                    vsData.Faces[faceIndex*6+1],
                    vsData.Faces[faceIndex*6+3],
                    vsData.Faces[faceIndex*6+5]
                ];
                meshData.Uvfaces[Meshid][bufferIndex]=newfUV;
            }
            incidentFaces[vsData.S] = newFacesOfS;

            for (var sfi = 0 ; sfi < vsData.Faces.length ; sfi+=6)
            {
                var hasST;
                if(vsData.Faces[sfi+0] === vsData.S){hasST=(vsData.Faces[sfi+2] ===t ||vsData.Faces[sfi+4] === t)}
                else if(vsData.Faces[sfi+2] === vsData.S){hasST=(vsData.Faces[sfi+0] ===t ||vsData.Faces[sfi+4] === t)}
                else if(vsData.Faces[sfi+4] === vsData.S){hasST=(vsData.Faces[sfi+0] ===t ||vsData.Faces[sfi+2] === t)}
                else{hasST=false;}

                if (!hasST)continue;

                var newFace=[vsData.Faces[sfi+0] , vsData.Faces[sfi+2] , vsData.Faces[sfi+4]];
                var index=(sfi/6);
                var iUV=[vsData.Faces[index*6+1],vsData.Faces[index*6+3],vsData.Faces[index*6+5]];
                var num=meshData.faces[Meshid].length;
                meshData.Uvfaces[Meshid].push(iUV);
                meshData.faces[Meshid].push(newFace);

                // Update incident faces
                for (i = 0 ; i < newFace.length ; ++i)
                    incidentFaces[newFace[i]].push(num);
            }
        }

        //每加载一个PM的json文件执行一次，被调用总次数是PM的json文件个数//只被loadPmMesh函数调用
        function pmRestore(pmData,index,lengthindex,THIS)
        {
            var mapPM={};
            for (var si = 0 ; si < pmData.length ; ++si)
            {
                var id=mapMaterial[pmData[si].FacesMaterial[0]];
                mapPM[id]=true;
                restoreVertexSplit(si,pmData[si]);//还原模型
            }

            for (var key in mapPM)
                restoreMesh(key, index, lengthindex, THIS);//从第二个JSON文件开始执行这个语句

        }

        //创建新的模型，将还原后的结果渲染到场景中

        function restoreMesh(Meshid,index,lengthindex)//Meshid始终为0
        {//index:0-330   lengthindex:331
            var useSkinning = true;
            rootObject.remove(THIS.mesh[0]);//将mesh从对象中移除//this is a tag 0000

            var geometry=new THREE.BufferGeometry();
            updateGeometry(geometry,meshData,Meshid);//相关运算

            //console.log(mesh)
            if(!useSkinning){//没有骨骼动画
                THIS.mesh[0]=new THREE.Mesh(geometry,meshMat[Meshid]);
            }else{//有骨骼动画
                THIS.mesh[0]=new THREE.SkinnedMesh(geometry,meshMat[Meshid]);
                meshMat[Meshid].skinning=true;
            }//console.log(Meshid);输出了356次的0

            rootObject.add(THIS.mesh[0]);//将更新后的mesh添加到对象中//


            if(animationClips.length>0)setupPmSkinnedMesh(rootObject, skeletonBones, skeletonMatrix);//重要

            if(typeof(index)!='undefined')
                if(index===lengthindex-1||index%Math.ceil(lengthindex/(numberLOD-1))===0)
                    pmMeshHistory.push(THIS.mesh[0]);//记录mesh
        }

        function updateGeometry(geometry, meshData, Meshid)
        {
            var verticesArray = new Float32Array(meshData.faces[Meshid].length * 3 * 3);
            var indicesArray = new Uint32Array(meshData.faces[Meshid].length * 3);
            var uvsArray = new Float32Array(meshData.faces[Meshid].length * 3*2);
            var jointArray = new Uint16Array(meshData.faces[Meshid].length * 3 * 4);
            var weightArray = new Float32Array(meshData.faces[Meshid].length * 3 * 4);

            //var f1=0;
            for (var key=0;key<meshData.faces[Meshid].length;key++)
            {
                indicesArray[key * 3 ]=key * 3 ;
                indicesArray[key * 3 + 1]=key * 3 + 1;
                indicesArray[key * 3 + 2]=key * 3 + 2;

                //position
                var fx=meshData.faces[Meshid][key][0];
                var fy=meshData.faces[Meshid][key][1];
                var fz=meshData.faces[Meshid][key][2];
                verticesArray[key*9]=meshData.vertices[fx][0];
                verticesArray[key*9+1]=meshData.vertices[fx][1];
                verticesArray[key*9+2]=meshData.vertices[fx][2];
                verticesArray[key*9+3]=meshData.vertices[fy][0];
                verticesArray[key*9+4]=meshData.vertices[fy][1];
                verticesArray[key*9+5]=meshData.vertices[fy][2];
                verticesArray[key*9+6]=meshData.vertices[fz][0];
                verticesArray[key*9+7]=meshData.vertices[fz][1];
                verticesArray[key*9+8]=meshData.vertices[fz][2];

                // joint
                jointArray[key * 12 ] = meshData.joints[fx][0];
                jointArray[key * 12 + 1] = meshData.joints[fx][1];
                jointArray[key * 12 + 2] = meshData.joints[fx][2];
                jointArray[key * 12 + 3] = meshData.joints[fx][3];
                jointArray[key * 12 + 4] = meshData.joints[fy][0];
                jointArray[key * 12 + 5] = meshData.joints[fy][1];
                jointArray[key * 12 + 6] = meshData.joints[fy][2];
                jointArray[key * 12 + 7] = meshData.joints[fy][3];
                jointArray[key * 12 + 8] = meshData.joints[fz][0];
                jointArray[key * 12 + 9] = meshData.joints[fz][1];
                jointArray[key * 12 + 10] = meshData.joints[fz][2];
                jointArray[key * 12 + 11] = meshData.joints[fz][3];

                // weight
                weightArray[key * 12 ] = meshData.weights[fx][0];
                weightArray[key * 12 + 1] = meshData.weights[fx][1];
                weightArray[key * 12 + 2] = meshData.weights[fx][2];
                weightArray[key * 12 + 3] = meshData.weights[fx][3];
                weightArray[key * 12 + 4] = meshData.weights[fy][0];
                weightArray[key * 12 + 5] = meshData.weights[fy][1];
                weightArray[key * 12 + 6] = meshData.weights[fy][2];
                weightArray[key * 12 + 7] = meshData.weights[fy][3];
                weightArray[key * 12 + 8] = meshData.weights[fz][0];
                weightArray[key * 12 + 9] = meshData.weights[fz][1];
                weightArray[key * 12 + 10] = meshData.weights[fz][2];
                weightArray[key * 12 + 11] = meshData.weights[fz][3];

                //uv
                uvsArray[key*6]=meshData.uvs[meshData.Uvfaces[Meshid][key][0]][0];
                uvsArray[key*6+1]=meshData.uvs[meshData.Uvfaces[Meshid][key][0]][1];
                uvsArray[key*6+2]=meshData.uvs[meshData.Uvfaces[Meshid][key][1]][0];
                uvsArray[key*6+3]=meshData.uvs[meshData.Uvfaces[Meshid][key][1]][1];
                uvsArray[key*6+4]=meshData.uvs[meshData.Uvfaces[Meshid][key][2]][0];
                uvsArray[key*6+5]=meshData.uvs[meshData.Uvfaces[Meshid][key][2]][1];
            }
            geometry.setIndex( new THREE.BufferAttribute(indicesArray, 1));
            geometry.addAttribute( 'position', new THREE.BufferAttribute(verticesArray , 3));
            geometry.addAttribute('uv', new THREE.BufferAttribute(uvsArray,2));
            geometry.addAttribute('skinIndex' , new THREE.BufferAttribute(jointArray , 4));
            geometry.addAttribute('skinWeight' , new THREE.BufferAttribute(weightArray , 4));

            geometry.computeVertexNormals();
            verticesArray=null;
            indicesArray=null;
            uvsArray=null;
            jointArray=null;
            weightArray=null;
            geometry.needsUpdate = true;
        }

        function startPmLoading(THIS){
            loadPmMesh(pmCount,splitCount,THIS,function()
            {
                if (pmCount < splitCount)//splitCount是总数
                {
                    setTimeout(function () {
                        if(pmDeltaTime===0)startPmLoading(THIS);
                    },THIS.PMDelay);//增量信息的加载优先级不是很高
                    //setTimeout(function(){} , pmDeltaTime);
                } else {//完成了全部PM文件的加载
                    THIS.finished=true;
                    function loopLODCheck(){
                        requestAnimationFrame(loopLODCheck);
                        THIS.LODCheck();
                    }
                    if(THIS.LODArray.length>0)loopLODCheck();
                    console.log('already loaded all PM file!');
                }
            });
            pmCount++;
        }


        //加载一个PM的json文件
        function loadPmMesh(index,lengthindex,THIS, callback)
        {
            loadLocalFile(pmFilesUrl + '/pmmesh' + index + '.json', function (data)
            {
                var pmData = JSON.parse(data);
                pmRestore(pmData,index,lengthindex,THIS);
                if (callback) callback();
            });
        }
    },

    //以下与动画相关的代码
    ainmationInit:function(){//存储骨骼矩阵，循环播放动画
        var THIS=this;
        THIS.glbObj.scene.traverse( function(node){//获取骨骼
            if (node instanceof THREE.Mesh&&!THIS.skeletonBones)//node是THREE.Mesh类型的实例，且pmSkeletonBones为空
            {//00001//存储所有的骨骼骨头和变换矩阵
                var bones = [];
                cloneBones(node.skeleton.bones[0], bones);
                THIS.skeletonBones=THIS.skeletonBones= new THREE.Skeleton(bones, node.skeleton.boneInverses);
                THIS.skeletonMatrix=THIS.SkeletonMatrix =  node.matrixWorld.clone();
            }
        });

        loopAnimationRun();
        function loopAnimationRun(){//循环播放动画
            requestAnimationFrame(loopAnimationRun);
            THIS.animationRun();
        }
        function cloneBones(rootBone, boneArray)//用于加载完gltf文件后的骨骼动画的处理
        {
            var rootBoneClone=rootBone.clone();
            rootBoneClone.children.splice(0,rootBoneClone.children.length);
            boneArray.push(rootBoneClone);
            for (var i = 0 ; i < rootBone.children.length ; ++i)
                rootBoneClone.add(cloneBones(rootBone.children[i], boneArray));
            return rootBoneClone;
        }
    },
    aimationMixerInit:function(animationClips){//生成动画混合器
        this.rootObject.animations=animationClips;//animationClips是AnimationClip数组类型的，存放了5个动画//animationClips里面有多个动作，动作的切换是可行的//animationClips[0]=animationClips[1];//Clip是削减的意思
        this.animationMixer=new THREE.AnimationMixer(this.rootObject.children[0]);//动画混合器animationMixer是用于场景中特定对象的动画的播放器
        this.animationMixer.clipAction(this.rootObject.animations[this.animationType]).play();//动画剪辑AnimationClip是一个可重用的关键帧轨道集，它代表动画。
        //完成设置动画
        for(var k=0;k<this.rootObject.animations.length;k++)
            this.animationMixers.push(
                this.animationMixer.clipAction(this.rootObject.animations[k])
            );
    },
    animationRun:function(){//更新动作从而播放连续的动画
        if(this.animationMixer)this.animationMixer.update(this.animationSpeed);
    },
    updateAnimation:function(i){//这个函数可以切换动画
        this.animationMixer=this.animationMixers[i];
        this.animationMixer.play();
        for(var k=0;k<this.animationMixers.length;k++)
            if(k!==i)this.animationMixers[k].stop();
    },

    //以下是与LOD相关的代码
    LODCheck:function(){//完成加载全部PM文件后就不断执行这个函数
        this.updateMesh(this.computeLODLevel());//数组的下标0-(l+1)
    },
    computeLODLevel:function(){//计算LOD等级//等级越大模型越精细
        var distance=Math.sqrt(//this.rootObject的位置估计是在原点
            Math.pow(this.camera.position.x - this.rootObject.position.x,2)
            + Math.pow(this.camera.position.y - this.rootObject.position.y,2)
            + Math.pow(this.camera.position.z - this.rootObject.position.z,2)
        );
        var level=0;//位置处于(l-1)之后精度最低//分几段就有几个等级，级别编号从0开始,这是等级编号的最大值
        if(distance<this.LODArray[0])level=this.LODArray.length;//位置处于0之前精度最高
        for(var i=1;i<this.LODArray.length;i++)
            if(distance>this.LODArray[i-1]&&distance<this.LODArray[i]){
                level=this.LODArray.length-i-1;
                break;
            }
        //return level;//越远等级越小
        return level;
    },
    updateMesh:function(i){//这个函数的作用是协助实现LOD//0 - pmMeshHistory-1
        var skeletonBones=this.skeletonBones,skeletonMatrix=this.skeletonMatrix;
        if(this.preLODIndex===i||i>=this.pmMeshHistory.length||i<0){this.preLODIndex=i;return;}
        this.preLODIndex=i;
        if(!this.pmMeshHistory[i].parent){
            this.rootObject.add(this.pmMeshHistory[i]);

            this.rootObject.remove(this.mesh[0]);

            this.mesh[0]=this.pmMeshHistory[i];//console.log(this.pmMeshHistory);

            if(skeletonBones!==undefined){
                var skinnedMesh =this.rootObject.children[0];
                skinnedMesh.add(skeletonBones.bones[0]);
                skinnedMesh.bind(skeletonBones,skeletonMatrix);
            }

        }
    },
}