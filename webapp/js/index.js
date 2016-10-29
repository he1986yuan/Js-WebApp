//参数1：给哪个元素绑定事件
//参数2：绑定的事件类型
//参数3，事件发生时触发的函数
function bindEvent(element,eventType,fn){
	//区分浏览器类型
	if(element.attachEvent){
		//说明是IE浏览器
		element.attachEvent("on"+eventType,fn);
	}else{
		//谷歌、火狐等
		element.addEventListener(eventType, fn, false)
	}
}

function $(id){
	return document.getElementById(id);
}

//检测动画执行完毕，5秒后让欢迎页面消失
function fnLoad(){
	oWelcome = $('welcome');
	index = $('index');
	setTimeout(function(){
		//5秒之后让欢迎页面隐藏
		// oWelcome.style.opacity = 0;
		//让index首页显示，这么久显示了？ class
		removeClass(oWelcome,'show');
		addClass(index,'show');
		fnTab();
		fnScore();
		//给按钮绑定触摸事件
		var oBtn = $('index').getElementsByClassName('btn')[0];
		bindEvent(oBtn,'touchstart',fnCheck);
		
		checkTags();
	},5000);
}
//定义removeClass() 函数
//删除某个节点对象身上的class属性  
//参数1：元素对象删除哪个元素身上的class属性
//参数2：指定删除的是class属性中的哪个值
function removeClass(element,clsName){
	var aClass = element.className;
	// console.log(aClass);
	var arr = aClass.split(' ');
	// console.log(arr)
	for (var i = 0; i < arr.length; i++) {
		// console.log(arr[i]);
		if(arr[i]==clsName){
			arr.splice(i,1);
		}
	}
	element.className = arr.join(' ');
	// console.log(arr);
}

//addClass() 给某个元素增加一个class 
//例如：class="page"   class="page show"    class="show"
function addClass(element,clsName){
	if(!element.className){
		element.className = clsName;		//class="show"
	}
	//判断一下当前的class里面有没有clsName  class="add info" 如何判断有没有active
	var arr = element.className.split(' ');
	// console.log(arr);
	for(var i=0;i<arr.length;i++){
		if(arr[i] === clsName){
			return;
		}
	}
	//没有active的时候
	element.className += ' '+clsName;
}


/*轮播图*/
function fnTab(){
	var oIndex = $('index');
	//wrapPic
	var wrapPic = oIndex.getElementsByClassName('wrapPic')[0];
	//找到ul
	var oUl = wrapPic.getElementsByTagName('ul')[0];
	//平移的个数
	var iNow = 0;

	//找到小圆点
	var oAs = oIndex.getElementsByClassName('picMask')[0].getElementsByTagName('a');

	//屏幕的宽度px
	var iW = document.documentElement.clientWidth;

	//该变量保存开始的x轴的位置
	var startX = 0;

	//该变量保存每次滑动的距离
	var slideDistance = 0;

	//该变量保存前面平移的距离
	var preDistance = 0;

	var timer = null;

	autoPlay();
	function autoPlay(){		
		timer = setInterval(function(){
			iNow++;
			if(iNow>4){
				iNow = 0;
			}
			//计算平移的距离  ==   平移的个数 * 每个的宽度
			slideDistance = -iNow * iW;
			
			oUl.style.transform = "translateX("+slideDistance+"px)";
			oUl.style.WebkitTransform = "translateX("+slideDistance+"px)";

			//让对应的小圆点被选中
			for(var i=0;i<oAs.length;i++){
				//先删除每个a上面的active
				removeClass(oAs[i],'active');
			}
			//再找到和当前图片索引对应的
			addClass(oAs[iNow],'active');
		}, 2000)
	}

	//给wrapPic绑定手指滑动事件(3部分组成)
	bindEvent(wrapPic,'touchstart',fnStart);
	bindEvent(wrapPic,'touchmove',fnMove);
	bindEvent(wrapPic,'touchend',fnEnd);

	//手指按下触发的事件
	function fnStart(ev){
		oUl.style.transition = "none";	//将过渡行为取消
		var e = ev || window.event;
		startX = e.changedTouches[0].pageX;	//获得手指按下时的X轴坐标
		clearInterval(timer);
		//slideDistance是上次定时器平移的距离,这次手指按下了，应该从上次平移的基础上继续平移
		preDistance = slideDistance;
	}
	//手指在屏幕上滑动
	function fnMove(ev){
		var e = ev || window.event;
		//移动停下时的坐标
		var endX = e.changedTouches[0].pageX;
		distance = endX - startX;
		slideDistance = preDistance + distance;
		// console.log(distance);
		//根据滑动的距离,显示对应的图片
		oUl.style.transform = "translateX("+slideDistance+"px)";
		oUl.style.WebkitTransform = "translateX("+slideDistance+"px)";
	}
	//手指离开屏幕
	function fnEnd(ev){
		// console.log(distance);
		//计算一下滑动的距离
		// console.log(slideDistance/iW);
		oUl.style.transition = "all 0.5s";
		console.log(-Math.round(slideDistance/iW));
		//平移的个数
		iNow = -Math.round(slideDistance/iW);
		if(iNow>4){
			iNow = 4;
		}
		if(iNow<0){
			iNow = 0;
		}
		// console.log(iNow)
		//计算平移的距离  ==   平移的个数 * 每个的宽度
		slideDistance = -iNow * iW;
		
		oUl.style.transform = "translateX("+slideDistance+"px)";
		oUl.style.WebkitTransform = "translateX("+slideDistance+"px)";

		//让对应的小圆点被选中
		for(var i=0;i<oAs.length;i++){
			//先删除每个a上面的active
			removeClass(oAs[i],'active');
		}
		//再找到和当前图片索引对应的
		addClass(oAs[iNow],'active');

		autoPlay();
	}
}

