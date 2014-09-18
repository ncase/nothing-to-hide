/***********************

***********************/

function FloorDecoration(level){
	
	var self = this;
	self.level = level;

	self.init = function(){
		level.setTag(self,"floor");
		self.image = Asset.image[self.image];
	};

	self.update = function(){
	};

	self.drawFloor = function(ctx){
		ctx.drawImage(self.image, self.x*W, self.y*H);
	};
	
}