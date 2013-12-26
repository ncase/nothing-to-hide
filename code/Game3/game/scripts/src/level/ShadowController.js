(function(exports){

	var ShadowController = function(level,config){

		var self = this;

		// Properties
		this.level = level;
		this.config = config;
		this.shadows = config.shadows.slice(0);

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		this.update = function(){

			var player = level.player;
		    player.sightPolygon = _createPoly(player.x,player.y);

		    // IGNORE CAMERAS
		    if(level.config.level.art.ignoreCameras) return;

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
					if(VisibilityPolygon.inPolygon([hum.x,hum.y], prism.sightPolygon)){
						humanoidsSeen += 1;
					}
				}
				prism.seesHuman = (humanoidsSeen>0);

			}

		};

		this.draw = function(){};

		// TO SEGMENTS
		var border = VisibilityPolygon.convertToSegments([
			[[-10,-10],[level.map.width+10,-10],[level.map.width+10,level.map.height+10],[-10,level.map.height+10]]
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