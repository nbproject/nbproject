function logout() {
	$.removeCookie("family");
}

function getFamilyObject() {
	return JSON.parse($.cookie("family"));
}


function verifyLogin() {
	if ($.cookie("family")) {
		console.log("logged int");
	} else {
		window.location = 'login.html';
	}
}

verifyLogin();
var client = new ApiClient();