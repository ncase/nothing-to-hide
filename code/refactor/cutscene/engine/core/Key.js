(function(exports){

	// Singleton
	var Key = {};
	exports.Key = Key;

	// Keycodes to words mapping
	var KEY_CODES = {
		37:"left", 38:"up", 39:"right", 40:"down",
		65:"left", 87:"up", 68:"right", 83:"down",
		16:"slow",
		32:"action", 13:"action",
		27:"pause", 80:"pause"
	};

	// Event Handling
	var onKeyDown = function(event){
		var code = KEY_CODES[event.keyCode];
		if(!Key[code]) publish("key/down/"+code);
	    Key[code] = true;
	    event.stopPropagation();
	    event.preventDefault();
	}
	var onKeyUp = function(event){
		var code = KEY_CODES[event.keyCode];
		publish("key/up/"+code);
	    Key[code] = false;
	    event.stopPropagation();
	    event.preventDefault();
	}
	window.addEventListener("keydown",onKeyDown,false);
	window.addEventListener("keyup",onKeyUp,false);

})(window);