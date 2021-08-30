class Blur{
    constructor(){
        //开始blur加载
        var bg = document.getElementById("bg");
        setTimeout(function () {
            var imgUrl = './bg.png';
            var imgObject = new Image();
            imgObject.src = imgUrl;
            imgObject.onload = function(){
                bg.src = imgUrl;
                bg.setAttribute('class', 'thumbnails complete');
                if(window.videoMaterial&&window.videoMaterial.map!==window.videoMaterial.map1){
                    window.videoMaterial.map.image =bg;
                    window.videoMaterial.map.needsUpdate = true;
                }
            }
        },500)
        //完成blur加载
        bg.width=window.innerWidth;
        bg.height=window.innerHeight;

        var width=120, height=50;
        var oButton=document.createElement('p');//按钮
        oButton.innerHTML="进入会议";
        oButton.style.cssText='font-size:20px;'//字体大小
            +'width:120px;height:50px;'//按钮大小
            +'color:white;'//字体颜色
            +'background:#2ECC71;'//按钮颜色
            +'vertical-align:middle;'
            +'text-align:center;'
            +'line-height:50px;'
            +'border-radius: 6px;'
            +'position:fixed;'//到窗体的位置
            +'left:'+(window.innerWidth/2-width/2)+'px;'//到部件左边距离
            +'top:'+(window.innerHeight/2-height/2)+'px;'; //到部件右边 距离
        oButton.style.cursor='hand';
        oButton.onmouseover=function(){
            oButton.style.cursor='hand';
            oButton.style.borderRadius='70px';
            oButton.style.backgroundColor = '#81F79F';
        }
        oButton.onmouseout=function(){
            oButton.style.cursor='normal';
            oButton.style.borderRadius='6px';
            oButton.style.backgroundColor = '#2ECC71';
        }
        oButton.onmousedown = function() {
            document.getElementById("cheat").style.visibility='hidden';
        }
        oButton.onmouseup = function() {
            oButton.style.backgroundColor = '#81F79F';
            oButton.style.color = 'white';
        }
        document.getElementById("cheat").appendChild(oButton);
    }
}
export{Blur}
