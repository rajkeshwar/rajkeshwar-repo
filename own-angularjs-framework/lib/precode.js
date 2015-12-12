

(function(){
	
	var prettyPrintCss = document.createElement('link'); 
	 	prettyPrintCss.type = 'text/css'; 
	 	prettyPrintCss.rel = 'stylesheet';
	    prettyPrintCss.href = '../lib/prettify.css';

	var firstScript = document.getElementsByTagName('script')[0]; 
	    firstScript.parentNode.insertBefore(prettyPrintCss, firstScript);

	var prettyPrintJs = document.createElement('script'); 
	 	prettyPrintJs.type = 'text/javascript'; 
	 	prettyPrintJs.async = true;
	    prettyPrintJs.src = '../lib/prettify.js';

	var firstScript = document.getElementsByTagName('script')[0]; 
	    firstScript.parentNode.insertBefore(prettyPrintJs, firstScript);

})();


document.addEventListener('DOMContentLoaded', function(){
	var scripts = document.getElementsByTagName('script'),
		len = scripts.length,
		code = scripts[len-1].innerHTML,
		pre = document.createElement('pre');

		pre.className = 'prettyprint';
		pre.innerHTML = code;
		document.body.appendChild(pre);

		window.onload = function(){
			prettyPrint();
		};
});
 

