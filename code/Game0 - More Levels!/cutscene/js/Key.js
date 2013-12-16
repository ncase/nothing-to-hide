(function(exports){

	// Singleton
	var Key = {};
	exports.Key = Key;

	// Keycodes to words mapping
	var KEY_CODES = {
		37:"left", 38:"up", 39:"right", 40:"down",
		65:"left", 87:"up", 68:"right", 83:"down",
		16:"shift", 32:"space"
	};
	for(var keyCode in KEY_CODES){
		Key[keyCode]=false;
	}

	// Event Handling
	window.onkeydown = function(event){
	    Key[KEY_CODES[event.keyCode]]=true;
	    event.stopPropagation();
	    event.preventDefault();
	};
	window.onkeyup = function(event){
	    Key[KEY_CODES[event.keyCode]]=false;
	    event.stopPropagation();
	    event.preventDefault();
	};

})(window);