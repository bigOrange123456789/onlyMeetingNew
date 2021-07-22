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



function Button(str,color1,color2,color3,size,radius,w,h,parentNode) {
    if(typeof (w)=="undefined")w=100;
    if(typeof (h)=="undefined")h=50;
    if(typeof(parentNode) == "undefined") parentNode = document.body;
    this.element=p(str,color1,color2,color3,size,radius,w,h,parentNode);
    function p(html,color1,color2,color3,size,radius,width,height,parentNode){
        var oButton=document.createElement('p');//按钮
        oButton.innerHTML=html;
        oButton.style.cssText='font-size:'+size+'px;'//字体大小
            +'width:'+width+'px;height:'+height+'px;'//按钮大小
            +'background:'+color1+';'//字体颜色
            +'color:white;'//按钮颜色
            +'vertical-align:middle;'
            +'text-align:center;'
            +'line-height:'+height+'px;'
            +'border-radius: '+radius+'px;'
            +'border: 2px solid '+color1+';'
            +'position:fixed;'//到窗体的位置
            +'left:'+(window.innerWidth-width)+'px;'//到部件左边距离
            +'top:'+0+'px;'; //到部件右边 距离
        //+'cursor:pointer;'
        oButton.style.cursor='hand';
        oButton.onmouseover=function(){
            oButton.style.cursor='hand';
            oButton.style.backgroundColor = color3;
            oButton.style.color = color1;
        }
        oButton.onmouseout=function(){
            oButton.style.cursor='normal';
            oButton.style.backgroundColor = color1;
            oButton.style.color = 'white';
        }
        oButton.onmousedown = function() {
            oButton.style.backgroundColor = color2;
            oButton.style.color = 'black';
        }
        oButton.onmouseup = function() {
            oButton.style.backgroundColor = color3;
            oButton.style.color = 'white';
        }
        parentNode.appendChild(oButton);
        return oButton;
    }
}

function ButtonP(str,color1,color2,size,radius,w,h,parentNode) {
    if(typeof (w)=="undefined")w=100;
    if(typeof (h)=="undefined")h=50;
    if(typeof(parentNode) == "undefined") parentNode = document.body;
    this.element=p(str,color1,color2,size,radius,w,h,parentNode);
    function p(html,color1,color2,size,radius,width,height,parentNode){
        var oButton=document.createElement('p');//按钮
        oButton.innerHTML=html;
        oButton.style.cssText='font-size:'+size+'px;'//字体大小
            +'width:'+width+'px;height:'+height+'px;'//按钮大小
            +'color:'+color1+';'//字体颜色
            +'background:transparent;'//按钮颜色
            +'vertical-align:middle;'
            +'text-align:center;'
            +'line-height:'+height+'px;'
            +'border-radius: '+radius+'px;'
            +'border: 2px solid '+color1+';'
            +'position:fixed;'//到窗体的位置
            +'left:'+(window.innerWidth-width)+'px;'//到部件左边距离
            +'top:'+0+'px;'; //到部件右边 距离
        //+'cursor:pointer;'
        oButton.style.cursor='hand';
        oButton.onmouseover=function(){
            oButton.style.cursor='hand';
            oButton.style.backgroundColor = color1;
            oButton.style.color = 'white';
        }
        oButton.onmouseout=function(){
            oButton.style.cursor='normal';
            oButton.style.backgroundColor = 'transparent';
            oButton.style.color = color1;
        }
        oButton.onmousedown = function() {
            oButton.style.backgroundColor = color2;
            oButton.style.color = 'black';
        }
        oButton.onmouseup = function() {
            oButton.style.backgroundColor = color1;
            oButton.style.color = 'white';
        }
        parentNode.appendChild(oButton);
        return oButton;
    }

    this.tex0=str;
    this.tex1;
    this.f0;
    this.f2;
    this.addEvent1=function (f0,str1,f1) {
        this.f0=f0;
        this.f1=f1;
        this.tex1=str1;
        var scope=this;
        console.log(this.element);
        this.element.οnclick=function(){
            alert(11)
        }/*onclick(function () {
            if(button_material.element.innerHTML===scope.tex0){
                button_material.element.innerHTML=scope.tex1;
                scope.f0();
            }else{
                button_material.element.innerHTML=scope.tex0;
                scope.f1();
            }
        });*/
    }
}

ButtonP.prototype=ButtonS.prototype=Button.prototype=Text.prototype={
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
