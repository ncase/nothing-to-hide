function Parallax(wall){
	
	var self = this;
	self.wall = wall;

	self.init = function(){
		
		for(var i=0;i<self.layers.length;i++){
			var layer = self.layers[i];
			layer.image = Asset.image[layer.image];
		}
		console.log(self.layers[0].image);

		// Total Height
		self.totalHeight = self.height+50;

	};

	self.update = function(){
	};

	self.draw = function(ctx){
		ctx.drawImage(
			self.layers[0].image,
			0, self.y*self.layers[0].depth, self.wall.WIDTH, self.height,
			0, 0, self.wall.WIDTH, self.height
		);
	};

}