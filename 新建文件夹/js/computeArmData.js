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

//不进行插值
function computeArmData(mesh,animation,callback){
        var nameTest="输出帧序号，用于验证";
        //console.log('start test:' + nameTest);
        //开始测试
        //开始计算matrix
        //var animation=glb.animations[0];
        var data = [];
        for (var Time = 0; Time < 35; Time++) {//只输出一帧
                var time = Time;
                //console.log(time);
                matrixs0 = [];
                matrixs = [];
                for (i = 0; i < 25; i++) {
                        //console.log(Time);
                        matrixs0.push(
                            compose(
                                animation.tracks[3 * i + 1].values[4 * time],
                                animation.tracks[3 * i + 1].values[4 * time + 1],
                                animation.tracks[3 * i + 1].values[4 * time + 2],
                                animation.tracks[3 * i + 1].values[4 * time + 3],

                                animation.tracks[3 * i + 2].values[3 * time],
                                animation.tracks[3 * i + 2].values[3 * time + 1],
                                animation.tracks[3 * i + 2].values[3 * time + 2],

                                animation.tracks[3 * i].values[3 * time],
                                animation.tracks[3 * i].values[3 * time + 1],
                                animation.tracks[3 * i].values[3 * time + 2]
                            )
                        );


                        matrixs.push(
                            mesh.skeleton.boneInverses[i].clone()
                        );
                }


                /////矩阵3没有乘以逆矩阵
                var tool = matrixs0[0];
                matrixs[0] = tool.clone().multiply(matrixs[0]);
                tool = tool.clone().multiply(matrixs0[1]);
                matrixs[1] = tool.clone().multiply(matrixs[1]);
                tool = tool.clone().multiply(matrixs0[2]);
                matrixs[2] = tool.clone().multiply(matrixs[2]);
                tool = tool.clone().multiply(matrixs0[3]);
                var _tool3 = tool;
                matrixs[3] = tool.clone().multiply(matrixs[3]);
                tool = tool.clone().multiply(matrixs0[4]);
                matrixs[4] = tool.clone().multiply(matrixs[4]);
                tool = tool.clone().multiply(matrixs0[5]);
                matrixs[5] = tool.clone().multiply(matrixs[5]);
                tool = tool.clone().multiply(matrixs0[6]);
                matrixs[6] = tool.clone().multiply(matrixs[6]);

                tool = _tool3;
                tool = tool.clone().multiply(matrixs0[7]);
                matrixs[7] = tool.clone().multiply(matrixs[7]);
                tool = tool.clone().multiply(matrixs0[8]);
                matrixs[8] = tool.clone().multiply(matrixs[8]);
                tool = tool.clone().multiply(matrixs0[9]);
                matrixs[9] = tool.clone().multiply(matrixs[9]);
                tool = tool.clone().multiply(matrixs0[10]);
                matrixs[10] = tool.clone().multiply(matrixs[10]);

                tool = _tool3;
                tool = tool.clone().multiply(matrixs0[11]);
                matrixs[11] = tool.clone().multiply(matrixs[11]);
                tool = tool.clone().multiply(matrixs0[12]);
                matrixs[12] = tool.clone().multiply(matrixs[12]);
                tool = tool.clone().multiply(matrixs0[13]);
                matrixs[13] = tool.clone().multiply(matrixs[13]);
                tool = tool.clone().multiply(matrixs0[14]);
                matrixs[14] = tool.clone().multiply(matrixs[14]);

                tool = matrixs0[0].clone().multiply(matrixs0[15]);
                matrixs[15] = tool.clone().multiply(matrixs[15]);
                tool = tool.clone().multiply(matrixs0[16]);
                matrixs[16] = tool.clone().multiply(matrixs[16]);
                tool = tool.clone().multiply(matrixs0[17]);
                matrixs[17] = tool.clone().multiply(matrixs[17]);
                tool = tool.clone().multiply(matrixs0[18]);
                matrixs[18] = tool.clone().multiply(matrixs[18]);
                tool = tool.clone().multiply(matrixs0[19]);
                matrixs[19] = tool.clone().multiply(matrixs[19]);

                tool = matrixs0[0].clone().multiply(matrixs0[20]);
                matrixs[20] = tool.clone().multiply(matrixs[20]);
                tool = tool.clone().multiply(matrixs0[21]);
                matrixs[21] = tool.clone().multiply(matrixs[21]);
                tool = tool.clone().multiply(matrixs0[22]);
                matrixs[22] = tool.clone().multiply(matrixs[22]);
                tool = tool.clone().multiply(matrixs0[23]);
                matrixs[23] = tool.clone().multiply(matrixs[23]);
                tool = tool.clone().multiply(matrixs0[24]);
                matrixs[24] = tool.clone().multiply(matrixs[24]);
                //完成计算matrix

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


        //完成测试
}

function computeAllData(mesh,animation,callback){
        var nameTest="输出帧序号，用于验证";
        //console.log('start test:' + nameTest);
        //开始测试
        //开始计算matrix
        //var animation=glb.animations[0];
        var data = [];
        for (var Time = 0; Time < 35; Time++) {//只输出一帧
                var time = Time;
                //console.log(time);
                matrixs0 = [];
                matrixs = [];
                for (i = 0; i < 25; i++) {
                        //console.log(Time);
                        matrixs0.push(
                            compose(
                                animation.tracks[3 * i + 1].values[4 * time],
                                animation.tracks[3 * i + 1].values[4 * time + 1],
                                animation.tracks[3 * i + 1].values[4 * time + 2],
                                animation.tracks[3 * i + 1].values[4 * time + 3],

                                animation.tracks[3 * i + 2].values[3 * time],
                                animation.tracks[3 * i + 2].values[3 * time + 1],
                                animation.tracks[3 * i + 2].values[3 * time + 2],

                                animation.tracks[3 * i].values[3 * time],
                                animation.tracks[3 * i].values[3 * time + 1],
                                animation.tracks[3 * i].values[3 * time + 2]
                            )
                        );


                        matrixs.push(
                            mesh.skeleton.boneInverses[i].clone()
                        );
                }


                /////矩阵3没有乘以逆矩阵
                var tool = matrixs0[0];
                matrixs[0] = tool.clone().multiply(matrixs[0]);
                tool = tool.clone().multiply(matrixs0[1]);
                matrixs[1] = tool.clone().multiply(matrixs[1]);
                tool = tool.clone().multiply(matrixs0[2]);
                matrixs[2] = tool.clone().multiply(matrixs[2]);
                tool = tool.clone().multiply(matrixs0[3]);
                var _tool3 = tool;
                matrixs[3] = tool.clone().multiply(matrixs[3]);
                tool = tool.clone().multiply(matrixs0[4]);
                matrixs[4] = tool.clone().multiply(matrixs[4]);
                tool = tool.clone().multiply(matrixs0[5]);
                matrixs[5] = tool.clone().multiply(matrixs[5]);
                tool = tool.clone().multiply(matrixs0[6]);
                matrixs[6] = tool.clone().multiply(matrixs[6]);

                tool = _tool3;
                tool = tool.clone().multiply(matrixs0[7]);
                matrixs[7] = tool.clone().multiply(matrixs[7]);
                tool = tool.clone().multiply(matrixs0[8]);
                matrixs[8] = tool.clone().multiply(matrixs[8]);
                tool = tool.clone().multiply(matrixs0[9]);
                matrixs[9] = tool.clone().multiply(matrixs[9]);
                tool = tool.clone().multiply(matrixs0[10]);
                matrixs[10] = tool.clone().multiply(matrixs[10]);

                tool = _tool3;
                tool = tool.clone().multiply(matrixs0[11]);
                matrixs[11] = tool.clone().multiply(matrixs[11]);
                tool = tool.clone().multiply(matrixs0[12]);
                matrixs[12] = tool.clone().multiply(matrixs[12]);
                tool = tool.clone().multiply(matrixs0[13]);
                matrixs[13] = tool.clone().multiply(matrixs[13]);
                tool = tool.clone().multiply(matrixs0[14]);
                matrixs[14] = tool.clone().multiply(matrixs[14]);

                tool = matrixs0[0].clone().multiply(matrixs0[15]);
                matrixs[15] = tool.clone().multiply(matrixs[15]);
                tool = tool.clone().multiply(matrixs0[16]);
                matrixs[16] = tool.clone().multiply(matrixs[16]);
                tool = tool.clone().multiply(matrixs0[17]);
                matrixs[17] = tool.clone().multiply(matrixs[17]);
                tool = tool.clone().multiply(matrixs0[18]);
                matrixs[18] = tool.clone().multiply(matrixs[18]);
                tool = tool.clone().multiply(matrixs0[19]);
                matrixs[19] = tool.clone().multiply(matrixs[19]);

                tool = matrixs0[0].clone().multiply(matrixs0[20]);
                matrixs[20] = tool.clone().multiply(matrixs[20]);
                tool = tool.clone().multiply(matrixs0[21]);
                matrixs[21] = tool.clone().multiply(matrixs[21]);
                tool = tool.clone().multiply(matrixs0[22]);
                matrixs[22] = tool.clone().multiply(matrixs[22]);
                tool = tool.clone().multiply(matrixs0[23]);
                matrixs[23] = tool.clone().multiply(matrixs[23]);
                tool = tool.clone().multiply(matrixs0[24]);
                matrixs[24] = tool.clone().multiply(matrixs[24]);
                //完成计算matrix

                for (i=0;i<25;i++) {
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


        //完成测试
}
