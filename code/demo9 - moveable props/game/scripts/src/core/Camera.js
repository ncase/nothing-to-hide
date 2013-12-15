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

		var cctvTexture = Asset.image.cctv;
		var cctvPattern = Display.context.tmp.createPattern(cctvTexture, 'repeat');
		Display.context.tmp.fillStyle = cctvPattern;

		this.draw = function(){

			var ctx = Display.context.game;

			// Centering the camera
			self.cx = Math.round(Display.width/2-self.x);
			self.cy = Math.round(Display.height/2-self.y);
		
			// Extra centering
			ctx.translate(self.cx,self.cy);

			// Clear JUST THE GAME AREA, with padding.
			ctx.clearRect(-50,-50,level.map.width+100,level.map.height+100);

			// Draw background
			level.map.draw();
			level.conveyors.draw();
			level.shadows.draw();

			// CCTV
			cctvY += 1;
			if(cctvY>=10) cctvY=0;

			// Draw CCTV over
			_drawCCTV(ctx);

			// Draw props
			var props = [level.player].concat(level.prisms.prisms).concat(level.dummies.dummies).concat(level.blocks.blocks);
			props = props.sort(function(a,b){
				return(a.y-b.y);
			});
			for(var i=0;i<props.length;i++){
				var prop = props[i];
				prop.draw(ctx);
			}

			// Masking everything
			_mask(level.shadows.shadowCanvas, ctx);

			// Draw BENEATH: Shadow Cams
			if(!level.config.level.art.hideCam){
				
				var camCache = level.map.camCache;
				var w = Math.min(camCache.width,Display.width);
				var h = Math.min(camCache.height,Display.height);
				var x = (w==Display.width) ? -level.camera.cx : 0;
				var y = (h==Display.height) ? -level.camera.cy : 0;

				Display.context.tmp.drawImage(camCache,0,0);
				//Display.context.tmp.translate(-x,-y);

				// Draw CCTV over
				_drawCCTV(Display.context.tmp);

				// Draw shadow props
				for(var i=0;i<props.length;i++){
					var prop = props[i];
					prop.drawCCTV(Display.context.tmp);
				}

				//Display.context.tmp.translate(x,y);
				_mask(level.shadows.camCanvas, Display.context.tmp);

				ctx.globalCompositeOperation = "destination-over";
				ctx.drawImage(Display.canvas.tmp,0,0);
				ctx.globalCompositeOperation = "source-over";
			}

			// Draw BENEATH EVERYTHING
			var w = Math.min(level.map.width,Display.width);
			var h = Math.min(level.map.height,Display.height);
			var x = (w==Display.width) ? -level.camera.cx : 0;
			var y = (h==Display.height) ? -level.camera.cy : 0;
			Display.context.tmp.clearRect(x,y,w,h);
			Display.context.tmp.translate(-x,-y);
			level.player.drawCCTV(Display.context.tmp);
			Display.context.tmp.translate(x,y);
			ctx.globalCompositeOperation = "destination-over";
			ctx.drawImage(Display.canvas.tmp,x,y);
			ctx.globalCompositeOperation = "source-over";


			// Restore Camera
			ctx.translate(-self.cx,-self.cy);

		};

		// Mask helper
		var _mask = function(mask,ctx){

			// Positions
			var x = (level.map.width>=Display.width) ? -self.cx : 0;
			var y = (level.map.height>=Display.height) ? -self.cy : 0;

			// Draw Mask
			ctx.save();
			ctx.globalCompositeOperation = "destination-in";
			ctx.drawImage(mask,x,y);
			ctx.restore();

		};

		var cctvY = 0;
		var _drawCCTV = function(ctx){
			// Draw CCTV over
			if(!level.config.level.art.ignoreCameras){

				var prisms = level.prisms.prisms;
				for(var j=0;j<prisms.length;j++){
					var prism = prisms[j];
					if(!prism.active) continue;

					// Draw CCTV
					var poly = prism.sightPolygon;
					ctx.fillStyle = cctvPattern;
					ctx.beginPath();
					ctx.moveTo(poly[0][0], poly[0][1]);
					for (var i = 1; i < poly.length; ++i) {
						ctx.lineTo(poly[i][0], poly[i][1]);
					}

					ctx.translate(0,cctvY);
					ctx.fill();
					ctx.translate(0,-cctvY);

				}
			}
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