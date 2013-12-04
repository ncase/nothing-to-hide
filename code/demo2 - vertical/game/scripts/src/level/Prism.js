(function(exports){

	var Prism = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		this.update = function(){
			
			// Are you near?
			var dx = self.x - level.player.x;
			var dy = self.y - level.player.y;
			self.nearPlayer = ( (dx*dx + dy*dy < 50*50) && !level.player.holdingPrism );

		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		var ctx = Display.context.background;
		var sprite = Asset.sprite.MrPrism;
		var spriteImage = sprite.image;
		var spriteData = sprite.data;
		this.draw = function(){

			ctx.save();

			// What frame?
			var frameIndex = (self.active) ? 1 : 0;

			// Draw frame
			var frame = spriteData.frames[frameIndex].frame;
		    ctx.translate(self.x,self.y);
		    ctx.scale(0.7,0.7);
		    ctx.translate(-50,-60); // Offset
		    var offset = spriteData.frames[frameIndex].spriteSourceSize;
		    ctx.translate(offset.x,offset.y);
		    ctx.drawImage(spriteImage,frame.x,frame.y,frame.w,frame.h,0,0,frame.w,frame.h);

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
				ctx.translate(43.25,61.5);
				ctx.fillStyle = "#000";
				ctx.beginPath(); 
				ctx.arc(vectToPlayer.x,vectToPlayer.y,3,0,Math.PI*2,true);
				ctx.fill();
				ctx.restore();
			}

			// Placeholder CLICK ME circle
			if(self.nearPlayer){
				ctx.translate(50,50);
				ctx.fillStyle = "rgba(0,255,255,0.5)";
				ctx.beginPath();
				ctx.arc(0,0,50,0,Math.PI*2,true);
				ctx.fill();
			}

			ctx.restore();


		};

	};

	exports.Prism = Prism;

})(window);