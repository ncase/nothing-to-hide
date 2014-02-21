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
