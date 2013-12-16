(function(exports){

	var Block = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		// Bounds
		self.bounds = {
			left: -25,
			right: 25,
			top: -50,
			bottom: 0
		};

		// Position
		self.x = config.x;
		self.y = config.y;

		// Shadows
		if(config.shadows){
			self.leftShadow = {};
			self.rightShadow = {};
			self.topShadow = {};
			level.shadows.shadows.push(self.leftShadow);
			level.shadows.shadows.push(self.rightShadow);
			level.shadows.shadows.push(self.topShadow);
		}
		var _updateShadows = function(){
			
			var l=self.x-25, r=self.x+25, t=self.y-50, b=self.y;
			
			self.leftShadow.ax = self.leftShadow.bx = l;
			self.leftShadow.ay = t;
			self.leftShadow.by = b;

			self.rightShadow.ax = self.rightShadow.bx = r;
			self.rightShadow.ay = t;
			self.rightShadow.by = b;

			self.topShadow.ax = l;
			self.topShadow.bx = r;
			self.topShadow.ay = self.topShadow.by = t;

		};

		// Update
		this.update = function(){
			if(config.shadows) _updateShadows();
		};

		// Draw
		this.draw = function(ctx){
			ctx.fillStyle = "#000";
			ctx.fillRect(self.x-25, self.y-50, 50, 50);
		};
		this.drawCCTV = this.draw;

	};

	exports.Block = Block;

})(window);