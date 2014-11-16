function WallRenderer(wall){

	var self = this;
	self.wall = wall;

	self.SCROLL_SPEED = 5;
	self.TOP = -110;

	self.init = function(){
	};

	self.pos = self.TOP;
	self.vel = 0;
	self.lastPos = -100;
	self.update = function(){

		if(Key.up) self.vel -= self.SCROLL_SPEED;
		if(Key.down) self.vel += self.SCROLL_SPEED;
		self.vel *= 0.8;
		self.pos += self.vel;

		if(self.pos<self.TOP){
			self.pos = self.TOP;
			self.vel *= -1;
		}

	};

	self.isDirty = true;
	self.draw = function(ctx){

		if(Math.abs(self.lastPos-self.pos)<0.1) return;
		self.lastPos = self.pos;

		// Clear
		ctx.save();
		ctx.clearRect(0,0,Game.canvas.width,Game.canvas.height);

		// To center stage
		var postY = -self.pos;
		ctx.translate( (Game.canvas.width-self.wall.WIDTH)/2, -self.pos);

		// Draw each post, with max parallax
		for(var i=0;i<self.wall.posts.length;i++){
			var post = self.wall.posts[i];
			post.y = postY;
			post.draw(ctx);
			ctx.translate(0,post.totalHeight);
			postY += post.totalHeight;
		}

		// Draw Header
		ctx.restore();
		ctx.fillStyle = "#000";
		ctx.fillRect(0,0,Game.canvas.width,80);

	};

}