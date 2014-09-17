function LoveMonolith(level){
	
	var self = this;
	self.level = level;

	Monolith.call(self,level);

	var blinking = false;
	var pupilShimmer = Math.floor(Math.random()*10);

	var prevWorrying = 0;
	self.drawActiveMonolith = function(ctx){

		var lover = level[self.lover]; 
		var target = {
			x:lover.x*W,
			y:lover.y*H - 13 // look right in the eye <3
		};

		var worrying = 0;
		if(level.pickupLogic.holding==lover){
			if(SightAndLight.inPolygon(level.player,self.sightPolygon)){
				worrying = 1; // where you going...?
				var target = {
					x:level.player.x*W,
					y:level.player.y*H - 50 // look at Poppy's arms
				};
			}else{
				worrying = 2; // OH GOD THEY'RE GONE
			}
		}else{
			if(SightAndLight.inPolygon(lover,self.sightPolygon)){
				worrying = 0; // Whew, you're safe
			}else{
				worrying = 2; // OH GOD WHERE ARE YOU
			}
		}
		if(prevWorrying!=worrying){
			blinking = 5;
		}
		prevWorrying = worrying;

		if(worrying==2){
			var bounce = Math.random()*0.2+0.9;
			ctx.scale(bounce,1/bounce);
		}


		///////////////////////////////

		// Draw body
		self.body.draw(ctx);

		///////////////////////////////

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
			var uv = _getUnitVector(
				{x:self.x*W+2, y:self.y*H-11}, // eye position relative to monolith
				target
			);
			var pupilRadius = (worrying==2) ? 0 : 5;
			self.pupil.x = uv.x*pupilRadius;
			self.pupil.y = uv.y*pupilRadius + 4; // pupil is 4 px down relatie to eye
			self.pupil.draw(ctx);

		}else{

			blinking--;

			// Draw eye background
			self.eye.frameIndex = 1;
			self.eye.draw(ctx);

		}

	};

	var _drop = self.drop;
	self.drop = function(){
		_drop();
		blinking = 5;
	};

	// HELPER METHODS //
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