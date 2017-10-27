function ScrollPhoto(liParent,list,n,bt){
	// var oParent = document.getElementById(parent);
	var oListParent = document.getElementById(liParent);
	var oLists = oListParent.getElementsByTagName(list);
	var nowleft=0;
	var left=0;
	var timer = null;
	var aLiLenght = oLists.length;
	if(aLiLenght>n){
		// oPrev.style.display = oNext.style.display = 'block';
		oListParent.innerHTML+=oListParent.innerHTML;
		oListParent.style.width=oLists[0].offsetWidth*oLists.length+"px";
	}
	function init(){
		nowleft-=oLists[0].offsetWidth;
		doMove(oListParent,nowleft);
	}
	function doMove(obj,target){
		if(obj.timer){clearInterval(obj.timer);}
		obj.timer=setInterval(function (){
			goMove(obj,target);
		}, 30);
	}
	function goMove(obj,target){
		var iSpeed=(target-left)/5;
		iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
		left+=iSpeed;
		obj.style.left=thisleft(left)+'px';
	};
	function thisleft(left){
		return left-(oListParent.offsetWidth/2)*Math.ceil(left/(oListParent.offsetWidth/2));
	};
	if(bt && aLiLenght>n){
		var timer = setInterval(init,3000)
		// oParent.onmouseover = function(){
		// 	clearInterval(timer);
		// }
		// oParent.onmouseout = function(){
		// 	timer = setInterval(oNext.onclick,3000);
		// }
	}
	// init()
};
ScrollPhoto('uoLists','li',4,true);
/*
	//roll       ===   两个按钮和滚动区父标签，用来操作鼠标悬浮是暂停，离开时运动的效果
	//uoLists    ===   ul标签
	//li          ===   li列表
	//btn_left   ===   左按钮
	//btn_right  ===   右按钮
	//btn_right  ===   右按钮
	//0           ===   大于此数字时才会滚动，否则不会滚动，并且不会出现左右按钮，若无此需求可写0
	//true/false  ===   如果为true，则自动滚动，为false则不会自动滚动

	//布局方法  ul 为绝对定位，无宽；ul父级为相对定位，超出隐藏/其他无要求
*/