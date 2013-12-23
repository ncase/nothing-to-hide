(function(exports){

	var ConveyorController = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this.conveyors = [];

		// Create Conveyors
		for(var i=0;i<config.conveyors.length;i++){
			var conf = config.conveyors[i];
			var conveyor = new Conveyor(level,conf);
			this.conveyors.push(conveyor);
		}

		this.update = function(){
			for(var i=0;i<self.conveyors.length;i++){
				self.conveyors[i].update();
			}
		};

		this.draw = function(ctx){
			for(var i=0;i<self.conveyors.length;i++){
				self.conveyors[i].draw(ctx);
	    	}
		};
		this.drawCCTV = function(ctx){
			for(var i=0;i<self.conveyors.length;i++){
				self.conveyors[i].drawCCTV(ctx);
	    	}
		};

	};

	exports.ConveyorController = ConveyorController;

})(window);