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

			// Music
			if(SWITCH_MUSIC!=-1 && Game.levelIndex>=3){
				if(SWITCH_MUSIC==0){
					music_bg_2.play(null,0,0,-1,0,0);
				}
				if(SWITCH_MUSIC<1){
					SWITCH_MUSIC += 0.01;
					music_bg_2.setVolume( MUSIC_VOLUME * (SWITCH_MUSIC) );
					music_bg.setVolume( MUSIC_VOLUME * (1-SWITCH_MUSIC) );
				}else{
					SWITCH_MUSIC = -1;
					music_bg.stop();
				}
			}
			if(SWITCH_MUSIC_BACK!=-1 && SWITCH_MUSIC==-1 && Game.levelIndex>=7){
				if(SWITCH_MUSIC_BACK==0){
					music_bg.play(null,0,0,-1,0,0);
				}
				if(SWITCH_MUSIC_BACK<1){
					SWITCH_MUSIC_BACK += 0.01;
					music_bg.setVolume( MUSIC_VOLUME * (SWITCH_MUSIC_BACK) );
					music_bg_2.setVolume( MUSIC_VOLUME * (1-SWITCH_MUSIC_BACK) );
				}else{
					SWITCH_MUSIC_BACK = -1;
					music_bg_2.stop();
				}
			}
			

		},1000/30);

		// Draw Loop
		function draw(){

			if(!drawnSinceLastUpdate){
				drawnSinceLastUpdate = true;
				if(Game.level){
					Game.level.draw();
					if(swiping) _doTheSwipe();
				}else{
					Display.clear();
				}
				Debug.fps();
			}

			// Cursor, draw anyway!...
			Cursor.draw();
			
			if(!gameKilled){ RAF(draw); }

		}
		draw();

		// BG Music
		var MUSIC_VOLUME = 0.25;
		var SWITCH_MUSIC = 0;
		var SWITCH_MUSIC_BACK = 0;
		var music_bg = createjs.Sound.createInstance("music_bg");
		var music_bg_2 = createjs.Sound.createInstance("music_bg_2");
		music_bg.play(null,0,0,-1,MUSIC_VOLUME,0);

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
		if(!nextLevelName){
			//return false;
			alert("Hurray! That's it for now. Please leave me some critique, and thanks for playing my Feedback Friday demo. Thank you!");
			return false;
		}

		// Go to next level
		Game.gotoLevelById(nextLevelName);
		return true;

	};
	var HACK_saveState = null;
	Game.gotoLevelById = function(nextLevelName){
		
		// Find level
		Game.clearLevel();
		var levelConfig = Asset.level[nextLevelName];

		// Dimensions
		var lvlWidth = (levelConfig.map[0].length) * Map.TILE_SIZE;
		var lvlHeight = (levelConfig.map.length) * Map.TILE_SIZE;

		// Resize NOW
		var w = Math.min(lvlWidth, window.innerWidth);
		var h = Math.min(lvlHeight, window.innerHeight);
		Display.resize(w,h);

		// Go to level
		Game.level = new Level(levelConfig,HACK_saveState);
		HACK_saveState = null;

		// Index
		Game.levelIndex = Game.config.levels.indexOf(nextLevelName);

	};
	Game.nextLevel = function(){
		HACK_saveState = null;
		Game.levelIndex++;
		Game.gotoLevel(Game.levelIndex);
	};
	Game.resetLevel = function(saveState){
		HACK_saveState = saveState;
		Game.gotoLevel(Game.levelIndex);
	};

	// DO A COOL SCENE TRANSITION
	var pos = 0;
	var vel = 0;
	var tick = 0;
	var swiping = false;
	var game = document.getElementById("game_container");
	var swipe = document.getElementById("swipe_container");
	var _doTheSwipe = function(){
			
		vel += (100-pos)*0.3;
		vel *= 0.5;
		pos += vel;

		if(tick++>60){
			swiping = false;
			pos = 100;
		}

		var s = -pos;
		var g = 100-pos;
		swipe.style.left = s+"%";
		game.style.left = g+"%";

	};
	Game.screenswipe = function(){
		
		// Copy Canvas
		var screenswipe = document.getElementById("screenswipe");
		screenswipe.width = Display.canvas.game.width;
		screenswipe.height = Display.canvas.game.height;
		var ctx = screenswipe.getContext("2d");
		ctx.drawImage(Display.canvas.game,0,0);

		// Place them in position
		swipe.style.top = "0%";
		swipe.style.left = "0%";
		game.style.top = "0%";
		game.style.left = "100%";

		// Then, swipe.
		pos = 0;
		vel = 0;
		tick = 0;
		swiping = true;

	}	

})(window);