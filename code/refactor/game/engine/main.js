// FPS STATS //
var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

// LEVELS TO LOAD //
var levels = ["common","0_intro"];

Game.gotoLevel(levels[1]);

/*****

1) Wait to be told what levels to load.

2) Load common + them.

3) Initialize the first level

*****/
