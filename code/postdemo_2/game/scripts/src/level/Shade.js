(function(exports){

	var Shade = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this.type = "shade";

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

		var poly = [];
		this.update = function(){
		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		this.draw = function(ctx){
			_drawShade(ctx,"rgba(255,255,255,0.7)","#cc2727");
		};

		this.drawCCTV = function(cctvContext){
			_drawShade(cctvContext,"rgba(255,255,255,0.7)","#000");
		};

		var _drawShade = function(ctx,shadeStyle, sourceStyle){
			ctx.save();
			ctx.strokeStyle = "#000";
			ctx.lineWidth = 4;
			ctx.strokeRect(self.x-25,self.y-25,50,50);
			ctx.restore();
		};

	};

	exports.Shade = Shade;

})(window);