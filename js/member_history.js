$.extend({
    getUrlVars : function() {
        var vars = [], hash;
        var hashes = window.location.href.slice(
            window.location.href.indexOf('?') + 1).split('&');
        for ( var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
        },
    getUrlVar : function(name) {
        return $.getUrlVars()[name];
    }
});

$(document).ready(function() {
    if ($.getUrlVar('member')) {
        member = test_account.getMember($.getUrlVar('member'));
    } else { //? default?
        member = test_account.getMember("Cersei");
    }  
    

    $("#header").text("Today " + member.name + "...");
    var imgHTML = "<img src='assets/" + member.name + ".jpg' height='200'>"
    console.log(imgHTML);
    $("#containsImage").html(imgHTML);
    console.log("nope");

    $("#hideme").hide();
});