function FreakMonolith(level){
	
	var self = this;
	self.level = level;

	Monolith.call(self,level);

	////////////

	var blinking = false;
	var pupilShimmer = Math.floor(Math.random()*10);
	var angle = 0;
	self.draw = function(ctx){

		// Translate EVERYTHING. This is gonna get complex
		ctx.save();
		ctx.translate(self.x*W, self.y*H);
		var bounce = Math.random()*0.2+0.9;
		ctx.scale(bounce,1/bounce);

		// Draw body
		self.body.draw(ctx);

		// Eye relative
		ctx.translate(2,-15); // pupil position relative to monolith
		ctx.scale(Math.random()*0.4+0.8, Math.random()*0.4+0.8);

		// Draw eye background
		self.eye.frameIndex = 0;
		self.eye.draw(ctx);

		// Draw pupil, following player/humanoid/interesting thing
		angle += 0.8;
		var uv = {
			x: Math.cos(angle),
			y: Math.sin(angle)
		};
		var pupilRadius = 5;
		self.pupil.x = uv.x*pupilRadius;
		self.pupil.y = uv.y*pupilRadius + 4; // pupil is 4 px down relatie to eye
		self.pupil.draw(ctx);

		// Restore translation
		ctx.restore();

	};
	
}