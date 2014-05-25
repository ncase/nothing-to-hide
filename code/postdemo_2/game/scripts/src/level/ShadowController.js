(function(exports){

	var ShadowController = function(level,config){

		var self = this;

		// Properties
		this.level = level;
		this.config = config;

		///////////////////////////////////
		//// GENERATE SHADOWS FROM MAP ////
		///////////////////////////////////

		this.shadows = [];

		var tiles = level.map.tiles;
		var blocks = [];

		// 1. Iterate from left-to-right, top-to-bottom
		// 2. If it's a screen/wall AND not already in a block, find its rectangle & remember it.
		// 3. Repeat until hit bottom-right
		for(var y=0;y<tiles.length;y++){
			for(var x=0;x<tiles[y].length;x++){
				var tile = tiles[y][x];
				if((tile==Map.SCREEN || tile==Map.WALL) && !_isInBlock(x,y)){
					blocks.push(_findWallBlock(x,y));
				}
			}
		}
		for(var i=0;i<blocks.length;i++){
			var block = blocks[i];
			block.left *= Map.TILE_SIZE;
			block.top *= Map.TILE_SIZE;
			block.right *= Map.TILE_SIZE;
			block.bottom *= Map.TILE_SIZE; 
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
		this.shadows.push({ax:-1, bx:level.map.width+1, ay:-1, by:-1}); // top
		this.shadows.push({ax:-1, bx:level.map.width+1, ay:level.map.height+1, by:level.map.height+1}); // bottom
		this.shadows.push({ax:-1, bx:-1, ay:-1, by:level.map.height+1}); // left
		this.shadows.push({ax:level.map.width+1, bx:level.map.width+1, ay:-1, by:level.map.height+1}); // right

		// Now, the shadow-walls for IEYES & LIGHTS.
		this.lightShadows = JSON.parse(JSON.stringify(this.shadows));
		for(var i=0;i<blocks.length;i++){
			var block = blocks[i];
			this.lightShadows.push({ax:block.left, bx:block.right, ay:block.bottom, by:block.bottom}); // bottom
		}

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		this.update = function(){

			var player = level.player;
		    player.sightPolygon = _createPoly(player.x,player.y);

		    // All Camera Sight shadows
			var prisms = level.prisms.prisms;
			for(var i=0;i<prisms.length;i++){
				
				var prism = prisms[i];
				if(!prism.active) continue;
				
				prism.sightPolygon = _createPoly(prism.x, prism.y);

				// Hack:
				var humanoids = [level.player].concat(level.dummies.dummies);
				var humanoidsSeen = 0;
				for(var j=0;j<humanoids.length;j++){
					var hum = humanoids[j];
					if(SightAndLight.inPolygon(hum, prism.sightPolygon)){
						humanoidsSeen += 1;
					}
				}
				prism.seesHuman = (humanoidsSeen>0);

			}

		};

		this.draw = function(){};
		var _createPoly = function(lightX,lightY){
			var poly = SightAndLight.compute({x:lightX,y:lightY}, self.shadows);
			return poly;
		};

		// Find Wall Block
		function _findWallBlock(startX,startY){

			var x,y,tile;
			var tiles = level.map.tiles;

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
			var tiles = level.map.tiles;

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

	exports.ShadowController = ShadowController;

})(window);