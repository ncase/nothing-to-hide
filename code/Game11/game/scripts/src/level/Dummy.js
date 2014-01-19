(function(exports){

	var Dummy = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		// Bounds
		var w = Map.TILE_SIZE;
		var h = Map.TILE_SIZE/2;
		self.bounds = {
			left: -(w/2-1),
			right: (w/2-1),
			top: -(h-1),
			bottom: -1
		}

		///// UPDATE LOOP /////
		this.update = function(){};

		///// DRAW LOOP /////
		var sprite = new Sprite("Dandy");
		sprite.regX = -75;
		sprite.regY = -100;
		var _draw = function(frameIndex,ctx){
			sprite.frameIndex = frameIndex;
			sprite.x = self.x;
			sprite.y = self.y;
			sprite.draw(ctx);
		};
		this.draw = function(ctx){ _draw(0,ctx); };
		this.drawCCTV = function(ctx){ _draw(1,ctx); };

	};

	exports.Dummy = Dummy;

})(window);