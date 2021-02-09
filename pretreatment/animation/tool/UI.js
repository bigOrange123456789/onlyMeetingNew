function Text(str,color,size,parentNode){//文本
    if (typeof(parentNode) == "undefined") parentNode = document.body;
    this.parentNode=parentNode;
    this.str=str;
    this.color=color;
    this.size=size;
    this.element=h1(str,color,size,parentNode);
    function h1(str,color,size,parentNode){
        var oText=document.createElement('h1');
        oText.innerHTML=str;
        oText.style.cssText=
            //'color:skyblue;'+
            'color:'+color+';'+//文字颜色
            //'background:#aff;'+//背景颜色
            'font-size:'+size+'px;'+//文字大小
            //'width:60px;height:40px;'+//文本大小
            'font-weight:normal;'+
            //+'padding-top:50px;'//距离上一个对象的距离
            'position:fixed;'+//到窗体的位置
            'left:'+0+'px;'+//到部件左边距离
            'top:'+0+'px;'; //到部件右边 距离
        parentNode.appendChild(oText);
        return oText;
    }
}
function Button(str,color,size,parentNode) {
    if (typeof(parentNode) == "undefined") parentNode = document.body;
    this.element=p(str,color,"white",size,100,50,parentNode);
    function p(html,color,background,size,width,height,parentNode){
        var oButton=document.createElement('p');//按钮
        oButton.innerHTML=html;
        oButton.style.cssText='font-size:'+size+'px;'//字体大小
            +'width:'+width+'px;height:'+height+'px;'//按钮大小
            +'color:'+color+';'//字体颜色
            +'background:'+background+';'//按钮颜色
            +'margin:20px auto;'
            +'text-align:center;'
            +'line-height:40px;'
            +'position:fixed;'//到窗体的位置
            +'left:'+(window.innerWidth-width)+'px;'//到部件左边距离
            +'top:'+0+'px;'; //到部件右边 距离
        //+'cursor:pointer;'
        oButton.style.cursor='hand';
        oButton.onmouseover=function(){
            oButton.style.cursor='hand';
        }
        oButton.onmouseout=function(){
            oButton.style.cursor='normal';
        }
        parentNode.appendChild(oButton);
        return oButton;
    }
}
Button.prototype=Text.prototype={
    reStr:function(str){
        this.element.innerHTML=str;
    },
    rePos:function (x,y) {
        this.element.style.left=x+'px';
        this.element.style.top=y+'px';
    },
    addEvent:function(event){
        this.element.onclick=event;
    },
}
