function Referee(){
    this.index=0;//记录断言的序号
    this.result=true;
}
Referee.prototype={
    assertion:function (A,B,explain,arrayFlag) {
        if(typeof(explain)==="undefined")explain="";
        if(typeof(arrayFlag)==="undefined")arrayFlag="";
        this.index++;

        if(typeof(A.length)!="undefined"){//为数组
            if(typeof(A.length)==="undefined"){
                this.result=false;
                alert("this assertion is failed!");
                console.log(arrayFlag+"This assertion"+this.index+" is failed!"+explain);
            }else{
                if(A.length!==B.length){
                    alert("this assertion is failed!");
                    console.log(arrayFlag+"This assertion"+this.index+" is failed!"+explain);
                }else if(A.length===0){
                    console.log(arrayFlag+"This assertion"+this.index+" is successful!"+explain);
                }else{
                    for(var i=0;i<A.length;i++)
                        this.assertion(A[i],B[i],explain,i+"/"+A.length+":");
                }
            }
        }else{//不是数组
            if(A!==B){
                this.result=false;
                alert("this assertion is failed!"+explain);
                console.log(arrayFlag+"This assertion"+this.index+" is failed!"+explain);
            }else console.log(arrayFlag+"This assertion"+this.index+" is successful!"+explain);
        }

    },
}