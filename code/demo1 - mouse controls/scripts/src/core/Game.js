(function(exports){

	// Singleton
	var Game = {};
	exports.Game = Game;

	// Init config
	Game.init = function(config){
		Game.config = config;
	};

	// Start game
	var gameLoop;
	var gameKilled = false;
	var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
	Game.start = function(){

		// Update loop
		gameLoop = setInterval(function(){
			if(Game.level) Game.level.update();
		},1000/30);

		// Draw Loop
		function draw(){
			if(Game.level){ Game.level.draw(); }else{ Display.clear(); }
			if(!gameKilled){ RAF(draw); }
			Debug.fps();
		}
		draw();

		// First level
		Game.gotoLevel(0);

		// Cursor
		Cursor.init();

	};

	// End game
	Game.kill = function(){
		gameKilled = true;
		clearInterval(gameLoop);
	};

	// Level Flow
	Game.levelIndex = 0;
	Game.level = null;
	Game.clearLevel = function(){
		if(Game.level){
			Game.level.kill();
			Game.level = null;
		}
		Display.clear();
	};
	Game.gotoLevel = function(index){
		
		// Get next level config
		Game.levelIndex = index;
		var nextLevelName = Game.config.levels[Game.levelIndex];
		if(!nextLevelName) return false;

		// Go to next level
		Game.clearLevel();
		var levelConfig = Asset.level[nextLevelName];
		Game.level = new Level(levelConfig);
		return true;

	};
	Game.nextLevel = function(){
		Game.levelIndex++;
		Game.gotoLevel(Game.levelIndex);
	};
	Game.resetLevel = function(){
		Game.gotoLevel(Game.levelIndex);
	};

})(window);