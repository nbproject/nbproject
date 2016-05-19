require(['requirescript'], function() {
  require(['init_analytics'], function (init_analytics) {
    require(['pers', 'conf'], function(pers, conf) {
      require(['launch'], function(launch) {
        Pers = pers;
        Conf = conf;
      });
    });
  });
});
