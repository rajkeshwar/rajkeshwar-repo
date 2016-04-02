

window.onload = function(){
	var toggleElement = document.getElementsByClassName('toggle')[0];
			toggleElement.addEventListener('click', toggleIcon);
}

// window.onresize = function(){
// 	console.log('window is resized');

// 	var panel = document.getElementsByClassName('panel')[0];
// 	var toggle = document.getElementsByClassName('toggle')[0];

// 	var height = panel.scrollHeight/2 - toggle.scrollHeight/2;
// debugger;
// }

function toggleIcon(){
	if(this.classList.contains('correct')){
		this.classList.remove('correct');
		this.classList.add('incorrect');
	} else {
		this.classList.remove('incorrect');
		this.classList.add('correct');
	}
}