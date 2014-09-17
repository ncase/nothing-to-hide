/***********************

***********************/

function StaticBlock(level){
	
	var self = this;
	self.level = level;

	level.setTag(self,"block");

	self.init = function(){
		color = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
	};

	self.update = function(){
	};

	var color;
	self.draw = function(ctx){
		ctx.fillStyle = color;
		ctx.fillRect(self.x*W, self.y*H, self.width*W, self.height*H);
	};

	self.hitTest = function(x,y){
		return (x>self.x && x<self.x+self.width && y>self.y && y<self.y+self.height);
	};
	
}