(function(exports){

	var Block = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this._CLASS = "Block";

		// Bounds
		self.bounds = config.bounds || {
			left: -24,
			right: 24,
			top: -49,
			bottom: -1
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
		var sprite = new Sprite(config.sprite || "SmallProps");
		sprite.frameIndex = config.frame || 0;
		sprite.regX = -50;
		sprite.regY = -150;
		this.draw = function(ctx){
			sprite.x = self.x;
			sprite.y = self.y;
			sprite.draw(ctx);
		};
		this.drawCCTV = this.draw;

	};

	exports.Block = Block;

})(window);