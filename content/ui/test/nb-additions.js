var  NB = {};

(function(GLOB){
    
    if ("NB$" in window){
        var $ = NB$;
    }
    var $str        = "NB$" in window ? "NB$" : "jQuery";


    GLOB.comments = {};
    GLOB.html = {};
    GLOB.html.tempUid = 0;

    GLOB.html.init = function () {
        rangy.init();

        // Wrap elements with nb-comment-fresh which is then selected by jQuery and operated on properly;
        // the styled element must have an nb-comment-highlight class.
        GLOB.html.cssApplier = rangy.createCssClassApplier("nb-comment-fresh", { normalize: true });

        // Initialize Hilighting Event
        $("#content").mouseup(function (event) {
                var sel = rangy.getSelection();

                if (sel.isCollapsed) return;

                // must call before applyToRanges, otherwise sel is gone
                var element = event.target;

                if ($(element).hasClass("nb-comment-highlight")) {
                    element = ($(element).parents("*:not(.nb-comment-highlight)"))[0];
                }

                // create temporary uid
                var uid = "t-" + (GLOB.html.tempUid++).toString(16);

                GLOB.comments[uid] = { id: uid, target: GLOB.getElementXPath(element), range: sel.saveCharacterRanges(element) };

                GLOB.html.drawAnnotation(sel, uid);
            });

        // Bind window resize event to ordering
        $(window).resize(GLOB.html.recalculateOrdering);

        //Possible addition to GLOB.init:
        // fix IE XPath implementation
        wgxpath.install();
    }

    // must be called only on inner-most element
    GLOB.html.hasConflicts = function (element) {
        return ($(element).parents(".nb-comment-highlight").length > 0)
    }

    GLOB.html.drawAnnotation = function (selection, uid) {

        // apply nb-comment-fresh to ranges
        GLOB.html.cssApplier.applyToSelection(selection);
        selection.removeAllRanges();

        // jQuery Treatment
        $("span.nb-comment-fresh.nb-comment-highlight").removeClass("nb-comment-fresh").wrapInner('<span class="nb-comment-fresh" />');
        $("span.nb-comment-fresh").addClass("nb-comment-highlight").removeClass("nb-comment-fresh").attr("data-nb-ann", uid).hover(
                                                                                                                                   function () {
                                                                                                                                       $("span.nb-comment-highlight[data-nb-ann=" + uid + "]").addClass("prominent");
                                                                                                                                   },
                                                                                                                                   function () {
                                                                                                                                       $("span.nb-comment-highlight[data-nb-ann=" + uid + "]").removeClass("prominent");
                                                                                                                                   })
        .click(
               function (event) {
                   if (!rangy.getSelection().isCollapsed) return;

                   if (GLOB.html.hasConflicts(this)) {
                       var ids = {};
                       ids[$(this).attr("data-nb-ann")] = true;
                       $(this).parents(".nb-comment-highlight").each(function () {
                               ids[$(this).attr("data-nb-ann")] = true;
                           });
                       alert(JSON.stringify(ids));
                   } else {
                       alert($(this).attr("data-nb-ann"));
                   }
                   event.stopPropagation();
               });
        GLOB.comments[uid].docPosition = $("span.nb-comment-highlight[data-nb-ann=" + uid + "]").first().offset();
    };

    GLOB.html.recalculateOrdering = function () {
        for (var uid in GLOB.comments) {
            GLOB.comments[uid].docPosition = $("span.nb-comment-highlight[data-nb-ann=" + uid + "]").first().offset();
        }
    }

    GLOB.html.restoreAnnotations = function () {
        for (var uid in GLOB.comments) {
            var sel = rangy.getSelection();
            var obj = GLOB.comments[uid];
            sel.restoreCharacterRanges(GLOB.getElementsByXPath(document, obj.target)[0], obj.range);
            GLOB.html.drawAnnotation(sel, uid);
        }
    };

    GLOB.html.clearAnnotations = function () {
        $(".nb-comment-highlight").contents().unwrap();
    };

    GLOB.trim = function (text) {
        return text.replace(/^\s*|\s*$/g, "");
    }

    GLOB.trimLeft = function (text) {
        return text.replace(/^\s+/, "");
    }

    GLOB.trimRight = function (text) {
        return text.replace(/\s+$/, "");
    }

    // ************************************************************************************************
    // XPath

    /**
     * Gets an XPath for an element which describes its hierarchical location.
     */
    GLOB.getElementXPath = function (element) {
        if (element && element.id)
            return '//*[@id="' + element.id + '"]';
        else
            return GLOB.getElementTreeXPath(element);
    };

    GLOB.getElementTreeXPath = function (element) {
        var paths = [];

        // Use nodeName (instead of localName) so namespace prefix is included (if any).
        for (; element && element.nodeType == 1; element = element.parentNode) {
            var index = 0;
            for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                // Ignore document type declaration.
                if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                    continue;

                if (sibling.nodeName == element.nodeName)
                    ++index;
            }

            var tagName = element.nodeName.toLowerCase();
            var pathIndex = (index ? "[" + (index + 1) + "]" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }

        return paths.length ? "/" + paths.join("/") : null;
    };

    GLOB.getElementCSSPath = function (element) {
        var paths = [];

        for (; element && element.nodeType == 1; element = element.parentNode) {
            var selector = GLOB.getElementCSSSelector(element);
            paths.splice(0, 0, selector);
        }

        return paths.length ? paths.join(" ") : null;
    };

    GLOB.cssToXPath = function (rule) {
        var regElement = /^([#.]?)([a-z0-9\\*_-]*)((\|)([a-z0-9\\*_-]*))?/i;
        var regAttr1 = /^\[([^\]]*)\]/i;
        var regAttr2 = /^\[\s*([^~=\s]+)\s*(~?=)\s*"([^"]+)"\s*\]/i;
    var regPseudo = /^:([a-z_-])+/i;
    var regCombinator = /^(\s*[>+\s])?/i;
    var regComma = /^\s*,/i;

    var index = 1;
    var parts = ["//", "*"];
    var lastRule = null;

    while (rule.length && rule != lastRule) {
        lastRule = rule;

        // Trim leading whitespace
        rule = GLOB.trim(rule);
        if (!rule.length)
            break;

        // Match the element identifier
        var m = regElement.exec(rule);
        if (m) {
            if (!m[1]) {
                // XXXjoe Namespace ignored for now
                if (m[5])
                    parts[index] = m[5];
                else
                    parts[index] = m[2];
            }
            else if (m[1] == '#')
                parts.push("[@id='" + m[2] + "']");
            else if (m[1] == '.')
                parts.push("[contains(concat(' ',normalize-space(@class),' '), ' " + m[2] + " ')]");

            rule = rule.substr(m[0].length);
        }

        // Match attribute selectors
        m = regAttr2.exec(rule);
        if (m) {
            if (m[2] == "~=")
                parts.push("[contains(@" + m[1] + ", '" + m[3] + "')]");
            else
                parts.push("[@" + m[1] + "='" + m[3] + "']");

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
            if (m[0].indexOf(">") != -1)
                parts.push("/");
            else if (m[0].indexOf("+") != -1)
                parts.push("/following-sibling::");
            else
                parts.push("//");

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

GLOB.getElementsBySelector = function (doc, css) {
    var xpath = GLOB.cssToXPath(css);
    return GLOB.getElementsByXPath(doc, xpath);
};

GLOB.getElementsByXPath = function (doc, xpath) {
    var nodes = [];

    try {
        var result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
        for (var item = result.iterateNext() ; item; item = result.iterateNext())
            nodes.push(item);
    }
    catch (exc) {
        // Invalid xpath expressions make their way here sometimes.  If that happens,
        // we still want to return an empty set without an exception.
    }

    return nodes;
};

GLOB.getRuleMatchingElements = function (rule, doc) {
    var css = rule.selectorText;
    var xpath = GLOB.cssToXPath(css);
    return GLOB.getElementsByXPath(doc, xpath);
};

})(NB);