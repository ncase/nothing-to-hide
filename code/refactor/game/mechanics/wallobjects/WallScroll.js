/***********************

{
	"type": "WallScroll",
	"image": "intro/comic",
	"listenUp": "up",
	"listenDown": "down",
	"x":0, "y":0, "width":4, "height":5
}

***********************/

function WallScroll(level){
	
	var self = this;
	self.level = level;

	self.scrollAcc = 0.05; // optional

	var upHandler, downHandler;

	self.init = function(){
		
		self.image = Asset.image[self.image];

		// Force a redraw
		self.lastPos = -10000;
		self.pos = -10000;
		self.vel = 0;

		// Handler: Scroll up/down based on messages
		upHandler = subscribe("custom/"+self.listenUp,function(){
			self.vel -= self.scrollAcc;
		});
		downHandler = subscribe("custom/"+self.listenDown,function(){
			self.vel += self.scrollAcc;
		});

	};

	self.update = function(){

		// Last position & new position
		self.lastPos = self.pos;
		self.pos += self.vel;

		// Update velocity & acceleration
		self.vel *= 0.8;
		if(self.pos<0){
			self.vel = 0;//Math.abs(self.vel);
			self.pos = 0;
		}
		var end = self.image.height/H-self.height;
		if(self.pos>end){
			self.vel = 0;//-Math.abs(self.vel);
			self.pos = end;
		}

	};

	self.draw = function(ctx){

		// Only redraw if it's moved far enough
		if(Math.abs(self.lastPos-self.pos)<0.01) return;
		
		// Draw it within the frame
		var sx = 0;
		var sy = self.pos*H;
		var sw = self.width*W;
		var sh = self.height*H;
		var dx = self.x*W;
		var dy = self.y*H;
		var dw = sw;
		var dh = sh;
		ctx.drawImage(self.image, sx,sy,sw,sh, dx,dy,dw,dh);

	};

}