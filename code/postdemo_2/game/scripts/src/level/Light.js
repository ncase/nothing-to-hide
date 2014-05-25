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

		var poly = [];
		this.update = function(){
			self.updatePolygon();
		};
		this.updatePolygon = function(){
			poly = SightAndLight.compute({x:self.x,y:self.y}, level.shadows.shadows);
		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		this.draw = function(ctx){
			_drawLight(ctx,"rgba(255,255,255,0.7)","#cc2727");
		};

		this.drawCCTV = function(cctvContext){
			_drawLight(cctvContext,"rgba(255,255,255,0.7)","#000");
		};

		var _drawLight = function(ctx,lightStyle, sourceStyle){

			// Create mask polygon path
			ctx.beginPath();
			ctx.moveTo(poly[0].x, poly[0].y);
			ctx.fillStyle = lightStyle;
			for (var i = 1; i < poly.length; ++i) {
				ctx.lineTo(poly[i].x, poly[i].y);
			}
			ctx.fill();

			// Draw a red circle
			ctx.beginPath();
			ctx.arc(self.x, self.y, 5, 0, 2*Math.PI, false);
			ctx.fillStyle = sourceStyle
			ctx.fill();

		};

	};

	exports.Light = Light;

})(window);