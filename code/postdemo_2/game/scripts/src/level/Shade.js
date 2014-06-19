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

			// Coordinates
			var x0,x1,x2,x3, y0,y1,y2,y3;
			x0 = self.x - 22.5;
			x1 = self.x - 7.5;
			x2 = self.x + 7.5;
			x3 = self.x + 22.5;
			y0 = self.y - 22.5;
			y1 = self.y - 7.5;
			y2 = self.y + 7.5;
			y3 = self.y + 22.5;
			var points = [
				[x2,y0], // top
				[x3,y1], // TR corner
				[x3,y2], // right
				[x2,y3], // BR corner
				[x1,y3], // bottom
				[x0,y2], // BL corner
				[x0,y1], // left
				[x1,y0]  // TL corner
			];

			ctx.save();
			ctx.strokeStyle = "#000";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(points[0][0],points[0][1]);
			for(var i=1;i<points.length;i++){
				ctx.lineTo(points[i][0],points[i][1]);
			}
			ctx.lineTo(points[0][0],points[0][1]);
			ctx.stroke();
			ctx.restore();
		};

	};

	exports.Shade = Shade;

})(window);