<?php

//FIXME parsing of Strings and replacement for strings based on different DOM elements (data-i18n vs text>tspan)

//TODO change from static string to fontfile place and encode on the fly to base64
define("FONTBASE64", "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");


//define("STYLESTRING", "@font-face { font-family: Ostrich Sans; src: url(\"data:application/font-woff;charset=utf-8;base64,"+FONTBASE64+"\"); }");

//TODO add to all SVG files these attributes: data-i18n, textLength (visually from Inkscape), lengthAdjust="spacingAndGlyphs"
//TODO add smart loading of ressources in code of all config.js files: load from subdirectories, depending on selected language
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

//TODO replace by file list which is read from "locales" directory instead of a static list
$langList=array("en","de","nl","ru","fr","it","sv","cs");
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
