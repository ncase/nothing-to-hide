(function(exports){

	var Dummy = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		this.update = function(){};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		var ctx = Display.context.props;
		this.draw = function(){
			ctx.fillStyle = "#fff";
			ctx.fillRect(self.x-20, self.y-60, 40, 60);
		};

	};

	exports.Dummy = Dummy;

})(window);