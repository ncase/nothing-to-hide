(function(){

	var loading = document.getElementById("loading_screen");
	var loading_bar = document.getElementById("loading_bar");
	var loading_bar_red = document.getElementById("loading_bar_red");
	var loading_bar_text = document.getElementById("loading_bar_text");

	// Loading
	var preloaderInterval = setInterval(function(){

		var numLoaded = 0;
		numLoaded += Object.keys(Asset.image).length;
		numLoaded += Object.keys(Asset.level).length;
		numLoaded += Object.keys(Asset.sound).length;
		numLoaded += Object.keys(Asset.sprite).length;
		
		var bar = numLoaded/14; // Hard coded
		loading_bar_red.style.width = Math.round(bar*100)+"%";

	},50);

	// Preloader and stuff
	Asset.load().then(function(){

		console.log("===== LOADED! =====");
		clearInterval(preloaderInterval);

		// Loading Bar becomes play button
		/*loading_bar.onclick = _startGame;
		loading_bar.setAttribute("loaded",true);
		loading_bar_red.style.width = "100%";
		loading_bar_text.innerHTML = "CLICK TO PLAY!";*/

		_startGame();

	});

	function _startGame(){
		loading.parentNode.removeChild(loading);
		Game.start();
	}

})();