/*
	This handles a family session login/logout. It will set the cookie id to the account id.
	This account id will be used when trying to send requests to the server about page information.
	Any page that includes this script MUST include 
	<script src="external_js/jquery-cookie-master/jquery.cookie.js"></script>
*/


/*
	Username must be a string of some sort.
	Expiration date of 7 days is acceptable, 
	since we assume users are operating under a local pc, and security is not an issue.
*/


function login(username) {
	$.cookie("user", username, { expires: 7 });
}

function logout() {
	$.removeCookie("user");
}