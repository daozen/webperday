/**
 * Created with JetBrains WebStorm.
 * User: daozen
 * Date: 13-10-28
 * Time: 下午1:43
 * To change this template use File | Settings | File Templates.
 */

var c = document.getElementById("c");
var ctx = c.getContext("2d");

c.height = window.innerHeight;
c.width = window.innerWidth;



var chinesephrase = "ep|";
var chinese = chinesephrase.split("",2);

var font_size = 10;
var columns = c.width/font_size;

var drops = [];
for (var x=0;x<columns;x++){
    drops[x]= Math.random()* c.height;
}

var color = "#0f0";
function draw(){
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0,0, c.width, c.height);

    ctx.fillStyle = color;
    ctx.font = font_size + "px arial";

    for (var i=0;i<document.forms.length;i++){
        document.forms[i].onsubmit = function(){
            setting();
            return false;
        }
    }

    function setting(){
        var stringset = document.getElementsByName("string")[0].value,
            sizeset = document.getElementsByName("fontsize")[0].value,
            colorset = document.getElementsByName("colornum")[0].value;
        if (stringset != "") {
            chinese = stringset;
        } else {
            alert("文字不能为空");
        }

        if (sizeset !="") {
            font_size = sizeset;
        }

        if(colorset !="" ){
            color = "#"+document.getElementsByName('colornum')[0].value;
        } else {
            alert("请输入十六进制颜色！");
        }
    }

    for(var i = 0; i < drops.length; i++) {
        var text = chinese[Math.floor(Math.random()*chinese.length)];
        ctx.fillText(text,i*font_size,drops[i]*font_size);
        if(drops[i]*font_size> c.height && Math.random()>0.975){
            drops[i] = 0;
        }

        drops[i]++;
    }



    setTimeout(draw,33);
}

window.onload = draw;



