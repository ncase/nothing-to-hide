window.onload = function(){

	var fade = document.getElementById("fade");

	// Fade In
	function fadeIn(){
		fade.style.opacity = 0;
		setTimeout(function(){
			fade.style.display = "none";
		},500);
	}

	// Fade Out
	function fadeOut(){
		fade.style.display = "block";
		setTimeout(function(){
			fade.style.opacity = 1;
		},1);
	}

	window.gotoPage = function(page){
		fadeOut();
		setTimeout(function(){
	    	document.getElementById("wrapper").src = page+".html";
	    	setTimeout(function(){
	    		fadeIn();
	    	},50);
	    },550);
	};

	fadeIn();

};