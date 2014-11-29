function Map(level){

	var self = this;

	// MY PARSING CONSTANTS
	self.WALL = "#";
	self.SCREEN = "=";
	self.SPACE = " ";
	self.CARPET = ".";

	// MY FILL CONSTANTS
	self.FILL_CARPET = "texture/carpet";
	self.FILL_WALL = "#000000";
	self.FILL_SCREEN = "#202328";
	self.FILL_SPACE = "#999999";

	///////////////////////////////////

	self.level = level;
	self.tiles = level.config.map;

	/////////////////////////////

	self.init = function(){

		// Dimensions
		self.width = self.tiles[0].length;
		self.height = self.tiles.length;

		// Background Canvas
		self.bgCanvas = _createCanvas(self.width*W, self.height*H);
		self.bgContext = self.bgCanvas.getContext('2d');

		// CREATE TEXTURES
		var _createTextureIfNeeded = function(fill){
			if(fill[0]=="#") return fill; // color
			return self.bgContext.createPattern(Asset.image[fill], 'repeat'); // texture
		};
		self.FILL_CARPET = _createTextureIfNeeded(self.FILL_CARPET);
		self.FILL_WALL = _createTextureIfNeeded(self.FILL_WALL);
		self.FILL_SCREEN = _createTextureIfNeeded(self.FILL_SCREEN);
		self.FILL_SPACE = _createTextureIfNeeded(self.FILL_SPACE);

		// DRAW STATIC BACKGROUND
		var tiles = self.tiles;
		var ctx = self.bgContext;
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				var fill;
				switch(tiles[y][x]){
					case self.SPACE: fill=self.FILL_SPACE; break;
					case self.CARPET: fill=self.FILL_CARPET; break;
					case self.WALL: fill=self.FILL_WALL; break;
					case self.SCREEN: fill=self.FILL_SCREEN; break;
				}
				ctx.fillStyle = fill;
				ctx.fillRect(x*W, y*H, W, H);
			}
		}

		// Outline Canvas
		self.lineCanvas = _createCanvas(self.width*W, self.height*H);
		self.lineContext = self.lineCanvas.getContext('2d');

		// DRAW OUTLINE BACKGROUND
		var cvs = self.lineCanvas;
		var ctx = self.lineContext;

		// Outline border
		ctx.fillStyle="#fff";
		ctx.fillRect(0,0,cvs.width,1);
		ctx.fillRect(0,0,1,cvs.height);
		ctx.fillRect(0,cvs.height-1,cvs.width,1);
		ctx.fillRect(cvs.width-1,0,1,cvs.height);

		// Outline walls/screens
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				var tile = tiles[y][x];
				if(tile==self.WALL || tile==self.SCREEN){
					ctx.fillRect(x*W-1, y*H-1, W+2, H+2);
				}
			}
		}
		ctx.fillStyle="#000";
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				var tile = tiles[y][x];
				if(tile==self.WALL || tile==self.SCREEN){
					ctx.fillRect(x*W,y*H,W,H);
				}
			}
		}

		// GRAYSCALE MAP
		self.bgCanvasGray = Grayscale.convertImage(self.bgCanvas);

		// Draw black walls
		var tiles = self.tiles;
		var ctx = self.bgCanvasGray.getContext('2d');
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				if(tiles[y][x] == self.SCREEN){
					ctx.fillStyle = "#000";
					ctx.fillRect(x*W, y*H, W, H);
				}
			}
		}

	};

	function _createCanvas(w,h){
		canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		return canvas;
	}

	// DRAW EVERY FRAME
	self.draw = function(ctx,options){
		options = options || {gray:false};
		ctx.drawImage(options.gray ? self.bgCanvasGray : self.bgCanvas,0,0);
	}

	///////////////////////

	self.hitTest = function(x,y){

		// Out of bounds
		if(x<0 || x>=self.width || y<0 || y>=self.height) return true;
		
		// If not, return if it's hitting a Wall or Screen
		var tile = self.tiles[Math.floor(y)][Math.floor(x)];
	    return( tile==self.WALL || tile==self.SCREEN );

	}

}