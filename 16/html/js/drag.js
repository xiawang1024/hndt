// »ñÈ¡id, class, tagName
var get = {
byId: function(id) {
 return typeof id === "string" ? document.getElementById(id) : id;
},
byClass: function(sClass, oParent) {
 var aClass = [];
 var reClass = new RegExp("(^| )" + sClass + "( |$)");
 var aElem = this.byTagName("*", oParent);
 for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
 return aClass;
},
byTagName: function(elem, obj) {
 return (obj || document).getElementsByTagName(elem)
}
}
//´°¿ÚÍÏ×§
function drag(oDrag,oTitle){
var posX=posY=0;
var oMin = get.byClass("min",oDrag)[0];
var oMax = get.byClass("max",oDrag)[0];
var oRevert = get.byClass("revert",oDrag)[0];
var oClose = get.byClass("close",oDrag)[0];
var RevertWidth=300;
var RevertHeight=160;
oTitle.onmousedown=function(event){
 oTitle.style.cursor = "move";
 var event = event || window.event;
 var disX=event.clientX-oDrag.offsetLeft;
 var disY=event.clientY-oDrag.offsetTop;
 //Êó±êÒÆ¶¯£¬´°¿ÚËæÖ®ÒÆ¶¯     onmousemoveÔÚÓÐÎïÌåÒÆ¶¯ÊÇ²ÅÖ´ÐÐalertÊÂ¼þ£»
 document.onmousemove=function(event){
   var event = event || window.event;
   maxW=document.documentElement.clientWidth-oDrag.offsetWidth;
   maxH=document.documentElement.clientHeight-oDrag.offsetHeight;
   posX=event.clientX-disX;
   posY=event.clientY-disY;
   if(posX<0){
     posX=0;
   }else if(posX>maxW){
     posX=maxW;
   }
   if(posY<0){
     posY=0;
   }else if(posY>maxH){
     posY=maxH;
   }
   oDrag.style.left=posX+'px';
   oDrag.style.top=posY+'px';
 }
 //Êó±êËÉ¿ª£¬´°¿Ú½«²»ÔÙÒÆ¶¯
 document.onmouseup=function(){
   document.onmousemove=null;
   document.onmouseup=null;
 }
}
}
window.onload  = function (){
var oDrag = document.getElementById("winWrap");
var oTitle = get.byClass("g-hd", oDrag)[0];
drag(oDrag, oTitle);
}
