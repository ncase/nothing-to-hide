function Wall(config){

	var self = this;

	self.init = function(){
	};

	self.update = function(){
	};

	self.isDirty = true;
	self.draw = function(ctx){

		if(!self.isDirty) return;
		self.isDirty = false;

		ctx.fillStyle = "#000";
		ctx.fillRect(0,0,Game.canvas.width,80);

	};

}