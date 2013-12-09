(function(exports){

	var Level = function(config){

		var self = this;
		var lvl = JSON.parse(JSON.stringify(config.level)); // Prevent affecting main data
		var map = config.map;
		var art = config.art;
		this.config = config;

		///////////////////////////////
		///// PARSING CONFIG DATA /////
		///////////////////////////////

		// Shadows to scale of Tile Size
		for(var i=0;i<lvl.shadows.length;i++){
			var shadow = lvl.shadows[i];
			shadow.ax *= Map.TILE_SIZE;
			shadow.ay *= Map.TILE_SIZE;
			shadow.bx *= Map.TILE_SIZE;
			shadow.by *= Map.TILE_SIZE;
		}

		// Prisms to scale of Tile Size
		for(var i=0;i<lvl.prisms.length;i++){
			var prism = lvl.prisms[i];
			prism.x = (prism.x+0.5)*Map.TILE_SIZE;
			prism.y = (prism.y+0.5)*Map.TILE_SIZE;
		}

		// Dummies to scale of Tile Size
		lvl.dummies = lvl.dummies || [];
		for(var i=0;i<lvl.dummies.length;i++){
			var dummy = lvl.dummies[i];
			dummy.x = (dummy.x+0.5)*Map.TILE_SIZE;
			dummy.y = (dummy.y+0.5)*Map.TILE_SIZE;
		}

		/////////////////////////////
		///// INIT GAME OBJECTS /////
		/////////////////////////////

		this.map = new Map(this,{
			map: map,
			art: lvl.art,
			background: art.background,
			cam: art.cam
		});

		this.player = new Player(this,{
			x: (lvl.player.x+0.5)*Map.TILE_SIZE,
			y: (lvl.player.y+0.5)*Map.TILE_SIZE
		});

		this.suspicion = new Suspicion(this);

		this.camera = new Camera(this,{
			actions: lvl.camera
		});

		this.shadows = new ShadowController(this,{ shadows:lvl.shadows });
		this.prisms = new PrismController(this,{ prisms:lvl.prisms });
		this.conveyors = new ConveyorController(this,{ conveyors:lvl.conveyors || [] });
		this.doors = new DoorController(this,{ doors:lvl.doors || [] });
		this.dummies = new DummyController(this,{ dummies:lvl.dummies || [] });

		//////////////////////
		///// GAME LOGIC /////
		//////////////////////

		// Game Loop
		var goal = lvl.goal;
		this.update = function(){

			// Update everything
			Cursor.update();
			this.camera.update();
			this.player.update();
			this.prisms.update();
			this.shadows.update();
			this.conveyors.update();
			this.doors.update();
			this.dummies.update();

			// Are you in the goal?
			var x = this.player.x/Map.TILE_SIZE;
			var y = this.player.y/Map.TILE_SIZE;
			if(x>=goal.ax && x<=goal.bx && y>=goal.ay && y<=goal.by){
				Game.clearLevel();
				Game.nextLevel();
			}

		};

		// Draw Loop: Camera draws everything
		this.draw = function(){
			this.camera.draw();
			this.suspicion.update();
		};

		// Kill
		this.kill = function(){
			self.suspicion.kill();
		};

	};
	exports.Level = Level;

})(window);