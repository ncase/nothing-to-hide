function WallRenderer(wall){

	var self = this;
	self.wall = wall;

	self.SCROLL_SPEED = 5;
	self.TOP = -110;
	self.BOTTOM = 0;

	self.init = function(){

		var totalHeight = 0;
		for(var i=0;i<self.wall.posts.length;i++){
			var post = self.wall.posts[i];
			totalHeight += post.totalHeight;
		}
		self.BOTTOM = totalHeight - Game.canvas.height;

		subscribe("mouse/scroll",self.onMouseScroll);

	};

	self.onMouseScroll = function(event){
		self.pos += event.deltaY * 0.5; // Dunno why
		self.checkPosition();
	};

	self.pos = self.TOP;
	self.vel = 0;
	self.lastPos = -100;
	self.update = function(){
		if(Key.up) self.vel -= self.SCROLL_SPEED;
		if(Key.down) self.vel += self.SCROLL_SPEED;
		self.vel *= 0.8;
		self.pos += self.vel;
		self.checkPosition();
	};

	self.checkPosition = function(){
		if(self.pos<self.TOP){
			self.pos = self.TOP;
			self.vel = 0;
		}
		if(self.pos>self.BOTTOM){
			self.pos = self.BOTTOM;
			self.vel = 0;
		}
	};

	self.isDirty = true;
	self.draw = function(ctx){

		if(Math.abs(self.lastPos-self.pos)<0.1) return;
		self.lastPos = self.pos;

		// Clear
		ctx.save();

		// To center stage
		var postY = -self.pos;
		var startX = (Game.canvas.width-self.wall.WIDTH)/2;
		ctx.clearRect(startX,0,self.wall.WIDTH,Game.canvas.height);
		ctx.translate(startX, -self.pos);

		// Draw each post, with max parallax
		var drawn = 0;
		for(var i=0;i<self.wall.posts.length;i++){
			var post = self.wall.posts[i];
			post.y = postY;
			if(postY+post.totalHeight>0){
				post.draw(ctx);
				drawn++;
			}
			ctx.translate(0,post.totalHeight);
			postY += post.totalHeight;
			if(postY>Game.canvas.height){
				break;
			}
		}

		// Draw Header
		ctx.restore();
		ctx.fillStyle = "#000";
		ctx.fillRect(0,0,Game.canvas.width,80);

	};

}