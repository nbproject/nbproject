/*global NB:true NB$:true $:true rangy:true alert:true wgxpath:true jQuery:true getElementCSSSelector:true console:true */
(function(GLOB){
    
    if ("NB$" in window){
        var $ = NB$;
    }

    var $str        = "NB$" in window ? "NB$" : "jQuery";
    var cssApplier = null;
    var lastClicked = {set: [], clicked: null};

    var restore = function(loc) {
        var sel = rangy.getSelection();
        sel.restoreCharacterRanges(getElementsByXPath(document, loc.path1)[0], 
                                   [{backward: loc.path2 === "true",
                                               characterRange: {
                                               start: loc.offset1,
                                               end: loc.offset2
                                           }
                                       }]);
        placeAnnotation(sel, loc);
    };

    var restoreBatch = function(object, callback) {
        var start = (new Date()).getTime();
        var current;

        for (var key in object) {
            current = (new Date()).getTime();
            if (current - start > 150) {
                window.setTimeout(restoreBatch, 10, object, callback);
                return;
            }

            restore(object[key]);
            delete object[key];
        }

        callback();
    };

    GLOB.html = {
        id: "docviewHtml5"
    };

    GLOB.html.init = function () {

        var countChildChars = function(_char, _this) {
            var char = _char;

            // count text nodes as well (includes whitespace)
            $(_this).contents().each(function() {
                  if (this.nodeType === 1) {
                      $(this).attr("data_char", char);
                      countChildChars(char, this);
                  }
                  char += ($(this).text()).length;
            });
        };

        countChildChars(0, $("body")[0]);

        $.concierge.addListeners(GLOB.html,{
                page: function(evt){
                   // _render();
                }, 
                note_hover: function(event){
                    $(".nb-comment-highlight[id_item="+event.value+"]").addClass("hovered");
                }, 
                note_out: function(event){
                    $(".nb-comment-highlight[id_item="+event.value+"]").removeClass("hovered");
                }, 
                visibility: function(event){
                    console.warn("TODO", event);
                },
                select_thread: function(event){
                    $(".nb-comment-highlight.selected").removeClass("selected");
                    $(".nb-comment-highlight[id_item="+event.value+"]").addClass("selected");

                    var viewTop = $(window).scrollTop();
                    var viewBottom = viewTop + $(window).height() * 0.9;
                    var elementTop = $(".nb-comment-highlight[id_item="+event.value+"]").offset().top;

                    if (viewTop > elementTop || viewBottom < elementTop) {

                        $("body, html").animate({scrollTop: $(".nb-comment-highlight[id_item="+event.value+"]").offset().top - $(window).height() / 4});
                     }
                }
            }, 
            GLOB.html.id);

        rangy.init();

        // Wrap elements with nb-comment-fresh which is then selected by jQuery and operated on properly;
        // the styled element must have an nb-comment-highlight class.
        cssApplier = rangy.createCssClassApplier("nb-comment-fresh", { normalize: true });

        // Make sure concierge won't steal our keys!
        $.concierge.keydown_block = false;

        // Global key-down monitor
        $(document).keydown(function(event) {
            // If there are no current drafts, we don't interfere.
            if ($(".nb-placeholder").length === 0) {
                return true;
            }

            // If we are currently interacting with an input, button, or textarea, we don't interfere.
            if (document.activeElement.nodeType === "INPUT" ||
                document.activeElement.nodeType === "BUTTON" ||
                document.activeElement.nodeType === "TEXTAREA") {
                return true;
            }

            // If certain key combinations are being pressed, do not interfere.
            if (event.altKey === true || event.ctrlKey === true) {
                return true;
            }

            // If the key is an escape, we discard the draft if it is empty
            if (event.keyCode === 27) {
                $.concierge.trigger({ type: "discard_if_empty", value: {}});
                return true;
            }

            // If the key is not a chracter, do not interfere.
            if (event.keyCode < 48 ||
               (event.keyCode > 90 && event.keyCoe < 96) ||
               (event.keyCode > 111 && event.keyCode < 186)) {
                return true;
            }

            // Keypress only has characters pressed, so we do not neet check for
            // arrow keys, or CTRL+C and other combinations
            $.concierge.trigger({ type: "focus_thread", value: {}});

        });

        // Initialize Highlighting Event
        $("body>*").not(".nb_sidebar").mouseup(function (event) {
                var sel = rangy.getSelection();

                if (sel.isCollapsed){
                    $.concierge.trigger({ type: "discard_if_empty", value: {}});
                    return;
                }

                if (sel.containsNode($(".nb_sidebar")[0], true)) {
                    $.concierge.trigger({ type: "discard_if_empty", value: {}});
                    return;
                }

                // must call before applyToRanges, otherwise sel is gone
                var element = event.target;

                if ($(element).hasClass("nb-comment-highlight")) {
                    element = ($(element).parents("*:not(.nb-comment-highlight)"))[0];
                }

                var range = sel.saveCharacterRanges(element);

                var target = getElementXPath(element);

                insertPlaceholderAnnotation(sel);

                if ( $(element).attr("data_char") === undefined) {
                    // we have a problem
                    $.L("Error: target does not have data_char attribute", element);
                }

                $.concierge.trigger({
                    type: "new_thread",
                    value: {
                        html5range:{
                            path1: target,
                            path2: range[0].backward,
                            offset1: range[0].characterRange.start, 
                            offset2: range[0].characterRange.end,
                            apparent_height: parseInt($(element).attr("data_char"), 10) +
                                Math.min(range[0].characterRange.start, range[0].characterRange.end)
                        },
                        suppressFocus: true
                    }
                });

                sel.restoreCharacterRanges(element, range);

            });

        GLOB.pers.store.register({
            update: function (action, payload, items_fieldname) {
                var key;

                if (items_fieldname === "draft") {
                    var draft;
                    for (draft in payload.diff) { break; }

                    if (action === "remove") {
                        $(".nb-comment-highlight.nb-placeholder[id_item=" + draft + "]").contents().unwrap();
                    } else if (action === "add") {
                        $(".nb-comment-highlight.nb-placeholder").attr("id_item", draft);
                    }

                }

                if (action === "remove" && items_fieldname === "location") {
                    for (key in payload.diff) {
                        $(".nb-comment-highlight[id_item=" + key + "]").contents().unwrap();
                    }
                }

                if (action === "add" && items_fieldname === "html5location") {
                    restoreBatch($.extend(true, {}, payload.diff), function(){ });
                }

        }}, {html5location: null, draft: null, location: null});

        // fix IE XPath implementation
        wgxpath.install();

    };

    // must be called only on inner-most element
    var hasConflicts = function (element) {
        return ($(element).parents(".nb-comment-highlight").length > 0);
    };

    // TODO: refactor such that there is more code re-use between placeAnnotation
    // on the one hand, and insert/activatePlaceholderAnnotation on the other.
    var placeAnnotation = function (selection, loc) {
        var uid = loc.id_location;

        // quit if annotation already placed
        if ($(".nb-comment-highlight[id_item=" + uid + "]").length > 0) {
            return;
        }

        // apply nb-comment-fresh to ranges
        cssApplier.applyToSelection(selection);
        selection.removeAllRanges();

        // jQuery Treatment
        $("span.nb-comment-fresh.nb-comment-highlight").removeClass("nb-comment-fresh").wrapInner('<span class="nb-comment-fresh" />');
        $("span.nb-comment-fresh")
            .addClass("nb-comment-highlight")
            .removeClass("nb-comment-fresh")
            .attr("id_item", uid)
            .hover(
                function(){$.concierge.trigger({type:"note_hover", value: uid});},
                function(){$.concierge.trigger({type:"note_out", value: uid});})
            .click(
                function (event) {
                    if (!rangy.getSelection().isCollapsed){ return;}

                    if (hasConflicts(this)) {
                        var ids = [];
                        var id = 0;

                        ids.push($(this).attr("id_item"));

                        $(this).parents(".nb-comment-highlight").each(function () {
                                ids.push($(this).attr("id_item"));
                        });

                        if ($(lastClicked.set).not(ids).length === 0 && $(ids).not(lastClicked.set).length === 0) {
                            for (id = 0; id < ids.length; id++) {
                                if (ids[id] === lastClicked.clicked) { break; }
                            }
                            id = (id + 1) % ids.length;
                        }

                        $.concierge.trigger({type:"select_thread", value: ids[id]});
                        lastClicked = {set: ids, clicked: ids[id]};

                    } else {
                        $.concierge.trigger({type:"select_thread", value: uid});
                        lastClicked = {set: [uid], clicked: uid};
                    }
                    event.stopPropagation();
            });
    };

    var insertPlaceholderAnnotation = function (selection) {
        // apply nb-comment-fresh to ranges
        cssApplier.applyToSelection(selection);
        selection.removeAllRanges();

        // jQuery Treatment
        $("span.nb-comment-fresh.nb-comment-highlight").removeClass("nb-comment-fresh").wrapInner('<span class="nb-comment-fresh" />');
        $("span.nb-comment-fresh")
            .addClass("nb-comment-highlight")
            .addClass("nb-placeholder")
            .removeClass("nb-comment-fresh")
            .attr("id_item", 0);

        // remove placeholder comment after 0.25 seconds if we do not receive a "draft created" event (i.e. the concierge
        // did not allow the creation of the draft). We check this by seeing if id_item is still 0.
        window.setTimeout(function() {
            $(".nb-placeholder[id_item=0]").contents().unwrap();
        }, 250);
    };

    GLOB.html.clearAnnotations = function () {
        $(".nb-comment-highlight").contents().unwrap();
    };

    var trim = function (text) {
        return text.replace(/^\s*|\s*$/g, "");
    };

    var trimLeft = function (text) {
        return text.replace(/^\s+/, "");
    };

    var trimRight = function (text) {
        return text.replace(/\s+$/, "");
    };

    // ************************************************************************************************
    // XPath

    /**
     * Gets an XPath for an element which describes its hierarchical location.
     */
    var getElementXPath = function (element) {
        if (element && element.id){
            return '//*[@id="' + element.id + '"]';
        }
        else{
            return getElementTreeXPath(element);
        }
    };

    var getElementTreeXPath = function (element) {
        var paths = [];

        // Use nodeName (instead of localName) so namespace prefix is included (if any).
        for (; element && element.nodeType === 1; element = element.parentNode) {
            var index = 0;
            for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                // Ignore document type declaration.
                if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE){
                    continue;
                }

                if (sibling.nodeName === element.nodeName){
                    ++index;
                }
            }

            var tagName = element.nodeName.toLowerCase();
            var pathIndex = (index ? "[" + (index + 1) + "]" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }

        return paths.length ? "/" + paths.join("/") : null;
    };

    var getElementCSSPath = function (element) {
        var paths = [];

        for (; element && element.nodeType === 1; element = element.parentNode) {
            var selector = getElementCSSSelector(element);
            paths.splice(0, 0, selector);
        }

        return paths.length ? paths.join(" ") : null;
    };
    
    var cssToXPath = function (rule) {
        var regElement = /^([#.]?)([a-z0-9\\*_\-]*)((\|)([a-z0-9\\*_\-]*))?/i;
        var regAttr1 = /^\[([^\]]*)\]/i;
        var regAttr2 = /^\[\s*([^~=\s]+)\s*(~?=)\s*"([^"]+)"\s*\]/i; //";
    var regPseudo = /^:([a-z_\-])+/i;
    var regCombinator = /^(\s*[>+\s])?/i;
    var regComma = /^\s*,/i;

    var index = 1;
    var parts = ["//", "*"];
    var lastRule = null;

    while (rule.length && rule !== lastRule) {
        lastRule = rule;

        // Trim leading whitespace
        rule = trim(rule);
        if (!rule.length){
            break;}

        // Match the element identifier
        var m = regElement.exec(rule);
        if (m) {
            if (!m[1]) {
                // XXXjoe Namespace ignored for now
                if (m[5]){
                    parts[index] = m[5];}
                else{
                    parts[index] = m[2];}
            }
            else if (m[1] === '#'){
                parts.push("[@id='" + m[2] + "']");}
            else if (m[1] === '.'){
                parts.push("[contains(concat(' ',normalize-space(@class),' '), ' " + m[2] + " ')]");
            }
            rule = rule.substr(m[0].length);
        }

        // Match attribute selectors
        m = regAttr2.exec(rule);
        if (m) {
            if (m[2] === "~="){
                parts.push("[contains(@" + m[1] + ", '" + m[3] + "')]");}
            else{
                parts.push("[@" + m[1] + "='" + m[3] + "']");
            }
            rule = rule.substr(m[0].length);
        }
        else {
            m = regAttr1.exec(rule);
            if (m) {
                parts.push("[@" + m[1] + "]");
                rule = rule.substr(m[0].length);
            }
        }

        // Skip over pseudo-classes and pseudo-elements, which are of no use to us
        m = regPseudo.exec(rule);
        while (m) {
            rule = rule.substr(m[0].length);
            m = regPseudo.exec(rule);
        }

        // Match combinators
        m = regCombinator.exec(rule);
        if (m && m[0].length) {
            if (m[0].indexOf(">") !== -1){
                parts.push("/");}
            else if (m[0].indexOf("+") !== -1){
                parts.push("/following-sibling::");}
            else{
                parts.push("//");
            }
            index = parts.length;
            parts.push("*");
            rule = rule.substr(m[0].length);
        }

        m = regComma.exec(rule);
        if (m) {
            parts.push(" | ", "//", "*");
            index = parts.length - 1;
            rule = rule.substr(m[0].length);
        }
    }

    var xpath = parts.join("");
    return xpath;
    };

var getElementsBySelector = function (doc, css) {
    var xpath = cssToXPath(css);
    return getElementsByXPath(doc, xpath);
};

var getElementsByXPath = function (doc, xpath) {
    var nodes = [];

    try {
        var result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
        for (var item = result.iterateNext() ; item; item = result.iterateNext()){
            nodes.push(item);}
    }
    catch (exc) {
        // Invalid xpath expressions make their way here sometimes.  If that happens,
        // we still want to return an empty set without an exception.
    }

    return nodes;
};

var getRuleMatchingElements = function (rule, doc) {
    var css = rule.selectorText;
    var xpath = cssToXPath(css);
    return getElementsByXPath(doc, xpath);
};

})(NB);
