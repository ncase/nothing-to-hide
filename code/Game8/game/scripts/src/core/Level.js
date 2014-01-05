(function(exports){

	var Level = function(config,saveState){

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
		// Savestate?...
		if(saveState){
			lvl.prisms = saveState.prisms;
		}else{
			for(var i=0;i<lvl.prisms.length;i++){
				var prism = lvl.prisms[i];
				prism.x = (prism.x+0.5)*Map.TILE_SIZE;
				prism.y = (prism.y+0.75)*Map.TILE_SIZE; // A little downwards
			}
		}

		// Dummies to scale of Tile Size
		lvl.dummies = lvl.dummies || [];
		for(var i=0;i<lvl.dummies.length;i++){
			var dummy = lvl.dummies[i];
			dummy.x = (dummy.x+0.5)*Map.TILE_SIZE;
			dummy.y = (dummy.y+0.5)*Map.TILE_SIZE;
		}

		// Blocks, too
		lvl.blocks = lvl.blocks || [];
		for(var i=0;i<lvl.blocks.length;i++){
			var block = lvl.blocks[i];
			block.x = (block.x+0.5)*Map.TILE_SIZE;
			block.y = (block.y+1.0)*Map.TILE_SIZE; // Actually there, not half-way
		}

		/////////////////////////////
		///// INIT GAME OBJECTS /////
		/////////////////////////////

		this.map = new Map(this,{
			map: map,
			art: lvl.art,
			background: art.background,
			cam: art.cam,
			propaganda: lvl.propaganda,
			goal: lvl.goal
		});

		// Savestate?...
		if(saveState){
			this.player = new Player(this,{
				x: saveState.player.x,
				y: saveState.player.y,
			});
		}else{
			this.player = new Player(this,{
				x: (lvl.player.x+0.5)*Map.TILE_SIZE,
				y: (lvl.player.y+0.5)*Map.TILE_SIZE
			});
		}

		this.suspicion = new Suspicion(this);

		this.camera = new Camera(this,{
			actions: lvl.camera
		});

		this.shadows = new ShadowController(this,{ shadows:lvl.shadows });
		this.prisms = new PrismController(this,{ prisms:lvl.prisms });
		this.conveyors = new ConveyorController(this,{ conveyors:lvl.conveyors || [] });
		this.doors = new DoorController(this,{ doors:lvl.doors || [] });
		this.dummies = new DummyController(this,{ dummies:lvl.dummies || [] });
		this.blocks = new BlockController(this,{ blocks:lvl.blocks || [] });

		//////////////////////
		///// GAME LOGIC /////
		//////////////////////

		// Checkpoints
		self.saveState = saveState;
		self.checkpoints = lvl.checkpoints || [];
		self.dialogues = lvl.dialogues || [];

		// Game Loop
		self.goal = lvl.goal;
		this.update = function(){

			// UI everything
			Dialogue.update();
			Cursor.update();
			Key.update();

			// Update everything
			this.camera.update();
			this.prisms.update();
			this.player.update();
			this.shadows.update();
			this.conveyors.update();
			this.doors.update();
			this.dummies.update();
			this.blocks.update();
			this.suspicion.update();

			// Are you in a checkpoint
			for(var i=0;i<self.checkpoints.length;i++){
				var cp = self.checkpoints[i];
				if(!cp.saved && _isInArea(cp)){
					cp.saved = true;

					// Create save state
					self.saveState = _createSaveState();

				}
			}

			// Are you in a Dialogue spot?
			for(var i=0;i<self.dialogues.length;i++){
				var dialogue = self.dialogues[i];
				if(!dialogue.said && _isInArea(dialogue.area)){
					dialogue.said = true;
					Dialogue.queue(dialogue.queue);
				}
			}

			// Are you in the goal?
			if(_isInArea(self.goal)){
				Game.screenswipe();
				Game.clearLevel();
				Game.nextLevel();
			}

		};
		function _isInArea(area,x,y){
			x = self.player.x/Map.TILE_SIZE;
			y = self.player.y/Map.TILE_SIZE;
			return (x>=area.ax && x<=area.bx && y>=area.ay && y<=area.by);
		}
		function _createSaveState(){
			var state = {};

			// Player
			state.player = {
				x: self.player.x,
				y: self.player.y
			};

			// iEyes
			state.prisms = [];
			for(var i=0;i<self.prisms.prisms.length;i++){
				var p = self.prisms.prisms[i];
				state.prisms.push({
					x: p.x,
					y: p.y
				});
			}

			// If you're holding any, yeah, drop it.
			var heldPrism = self.prisms.getHeldPrism();
			if(heldPrism){
				state.prisms.push({
					x: self.player.x,
					y: self.player.y
				});
			}

			// Todo: Blocks

			return state;

		}

		// Draw Loop: Camera draws everything
		this.draw = function(){
			this.camera.draw();
		};

		// Kill
		this.kill = function(){
			self.suspicion.kill();
		};

		// UPDATE NOW
		this.update();

	};
	exports.Level = Level;

})(window);