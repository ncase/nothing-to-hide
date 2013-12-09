(function(exports){

	var ShadowController = function(level,config){

		var self = this;

		// Properties
		this.level = level;
		this.config = config;
		this.shadows = config.shadows.slice(0);

		// MY CANVASSES
		this.shadowCanvas = document.createElement("canvas");
		this.shadowCanvas.width = level.map.width;
		this.shadowCanvas.height = level.map.height;
		this.shadowContext = this.shadowCanvas.getContext('2d');
		this.camCanvas = document.createElement("canvas");
		this.camCanvas.width = level.map.width;
		this.camCanvas.height = level.map.height;
		this.camContext = this.camCanvas.getContext('2d');
		
		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		this.update = function(){};

		var _testInShadow = function(ctx,x,y){

			// If it's hitting a wall, yeah it's hidden
			if(level.map.hitTest(x,y)) return true;

			// Center & Pixel-Perfect
			var px = x;
			var py = y;
			px = Math.round(px);
			py = Math.round(py);

			// If you're out of screen, duh you're hiding.
			if(px<0||py<0||px>level.map.width||py>level.map.height){
				return true;
			}

			// Are you on a transparent part of the shadow canvas?
			var imageData = ctx.getImageData(px,py,1,1);
			var alpha = imageData.data[3];
			var isHiding = (alpha>200);
			return isHiding;

		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		var temp_shadowCanvas = document.createElement("canvas");
		var temp_shadowContext = temp_shadowCanvas.getContext("2d");
		temp_shadowCanvas.width = level.map.width;
		temp_shadowCanvas.height = level.map.height;

		this.draw = function(){

	    	// Draw Player Shadow
			ctx = self.shadowContext;
			ctx.clearRect(0,0,level.map.width,level.map.height);
			var player = level.player;
		    _drawShadow(ctx,player.x,player.y);

		    // Draw all Camera Sight shadows
	    	ctx = self.camContext;
	    	ctx.globalAlpha = 1.0;
			ctx.globalCompositeOperation = "source-over";
			ctx.fillRect(0,0,level.map.width,level.map.height);
			ctx.globalCompositeOperation = "source-in";
			var prisms = level.prisms.prisms;
			for(var i=0;i<prisms.length;i++){
				var prism = prisms[i];
				if(!prism.active) continue;

				temp_shadowContext.clearRect(0,0, temp_shadowCanvas.width, temp_shadowCanvas.height);
				_drawShadow(temp_shadowContext, prism.x, prism.y);
				ctx.drawImage(temp_shadowCanvas,0,0);

				// Hack:
				var humanoids = [level.player].concat(level.dummies.dummies);
				var humanoidsSeen = 0;
				for(var j=0;j<humanoids.length;j++){
					var hum = humanoids[j];
					if(!_testInShadow(temp_shadowContext, hum.x, hum.y)) humanoidsSeen += 1;
				}
				prism.seesHuman = (humanoidsSeen>0);

			}

		};

		var _drawShadow = function(ctx,lightX,lightY){

			var vector, vectorLength;
			var shadows = self.shadows;

			// Draw Shadow
		    for(var i=0;i<shadows.length;i++){
				var shadow = shadows[i];

				// Begin drawing shadow
		    	ctx.beginPath();

			    // From the start of the wall to the end of the wall
			    ctx.moveTo(shadow.ax,shadow.ay);
			    ctx.lineTo(shadow.bx,shadow.by);

			    // From the end of the wall to a far enough distance away from the light source.
			    vector = { x:shadow.bx-lightX, y:shadow.by-lightY };
			    vectorLength = Math.sqrt(vector.x*vector.x+vector.y*vector.y);
			    vector.x *= 10000/vectorLength;
			    vector.y *= 10000/vectorLength;
			    ctx.lineTo(shadow.bx+vector.x,shadow.by+vector.y);

			    // From the start of the wall to a far enough distance away from the light source.
			    vector = { x:shadow.ax-lightX, y:shadow.ay-lightY };
			    vectorLength = Math.sqrt(vector.x*vector.x+vector.y*vector.y);
			    vector.x *= 10000/vectorLength;
			    vector.y *= 10000/vectorLength;
			    ctx.lineTo(shadow.ax+vector.x,shadow.ay+vector.y);

			    // Fill in the shadow
		    	ctx.fill();

			}

		};

	};

	exports.ShadowController = ShadowController;

})(window);