(function(exports){

	var Shadow = function(level){

		var self = this;

		// Properties
		self.level = level;

		///////////////////////////////////
		//// GENERATE SHADOWS FROM MAP ////
		///////////////////////////////////

		self.init = function(){

			this.shadows = [];

			var map = level.map;
			var tiles = map.tiles;
			var blocks = [];

			// 1. Iterate from left-to-right, top-to-bottom
			// 2. If it's a screen/wall AND not already in a block, find its rectangle & remember it.
			// 3. Repeat until hit bottom-right
			for(var y=0;y<tiles.length;y++){
				for(var x=0;x<tiles[y].length;x++){
					var tile = tiles[y][x];
					if((tile==map.SCREEN || tile==map.WALL) && !_isInBlock(x,y)){
						blocks.push(_findWallBlock(x,y));
					}
				}
			}

			// Add shadows for each block, yo!
			// Both Walls & Screens have no "bottom"
			for(var i=0;i<blocks.length;i++){
				var block = blocks[i];
				this.shadows.push({ax:block.left, bx:block.right, ay:block.top, by:block.top}); // top
				this.shadows.push({ax:block.left, bx:block.left, ay:block.top, by:block.bottom}); // left
				this.shadows.push({ax:block.right, bx:block.right, ay:block.top, by:block.bottom}); // right
			}

			// Add border
			this.shadows.push({ax:-0.01, bx:map.width+0.01, ay:-0.01, by:-0.01}); // top
			this.shadows.push({ax:-0.01, bx:map.width+0.01, ay:map.height+0.01, by:map.height+0.01}); // bottom
			this.shadows.push({ax:-0.01, bx:-0.01, ay:-0.01, by:map.height+0.01}); // left
			this.shadows.push({ax:map.width+0.01, bx:map.width+0.01, ay:-0.01, by:map.height+0.01}); // right

			// Now, the shadow-walls for IEYES & LIGHTS. (same thing but with a bottom)
			this.lightShadows = JSON.parse(JSON.stringify(this.shadows));
			for(var i=0;i<blocks.length;i++){
				var block = blocks[i];
				this.lightShadows.push({ax:block.left, bx:block.right, ay:block.bottom, by:block.bottom}); // bottom
			}

			/////////////////////////
			//// HELPER METHODS /////
			/////////////////////////

			// Find Wall Block
			function _findWallBlock(startX,startY){

				var x,y,tile;
				var tiles = map.tiles;

				// Get initial tile info
				x = startX;
				y = startY;
				tile = tiles[y][x];
				var startTile = tile;

				// Get initial tile info
				var topBottom = _findTopBottom(startX,startY);
				var startTop = topBottom.top;
				var startBottom = topBottom.bottom;

				// Keep going right as long as TILE & TOP-BOTTOM is the SAME
				while(tile==startTile && startTop==topBottom.top && startBottom==topBottom.bottom){
					x++;
					if(x<tiles[y].length){ // BOUNDS
						tile = tiles[y][x];
						topBottom = _findTopBottom(x,y);
					}else{
						tile = null;
					}
				}
				var rightX = x;

				// Return the block dimensions
				return {
					left: startX,
					top: startTop,
					right: rightX,
					bottom: startBottom,
					tile: startTile
				};

			}
			function _findTopBottom(startX,startY){

				var x,y,tile;
				var tiles = map.tiles;

				// Get initial tile info
				x = startX;
				y = startY;
				tile = tiles[y][x];
				var startTile = tile;

				// Get Top Y
				while(tile==startTile){
					y--;
					if(y>=0){ // BOUNDS
						tile = tiles[y][x];
					}else{
						tile = null;
					}
				}
				var topY = y+1;

				// Restart
				x = startX;
				y = startY;
				tile = tiles[y][x];

				// Bottom Y
				while(tile==startTile){
					y++;
					if(y<tiles.length){ // BOUNDS
						tile = tiles[y][x];
					}else{
						tile = null;
					}
				}
				var bottomY = y;

				// Return info
				return {
					top: topY,
					bottom: bottomY
				};

			};
			function _isInBlock(x,y){
				for(var i=0;i<blocks.length;i++){
					var block = blocks[i];
					if(x>=block.left && x<block.right && y>=block.top && y<block.bottom){
						return true;
					}
				}
				return false;
			};

		};

	};

	exports.Shadow = Shadow;

})(window);