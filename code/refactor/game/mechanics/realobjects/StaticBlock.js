/***********************

***********************/

function StaticBlock(level){
	
	var self = this;
	self.level = level;

	level.setTag(self,"block");

	self.init = function(){
		self.IS_PLACEHOLDER = (!self.image);

		self.image = Asset.image[self.image || "placeholder"];
		self.gray = Grayscale.convertImage(self.image);
	};

	self.update = function(){
	};
	
	self.draw = function(ctx,options){
		options = options || {};
		var img = options.gray ? self.gray : self.image;

		if(self.IS_PLACEHOLDER){
			// placeholder block
			ctx.drawImage(img, self.x*W, self.y*H, self.width*W, self.height*H);
		}else{
			// image, middle bottom.
			var ox = (self.x+self.width/2)*W - self.image.width/2;
			var oy = (self.y+self.height)*H - self.image.height;
			ctx.drawImage(img, ox, oy);
		}
		
	};
	
	self.hitTest = function(x,y){
		return (x>self.x && x<self.x+self.width && y>self.y && y<self.y+self.height);
	};
	
}