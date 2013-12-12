(function(exports){

	var Conveyor = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		// Config
		this.belt = config.belt;
		this.belt.ax *= Map.TILE_SIZE;
		this.belt.ay *= Map.TILE_SIZE;
		this.belt.bx *= Map.TILE_SIZE;
		this.belt.by *= Map.TILE_SIZE;

		this.direction = config.direction;
		this.activator = config.activator;

		this.update = function(){

			// Am I active?
			var active = false;
			var myPrismID = self.activator;
			if(myPrismID==""){
				active = true;
			}else{
				var myPrism = level.prisms.map[myPrismID];
				if(myPrism && myPrism.active && myPrism.seesHuman){
					active = true;
				}
			}

			// If any of the props are on me, and I'm active, move 'em!
			if(active){
				var props = [level.player].concat(level.prisms.prisms).concat(level.dummies.dummies);
				for(var i=0;i<props.length;i++){
					var prop = props[i];

					if(self.belt.ax<prop.x && self.belt.bx>prop.x && self.belt.ay<prop.y && self.belt.by>prop.y){
						prop.x += self.direction.x;
						prop.y += self.direction.y;
					}
				}
			}

		};

		var pattern = Display.context.tmp.createPattern(Asset.image.conveyor, 'repeat');
		this.draw = function(){
			var ctx = Display.context.game;
			ctx.fillStyle = pattern;
			ctx.beginPath();
			ctx.rect(self.belt.ax, self.belt.ay, self.belt.bx-self.belt.ax, self.belt.by-self.belt.ay);
			//ctx.translate(0,cctvY);
			ctx.fill();
			//ctx.translate(0,-cctvY);
		};

	};

	exports.Conveyor = Conveyor;

})(window);