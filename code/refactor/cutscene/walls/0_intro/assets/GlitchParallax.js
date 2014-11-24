function GlitchParallax(wall){
	
	var self = this;
	self.wall = wall;
	Parallax.call(self,wall);

	self.oldDraw = self.draw;
	self.draw = function(ctx,postY){
		
		ctx.save();
		ctx.translate(Math.random()*6-3,Math.random()*6-3);

		self.oldDraw(ctx);
		var startX = (Game.canvas.width-self.wall.WIDTH)/2;

		for(var i=1;i>0;i-=0.1){
		
			var w = (Math.random()+0.5)*400*i;
			var h = (Math.random()+0.5)*50*i;
			var x = startX + Math.random()*(self.wall.WIDTH-w);
			var y = postY + Math.random()*(self.height-h);

			var boop = ctx.getImageData(x,y,w,h);
			ctx.putImageData(boop, x+Math.random()*40-20, y+Math.random()*10-5);

		}

		ctx.restore();
		
	};
	
}