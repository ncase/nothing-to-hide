///////
var alreadyExited = false;
window.gotoGame = function(){
	if(alreadyExited) return;
	alreadyExited = true;
	window.top.gotoGame();
}

window.onload = function(){

	var poster = {
		poppy: {
			user: "Poppy Gardner",
			icon: "icons/poppy.png",
			date: "4 years ago"
		},
		gardner: {
			user: "John Gardner",
			icon: "icons/gardner.png",
			date: "4 years ago"
		},
		game: {
			user: "Nothing To Hide",
			icon: "icons/game.png",
			date: "just now"
		}
	};

	var _generatePost = function(type,poster,data){
		return {
			type: type+"_post",
			user: poster.user,
			icon: poster.icon,
			date: poster.date,
			data: data
		}
	};

	var posts = [

		////// ESTABLISHING SHOT ///////

		_generatePost("parallax",poster.poppy,{
			height: 450,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/establishing_fg.png", depth:0.1, offset:50}
			]
		}),
		_generatePost("parallax",poster.poppy,{
			height: 350,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/establishing_fg_2.png", depth:0.1, offset:50}
			]
		}),
		_generatePost("parallax",poster.poppy,{
			height: 250,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/establishing_fg_3.png", depth:0.1, offset:50}
			]
		}),


		//////// MR GARDNER TO POPPY //////////

		_generatePost("conversation",poster.gardner,{
			message: "Poppy?"
		}),
		_generatePost("conversation",poster.gardner,{
			message: "Hey sweetie. Please don't be sad."
		}),
		_generatePost("conversation",poster.gardner,{
			message: "It's really hurting my popularity ranking."
		}),
		_generatePost("conversation",poster.gardner,{
			message: "The first unsecret ballot election is coming up. "+
					"It's very important to Daddy's career, "+
					"so I need you to post more happy pictures of yourself to The Wall. "+
					"At least 400 per day, okay?"
		}),
		_generatePost("conversation",poster.gardner,{
			message: "Please, Poppy? I don't want the voters to think I'm a bad parent."
		}),


		///// CLOSE DOOR /////

		_generatePost("parallax",poster.poppy,{
			height: 450,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/door_close_1.png", depth:0.1, offset:50}
			]
		}),
		_generatePost("conversation",poster.gardner,{
			message: "Well, goodnight! <span>#FatherDaughterMoment</span>"
		}),
		_generatePost("parallax",poster.poppy,{
			height: 450,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/door_close_2.png", depth:0.1, offset:75}
			]
		}),
		_generatePost("parallax",poster.poppy,{
			height: 450,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/door_close_3.png", depth:0.1, offset:100}
			]
		}),
		_generatePost("parallax",poster.poppy,{
			height: 450,
			layers:[
				{img:"pics/background_back.png", depth:0.8, offset:0},
				{img:"pics/background_front.png", depth:0.6, offset:0},
				{img:"pics/door_close_4.png", depth:0.1, offset:100}
			]
		}),

		//////// INTERNAL MONOLOGUE //////////

		_generatePost("conversation",poster.poppy,{
			message: "... I have to leave."
		}),
		_generatePost("conversation",poster.poppy,{
			message: "Dad will be better off without me."
		}),
		_generatePost("conversation",poster.poppy,{
			message: "I don't deserve all the loving security he's given me."
		}),
		_generatePost("conversation",poster.poppy,{
			message: "Goodbye, dad. I'm so sorry."
		}),


		//////// ESCAPE //////////

		_generatePost("parallax",poster.poppy,{
			height: 250,
			layers:[{img:"pics/escape_1.png", depth:1, offset:150}]
		}),
		_generatePost("parallax",poster.poppy,{
			height: 250,
			layers:[{img:"pics/escape_2.png", depth:1, offset:150}]
		}),
		_generatePost("parallax",poster.poppy,{
			height: 250,
			layers:[{img:"pics/escape_3.png", depth:1, offset:150}]
		}),
		_generatePost("parallax",poster.poppy,{
			height: 250,
			layers:[{img:"pics/escape_4.png", depth:1, offset:150}]
		}),
		_generatePost("parallax",poster.poppy,{
			height: 250,
			layers:[{img:"pics/escape_5.png", depth:1, offset:150}]
		}),

		//////// PLAY GAME /////////
		_generatePost("parallax",poster.game,{
			height: 400,
			layers:[{img:"pics/nope.png", depth:1, offset:150}]
		})

	];

	///////////

	var timeline = document.getElementById("timeline");
	var addPost = function(post){
		var dom = document.createElement("div");
		dom.setAttribute("class",post.type);

		var html;

		// Parallax Post
		if(post.type==="parallax_post"){

			// Start
			html = ''+
				'<div id="poster">'+
				'	<div id="poster_icon" style="background:url('+post.icon+')"></div>'+
				'	<div id="poster_info">'+
				'		<span id="poster_info_name">'+post.user+'</span><br>'+
				'		<span id="poster_info_date">posted '+post.date+'</span>'+
				'	</div>'+
				'</div>'+
				'<div id="layers" style="height:'+post.data.height+'px">';

			// Layers
			for(var i=0;i<post.data.layers.length;i++){
				var layer = post.data.layers[i];
				html += '	<div style="background-image:url('+layer.img+')" depth="'+layer.depth+'" offset="'+layer.offset+'"></div>';
			}

			// End
			html += ''+
				'</div>';

		}

		// Conversation post
		if(post.type==="conversation_post"){
			html = ''+
				'<div id="poster">'+
				'	<div id="poster_icon" style="background:url('+post.icon+')"></div>'+
				'	<div id="poster_info">'+
				'		<span id="poster_info_name">'+post.user+'</span><br>'+
				'		<span id="poster_info_date">posted '+post.date+'</span>'+
				'	</div>'+
				'</div>';
			html += '<div id="convo">'+post.data.message+'</div>';
		}

		// Add to DOM
		dom.innerHTML = html;
		timeline.appendChild(dom);

	}

	posts.map(addPost);

	///////////


	var parallaxes = document.querySelectorAll(".parallax_post #layers");
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
	function draw(){
		if(!drawnSinceLastUpdate){
			drawnSinceLastUpdate = true;
			onScroll();
		}
		RAF(draw);
	}
	draw();

	window.onscroll = function(){
		drawnSinceLastUpdate = false;
	};


};
