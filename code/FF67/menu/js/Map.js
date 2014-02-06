(function(exports){
	
	var Map = function(level,config){

		// TEXTURES
		textures = {};
		var _createTextureFromImage = function(imageName){
			var patternTexture = Asset.image[imageName];
			var pattern = context.tmp.createPattern(patternTexture, 'repeat');
			textures[imageName] = pattern;
			return pattern;
		}
		_createTextureFromImage("carpet");
		_createTextureFromImage("screenline");
		///////
	
		var self = this;

		// Properties
		this.level = level;
		this.config = config;

		// Graphics
		this.propaganda = config.propaganda || [];

		// Dimensions
		var tiles = config.map;
		var width = tiles[0].length;
		var height = tiles.length;
		this.tiles = tiles;
		this.width = width*Map.TILE_SIZE;
		this.height = height*Map.TILE_SIZE;

		// MY CANVASSES
		
		this.camCanvas = document.createElement("canvas");
		this.camCanvas.width = Math.min(self.width, WIDTH);
		this.camCanvas.height = Math.min(self.height, HEIGHT);
		this.camContext = this.camCanvas.getContext('2d');

		// Collision Hittest
		this.getTile = function(px,py){
			var x = Math.floor(px/Map.TILE_SIZE);
			var y = Math.floor(py/Map.TILE_SIZE);
			if(x<0||x>=width) return Map.WALL;
			if(y<0||y>=height) return Map.WALL;
			return tiles[y][x];	
		};
		this.hitTest = function(px,py){
			var tile = this.getTile(px,py);
			return(tile==Map.WALL || tile==Map.SCREEN || tile==Map.SCREEN_LINE || tile==Map.PROP);
		}

		///////////////////
		///// DRAWING /////
		///////////////////

		// Create background cache canvasses
		var bgCache = document.createElement("canvas");
		bgCache.width = self.width;
		bgCache.height = self.height;
		var bgContext = bgCache.getContext('2d');

		var camCache = document.createElement("canvas");
		camCache.width = self.width;
		camCache.height = self.height;
		var camContext = camCache.getContext('2d');

		var lineCache = document.createElement("canvas");
		lineCache.width = self.width;
		lineCache.height = self.height;
		var lineContext = lineCache.getContext('2d');

		var liesCache = document.createElement("canvas");
		liesCache.width = self.width;
		liesCache.height = self.height;
		var liesContext = liesCache.getContext('2d');

		self.bgCache = bgCache;
		self.camCache = camCache;
		self.lineCache = lineCache;
		self.liesCache = liesCache;

		// Drawing placeholders
		_makePlaceholderCCTV(self,camContext,tiles,config);
		_makePlaceholderBG(self,bgContext,tiles,config);
		_makePlaceholderLine(self,lineContext,tiles,config);
		_makePropaganda(self,liesContext,tiles,config);

		// Draw Loop
		this.draw = function(ctx){
			
			// Draw background
			ctx.drawImage(bgCache,0,0);

			// Draw Propaganda Images & Blackouts
			var bump = 0;
			for(var i=0;i<blackouts.length;i++){
				var bo = blackouts[i];

				// Change visibility if seen in middle.
				var gotoPosition = _blackoutIsSeen(bo,Menu.shadows.sightPolygon) ? 1 : 0;
				bo.vel += (gotoPosition-bo.pos)*0.2;
				bo.vel *= 0.7;
				bo.pos += bo.vel;

				// Image there
				var t = bo.pos;
				if(t>0 && t<=1 && Math.floor(t*bo.height)>0){
					ctx.drawImage(
						liesCache,
						bo.x, bo.y, bo.width, t*bo.height, // source
						bo.x, bo.y+(1-t)*bo.height, bo.width, t*bo.height // destination
					);
				}else if(t>1 && Math.floor((2-t)*bo.height)>0){
					ctx.drawImage(
						liesCache,
						bo.x, bo.y+(t-1)*bo.height, bo.width, (2-t)*bo.height, // source
						bo.x, bo.y, bo.width, (2-t)*bo.height // destination
					);
				}

			}

			// Draw screen lines.
			ctx.fillStyle=textures.screenline;
			ctx.translate(1,0);
			for(var i=0;i<screenlines.length;i++){
				var screenline = screenlines[i];
				var x = screenline.x;
				var y = screenline.y;
				ctx.fillRect(x*Map.TILE_SIZE,y*Map.TILE_SIZE,Map.TILE_SIZE,Map.TILE_SIZE);
			}
			ctx.translate(-1,0);

			// Draw props over it ALL
			ctx.drawImage(Asset.image.props,0,0);

		};

		this.drawCCTV = function(ctx){
			ctx.drawImage(camCache,0,0);
		}

		// Propaganda Blackouts
		var blackouts = [];
		function _blackoutIsSeen(bo,poly){
			/*if(VisibilityPolygon.inPolygon([bo.x,bo.y],poly)) return true;
			if(VisibilityPolygon.inPolygon([bo.x+bo.width,bo.y],poly)) return true;
			if(VisibilityPolygon.inPolygon([bo.x,bo.y+bo.height],poly)) return true;
			if(VisibilityPolygon.inPolygon([bo.x+bo.width,bo.y+bo.height],poly)) return true;*/
			if(VisibilityPolygon.inPolygon([bo.x+bo.width/2,bo.y+bo.height],poly)) return true;
			return false;
		}
		function _isInBlackout(x,y){
			for(var i=0;i<blackouts.length;i++){
				var blackout = blackouts[i];
				if(x>=blackout.x && x<blackout.x+blackout.width
					&& y>=blackout.y && y<blackout.y+blackout.height){
					return true;
				}
			}
			return false;
		}
		function _findBlackout(startX,startY){

			var x,y,tile;

			// Get right-most side of screen
			var width = 0;
			x = startX;
			y = startY;
			tile = tiles[y][x];
			while(tile==Map.SCREEN){
				x++;
				width++;
				tile = tiles[y][x];
			}
			if(tile==Map.SCREEN_LINE){ // if it was a line, not a wall, add another.
				width++;
			}

			// Get bottom-most side of screen
			var height = 0;
			x = startX;
			y = startY;
			tile = tiles[y][x];
			while(tile==Map.SCREEN || tile==Map.SCREEN_LINE){
				y++;
				height++;
				tile = tiles[y][x];
			}

			// Return the beast
			return {
				x: startX,
				y: startY,
				width: width,
				height: height,
				pos: 0,
				vel: 0,
			};

		}
		// 1. Iterate from left-to-right, top-to-bottom
		// 2. If it's a screen/screenline AND not already in a blackout, find its rectangle & remember it.
		// 3. Repeat until hit bottom-right
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				var tile = tiles[y][x];
				if((tile==Map.SCREEN || tile==Map.SCREEN_LINE) && !_isInBlackout(x,y)){
					blackouts.push(_findBlackout(x,y));
				}
			}
		}
		for(var i=0;i<blackouts.length;i++){
			var blackout = blackouts[i];
			blackout.x *= Map.TILE_SIZE;
			blackout.y *= Map.TILE_SIZE;
			blackout.width *= Map.TILE_SIZE;
			blackout.height *= Map.TILE_SIZE; 
		}

		// Screen Lines.
		var screenlines = [];
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				if(tiles[y][x]==Map.SCREEN_LINE){
					screenlines.push({ x:x, y:y });
				}
			}
		}


		///////////////////
		///// HELPERS /////
		///////////////////

		// Debug: Get a quick placeholder image
		this._getBackgroundImage = function(){
			return bgCache.toDataURL();
		};
		this._getCCTVImage = function(){
			return camCache.toDataURL();
		};

	};
	var textures;

	// CONSTANTS
	Map.WALL = "#";
	Map.SCREEN = "=";
	Map.SCREEN_LINE = "+";
	Map.SPACE = " ";
	Map.METAL = "M";
	Map.PROP = "@";
	Map.CARPET = ".";
	Map.TILE_SIZE = 50;


	// PLACEHOLDER BACKGROUNDS
	var _makePlaceholderBG = function(self,ctx,tiles,config){
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				switch(tiles[y][x]){
					
					case Map.SPACE: ctx.fillStyle="#D7E7E6"; break;
					case Map.CARPET: ctx.fillStyle=textures.carpet; break;
					case Map.WALL: ctx.fillStyle="#000"; break;
					case Map.SCREEN: ctx.fillStyle="#202328"; break;
					case Map.SCREEN_LINE: ctx.fillStyle="#202328"; break;
					case Map.PROP: ctx.fillStyle="#7F6A5F"; break;
					
					// Placeholder
					//case Map.METAL: ctx.fillStyle="#9900FF"; break;
					case Map.METAL: ctx.fillStyle="#D7E7E6"; break;

				}
				ctx.fillRect(x*Map.TILE_SIZE,y*Map.TILE_SIZE,Map.TILE_SIZE,Map.TILE_SIZE);
			}
		}
	};
	
	var _makePlaceholderCCTV = function(self,ctx,tiles,config){
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				switch(tiles[y][x]){

					case Map.SPACE: ctx.fillStyle="#555"; break;
					case Map.CARPET: ctx.fillStyle=textures.carpet_cctv; break;
					case Map.WALL: ctx.fillStyle="#000"; break;
					case Map.SCREEN: ctx.fillStyle="#000"; break;
					case Map.SCREEN_LINE: ctx.fillStyle="#000"; break;
					case Map.PROP: ctx.fillStyle="#666666"; break;

					// Placeholder
					//case Map.METAL: ctx.fillStyle="#9900FF"; break;
					case Map.METAL: ctx.fillStyle="#D7E7E6"; break;

				}
				ctx.fillRect(x*Map.TILE_SIZE,y*Map.TILE_SIZE,Map.TILE_SIZE,Map.TILE_SIZE);
			}
		}
	};

	var _makePlaceholderLine = function(self,ctx,tiles,config){

		// The border of game
		ctx.fillStyle="#fff";
		ctx.fillRect(0,0,self.width,1);
		ctx.fillRect(0,0,1,self.height);
		ctx.fillRect(0,self.height-1,self.width,1);
		ctx.fillRect(self.width-1,0,1,self.height);

		// Outline
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				var tile = tiles[y][x];
				if(tile==Map.WALL || tile==Map.SCREEN || tile==Map.SCREEN_LINE){
					ctx.fillRect(
						x*Map.TILE_SIZE-1,
						y*Map.TILE_SIZE-1,
						Map.TILE_SIZE+2,
						Map.TILE_SIZE+2
					);
				}
			}
		}

		// Fill
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				var tile = tiles[y][x];
				if(tile==Map.WALL || tile==Map.SCREEN || tile==Map.SCREEN_LINE){
					ctx.fillStyle="#000";
					ctx.fillRect(x*Map.TILE_SIZE,y*Map.TILE_SIZE,Map.TILE_SIZE,Map.TILE_SIZE);
				}
			}
		}
	};

	var _makePropaganda = function(self,ctx,tiles,config){

		// Default background
		ctx.fillStyle = "#363B43";
		ctx.fillRect(0,0,self.width,self.height);

		// All art
		for(var i=0;i<self.propaganda.length;i++){
			var lie = self.propaganda[i];
			switch(lie.type){
				case "image":
					var lieImage = Asset.image[lie.img]; // ????
					ctx.drawImage(lieImage, lie.x*Map.TILE_SIZE, lie.y*Map.TILE_SIZE);
					break;
			}
		}

	};

	exports.Map = Map;

})(window);