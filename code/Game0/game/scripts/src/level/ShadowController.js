(function(exports){

	var ShadowController = function(level,config){

		var self = this;

		// Properties
		this.level = level;
		this.config = config;
		this.shadows = config.shadows.slice(0);

		// MY CANVASSES
		this.shadowCanvas = document.createElement("canvas");
		this.shadowCanvas.width = Math.min(level.map.width, Display.width);
		this.shadowCanvas.height = Math.min(level.map.height, Display.height);
		this.shadowContext = this.shadowCanvas.getContext('2d');
		
		this.camCanvas = document.createElement("canvas");
		this.camCanvas.width = Math.min(level.map.width, Display.width);
		this.camCanvas.height = Math.min(level.map.height, Display.height);
		this.camContext = this.camCanvas.getContext('2d');

		
		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		this.update = function(){};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		var temp_shadowCanvas = document.createElement("canvas");
		var temp_shadowContext = temp_shadowCanvas.getContext("2d");
		temp_shadowCanvas.width = Math.min(level.map.width, Display.width);
		temp_shadowCanvas.height = Math.min(level.map.height, level.map.height);

		this.draw = function(){

			// Positions
			var w = Math.min(level.map.width,Display.width);
			var h = Math.min(level.map.height,Display.height);
			var x = (w==Display.width) ? level.camera.cx : 0;
			var y = (h==Display.height) ? level.camera.cy : 0;

	    	// Draw Player Shadow
			ctx = self.shadowContext;
			ctx.clearRect(0,0,w,h);
			ctx.save();
			ctx.translate(x,y);
			var player = level.player;
		    _drawShadow(ctx,player.x,player.y);
		    ctx.restore();

		    // IGNORE CAMERAS
		    if(level.config.level.art.ignoreCameras) return;

		    // Draw all Camera Sight shadows
	    	ctx = self.camContext;
	    	ctx.clearRect(0,0,w,h);
			ctx.save();
			ctx.translate(x,y);
			var prisms = level.prisms.prisms;
			for(var i=0;i<prisms.length;i++){
				
				var prism = prisms[i];
				if(!prism.active) continue;
				
				prism.sightPolygon = _drawShadow(ctx, prism.x, prism.y);

				// Hack:
				var humanoids = [level.player].concat(level.dummies.dummies);
				var humanoidsSeen = 0;
				for(var j=0;j<humanoids.length;j++){
					var hum = humanoids[j];
					if(VisibilityPolygon.inPolygon([hum.x,hum.y], prism.sightPolygon)){
						humanoidsSeen += 1;
					}
				}
				prism.seesHuman = (humanoidsSeen>0);

			}
			ctx.restore();

		};

		// TO SEGMENTS
		var border = VisibilityPolygon.convertToSegments([
			[[-10,-10],[level.map.width+10,-10],[level.map.width+10,level.map.height+10],[-10,level.map.height+10]]
		]);

		var _drawShadow = function(ctx,lightX,lightY){
			
			// If we want fuzzy shadows
			/*var main = _drawShadowPoly(ctx,lightX,lightY);
			_drawShadowPoly(ctx,lightX+5,lightY+5,true);
			_drawShadowPoly(ctx,lightX+5,lightY-5,true);
			_drawShadowPoly(ctx,lightX-5,lightY+5,true);
			_drawShadowPoly(ctx,lightX-5,lightY-5,true);
			return main;*/

			return _drawShadowPoly(ctx,lightX,lightY);

		};
		var _drawShadowPoly = function(ctx,lightX,lightY,soft){

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
			
			ctx.beginPath();
			ctx.moveTo(poly[0][0], poly[0][1]);
			ctx.fillStyle = soft ? "rgba(0,0,0,0.2)" : "#000";
			for (var i = 1; i < poly.length; ++i) {
				ctx.lineTo(poly[i][0], poly[i][1]);
			}
			ctx.fill();
			
			return poly;

		};

	};

	exports.ShadowController = ShadowController;

})(window);