<?php

//FIXME parsing of Strings and replacement for strings based on different DOM elements (data-i18n vs text>tspan)

//TODO change from static string to fontfile place and encode on the fly to base64
define("FONTBASE64", shell_exec("base64 -w 0 ./FINAL/fonts/OstrichSans.woff"));

//TODO replace by file list which is read from "locales" directory instead of a static list
$langList=array("en","de","nl","ru","fr","it","sv","cs","es");

/*
To add a SVG graphic for translation
  1) open the template SVG in a text editor (a template SVG never resides in a language subdirectory like "en", "de" or so, but always on top of it
  2) in the SVG: add to all tspan tags the attribute data-i18n, which represents the key to the JSON data in locales/translation-xx.json
  3) in the SVG: if you want that the text is stretched over a certain width (usually recommended, to avoid overflowing text) add the attributes textLength (visually from Inkscape) and lengthAdjust="spacingAndGlyphs" to the text and tspan DOM tags
  4) in the SVG: if you want to use the Ostrich font in the SVG, just add <style>fontface{}</style> in the defs DOM tag (it might be that you have to change it from "<defs (attribute list)/>" to "<defs (attribute list)>[...]</defs>". afterwards use "php translate.php updateFont"
  5) in the respective javascript files add smart loading of the SVG in the respective js code (usually config.js): load from subdirectory obtained by getLC(), depending on selected language
  6) add the path string to the SVG into the array below and execute "php translate.php"
  7) optional visually check the generated "overviewTable.htm"
*/
$filelist=array(
	"FINAL/cutscene/img/header.svg",
	"FINAL/cutscene/pics2/meta0001.svg",
	"FINAL/cutscene/pics2/meta0002.svg",
	"FINAL/cutscene/pics2/meta0003.svg",
	"FINAL/cutscene/pics2/meta0004.svg",
	"FINAL/cutscene/pics2/meta0005.svg",
	"FINAL/cutscene/pics2/meta0006.svg",
	"FINAL/cutscene/pics2/meta0007.svg",
	"FINAL/cutscene/pics2/meta0008.svg",
	
	"FINAL/cutscene/pics/establishing_fg.svg",
	"FINAL/menu/assets/propaganda/title.svg", 
	"FINAL/game/assets/propaganda/dont_help_hiders.svg",
	"FINAL/game/assets/propaganda/error.svg",
	"FINAL/game/assets/propaganda/intro_pics.svg",
	"FINAL/game/assets/propaganda/needs_dummy.svg",
	"FINAL/game/assets/propaganda/nobody_messes.svg",
	"FINAL/game/assets/propaganda/nobody_the_wall.svg",
	"FINAL/game/assets/propaganda/nobody_the_wall_2.svg",
	"FINAL/game/assets/propaganda/pickup_gardner.svg",
	"FINAL/game/assets/propaganda/pickup_lookout.svg",
	"FINAL/game/assets/propaganda/puzzle_mock.svg",
	"FINAL/game/assets/propaganda/puzzle_psa.svg",
	"FINAL/game/assets/propaganda/questions.svg",
	"FINAL/game/assets/propaganda/smile.svg",
	"FINAL/game/assets/propaganda/stream_wall.svg",
	"FINAL/game/assets/propaganda/stream_wall_2.svg",
	"FINAL/game/assets/propaganda/tut_carpet.svg",
	"FINAL/game/assets/propaganda/tut_darker.svg",
	"FINAL/game/assets/propaganda/tut_pickup.svg",
	"FINAL/game/assets/propaganda/tut_power.svg",
	"FINAL/game/assets/propaganda/tut_reminder.svg",
	"FINAL/game/assets/propaganda/tut_slidewalk.svg",
	"FINAL/game/assets/propaganda/tut_slow.svg",
	"FINAL/game/assets/propaganda/tut_walk.svg",
	"FINAL/game/assets/propaganda/unsecret_ballot.svg",
	"FINAL/game/img/share_big.svg",
	"FINAL/menu/img/share_big.svg"
);

