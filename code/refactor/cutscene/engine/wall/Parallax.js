function Parallax(wall){
	
	var self = this;
	self.wall = wall;

	self.init = function(){
		
		for(var i=0;i<self.layers.length;i++){
			var layer = self.layers[i];
			layer.image = Asset.image[layer.image];
		}

		// Total Height
		self.totalHeight = self.height+50;

	};

	self.update = function(){
	};

	self.draw = function(ctx){
		for(var i=0;i<self.layers.length;i++){
			var layer = self.layers[i];
			ctx.drawImage(
				layer.image,
				0, self.y*layer.depth+(layer.offset||0), self.wall.WIDTH, self.height,
				0, 0, self.wall.WIDTH, self.height
			);
		}
	};

}