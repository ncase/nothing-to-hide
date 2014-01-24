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

},false);