$action = "";
if (count($argv)>1){
	$action = $argv[1];
}

//do this only once to avoid unecessary file operations
if 	($action==="doTranslate"||$action==="")
	$languages = getLanguages($langList);

//TODO: consider indicating nothing => updateFont && doTranslate && createOverview

foreach ($filelist as $file){
	switch ($action){
		case "extractStrings":
			extractStrings($file);
			break;
		case "updateFont":
			updateFont($file);
			//TODO probably also add doTranslate, so all translation get updated by itself
			break;
		case "doTranslate":
		case "": case null:
			doTranslate($file,$languages);
			break;
		case "?":
		case "help": 
			printHelp();
			break 2;
		case "createOverview":
			createOverviewList("overviewList.htm",$filelist,$langList);
			createOverviewTable("overviewTable.htm",$filelist,$langList);
			break 2;
		default:
			echo "You entered an invalid command\n\n";
			printHelp();
			break 2;
	}
}
if ($action===""){
	createOverviewList("overviewList.htm",$filelist,$langList);
	createOverviewTable("overviewTable.htm",$filelist,$langList);
}

/**
 * returns an array of all languages from the JSON files, given an array of language codes
 */
function getLanguages($langList){
	$languages = array();
	foreach ($langList as $lang){
		$json=file_get_contents ("FINAL/locales/translation-$lang.json");
		//we want an associative array, thus second parameter is true
		$languages[$lang] = json_decode($json,true);
		//print_r($obj);
	}
	return $languages;
}


function explodeFile($file){
	$pos = strrpos($file, '/')+1;
	$filename = substr($file, $pos);
	$filepath = substr($file, 0, $pos);
	return array($filepath,$filename);
}

function extractStrings($file){
	$filenamepart=explodeFile($file);
	//remove last 4 chars as it is assumed that these are the file extension ".svg"
	echo "'".substr($filenamepart[1],0,-4)."': {\n";
    $buffer=file_get_contents ($file);
	//echo $buffer;
    $pos=0;
    $notfirst=false;
    $num=0;
    while ($pos!==false){
        $pos = getNextText($buffer,$pos);
        //echo "text $pos\n";
        if ($pos==false) {break;}
        $pos = getNextTSpan($buffer,$pos);
        //echo "tspan $pos\n";
        if ($pos==false) {break;}
        $posL = getNextGt($buffer,$pos);
        //echo "gt $posL\n";
        $posR = getNextLt($buffer,$posL);
        //echo "lt $posR\n";
        $text = getTextBetween($buffer,$posL,$posR);
        $pos = $posR;
        
        if ($notfirst) { echo ","; $notfirst=true;}
        //echo $text."-".$pos."\n";
        $num++;
        echo "    'string$num': '$text'\n";
        
   }
   //TODO: change so that correct JSON is generated without an unecessary comma at the end
   echo "},\n";
}

function printHelp(){
	global $argv;
	echo "Usage: php ".$argv[0]." <action>\n";
	echo "<action> can be: \n";
	echo "* (empty string): makes doTranslate and createOverview";
	echo "* 'doTranslate': translates all images given the current language files\n";
	echo "* 'updateFont': updates all SVGs with Ostrich-Sans text to use a different BASE64 code after changing it in the source of this script\n";
	echo "* 'extractStrings': tries to extract all strings from the SVGs, printing them as JSON code. Experimental! Don't rely solely on it.\n";
	echo "* 'createOverview': create an html overview which lists all SVGs in a table, in order to check whether translation look good in all languages\n";
}

