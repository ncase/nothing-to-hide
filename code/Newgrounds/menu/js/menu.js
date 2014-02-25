function startGame(){
	window.parent.gotoPage("cutscene/cutscene.html");
}

// ALWAYS BE FOCUSING
setInterval(function(){
	window.focus();
},500);

var Menu = {};

var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
Menu.start = function(){

	var drawnSinceLastUpdate = false;
	document.getElementById("canvas_container").style.display = "block";
	document.getElementById("canvas_container").focus();

	// Initialize
	var config = Asset.level.menu;
	var lvl = JSON.parse(JSON.stringify(config.level));
	var map = config.map;
	Menu.map = new Map(this,{
		map: map,
		art: lvl.art,
		propaganda: lvl.propaganda,
		goal: lvl.goal
	});
	// Shadows to scale of Tile Size
	for(var i=0;i<lvl.shadows.length;i++){
		var shadow = lvl.shadows[i];
		shadow.ax *= Map.TILE_SIZE;
		shadow.ay *= Map.TILE_SIZE;
		shadow.bx *= Map.TILE_SIZE;
		shadow.by *= Map.TILE_SIZE;
	}
	Menu.shadows = new ShadowController(this,{
		shadows: lvl.shadows
	});
	Menu.shadows.update();

	// Update loop
	setInterval(function(){
		Menu.update();
		drawnSinceLastUpdate = false;
	},1000/30);

	// Draw Loop
	function draw(){
		if(!drawnSinceLastUpdate){
			drawnSinceLastUpdate = true;
			Menu.draw();
		}
		RAF(draw);
	}
	draw();

	// Music
	createjs.Sound.play("big_brother",null,0,0,-1,1,0);

	// Buttons
	var links = document.querySelectorAll(".link");
	var buttons = document.querySelectorAll(".button");
	buttons = Array.prototype.slice.call(buttons);
	links = Array.prototype.slice.call(links);
	buttons = buttons.concat(links);
	buttons.push(document.getElementById("close_button"));
	for(var i=0;i<buttons.length;i++){
		var butt = buttons[i];
		butt.addEventListener("mouseover",function(){
			createjs.Sound.play("button_hover",null,0,0,0,1,0);
		},false);
		butt.addEventListener("mousedown",function(){
			createjs.Sound.play("button_press",null,0,0,0,1,0);
		},false);
	}

	// Location Hash Change
	var _onHashChange = function(hash){
		if(hash==""){
			_modalHide();
		}else{
			showModal(hash);
		}
	}
	if(window.location.hash){
		_onHashChange(window.location.hash);
	}
	window.onhashchange = function(){
	    _onHashChange(window.location.hash);
	};

};

Menu.update = function(){
	Menu.shadows.update();
};

var canvas = {
	menu: document.getElementById("screen"),
	tmp: document.createElement("canvas"),
};
var context = {
	menu: canvas.menu.getContext("2d"),
	tmp: canvas.tmp.getContext("2d")
};
var WIDTH = 1000;
var HEIGHT = 550;
canvas.menu.width = canvas.tmp.width = WIDTH;
canvas.menu.height = canvas.tmp.height = HEIGHT;

Menu.draw = function(){

	var ctx = context.menu;
	var ctxTemp = context.tmp;

	// Clear cam
	ctx.clearRect(0,0,WIDTH,HEIGHT);

	// Draw lines
	ctx.drawImage(Menu.map.lineCache,0,0);

	// Draw main layer
	ctxTemp.clearRect(0,0,WIDTH,HEIGHT);
	Menu.map.draw(ctxTemp);
	_mask(Menu.shadows.sightPolygon,ctxTemp);
	ctx.drawImage(canvas.tmp,0,0);

};

// Mask helper
var _mask = function(poly,ctx){

	// Create mask polygon path
	ctx.beginPath();
	ctx.moveTo(poly[0][0], poly[0][1]);
	ctx.fillStyle = "#000";
	for (var i = 1; i < poly.length; ++i) {
		ctx.lineTo(poly[i][0], poly[i][1]);
	}

	// Fill in mask
	ctx.globalCompositeOperation = "destination-in";
	ctx.fill();
	ctx.globalCompositeOperation = "source-over";

};

// Loading
var preloaderInterval = setInterval(function(){

	var totalAssets = 0;
	totalAssets += Object.keys(Asset.config.images).length;
	totalAssets += Object.keys(Asset.config.levels).length;
	totalAssets += Object.keys(Asset.config.sounds).length;

	var numLoaded = 0;
	numLoaded += Object.keys(Asset.image).length;
	numLoaded += Object.keys(Asset.level).length;
	numLoaded += Object.keys(Asset.sound).length;
	
	var bar = numLoaded/totalAssets;
	if(window.parent.onProgress){
		window.parent.onProgress(bar);
	}else{
		console.log(bar);
	}

},50);

Asset.load().then(function(){
	console.log("===== LOADED! =====");
	clearInterval(preloaderInterval);
	if(window.parent.onProgress) window.parent.onProgress(1);
	setTimeout(function(){
		Menu.start();
	},500);
});


//////////////////
// MODAL SHTUFF //
//////////////////

var modal = document.getElementById("modal_container");
var screens = document.querySelectorAll(".dialog");
window.showModal = function(hash){

	// Hide all screens
	for(var i=0;i<screens.length;i++){
		screens[i].style.display = "none";
	}

	// Show just that one
	var screenID = "dialog_"+hash.substr(1);
	var screenDOM = document.getElementById(screenID);
	if(!screenDOM) return;
	screenDOM.style.display = "block";

	// Show modal
	_modalReveal();

};
window.hideModal = function(){
	_modalHide();
	window.location.hash = "";
};


// Fade In
function _modalHide(){
	modal.setAttribute("shown",false);
	setTimeout(function(){
		modal.style.display = "none";
	},500);
}

// Fade Out
function _modalReveal(){
	modal.style.display = "block";
	setTimeout(function(){
		modal.setAttribute("shown",true);
	},1);
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
