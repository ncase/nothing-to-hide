(function(exports){

	var Camera = function(level,config){

		var self = this;

		// Properties
		this.level = level;
		this.config = config.actions;
		this.x = this.gotoX = 0;
		this.y = this.gotoY = 0;

		// Before & After Draw
		this.draw = function(){

			// Camera Logic
			_camLogic();

			// If you move, camera's dirty
			if( Math.abs(this.x-this.gotoX)>0.1 || Math.abs(this.y-this.gotoY)>0.1 ){
				level.shadows.dirtyMoveCam = true;
			}

			// Swing to gotoSpot
			this.x = this.x*0.8 + this.gotoX*0.2;
			this.y = this.y*0.8 + this.gotoY*0.2;

			// Clear Canvasses
			var w = Math.max(Display.width,level.map.width) + 100;
			var h = Math.max(Display.height,level.map.height) + 100;
			Display.context.background.clearRect(-50,-50,w,h);
			Display.context.backgroundCam.clearRect(-50,-50,w,h);
			Display.context.props.clearRect(-50,-50,w,h);
		
			// Pixel-perfect camera centering
			var cx = Math.round(Display.width/2-self.x);
			var cy = Math.round(Display.height/2-self.y);
			for(var id in Display.context){
				if(id=="hud" || id=="cursor") continue; // HUD stays static
				var ctx = Display.context[id];
				ctx.save();
				ctx.translate(cx,cy);
			}

			// Draw everything
			level.map.draw();
			level.shadows.draw();
			level.suspicion.draw();
			level.prisms.draw();
			level.dummies.draw();

			// Masking everything
			_mask(Display.canvas.shadows, Display.context.background);
			_mask(Display.canvas.shadows, Display.context.props);
			level.player.draw();

			// Cursor!...
			Cursor.draw();

			// Restore Camera
			for(var id in Display.context){
				if(id=="hud" || id=="cursor") continue; // HUD stays static
				Display.context[id].restore();
			}

		};

		// Mask helper
		var _mask = function(mask,ctx){
			ctx.save();
			ctx.globalCompositeOperation = "destination-out";
			ctx.drawImage(mask, self.x-Display.width/2, self.y-Display.height/2);
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