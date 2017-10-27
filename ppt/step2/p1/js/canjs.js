var canvalu = null; 
var cantest = null;
var cantotest = null;
var panel = null;
var intred = 0;//红
var intgreen = 0;//绿
var intblue = 0;//蓝
var transparent = 1;//透明度
var osize = 1;//大小
var oversize = 1;//橡皮擦大小
var isover = false;//是否开启橡皮擦
var redbut = null;
var grebut = null;
var bluebut = null;
var tranbut = null;
var sizebut = null;
var overbut = null;
var ovs = null;
var sa = null;
var ocolor = null;
var cantovalu = null;
var ifclick = false ;//鼠标的状态
var ifyuan = true ;//是否圆滑笔触
var ifGrap = false; //是否绘制图形
var owidth,oheight;
window.onresize = function(){
//	cantotest = document.getElementById("cantotest");
//	cantovalu = document.getElementById("cantovalu");

	cantotest.style.width = $(window).width();
	cantotest.style.height = $(window).height();
	cantovalu.style.width = $(window).width();
	cantovalu.style.height = $(window).height();
	canvalu = cantovalu.getContext("2d");//画板的上下文绑定
	cantest = cantotest.getContext("2d");
}
window.onload = function(){
	panel = document.getElementById("box");
	sa = document.getElementById("but")
	cantotest = document.getElementById("cantotest");
	cantovalu = document.getElementById("cantovalu");
	owidth = $(window).width();
	oheight = $(window).height();
	cantotest.width = $(window).width();
	cantotest.height = $(window).height();
	cantovalu.width = $(window).width();
	cantovalu.height = $(window).height();
	canvalu = cantovalu.getContext("2d");//画板的上下文绑定
	canvalu.lineJoin="round";
	canvasyuanhua();
	cantest = cantotest.getContext("2d");
	redbut = document.getElementById("redbut");
	grebut = document.getElementById("grebut");
	bluebut = document.getElementById("blubut");
	tranbut = document.getElementById("tranbut");
	sizebut = document.getElementById("sizbut");
	ocolor = document.getElementById("ocolor");
	overbut = document.getElementById("overbut");
	ovs = document.getElementById("overs");
}
window.onmouseup=function(){
	panup();
}
function otest(e){
//	/cantotest.offsetHeight*150
	var x = e.clientX/$(window).width()*cantotest.width;
	var y = e.clientY/$(window).height()*cantotest.height;
	canvastest(x,y);
}
function otesto(e){
	var x = e.clientX/$(window).width()*cantotest.width;
	var y = e.clientY/$(window).height()*cantotest.height;
		canvasto(x,y);
}
function canvastest(x,y){//预览
	cantest.beginPath();
	if(!ifclick){
		cantest.clearRect(0,0,owidth,oheight);
	}
	if(isover==false){
	cantest.fillStyle = "rgba("+intred+","+intgreen+","+intblue+","+transparent+")";
	cantest.beginPath();
	cantest.arc(x,y,osize/2,0,Math.PI*2,true);
	cantest.closePath();
	}else{
		cantest.fillStyle = "#000000";
		cantest.strokeRect((x-(oversize/2)),(y-(oversize/2)),oversize,oversize);
	}
	cantest.fill();
}
function myonclick(){
	
	ifclick = true ;
	canvalu.strokeStyle = "rgba("+intred+","+intgreen+","+intblue+","+transparent+")";
	canvalu.lineWidth=osize;
	var x = event.clientX/$(window).width()*cantotest.width;
	var y = event.clientY/$(window).height()*cantotest.height;
	canvalu.moveTo(x,y);
	cantotest.onmousemove=function(){
		otesto(event);
		otest(event);
	}
}
function up(){
	ifclick = false;
	if(ifGrap){
			canvalu.closePath();
			canvalu.fill();
		}
	canvalu.stroke();
	canvalu.beginPath(); 
	canvalu.lineWidth=0;
	cantotest.onmousemove=function(){
		otest(event);
	}
}
function Graphicalclick(but){
	if(ifGrap==true){
		but.innerText = "绘制线条";
		but.style.backgroundColor = "aqua";
		ifGrap = false;
	}else{
		but.innerText = "绘制图形";
		but.style.backgroundColor = "#F0F000";
		ifGrap = true;
	}
}
function colorand(but){//更新绘制图形的背景色
	var srt = document.getElementById("colorvalu").value;
	var stri = /[a-fA-F0-9]{6}/;
	if(stri.exec(srt)&&srt.length==6){
		console.log(srt);
		canvalu.fillStyle = "#"+srt;
		but.innerText = "成功";
		$(but).css("background-color","#"+srt);
	}else{
		but.innerText = "失败";
		$(but).css("background-color","#FF0000");
	}
	
}
function Strokesclick(but){
	if(ifyuan==true){
		but.innerText = "方形笔触";
		but.style.backgroundColor = "#F0F000";
		ifyuan = false;
		canvasfang();
	}else{
		but.innerText = "圆形笔触";
		but.style.backgroundColor = "aqua";
		ifyuan = true;
		canvasyuanhua();
	}
}
function canvasyuanhua(){//圆滑笔触处理
	canvalu.lineCap="round";
}
function canvasfang(){//方形笔触处理
	canvalu.lineCap="square";
}
function canvasto(x,y){//绘制
	if(isover==false){
		canvalu.lineTo(x,y);
	}else{
		canvalu.clearRect((x-(oversize/2)),(y-(oversize/2)),oversize,oversize);
	}
}
function pango(e){//移动调色板
	var x = e.clientX;
	var y = e.clientY;
	panel.style.top = (y-5)+"px";
	panel.style.left = (x-50)+"px";
}
function panto(){
	window.onmousemove=function(){
		pango(event);
	}
}
function panup(){
	window.onmousemove=function(){
	}
}
function redto(){
	window.onmousemove=function(){
		redgo();
	}
}
function redgo(){//红色块位移
	var x = event.clientX;
	var ox = x-sa.offsetLeft-panel.offsetLeft;
	if(ox>=0&&ox<=127.5){
		redbut.style.marginLeft = ox+"px";
		intred = ox*2;
		ToUpdate();
	}
}
function greento(){
	window.onmousemove=function(){
		greengo();
	}
}
function greengo(){//绿色块位移
	var x = event.clientX;
	var ox = x-sa.offsetLeft-panel.offsetLeft;
	if(ox>=0&&ox<=127.5){
		grebut.style.marginLeft = ox+"px";
		intgreen = ox*2;
		ToUpdate();
	}
}
function blueto(){
	window.onmousemove=function(){
		bluego();
	}
}
function bluego(){//蓝色块位移
	var x = event.clientX;
	var ox = x-sa.offsetLeft-panel.offsetLeft;
	if(ox>=0&&ox<=127.5){
		bluebut.style.marginLeft = ox+"px";
		intblue = ox*2;
		ToUpdate();
	}
}
function teanto(){
	console.log("a");
	window.onmousemove=function(){
		teango();
	}
}
function teango(){//透明块位移
	var x = event.clientX;
	var ox = x-sa.offsetLeft-panel.offsetLeft;
	if(ox>=0&&ox<=127.5){
		tranbut.style.marginLeft = ox+"px";
		transparent = ox/127.5;
		ToUpdate();
	}
}
function ToUpdate(){
	ocolor.style.backgroundColor = "rgba("+intred+","+intgreen+","+intblue+","+transparent+")";
}
function sizeto(){
	window.onmousemove=function(){
		sizego();
	}
}
function sizego(){//size块位移
	var x = event.clientX;
	var ox = x-sa.offsetLeft-panel.offsetLeft;
	if(ox>=2&&ox<=127.5){
		sizebut.style.marginLeft = ox+"px";
		osize = ox/2;
	}
}
function toS(){//保存
	var a = document.createElement('a');
	a.href = cantovalu.toDataURL();
	a.download = "tupian";
	// a.download = this;
	a.click();
}
function overto(){
	window.onmousemove=function(){
		overgo();
	}
}
function overclick(){
	console.log(isover);
	if(isover==false){
		ovs.innerText = "关闭橡皮擦";
		ovs.style.backgroundColor = "red";
		isover = true;
	}else{
		ovs.innerText = "开启橡皮擦";
		ovs.style.backgroundColor = "aqua";
		isover = false;
	}
}
function overgo(){//橡皮大小块位移
	var x = event.clientX;
	var ox = x-sa.offsetLeft-panel.offsetLeft;
	if(ox>=2&&ox<=127.5){
		overbut.style.marginLeft = ox+"px";
		oversize = ox/3;
	}
}
function heightos(){//调色板隐藏功能隐藏
	panel.style.height = "300px";
	document.getElementById("ap").onclick = function(){
		heightlong();
	}
}
function heightlong(){//调色板隐藏功能展示
	panel.style.height = "500px";
	document.getElementById("ap").onclick = function(){
		heightos();
	}
}
function getElementViewLeft(element){//获取对象的Left
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}
　　　　if (document.compatMode == "BackCompat"){
　　　　　　var elementScrollLeft=document.body.scrollLeft;
　　　　} else {
　　　　　　var elementScrollLeft=document.documentElement.scrollLeft; 
　　　　}
　　　　return actualLeft-elementScrollLeft;
　}