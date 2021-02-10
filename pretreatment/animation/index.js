var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
loader.load("animationNew.json", function (animationNew) {
    computeArmData(
        JSON.parse(animationNew).data,
        function (data) {
            loader.load("animationOld.json", function (animationOld) {
                addition(
                    JSON.parse(animationOld).data,
                    data
                );
            });
        });
});

/*
addition(

    [177, 67, 193, 160, 193, 195, 195, 177, 48, 160, 193, 193, 177, 67, 192, 49, 192, 195, 195, 177, 176, 163, 193, 193, 178, 67, 48, 49, 49, 195, 195, 178, 177, 176, 193, 193, 179, 67, 65, 49, 65, 195, 195, 178, 178, 176, 194, 193, 178, 67, 64, 49, 64, 195, 195, 178, 177, 163, 193, 193, 177, 67, 32, 177, 1, 195, 195, 177, 49, 49, 193, 193, 195, 177, 49, 177, 1, 195, 49, 195, 160, 48, 193, 193, 176, 177, 195, 179, 195, 49, 195, 51, 35, 35, 192, 194, 65, 67, 64, 49, 64, 195, 195, 65, 48, 49, 64, 195, 65, 67, 0, 1, 0, 195, 195, 65, 129, 49, 49, 195, 65, 67, 0, 1, 0, 195, 195, 65, 129, 49, 49, 195, 65, 67, 0, 1, 0, 195, 195, 65, 129, 49, 49, 195, 49, 176, 195, 64, 195, 49, 195, 192, 177, 176, 192, 193, 193, 67, 64, 49, 64, 195, 195, 193, 179, 178, 64, 195, 193, 67, 0, 130, 0, 195, 195, 193, 1, 192, 49, 195, 193, 67, 0, 130, 0, 195, 195, 193, 1, 192, 49, 195, 193, 67, 0, 130, 0, 195, 195, 193, 1, 192, 49, 195, 50, 67, 65, 50, 65, 195, 195, 51, 177, 176, 194, 193, 194, 66, 193, 66, 64, 195, 194, 194, 194, 192, 194, 194, 48, 193, 195, 67, 192, 51, 192, 195, 65, 192, 194, 194, 48, 193, 195, 67, 192, 51, 192, 195, 65, 192, 194, 194, 192, 67, 65, 48, 65, 195, 195, 179, 178, 161, 194, 193, 65, 67, 193, 194, 49, 195, 194, 66, 65, 64, 194, 194, 64, 192, 195, 195, 193, 178, 193, 67, 192, 64, 194, 194, 64, 192, 195, 195, 193, 178, 193, 67, 192, 64, 194, 194, 50, 67, 65, 50, 65, 195, 195, 50, 177, 176, 194, 193, 194, 67, 193, 66, 64, 195, 194, 194, 194, 192, 194, 194, 35, 193, 195, 67, 193, 51, 193, 195, 64, 192, 194, 194, 35, 193, 195, 67, 193, 51, 193, 195, 64, 192, 194, 194, 192, 67, 65, 48, 65, 195, 195, 179, 178, 161, 194, 193, 65, 67, 193, 194, 17, 195, 194, 65, 65, 64, 193, 194, 64, 192, 195, 195, 193, 178, 193, 67, 192, 65, 194, 194, 64, 192, 195, 195, 193, 178, 193, 67, 192, 65, 194, 194, 49, 67, 65, 50, 65, 195, 195, 50, 177, 176, 194, 193, 194, 67, 193, 66, 64, 195, 194, 194, 194, 192, 194, 194, 34, 193, 195, 67, 193, 51, 193, 195, 64, 192, 194, 194, 34, 193, 195, 67, 193, 51, 193, 195, 64, 192, 194, 194, 192, 67, 65, 48, 65, 195, 195, 179, 178, 161, 194, 193, 65, 67, 193, 194, 177, 195, 194, 65, 65, 65, 193, 194, 64, 192, 195, 195, 193, 178, 193, 67, 192, 65, 193, 194, 64, 192, 195, 195, 193, 178, 193, 67, 192, 65, 193, 194, 49, 67, 65, 50, 65, 195, 195, 50, 177, 176, 194, 193, 193, 67, 193, 66, 51, 195, 194, 194, 194, 193, 194, 194, 32, 192, 195, 67, 193, 51, 193, 195, 64, 192, 194, 194, 32, 192, 195, 67, 193, 51, 193, 195, 64, 192, 194, 194, 192, 67, 65, 48, 65, 195, 195, 179, 178, 161, 194, 193, 65, 67, 193, 194, 178, 195, 195, 65, 65, 65, 193, 194, 64, 192, 195, 195, 194, 178, 194, 67, 192, 65, 193, 194, 64, 192, 195, 195, 194, 178, 194, 67, 192, 65, 193, 194, 49, 67, 65, 50, 65, 195, 195, 50, 178, 176, 194, 193, 193, 67, 193, 66, 51, 195, 194, 194, 194, 193, 194, 194, 160, 192, 195, 67, 193, 51, 193, 195, 64, 193, 194, 194, 160, 192, 195, 67, 193, 51, 193, 195, 64, 193, 194, 194, 192, 67, 65, 48, 65, 195, 195, 192, 178, 161, 194, 193, 65, 67, 193, 194, 179, 195, 195, 65, 65, 65, 193, 194, 64, 192, 195, 195, 194, 178, 194, 67, 192, 65, 193, 194, 64, 192, 195, 195, 194, 178, 194, 67, 192, 65, 193, 194, 49, 67, 65, 50, 65, 195, 195, 50, 178, 176, 194, 193, 193, 67, 193, 66, 50, 195, 194, 194, 194, 193, 194, 194, 33, 192, 195, 67, 193, 51, 193, 195, 64, 193, 194, 194, 33, 192, 195, 67, 193, 51, 193, 195, 64, 193, 194, 194, 192, 67, 65, 48, 65, 195, 195, 192, 178, 161, 194, 193, 64, 67, 193, 194, 192, 195, 195, 65, 65, 65, 193, 194, 64, 192, 195, 195, 194, 177, 194, 67, 192, 65, 193, 194, 64, 192, 195, 195, 194, 177, 194, 67, 192, 65, 193, 194, 49, 67, 65, 50, 65, 195, 195, 50, 178, 176, 194, 193, 193, 67, 193, 66, 50, 195, 194, 193, 194, 193, 194, 194, 48, 192, 195, 67, 193, 64, 193, 195, 64, 193, 194, 194, 48, 192, 195, 67, 193, 64, 193, 195, 64, 193, 194, 194, 192, 67, 65, 48, 65, 195, 195, 192, 178, 160, 194, 193, 64, 67, 193, 194, 192, 195, 195, 65, 65, 65, 193, 194, 64, 192, 195, 194, 194, 177, 194, 66, 192, 65, 193, 194, 64, 192, 195, 194, 194, 177, 194, 66, 192, 65, 193, 194, 49, 67, 65, 50, 65, 195, 195, 50, 178, 176, 194, 193, 193, 67, 193, 66, 49, 194, 194, 193, 194, 193, 193, 194, 48, 192, 195, 67, 193, 64, 193, 195, 64, 193, 194, 194, 48, 192, 195, 67, 193, 64, 193, 195, 64, 193, 194, 194, 192, 67, 65, 48, 65, 195, 195, 192, 177, 147, 194, 193, 64, 67, 193, 194, 192, 195, 195, 65, 65, 65, 193, 194, 64, 192, 195, 194, 194, 176, 194, 66, 192, 65, 193, 194, 64, 192, 195, 194, 194, 176, 194, 66, 192, 65, 193, 194, 162, 180, 57, 118, 58, 181, 231, 137, 142, 217, 78, 142, 175, 199, 249, 6, 249, 200, 230, 227, 146, 107, 93, 136, 108, 229, 253, 76, 18, 231, 229, 99, 93, 113, 185, 122, 45, 183, 41, 136, 45, 184, 227, 146, 106, 144, 50, 136, 214, 223, 107, 38, 110, 225, 228, 177, 115, 100, 198, 119, 89, 231, 143, 150, 95, 231, 230, 89, 150, 105, 129, 118, 230, 89, 150, 150, 97, 231, 89, 231, 143, 231, 143, 118, 109, 7, 231, 98, 227, 15, 228, 101, 89, 43, 249, 2, 8, 181, 168, 33, 166, 217, 195, 9, 165, 243, 159, 89, 156, 142, 0, 85, 0, 231, 142, 156, 31, 142, 139, 111, 156, 142, 0, 83, 0, 231, 142, 156, 30, 142, 139, 111, 156, 142, 0, 83, 0, 231, 142, 156, 30, 142, 139, 111, 250, 241, 230, 157, 219, 62, 218, 158, 205, 211, 251, 254, 64, 167, 146, 58, 165, 217, 178, 55, 56, 165, 153, 81, 133, 153, 203, 59, 0, 231, 153, 133, 235, 100, 8, 111, 133, 153, 205, 59, 0, 231, 153, 133, 235, 100, 8, 111, 133, 153, 205, 59, 0, 231, 153, 133, 235, 100, 8, 111, 106, 180, 54, 116, 50, 181, 228, 14, 150, 230, 46, 137, 64, 254, 29, 65, 134, 37, 66, 116, 7, 242, 63, 38, 125, 16, 194, 201, 233, 19, 246, 165, 4, 236, 87, 102, 125, 16, 194, 201, 233, 19, 246, 165, 4, 236, 87, 102, 105, 177, 53, 196, 56, 181, 226, 174, 3, 206, 54, 138, 222, 66, 16, 18, 22, 79, 187, 37, 200, 248, 5, 22, 147, 199, 200, 150, 135, 75, 111, 130, 240, 253, 26, 83, 147, 199, 200, 150, 135, 75, 111, 130, 240, 253, 26, 83, 44, 181, 53, 126, 49, 181, 228, 214, 180, 232, 46, 136, 39, 15, 29, 73, 120, 33, 82, 97, 12, 246, 53, 40, 81, 10, 195, 193, 6, 43, 18, 159, 254, 241, 76, 104, 81, 10, 195, 193, 6, 43, 18, 159, 254, 241, 76, 104, 107, 177, 51, 202, 55, 182, 226, 190, 13, 188, 54, 138, 173, 93, 14, 21, 168, 77, 216, 251, 203, 253, 241, 24, 155, 187, 201, 126, 187, 61, 162, 108, 237, 2, 5, 85, 155, 187, 201, 126, 187, 61, 162, 108, 237, 2, 5, 85, 238, 182, 51, 136, 48, 182, 228, 157, 209, 234, 45, 136, 15, 32, 29, 81, 106, 30, 96, 78, 18, 251, 42, 42, 9, 5, 197, 185, 35, 71, 46, 152, 247, 247, 66, 106, 9, 5, 197, 185, 35, 71, 46, 152, 247, 247, 66, 106, 109, 177, 49, 207, 53, 182, 225, 205, 22, 169, 53, 138, 123, 116, 14, 24, 21, 75, 241, 209, 208, 1, 220, 26, 161, 176, 202, 100, 236, 36, 212, 84, 232, 7, 240, 87, 161, 176, 202, 100, 236, 36, 212, 84, 232, 7, 240, 87, 176, 182, 50, 147, 47, 182, 228, 101, 239, 236, 45, 136, 246, 48, 28, 88, 154, 26, 110, 58, 24, 0, 31, 44, 167, 255, 198, 175, 63, 91, 74, 144, 240, 251, 55, 108, 167, 255, 198, 175, 63, 91, 74, 144, 240, 251, 55, 108, 110, 178, 48, 213, 52, 182, 225, 220, 32, 151, 53, 138, 71, 137, 13, 24, 43, 73, 9, 164, 211, 3, 200, 28, 168, 164, 203, 71, 28, 24, 4, 56, 228, 11, 219, 89, 168, 164, 203, 71, 28, 24, 4, 56, 228, 11, 219, 89, 114, 183, 49, 157, 46, 182, 229, 44, 12, 238, 45, 136, 220, 63, 28, 95, 11, 22, 123, 37, 30, 4, 20, 47, 107, 249, 200, 165, 91, 115, 102, 135, 232, 0, 43, 111, 107, 249, 200, 165, 91, 115, 102, 135, 232, 0, 43, 111, 112, 178, 46, 219, 51, 183, 225, 100, 41, 132, 53, 138, 19, 155, 12, 24, 72, 71, 29, 119, 216, 5, 179, 29, 172, 152, 205, 39, 74, 2, 51, 27, 224, 13, 198, 91, 172, 152, 205, 39, 74, 2, 51, 27, 224, 13, 198, 91, 107, 184, 47, 166, 44, 183, 229, 39, 24, 241, 44, 136, 194, 77, 28, 107, 159, 14, 130, 17, 41, 10, 12, 52, 160, 242, 202, 154, 116, 201, 129, 127, 221, 6, 34, 116, 160, 242, 202, 154, 116, 201, 129, 127, 221, 6, 34, 116, 112, 178, 45, 204, 49, 183, 225, 101, 25, 28, 52, 138, 234, 164, 18, 33, 107, 63, 36, 89, 227, 10, 163, 35, 164, 146, 207, 16, 106, 140, 85, 4, 216, 17, 182, 97, 164, 146, 207, 16, 106, 140, 85, 4, 216, 17, 182, 97, 100, 184, 45, 176, 42, 183, 228, 34, 37, 245, 44, 136, 168, 91, 28, 118, 47, 5, 137, 252, 53, 16, 3, 58, 100, 235, 203, 143, 141, 105, 155, 118, 210, 11, 25, 122, 100, 235, 203, 143, 141, 105, 155, 118, 210, 11, 25, 122, 112, 179, 43, 189, 47, 184, 225, 101, 9, 181, 51, 138, 194, 171, 24, 41, 130, 54, 41, 59, 238, 14, 147, 42, 155, 140, 209, 248, 136, 18, 118, 235, 207, 21, 166, 103, 155, 140, 209, 248, 136, 18, 118, 235, 207, 21, 166, 103, 93, 185, 44, 185, 41, 184, 228, 29, 49, 248, 43, 136, 142, 104, 27, 129, 189, 253, 143, 230, 65, 21, 250, 64, 158, 228, 205, 131, 166, 113, 181, 109, 198, 16, 16, 128, 158, 228, 205, 131, 166, 113, 181, 109, 198, 16, 16, 128, 112, 179, 42, 173, 46, 185, 225, 102, 249, 15, 51, 138, 153, 178, 29, 48, 154, 45, 45, 28, 250, 17, 131, 48, 146, 135, 211, 222, 165, 161, 150, 210, 198, 24, 149, 109, 146, 135, 211, 222, 165, 161, 150, 210, 198, 24, 149, 109],

    [13.957817118526128, 98.71323836607789, -7.802122796964473, -49.697494519695624, 0.1684466714265085, -86.77631865089265, -85.64659802680369, 15.989551835298336, 49.08152859283494, 28.67500619420345, -31.34429292254344, -42.04650420698851, -93.43129672556356, 33.480793082967665, 12.232293165027667, 12.604594954124707, 63.13156539328077, -76.52143186463304, -33.342417296654176, -69.9531562700653, -63.2047388443709, -3.880521013285513, -72.37932683055925, -55.87898565443234, -38.288988527923, 15.827010372067596, -91.01349166734467, 77.41296905568942, -48.264705997083766, -40.96041197302108, -50.41022181112712, -86.13957086405611, 6.22791460606267, -29.810652550150834, -41.62607415268531, -52.868744143396945, -88.37339447156955, 24.161794965813844, -40.079292096840305, 13.03824187872761, -69.53913236761949, -70.67048034938915, -44.946073041830516, -67.67955237842462, 58.30379899953465, -17.230249811739032, -28.21142854466042, -19.518499843518832, -11.898303922512952, 93.66262620518744, 32.95064259200601, -11.970037492512546, 31.591203565594007, -94.12076290924396, -98.5654590914011, -15.142978594896181, 7.452656348875188, 6.9054154346129595, -49.26625917336915, -40.28458201039099, 28.628067552263975, 89.48128473876608, -34.25686450771336, -59.08727697467934, -11.657874499879332, -79.82971934974427, -75.42625245952365, 43.09516468878105, 49.534656494513484, 28.623396651678814, -35.76398915636963, -55.40860213969181, 89.73335613349857, 8.661312516367683, -43.277142001022455, -35.2081423910272, -45.0809527921153, -82.02495599992254, -26.61415336429849, 88.84081487834752, -37.40312501488078, 7.119559519163701, -43.768679347247954, -26.843882071766153, 96.77147932867288, -24.849414581546142, -4.217846975306269, -18.21637545291545, -57.38826678504792, -79.8420408445743, 17.41974677092057, 78.03264715795748, -60.06211389348539, -18.12040180573198, -37.11513811042491, -14.47140272842443]

);*/