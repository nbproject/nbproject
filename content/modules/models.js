/**
 * models.js: Useful models for documents, annotations etc...
 * This module defines the namespace NB.models
 * It requires the following modules:
 *        Module
 *        NB
 *        NB.mvc
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global console:true NB:true */
(function (GLOB) {
  //require: mvc;
  GLOB.models = {};

  /*
   * Collections of Tables relevant to document management
   */
  GLOB.models.Store = function () {
    this.superclass();
    this.o = {}; //objects
    this.indexes = {}; //existing indexes
    this.rangeindex_info = {}; // index name -> {fieldname, width}
    this.schema = null;
  };

  GLOB.models.Store.prototype = new GLOB.mvc.model();
  GLOB.models.Store.prototype.constructor = GLOB.models.Store;
  GLOB.models.Store.prototype.superclass = GLOB.mvc.model;
  GLOB.models.Store.prototype.create = function (payload, schema) {
    /*
     * schema: null (default behavior) or dictionary {String type_name: Object tabledef}
     * where:
     *  - type_name is the name of the table to be created in Store
     *  - tabledef is either null (default behavior) or a dictionary that can contain the following (all optional):
     *        - pFieldName    name of the correponding field in payload
     *        - obj_type    contructor function to apply
     *                if not specified, the created object will just be a javascript Object, lazily copied from payload
     *        - references    dictionary: {String fieldname: String target_tablename}
     * the code can add the __ref field to schema, in order to keep track of indexes that aren't references to other tables.
     */
    var self = this;
    var tabledef, pFieldName, obs;
    if (schema === undefined) {
      schema = {};

      //make up a default schema: just use all the fields from payload
      for (var k in payload) {
        schema[k] = null;
      }
    }

    this.schema = schema;
    for (var type_name in schema) {
      if (type_name.substring(0, 2) === '__') {
        throw new Error("table names can't start w/ '__' , tablename=" + type_name);
      }

      tabledef = schema[type_name];
      if (tabledef === null) {
        tabledef = { pFieldName: type_name };
      }

      pFieldName = tabledef.pFieldName;
      if (pFieldName in payload) {
        /*
         * this can cover scenarios like:
         * this.ensembles = payload.channels
         * OR
         * this.Ensembles = {123: new Ensemble(payload.channels[123], ...}
         */
        if ('obj_type' in tabledef) {//need to apply constructor
          for (var id in payload[pFieldName]) {
            this.o[type_name][id] = new tabledef.obj_type(payload[pFieldName][id]);
          }
        } else {//just lazy copy
          this.o[type_name] =  payload[pFieldName];
        }

      }      else { //just create an empty table
        if (!(type_name in this.o)) {
          this.o[type_name] = {};
        }
      }

      for (var i in this.observers) {
        obs = self.observers[i];
        if (type_name in obs.p) {
          obs.o.update('create', { model: self, diff: this.o[type_name] }, type_name);
        }
      }
    }
  };

  GLOB.models.Store.prototype.__get_indexes = function (type_name) {
    //PRE: Schema already defined.
    var self = this,
    indexes = {},
    rangeindexes = {},
    tabledef = self.schema[type_name],
    ref, refs, i;
    if ('references' in tabledef) {
      for (i in tabledef.references) {
        ref =  tabledef.references[i];
        if (ref in self.indexes && type_name in self.indexes[ref]) {
          indexes[i] =  self.indexes[ref][type_name];
        }
      }
    }

    if ('__ref' in tabledef) {
      var r = /__in(\d*)$/;
      for (i in tabledef.__ref) {
        refs =  tabledef.__ref[i];
        for (ref in refs) {
          if (ref in self.indexes && type_name in self.indexes[ref]) {
            if (r.exec(ref) == null) {
              indexes[i] =  self.indexes[ref][type_name];
            }            else {
              rangeindexes[i] = { index: self.indexes[ref][type_name], info: self.rangeindex_info[ref] };
            }
          }
        }
      }
    }

    return [indexes, rangeindexes];
  };

  GLOB.models.Store.prototype.set = function (type_name, objs) {
    //PRE: Schema already defined.
    var self = this;
    if (type_name in self.schema) {
      self.__dropIndexes(type_name);
      self.o[type_name] = {};
      self.add(type_name, objs);
    } else {
      console.log(type_name, ' not found in schema: ', self.schema);
    }

  };

  GLOB.models.Store.prototype.add = function (type_name, objs) {
    //PRE: Schema already defined.
    var self = this;
    var is_update;
    if (type_name in self.schema) {
      var all_indexes = self.__get_indexes(type_name);
      var regular_indexes = all_indexes[0];
      var range_indexes = all_indexes[1];
      var index, index_info, v_new, v_old, newbin, oldbin, pk, fk, fieldname;
      for (pk in objs) {
        is_update = pk in this.o[type_name];

        //now, update existing indexes if any
        if (is_update) {

          for (fieldname in  regular_indexes) {
            index = regular_indexes[fieldname];
            v_new = objs[pk][fieldname];
            v_old = this.o[type_name][pk][fieldname];

            //if the foreign key has changed, propagate the change:
            if (v_new !== v_old) {
              //regular index
              delete(index[v_old][pk]);
              if (!(v_new in index)) {
                index[v_new] = {};
              }

              index[v_new][pk] = null;
            }
          }

          for (fieldname in  range_indexes) {
            index = range_indexes[fieldname].index;
            index_info = range_indexes[fieldname].info;
            v_new = objs[pk][fieldname];
            v_old = this.o[type_name][pk][fieldname];

            //if the foreign key has changed, propagate the change:
            if (v_new !== v_old) {
              //will the new val end up affecting the bin ?
              newbin = Math.floor(v_new / index_info.width);
              if ((!(newbin in index)) || (!(pk in index[newbin]))) {
                oldbin = Math.floor(v_old / index_info.width);
                delete index[oldbin][pk];
                if (!(newbin in index)) {
                  index[newbin] = {};
                }

                index[newbin][pk] = v_new;
              }              else { //still, update value;
                index[oldbin][pk] = v_new;
              }
            }
          }
        } else {
          for (fieldname in  regular_indexes) {
            index = regular_indexes[fieldname];
            fk = objs[pk][fieldname];
            if (!(fk in index)) {
              index[fk] = {};
            }

            index[fk][pk] = null;
          }

          for (fieldname in  range_indexes) {
            index = range_indexes[fieldname].index;
            index_info = range_indexes[fieldname].info;
            fk = objs[pk][fieldname];
            newbin = Math.floor(fk / index_info.width);
            if (!(newbin in index)) {
              index[newbin] = {};
            }

            index[newbin][pk] = fk;
          }
        }

        this.o[type_name][pk] = objs[pk];
      }

      var obs;
      for (var i in this.observers) {
        obs = self.observers[i];
        if (type_name in obs.p) {
          obs.o.update('add', { diff: objs }, type_name);
        }
      }
    } else {
      console.error(type_name, ' not found in schema: ', self.schema);
    }
  };

  GLOB.models.Store.prototype.remove = function (type_name, pkeys) {
    /*
       pkeys can either be
       - in integer (i.e. the primary key of a single object to remove)
       - dictionary of integer keys (values are disregarded): in this case, we only issue 1 notification to the observers (for performance), once all the objects have been removed.
    */
    var self = this;
    var ids = {};
    if (typeof (pkeys) === 'object') {
      ids = pkeys;
    } else {
      ids[pkeys] = null;
    }

    var id = null;
    var objs_deleted = {}, index, val, index_info;
    var bin; //for range index
    for (id in ids) {
      if ((type_name in this.o) && (id in this.o[type_name])) {
        objs_deleted[id] = this.o[type_name][id];
        var all_indexes = self.__get_indexes(type_name);
        var regular_indexes = all_indexes[0];
        var range_indexes = all_indexes[1];
        for (var fieldname in regular_indexes) {
          index = regular_indexes[fieldname];
          val = this.o[type_name][id][fieldname];
          delete(index[val][id]);
        }

        for (fieldname in range_indexes) {
          index = range_indexes[fieldname].index;
          index_info = range_indexes[fieldname].info;
          val = this.o[type_name][id][fieldname];
          bin =  Math.floor(val / index_info.width);
          delete(index[bin][id]);
        }

        delete(this.o[type_name][id]);
      }

      var did_delete = false;
      for (var i in objs_deleted) {
        did_delete = true;
        break;
      }

      if (did_delete) {
        var obs;
        for (i in this.observers) {
          obs = self.observers[i];
          if (type_name in obs.p) {
            obs.o.update('remove', { diff: objs_deleted }, type_name);
          }
        }
      }
    }
  };

  GLOB.models.Store.prototype.__dropIndexes = function (type_name) {
    var self = this;
    var tabledef = self.schema[type_name];
    var ref, i, j, refs;
    if ('references' in tabledef) {
      for (i in tabledef.references) {
        ref =  tabledef.references[i];
        if (ref in self.indexes && type_name in self.indexes[ref]) {
          delete self.indexes[ref][type_name];
        }
      }
    }

    if ('__ref' in tabledef) {
      for (i in tabledef.__ref) {
        refs =  tabledef.__ref[i];
        for (ref in refs) {
          if (ref in self.indexes && type_name in self.indexes[ref]) {
            delete self.indexes[ref][type_name];
          }
        }
      }
    }
  };

  /**
   * Constructs an index
   * ex: table:"location", o:"comment", fieldname:"id_location", which assumes that
   * this.schema.comment.references.id_location = "location";
   *
   * or for just building a lookup table on a field that's not a foreign key:
   * table should be of the form "__"+fieldname:
   * table: __page, o: "comment", fieldname: "page"
   *
   * note: to perform a range search, use a rangeIndex constructed with _addRangeIndex
   */
  GLOB.models.Store.prototype.__addIndex = function (table, o, fieldname) {
    var self = this;

    // '__..." is a reserved family of tablenames so we can add indexes on fields that aren't references.

    if (table.substring(0, 2) !== '__' && ((!(table in self.o)) || (!(o in self.o)))) {
      throw new Error('missing table, args=' + table + ', ' + o);
    }

    if (table.substring(0, 2) === '__') {
      if (!('__ref' in self.schema[o])) {
        self.schema[o].__ref = {};
      }

      if (!(self.schema[o].__ref[fieldname])) {
        self.schema[o].__ref[fieldname] = {};
      }

      self.schema[o].__ref[fieldname][table] = null;
    }

    if (!(table in self.indexes)) {
      self.indexes[table] = {};
    }

    if (!(o in self.indexes[table])) {
      self.indexes[table][o] = {};
    }

    var objects =  self.o[o];
    for (var i in objects) {
      var key = objects[i][fieldname];
      if (!(key in self.indexes[table][o])) {
        self.indexes[table][o][key] = {};
      }

      self.indexes[table][o][key][i] = null;
    }
  };

  /**
   * Same as add index except that this one is used to perform lookups with a range of keys
   *
   */
  GLOB.models.Store.prototype.__addRangeIndex = function (table, o, fieldname, width) {
    var self = this;

    if (!('__ref' in self.schema[o])) {
      self.schema[o].__ref = {};
    }

    if (!(self.schema[o].__ref[fieldname])) {
      self.schema[o].__ref[fieldname] = {};
    }

    self.schema[o].__ref[fieldname][table] = null;

    if (!(table in self.indexes)) {
      self.indexes[table] = {};
    }

    if (!(o in self.indexes[table])) {
      self.indexes[table][o] = {};
    }

    var key, i, bin;
    var objects =  self.o[o];
    for (i in objects) {
      key = objects[i][fieldname];
      bin = Math.floor(key / width);
      if (!(bin in self.indexes[table][o])) {
        self.indexes[table][o][bin] = {};
      }

      self.indexes[table][o][bin][i] = key;
    }

    self.rangeindex_info[table] = { fieldname: fieldname, width: width };
  };

  GLOB.models.QuerySet = function (model, type) {
    this.model = model;
    this.type = type;
    this.__length = null;
    this.items = {};
  };

  GLOB.models.QuerySet.prototype.is_empty = function () {
    var items = this.items;
    for (var i in items) {
      return false;
    }

    return true;
  };

  GLOB.models.QuerySet.prototype.length = function () {
    if (this.__length !== null) { //speedup if gets called multiple times
      return this.__length;
    }

    var l = 0;
    var items = this.items;
    for (var i in items) {
      l++;
    }

    this.__length = l;
    return l;
  };

  GLOB.models.QuerySet.prototype.sort = function (sortfct) {
    //returns an array of sorted objects.
    var output = [];
    var items = this.items;
    for (var i in items) {
      output.push(items[i]);
    }

    output.sort(sortfct);
    return output;
  };

  GLOB.models.QuerySet.prototype.min = function (attr) {
    // returns pk of record which has the min value for attr
    var x = Number.POSITIVE_INFINITY;
    var items = this.items;
    var output = null;
    for (var i in items) {
      if (items[i][attr] < x) {
        x = items[i][attr];
        output = i;
      }
    }

    return output;
  };

  GLOB.models.QuerySet.prototype.max = function (attr) {
    // returns pk of record which has the max value for attr
    var x = Number.NEGATIVE_INFINITY;
    var output = null;
    var items = this.items;
    for (var i in items) {
      if (items[i][attr] > x) {
        x = items[i][attr];
        output = i;
      }
    }

    return output;
  };

  GLOB.models.QuerySet.prototype.first = function () {
    /*caution: this doesn't imply any order: it just picks the 1st record it finds*/
    var output = null;
    var items = this.items;
    for (var i in items) {
      return items[i];
    }

    return null;
  };

  GLOB.models.QuerySet.prototype.values = function (fieldname) {
    var output = {};
    var items = this.items;
    for (var i in items) {
      output[items[i][fieldname]] = null;
    }

    return output;
  };

  GLOB.models.QuerySet.prototype.intersect = function (ids, field) {
    /**
     *  ids: a dictionary (only keys matter, not values), or just a single value
     */    
    var model = this.model,
    output = new GLOB.models.QuerySet(this.model, this.type),
    items = this.items,
    new_items = output.items,
    i;

    if (!(ids instanceof Object)) {
      var new_ids = {};
      new_ids[ids] = null;
      ids = new_ids;
    }

    if (field !== undefined) {
      for (i in items) {
        if (items[i][field] in ids) {
          new_items[i] = items[i];
        }
      }
    } else {
      for (i in items) {
        if (i in ids) {
          new_items[i] = items[i];
        }
      }
    }

    return output;
  };

  GLOB.models.QuerySet.prototype.exclude = function (where) {
    /** Exclude records from a QuerySet
     * - This method alters the QuerySet
     * - The where clauses are ANDed. For instance o.exclude({page:20, author_id:1} will
     *     ONLY remove the records for which (page=20 AND author_id=1). To remove all the
     *     records for which page=2 and the ones for which id_author=1, use the following:
     *     o.exclude({page:20}).exclude({id_author: 1};
     * - Arguments:
     *        - where: a key, value mapping, where key is the name of a field
     *          and value is the value to exclude.
     */
    var model = this.model;
    var i = null;
    var ref;
    var references = model.schema[this.type].references || {};
    var from = this.type;
    var o = {};
    var o_old = null;
    for (i in where) {
      ref = i in references ?  references[i] : '__' + i;
      if ((!(ref in model.indexes)) || (!(from in model.indexes[ref]))) {
        model.__addIndex(ref, from, i);
      }

      o = model.indexes[ref][from][where[i]] || {};
      o = GLOB.models.__intersect(o_old, o);
      o_old = o;
    }

    if (i == null) { //there was no where clause: return all objects
      o = this.o[from];
    }

    //Now remove objects that have an id in o:
    var items = this.items;
    var n_removed = 0;
    for (i in o) {
      delete items[i];
      n_removed++;
    }

    if (this.__length !== null) { //update length if already computed
      this.__length -= n_removed;
    }

    return this;
  };

  GLOB.models.__intersect = function (o1, o2) {
    if (o1 == null) { return o2 || {};}

    if (o2 == null) {   return o1 || {};}

    var o = {};
    for (var i in o1) {
      if (i in o2) {o[i] = null;}
    }

    return o;
  };

  GLOB.models.Store.prototype.get = function (from, where) {
    var self = this;
    var o_old = null;
    var o = {};
    var output = new GLOB.models.QuerySet(self, from);
    var f = this;
    var ref;
    var references = {};
    var i = null;
    var r = /(.*)__in$/; //for range querying
    var matches, v, width, bin, idx;

    if (self.schema[from] && self.schema[from].references) {
      references = self.schema[from].references;
    }

    for (i in where) {
      matches = r.exec(i);
      if (matches !== null) { //range query
        v = (where[i][0] + where[i][1]) >> 1; //half-point.
        width = where[i][1] - where[i][0];
        ref = '__' + i + width;
        if (!(ref in self.indexes)) {
          self.__addRangeIndex(ref, from, matches[1], width);
        }

        o = {};
        var bins = [Math.floor(where[i][0] / width), Math.floor(where[i][1] / width)];
        for (var b = 0; b < bins.length; b++) {
          bin = bins[b];
          idx = self.indexes[ref][from][bin];
          for (var oid in idx) {
            if (idx[oid] >= where[i][0] && idx[oid] <= where[i][1]) {
              o[oid] = null;
            }
          }
        }

      }      else {
        v = where[i];
        ref = i in references ?  references[i] : '__' + i;
        if ((!(ref in self.indexes)) || (!(from in self.indexes[ref]))) {
          self.__addIndex(ref, from, i);
        }

        o =  self.indexes[ref][from][v] || {};
      }

      o = GLOB.models.__intersect(o_old, o);
      o_old = o;
    }

    if (i == null) { //there was no where clause: return all objects
      o = self.o[from];
    }

    //we now have a list of IDs in o. Just need to attach the objects:
    var items = output.items;
    for (i in o) {
      items[i] = self.o[from][i];
    }

    return output;
  };
})(NB);
