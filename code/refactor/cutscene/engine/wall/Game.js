(function(exports){

	// Singleton
	var Game = {};
	exports.Game = Game;

	// GO TO WALL
	Game.gotoWall = function(wallID){

		// Clone config, and create a new wall from it
		var config = JSON.parse(JSON.stringify(Asset.wallConfig[wallID]));
		var wall = new Wall(config);
		wall.id = wallID;

		// Kill & replace any previous walls
		if(Game.wall) Game.wall.kill();
		Game.wall = wall;

		// INIT IT
		Game.wall.init();
		Game.wall.update();
		publish("game/update");

		// Run custom script
		eval(config.custom);

	};

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
			// If there's a wall, update it.
			if(Game.wall){
				publish("game/update");
				Game.wall.update();
				publish("game/update/end");
				drawnSinceLastUpdate = false;
			}
		},1000/Game.FPS);

		// DRAW LOOP: Whenever it draws, but only if updated in the last frame.
		function draw(){
			publish("game/draw");
			publish("fps/begin");
			if(Game.wall && !drawnSinceLastUpdate){
				drawnSinceLastUpdate = true;
				Game.wall.draw(context);
			}
			publish("fps/end");
			RAF(draw);
		}
		draw();

	};

})(window);