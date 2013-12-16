(function(exports){

	// Singleton
	var Asset = {};
	exports.Asset = Asset;

	// Initialize
	Asset.init = function(config){
		Asset.config = config;
		Asset.image = {};
		Asset.level = {};
		Asset.sprite = {};
		Asset.sound = {};
	};

	// Load everything from config
	Asset.load = function(){
		return Q.all([
			Asset.loadImages(Asset.config.images),
			Asset.loadLevels(Asset.config.levels),
			Asset.loadSprites(Asset.config.sprites),
			Asset.loadSounds(Asset.config.sounds),
		]);
	};

	// Loading all Images
	Asset.loadImages = function(map){
		map = map || {};

		// Promise all images
		var promises = [];
		for(var id in map){
			var src = map[id];
			var img = new Image();
			Asset.image[id] = img;
			promises.push(_promiseImage(src,img));
		}
		return Q.all(promises);
	};

	// Loading all Sprites
	Asset.loadSprites = function(map){
		map = map || {};

		// Helper to promise sprites
		var promiseSprite = function(id,filepath){
			var imgSource = filepath+".png";
			var dataSource = filepath+".json";
			return Q.all([_promiseImage(imgSource),_promiseData(dataSource)]).spread(function(img,data){
				console.log("Loaded sprite "+id);
				data = JSON.parse(data);
				Asset.sprite[id] = {image:img, data:data};
			});
		}

		// Promise all
		var promises = [];
		for(var id in map){
			var filepath = map[id];
			promises.push(promiseSprite(id,filepath));
		}
		return Q.all(promises);

	};

	// Loading all Sounds
	Asset.loadSounds = function(map){
		map = map || {};

		// Convert to manifest
		var manifest = [];
		for(var id in map){
			manifest.push({id:id, src:map[id].src, data:map[id].data});
		}

		// Promise manifest loaded
		var allSoundsLoaded = Q.defer();
		var soundsLeft = manifest.length;
		createjs.Sound.addEventListener("fileload",function(event){
			Asset.sound[event.id] = event.src;
			console.log("Loaded sound "+event.id);
			soundsLeft--;
			if(soundsLeft==0){
				allSoundsLoaded.resolve(true);
			}
		});
        createjs.Sound.registerManifest(manifest);
		return allSoundsLoaded.promise;

	};

	// Loading all Levels: COMPLICATED
	Asset.loadLevels = function(map){
		map = map || {};

		// Helper to promise levels
		var promiseLevel = function(id,dirpath){
			
			var levelSource = dirpath+"/level.json";
			var mapSource = dirpath+"/map.txt";

			return Q.all([_promiseData(levelSource),_promiseData(mapSource)]).spread(function(levelData,mapData){

				// Parsing to proper data format
				try{
					levelData = JSON.parse(levelData);
				}catch(e){
					console.error("JSON PARSING FAILED ON LEVEL JSON "+id);
				}
				mapData = mapData.split("\n");
				for(var i=0;i<mapData.length;i++){
					mapData[i] = mapData[i].split("");
				}

				// Config
				var config = {
					level: levelData,
					map: mapData,
					art: {}
				};

				// Now, load art or use placeholder
				var bgSource = dirpath+"/bg.png";
				var camSource = dirpath+"/cam.png";
				var finalDeferred = Q.defer();
				var artPromises = 0;
				function resolveArt(){
					artPromises--;
					if(artPromises<=0){
						console.log("Loaded level "+id);
						Asset.level[id] = config;
						finalDeferred.resolve(config);
					}
				};
				if(levelData.art.background){
					artPromises++;
					_promiseImage(bgSource).then(function(bg){
						config.art.background = bg;
						resolveArt();
					});
				}
				if(levelData.art.cam && !levelData.art.hideCam){
					artPromises++;
					_promiseImage(camSource).then(function(cam){
						config.art.cam = cam;
						resolveArt();
					});
				}
				if(artPromises==0) resolveArt();
				return finalDeferred.promise;

			});

		}

		// Promise all
		var promises = [];
		for(var id in map){
			var dirpath = map[id];
			promises.push(promiseLevel(id,dirpath));
		}
		return Q.all(promises);

	};

	///////////////////////////////
	/////// HELPER METHODS ////////
	///////////////////////////////

	function _promiseImage(src,img){
		var deferred = Q.defer();
		img = img || new Image();
		img.onload = function(){
			console.log("Loaded image "+src);
			deferred.resolve(img);
		};
		img.src = src;
		return deferred.promise;
	}

	function _promiseData(src){

		var isNodeWebkit = (typeof process == "object");

		var deferred = Q.defer();
		var xhr = _createXMLHTTPObject();
		xhr.open("GET", src);
		xhr.onreadystatechange = function() {
			if( (xhr.readyState===4 && xhr.status===200) || (isNodeWebkit && xhr.readyState===3) ){
				console.log("Loaded data "+src);
				deferred.resolve(xhr.responseText);
			}
		};
		xhr.send();
		return deferred.promise;

	}

	// Because IE still sucks.
	function _createXMLHTTPObject() {
		var XMLHttpFactories = [
		    function(){return new XMLHttpRequest()},
		    function(){return new ActiveXObject("Msxml2.XMLHTTP")},
		    function(){return new ActiveXObject("Msxml3.XMLHTTP")},
		    function(){return new ActiveXObject("Microsoft.XMLHTTP")}
		];
	    var xmlhttp;
	    for(var i=0;i<XMLHttpFactories.length;i++){
	        try{ xmlhttp = XMLHttpFactories[i](); }catch(e){ continue; }
	        break;
	    }
	    return xmlhttp;
	}

})(window);