/* general approach: 
	- read in translation files from locales
	- find text occurence of data-i18n attribute in DOM tags
	- translate text in that DOM tag from locales files, similar to i18next for all translation files
	- create files in subdirectories of the actual SVG (e.g. "FINAL/cutscene/pics/establishing_fg.svg" => "FINAL/cutscene/pics/XX/establishing_fg.svg" where XX is "en", "de", "ru", etc.
* */
function doTranslate($file,$languages){
	echo "\n\n=============================\n";
	echo "Translating $file\n";
	echo "=============================\n";
	$filenamepart=explodeFile($file);
	$buffer=file_get_contents($file);
	//loop through the languages
	foreach ($languages as $key=>$lang){
		echo "-----------------------------\n";
		echo "Translating to language $key\n";
		echo "-----------------------------\n";
		$posR=0;
		$translated = "";
		while (true){
			//find next occurence of a data-i18n attribute
			$pos1 = getNextDataI18N($buffer,$posR+1);
			
			//if there is no more occurence, there's nothing more to do; break this loop
			if ($pos1==false) {break;}
			
			//else extract the dataName from this attribute
			$pos2 = getNextQuote($buffer,$pos1+1);
			$dataName = getTextBetween($buffer,$pos1,$pos2);
		
			//append with text that comes before the string to be translated
			$posL = getNextGt($buffer,$pos2);
			$translated .= getTextBefore($buffer,$posR,$posL);
			
			//append with translation of said string
			$replaceText = getI18nText($dataName,$lang);
			echo "* $dataName=$replaceText\n";	
			$translated .= $replaceText;
			
			//go to end of translated string
			$posR = getNextLt($buffer,$posL);
			$pos1 = $posR;
		
		}
		//append part of file after last translated string
		$translated .= substr($buffer,$posR,-1);// getTextAfter($buffer,$posR);
		
		//if language directory does not exist, create it
		$directory = $filenamepart[0]."$key/"; 
		if (!is_dir($directory)) {
			mkdir($directory);
			echo "* created directory $directory\n";
		}
		
		//create file for language
		$newFile=$directory.$filenamepart[1];
		file_put_contents($newFile,$translated);
		
	}
}

/**
 * This function creates a file at $htmFileName which lists all SVGs below each other
 * This is nice for checking whether translation look good in all languages
 */
function createOverviewList($htmFileName,$filelist,$langList){
	echo "\n\n=============================\n";
	echo "Creating overview at $htmFileName\n";
	echo "=============================\n";
	$out = "";
	//loop through the files
	foreach ($filelist as $file){
		$filenamepart=explodeFile($file);
		echo "-----------------------------\n";
		echo "File $file\n";
		echo "-----------------------------\n";
		echo "* Reading original at $file\n";
		$out.="<h1>$file</h1>";
		$out.="<h2>Original</h2>";
		$out.=file_get_contents($file);
		$out.=htmlSeparator();
		//loop through the languages
		foreach ($langList as $key){
			$langFile=$filenamepart[0]."$key/".$filenamepart[1];
			echo "* Reading language $key at $langFile\n";
			$out.="<h2>Language: $key</h2>";
			$out.=file_get_contents($langFile);
			$out.=htmlSeparator();
		}
	}
	$out=htmlHeader("Overview list").$out.htmlFooter();
	file_put_contents($htmFileName,$out);
}

/**
 * This function creates a file at $htmFileName which lists all SVGs in a table (scaled)
 * This is nice for checking whether translation look good in all languages
 */
function createOverviewTable($htmFileName,$filelist,$langList){
	echo "\n\n=============================\n";
	echo "Creating overview table at $htmFileName\n";
	echo "=============================\n";
	$out = "<th>&nbsp;</th><th>(original)</th>";
	foreach ($langList as $key){
		$out.="<th>$key</th>";
	}
	$out = "<tr>$out</tr>";
	//loop through the files
	foreach ($filelist as $file){
		$filenamepart=explodeFile($file);
		echo "-----------------------------\n";
		echo "File $file\n";
		echo "-----------------------------\n";
		echo "* Reading original at $file\n";
		$row ="<th>$file</th>";
		$row.="<td>".file_get_contents($file)."</td>";
		//loop through the languages
		foreach ($langList as $key){
			$row.="\n<!-- ----------------------------------------->\n";
			$langFile=$filenamepart[0]."$key/".$filenamepart[1];
			echo "* Reading language $key at $langFile\n";
			$row.="\n<td>\n".file_get_contents($langFile)."\n</td>\n";
		}
		$out .= "<tr>$row</tr>";
		$row.="\n\n<!-- =========================================== -->\n\n";
	}
	$out=htmlHeader("Overview table")."<table border=1>$out</table>".htmlFooter();
	file_put_contents($htmFileName,$out);
}



