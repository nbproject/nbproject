function getFamilyObject() {
	return JSON.parse($.cookie("family"));
}

function logout() {
	$.removeCookie("family");
}

function verifyLogin() {
	if ($.cookie("family")) {
		console.log("logged int");
	} else {
		window.location = 'login.html';
	}
}

$(document).ready(){
	verifyLogin();
}