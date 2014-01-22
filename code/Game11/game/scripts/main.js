window.addEventListener("load",function(){

	var loading = document.getElementById("loading_screen");
	var loading_bar = document.getElementById("loading_bar");
	var loading_bar_white = document.getElementById("loading_bar_white");

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
		bar = bar*bar*bar*bar; // Because music takes FOREVER.
		loading_bar_white.style.width = Math.round(bar*100)+"%";

	},50);

	// Display
	Display.init({
		dom: document.getElementById("game_container")
	});

	// Preloader and stuff
	Asset.load().then(function(){
		console.log("===== LOADED! =====");
		setTimeout(function(){
			clearInterval(preloaderInterval);
			_startGame();
		},600);
	});

	function _startGame(){
		
		Game.start();

		loading.style.opacity = 0;
		setTimeout(function(){
			loading.parentNode.removeChild(loading);
		},1000);

	}

},false);