/**
 * Helper function for createOverview (above)
 */
function htmlSeparator(){
	return "\n\n<br/><hr/>\n<!-- ----------------------------------------------->\n\n";
}

/**
 * Helper function for createOverview (above)
 */
function htmlHeader($title){
	return "<!DOCTYPE html>
		<html>
		<head>
		<title>$title</title><meta charset='utf-8'/>
		<style>
			body{
				background-color: #ccc;
				background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0));
				background-size: 50px 50px;
			}
		</style>
		</head>
		<body>";
}

/**
 * Helper function for createOverview (above)
 */
function htmlFooter(){
	return "</body></html>";
}


/**
 * Updates the font-face code with the BASE64 constant defined at the top of the script in all template SVGs
 * But only if there already exists exactly one @font-face directive in the SVG
 * Does not updated translated SVGs! (use doTranslate afterwards to update the font-face therein)
 */
function updateFont($file){
	$filenamepart=explodeFile($file);
	$buffer=file_get_contents($file);
	$posL = getNextFontFace($buffer,0);
	if ($posL===false) {
		echo "\n=> NOTICE: $file has no font-face! returning.\n"; return;
	}
	if (getNextFontFace($buffer,$posL+1)!==false) {
		echo "\n=> ERROR: $file has more than one font-face! Doing nothing, returning.\n"; return;
	}
	$posR = getNextCurlyBracket($buffer,$posL);
	$out=getTextBefore($buffer,0,$posL-1);
	$out.="@font-face { font-family: Ostrich Sans; src: url(\"data:application/font-woff;charset=utf-8;base64,".FONTBASE64."\"); }";
	$out.=getTextAfter($buffer,$posR+1);
	file_put_contents($file,$out);
}


/**
 * Gets the corresponding text out of a JSON language array from a key string like "key1.key2.key3";
 */
function getI18nText($name,$lang) {
	//explode into parts
	$nameparts=explode(".",$name);
	for ($i=0;$i<count($nameparts);$i++){
		$name = $nameparts[$i];
		$lang = $lang[$name];
	}
	return $lang;
}

/**
 * ==================================
 * BELOW ARE STRING HELPER FUNCTIONS
 */

function getNextFontFace($buffer,$pos){
	return strpos($buffer,'@font-face',$pos);
}

function getNextCurlyBracket($buffer,$pos){
	return strpos($buffer,'}',$pos);
}

function getNextDataI18N($buffer,$pos){
	$a = strpos($buffer,'data-i18n="',$pos);
	if ($a!==false) {$a+=strlen('data-i18n="')-1;}
	return $a;
}

function getNextQuote($buffer,$pos){
	return strpos($buffer,'"',$pos);
}

function getNextText($buffer, $pos){
	return strpos($buffer,"<text",$pos);
}

function getNextTSpan($buffer, $pos){
	return strpos($buffer,"<tspan",$pos);
}

function getNextLt($buffer,$pos){
	return strpos($buffer,"<",$pos);
}

function getNextGt($buffer,$pos){
	return strpos($buffer,">",$pos);
}

function getTextBetween($buffer,$pos1,$pos2){
	return substr($buffer, $pos1+1, $pos2-$pos1-1);
}

function getTextBefore($buffer,$pos1,$pos2){
	return substr($buffer, $pos1, $pos2-$pos1+1);
}

function getTextAfter($buffer,$posR){
	return substr($buffer." ",$posR,-1);
}
