(function(exports){

	var BlockController = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this.blocks = [];

		///// UPDATE LOOP /////

		this.update = function(){
			for(var i=0;i<self.blocks.length;i++){
				self.blocks[i].update();
	    	}
		};

		///// DRAW LOOP /////

		this.draw = function(){
			for(var i=0;i<self.blocks.length;i++){
				self.blocks[i].draw();
	    	}
		};

		this.addBlock = function(conf){
			var block = new Block(level,conf);
			self.blocks.push(block);
			return block;
		};

		// INIT //

		config.blocks = config.blocks || [];
		for(var i=0;i<config.blocks.length;i++){
			var conf = config.blocks[i];
			this.addBlock(conf);
		}


	};

	exports.BlockController = BlockController;

})(window);