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

		// Create map
		self.map = new Map(self);
		self.map.init();

		// Shadow Logic
		self.shadow = new Shadow(self);
		self.shadow.init();

		// Initialize Renderer
		self.renderer = new LevelRenderer(self);
		self.renderer.init();

		// Create game pieces
		_initLevelObjects("realobjects");
		_initLevelObjects("wallobjects");
		_initLevelObjects("gamelogic");

		// Screen Logic
		self.screens = new Screens(self);
		self.screens.init();

	};

	self.getGameObjects = function(category,type){
		return self[category].filter(function(el){
			return(el.type == type);
		});
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

	self.update = function(){
		
		_callArray(self.realobjects,"update");
		_callArray(self.wallobjects,"update");
		_callArray(self.gamelogic,"update");

		self.screens.update();
		
	};

	self.draw = function(ctx){
		self.renderer.draw(ctx); // LET THIS HANDLE IT ALL
	};

	self.kill = function(){
		_callArray(self.realobjects,"kill");
		_callArray(self.wallobjects,"kill");
		_callArray(self.gamelogic,"kill");
	};

	var _callArray = function(array,funcName,args){
		for(var i=0;i<array.length;i++){
			array[i][funcName].apply(null,args);
		}
	};

}