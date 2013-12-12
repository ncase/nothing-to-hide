(function(exports){

	var Prism = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		self.nearPlayer = false;
		this.update = function(){
			
			// Are you near?
			if(!level.config.level.art.ignoreCameras){
				var dx = self.x - level.player.x;
				var dy = self.y - level.player.y;
				self.nearPlayer = ( (dx*dx + dy*dy < 50*50) && !level.player.holdingPrism );
			}

		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		var ctx = Display.context.game;

		var prismSprite = new Sprite("MrPrism");
		prismSprite.scaleX = prismSprite.scaleY = 0.7;
		prismSprite.regX = -35;
		prismSprite.regY = -55;

		var buttonSprite = new Sprite("Button");
		buttonSprite.regX = -40;
		buttonSprite.regY = -40;
		buttonSprite.scaleX = buttonSprite.scaleY = 0;
		var buttonRotation = 0;

		this.draw = function(){

			ctx.save();

			// CLICK ME
			if(self.nearPlayer){
				buttonSprite.scaleX = buttonSprite.scaleX*0.5 + 1*0.5;
			}else{
				buttonSprite.scaleX = buttonSprite.scaleX*0.5 + 0*0.5;
			}

			// Placeholder CLICK ME circle
			if(buttonSprite.scaleX>0.03){
				buttonSprite.frameIndex = 1;
				buttonSprite.scaleY = buttonSprite.scaleX;
				buttonSprite.x = self.x;
				buttonSprite.y = self.y-10;
				buttonSprite.rotation = 0;
				buttonSprite.draw(ctx);
			}

			// What frame?
			prismSprite.frameIndex = (self.active) ? 1 : 0;
			prismSprite.x = self.x;
			prismSprite.y = self.y;
			prismSprite.draw(ctx);

			// Translate, yo
		    ctx.translate(self.x,self.y);
		    ctx.scale(prismSprite.scaleX,prismSprite.scaleY);
		    ctx.translate(prismSprite.regX,prismSprite.regY);

			// Draw eye pupils
			if(self.active){

				// Looking at player
				var vectToPlayer = {
					x: level.player.x-self.x,
					y: (level.player.y-65)-self.y
				}
				var mag = Math.sqrt(vectToPlayer.x*vectToPlayer.x + vectToPlayer.y*vectToPlayer.y);
				vectToPlayer.x *= 8/mag;
				vectToPlayer.y *= 4/mag;

				// Draw black circle
				ctx.save();
				ctx.translate(30,50);
				ctx.fillStyle = "#000";
				ctx.beginPath(); 
				ctx.arc(vectToPlayer.x,vectToPlayer.y,3,0,Math.PI*2,true);
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

	};

	exports.Prism = Prism;

})(window);