/**
 * login.js: Login screen functiond
 * It requires the following modules:
 *		Module
 *		NB
 *		auth
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */


try{    
    Module.require("NB", 0.1);
    Module.require("NB.auth", 0.1);
    Module.createNamespace("NB.login", 0.1);

}
catch (e){
    alert("[login] Init Error: "+e);
}

NB.login.onSignup = function(){
    document.getElementById("nu-panel").style.display = "block";
    document.getElementById("eu-panel").style.display = "none";

};


NB.login.onPasswdAccel = function(event){
    if (event.keyCode == 13){
	NB.login.onSigninButton();
    }
};

NB.login.onPasswdKey = function(){
    var v1 = document.getElementById("nu-password1").value;
    var v2 = document.getElementById("nu-password2").value;
    if ((v1==v2) && (v1.length>0)){
	NB.debug("Match !");
	document.getElementById("signupbutton").removeAttribute("disabled");
    }
    else{
	document.getElementById("signupbutton").setAttribute("disabled", "1");
    }
};



NB.login.onSignupButton = function(){
    var msg={};
    msg.email = document.getElementById("nu-email").value;
    msg.password = document.getElementById("nu-password1").value;
    NB.rpc.rpc("/pdf/rpc", "signup",[msg],NB.login.signupConf, {});
    document.getElementById("nu-panel").style.display = "none";
    document.getElementById("nu-conf").style.display = "block";
   
};


NB.login.onSigninButton = function(){
    var email =document.getElementById("eu-email").value;
    var password = btoa(document.getElementById("eu-password").value);
    if (document.getElementById("eu-remember").checked){
	NB.auth.set_cookie ("email",email, 2099, 01, 01 );
	NB.auth.set_cookie ("password",password, 2099, 01, 01 );
    }
    else{
	NB.auth.set_cookie ("email",email );
	NB.auth.set_cookie ("password",password );
    }
    document.location.reload();
};





NB.login.signupConf = function(args){
    //    var response = args.payload.errno;
    //    var email = args.payload.email;
    var msg; 
    //    if (response == "OK"){
    msg = "Thank you for Signing Up ! <br/>You will shortly receive a confirmation email<br/>Just click the link you'll find in this email to activate your account...";
    /*
    }
    else{
	msg = "The system has encountered the following error:<br/>"+args.payload.error;
    }
    */
    //    document.getElementById("nu-conf").appendChild(document.createTextNode(msg));
    document.getElementById("nu-conf-after").innerHTML = "<div>"+msg+"</div>";
    document.getElementById("nu-conf-before").style.display = "none";
    document.getElementById("nu-conf-after").style.display = "block";

};

$(document).ready(function () {
	$("div.section").each(NB.dom.addSection);
    });
