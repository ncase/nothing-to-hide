///////
var alreadyExited = false;
function _goBackToMenu(){
	if(alreadyExited) return;
	alreadyExited = true;
	window.parent.unlockMedal("ending");
	window.parent.gotoPage("menu/menu.html#fund");
}

var onLoad = function(){

	var timeline = document.getElementById("timeline");
	var soundEffects = [];
	var ambiences = [];
	var addPost = function(post){
		var dom = document.createElement("div");
		dom.setAttribute("class",post.type);

		var html;

		// Sound Effect
		if(post.data.sound){
			soundEffects.push({
				dom: dom,
				sound: post.data.sound
			});
		}

		// Ambience
		if(post.data.ambience){
			var a = post.data.ambience;
			var sound = createjs.Sound.createInstance(a.play); 
			sound.play(null,0,0,-1,0,0);
			ambiences.push({
				dom: dom,
				sound: sound,
				ambience: a
			});
		}

		// Post header
		html = ''+
			'<div id="poster">'+
			'	<div id="poster_icon" style="background:url('+post.icon+')"></div>'+
			'	<div id="poster_info">'+
			'		<span id="poster_info_name">'+post.user+'</span><br>'+
			'		<span id="poster_info_date">posted '+post.date+'</span>'+
			'	</div>'+
			'</div>';

		// Parallax Post
		if(post.type==="parallax_post"){
			html += '<div id="layers" style="height:'+post.data.height+'px">';
			for(var i=0;i<post.data.layers.length;i++){
				var layer = post.data.layers[i];
				html += '<div style="background-image:url('+layer.img+')" depth="'+layer.depth+'" offset="'+layer.offset+'"></div>';
			}
			html += '</div>';
		}

		// Conversation post
		if(post.type==="conversation_post"){
			html += '<div id="convo">'+post.data.message+'</div>';
		}

		// Video post
		if(post.type==="video_post"){
			
			// PARALLAX
			html += ''+
				'<div id="layers" style="height:400px">'+
					'<div style="background-image:url('+post.data.bg+')" depth="0.7" offset="40"></div>'+

					'<div id="video" depth="1" offset="0">'+
						'<div id="video_cctv"></div>'+
						'<div id="video_ribbon"></div>'+
						'<div id="video_button"></div>'+
						'<div id="video_play"></div>'+
					'</div>'+

				'</div>';

			// HACK!
			dom.onclick = gotoGame;

		}

		// Add to DOM
		dom.innerHTML = html;
		timeline.appendChild(dom);

	}

	posts.map(addPost);

	///////////


	var parallaxes = document.querySelectorAll("#layers");
	function onScroll(event){

		var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
			
		// ALL PARALLAX LAYERS DO THEIR THING
		for(var i=0;i<parallaxes.length;i++){
			
			var parallax = parallaxes[i];
			var scroll = (parallax.offsetTop - scrollTop) - 150;

			var layers = parallax.children;

			for(var j=0;j<layers.length;j++){
				var layer = layers[j];
				var depth = parseFloat(layer.getAttribute("depth"));
				var offset = parseFloat(layer.getAttribute("offset"));
				layer.style.backgroundPosition = "0px " + (-scroll*depth - offset)+"px";
			}

		}

		// Check all sound effects, play if DOM passes it.
		for(var i=0;i<soundEffects.length;i++){
			
			var sfx = soundEffects[i];

			// Play when halfway at screen
			if( (sfx.dom.offsetTop - scrollTop) + sfx.sound.offset < window.innerHeight*0.4){
				if(!sfx.past) createjs.Sound.play.apply(null,sfx.sound.play);
				sfx.past = true;
			}else{
				sfx.past = false;
			}

		}

		// Ambience
		for(var i=0;i<ambiences.length;i++){

			var a = ambiences[i];
			var pos = window.innerHeight*0.4 - (a.dom.offsetTop - scrollTop);
			var interval = a.ambience.interval;
			var vol = 0;
			if(pos>interval[1] && pos<interval[2]){
				vol = 1;
			}else if(pos>interval[0] && pos<=interval[1]){
				vol = (pos-interval[0])/(interval[1]-interval[0]);
			}else if(pos<interval[3] && pos>=interval[2]){
				vol = 1 - ((pos-interval[2])/(interval[3]-interval[2]));
			}else{
				vol = 0;
			}

			vol *= a.ambience.volume;
			a.sound.setVolume(vol);

		}


	};

	var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
	var drawnSinceLastUpdate = false;

	// TODO: WHAT HAPPENS IF THE ZOOM IF KER_FUCKED.....

	// Draw Loop
	var ITS_THE_END = false;
	var END_FRAME = 0;
	var footer = document.getElementById("footer");
	var the_wall = document.getElementById("the_wall");
	var turnoff = document.getElementById("turnoff");
	var turnoff_frame = document.getElementById("turnoff_frame");
	function draw(){
		
		if(!ITS_THE_END){

			if(!drawnSinceLastUpdate){
				drawnSinceLastUpdate = true;
				onScroll();
			}

			var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
			if(footer.offsetTop - scrollTop < window.innerHeight ){
				ITS_THE_END = true;
				the_wall.style.opacity = 0;
				turnoff.style.display = "block";

				for(var i=0;i<ambiences.length;i++){
					var a = ambiences[i];
					a.sound.stop();
				}
				createjs.Sound.play("tv");

			}

		}else{

			var frame = Math.floor(END_FRAME/3);
			if(frame>30){
				frame=6;		
			}else if(frame>5){
				if(END_FRAME==90){
					createjs.Sound.play("drama");
				}
				frame=5;
			}
			turnoff_frame.style.backgroundPosition = "0 -"+frame*200+"px";
			END_FRAME++;

			if(END_FRAME>240){
				_goBackToMenu();
			}

		}

		// RAF
		RAF(draw);

	}
	draw();

	window.onscroll = function(){
		drawnSinceLastUpdate = false;
	};


};
