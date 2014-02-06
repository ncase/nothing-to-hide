(function(exports){

	// Singleton
	var Debug = {};
	exports.Debug = Debug;

	// For making real art out of placeholders
	Debug.getMapArt = function(){
		console.log(Game.level.map._getBackgroundImage());
		console.log(Game.level.map._getCCTVImage());
	};

	// For recording the FPS rate
	var fps = 0, now, lastUpdate = (new Date)*1 - 1;
	var fpsFilter = 10; // The higher this value, the less the FPS will be affected by quick changes
	var fpsOut = document.getElementById('fps_counter');
	setInterval(function(){
		fpsOut.innerHTML = fps.toFixed(1) + " fps";
	},1000); 
	Debug.fps = function(){
		var delta = ((now=new Date) - lastUpdate);
		if(delta==0) return false;
		var thisFrameFPS = 1000/delta;
		fps += (thisFrameFPS - fps) / fpsFilter;
		lastUpdate = now;
	};

})(window);