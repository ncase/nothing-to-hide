/***********************

***********************/

function FloorDecoration(level){
	
	var self = this;
	self.level = level;

	self.init = function(){
		self.image = Asset.image[self.image];
		self.realY = self.y; // Cheat at depth
		self.y = self.y - 100;
	};

	self.update = function(){
	};

	self.draw = function(ctx){
		ctx.drawImage(self.image, self.x*W, self.realY*H);
	};
	
}