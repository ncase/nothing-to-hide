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

		var drawnSinceLastUpdate = false;

		// Update loop
		gameLoop = setInterval(function(){
			if(Game.level) Game.level.update();
			drawnSinceLastUpdate = false;
		},1000/30);

		// Draw Loop
		function draw(){

			if(!drawnSinceLastUpdate){
				drawnSinceLastUpdate = true;
				if(Game.level){
					Game.level.draw();
				}else{
					Display.clear();
				}
				Debug.fps();
			}

			// Cursor, draw anyway!...
			if(Game.level){
				Cursor.draw();
			}
			
			if(!gameKilled){ RAF(draw); }

		}
		draw();

		// BG Music
		createjs.Sound.play("music_bg",null,0,0,true,0.5,0);

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
		Game.gotoLevelById(nextLevelName);
		return true;

	};
	Game.gotoLevelById = function(nextLevelName){
		
		Game.clearLevel();
		var levelConfig = Asset.level[nextLevelName];
		Game.level = new Level(levelConfig);

		Game.levelIndex = Game.config.levels.indexOf(nextLevelName);

	};
	Game.nextLevel = function(){
		Game.levelIndex++;
		Game.gotoLevel(Game.levelIndex);
	};
	Game.resetLevel = function(){
		Game.gotoLevel(Game.levelIndex);
	};

})(window);