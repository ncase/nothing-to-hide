function LoveMonolith(level){
	
	var self = this;
	self.level = level;

	Monolith.call(self,level);

	var blinking = false;
	var pupilShimmer = Math.floor(Math.random()*10);

	var I_AM_DEAD = false;
	var prevWorrying = 0;

	self.dies = new Sprite("Monolith_Dies");
	self.loveBody = new Sprite("Monolith_Love");
	self.cry = new Sprite("Monolith_Cry");

	var lastUpdate = self.update;
	self.update = function(){

		lastUpdate();

		if(I_AM_DEAD){
			if(self.dies.frameIndex<self.dies.data.frames-1){
				self.dies.nextFrame();
			}
			return;
		}

	};

	var worrying = 0;
	self.updateActiveMonolith = function(){
		if(worrying==0){
			self.loveBody.nextFrame();
		}else if(worrying==2){
			self.cry.nextFrame();
		}
	};

	self.drawActiveMonolith = function(ctx,options){

		if(I_AM_DEAD){
			self.dies.draw(ctx,options);
			return;
		}

		//////

		var lover = level[self.lover]; 
		var target = {
			x:lover.x*W,
			y:lover.y*H - 13 // look right in the eye <3
		};

		worrying = 0;
		if(level.pickupLogic.holding==lover){
			if(SightAndLight.inPolygon(level.player,self.sightPolygon)){
				worrying = 1; // where you going...?
				target = {
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
			var bounce = Math.random()*0.1+0.95;
			ctx.scale(bounce,1/bounce);
		}


		///////////////////////////////

		// Draw body
		if(worrying==0){
			self.loveBody.draw(ctx,options);
		}else{
			self.body.draw(ctx,options);
		}

		///////////////////////////////

		// Eye relative
		ctx.translate(2,-15); // pupil position relative to monolith

		if(worrying==2){
			self.cry.draw(ctx,options);
			return;
		}

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
			self.eye.draw(ctx,options);

			// Draw pupil, following player/humanoid/interesting thing
			var uv = _getUnitVector(
				{x:self.x*W+2, y:self.y*H-11}, // eye position relative to monolith
				target
			);
			var pupilRadius = (worrying==2) ? 0 : 5;
			self.pupil.x = uv.x*pupilRadius;
			self.pupil.y = uv.y*pupilRadius + 4; // pupil is 4 px down relatie to eye
			self.pupil.draw(ctx,options);

		}else{

			blinking--;

			// Draw eye background
			self.eye.frameIndex = 1;
			self.eye.draw(ctx,options);

		}

	};

	self.die = function(){

		I_AM_DEAD = true;

		// Yeah basically remove its ability to see
		level.unTag(self,"sighted");
		level.unTag(self,"monolith");
		level.unTag(self,"pickup");

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