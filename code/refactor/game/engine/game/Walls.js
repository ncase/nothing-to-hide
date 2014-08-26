function Walls(level){
	
	var self = this;
	self.level = level;
	self.map = level.map;

	////////////////////////

	self.FILL_BACKGROUND = "#363B43";

	////////////////////////

	self.init = function(){

		// FIND ALL WALL SCREEN SEGMENTS //	
		// 1. Iterate tile from left-to-right, top-to-bottom
		// 2. If find a screen tile AND not already in a segment,
		//    find the bottom-most edge, and remember this as a segment.
		// 3. Repeat until hit the last, bottom-right tile.

		var tiles = self.map.tiles;
		self.segments = [];
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				var tile = tiles[y][x];
				if(tile==self.map.SCREEN && !_isInSegment(x,y)){
					self.segments.push(_createSegment(x,y));
				}
			}
		}

		// DRAW SCREEN CANVAS //

		self.screenCanvas = document.createElement("canvas");
		self.screenCanvas.width = self.map.width * W;
		self.screenCanvas.height = self.map.height * H;
		self.screenContext = self.screenCanvas.getContext('2d');
		var ctx = self.screenContext;
		ctx.fillStyle = self.FILL_BACKGROUND;
		ctx.fillRect(0,0,self.screenCanvas.width,self.screenCanvas.height);

	};
	
	self.update = function(){

		// Calculate each wall section's bounce factor.
		
		for(var i=0;i<self.segments.length;i++){
			
			var seg = self.segments[i];

			// Activation countdown
			if(seg.countdown>0){
				seg.countdown--;
				continue;
			}else if(seg.countdown==-1){
				// Just started Countdown - linear distance from player
				seg.countdown = Math.floor(Math.abs(seg.x+0.5 - level.player.x)) + 5;
			}

			// If is/not seen, bounce to hidden/showing
			var seenByPlayer = _isSeenByPlayer(seg);
			var gotoPosition = seenByPlayer ? 1 : 0;
			seg.vel += (gotoPosition-seg.pos)*0.2;
			seg.vel *= 0.7;
			seg.pos += seg.vel;

		}

	};

	self.draw = function(gameContext){

		// Redraw all Wall Objects
		var wallobjects = level.wallobjects;
		for(var i=0;i<wallobjects.length;i++){
			wallobjects[i].draw(self.screenContext);
		}

		// Draw bits of our canvas, offput by the bounce factor
		var ctx = gameContext;
		for(var i=0;i<self.segments.length;i++){
			var seg = self.segments[i];
			var t = seg.pos;
			if(t>0.01 && t<=1){
				// Below the bounce
				var sx = seg.x;
				var sy = seg.y;
				var sw = seg.width;
				var sh = t*seg.height;
				var dx = sx;
				var dy = (seg.y+(1-t)*seg.height);
				var dw = sw;
				var dh = sh;
				ctx.drawImage(self.screenCanvas, sx*W, sy*H, sw*W, sh*H, dx*W, dy*H, dw*W, dh*H);
			}else if(t>1){
				// Bounced a little too far
				var sx = seg.x;
				var sy = seg.y+(t-1)*seg.height;
				var sw = seg.width;
				var sh = (2-t)*seg.height;
				var dx = sx;
				var dy = seg.y;
				var dw = sw;
				var dh = sh;
				ctx.drawImage(self.screenCanvas, sx*W, sy*H, sw*W, sh*H, dx*W, dy*H, dw*W, dh*H);
			}
			// Otherwise, is not in the frame at all.
		}

	};

	// EXTERNAL METHODS //

	self.findSegmentByTile = _isInSegment;

	// HELPER METHODS //

	function _isInSegment(x,y){
		for(var i=0;i<self.segments.length;i++){
			var segment = self.segments[i];
			if(x>=segment.x && x<segment.x+segment.width
				&& y>=segment.y && y<segment.y+segment.height){
				return segment;
			}
		}
		return null;
	}
	function _createSegment(startX,startY){

		var x,y,tile;
		var tiles = self.map.tiles;

		// Get bottom-most edge of screen
		var height = 0;
		x = startX;
		y = startY;
		tile = tiles[y][x];
		while(tile==self.map.SCREEN){
			y++;
			height++;
			tile = tiles[y][x];
		}

		// Return the beast
		// ALSO: Position, Velocity, and Activation Countdown
		return {
			x: startX,
			y: startY,
			width: 1,
			height: height,
			pos: 0,
			vel: 0,
			countdown: -1
		};

	}

	function _isSeenByPlayer(segment){
		var segmentCenter = {
			x: segment.x+segment.width/2,
			y: segment.y+segment.height/2
		};
		var playerSightPolygon = SightAndLight.compute(level.player, level.shadow.shadows);
		return SightAndLight.inPolygon(segmentCenter,playerSightPolygon);
	}
	
}