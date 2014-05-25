(function(exports){

	var Light = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this.type = "light";

		// Bounds
		var w = Map.TILE_SIZE;
		var h = 10;
		self.bounds = {
			left: -(w/2-1),
			right: (w/2-1),
			top: -(h-1),
			bottom: -1
		}

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		this.update = function(){
		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		this.draw = function(ctx){
			ctx.save();
			ctx.translate(self.x,self.y);
			ctx.fillStyle = "#fff";
			ctx.fillRect(0,0,100,100);
			ctx.restore();
		};

		this.drawCCTV = function(cctvContext){

		};

	};

	exports.Light = Light;

})(window);