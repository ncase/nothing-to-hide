(function(exports){

	// Singleton
	var Game = {};
	exports.Game = Game;

	// GO TO LEVEL
	Game.gotoLevel = function(levelID){

		// Clone config, and create a new level from it
		var config = JSON.parse(JSON.stringify(Asset.levelConfig[levelID]));
		var level = new Level(config);
		level.id = levelID;

		// Kill & replace any previous levels
		if(Game.level) Game.level.kill();
		Game.level = level;

		// INIT IT
		Game.level.init();
		Game.level.update();
		publish("game/update");

		// Run custom script
		eval(config.custom);

	};

	// RESET LEVEL
	Game.resetLevel = function(){
		Game.gotoLevel(Game.level.id);
	}

	// Start game
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var context = canvas.getContext('2d');

	Game.canvas = canvas;
	Game.context = context;

	var drawnSinceLastUpdate;
	var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
	Game.FPS = 30;
	Game.start = function(){

		drawnSinceLastUpdate = true;

		// UPDATE LOOP: 30 FPS
		gameLoop = setInterval(function(){
			// if(Game.PAUSED) return; // Paused - do not update
			// If there's a level, update it.
			if(Game.level){
				publish("game/update");
				Game.level.update();
				publish("game/update/end");
				drawnSinceLastUpdate = false;
			}
		},1000/Game.FPS);

		// DRAW LOOP: Whenever it draws, but only if updated in the last frame.
		function draw(){
			publish("game/draw");
			publish("fps/begin");
			if(Game.level && !drawnSinceLastUpdate){
				drawnSinceLastUpdate = true;
				Game.level.draw(context);
			}
			publish("fps/end");
			RAF(draw);
		}
		draw();

	};

})(window);