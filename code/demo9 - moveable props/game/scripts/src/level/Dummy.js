(function(exports){

	var Dummy = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		///// UPDATE LOOP /////
		this.update = function(){};

		///// DRAW LOOP /////
		this.draw = function(ctx){
			ctx.fillStyle = "#fff";
			ctx.fillRect(self.x-20, self.y-60, 40, 60);
		};
		this.drawCCTV = this.draw;

	};

	exports.Dummy = Dummy;

})(window);