//开始评分
function fnScore(){
	//找到评分里面的li标签
	var oLis = $('index').getElementsByClassName('score')[0].getElementsByTagName('li');
	
	//循环li标签
	for(var i=0;i<oLis.length;i++){
		//找到每个li标签
		//给当前li标签进行评分
		fn(oLis[i]);
	}
	function fn(oli){
		//评分的信息
		var scoreInfo = ['太差劲了','还可以','不错','很棒','verry good'];
		//找到该li标签里面的a标签
		var oA = oli.getElementsByTagName('a');
		for(var i=0;i<oA.length;i++){
			//给每个a增加一个属性，保存在整体中的位置
			oA[i].index = i;
			//给每个a标签绑定touch触摸事件
			bindEvent(oA[i],'touchstart',function(){
				//用户触摸的时候,拿着 this
				// console.log(this.index);
				//通过索引找到评价的内容
				var info = scoreInfo[this.index];
				console.log(info);
				//查找到所有的a
				var oAs = oli.getElementsByTagName('a');
				for(var j=0;j<oAs.length;j++){
					if(j<=this.index){
						//增加背景
						addClass(oAs[j],'active');
					}else{
						//删除背景
						removeClass(oAs[j],'active');
					}
				}
				oli.getElementsByTagName('input')[0].value = info;
			})
		}		
	}
}

//验证用户是否给景区评分
function checkScore(){
	//拿到三个input的value值
	var oInputs = $('index').getElementsByClassName('score')[0].getElementsByTagName('input');
	
	for(var i=0;i<oInputs.length;i++){
		if(oInputs[i].value==0){
			return false;
		}else{
			return true;
		}
	}
}

//验证是否给景区添加标签了
//判断input的checked的值，如果checked是true表示被选中
function checkTags(){
	//先找到所有的单选框
	var radios = $('index').getElementsByClassName('tags')[0].getElementsByTagName('input');
	for(var i=0;i<radios.length;i++){
		console.log(radios[i].checked);
		if(radios[i].checked){
			return true;		//返回true并停止
		}
	}
	return false;
}

//点击提交时进行验证
function fnCheck(){
	//先验证是否评分
	if(checkScore()){
		//再验证是否添加标签了
		if(!checkTags()){
			//没有添加标签
			fnMsg("请添加标签");
		}else{
			//进入感谢页面
			removeClass($('index'),'show');
			addClass($('thank'),'show');
			setTimeout(function(){
				//给index页面增加模糊的效果
				$('index').style.filter = "blur(5px)";
				$('index').style.WebkitFilter = "blur(5px)";
				$('thank').style.opacity = "1";
			}, 15)
		}
	}else{
		//没有评分
		fnMsg("请先评分");
	}
}

function fnMsg(errMsg){
	var info  = $('index').getElementsByClassName('info')[0];
	info.innerHTML = errMsg;
	info.style.transition = 'all 1s';
	info.style.opacity = 1;
	info.style.transform = "scale(1)";

	setTimeout(function(){
		info.style.opacity = 0;
		info.style.transform = "scale(0)";
	}, 2000)
}

