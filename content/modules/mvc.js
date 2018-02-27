/**
 * mvc.js: Generic definitions for models and views
 * NB
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/

define(function(require) {
  var MVC = {};

  MVC.model = function () {
    this.observers = [];
    this.logger = null;
  };

  MVC.model.prototype.register = function (obs, propList) {
    this.observers.push({ o:obs, p:propList || {} });

    //by default, relay the logger if the model has one and the view doesn't
    if ((obs.logger === null)  && (this.logger !== null)) {
      obs.setLogger(this.logger);
    }

    if (propList) {
      //transmit current state to observer, if we know what to transmit
      obs.update('create', { model: this }, propList);
    }
  };

  MVC.model.prototype.unregister = function (obs) {
    var i;
    for (i in this.observers) {
      if (this.observers[i] == obs) {
        delete this.observers[i];
        return;
      }
    }
  };

  MVC.model.prototype.setLogger = function (logger) {
    this.logger = logger;
  };

  MVC.model.prototype.info = function (msg) {
    if (this.logger !== null) {
      this.logger.info(msg);
    }
  };

  MVC.model.prototype.warning = function (msg) {
    if (this.logger !== null) {
      this.logger.warning(msg);
    }
  };

  MVC.model.prototype.error = function (msg) {
    if (this.logger !== null) {
      this.logger.error(msg);
    }
  };

  //MVC.model.prototype.modify = function(){alert("[MVC.model.prototype.modify] I'm virtual");};

  MVC.view = function () {
    this.id = (new Date()).getTime(); //this will generate a default id for the view
    this.logger = null;
  };

  MVC.view.prototype.setLogger = function (logger) {
    this.logger = logger;
  };

  MVC.view.prototype.info = function (msg) {
    if (this.logger !== null) {
      this.logger.info(msg);
    }
  };

  MVC.view.prototype.warning = function (msg) {
    if (this.logger !== null) {
      this.logger.warning(msg);
    }
  };

  MVC.view.prototype.error = function (msg) {
    if (this.logger !== null) {
      this.logger.error(msg);
    }
  };

  //MVC.view.prototype.update = function(){alert("[MVC.view.prototype.update] I'm virtual");};

  /**
   * COLLECTION: Collection of objects that have an unique "id" field
   * note: the current implemetation can return undefinied items if they have been deleted
   */
  MVC.collection = function (type) {
    this.superclass();
    this.items = {};//indexed by item.id
    this.type = type; //sometimes useful to specify a collection of what...
  };

  MVC.collection.prototype = new MVC.model();
  MVC.collection.prototype.constructor = MVC.collection;
  MVC.collection.prototype.superclass = MVC.model;
  MVC.collection.prototype.modify = function (action, payload, items_fieldname) {
    var i;
    var items = payload[items_fieldname];
    if (action == 'create') {
      for (i = 0; i < items.length; i++) {
        this.items[items[i].id] = items[i];
      }
    }    else if (action == 'add' || action == 'update') {
      for (i = 0; i < items.length; i++) {
        this.items[items[i].id] = items[i];
      }
    }    else if (action == 'delete') {
      for (i = 0; i < items.length; i++) {
        delete this.items[items[i].id];
      }
    }    else {
      alert('[MVC.collection.modify] unknown action: ' + action);
      return;
    }

    for (i in this.observers) {
      this.observers[i].o.update(action, { model: this, diff: payload }, items_fieldname);
    }
  };

  MVC.collection.prototype.getItems = function () {
    return this.items;
  };

  MVC.collection.prototype.get = function (id) {
    return this.items[id];
  };

  return MVC;
});
