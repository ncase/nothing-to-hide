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
			if(px<0||py<0||px>Display.width||py>Display.height){
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

		var shadowCamCache = document.createElement("canvas");
		shadowCamCache.width = level.map.width;
		shadowCamCache.height = level.map.height;
		var shadowCamContext = shadowCamCache.getContext('2d');
		shadowCamContext.fillStyle = "#000";

		var temp_shadowCanvas = document.createElement("canvas");
		var temp_shadowContext = temp_shadowCanvas.getContext("2d");
		temp_shadowCanvas.width = Display.width;
		temp_shadowCanvas.height = Display.height;

		this.dirtyCam = true;
		this.dirtyMoveCam = true;
		this.draw = function(){

	    	// Draw Player Shadow
			ctx = Display.context.shadows;
			ctx.clearRect(0,0, level.map.width, level.map.height);
			var player = level.player;
		    _drawShadow(ctx,player.x,player.y);
		    _blur(ctx,Display.canvas.shadows,5);

		    // Draw all shadows
		    if(self.dirtyCam){

		    	ctx = Display.context.shadowsCam;
		    	ctx.globalAlpha = 1.0;
				ctx.globalCompositeOperation = "source-over";
				ctx.fillRect(0,0, level.map.width, level.map.height);
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

				// Fuzzy shadows
				_blur(ctx,Display.canvas.shadowsCam,5);
			
			}

		};
		var _blur = function(ctx,canvas,blur){

			return;

			// Centering the cam
			var x = (level.camera.x-Display.width/2);
			var y = (level.camera.y-Display.height/2);

			// Cache it
			temp_shadowContext.clearRect(0,0, temp_shadowCanvas.width, temp_shadowCanvas.height);
			temp_shadowContext.drawImage(canvas,0,0);

			// Diagonal blur
			ctx.globalAlpha = 0.3;
			ctx.globalCompositeOperation = "source-over";
			ctx.drawImage(temp_shadowCanvas,x+blur,y-blur);
			ctx.drawImage(temp_shadowCanvas,x-blur,y-blur);
			ctx.drawImage(temp_shadowCanvas,x+blur,y+blur);
			ctx.drawImage(temp_shadowCanvas,x-blur,y+blur);

		}
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
			    vector.x *= 1000/vectorLength;
			    vector.y *= 1000/vectorLength;
			    ctx.lineTo(shadow.bx+vector.x,shadow.by+vector.y);

			    // From the start of the wall to a far enough distance away from the light source.
			    vector = { x:shadow.ax-lightX, y:shadow.ay-lightY };
			    vectorLength = Math.sqrt(vector.x*vector.x+vector.y*vector.y);
			    vector.x *= 1000/vectorLength;
			    vector.y *= 1000/vectorLength;
			    ctx.lineTo(shadow.ax+vector.x,shadow.ay+vector.y);

			    // Fill in the shadow
		    	ctx.fill();

			}

		};

	};

	exports.ShadowController = ShadowController;

})(window);