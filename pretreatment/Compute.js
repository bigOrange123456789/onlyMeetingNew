function Compute() {
    this.mat_h;
    this.mat_w;
    this.elemTypeNum;
    this.mat;
    this.badPos;
}
Compute.prototype={
    init:function (mat_h,mat_w,elemTypeNum) {
        this.mat_h=mat_h;
        this.mat_w=mat_w;
        this.elemTypeNum=elemTypeNum;
        this.mat=[];
        for(var i=0;i<this.mat_h;i++){
            this.mat.push([]);
            for(var j=0;j<this.mat_w;j++){
                this.mat[i].push(-1);
            }
        }
        this.setMat();
    },
    setMat:function(){
        for(var i=0;i<this.mat_h;i++)
            for(var j=0;j<this.mat_w;j++)
                this.setMatOne(i,j);
    },
    setMatOne: function (i0, j0) {
        this.mat[i0][j0] = 0;
        var max = this.computeF();
        var max_type = 0;
        for (var k = 0; k < this.elemTypeNum; k++) {
            this.mat[i0][j0] = k;
            var f=this.computeF();
            if(f>max){
                max=f;
                max_type=k;
            }
        }
        this.mat[i0][j0] = max_type;
    },
    computeF:function(){
        var min=9999;//没有相同点，到相同点的距离为无穷
        for(var i2=0;i2<this.mat_h;i2++)
            for(var j2=0;j2<this.mat_w;j2++){

                for(var i1=0;i1<this.mat_h;i1++)
                    for(var j1=0;j1<this.mat_w;j1++){
                        if(this.mat[i1][j1]>=0&&this.mat[i1][j1]===this.mat[i2][j2]){
                            if(i1===i2&&j1===j2)continue;
                            var l=Math.pow(
                                Math.pow(i2-i1,2)+
                                Math.pow(j2-j1,2)
                                ,0.5);
                            //console.log([i1,j1],[i2,j2],l);
                            //min=l<min?l:min;
                            if(l<min){
                                min=l;
                                this.badPos=[i1,j1,i2,j2];
                            }
                        }

                    }
            }
        return min;
    },




    symmetry:function(mat0,type){
        if(mat0.length===0)alert();
        var mat=[];
        var h=mat0.length;
        var w=mat0[0].length;
        if(type===0){//左右对称对称
            for(var i=0;i<h;i++){
                mat.push([]);
                for(var j=0;j<w;j++){
                    mat[i].push(mat0[i][w-1-j]);
                }
            }
        }else if(type===1){//上下对称
            for(i=0;i<h;i++){
                mat.push([]);
                for(j=0;j<w;j++){
                    mat[i].push(mat0[h-1-i][j]);
                }
            }
        }else if(type===2){//沿着主线对称
            for(i=0;i<w;i++){
                mat.push([]);
                for(j=0;j<h;j++){
                    mat[i].push(mat0[j][i]);
                }
            }
        }else{//主对角线变行，结果是非矩阵数组
            for(i=0;i<mat0.length;i++){
                mat.push([]);
                for(j=0;j<=i;j++){
                    mat[i].push(mat0[i-j][j]);
                }
            }

            /*var k=i-1;
            var kk=0;
            for(;i>=0;i--){
                kk++;
                mat.push([]);
                for(j=0;j<i;j++){
                    mat[k+kk].push(mat0[k+kk][j]);
                }
            }*/
        }
        return mat;
    },
    computeMinLength:function (mat0) {//mat0是由1和0构成的矩阵
        var scope=this;
        for(var i=0;i<mat0.length;i++)
            for(var j=0;j<mat0[i].length;j++)
            if(mat0[i][j]!==0){
                mat0[i][j]=9999;
        }

        mat0=f1(mat0);
        mat0=f2(mat0);
        mat0=f3(mat0);
        mat0=f4(mat0);


        return mat0;
        function g1() {//到左上边非0元素的距离

        }
        function f1(mat) {//到左边非0元素的距离
            for(var i=0;i<mat.length;i++){
                var flag=99999;
                for(var j=0;j<mat[i].length;j++){
                    if(mat[i][j]===0){
                        flag++;
                    }else{
                        mat[i][j]=flag<mat[i][j]?flag:mat[i][j];
                        flag=1;
                    }
                }
            }
            return mat;
        }
        function f2(mat) {//到右边非0元素的距离
            mat=scope.symmetry(mat,0);
            mat=f1(mat);
            mat=scope.symmetry(mat,0);
            return mat;
        }
        function f3(mat) {//到上边非0元素的距离
            mat=scope.symmetry(mat,2);
            mat=f1(mat);
            mat=scope.symmetry(mat,2);
            return mat;
        }
        function f4(mat) {//到下边非0元素的距离
            mat=scope.symmetry(mat,1);
            mat=f3(mat);
            mat=scope.symmetry(mat,1);
            return mat;
        }

    },
}