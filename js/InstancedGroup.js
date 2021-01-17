function InstancedGroup(instanceCount,originMesh,animationClip ){
    //若有骨骼，则需要源mesh是skinnedMesh
    this.obj=new THREE.Object3D();
    this.instanceCount=instanceCount;

    if(typeof(animationClip)=="undefined"||animationClip===false)this.haveSkeleton=flase;
    else this.haveSkeleton=true;
    this.originMeshs=originMesh;//这是一个数组，每个元素播放一种动画
    this.animationClip=animationClip;
    this.mesh=null;//实例化渲染对象的网格

    this.speed;
    this.mcol0;//变换矩阵的一部分
    this.mcol1;
    this.mcol2;
    this.mcol3;
    this.scales=[];
    this.rotations=[];
    this.type;
    this.colors;

    this.time=0;//每帧自动加1，加到一定值之后自动归0

    this.dummy=new THREE.Object3D();//dummy仿制品//工具对象

    this.init=function (texSrc){
        for(var i=0;i<this.instanceCount;i++){
            this.scales.push([1,1,1]);
            this.rotations.push([0,0,0]);
        }
        //const instanceCount =2*2;//10 0000//1089
        let texs_length=16;

        this.originMeshs[0].geometry=this.originMeshs[0].geometry.toNonIndexed();

        var geometry = new THREE.InstancedBufferGeometry();//console.log(geometry);
        geometry.instanceCount = this.instanceCount; // set so its initalized for dat.GUI, will be set in first draw otherwise
        //以下是使用geometry设置setAttribute(BufferAttribute/InstancedBufferAttribute)
        //BufferAttribute为每个点分配一组数据:先准备数据再生成空间
        //1-2
        geometry.setAttribute('position', this.originMeshs[0].geometry.attributes.position);//Float32Array
        geometry.setAttribute('inUV',this.originMeshs[0].geometry.attributes.uv);
        //3
        var randoms=new Float32Array(this.originMeshs[0].geometry.attributes.position.count);
        for(i=0;i<randoms.length;i++)
            randoms[i]=Math.random();
        geometry.setAttribute('random',new THREE.BufferAttribute(randoms,1));
        //4-5
        if(this.haveSkeleton){
            geometry.setAttribute('skinIndex',this.originMeshs[0].geometry.attributes.skinIndex);
            geometry.setAttribute('skinWeight',this.originMeshs[0].geometry.attributes.skinWeight);
        }
        //InstancedBufferAttribute为每个对象一组数据：先生成空间，再设置数据
        //6-11
        this.speed=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 1), 1);

        this.mcol0=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol1=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol2=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);
        this.mcol3=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount * 3), 3);

        this.type=new THREE.InstancedBufferAttribute(new Uint16Array(this.instanceCount*4), 4);//头部、上衣、裤子、动作
        this.colors=new THREE.InstancedBufferAttribute(new Float32Array(this.instanceCount*3), 3);

        for(i=0;i<this.instanceCount;i++){
                this.speed.setX(i,i/20+0.01)//Math.random()*9+0.05);
                //this.speed.setX(i,Math.random()*9+0.05);
                this.mcol0.setXYZ(i, 1,0,0);//随机长宽高
                this.mcol1.setXYZ(i, 0,1,0);//四元数、齐次坐标
                this.mcol2.setXYZ(i, 0,0,1);//mcol3.setXYZ(i, 0,0,0);

                this.mcol3.setXYZ(i, 0,0,0);

                this.type.setXYZW(i,
                    Math.floor(Math.random() * texs_length),
                    Math.floor(Math.random() * texs_length),
                    Math.floor(Math.random() * texs_length),
                    Math.floor(Math.random() *2)//Math.random()//这个缓冲区是int类型的//所以这里不能传小数
                );
                this.colors.setXYZ(i,
                    0.0,0.0,0.0
                );
        }
        geometry.setAttribute('speed', this.speed);

        geometry.setAttribute('mcol0', this.mcol0);//四元数、齐次坐标
        geometry.setAttribute('mcol1', this.mcol1);
        geometry.setAttribute('mcol2', this.mcol2);
        geometry.setAttribute('mcol3', this.mcol3);

        geometry.setAttribute('type', this.type);
        geometry.setAttribute('color', this.colors);

        //以下是根据material设置的uniform
        let texs=[];
        for(i=0;i<texs_length;i++){
            texs.push( THREE.ImageUtils.loadTexture(texSrc[i]) ) ;
            texs[i].flipY=false;
            texs[i].wrapS = texs[i].wrapT = THREE.ClampToEdgeWrapping;
        }

        let material;
        if(this.haveSkeleton){
            var skeletonData=[];//16*25//400
            for(i=0;i<this.originMeshs[0].skeleton.boneInverses.length;i++){
                for(j=0;j<this.originMeshs[0].skeleton.boneInverses[i].length;j++)
                    skeletonData.push(0);//全是0矩阵
            }

            var skeletonDataArray=[];//10*25*36//400
            //console.log(this.originMeshs);
            for (j = 0; j < 8; j++)//8个时间点
                for (i = 0; i < this.originMeshs[0].skeleton.boneInverses.length*3; i+=3)//8*3
                    if(
                        i===7*3||
                        i===8*3||
                        i===9*3||
                        i===10*3||

                        i===11*3||
                        i===12*3||
                        i===13*3||
                        i===14*3
                    )/**/
                {//这个36是时间数
                    //for(k=0;k<10;k++)
                    //position
                    skeletonDataArray.push(this.animationClip.tracks[i].values[3*j]);
                    skeletonDataArray.push(this.animationClip.tracks[i].values[3*j+1]);
                    skeletonDataArray.push(this.animationClip.tracks[i].values[3*j+2]);
                    //quaternion
                    skeletonDataArray.push(this.animationClip.tracks[i+1].values[4*j]);
                    skeletonDataArray.push(this.animationClip.tracks[i+1].values[4*j+1]);
                    skeletonDataArray.push(this.animationClip.tracks[i+1].values[4*j+2]);
                    skeletonDataArray.push(this.animationClip.tracks[i+1].values[4*j+3]);
                    //scale
                    skeletonDataArray.push(this.animationClip.tracks[i+2].values[3*j]);
                    skeletonDataArray.push(this.animationClip.tracks[i+2].values[3*j+1]);
                    skeletonDataArray.push(this.animationClip.tracks[i+2].values[3*j+2]);
                    //console.log(i,j)
                }
            //console.log(skeletonDataArray.length)//2880=36*8*10
            material = new THREE.RawShaderMaterial({//原始着色器材质
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

                    ,skeletonMatrixInverse:{value: skeletonData}
                    ,skeletonMatrix:{value: []}

                    ,skeletonData:{value: skeletonDataArray}//8个手臂骨骼的数据
                    ,time:{value: 0.0}
                },
                vertexShader: document.getElementById('vertexShader').textContent,
                fragmentShader: document.getElementById('fragmentShader').textContent,
                side: THREE.DoubleSide
            });
        }else{
            material = new THREE.RawShaderMaterial({//原始着色器材质
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
                },
                vertexShader: document.getElementById('vertexShader0').textContent,
                fragmentShader: document.getElementById('fragmentShader0').textContent,
                side: THREE.DoubleSide
            });
        }

        this.mesh = new THREE.Mesh(geometry, material);//重要
        this.mesh.frustumCulled=false;

        if(this.haveSkeleton){
            this.handleSkeletonAnimation(this.animationClip);
            for(var i=0;i<this.originMeshs.length;i++){
                this.originMeshs[i].visible=false;
                this.obj.add(this.originMeshs[i]);//threeJS中模型的位置尺寸角度变化，似乎是通过骨骼来实现的
            }
            var scope=this;
            var skeletonMatrixInverse=[];//16*25//400
            for(i=0;i<scope.originMeshs[0].skeleton.boneInverses.length;i++){
                temp=scope.originMeshs[0].skeleton.boneInverses[i];
                temp=temp.toArray();
                for(j=0;j<temp.length;j++)
                    skeletonMatrixInverse.push(temp[j]);
            }
            scope.mesh.material.uniforms.skeletonMatrixInverse={value: skeletonMatrixInverse};
        }




        this.obj.add(this.mesh);

        //完成进行实例化渲染
    }
    this.handleSkeletonAnimation=function(animation){
        var scope=this;//scope范围//为了避免this重名
        updateAnimation();
        function updateAnimation() {//每帧更新一次动画
            requestAnimationFrame(updateAnimation);
            scope.time=(scope.time+1.0)%60000;
            scope.mesh.material.uniforms.time={value: scope.time};

            if(scope.time!==20.0)return;
            //开始计算matrix
            /*var data=[];
            for(var time=0;time<8;time++){//0-7
                matrixs0=[];matrixs=[];
                for(i=0;i<25;i++){
                    matrixs0.push(
                        compose(
                            animation.tracks[3*i+1].values[4*time],
                            animation.tracks[3*i+1].values[4*time+1],
                            animation.tracks[3*i+1].values[4*time+2],
                            animation.tracks[3*i+1].values[4*time+3],

                            animation.tracks[3*i+2].values[3*time],
                            animation.tracks[3*i+2].values[3*time+1],
                            animation.tracks[3*i+2].values[3*time+2],

                            animation.tracks[3*i].values[3*time],
                            animation.tracks[3*i].values[3*time+1],
                            animation.tracks[3*i].values[3*time+2]
                        )
                        //scope.originMeshs[0].skeleton.bones[i].matrix.clone()
                    );
                    matrixs.push(
                        scope.originMeshs[0].skeleton.boneInverses[i].clone()
                    );
                }

                //矩阵3没有乘以逆矩阵
                var tool=matrixs0[0];
                matrixs[0]=tool.clone().multiply(matrixs[0]);tool=tool.clone().multiply(matrixs0[1]);
                matrixs[1]=tool.clone().multiply(matrixs[1]);tool=tool.clone().multiply(matrixs0[2]);
                matrixs[2]=tool.clone().multiply(matrixs[2]);tool=tool.clone().multiply(matrixs0[3]);  var  _tool3=tool;



                tool=_tool3;
                tool=tool.clone().multiply(matrixs0[7]);
                matrixs[7]=tool.clone().multiply(matrixs[7]);tool=tool.clone().multiply(matrixs0[8]);
                matrixs[8]=tool.clone().multiply(matrixs[8]);tool=tool.clone().multiply(matrixs0[9]);
                matrixs[9]=tool.clone().multiply(matrixs[9]);tool=tool.clone().multiply(matrixs0[10]);
                matrixs[10]=tool.clone().multiply(matrixs[10]);

                tool=_tool3;
                tool=tool.clone().multiply(matrixs0[11]);
                matrixs[11]=tool.clone().multiply(matrixs[11]);tool=tool.clone().multiply(matrixs0[12]);
                matrixs[12]=tool.clone().multiply(matrixs[12]);tool=tool.clone().multiply(matrixs0[13]);
                matrixs[13]=tool.clone().multiply(matrixs[13]);tool=tool.clone().multiply(matrixs0[14]);
                matrixs[14]=tool.clone().multiply(matrixs[14]);

                var temp=[];
                temp.push(matrixs[7].toArray());
                temp.push(matrixs[8].toArray());
                temp.push(matrixs[9].toArray());
                temp.push(matrixs[10].toArray());
                temp.push(matrixs[11].toArray());
                temp.push(matrixs[12].toArray());
                temp.push(matrixs[13].toArray());
                temp.push(matrixs[14].toArray());
                for(var i=0;i<8;i++){
                    data.push(temp[i][0]);
                    data.push(temp[i][1]);
                    data.push(temp[i][2]);
                    data.push(temp[i][4]);
                    data.push(temp[i][5]);
                    data.push(temp[i][6]);
                    data.push(temp[i][8]);
                    data.push(temp[i][9]);
                    data.push(temp[i][10]);
                    data.push(temp[i][12]);
                    data.push(temp[i][13]);
                    data.push(temp[i][14]);
                }
            }//iii
            let link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.href = URL.createObjectURL(new Blob([JSON.stringify({data:data})], { type: 'text/plain' }));
            link.download ="skeletonData.json";
            link.click();*/



            scope.mesh.material.uniforms.skeletonMatrix={
                "value": [
                    -4.512656269742088,
                    94.90223800285591,
                    -31.19623791336128,
                    0,
                    -0.2622063338033979,
                    -31.239212678767224,
                    -94.99498303115439,
                    0,
                    -99.89781611748916,
                    -4.204979818578449,
                    1.6585312826377945,
                    0,
                    -0.1975276938170811,
                    -33.44611032392678,
                    -39.80350961079591,
                    1,
                    -4.469140964898684,
                    96.70940414803171,
                    -25.046382325749903,
                    0,
                    3.02972174673861,
                    -24.928706679681948,
                    -96.79556685847082,
                    0,
                    -99.85415365304378,
                    -5.084747960105429,
                    -1.8159522060313575,
                    0,
                    -0.9858400190578435,
                    -34.940500799060565,
                    -39.31223045360107,
                    1,
                    -6.384493427509462,
                    99.77440919152875,
                    2.075981730628909,
                    0,
                    4.734888505044303,
                    2.3807227630560748,
                    -99.8594682057082,
                    0,
                    -99.68361704146815,
                    -6.27720820948049,
                    -4.87622886966853,
                    0,
                    -1.5816395312567055,
                    -43.96236126817509,
                    -37.87652720113182,
                    1,
                    -0.08232527792467115,
                    0.9695445128471971,
                    0.23066517585024673,
                    0,
                    0.06808313305834383,
                    0.23638136897045145,
                    -0.9692720964059699,
                    0,
                    -0.9942773891497295,
                    -0.06409101693255502,
                    -0.08547002754437744,
                    0,
                    0.6311891814649118,
                    -45.10707207933926,
                    -81.63964118111745,
                    1,
                    -7.842942139339913,
                    99.07484964548468,
                    11.075445476173247,
                    0,
                    4.870447317597244,
                    11.477184118357723,
                    -99.21971530355516,
                    0,
                    -99.57293761080403,
                    -7.2423041838739515,
                    -5.725562541008952,
                    0,
                    -1.4983216668511665,
                    -45.784222884849385,
                    -37.6275234200084,
                    1,
                    -5.470554119293823,
                    99.83944547550466,
                    1.4700241529281914,
                    0,
                    -1.340714257383935,
                    1.3986371152313497,
                    -99.98122127637563,
                    0,
                    -99.84126616261094,
                    -5.489218046352042,
                    1.2620213681904422,
                    0,
                    2.4492956377320905,
                    -39.45639994941337,
                    -37.39306551308175,
                    1,
                    -99.84127282146804,
                    -5.489232112519777,
                    1.2620379270395756,
                    0,
                    -1.3407315624959948,
                    1.3986526765644813,
                    -99.98123179594232,
                    0,
                    5.470567737299513,
                    -99.8394521319594,
                    -1.4700403875105241,
                    0,
                    1.178099687274675,
                    -40.87520215145449,
                    -37.395854120774814,
                    1,
                    4.51968734779436,
                    95.11868107892252,
                    30.528833369266817,
                    0,
                    7.734950226644472,
                    30.135101391937194,
                    -95.037068252859,
                    0,
                    -99.59792466562543,
                    6.656783793423788,
                    -5.995382939873338,
                    0,
                    -2.7166190034304645,
                    -55.66705354381221,
                    -39.263563418303924,
                    1,
                    -59.359076474489314,
                    75.42351759984973,
                    -28.06768886446824,
                    0,
                    58.609507579317004,
                    16.615095314724968,
                    -79.30236140984607,
                    0,
                    -55.14918295796651,
                    -63.52349413673964,
                    -54.06789997185103,
                    0,
                    -23.962906653320076,
                    -59.28050614488589,
                    -55.64200061825026,
                    1,
                    5.768521031479166,
                    -28.10049123629665,
                    -95.79709670339481,
                    0,
                    97.29486537644519,
                    -19.919522889943224,
                    11.701774127010129,
                    0,
                    -22.37058309309331,
                    -93.88066589035188,
                    26.191236300698336,
                    0,
                    -23.120975487415443,
                    -61.69146846244139,
                    -62.157909049660226,
                    1,
                    5.768518692332587,
                    -28.100492270267267,
                    -95.79710316492981,
                    0,
                    97.29486960804104,
                    -19.91952926251657,
                    11.70177438445155,
                    0,
                    -22.37057461333388,
                    -93.88067526906656,
                    26.19123987650485,
                    0,
                    -23.120969160517483,
                    -61.69147179600691,
                    -62.157907146936374,
                    1,
                    -8.961787451925824,
                    94.8531525284198,
                    30.37384094568698,
                    0,
                    3.920564015145203,
                    30.80888708072441,
                    -95.05498272070916,
                    0,
                    -99.52048486287248,
                    -7.327792333189458,
                    -6.479793643910213,
                    0,
                    -1.039294177120465,
                    -56.60488689961161,
                    -39.473372689066146,
                    1,
                    32.79999987057853,
                    90.34125761481833,
                    -27.61552337137781,
                    0,
                    -54.250559694530324,
                    -5.918300681562879,
                    -83.79651255160022,
                    0,
                    -77.3371874620183,
                    42.46681902292823,
                    47.0694260199326,
                    0,
                    26.42543336634083,
                    -45.21494056707623,
                    -54.40588591089278,
                    1,
                    16.77367774785457,
                    -14.951754974087827,
                    -97.44279855342765,
                    0,
                    -83.81499659057307,
                    -54.200607929807155,
                    -6.111201541686199,
                    0,
                    -51.900829802436334,
                    82.69668571385,
                    -21.623241584523495,
                    0,
                    27.10719651603963,
                    -47.10487001881852,
                    -60.44647310552897,
                    1,
                    16.773678593773433,
                    -14.951754635146434,
                    -97.442797309497,
                    0,
                    -83.81501125458973,
                    -54.20060556310355,
                    -6.111203607661435,
                    0,
                    -51.900836979355766,
                    82.69668704249747,
                    -21.6232430656113,
                    0,
                    27.10720013777003,
                    -47.10486474296685,
                    -60.44647298757252,
                    1,
                    -1.4044006469212842,
                    -2.5006464021789334,
                    -99.95891970534166,
                    0,
                    -8.199107313988804,
                    -99.62924513403155,
                    2.607730426336901,
                    0,
                    -99.65346102931268,
                    8.232498420024744,
                    1.1920728138693675,
                    0,
                    0.7568588922608352,
                    -24.945773699003595,
                    -51.472079583069146,
                    1,
                    25.76234261149901,
                    95.13350130835457,
                    16.910440851266543,
                    0,
                    2.485938816213146,
                    16.842657479278735,
                    -98.53985073177614,
                    0,
                    -96.59187113953412,
                    25.80941944431177,
                    1.975033119653328,
                    0,
                    4.624857632102524,
                    15.946484512535411,
                    -85.69318486604735,
                    1,
                    40.962547709165456,
                    91.22536323522509,
                    0.000987826480439935,
                    0,
                    0.0034541814187747377,
                    -0.0006561353805949466,
                    -99.99979775560152,
                    0,
                    -91.22398177712431,
                    40.96652467578747,
                    -0.002958931723864744,
                    0,
                    3.9778212932653716,
                    3.9004053124220963,
                    -87.92254746985209,
                    1,
                    40.962554992907755,
                    91.22534574096157,
                    0.0009610657613794427,
                    0,
                    0.003433005529672961,
                    -0.0006827501769652855,
                    -99.99979235927282,
                    0,
                    -91.22397607686386,
                    40.96653617269959,
                    -0.0029496245070133043,
                    0,
                    3.977810183194677,
                    3.9003946521510846,
                    -87.92253501104216,
                    1,
                    40.96256778299265,
                    91.22537450022347,
                    0.000960609284650138,
                    0,
                    0.0034332194485173773,
                    -0.0006822453122659056,
                    -99.9997922476826,
                    0,
                    -91.22398982058878,
                    40.966542772181555,
                    -0.0029498233910905114,
                    0,
                    3.9778057238368554,
                    3.9003951097119884,
                    -87.92255008496706,
                    1,
                    4.786795151729103,
                    -2.5626292846879775,
                    -99.85249476898869,
                    0,
                    16.148747588184648,
                    -98.63214075199741,
                    3.3057469805826636,
                    0,
                    -98.57145659846047,
                    -16.283511455319495,
                    -4.303448389329725,
                    0,
                    -2.165355432140414,
                    -25.11522650708726,
                    -51.067013162334874,
                    1,
                    -32.63109753078725,
                    93.39399043858583,
                    14.588504439334992,
                    0,
                    2.841738579810702,
                    16.395334020946375,
                    -98.60555497259784,
                    0,
                    -94.48152322009751,
                    -31.76721418425656,
                    -8.006816053665368,
                    0,
                    -7.0707918723541106,
                    15.251966487265966,
                    -85.0461688481436,
                    1,
                    -38.97029279098934,
                    92.0941127296903,
                    0.002062680569792974,
                    0,
                    -0.005766074019950551,
                    -0.0006347141164155801,
                    -99.99968368973576,
                    0,
                    -92.09136936578788,
                    -38.977579317875275,
                    0.004867670683665892,
                    0,
                    -10.021685489707536,
                    2.649712349814777,
                    -87.92263026061082,
                    1,
                    -38.970294831818464,
                    92.09411815299264,
                    0.0020848960345452028,
                    0,
                    -0.005772798944072122,
                    -0.0006209910938439478,
                    -99.99968362400092,
                    0,
                    -92.0913612503354,
                    -38.97757606778589,
                    0.004867898837798812,
                    0,
                    -10.021690279542277,
                    2.649725169247436,
                    -87.92261907747631,
                    1,
                    -38.97029755308607,
                    92.0941289640069,
                    0.0020881221764434965,
                    0,
                    -0.005772192872240289,
                    -0.0006172879949239984,
                    -99.99969603133691,
                    0,
                    -92.09138824087684,
                    -38.977585434293154,
                    0.004868667181069597,
                    0,
                    -10.021685507883184,
                    2.6497289815665592,
                    -87.92263776274186,
                    1
                ]
            };
        }
        function compose(x,y,z,w,sx,sy,sz,px,py,pz ) {
            var x2 = x + x,	y2 = y + y, z2 = z + z;
            var xx = x * x2, xy = x * y2, xz = x * z2;
            var yy = y * y2, yz = y * z2, zz = z * z2;
            var wx = w * x2, wy = w * y2, wz = w * z2;
            te = new THREE.Matrix4();
            te.set(
                ( 1.0-( yy + zz ) ) * sx,( xy - wz ) * sy        ,( xz + wy ) * sz        ,px,
                ( xy + wz ) * sx        ,( 1.0-( xx + zz ) ) * sy,( yz - wx ) * sz        ,py,
                ( xz - wy ) * sx        ,( yz + wx ) * sy        ,( 1.0-( xx + yy ) ) * sz,pz,
                0.0                     ,0.0                     ,0.0                     ,1.0
            );
            return te;
        }
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

    this.typeSet=function (i,type) {
        this.type.array[4*i  ]=type[0];
        this.type.array[4*i+1]=type[1];
        this.type.array[4*i+2]=type[2];
        this.type.array[4*i+3]=type[3];
    }
    this.colorSet=function (i,color) {
        this.colors.array[3*i  ]=color[0];
        this.colors.array[3*i+1]=color[1];
        this.colors.array[3*i+2]=color[2];
    }
    this.positionSet=function (i,pos){
        this.mcol3.array[3*i  ]=pos[0];
        this.mcol3.array[3*i+1]=pos[1];
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
function SkinnedMeshController() {
    var scope=this;
    this.mesh;
    this.animation;
    this.init=function (originMesh,animation) {
        this.animation=animation;
        this.mesh=originMesh.clone();//new THREE.SkinnedMesh(originMesh.geometry.clone(),originMesh.material)

        this.mesh.geometry=this.mesh.geometry.clone();
        this.mesh.material=this.mesh.material.clone();
        this.mesh.skeleton=this.mesh.skeleton.clone();
        this.mesh.matrixWorld=this.mesh.matrixWorld.clone();
        this.bones = [];
        cloneBones(this.mesh.skeleton.bones[0], this.bones);
        this.mesh.skeleton=new THREE.Skeleton(this.bones, this.mesh.skeleton.boneInverses);

        this.mesh.add(this.mesh.skeleton.bones[0]);//添加骨骼
        this.mesh.bind(this.mesh.skeleton,this.mesh.matrixWorld);//绑定骨架

        //搞清动画混合器AnimationMixer的作用至关重要
        //开始设置动画//进行这个动画设置的时候可能还只是一个基模
        var animationMixer0=new THREE.AnimationMixer(this.mesh);
        animationMixer0.clipAction(animation).play();//不清楚这里的作用


        //var t=0;
        //updateAnimation2_2();
        function updateAnimation3() {//每帧更新一次动画--失败
            t+=0.2;
            var time=Math.floor(t%36);

            //console.log(time);
            for(i=0;i<bones.length;i++) {
                //position
                x = animation.tracks[3 * i].values[3 * time];
                y = animation.tracks[3 * i].values[3 * time + 1];
                z = animation.tracks[3 * i].values[3 * time + 2];
                var m1 = new THREE.Matrix4();
                m1.set(
                    1, 0, 0, x,
                    0, 1, 0, y,
                    0, 0, 1, z,
                    0, 0, 0, 1
                );
                //var test=m1.clone();

                //Quaternion
                x = animation.tracks[3 * i + 1].values[4 * time];
                y = animation.tracks[3 * i + 1].values[4 * time + 1];
                z = animation.tracks[3 * i + 1].values[4 * time + 2];
                w = animation.tracks[3 * i + 1].values[4 * time + 3];
                var m2 = new THREE.Matrix4();
                m2.set(
                    1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w, 2 * x * z + 2 * y * w, 0,
                    2 * x * y + 2 * z * w, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w, 0,
                    2 * x * z - 2 * y * w, 2 * y * z + 2 * x * w, 1 - 2 * x * x - 2 * y * y, 0,
                    0, 0, 0, 1
                );
                //if(i===0)console.log(m2.elements[0])

                //scale
                x = animation.tracks[3 * i + 2].values[3 * time];
                y = animation.tracks[3 * i + 2].values[3 * time + 1];
                z = animation.tracks[3 * i + 2].values[3 * time + 2];
                var m3 = new THREE.Matrix4();
                m3.set(
                    x, 0, 0, 0,
                    0, y, 0, 0,
                    0, 0, z, 0,
                    0, 0, 0, 1
                );
                m1.multiply(m2.multiply(m3));
                //bones[i].matrix.copy(m1);
                for(j=0;j<16;j++){
                    bones[i].matrix.elements[j]=m1.elements[j]*50;
                    bones[i].matrixAutoUpdate=false;
                }
            }
            requestAnimationFrame(updateAnimation3);
        }
        function updateAnimation2_3() {//每帧更新一次动画
            t+=0.5;
            var time=Math.floor(t%36);
            for(i=0;i<bones.length;i++){
                bones[i].matrixAutoUpdate=false;
                bones[i].quaternion.copy(
                    new THREE.Quaternion(
                        animation.tracks[3*i+1].values[4*time],
                        animation.tracks[3*i+1].values[4*time+1],
                        animation.tracks[3*i+1].values[4*time+2],
                        animation.tracks[3*i+1].values[4*time+3]
                    )
                );
            }
            requestAnimationFrame(updateAnimation2_2);
        }
        function updateAnimation2_2() {//每帧更新一次动画--
            t+=0.5;//t=0;
            var time=Math.floor(t%36);
            scope.setTime(time);
            requestAnimationFrame(updateAnimation2_2);
        }
        function updateAnimation2_1() {//每帧更新一次动画
            t+=0.5;
            var time=Math.floor(t%36);

            for(i=0;i<bones.length;i++){
                bones[i].position.set(
                    animation.tracks[3*i].values[3*time],
                    animation.tracks[3*i].values[3*time+1],
                    animation.tracks[3*i].values[3*time+2]
                );
                bones[i].setRotationFromQuaternion(
                    new THREE.Quaternion(
                        animation.tracks[3*i+1].values[4*time],
                        animation.tracks[3*i+1].values[4*time+1],
                        animation.tracks[3*i+1].values[4*time+2],
                        animation.tracks[3*i+1].values[4*time+3]
                    )
                );
                bones[i].scale.set(
                    animation.tracks[3*i+2].values[3*time],
                    animation.tracks[3*i+2].values[3*time+1],
                    animation.tracks[3*i+2].values[3*time+2]
                );
                bones[i].matrix=compose(
                    bones[i].position, bones[i].quaternion, bones[i].scale
                );
                function compose( position, quaternion, scale ) {

                    //x,y,z,,w,sx,xy,xz,px,py,pz
                    const te = new THREE.Matrix4();

                    const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
                    const x2 = x + x,	y2 = y + y, z2 = z + z;
                    const xx = x * x2, xy = x * y2, xz = x * z2;
                    const yy = y * y2, yz = y * z2, zz = z * z2;
                    const wx = w * x2, wy = w * y2, wz = w * z2;

                    const sx = scale.x, sy = scale.y, sz = scale.z;

                    te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
                    te[ 1 ] = ( xy + wz ) * sx;
                    te[ 2 ] = ( xz - wy ) * sx;
                    te[ 3 ] = 0;

                    te[ 4 ] = ( xy - wz ) * sy;
                    te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
                    te[ 6 ] = ( yz + wx ) * sy;
                    te[ 7 ] = 0;

                    te[ 8 ] = ( xz + wy ) * sz;
                    te[ 9 ] = ( yz - wx ) * sz;
                    te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
                    te[ 11 ] = 0;

                    te[ 12 ] = position.x;
                    te[ 13 ] = position.y;
                    te[ 14 ] = position.z;
                    te[ 15 ] = 1;
                    return te;
                }
            }
            requestAnimationFrame(updateAnimation2_1);
        }
        function updateAnimation2() {//每帧更新一次动画
            t+=0.2;
            var time=Math.floor(t%36);

            for(i=0;i<bones.length;i++){
                bones[i].position.set(
                    animation.tracks[3*i].values[3*time],
                    animation.tracks[3*i].values[3*time+1],
                    animation.tracks[3*i].values[3*time+2]
                );
                bones[i].setRotationFromQuaternion(
                    new THREE.Quaternion(
                        animation.tracks[3*i+1].values[4*time],
                        animation.tracks[3*i+1].values[4*time+1],
                        animation.tracks[3*i+1].values[4*time+2],
                        animation.tracks[3*i+1].values[4*time+3]
                    )
                );
                bones[i].scale.set(
                    animation.tracks[3*i+2].values[3*time],
                    animation.tracks[3*i+2].values[3*time+1],
                    animation.tracks[3*i+2].values[3*time+2]
                );
                bones[i].updateMatrix();
            }
            requestAnimationFrame(updateAnimation2);
        }
        function updateAnimation() {//每帧更新一次动画
            animationMixer0.update(0.05);
            requestAnimationFrame(updateAnimation);
        }

        function cloneBones(rootBone , boneArray){//用于加载完gltf文件后的骨骼动画的处理
            var rootBoneClone=rootBone.clone();
            rootBoneClone.children.splice(0,rootBoneClone.children.length);
            boneArray.push(rootBoneClone);
            for (var i = 0 ; i < rootBone.children.length ; ++i)
                rootBoneClone.add(cloneBones(rootBone.children[i], boneArray));
            return rootBoneClone;
        }
    }
    this.setTime=function (time) {
        var animation=this.animation;
        var bones=this.bones;
        for(i=0;i<bones.length;i++){
            bones[i].matrixAutoUpdate=false;
            bones[i].matrix=scope.compose(
                animation.tracks[3*i+1].values[4*time],
                animation.tracks[3*i+1].values[4*time+1],
                animation.tracks[3*i+1].values[4*time+2],
                animation.tracks[3*i+1].values[4*time+3],

                animation.tracks[3*i+2].values[3*time],
                animation.tracks[3*i+2].values[3*time+1],
                animation.tracks[3*i+2].values[3*time+2],

                animation.tracks[3*i].values[3*time],
                animation.tracks[3*i].values[3*time+1],
                animation.tracks[3*i].values[3*time+2]
            );
        }
    }
    this.compose=function(x,y,z,w,sx,sy,sz,px,py,pz) {
        var x2 = x + x,	y2 = y + y, z2 = z + z;
        var xx = x * x2, xy = x * y2, xz = x * z2;
        var yy = y * y2, yz = y * z2, zz = z * z2;
        var wx = w * x2, wy = w * y2, wz = w * z2;
        te = new THREE.Matrix4();
        te.set(
            ( 1.0-( yy + zz ) ) * sx,( xy - wz ) * sy        ,( xz + wy ) * sz        ,px,
            ( xy + wz ) * sx        ,( 1.0-( xx + zz ) ) * sy,( yz - wx ) * sz        ,py,
            ( xz - wy ) * sx        ,( yz + wx ) * sy        ,( 1.0-( xx + yy ) ) * sz,pz,
            0.0                     ,0.0                     ,0.0                     ,1.0
        );
        return te;
    }
}