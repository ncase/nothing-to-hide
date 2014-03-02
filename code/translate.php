<?php

//TODO there's a strange bug with doTranslate sometimes as the last char is not read/written into the translated files


//TODO change from static string to fontfile place and encode on the fly to base64
define("FONTBASE64", "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");


//define("STYLESTRING", "@font-face { font-family: Ostrich Sans; src: url(\"data:application/font-woff;charset=utf-8;base64,"+FONTBASE64+"\"); }");

//TODO add to all SVG files these attributes: data-i18n, textLength (visually from Inkscape), lengthAdjust="spacingAndGlyphs"
//TODO add smart loading of ressources in code of all config.js files: load from subdirectories, depending on selected language
$filelist=array(
	"FINAL/cutscene/pics/establishing_fg.svg",
	"FINAL/menu/assets/propaganda/title.svg", 
	"FINAL/game/assets/propaganda/dont_help_hiders.svg",/*
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
	"FINAL/game/assets/propaganda/unsecret_ballot.svg",*/
	"FINAL/game/img/share_big.svg",
	"FINAL/menu/img/share_big.svg"
);

$action = "";
if (count($argv)>1){
	$action = $argv[1];
}

//TODO replace by file list which is read from "locales" directory instead of a static list
$langList=array("en","de","nl","ru");
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
	echo "'".$filenamepart[1]."': {\n";
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
	//avoid this really strange bug, where the last char gets deleted by appending a space
	$out.=getTextAfter($buffer,$posR+1)." ";
	file_put_contents($file,$out);
	/*find next @font-face (there should be only one)
	find closing }
	replace
	//STYLESTRING*/
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
	return substr($buffer,$posR,-1);
}
