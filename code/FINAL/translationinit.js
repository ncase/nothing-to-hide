//get script path of this script
var scripts= document.getElementsByTagName('script');
var path= scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
var translationscriptdir= path.split('/').slice(0, -1).join('/')+'/';  // remove last filename part of path

//var translationscriptdir="/nothing-to-hide/code/FINAL/";

function translationinit(onInitAction){
	i18n.init({
				//loads sth like locales/translation-en-us.json
				resGetPath: translationscriptdir+'locales/__ns__-__lng__.json',
				//set to true to turn on caching production use
				useLocalStorage: false, 
				//set to false for production use
				debug: true
			}, onInitAction);
}

/**
 * Shortcut function for the cutscenes
 * TODO: consider if it should be moved somewhere else
 * TODO: consider using the API differently for multiple plural forms http://i18next.com/pages/doc_features.html
 */
function minutesago(num){
	return (num==0?i18n.t("game.thewall.justnow"):(num==1?i18n.t("game.thewall.minutesago"):i18n.t("game.thewall.minutesago", { count: num })));
}
function secondsago(num){
	return (num==0?i18n.t("game.thewall.justnow"):(num==1?i18n.t("game.thewall.secondsago"):i18n.t("game.thewall.secondsago", { count: num })));
}


/**
 * Function to adapt fontsize after translation so it fits a certain area
 */
 //
//;(function($) {
//    $.fn.textfill = function(fontSize) {
        //var fontSize = options.maxFontPixels;
        /*var ourText = $('span:visible:first', this);
        var maxHeight = $(this).height();
        var maxWidth = $(this).width();
        var textHeight;
        var textWidth;
        do {
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
        console.log(this+" "+$(this).width());*/
        //return this;
///    }
//})(jQuery);
/*
function textfill(fontSize) {
	console.log(72);
}
/*
function tfill(object, fontSize) {
        //var fontSize = options.maxFontPixels;
        var ourText = $('span:visible:first', object);
        var maxHeight = object.height();
        var maxWidth = object.width();
        var textHeight;
        var textWidth;
        do {
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
        console.log(object+" "+object.width());
        return object;
}*/

/**
 * Function to add to the end of translationinit() if defined and applicable to document
 * i.e. when in a document with translated elements of DOM class "jtextfill"
 */
function adaptfonts(){
	console.log("=======================================");
    //$$('.jtextfill').each(console.log(72));
    var a = document.getElementsByClassName("jtextfill");
    var i = 0;
    for (var x in a)
	{
		//txt=txt + person[x];
		console.log(a.onclick);
		console.log(i++);
	}
    //console.log(72)
    console.log("=======================================");
}
