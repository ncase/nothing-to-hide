function Monolith(level){
	
	var self = this;
	self.level = level;

	//////////////////////

	// ANIMATION //
	self.BODY = "Monolith_Body";
	self.EYE = "Monolith_Eye";

	/////////////////////

	self.init = function(){

		// Tagging & Activeness
		self.active = true;
		level.setTag(self,"slideable");
		level.setTag(self,"sighted");
		level.setTag(self,"monolith");
		if(!self.stationary){
			level.setTag(self,"pickup");
		}

		// Position should be in center of its tile
		if(!self.exact){
			self.x += 0.5;
			self.y += 0.8;
		}

		// Animation
		self.body = new Sprite(self.BODY);
		self.eye = new Sprite(self.EYE);
		self.pupil = new Sprite(self.EYE);
		self.pupil.frameIndex = 2;

		// Figure out if it's active
		self.updateActivity();

		// Sight Polygon immediately
		self.updateSight();

	};

	var bounceVel = 0;
	var bounce = 1;
	self.update = function(){
		
		bounceVel += (1-bounce)*0.8;
		bounceVel *= 0.5;
		bounce += bounceVel;

		self.updateActivity();

	};
	self.updateActivity = function(){
		var tile = level.map.tiles[Math.floor(self.y)][Math.floor(self.x)];
		var shouldBeActive = (tile==level.map.SPACE);
		if(!self.active && shouldBeActive){
			self.active = true;
			level.setTag(self,"sighted");
			level.setTag(self,"monolith");
		}else if(self.active && !shouldBeActive){
			self.active = false;
			level.unTag(self,"sighted");
			level.unTag(self,"monolith");
		}
	};

	var blinking = false;
	var pupilShimmer = Math.floor(Math.random()*10);
	self.draw = function(ctx){

		// Translate EVERYTHING. This is gonna get complex
		ctx.save();
		ctx.translate(self.x*W, self.y*H);

		// Bounce
		ctx.scale(1/bounce,bounce);

		if(self.active){
			self.drawActiveMonolith(ctx);
		}else{
			self.drawAsleepMonolith(ctx);
		}

		// Restore translation
		ctx.restore();

	};

	self.drawActiveMonolith = function(ctx){

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

	};
	self.drawAsleepMonolith = function(ctx){

		// Draw body
		self.body.draw(ctx);

		// Eye relative
		ctx.translate(2,-15);
		self.eye.frameIndex = 1;
		self.eye.draw(ctx);

	};

	self.updateSight = function(){
		self.sightPolygon = SightAndLight.compute(self, level.shadow.cctvShadows);
	};

	self.speak = function(message){
		publish("dialogue/show",[self.x,self.y-1.5,message]);
	};

	self.pickup = function(){

		var index = level.realobjects.indexOf(self);
		level.realobjects.splice(index,1);

		level.unTag(self,"sighted");
		level.unTag(self,"monolith");
		level.unTag(self,"pickup");

	};
	self.drop = function(){
		level.realobjects.push(self);

		self.active = true;
		level.setTag(self,"sighted");
		level.setTag(self,"monolith");
		level.setTag(self,"pickup");
		
		self.updateActivity();

		bounceVel -= 0.25;
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