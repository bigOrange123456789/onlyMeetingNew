function compose(x,y,z,w,sx,sy,sz,px,py,pz ) {//quaternion scale,position
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
function computeArmData(myData,callback){
                var nameTest="输出帧序号，用于验证";
                console.log('start test:'+nameTest);
                //开始测试
                var loader= new THREE.GLTFLoader();
                loader.load("../../myModel/avatar/Female.glb", (glb) => {
                        new ParamMeasure(glb.animations[0],2,myData);//设置举手动作

                        var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"

                        //开始计算matrix
                        var animation=glb.animations[0];
                        var data=[];
                        for(var Time=0;Time<1;Time++){//只输出一帧
                                var time=Time/2;
                                //console.log(time);
                                matrixs0=[];//bone.matrix
                                matrixs=[];//skeleton.boneInverses
                                for(i=0;i<25;i++){
                                        if(time===Math.floor(time)){
                                                //console.log(Time);
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
                                                );
                                        }else{
                                                var time1=Math.floor(time);
                                                var time2=(time1+1)//%8;//console.log(time,time2);
                                                var q1,q2,q3,q4;
                                                q1=animation.tracks[3*i+1].values[4*time1];
                                                q2=animation.tracks[3*i+1].values[4*time1+1];
                                                q3=animation.tracks[3*i+1].values[4*time1+2];
                                                q4=animation.tracks[3*i+1].values[4*time1+3];

                                                var p1,p2,p3,p4;
                                                p1=animation.tracks[3*i+1].values[4*time2];
                                                p2=animation.tracks[3*i+1].values[4*time2+1];
                                                p3=animation.tracks[3*i+1].values[4*time2+2];
                                                p4=animation.tracks[3*i+1].values[4*time2+3];

                                                var A={},B={};
                                                B.x=q1;
                                                B.y=q2;
                                                B.z=q3;
                                                B.w=q4;
                                                A.x=p1;
                                                A.y=p2;
                                                A.z=p3;
                                                A.w=p4;

                                                var OUT=makeInterpolated(A,B,0.5);
                                                //console.log(A,B,OUT, (p1+q1)/2, (p2+q2)/2, (p3+q3)/2, (p4+q4)/2);

                                                function makeInterpolated(a,b,t) {//(Quaternion a, Quaternion b, float t)
                                                        var out = {};
                                                        //计算夹角的cos值//计算两个向量的内积
                                                        var cosHalfTheta = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
                                                        //如果两个向量的夹角大于180
                                                        if(cosHalfTheta < 0.0) {
                                                                //b = new Quaternion(b);
                                                                cosHalfTheta = -cosHalfTheta;
                                                                b.x = -b.x;
                                                                b.y = -b.y;
                                                                b.z = -b.z;
                                                                b.w = -b.w;
                                                        }

                                                        //计算两个向量的夹角
                                                        var halfTheta = Math.floor(Math.acos(cosHalfTheta));
                                                        //计算夹角的sin值
                                                        var sinHalfTheta = Math.floor(
                                                            Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta)
                                                        );
                                                        var ratioA;
                                                        var ratioB;
                                                        if(Math.abs(sinHalfTheta) > 0.001) {
                                                                var oneOverSinHalfTheta = 1.0 / sinHalfTheta;
                                                                ratioA = Math.floor(
                                                                    Math.sin((1.0 - t) * halfTheta) * oneOverSinHalfTheta
                                                                );
                                                                ratioB =Math.floor(
                                                                    Math.sin(t * halfTheta) * oneOverSinHalfTheta
                                                                );
                                                        } else {
                                                                ratioA = 1.0 - t;
                                                                ratioB = t;
                                                        }

                                                        //out= ratioA*a + ratioB*b
                                                        out.x = ratioA * a.x + ratioB * b.x;
                                                        out.y = ratioA * a.y + ratioB * b.y;
                                                        out.z = ratioA * a.z + ratioB * b.z;
                                                        out.w = ratioA * a.w + ratioB * b.w;
                                                        var l=Math.pow(
                                                            out.x*out.x+out.y*out.y+out.z*out.z+out.w*out.w,
                                                            0.5
                                                        );//out.normalizeInPlace();
                                                        out.x/=l;out.y/=l;out.z/=l;out.w/=l;
                                                        return out;
                                                }
                                                matrixs0.push(
                                                    compose(//quaternion scale,position
                                                        (p1+q1)/2,
                                                        (p2+q2)/2,
                                                        (p3+q3)/2,
                                                        (p4+q4)/2,
                                                        1,//scale//animation.tracks[3*i+2].values[3*time],
                                                        1,//animation.tracks[3*i+2].values[3*time+1],
                                                        1,//animation.tracks[3*i+2].values[3*time+2],
                                                        (animation.tracks[3*i].values[3*time1  ]+animation.tracks[3*i].values[3*time2])/2,//position
                                                        (animation.tracks[3*i].values[3*time1+1]+animation.tracks[3*i].values[3*time2+1])/2,
                                                        (animation.tracks[3*i].values[3*time1+2]+animation.tracks[3*i].values[3*time2+2])/2
                                                    )
                                                );
                                        }

                                        matrixs.push(
                                            mesh.skeleton.boneInverses[i].clone()
                                        );
                                }
                                console.log("bone.matrix(matrixs0):",matrixs0)
                                console.log("skeleton.boneInverses(matrixs):",matrixs)
                                /////矩阵3没有乘以逆矩阵
                                var tool=matrixs0[0];
                                matrixs[0]=tool.clone().multiply(matrixs[0]);tool=tool.clone().multiply(matrixs0[1]);console.log("m0*m1",tool);
                                matrixs[1]=tool.clone().multiply(matrixs[1]);tool=tool.clone().multiply(matrixs0[2]);
                                matrixs[2]=tool.clone().multiply(matrixs[2]);tool=tool.clone().multiply(matrixs0[3]);  var  _tool3=tool;
                                matrixs[3]=tool.clone().multiply(matrixs[3]);tool=tool.clone().multiply(matrixs0[4]);
                                matrixs[4]=tool.clone().multiply(matrixs[4]);tool=tool.clone().multiply(matrixs0[5]);
                                matrixs[5]=tool.clone().multiply(matrixs[5]);tool=tool.clone().multiply(matrixs0[6]);
                                matrixs[6]=tool.clone().multiply(matrixs[6]);

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

                                tool=matrixs0[0].clone().multiply(matrixs0[15]);
                                matrixs[15]=tool.clone().multiply(matrixs[15]);tool=tool.clone().multiply(matrixs0[16]);
                                matrixs[16]=tool.clone().multiply(matrixs[16]);tool=tool.clone().multiply(matrixs0[17]);
                                matrixs[17]=tool.clone().multiply(matrixs[17]);tool=tool.clone().multiply(matrixs0[18]);
                                matrixs[18]=tool.clone().multiply(matrixs[18]);tool=tool.clone().multiply(matrixs0[19]);
                                matrixs[19]=tool.clone().multiply(matrixs[19]);

                                tool=matrixs0[0].clone().multiply(matrixs0[20]);
                                matrixs[20]=tool.clone().multiply(matrixs[20]);tool=tool.clone().multiply(matrixs0[21]);
                                matrixs[21]=tool.clone().multiply(matrixs[21]);tool=tool.clone().multiply(matrixs0[22]);
                                matrixs[22]=tool.clone().multiply(matrixs[22]);tool=tool.clone().multiply(matrixs0[23]);
                                matrixs[23]=tool.clone().multiply(matrixs[23]);tool=tool.clone().multiply(matrixs0[24]);
                                matrixs[24]=tool.clone().multiply(matrixs[24]);
                                //完成计算matrix
                                console.log("matrixs",matrixs)

                                for (i of [7, 8, 9, 10, 11, 12, 13, 14]) {
                                        var temp = matrixs[i].toArray();
                                        for (j = 0; j < 16; j++) {
                                                //data.push(arr[j]);
                                        }
                                        data.push(temp[0]);
                                        data.push(temp[1]);
                                        data.push(temp[2]);
                                        data.push(temp[4]);
                                        data.push(temp[5]);
                                        data.push(temp[6]);
                                        data.push(temp[8]);
                                        data.push(temp[9]);
                                        data.push(temp[10]);
                                        data.push(temp[12]);
                                        data.push(temp[13]);
                                        data.push(temp[14]);
                                }


                        }//iii
                        //console.log(data);
                        callback(data);
                        //return data;
                        //骨骼数据

                });//
                //完成测试
        }

