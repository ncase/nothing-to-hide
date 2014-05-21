(function(exports){

	var Prism = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this.type = "prism";

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

		// Bounciness
		var bounce = 1;
		var bounceVel = 0;

		self.nearPlayer = false;
		this.update = function(){
			if(level.config.id!="intro"){
				// Are you near?
				var dx = self.x - level.player.x;
				var dy = self.y - level.player.y;
				self.nearPlayer = ( (dx*dx + dy*dy < 50*50) && !level.heldObject );
			}

			// Bounce
		    if(self.justDropped){
		    	bounceVel = -0.3;
		    	self.justDropped = false;
		    }
		    bounceVel += (1-bounce)*0.8;
		    bounceVel *= 0.5;
			bounce += bounceVel;

			// CCTV
			dashOffset -= 3;
			if(dashOffset<0) dashOffset=DASH_LENGTH+DASH_GAP;
		};
		var dashOffset = 0;
		var DASH_LENGTH = 20;
		var DASH_GAP = 60;

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		var shimmerSprite = new Sprite("Shimmer");
		shimmerSprite.regX = -40;
		shimmerSprite.regY = -40;

		var prismSprite = new Sprite("MrPrism");
		prismSprite.regX = -25;
		prismSprite.regY = -75;

		var buttonSprite = new Sprite("Button");
		buttonSprite.regX = -40;
		buttonSprite.regY = -40;
		buttonSprite.scaleX = buttonSprite.scaleY = 0;
		var buttonRotation = 0;

		var eyeSprite = new Sprite("PrismEye");
		eyeSprite.regX = -8;
		eyeSprite.regY = -8;

		this.draw = function(ctx){

			// Sight Line
			_drawSightLine(ctx);

			// CLICK ME
			if(self.nearPlayer){
				buttonSprite.scaleX = buttonSprite.scaleX*0.5 + 0.75*0.5;
			}else{
				buttonSprite.scaleX = buttonSprite.scaleX*0.5 + 0*0.5;
			}

			// Placeholder CLICK ME circle
			if(buttonSprite.scaleX>0.03){
				buttonSprite.frameIndex = 1;
				buttonSprite.scaleY = buttonSprite.scaleX;
				buttonSprite.x = self.x;
				buttonSprite.y = self.y-25;
				buttonSprite.rotation = 0;
				buttonSprite.draw(ctx);
			}

			// Shimmer!
			if(self.id && self.seesHuman){
				shimmerSprite.frameIndex = (shimmerSprite.frameIndex+1)%20;
				shimmerSprite.x = self.x;
				shimmerSprite.y = self.y-25;
				shimmerSprite.draw(ctx);
			}

			// Transform
			ctx.save();
			ctx.translate(self.x,self.y);
			ctx.scale(1/bounce,bounce);

			// What frame?
			prismSprite.frameIndex = (self.active) ? 1 : 0;
			if(self.id){
				prismSprite.frameIndex += 11;
			}
			prismSprite.x = 0;
			prismSprite.y = 0;
			prismSprite.draw(ctx);

			// Draw eye pupils
			if(self.active){

				// Target - HACK!!!
				var target;
				if(level.dummies.dummies.length>0){
					target = level.dummies.dummies[0];
				}else{
					target = {
						x: level.player.x,
						y: level.player.y - 65
					};
				}

				// Looking at target
				var vectToPlayer = {
					x: target.x-self.x,
					y: target.y-self.y
				}
				var mag = Math.sqrt(vectToPlayer.x*vectToPlayer.x + vectToPlayer.y*vectToPlayer.y);
				vectToPlayer.x *= 5/mag;
				vectToPlayer.y *= 5/mag;

				// Draw eye
				eyeSprite.frameIndex = 0;
				eyeSprite.x = prismSprite.regX+23 + vectToPlayer.x;
				eyeSprite.y = prismSprite.regY+59 + vectToPlayer.y;
				eyeSprite.draw(ctx);

			}

			// Restore
			ctx.restore();

			// Placeholder CLICK ME circle
			if(buttonSprite.scaleX>0.03){
				buttonSprite.frameIndex = 0;
				buttonSprite.rotation = buttonRotation;
				buttonRotation += 0.05;
				buttonSprite.draw(ctx);
			}


		};

		this.drawCCTV = function(cctvContext){

			// Sight Line
			_drawSightLine(cctvContext);

			// The BLANK frame
			prismSprite.frameIndex = (self.active) ? 3 : 2;
			if(self.id){
				prismSprite.frameIndex += 11;
			}
			prismSprite.x = self.x;
			prismSprite.y = self.y;
			prismSprite.draw(cctvContext);

			// Draw eye pupils
			if(self.active){

				// Target - HACK!!!
				var target;
				if(level.dummies.dummies.length>0){
					target = level.dummies.dummies[0];
				}else{
					target = {
						x: level.player.x,
						y: level.player.y - 65
					};
				}

				// Looking at target
				var vectToPlayer = {
					x: target.x-self.x,
					y: target.y-self.y
				}
				var mag = Math.sqrt(vectToPlayer.x*vectToPlayer.x + vectToPlayer.y*vectToPlayer.y);
				vectToPlayer.x *= 5/mag;
				vectToPlayer.y *= 5/mag;

				// Draw eye
				eyeSprite.frameIndex = 1;
				eyeSprite.x = self.x+prismSprite.regX+23 + vectToPlayer.x;
				eyeSprite.y = self.y+prismSprite.regY+59 + vectToPlayer.y;
				eyeSprite.draw(cctvContext);

			}

		};

		// Draw Sight Line
		var _drawSightLine = function(ctx){

			if(self.sightPolygon && self.active){

				// Objects in sight
				var humanoids = [level.player].concat(level.dummies.dummies);
				var humanoidsSeen = [];
				for(var i=0;i<humanoids.length;i++){
					var hum = humanoids[i];
					if(SightAndLight.inPolygon(hum, self.sightPolygon)){
						humanoidsSeen.push(hum);
					}
				}

				// Dashy lines
				ctx.lineWidth = 4;
				ctx.lineCap = "square";
				ctx.strokeStyle = (self.id) ? "#99F" : "#FA0";
				for(var i=0;i<humanoidsSeen.length;i++){

					// Vector to humanoid
					var hum = humanoidsSeen[i];
					var vect = {
						x: hum.x-self.x,
						y: hum.y-self.y
					};
					var mag = Math.sqrt(vect.x*vect.x + vect.y*vect.y);
					vect.x /= mag;
					vect.y /= mag;

					// Begin drawing - ALL ONE STROKE
					ctx.beginPath();

					// Per dash
					var drawDash = true;
					for(var dist=-dashOffset;dist<mag;true){

						drawDash = !drawDash;
						if(dist>=mag) break;

						var dashDist = (dist<0) ? 0 : dist;
						var dashX = self.x + vect.x*dashDist;
						var dashY = self.y + vect.y*dashDist;

						if(drawDash){
							ctx.moveTo(dashX,dashY);
							dist += DASH_LENGTH;
						}else{
							ctx.lineTo(dashX,dashY);
							dist += DASH_GAP;
						}

					}

					// End stroke
					if(drawDash){
						var dashX = hum.x;
						var dashY = hum.y;
						ctx.lineTo(dashX,dashY);
					}
					ctx.stroke();

				}

			}

		};

	};

	exports.Prism = Prism;

})(window);