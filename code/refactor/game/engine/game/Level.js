var W, H;
function Level(config){

	var self = this;
	self.config = config;

	///////////////////////////////

	self.TILE_WIDTH = 50;
	self.TILE_HEIGHT = 50;

	W = self.TILE_WIDTH;
	H = self.TILE_HEIGHT;
	
	///////////////////////////////

	self.init = function(){

		// QUESTION: Do we even need the init() two-step process?

		// Stuff that needs to exist before gameobjects
		self.map = new Map(self);
		self.map.init();
		self.shadow = new Shadow(self);
		self.shadow.init();
		self.renderer = new LevelRenderer(self);
		self.renderer.init();
		self.walls = new Walls(self);
		self.walls.init();

		// Create game pieces
		_initLevelObjects("realobjects");
		_initLevelObjects("wallobjects");
		_initLevelObjects("gamelogic");

		// UI Objects
		self.uiobjects = [];
		self.uiobjects.push(new Dialogue(self));

	};

	var _initLevelObjects = function(category){
		self[category] = [];
		var levelObjects = config.level[category];
		for(var i=0;i<levelObjects.length;i++){
			
			// Create new object of Class type
			var conf = levelObjects[i];
			var Type = window[conf.type];
			if(!Type){
				console.error("NO SUCH TYPE CLASS: "+conf.type);
			}
			var obj = new Type(self);

			// ID
			if(conf.id){
				self[conf.id] = obj;
			}

			// Override variables
			for(var key in conf){
				obj[key] = conf[key];
			}

			// Initialize
			obj.init();

			// Add to the list
			self[category].push(obj);

		}
	}

	///////////////////////////////

	self.tagged = {};
	self.getTagged = function(tag){
		self.tagged[tag] = self.tagged[tag] || [];
		return self.tagged[tag];
	};
	self.setTag = function(thing,tag){
		self.tagged[tag] = self.tagged[tag] || [];
		self.tagged[tag].push(thing);
	};
	self.unTag = function(thing,tag){
		self.tagged[tag] = self.tagged[tag] || [];
		var index = self.tagged[tag].indexOf(thing);
		if(index<0) return;
		self.tagged[tag].splice(index,1);
	};

	self.update = function(){
		
		// Update game objects
		_callArray(self.realobjects,"update");
		_callArray(self.wallobjects,"update");

		// Update all sight polygons
		var sighted = self.getTagged("sighted");
		for(var i=0;i<sighted.length;i++){
			sighted[i].updateSight();
		}

		// Update game logic
		_callArray(self.gamelogic,"update");

		// Update misc things
		self.walls.update();

		// UI Objects
		_callArray(self.uiobjects,"update");

	};

	self.draw = function(ctx){
		self.renderer.draw(ctx); // LET THIS HANDLE IT ALL
	};

	self.kill = function(){

		// Just nuke all pubsubs that DOESN'T start with fps/
		for(var topic in MinPubSub.cache){
			if(topic=="fps/begin" || topic=="fps/end") continue;
			delete MinPubSub.cache[topic];
		}

	};

	var _callArray = function(array,funcName,args){
		for(var i=0;i<array.length;i++){
			array[i][funcName].apply(null,args);
		}
	};

}