function Monolith(level){
	
	var self = this;
	self.level = level;

	//////////////////////

	// ANIMATION //
	self.BODY = "Monolith_Body";
	self.EYE = "Monolith_Eye";

	/////////////////////

	self.init = function(){

		// Position should be in center of its tile
		self.x += 0.5;
		self.y += 0.8;

		// Animation
		self.body = new Sprite(self.BODY);
		self.eye = new Sprite(self.EYE);
		self.pupil = new Sprite(self.EYE);
		self.pupil.frameIndex = 2;

	};
	self.update = function(){
	};

	var blinking = false;
	var pupilShimmer = Math.floor(Math.random()*10);
	self.draw = function(ctx){

		// Translate EVERYTHING. This is gonna get complex
		ctx.save();
		ctx.translate(self.x*W, self.y*H);

		// Draw body
		self.body.draw(ctx);

		// Eye relative
		ctx.translate(2,-15); // pupil position relative to monolith

		// Pupil shimmer - change frame every 15 frames
		pupilShimmer++;
		if(pupilShimmer==10){
			pupilShimmer=0;
			self.pupil.frameIndex++;
			if(self.pupil.frameIndex==5){
				self.pupil.frameIndex=2;
			}
		}

		// Eye & Blinking
		if(blinking<=2){

			// Next frame - Should I blink?
			if(Math.random()<0.01){
				blinking = 5;
			}

			// Blinking scale
			if(blinking==5){
				ctx.scale(1.2,0.8);
			}else if(blinking==2){
				ctx.scale(0.9,1.1);
			}else if(blinking==1){
				ctx.scale(0.95,1.05);
			}
			if(blinking>0) blinking--;

			// Draw eye background
			self.eye.frameIndex = 0;
			self.eye.draw(ctx);

			// Draw pupil, following player/humanoid/interesting thing
			var target = {
				x:level.player.x*W,
				y:level.player.y*H - 90 // look at Poppy's head
			};
			var uv = _getUnitVector(
				{x:self.x*W+2, y:self.y*H-11}, // eye position relative to monolith
				target
			);
			var pupilRadius = 5;
			self.pupil.x = uv.x*pupilRadius;
			self.pupil.y = uv.y*pupilRadius + 4; // pupil is 4 px down relatie to eye
			self.pupil.draw(ctx);

		}else{

			blinking--;

			// Draw eye background
			self.eye.frameIndex = 1;
			self.eye.draw(ctx);

		}

		// Restore translation
		ctx.restore();

	};

	// HELPER METHOD //
	function _getUnitVector(from,to){
		var dx = to.x - from.x;
		var dy = to.y - from.y;
		var dist = Math.sqrt(dx*dx+dy*dy);
		return {
			x: dx/dist,
			y: dy/dist
		};
	}
	
}