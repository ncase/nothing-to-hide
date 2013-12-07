(function(exports){

	var Camera = function(level,config){

		var self = this;

		// Properties
		this.level = level;
		this.config = config.actions;
		this.x = this.gotoX = 0;
		this.y = this.gotoY = 0;

		// Before & After Draw
		this.update = function(){
			
			// Camera Logic
			_camLogic();

			// Swing to gotoSpot
			this.x = this.x*0.8 + this.gotoX*0.2;
			this.y = this.y*0.8 + this.gotoY*0.2;

			// Centering the camera
			self.cx = Math.round(Display.width/2-self.x);
			self.cy = Math.round(Display.height/2-self.y);

		};
		this.draw = function(){
			
			// Extra centering
			Display.context.game.save();
			Display.context.game.translate(self.cx,self.cy);

			// Clear JUST THE GAME AREA
			Display.context.game.clearRect(0,0,level.map.width,level.map.height);

			// Draw everything
			level.map.draw();
			level.shadows.draw();

			// Masking everything
			_mask(level.shadows.shadowCanvas, Display.context.game);

			// Draw rest of everything
			level.prisms.draw();
			level.dummies.draw();
			level.player.draw();

			// Mask the cams
			_mask(level.shadows.camCanvas, level.map.camContext);

			// Draw BENEATH: Shadow Cams, then Cam CCTV thingy
			var ctx = Display.context.game;
			ctx.save();
			ctx.globalCompositeOperation = "destination-over";
			ctx.drawImage(level.map.camCanvas,0,0);
			ctx.restore();

			// Restore Camera
			Display.context.game.restore();

		};

		// Mask helper
		var _mask = function(mask,ctx){
			ctx.save();
			ctx.globalCompositeOperation = "destination-out";
			ctx.drawImage(mask,0,0);
			ctx.restore();
		};


		//////////////////////////////////////////
		///////////// CAMERA LOGIC ///////////////
		//////////////////////////////////////////
		
		// Depending on what zone a player is in, what type of camera to use.
		var _camLogic = function(){
			
			// Which zone is the player in?
			var camAction;
			var actions = self.config;
			for(var i=0;i<actions.length;i++){
				var px = level.player.x/Map.TILE_SIZE;
				var py = level.player.y/Map.TILE_SIZE;
				var zone = actions[i].zone;
				if(px>zone.ax && py>zone.ay && px<zone.bx && py<zone.by){
					camAction = actions[i];
					break;
				}
			}

			// Perform that action with the data provided
			if(!camAction) return false;
			var camActionFunc = _camActions[camAction.type];
			camActionFunc(camAction.data);

		};

		// Types of cameras
		var _camActions = {

			// Fixed on one spot
			fixed: function(data){
				self.gotoX = data.x*Map.TILE_SIZE;
				self.gotoY = data.y*Map.TILE_SIZE;
			},

			// Follow the player
			follow: function(data){
				self.gotoX = level.player.x;
				self.gotoY = level.player.y;
			},

			// Go to player vector projected on a line
			rails: function(data){

				// The rails vector, made into a unit vector.
				var vRail = {
					x: data.bx-data.ax,
					y: data.by-data.ay
				};
				var mag = Math.sqrt(vRail.x*vRail.x + vRail.y*vRail.y);
				vRail.x /= mag;
				vRail.y /= mag;

				// The player vector
				var vPlayer = {
					x: level.player.x-data.ax*Map.TILE_SIZE,
					y: level.player.y-data.ay*Map.TILE_SIZE
				};

				// The dot product === the scalar projection on unit vector of rail
				var dot = vRail.x*vPlayer.x + vRail.y*vPlayer.y;

				// Where cam should be, then.
				var cam = {
					x: data.ax*Map.TILE_SIZE + dot*vRail.x,
					y: data.ay*Map.TILE_SIZE + dot*vRail.y
				};

				// Goto
				self.gotoX = cam.x;
				self.gotoY = cam.y;

			}

		};
		
		// Jump to the initial camera position
		_camLogic();
		this.x = this.gotoX;
		this.y = this.gotoY;

	};

	exports.Camera = Camera;

})(window);