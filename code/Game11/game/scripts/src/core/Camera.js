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

			// CCTV
			cctvY += 1;
			if(cctvY>=25) cctvY=0;

		};

		var cctvTexture = Asset.image.cctv;
		var cctvPattern = Display.context.tmp.createPattern(cctvTexture, 'repeat');
		Display.context.tmp.fillStyle = cctvPattern;

		var HACK_for_intro_alpha = 0;
		this.draw = function(){

			var ctx = Display.context.game;
			var ctxTemp = Display.context.tmp;

			// Clear cam
			ctx.clearRect(0,0,Display.width,Display.height);

			// Centering the camera
			self.cx = Math.round(Display.width/2-self.x);
			self.cy = Math.round(Display.height/2-self.y);

			// Sort props
			var props = [level.player].concat(level.prisms.prisms).concat(level.dummies.dummies).concat(level.blocks.blocks);
			props = props.sort(function(a,b){
				var ay = a.y;
				var by = b.y;
				if(a._CLASS=="Block"){
					ay = a.y+a.bounds.top/2;
				}
				if(b._CLASS=="Block"){
					by = b.y+b.bounds.top/2;
				}
				return(ay-by);
			});

			// TEMP LAYER - TRANSLATE
			ctxTemp.translate(self.cx,self.cy);

			//////////////////////
			// DRAW LINES LAYER //
			//////////////////////

			// Because it's the first layer,
			// I can optimize by drawing direct to the main context.
			ctx.translate(self.cx,self.cy);
			ctx.drawImage(level.map.lineCache,0,0);
			level.player.drawCCTV(ctx);
			ctx.translate(-self.cx,-self.cy);


			/////////////////////
			// DRAW CCTV LAYER //
			/////////////////////

			// HACK: HARDCODE FOR FIRST LEVEL
			if(level.config.id!="intro" || HACK_for_intro_alpha>0.01){
				
				// HACK: ALPHA
				if(level.config.id=="intro") ctxTemp.globalAlpha = HACK_for_intro_alpha;

				// Clear				
				ctxTemp.clearRect(-self.cx,-self.cy,Display.width,Display.height);

				// Background elements
				level.map.drawCCTV(ctxTemp);
				level.conveyors.drawCCTV(ctxTemp);
				_drawCCTV(ctxTemp);

				// Draw props
				for(var i=0;i<props.length;i++){
					var prop = props[i];
					prop.drawCCTV(ctxTemp);
				}

				// Mask with prism eyes
				_mask2(ctxTemp);

				// HACK: ALPHA
				if(level.config.id=="intro") ctxTemp.globalAlpha = 1;
				
				// Draw to main
				ctx.drawImage(Display.canvas.tmp,0,0);

			}

			if(level.config.id=="intro"){
				var HACK_goto_alpha = (level.player.x>28*Map.TILE_SIZE) ? 1 : 0;
				HACK_for_intro_alpha = HACK_for_intro_alpha*0.8 + HACK_goto_alpha*0.2;
			}

			/////////////////////
			// DRAW MAIN LAYER //
			/////////////////////

			// Clear
			ctxTemp.clearRect(-self.cx,-self.cy,Display.width,Display.height);

			// Background elements
			level.map.draw(ctxTemp);
			level.conveyors.draw(ctxTemp);

			// Don't draw CCTV on walls
			var temp = Display.context.tmp2;
			if(level.config.id=="intro") temp.globalAlpha = HACK_for_intro_alpha;
			temp.translate(self.cx,self.cy);
			temp.clearRect(-self.cx,-self.cy,Display.width,Display.height);
			_drawCCTV(temp);
			for(var y=0;y<level.map.tiles.length;y++){
				for(var x=0;x<level.map.tiles[y].length;x++){
					var tile = level.map.tiles[y][x];
					if(tile==Map.SCREEN||tile==Map.SCREEN_LINE||tile==Map.WALL){
						temp.clearRect(x*Map.TILE_SIZE,y*Map.TILE_SIZE,Map.TILE_SIZE,Map.TILE_SIZE);
					}
				}
			}
			temp.translate(-self.cx,-self.cy);
			ctxTemp.drawImage(Display.canvas.tmp2, -self.cx, -self.cy);
			if(level.config.id=="intro") temp.globalAlpha = 1;

			// HACK: Suspicion - draw over all.
			if(level.suspicion.isHiding){
				ctxTemp.fillStyle = "rgba(255,0,0,0.5)";
				ctxTemp.fillRect(-self.cx,-self.cy,Display.width,Display.height);
			}

			// Draw props
			for(var i=0;i<props.length;i++){
				var prop = props[i];
				prop.draw(ctxTemp);
			}

			// Mask with polygon
			_mask(level.player.sightPolygon,ctxTemp);

			// Draw to main
			ctx.drawImage(Display.canvas.tmp,0,0);

			// TEMP LAYER - TRANSLATE 2
			ctxTemp.translate(-self.cx,-self.cy);

		};

		// Mask helper
		var _mask = function(poly,ctx){

			// Create mask polygon path
			ctx.beginPath();
			ctx.moveTo(poly[0][0], poly[0][1]);
			ctx.fillStyle = "#000";
			for (var i = 1; i < poly.length; ++i) {
				ctx.lineTo(poly[i][0], poly[i][1]);
			}

			// Fill in mask
			ctx.globalCompositeOperation = "destination-in";
			ctx.fill();
			ctx.globalCompositeOperation = "source-over";

		};

		// Mask helper 2
		var _mask2 = function(ctx){

			// Temp & translate
			var temp = Display.context.tmp2;
			temp.translate(self.cx,self.cy);
			temp.clearRect(-self.cx,-self.cy,Display.width,Display.height);
			temp.fillStyle = "#000";

			// Draw all prism sights.
			// TODO: Cache 'em?
			var prisms = level.prisms.prisms;
			for(var i=0;i<prisms.length;i++){
				var prism = prisms[i];
				if(!prism.active) continue;
				var poly = prism.sightPolygon;
					
				temp.beginPath();
				temp.moveTo(poly[0][0], poly[0][1]);
				for (var j=1; j<poly.length; ++j) {
					temp.lineTo(poly[j][0], poly[j][1]);
				}
				temp.closePath();
				temp.fill();

			}

			// Undo translate
			temp.translate(-self.cx,-self.cy);

			// Mask it all
			ctx.globalCompositeOperation = "destination-in";
			ctx.drawImage(Display.canvas.tmp2, -self.cx, -self.cy);
			ctx.globalCompositeOperation = "source-over";

		};

		var cctvY = 0;
		var _drawCCTV = function(ctx){
			if(level.config.id!="intro" || HACK_for_intro_alpha>0.01){

				// Draw CCTV over
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