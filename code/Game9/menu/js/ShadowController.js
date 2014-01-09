(function(exports){

	var ShadowController = function(level,config){

		var self = this;

		// Properties
		this.config = config;
		this.shadows = config.shadows.slice(0);

		// Update
		var mx = Mouse.x;
		var my = Mouse.y;
		this.update = function(){
			mx = mx*0.5 + Mouse.x*0.5;
			my = my*0.5 + Mouse.y*0.5;
		    self.sightPolygon = _createPoly(mx,my);
		};

		// TO SEGMENTS
		var border = VisibilityPolygon.convertToSegments([
			[[-10,-10],[WIDTH+10,-10],[WIDTH+10,HEIGHT+10],[-10,HEIGHT+10]]
		]);

		var _createPoly = function(lightX,lightY){

			var segments = [];
			for(var i=0;i<self.shadows.length;i++){
				var shadow = self.shadows[i];
				segments.push([
					[shadow.ax,shadow.ay],
					[shadow.bx,shadow.by]
				]);
			}
			segments = segments.concat(border);
			
			var poly = VisibilityPolygon.compute([lightX,lightY], segments);

			return poly;

		};
	};

	exports.ShadowController = ShadowController;

})(window);