/*==================================================
 *  Exhibit.HeadlessFacet
 *==================================================
 Author 
 Sacha Zyto <sacha@csail.mit.edu> (based on list-facet.js which is part of Exhibit)

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
function define_headless_facet(){
    Exhibit.HeadlessFacet = function(containerElmt, uiContext) {
    this._div = containerElmt;
    this._uiContext = uiContext;
    this._colorCoder = null;
    
    this._expression = null;
    this._valueSet = new Exhibit.Set();
    this._selectMissing = false;

    this._delayedUpdateItems = null;
    
    this._settings = {};
    this._dom = null;
    };

    Exhibit.HeadlessFacet._settingSpecs = {
    "facetLabel":       { type: "text" },
    "fixedOrder":       { type: "text" },
    "sortMode":         { type: "text", defaultValue: "value" },
    "sortDirection":    { type: "text", defaultValue: "forward" },
    "showMissing":      { type: "boolean", defaultValue: true },
    "missingLabel":     { type: "text" },
    "scroll":           { type: "boolean", defaultValue: true },
    "height":           { type: "text" },
    "colorCoder":       { type: "text", defaultValue: null },
    "collapsible":      { type: "boolean", defaultValue: false },
    "collapsed":        { type: "boolean", defaultValue: false },
    "formatter":        { type: "text", defaultValue: null}
    };

    Exhibit.HeadlessFacet.create = function(configuration, containerElmt, uiContext) {
    var uiContext = Exhibit.UIContext.create(configuration, uiContext);
    var facet = new Exhibit.HeadlessFacet(containerElmt, uiContext);
    
    Exhibit.HeadlessFacet._configure(facet, configuration);
    
    facet._initializeUI();
    uiContext.getCollection().addFacet(facet);
    
    return facet;
    };

    Exhibit.HeadlessFacet.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration = Exhibit.getConfigurationFromDOM(configElmt);
    var uiContext = Exhibit.UIContext.createFromDOM(configElmt, uiContext);
    var facet = new Exhibit.HeadlessFacet(
                          containerElmt != null ? containerElmt : configElmt, 
                          uiContext
                          );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(configElmt, Exhibit.HeadlessFacet._settingSpecs, facet._settings);
    
    try {
        var expressionString = Exhibit.getAttribute(configElmt, "expression");
        if (expressionString != null && expressionString.length > 0) {
        facet._expression = Exhibit.ExpressionParser.parse(expressionString);
        }
        
        var selection = Exhibit.getAttribute(configElmt, "selection", ";");
        if (selection != null && selection.length > 0) {
        for (var i = 0, s; s = selection[i]; i++) {
            facet._valueSet.add(s);
        }
        }
        
        var selectMissing = Exhibit.getAttribute(configElmt, "selectMissing");
        if (selectMissing != null && selectMissing.length > 0) {
        facet._selectMissing = (selectMissing === "true");
        }
    } catch (e) {
        SimileAjax.Debug.exception(e, "HeadlessFacet: Error processing configuration of list facet");
    }
    Exhibit.HeadlessFacet._configure(facet, configuration);
    
    facet._initializeUI();
    uiContext.getCollection().addFacet(facet);
    
    return facet;
    };

    Exhibit.HeadlessFacet._configure = function(facet, configuration) {
    Exhibit.SettingsUtilities.collectSettings(configuration, Exhibit.HeadlessFacet._settingSpecs, facet._settings);
    
    if ("expression" in configuration) {
        facet._expression = Exhibit.ExpressionParser.parse(configuration.expression);
    }
    if ("selection" in configuration) {
        var selection = configuration.selection;
        for (var i = 0; i < selection.length; i++) {
        facet._valueSet.add(selection[i]);
        }
    }
    if ("selectMissing" in configuration) {
        facet._selectMissing = configuration.selectMissing;
    }
    
    if (!("facetLabel" in facet._settings)) {
        facet._settings.facetLabel = "missing ex:facetLabel";
        if (facet._expression != null && facet._expression.isPath()) {
        var segment = facet._expression.getPath().getLastSegment();
        var property = facet._uiContext.getDatabase().getProperty(segment.property);
        if (property != null) {
            facet._settings.facetLabel = segment.forward ? property.getLabel() : property.getReverseLabel();
        }
        }
    }
    if ("fixedOrder" in facet._settings) {
        var values = facet._settings.fixedOrder.split(";");
        var orderMap = {};
        for (var i = 0; i < values.length; i++) {
        orderMap[values[i].trim()] = i;
        }
        
        facet._orderMap = orderMap;
    }
    
    if ("colorCoder" in facet._settings) {
        facet._colorCoder = facet._uiContext.getExhibit().getComponent(facet._settings.colorCoder);
    }
    
    if (facet._settings.collapsed) {
        facet._settings.collapsible = true;
    }
    
    if ("formatter" in facet._settings) {
        var formatter = facet._settings.formatter;
        if (formatter != null && formatter.length > 0) {
        try {
            facet._formatter = eval(formatter);
        } catch (e) {
            SimileAjax.Debug.log(e);
        }
        }
    }
    
    facet._cache = new Exhibit.FacetUtilities.Cache(
                            facet._uiContext.getDatabase(),
                            facet._uiContext.getCollection(),
                            facet._expression
                            );
    }

    Exhibit.HeadlessFacet.prototype.dispose = function() {
    this._cache.dispose();
    this._cache = null;
    
    this._uiContext.getCollection().removeFacet(this);
    this._uiContext = null;
    this._colorCoder = null;
    
    this._div.innerHTML = "";
    this._div = null;
    this._dom = null;
    
    this._expression = null;
    this._valueSet = null;
    this._settings = null;
    };

    Exhibit.HeadlessFacet.prototype.hasRestrictions = function() {
    return this._valueSet.size() > 0 || this._selectMissing;
    };

    Exhibit.HeadlessFacet.prototype.clearAllRestrictions = function(do_batch) {
    //SACHA: do_batch is an optimization so that we don't update notify the collection. Typically set to true when we know we'll be applying more filtering before the next render. 
    var restrictions = { selection: [], selectMissing: false };
    if (this.hasRestrictions()) {
        this._valueSet.visit(function(v) {
            restrictions.selection.push(v);
        });
        this._valueSet = new Exhibit.Set();
        
        restrictions.selectMissing = this._selectMissing;
        this._selectMissing = false;
        
        if (do_batch){
        this._notifyCollection();
        }
    }
    return restrictions;
    };

    Exhibit.HeadlessFacet.prototype.applyRestrictions = function(restrictions, do_batch) {
    this._valueSet = new Exhibit.Set();
    for (var i = 0; i < restrictions.selection.length; i++) {
        this._valueSet.add(restrictions.selection[i]);
    }
    this._selectMissing = restrictions.selectMissing;
    
    if (!(do_batch)){
        this._notifyCollection();
    }
    };

    Exhibit.HeadlessFacet.prototype.setSelection = function(value, selected) {
    if (selected) {
        this._valueSet.add(value);
    } else {
        this._valueSet.remove(value);
    }
    this._notifyCollection();
    }

    Exhibit.HeadlessFacet.prototype.setSelectMissing = function(selected) {
    if (selected != this._selectMissing) {
        this._selectMissing = selected;
        this._notifyCollection();
    }
    }

    Exhibit.HeadlessFacet.prototype.restrict = function(items) {
    if (this._valueSet.size() === 0 && !this._selectMissing) {
        return items;
    }
    
    var set = this._cache.getItemsFromValues(this._valueSet, items);
    if (this._selectMissing) {
        this._cache.getItemsMissingValue(items, set);
    }
    
    return set;
    };

    Exhibit.HeadlessFacet.prototype.onUncollapse = function() {
    if (this._delayedUpdateItems != null) {
        //        this.update(this._delayedUpdateItems);
        this._delayedUpdateItems = null;
    }
    }

    Exhibit.HeadlessFacet.prototype.update = function(items) {};

    Exhibit.HeadlessFacet.prototype._notifyCollection = function() {
    this._uiContext.getCollection().onFacetUpdated(this);
    };

    Exhibit.HeadlessFacet.prototype._initializeUI = function() {
    var self = this;
    this._dom = $("<div/>")[0];
    };

    Exhibit.HeadlessFacet.prototype._filter = function(value, label, selectOnly, do_batch) {
    var self = this;
    var selected, select;
    var oldValues = new Exhibit.Set(this._valueSet);
    var oldSelectMissing = this._selectMissing;
    var newValues;
    var newSelectMissing;
    var actionLabel;
    var wasSelected;
    var wasOnlyThingSelected;
    
    if (value === null) { // the (missing this field) case
        wasSelected = oldSelectMissing;
        wasOnlyThingSelected = wasSelected && (oldValues.size() === 0);
        
        if (selectOnly) {
        if (oldValues.size() === 0) {
            newSelectMissing = !oldSelectMissing;
        } else {
            newSelectMissing = true;
        }
        newValues = new Exhibit.Set();
        } else {
        newSelectMissing = !oldSelectMissing;
        newValues = new Exhibit.Set(oldValues);
        }
    } else {
        wasSelected = oldValues.contains(value);
        wasOnlyThingSelected = wasSelected && (oldValues.size() === 1) && !oldSelectMissing;
        
        if (selectOnly) {
        newSelectMissing = false;
        newValues = new Exhibit.Set();
            
        if (!oldValues.contains(value)) {
            newValues.add(value);
        } else if (oldValues.size() > 1 || oldSelectMissing) {
            newValues.add(value);
        }
        } else {
        newSelectMissing = oldSelectMissing;
        newValues = new Exhibit.Set(oldValues);
        if (newValues.contains(value)) {
            newValues.remove(value);
        } else {
            newValues.add(value);
        }
        }
    }
    self.applyRestrictions({ selection: newValues.toArray(), selectMissing: newSelectMissing }, do_batch);
  
    };

    Exhibit.HeadlessFacet.prototype._clearSelections = function() {
    var state = {};
    var self = this;
    self.clearAllRestrictions();
  
    };

    Exhibit.HeadlessFacet.prototype._createSortFunction = function(valueType) {
    var sortValueFunction = function(a, b) { return a.selectionLabel.localeCompare(b.selectionLabel); };
    if ("_orderMap" in this) {
        var orderMap = this._orderMap;
        
        sortValueFunction = function(a, b) {
        if (a.selectionLabel in orderMap) {
            if (b.selectionLabel in orderMap) {
            return orderMap[a.selectionLabel] - orderMap[b.selectionLabel];
            } else {
            return -1;
            }
        } else if (b.selectionLabel in orderMap) {
            return 1;
        } else {
            return a.selectionLabel.localeCompare(b.selectionLabel);
        }
        }
    } else if (valueType === "number") {
        sortValueFunction = function(a, b) {
        a = parseFloat(a.value);
        b = parseFloat(b.value);
        return a < b ? -1 : a > b ? 1 : 0;
        }
    }
    
    var sortFunction = sortValueFunction;
    if (this._settings.sortMode === "count") {
        sortFunction = function(a, b) {
        var c = b.count - a.count;
        return c != 0 ? c : sortValueFunction(a, b);
        }
    }

    var sortDirectionFunction = sortFunction;
    if (this._settings.sortDirection === "reverse"){
        sortDirectionFunction = function(a, b) {
        return sortFunction(b, a);
        }
    }
    
    return sortDirectionFunction;
    }

    Exhibit.HeadlessFacet.prototype.exportFacetSelection = function() { 
    var s = []; 
    this._valueSet.visit(function(v) { 
        s.push(v); 
        }); 
    if (s.length > 0) {
        return s.join(',');  
    }
    }; 
 
    Exhibit.HeadlessFacet.prototype.importFacetSelection = function(settings) { 
    var self = this; 
   
    self.applyRestrictions({ selection: settings.split(','), selectMissing: self._selectMissing }); 
    }
};