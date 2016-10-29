function $(id){
  return document.getElementById(id);
}

function fnLoad(){
  //检测动画执行完毕，5秒后让欢迎页面消失
  oWelcome =$('welcome');
  index =$('index');
  setTimeout(function(){
    //5s后欢迎页面隐藏
    removeClass(oWelcome,'show');
    addClass(index,'show');
    //轮播图
    fnTab();
    //评分星级
    fnScore();
    //标签按钮
    var oBtn =$('index').getElementsByClassName('btn')[0];
    bindEvent(oBtn,'touchstart',fnCheck);
    checkTags();
  },5000);

}
