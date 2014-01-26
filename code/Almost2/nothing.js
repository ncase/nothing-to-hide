window.onload = function(){

	var fade = document.getElementById("fade");
	var bar = document.getElementById("loading_bar_white");

	// Fade In
	function fadeIn(){
		fade.setAttribute("closed",false);
		bar.style.display = "none";
		setTimeout(function(){
			fade.style.display = "none";
		},1000);
	}

	// Fade Out
	function fadeOut(){
		fade.style.display = "block";
		bar.style.display = "block";
		bar.style.width = "0";
		setTimeout(function(){
			fade.setAttribute("closed",true);
		},1);
	}

	// Go To Page
	var wrapper = document.getElementById("wrapper");
	window.gotoPage = function(page){
		fadeOut();
		setTimeout(function(){
	    	wrapper.src = page;
	    },1000);
	};

	// Load Ready
	window.onProgress = function(progress){
		progress = progress*progress*progress*progress; // to look fast
		bar.style.width = (progress*100)+"%";
		if(progress==1){
			setTimeout(function(){
				fadeIn();
			},500);
		}
	};

};