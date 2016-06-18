/*
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

define(function(require) {
  var $               = require('jquery');
  var Conf          = require('conf');
  var Pers            = require('pers');
  var Handlebars     = require('handlebars');
  var invitekey = window.location.href.split(document.location.pathname + "?key=")[1];

  Pers.init = function () {
    var payload = {
    	payload: {"invitekey": invitekey},
    	types: ["class_settings"]
    };

    Pers.call('getObjects', payload, function(p){
      if(!p.class_settings){
        $(".nb-widget-body").append(require('hbs!templates_dir/404')());
        return;
      }
      p["user"] = Conf.userinfo;
      console.log(p);
      if(Conf.userinfo.guest) {
        $(".nb-widget-body").empty();
        $(".nb-widget-body").append(require('hbs!templates_dir/subscribe_new_user')(p));
      }
      else{
        $(".nb-widget-body").empty();
        $(".nb-widget-body").append(require('hbs!templates_dir/subscribe_existing_user')(p));
      }
    });

  };

  function setPageHandlers() {

    $("form.confirm-subscription").submit(function(e){
      e.preventDefault();
      var subscribekey = $(this).attr("data-subscribe-key");
      Pers.call("subscribe_with_key", {key: subscribekey}, function(p){
        if(p.new_user) {
            console.log("Todo: >>>k redirect to page for entring new user details");
//          window.location.href =
        }
        else{
          window.location.href = "/";
        }
      });
    });

  }

});
