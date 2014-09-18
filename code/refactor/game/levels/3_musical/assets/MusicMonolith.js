function MusicMonolith(level){
	
	var self = this;
	self.level = level;

	Monolith.call(self,level);

	self.draw = function(ctx){

		// Translate EVERYTHING. This is gonna get complex
		ctx.save();
		ctx.translate(self.x*W, self.y*H);

		var color = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
		ctx.fillStyle = color;
		ctx.fillRect(-12.5,-50,25,50);
		
		// Restore translation
		ctx.restore();

	};
	
}