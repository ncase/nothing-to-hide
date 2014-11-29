/***********************

***********************/

function StaticBlock(level){
	
	var self = this;
	self.level = level;

	level.setTag(self,"block");

	self.init = function(){
		self.image = Asset.image[self.image || "placeholder"];
		self.gray = Grayscale.convertImage(self.image);
	};

	self.update = function(){
	};
	
	self.draw = function(ctx,options){
		options = options || {};
		var img = options.gray ? self.gray : self.image;
		ctx.drawImage(img, self.x*W, self.y*H, self.width*W, self.height*H);
	};
	
	self.hitTest = function(x,y){
		return (x>self.x && x<self.x+self.width && y>self.y && y<self.y+self.height);
	};
	
}