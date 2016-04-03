/**
 * mvc.js: Generic definitions for models and views
 *		NB
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/

(function (GLOB) {
  GLOB.mvc = {};

  GLOB.mvc.model = function () {
    this.observers = [];
    this.logger = null;
  };

  GLOB.mvc.model.prototype.register = function (obs, propList) {
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

  GLOB.mvc.model.prototype.unregister = function (obs) {
    var i;
    for (i in this.observers) {
      if (this.observers[i] == obs) {
        delete this.observers[i];
        return;
      }
    }
  };

  GLOB.mvc.model.prototype.setLogger = function (logger) {
    this.logger = logger;
  };

  GLOB.mvc.model.prototype.info = function (msg) {
    if (this.logger !== null) {
      this.logger.info(msg);
    }
  };

  GLOB.mvc.model.prototype.warning = function (msg) {
    if (this.logger !== null) {
      this.logger.warning(msg);
    }
  };

  GLOB.mvc.model.prototype.error = function (msg) {
    if (this.logger !== null) {
      this.logger.error(msg);
    }
  };

  //GLOB.mvc.model.prototype.modify = function(){alert("[GLOB.mvc.model.prototype.modify] I'm virtual");};

  GLOB.mvc.view = function () {
    this.id = (new Date()).getTime(); //this will generate a default id for the view
    this.logger = null;
  };

  GLOB.mvc.view.prototype.setLogger = function (logger) {
    this.logger = logger;
  };

  GLOB.mvc.view.prototype.info = function (msg) {
    if (this.logger !== null) {
      this.logger.info(msg);
    }
  };

  GLOB.mvc.view.prototype.warning = function (msg) {
    if (this.logger !== null) {
      this.logger.warning(msg);
    }
  };

  GLOB.mvc.view.prototype.error = function (msg) {
    if (this.logger !== null) {
      this.logger.error(msg);
    }
  };

  //GLOB.mvc.view.prototype.update = function(){alert("[GLOB.mvc.view.prototype.update] I'm virtual");};

  /**
   * COLLECTION: Collection of objects that have an unique "id" field
   * note: the current implemetation can return undefinied items if they have been deleted
   */
  GLOB.mvc.collection = function (type) {
    this.superclass();
    this.items = {};//indexed by item.id
    this.type = type; //sometimes useful to specify a collection of what...
  };

  GLOB.mvc.collection.prototype = new GLOB.mvc.model();
  GLOB.mvc.collection.prototype.constructor = GLOB.mvc.collection;
  GLOB.mvc.collection.prototype.superclass = GLOB.mvc.model;
  GLOB.mvc.collection.prototype.modify = function (action, payload, items_fieldname) {
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
      alert('[GLOB.mvc.collection.modify] unknown action: ' + action);
      return;
    }

    for (i in this.observers) {
      this.observers[i].o.update(action, { model: this, diff: payload }, items_fieldname);
    }
  };

  GLOB.mvc.collection.prototype.getItems = function () {
    return this.items;
  };

  GLOB.mvc.collection.prototype.get = function (id) {
    return this.items[id];
  };

})(NB);

