/*****************

Loads and STORES more complex resources.
Each method also returns a promise for when it's done.
Also does batch loading.

*****************/
(function(exports){

	// Singleton
	var Asset = {};
	exports.Asset = Asset;

	// LEVELS
	Asset.levelConfig = {};
	Asset.loadLevel = function(levelID){

		var deferred = Q.defer();

		var path = "levels/"+levelID;
		Q.all([
			Loader.loadText(path+"/map.txt"), // map
			Loader.loadJSON(path+"/level.json"), // game pieces
			Loader.loadText(path+"/custom.js"), // custom script
			Loader.loadJSON(path+"/preload.json") // custom assets
		]).spread(function(map,level,custom,preload){

			// Preload Asset Batch
			Asset.loadBatch(preload,path).then(function(){

				// Map to 2D Array
				map = map.split("\n");
				for(var i=0;i<map.length;i++){
					map[i] = map[i].split("");
				}

				// Level Config
				var config = {
					map: map,
					level: level,
					custom: custom
				};

				// Resolve
				Asset.levelConfig[levelID] = config;
				deferred.resolve(config);

			});

		});

		return deferred.promise;

	};

	// BATCH LOADING ASSETS
	Asset.loadBatch = function(batch,basePath){

		var _loadType = function(type,loader){
			map = batch[type] || {};
			var promises = [];
			for(var id in map){
				var src = basePath + "/" + map[id];
				(function(id){
					promises.push(loader(src).then(function(asset){
						Asset[type] = Asset[type] || {};
						Asset[type][id] = asset;
					}));
				})(id);
			}
			return Q.all(promises);
		};

		return Q.all([
			_loadType("image", Loader.loadImage),
			_loadType("sprite", Loader.loadSprite),
			_loadType("script", Loader.loadScript),
			_loadType("text", Loader.loadText),
			//_loadType("sound", Loader.loadSound)
		]);

	};


})(window);