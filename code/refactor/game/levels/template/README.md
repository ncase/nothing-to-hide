HOW TO CREATE A CUSTOM LEVEL
===

Copy this folder and rename it

You can include information for other modders about your level by editing the README in your own level folder

To test this level, go to `index.html?level=<YOUR LEVEL NAME>`

To test multiple levels in sequence, go to `index.html?level=[<LEVEL_1>,<LEVEL_2>,<LEVEL_3>]`

**Basic**

Just edit level.json & map.txt

**Adding Art**

Add to the assets folder, and link to them in assets.json

**Custom Logic**

Edit custom.js


HOW A LEVEL FOLDER SHOULD BE STRUCTURED
===

/assets 	: all misc images/sounds/scripts can go here

assets.json : tells game engine what assets to preload
custom.js 	: custom level scripting that runs when this level starts
level.json  : data on this level's gameonbjects / gamelogic / wallobjects
map.txt 	: a level map in ASCII form