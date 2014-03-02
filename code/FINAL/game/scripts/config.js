Asset.init({
	images:{
		
		cctv:'assets/textures/cctv.png',

		conveyor:'assets/textures/conveyor.png',
		conveyor_blue:'assets/textures/conveyor_blue.png',
		conveyor_cctv:'assets/textures/conveyor_cctv.png',

		carpet:'assets/textures/carpet.png',
		carpet_cctv:'assets/textures/carpet_cctv.png',

		screenline:'assets/textures/screenline.png',
		exit:'assets/textures/exit.png',
		exit_2:'assets/textures/exit_2.png',

		// PROPAGANDA or TUTORIAL

		propaganda_tut_walk:'assets/propaganda/'+getLC()+'/tut_walk.svg',
		propaganda_tut_slow:'assets/propaganda/'+getLC()+'/tut_slow.svg',
		propaganda_tut_pickup:'assets/propaganda/'+getLC()+'/tut_pickup.svg',
		propaganda_tut_carpet:'assets/propaganda/'+getLC()+'/tut_carpet.svg',
		propaganda_tut_reminder:'assets/propaganda/'+getLC()+'/tut_reminder.svg',
		propaganda_tut_power:'assets/propaganda/'+getLC()+'/tut_power.svg',
		propaganda_tut_slidewalk:'assets/propaganda/'+getLC()+'/tut_slidewalk.svg',
		propaganda_tut_darker:'assets/propaganda/'+getLC()+'/tut_darker.svg',

		propaganda_smile:'assets/propaganda/'+getLC()+'/smile.svg',
		propaganda_puzzle_psa:'assets/propaganda/'+getLC()+'/puzzle_psa.svg',
		propaganda_puzzle_mock:'assets/propaganda/'+getLC()+'/puzzle_mock.svg',
		propaganda_dont_help_hiders:'assets/propaganda/'+getLC()+'/dont_help_hiders.svg',
		propaganda_pickup_gardner:'assets/propaganda/'+getLC()+'/pickup_gardner.svg',
		propaganda_nobody_the_wall:'assets/propaganda/'+getLC()+'/nobody_the_wall.svg',
		propaganda_nobody_the_wall_2:'assets/propaganda/'+getLC()+'/nobody_the_wall_2.svg',
		propaganda_nobody_messes:'assets/propaganda/'+getLC()+'/nobody_messes.svg',
		propaganda_stream_wall:'assets/propaganda/'+getLC()+'/stream_wall.svg',
		propaganda_stream_wall_2:'assets/propaganda/'+getLC()+'/stream_wall_2.svg',
		propaganda_questions:'assets/propaganda/'+getLC()+'/questions.svg',
		propaganda_intro_pics:'assets/propaganda/'+getLC()+'/intro_pics.svg',
		propaganda_pickup_lookout:'assets/propaganda/'+getLC()+'/pickup_lookout.svg',
		propaganda_unsecret_ballot:'assets/propaganda/'+getLC()+'/unsecret_ballot.svg',
		propaganda_error:'assets/propaganda/'+getLC()+'/error.svg',

	},
	sprites:{
		
		Poppy_Idle:'assets/sprites/Poppy_Idle',
		Poppy_Idle_With_Eye:'assets/sprites/Poppy_Idle_With_Eye',
		Poppy_Idle_With_Eye_2:'assets/sprites/Poppy_Idle_With_Eye_2',
		Poppy_Shot:'assets/sprites/Poppy_Shot',
		Poppy_Walk:'assets/sprites/Poppy_Walk',
		Poppy_Walk_With_Eye:'assets/sprites/Poppy_Walk_With_Eye',
		Poppy_Walk_With_Eye_2:'assets/sprites/Poppy_Walk_With_Eye_2',

		MrPrism:'assets/sprites/MrPrism',
		PrismEye:'assets/sprites/PrismEye',
		Shimmer:'assets/sprites/Shimmer',

		Cursor:'assets/sprites/Cursor',
		Button:'assets/sprites/Button',

		SmallProps:'assets/sprites/SmallProps',
		BigProps:'assets/sprites/BigProps',

		Dandy:'assets/sprites/Dandy'

	},
	sounds:{

		sfx_shotdown:{src:'assets/sounds/mp3/shotdown.mp3|assets/sounds/ogg/shotdown.ogg'},
		sfx_alarm:{src:'assets/sounds/mp3/alarm.mp3|assets/sounds/ogg/alarm.ogg'},
		
		sfx_prism_pickup:{src:'assets/sounds/mp3/prism_pickup.mp3|assets/sounds/ogg/prism_pickup.ogg'},
		sfx_prism_putdown:{src:'assets/sounds/mp3/prism_putdown.mp3|assets/sounds/ogg/prism_putdown.ogg'},

		sfx_footstep_1:{src:'assets/sounds/mp3/step_1.mp3|assets/sounds/ogg/step_1.ogg'},
		sfx_footstep_2:{src:'assets/sounds/mp3/step_2.mp3|assets/sounds/ogg/step_2.ogg'},
		sfx_metal_footstep_1:{src:'assets/sounds/mp3/metal_step_1.mp3|assets/sounds/ogg/metal_step_1.ogg'},
		sfx_metal_footstep_2:{src:'assets/sounds/mp3/metal_step_2.mp3|assets/sounds/ogg/metal_step_2.ogg'},
		
		sfx_carpet_footstep_1:{src:'assets/sounds/mp3/carpet_step_1.mp3|assets/sounds/ogg/carpet_step_1.ogg'},
		sfx_carpet_footstep_2:{src:'assets/sounds/mp3/carpet_step_2.mp3|assets/sounds/ogg/carpet_step_2.ogg'},

		sfx_cam:{src:'assets/sounds/mp3/cam.mp3|assets/sounds/ogg/cam.ogg'},
		sfx_slidewalk:{src:'assets/sounds/mp3/slidewalk.mp3|assets/sounds/ogg/slidewalk.ogg'},
		sfx_dialog:{src:'assets/sounds/mp3/dialog.mp3|assets/sounds/ogg/dialog.ogg'},

		button_hover: {src:'assets/sounds/mp3/button_hover.mp3|assets/sounds/ogg/button_hover.ogg'},
		button_press: {src:'assets/sounds/mp3/button_press.mp3|assets/sounds/ogg/button_press.ogg'},

		music_bg: {src:'assets/music/mp3_64/a_healthy_dystopia.mp3|assets/music/ogg_64/a_healthy_dystopia.ogg'},
		music_bg_2: {src:'assets/music/mp3_64/home_sweet_homeland.mp3|assets/music/ogg_64/home_sweet_homeland.ogg'}

	},
	levels:{
		
		intro: 'levels/intro',
		pickup: 'levels/pickup',
		big_puzzle: 'levels/big_puzzle',

		conveyor: 'levels/conveyor',
		conveyor_2: 'levels/conveyor_2',

		power: 'levels/power',
		power_puzzle: 'levels/power_puzzle',
		nobody_needs_you: 'levels/nobody_needs_you'

	}
});

Game.init({
	levels:[
		'intro','pickup','big_puzzle',
		'conveyor','conveyor_2',
		'power','power_puzzle',
		'nobody_needs_you'
	]
});