//computeArmData([[0,0,-0.21575161814689636,-38.924495697021484,-54.877281188964844,-0.5608370900154114,-0.4222858250141144,0.5853126645088196,0.40564215183258057],[1,0,-0.4874242842197418,7.927768707275391,-5.960464477539063e-8,-0.014336264692246914,-0.004835515283048153,-0.3359397351741791,0.9417619705200195],[2,0,0.0000057220458984375,9.266521453857422,-2.5022241928721675e-23,-0.014951975084841251,-0.020958343520760536,0.15044714510440826,0.9882827997207642],[3,0,0.000003814697265625,10.590322494506836,-5.790239675410951e-23,-0.013314386829733849,-0.003246863605454564,-0.09884911775588989,0.9950080513954163],[4,0,0.000006661340194114018,11.914095878601074,-1.9360365699808287e-22,0.012444796971976757,0.000657889642752707,0.06667943298816681,0.9976966381072998],[5,0,0.40158843994140625,6.922981262207031,2.0293120059111961e-16,0.038077253848314285,0.018965067341923714,0.0632040798664093,0.9970936179161072],[6,0,1.1744370460510254,20.246105194091797,-2.3841856489070778e-7,-1.4611224452565352e-9,-4.5306371987408056e-8,0.009999834932386875,0.9999499917030334],[7,0,-0.09006024897098541,10.171510696411133,-4.664562702178955,0.2239595204591751,-0.7625777125358582,0.6049144268035889,-0.04894739389419556],[8,0,-2.9999921321868896,3.021270751953125,5.999990463256836,0.5557844638824463,0.4385012090206146,0.4088503420352936,0.5759007930755615],[9,0,4.8170545596804e-7,21.837299346923828,-0.000002384185791015625,-0.28366369009017944,-0.3385482728481293,0.5523132681846619,0.7070148587226868],[10,0,-1.788135932656587e-7,23.69284439086914,-0.0000031925742405292112,-0.19196966290473938,0.36342960596084595,-0.05237454175949097,0.9101227521896362],[11,0,-0.12407920509576797,10.173603057861328,4.664560794830322,0.8651015758514404,-0.021400339901447296,0.015780117362737656,0.5008915066719055],[12,0,-0.000003764450411836151,10.021260261535645,-0.0000021457672119140625,0.40455693006515503,0.05260740965604782,-0.33740440011024475,0.8483657240867615],[13,0,0.000004834797437069938,24.83322525024414,2.0636716158151103e-7,-0.15671499073505402,-0.33246633410453796,-0.44618386030197144,0.815981924533844],[14,0,0.000015541911125183105,23.693950653076172,-0.0000048577762754575815,-0.03897395730018616,-0.23089616000652313,-0.1287323236465454,0.9636368751525879],[15,0,0.057089537382125854,-4.416308403015137,-7.831920623779297,-0.012659402564167976,0.040043409913778305,-0.7991174459457397,0.59970623254776],[16,0,-4.598636849095783e-8,45.40013885498047,-4.556457255944224e-8,-0.02519671991467476,-0.05477164685726166,-0.80516517162323,0.5899781584739685],[17,0,-7.536504540439637e-7,48.852088928222656,-0.0000018591993011796148,0.4355934262275696,-0.5844413638114929,0.4463110566139221,0.5191272497177124],[18,0,3.3840262858575443e-7,12.231062889099121,0.000012429474736563861,0.25630393624305725,0.007288691122084856,-0.26879727840423584,0.9284412860870361],[19,0,0.0000014156109955365537,6.133963108062744,0.000004917388196190586,6.199135871298722e-9,-0.0000026940360839944333,-3.3760443329811096e-9,1],[20,0,0.03117653727531433,-4.416308403015137,7.8319196701049805,0.053745418787002563,-0.04633507877588272,-0.7984259724617004,0.5978966951370239],[21,0,-0.000003877175004163291,45.39842224121094,-2.8251480443941546e-7,0.06962750852108002,0.006404696498066187,-0.8021194934844971,0.5930559039115906],[22,0,4.795434733750881e-7,48.84587860107422,-0.0000016073043980213697,0.38370779156684875,-0.5564094185829163,0.4918127655982971,0.5489053726196289],[23,0,-0.000001947792725331965,12.336885452270508,9.849327398114838e-7,0.24478314816951752,0.06870441138744354,-0.017395444214344025,0.9669841527938843],[24,0,-0.00000412762119594845,6.175222873687744,-0.0000022500257728097495,-0.0000012483360478654504,0.000007123413979570614,-7.494222842296949e-8,1]]);
