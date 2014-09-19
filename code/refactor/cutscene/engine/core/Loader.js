/*****************

Loads raw resources.
Each method returns a promise for the resource.

*****************/
(function(exports){

	// Singleton
	var Loader = {};
	exports.Loader = Loader;

	Loader.loadJSON = function(src){
		var deferred = Q.defer();
		Loader.loadText(src).then(function(text){
			var data;
			try{
				text = text.replace(/\/\*(.|\n)+?\*\/|\/\/.*(?=[\n\r])/g, ''); // remove comments dammit
				data = JSON.parse(text);
				console.log("Loaded JSON: "+src);
				deferred.resolve(data);
			}catch(e){
				console.error("LOADED JSON FAILED TO PARSE: "+src);
			}
		});
		return deferred.promise;
	};

	Loader.loadText = function(src){
		var isNodeWebkit = (typeof process == "object"); // Node Webkit is weird

		var deferred = Q.defer();
		var xhr = _createXMLHTTPObject();
		xhr.open("GET", src);
		xhr.onreadystatechange = function() {
			if( (xhr.readyState===4 && xhr.status===200) || (isNodeWebkit && xhr.readyState===3) ){
				console.log("Loaded text: "+src);
				deferred.resolve(xhr.responseText);
			}
		};
		xhr.send();
		return deferred.promise;
	};

	Loader.loadImage = function(src){
		var deferred = Q.defer();
		var img = new Image();
		img.onload = function(){
			console.log("Loaded image: "+src);
			deferred.resolve(img);
		};
		img.src = src;
		return deferred.promise;
	}

	Loader.loadSprite = function(src){
		var deferred = Q.defer();
		var imageSource = src+".png";
		var dataSource = src+".json";
		Q.all([Loader.loadImage(imageSource),Loader.loadJSON(dataSource)]).spread(function(img,data){
			console.log("Loaded sprite: "+src);
			deferred.resolve({image:img, data:data});
		});
		return deferred.promise;
	};

	Loader.loadScript = function(src){
		var deferred = Q.defer();
		var dom = document.createElement("script");
		document.body.appendChild(dom);
		dom.onload = function(){
			console.log("Loaded script: "+src);
			deferred.resolve(dom);
		};
		dom.src = src;
		return deferred.promise;
	};

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