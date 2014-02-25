//window.onload = function(){

var fade = document.getElementById("fade");
var bar = document.getElementById("loading_bar_white");

// Fade In
function fadeIn(){
	fade.setAttribute("closed",false);
	bar.style.display = "none";
	setTimeout(function(){
		fade.style.display = "none";
	},1000);
}

// Fade Out
function fadeOut(){
	fade.style.display = "block";
	bar.style.display = "block";
	bar.style.width = "0";
	setTimeout(function(){
		fade.setAttribute("closed",true);
	},1);
}

// Go To Page
var wrapper = document.getElementById("wrapper");
window.gotoPage = function(page){
	fadeOut();
	setTimeout(function(){
    	wrapper.src = page;
    	wrapper.contentWindow.focus();
    },1000);
};

// Load Ready
window.onProgress = function(progress){
	progress = progress*progress*progress*progress; // to look fast
	bar.style.width = (progress*100)+"%";
	if(progress==1){
		setTimeout(function(){
			fadeIn();
		},500);
	}
};

// Unlock Medal
window.unlockMedal = function(medalName){
	alert("Achievement Unlocked - "+medalName);
};

//};

// Sounds! For buttons
createjs.Sound.registerManifest([
	{id:'button_hover', src:'menu/assets/sounds/mp3/button_hover.mp3|menu/assets/sounds/ogg/button_hover.ogg'},
	{id:'button_press', src:'menu/assets/sounds/mp3/button_press.mp3|menu/assets/sounds/ogg/button_press.ogg'}
]);
var buttons = document.querySelectorAll(".button");
buttons = Array.prototype.slice.call(buttons);
for(var i=0;i<buttons.length;i++){
	var butt = buttons[i];
	butt.addEventListener("mouseover",function(){
		createjs.Sound.play("button_hover",null,0,0,0,1,0);
	},false);
	butt.addEventListener("mousedown",function(){
		createjs.Sound.play("button_press",null,0,0,0,1,0);
	},false);
}

// A helper for popup windows
window.SS_POPUP = function(url,type){

	var w,h;
	switch(type){
		case "twitter": w=550; h=500; break;
		case "facebook": w=670; h=400; break;
		default: w=500; h=500; break;
	}
	var x = (screen.width/2)-(w/2);
		var y = (screen.height/2)-(h/2);

	var popupConfig = "width="+w+",height="+h+",left="+x+",top="+y+",";
	popupConfig += "resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes";
	window.open(url,"popup",popupConfig);

};
