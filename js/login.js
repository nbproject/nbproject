$(document).ready(function() {
    
    	hideError();
        var client = new ApiClient();
        //console.log(client);
    	// Sign In Button

        function handleLogin(data) {
                if (!data) {
                    console.log("login failed");
                } else {
                    console.log(data);
                    var string = JSON.stringify(data);
                    $.cookie("family", string, { expires: 7 });

                }
            }

    	$("#submitButton").click(function() {
            console.log("--login--");
    		var email = $("#email").val();
    		var pass = $("#password").val();
    		var rememberMe = $("#rememberMe").is(":checked");        
            client.login(email, pass, handleLogin);
                  
    		
    	});
    
    	// Register Button
    	$("#registerButton").click(function() {
    		window.location = 'create_account.html';
    	});
    	
    	function showError(message) {
    		$("#errorText").text(message);
    		$("#errorText").show();
    	}
    	
    	function hideError() {
    		$("#errorText").hide();
    	}
    	
    });