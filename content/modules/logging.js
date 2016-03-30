/*
 * logging.js
 * models for logging annotation
 * This module defines the namespace NB.logging
 * It requires the following modules:
 *		Module
 *		NB
 *		mvc
 *		jquery
Author
    cf AUTHORS.txt

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 *
 */

try {
  Module.require('NB', 0.1);
  Module.require('NB.mvc', 0.1);
  Module.createNamespace('NB.logging', 0.1);
}
catch (e) {
  alert('[inbox] Init Error: ' + e);
}

/**
 * A view component that observes messages, and displays the most current one
 */
NB.logging.popupView = function (container) {
  this.superclass();
  this.container = container;
  container.className = 'popupView';
  this.playing = true;
};

NB.logging.popupView.prototype = new NB.mvc.view();
NB.logging.popupView.prototype.constructor = NB.logging.popupView;
NB.logging.popupView.prototype.superclass = NB.mvc.view;
NB.logging.popupView.prototype.update = function (action, payload) {
  var self = this;
  var model = payload.model;
  if (action == 'add') {
    if (this.playing) {
      $(this.container).stop(true, false);
    }    else {
      this.playing = true;
    }

    $(this.container).text(payload.diff.body).fadeTo('normal', 0.7, function () {$(this).fadeTo(5000, 0.7, function () {$(this).fadeTo('normal', 0, function () {self.playing = false;});});});
  }
};

/**
 * A view component that observes messages, and displays them
 */
NB.logging.logView = function (container) {
  this.superclass();
  this.container = container;
};

NB.logging.logView.prototype = new NB.mvc.view();
NB.logging.logView.prototype.constructor = NB.logging.logView;
NB.logging.logView.prototype.superclass = NB.mvc.view;
NB.logging.logView.prototype.update = function (action, payload) {
  var model = payload.model;
  if (action == 'add') {
    /*
    	items= diff[items_fieldname];
    	for (i=0;i<items.length;i++){
    	    a = items[i];
    	    s += "<option id_ensemble=\""+a.id+"\">"+a.name+"</option>";
    	}
    	$(this.container).append(s);
    	*/
  }
};

/**
 * Collection of Docs
 */
NB.logging.logger = function () {
  this.superclass();
  this.items = [];
};

NB.logging.logger.prototype = new NB.mvc.model();
NB.logging.logger.prototype.constructor = NB.logging.logger;
NB.logging.logger.prototype.superclass = NB.mvc.model;
NB.logging.logger.prototype.modify = function (action, payload) {
  var i;
  if (action == 'add') {
    this.items.push(payload);
  }  else {
    alert('[NB.logging.logger.modify] unknown action: ' + action);
    return;
  }

  for (i in this.observers) {
    this.observers[i].o.update(action, { model: this, diff: payload });
  }
};

NB.logging.logger.prototype.info = function (body) {
  var msg = {};
  msg.body = body;
  msg.type = 'info';
  this.modify('add', msg);
};

NB.logging.logger.prototype.warning = function (body) {
  var msg = {};
  msg.body = body;
  msg.type = 'warning';
  this.modify('add', msg);
};

NB.logging.logger.prototype.error = function (body) {
  var msg = {};
  msg.body = body;
  msg.type = 'error';
  this.modify('add', msg);
};

