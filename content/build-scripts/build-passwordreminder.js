require(['requirescript'], function() {
  require(['handlebars'], function(handlebars){
    require(['password_reminder'], function(lost){
      Lost = lost;
      require(['launch']);
    });
  });
});
