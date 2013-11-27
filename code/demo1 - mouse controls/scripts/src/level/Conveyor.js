(function(exports){

	var Conveyor = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		// Config
		this.belt = config.belt;
		this.direction = config.direction;
		this.activator = config.activator;

		this.update = function(){

			// Am I active?
			var active = false;
			var myPrismID = self.activator;
			var myPrism = level.prisms.map[myPrismID];
			if(myPrism && myPrism.active && myPrism.seesHuman){
				active = true;
			}

			// If any of the props are on me, and I'm active, move 'em!
			if(active){
				var props = [level.player].concat(level.prisms.prisms).concat(level.dummies.dummies);
				for(var i=0;i<props.length;i++){
					var prop = props[i];

					if( self.belt.ax*Map.TILE_SIZE < prop.x
						&& self.belt.bx*Map.TILE_SIZE > prop.x
						&& self.belt.ay*Map.TILE_SIZE < prop.y
						&& self.belt.by*Map.TILE_SIZE > prop.y ){

						prop.x += self.direction.x;
						prop.y += self.direction.y;

					}
				}
			}

		}

	};

	exports.Conveyor = Conveyor;

})(window);