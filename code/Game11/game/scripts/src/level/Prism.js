(function(exports){

	var Prism = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		// Bounds
		var w = Map.TILE_SIZE;
		var h = Map.TILE_SIZE/2;
		self.bounds = {
			left: -(w/2-1),
			right: (w/2-1),
			top: -(h-1),
			bottom: -1
		}

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		self.nearPlayer = false;
		this.update = function(){
			if(level.config.id!="intro"){
				// Are you near?
				var dx = self.x - level.player.x;
				var dy = self.y - level.player.y;
				self.nearPlayer = ( (dx*dx + dy*dy < 50*50) && !level.player.holdingPrism );
			}

			// CCTV
			dotOffset += 4;
			if(dotOffset>=100) dotOffset=0;
		};
		var dotOffset = 0;

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		var shimmerSprite = new Sprite("Shimmer");
		shimmerSprite.regX = -40;
		shimmerSprite.regY = -40;

		var prismSprite = new Sprite("MrPrism");
		prismSprite.regX = -25;
		prismSprite.regY = -50;

		var buttonSprite = new Sprite("Button");
		buttonSprite.regX = -40;
		buttonSprite.regY = -40;
		buttonSprite.scaleX = buttonSprite.scaleY = 0;
		var buttonRotation = 0;

		var EYE_WIDTH = 8;
		var EYE_HEIGHT = 5;
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

			// What frame?
			prismSprite.frameIndex = (self.active) ? 1 : 0;
			if(self.id){
				prismSprite.frameIndex += 11;
			}
			prismSprite.x = self.x;
			prismSprite.y = self.y;
			prismSprite.draw(ctx);

			// Translate, yo
			ctx.save();
		    ctx.translate(self.x,self.y);
		    ctx.translate(prismSprite.regX,prismSprite.regY);

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
				vectToPlayer.x *= EYE_WIDTH/mag;
				vectToPlayer.y *= EYE_HEIGHT/mag;

				// Draw black circle
				ctx.save();
				ctx.translate(21,38);
				ctx.fillStyle = "#000";
				ctx.beginPath(); 
				ctx.arc(vectToPlayer.x,vectToPlayer.y,2,0,Math.PI*2,true);
				ctx.fill();
				ctx.restore();

			}
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
				vectToPlayer.x *= EYE_WIDTH/mag;
				vectToPlayer.y *= EYE_HEIGHT/mag;

				// Draw black circle
				var ctx = cctvContext;
				ctx.save();
				ctx.translate(self.x+prismSprite.regX+21, self.y+prismSprite.regY+38);
				ctx.fillStyle = "#999";
				ctx.beginPath(); 
				ctx.arc(vectToPlayer.x,vectToPlayer.y,2,0,Math.PI*2,true);
				ctx.fill();
				ctx.restore();

			}

		};

		// Draw Sight Line
		var _drawSightLine = function(ctx){

			if(self.sightPolygon){

				// Objects in sight
				var humanoids = [level.player].concat(level.dummies.dummies);
				var humanoidsSeen = [];
				for(var i=0;i<humanoids.length;i++){
					var hum = humanoids[i];
					if(VisibilityPolygon.inPolygon([hum.x,hum.y], self.sightPolygon)){
						humanoidsSeen.push(hum);
					}
				}

				// A dotted to each humanoid seen
				ctx.fillStyle = (self.id) ? "#99F" : "#FA0";
				for(var i=0;i<humanoidsSeen.length;i++){
					var hum = humanoidsSeen[i];
					var vect = {
						x: hum.x-self.x,
						y: hum.y-self.y
					};
					var mag = Math.sqrt(vect.x*vect.x + vect.y*vect.y);
					vect.x /= mag;
					vect.y /= mag;
					for(var dist=100-dotOffset;dist<mag;dist+=100){
						var dotX = self.x + vect.x*dist;
						var dotY = self.y + vect.y*dist;
						if(dist<100){
							ctx.globalAlpha = dist/100;
						}else if(dist>mag-100){
							ctx.globalAlpha = 1 - (dist-(mag-100))/100;
						}else{
							ctx.globalAlpha = 1;
						}
						ctx.beginPath(); 
						ctx.arc(dotX,dotY,4,0,Math.PI*2,true);
						ctx.fill();
					}
				}
				ctx.globalAlpha = 1;

			}

		};

	};

	exports.Prism = Prism;

})(window);