//get script path of this script
var scripts= document.getElementsByTagName('script');
var path= scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
var translationscriptdir= path.split('/').slice(0, -1).join('/')+'/';  // remove last filename part of path

function translationinit(onInitAction){
	$.i18n.init({
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
