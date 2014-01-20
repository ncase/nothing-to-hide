///////
var alreadyExited = false;
window.gotoGame = function(){
	if(alreadyExited) return;
	alreadyExited = true;
	window.top.gotoPage("level");
}

window.onload = function(){

	var poster = {
		poppy: {
			user: "Poppy Gardner",
			icon: "icons/poppy.png"
		},
		gardner: {
			user: "John Gardner",
			icon: "icons/gardner.png"
		},
		game: {
			user: "Nothing To Hide",
			icon: "icons/game.png",
			date: "just now"
		}
	};

	var _generatePost = function(type,poster,date,data){
		return {
			type: type+"_post",
			user: poster.user,
			icon: poster.icon,
			date: date,
			data: data
		}
	};

	var posts = [

		////// ESTABLISHING SHOT ///////

		_generatePost("parallax",poster.poppy,"16 minutes ago",{
			height: 450,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/establishing_fg.png", depth:0.1, offset:50}
			]
		}),
		_generatePost("parallax",poster.poppy,"16 minutes ago",{
			height: 350,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/establishing_fg_2.png", depth:0.1, offset:50}
			]
		}),
		_generatePost("parallax",poster.poppy,"16 minutes ago",{
			height: 250,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/establishing_fg_3.png", depth:0.1, offset:50}
			]
		}),


		//////// MR GARDNER TO POPPY //////////

		_generatePost("conversation",poster.gardner,"16 minutes ago",{
			message: "Poppy?"
		}),
		_generatePost("conversation",poster.gardner,"16 minutes ago",{
			message: "Hey sweetie. Please don't be sad."
		}),
		_generatePost("conversation",poster.gardner,"16 minutes ago",{
			message: "It's really hurting my popularity ranking."
		}),
		_generatePost("conversation",poster.gardner,"15 minutes ago",{
			message: "The first un-secret ballot election is coming up. "+
					"It's very important to Daddy's career, "+
					"so I need you to post more happy pictures of yourself to The Wall. "+
					"At least 400 per day, okay?"
		}),
		_generatePost("conversation",poster.gardner,"15 minutes ago",{
			message: "Please, Poppy? I don't want the voters to think I'm a bad parent."
		}),


		///// CLOSE DOOR /////

		_generatePost("parallax",poster.poppy,"15 minutes ago",{
			height: 450,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/door_close_1.png", depth:0.1, offset:50}
			]
		}),
		_generatePost("conversation",poster.gardner,"15 minutes ago",{
			message: "Well, goodnight! <span>#DaddyDaughterMoment</span>"
		}),
		_generatePost("parallax",poster.poppy,"15 minutes ago",{
			height: 450,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/door_close_2.png", depth:0.1, offset:75}
			]
		}),
		_generatePost("parallax",poster.poppy,"14 minutes ago",{
			height: 450,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/door_close_3.png", depth:0.1, offset:100}
			]
		}),
		_generatePost("parallax",poster.poppy,"14 minutes ago",{
			height: 450,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/door_close_4.png", depth:0.1, offset:100}
			]
		}),

		//////// INTERNAL MONOLOGUE //////////

		_generatePost("conversation",poster.poppy,"14 minutes ago",{
			message: "I... I have to get out of here..."
		}),
		_generatePost("conversation",poster.poppy,"14 minutes ago",{
			message: "Dad will be better off without me. His popularity metrics, too."
		}),
		_generatePost("conversation",poster.poppy,"14 minutes ago",{
			message: "I don't deserve his loving security and discipline."
		}),
		_generatePost("conversation",poster.poppy,"14 minutes ago",{
			message: "Goodbye, dad. I'm so sorry."
		}),


		//////// ESCAPE //////////

		_generatePost("parallax",poster.poppy,"8 minutes ago",{
			height: 250,
			layers:[{img:"pics/escape_1.png", depth:1, offset:150}]
		}),
		_generatePost("parallax",poster.poppy,"8 minutes ago",{
			height: 250,
			layers:[{img:"pics/escape_2.png", depth:1, offset:150}]
		}),
		_generatePost("parallax",poster.poppy,"8 minutes ago",{
			height: 250,
			layers:[{img:"pics/escape_3.png", depth:1, offset:150}]
		}),
		_generatePost("parallax",poster.poppy,"8 minutes ago",{
			height: 250,
			layers:[{img:"pics/escape_4.png", depth:1, offset:150}]
		}),
		_generatePost("parallax",poster.poppy,"8 minutes ago",{
			height: 250,
			layers:[{img:"pics/escape_5.png", depth:1, offset:150}]
		}),

		//////// PLAY GAME /////////
		_generatePost("video",poster.game,"just now",{
			bg: "pics/game.png"
		})

	];

	///////////

	var timeline = document.getElementById("timeline");
	var addPost = function(post){
		var dom = document.createElement("div");
		dom.setAttribute("class",post.type);

		var html;

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
			
		for(var i=0;i<parallaxes.length;i++){
			
			var parallax = parallaxes[i];
			var scroll = (parallax.offsetTop - window.scrollY) - 150;
			/*if(scroll>700-150){
				scroll = 700-150;
			}*/
			// So it's at its original position, by default, 150px from the top.

			var layers = parallax.children;

			for(var j=0;j<layers.length;j++){
				var layer = layers[j];
				var depth = parseFloat(layer.getAttribute("depth"));
				var offset = parseFloat(layer.getAttribute("offset"));
				layer.style.backgroundPositionY = -scroll*depth - offset;
			}

		}

	};

	var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
	var drawnSinceLastUpdate = false;

	// Draw Loop
	var cctv = document.getElementById("video_cctv");
	cctvY = 0;
	function draw(){
		
		if(!drawnSinceLastUpdate){
			drawnSinceLastUpdate = true;
			onScroll();
		}

		// CCTV
		cctvY += 1;
		if(cctvY>=15) cctvY=0;
		cctv.style.backgroundPositionY = cctvY;

		// RAF
		RAF(draw);

	}
	draw();

	window.onscroll = function(){
		drawnSinceLastUpdate = false;
	};


};
