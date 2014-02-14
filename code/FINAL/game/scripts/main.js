window.addEventListener("load",function(){

	// Loading
	var preloaderInterval = setInterval(function(){

		var totalAssets = 0;
		totalAssets += Object.keys(Asset.config.images).length;
		totalAssets += Object.keys(Asset.config.levels).length;
		totalAssets += Object.keys(Asset.config.sounds).length;
		totalAssets += Object.keys(Asset.config.sprites).length;

		var numLoaded = 0;
		numLoaded += Object.keys(Asset.image).length;
		numLoaded += Object.keys(Asset.level).length;
		numLoaded += Object.keys(Asset.sound).length;
		numLoaded += Object.keys(Asset.sprite).length;
		
		var bar = numLoaded/totalAssets;
		if(window.top.onProgress){
			window.top.onProgress(bar);
		}else{
			console.log(bar);
		}

	},50);

	// Display
	Display.init({
		dom: document.getElementById("game_container")
	});

	// Preloader and stuff
	Asset.load().then(function(){
		console.log("===== LOADED! =====");
		clearInterval(preloaderInterval);
		if(window.top.onProgress) window.top.onProgress(1);
		setTimeout(function(){
			Game.start();
		},500);
	});

	// HACK - Game UI
	var buttons = document.querySelectorAll(".button");
	for(var i=0;i<buttons.length;i++){
		var butt = buttons[i];
		butt.addEventListener("mouseover",function(){
			createjs.Sound.play("button_hover",null,0,0,0,1,0);
		},false);
		butt.addEventListener("mousedown",function(){
			createjs.Sound.play("button_press",null,0,0,0,1,0);
		},false);
	}
	var buttons = document.querySelectorAll(".social_big");
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

	// Helper to skip levels
	window.skipLevel = function(){
		var index = Game.levelIndex+1;
		if(index==8){
			window.top.gotoPage('cutscene/cutscene_end.html');
		}else{
			Game.gotoLevel(Game.levelIndex+1)
		}
	};

},false);