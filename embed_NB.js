/*! jQuery v1.8.3 jquery.com | jquery.org/license */
(function(e,t){function _(e){var t=M[e]={};return v.each(e.split(y),function(e,n){t[n]=!0}),t}function H(e,n,r){if(r===t&&e.nodeType===1){var i="data-"+n.replace(P,"-$1").toLowerCase();r=e.getAttribute(i);if(typeof r=="string"){try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:D.test(r)?v.parseJSON(r):r}catch(s){}v.data(e,n,r)}else r=t}return r}function B(e){var t;for(t in e){if(t==="data"&&v.isEmptyObject(e[t]))continue;if(t!=="toJSON")return!1}return!0}function et(){return!1}function tt(){return!0}function ut(e){return!e||!e.parentNode||e.parentNode.nodeType===11}function at(e,t){do e=e[t];while(e&&e.nodeType!==1);return e}function ft(e,t,n){t=t||0;if(v.isFunction(t))return v.grep(e,function(e,r){var i=!!t.call(e,r,e);return i===n});if(t.nodeType)return v.grep(e,function(e,r){return e===t===n});if(typeof t=="string"){var r=v.grep(e,function(e){return e.nodeType===1});if(it.test(t))return v.filter(t,r,!n);t=v.filter(t,r)}return v.grep(e,function(e,r){return v.inArray(e,t)>=0===n})}function lt(e){var t=ct.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}function Lt(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function At(e,t){if(t.nodeType!==1||!v.hasData(e))return;var n,r,i,s=v._data(e),o=v._data(t,s),u=s.events;if(u){delete o.handle,o.events={};for(n in u)for(r=0,i=u[n].length;r<i;r++)v.event.add(t,n,u[n][r])}o.data&&(o.data=v.extend({},o.data))}function Ot(e,t){var n;if(t.nodeType!==1)return;t.clearAttributes&&t.clearAttributes(),t.mergeAttributes&&t.mergeAttributes(e),n=t.nodeName.toLowerCase(),n==="object"?(t.parentNode&&(t.outerHTML=e.outerHTML),v.support.html5Clone&&e.innerHTML&&!v.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):n==="input"&&Et.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):n==="option"?t.selected=e.defaultSelected:n==="input"||n==="textarea"?t.defaultValue=e.defaultValue:n==="script"&&t.text!==e.text&&(t.text=e.text),t.removeAttribute(v.expando)}function Mt(e){return typeof e.getElementsByTagName!="undefined"?e.getElementsByTagName("*"):typeof e.querySelectorAll!="undefined"?e.querySelectorAll("*"):[]}function _t(e){Et.test(e.type)&&(e.defaultChecked=e.checked)}function Qt(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Jt.length;while(i--){t=Jt[i]+n;if(t in e)return t}return r}function Gt(e,t){return e=t||e,v.css(e,"display")==="none"||!v.contains(e.ownerDocument,e)}function Yt(e,t){var n,r,i=[],s=0,o=e.length;for(;s<o;s++){n=e[s];if(!n.style)continue;i[s]=v._data(n,"olddisplay"),t?(!i[s]&&n.style.display==="none"&&(n.style.display=""),n.style.display===""&&Gt(n)&&(i[s]=v._data(n,"olddisplay",nn(n.nodeName)))):(r=Dt(n,"display"),!i[s]&&r!=="none"&&v._data(n,"olddisplay",r))}for(s=0;s<o;s++){n=e[s];if(!n.style)continue;if(!t||n.style.display==="none"||n.style.display==="")n.style.display=t?i[s]||"":"none"}return e}function Zt(e,t,n){var r=Rt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function en(e,t,n,r){var i=n===(r?"border":"content")?4:t==="width"?1:0,s=0;for(;i<4;i+=2)n==="margin"&&(s+=v.css(e,n+$t[i],!0)),r?(n==="content"&&(s-=parseFloat(Dt(e,"padding"+$t[i]))||0),n!=="margin"&&(s-=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0)):(s+=parseFloat(Dt(e,"padding"+$t[i]))||0,n!=="padding"&&(s+=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0));return s}function tn(e,t,n){var r=t==="width"?e.offsetWidth:e.offsetHeight,i=!0,s=v.support.boxSizing&&v.css(e,"boxSizing")==="border-box";if(r<=0||r==null){r=Dt(e,t);if(r<0||r==null)r=e.style[t];if(Ut.test(r))return r;i=s&&(v.support.boxSizingReliable||r===e.style[t]),r=parseFloat(r)||0}return r+en(e,t,n||(s?"border":"content"),i)+"px"}function nn(e){if(Wt[e])return Wt[e];var t=v("<"+e+">").appendTo(i.body),n=t.css("display");t.remove();if(n==="none"||n===""){Pt=i.body.appendChild(Pt||v.extend(i.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!Ht||!Pt.createElement)Ht=(Pt.contentWindow||Pt.contentDocument).document,Ht.write("<!doctype html><html><body>"),Ht.close();t=Ht.body.appendChild(Ht.createElement(e)),n=Dt(t,"display"),i.body.removeChild(Pt)}return Wt[e]=n,n}function fn(e,t,n,r){var i;if(v.isArray(t))v.each(t,function(t,i){n||sn.test(e)?r(e,i):fn(e+"["+(typeof i=="object"?t:"")+"]",i,n,r)});else if(!n&&v.type(t)==="object")for(i in t)fn(e+"["+i+"]",t[i],n,r);else r(e,t)}function Cn(e){return function(t,n){typeof t!="string"&&(n=t,t="*");var r,i,s,o=t.toLowerCase().split(y),u=0,a=o.length;if(v.isFunction(n))for(;u<a;u++)r=o[u],s=/^\+/.test(r),s&&(r=r.substr(1)||"*"),i=e[r]=e[r]||[],i[s?"unshift":"push"](n)}}function kn(e,n,r,i,s,o){s=s||n.dataTypes[0],o=o||{},o[s]=!0;var u,a=e[s],f=0,l=a?a.length:0,c=e===Sn;for(;f<l&&(c||!u);f++)u=a[f](n,r,i),typeof u=="string"&&(!c||o[u]?u=t:(n.dataTypes.unshift(u),u=kn(e,n,r,i,u,o)));return(c||!u)&&!o["*"]&&(u=kn(e,n,r,i,"*",o)),u}function Ln(e,n){var r,i,s=v.ajaxSettings.flatOptions||{};for(r in n)n[r]!==t&&((s[r]?e:i||(i={}))[r]=n[r]);i&&v.extend(!0,e,i)}function An(e,n,r){var i,s,o,u,a=e.contents,f=e.dataTypes,l=e.responseFields;for(s in l)s in r&&(n[l[s]]=r[s]);while(f[0]==="*")f.shift(),i===t&&(i=e.mimeType||n.getResponseHeader("content-type"));if(i)for(s in a)if(a[s]&&a[s].test(i)){f.unshift(s);break}if(f[0]in r)o=f[0];else{for(s in r){if(!f[0]||e.converters[s+" "+f[0]]){o=s;break}u||(u=s)}o=o||u}if(o)return o!==f[0]&&f.unshift(o),r[o]}function On(e,t){var n,r,i,s,o=e.dataTypes.slice(),u=o[0],a={},f=0;e.dataFilter&&(t=e.dataFilter(t,e.dataType));if(o[1])for(n in e.converters)a[n.toLowerCase()]=e.converters[n];for(;i=o[++f];)if(i!=="*"){if(u!=="*"&&u!==i){n=a[u+" "+i]||a["* "+i];if(!n)for(r in a){s=r.split(" ");if(s[1]===i){n=a[u+" "+s[0]]||a["* "+s[0]];if(n){n===!0?n=a[r]:a[r]!==!0&&(i=s[0],o.splice(f--,0,i));break}}}if(n!==!0)if(n&&e["throws"])t=n(t);else try{t=n(t)}catch(l){return{state:"parsererror",error:n?l:"No conversion from "+u+" to "+i}}}u=i}return{state:"success",data:t}}function Fn(){try{return new e.XMLHttpRequest}catch(t){}}function In(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}function $n(){return setTimeout(function(){qn=t},0),qn=v.now()}function Jn(e,t){v.each(t,function(t,n){var r=(Vn[t]||[]).concat(Vn["*"]),i=0,s=r.length;for(;i<s;i++)if(r[i].call(e,t,n))return})}function Kn(e,t,n){var r,i=0,s=0,o=Xn.length,u=v.Deferred().always(function(){delete a.elem}),a=function(){var t=qn||$n(),n=Math.max(0,f.startTime+f.duration-t),r=n/f.duration||0,i=1-r,s=0,o=f.tweens.length;for(;s<o;s++)f.tweens[s].run(i);return u.notifyWith(e,[f,i,n]),i<1&&o?n:(u.resolveWith(e,[f]),!1)},f=u.promise({elem:e,props:v.extend({},t),opts:v.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:qn||$n(),duration:n.duration,tweens:[],createTween:function(t,n,r){var i=v.Tween(e,f.opts,t,n,f.opts.specialEasing[t]||f.opts.easing);return f.tweens.push(i),i},stop:function(t){var n=0,r=t?f.tweens.length:0;for(;n<r;n++)f.tweens[n].run(1);return t?u.resolveWith(e,[f,t]):u.rejectWith(e,[f,t]),this}}),l=f.props;Qn(l,f.opts.specialEasing);for(;i<o;i++){r=Xn[i].call(f,e,l,f.opts);if(r)return r}return Jn(f,l),v.isFunction(f.opts.start)&&f.opts.start.call(e,f),v.fx.timer(v.extend(a,{anim:f,queue:f.opts.queue,elem:e})),f.progress(f.opts.progress).done(f.opts.done,f.opts.complete).fail(f.opts.fail).always(f.opts.always)}function Qn(e,t){var n,r,i,s,o;for(n in e){r=v.camelCase(n),i=t[r],s=e[n],v.isArray(s)&&(i=s[1],s=e[n]=s[0]),n!==r&&(e[r]=s,delete e[n]),o=v.cssHooks[r];if(o&&"expand"in o){s=o.expand(s),delete e[r];for(n in s)n in e||(e[n]=s[n],t[n]=i)}else t[r]=i}}function Gn(e,t,n){var r,i,s,o,u,a,f,l,c,h=this,p=e.style,d={},m=[],g=e.nodeType&&Gt(e);n.queue||(l=v._queueHooks(e,"fx"),l.unqueued==null&&(l.unqueued=0,c=l.empty.fire,l.empty.fire=function(){l.unqueued||c()}),l.unqueued++,h.always(function(){h.always(function(){l.unqueued--,v.queue(e,"fx").length||l.empty.fire()})})),e.nodeType===1&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],v.css(e,"display")==="inline"&&v.css(e,"float")==="none"&&(!v.support.inlineBlockNeedsLayout||nn(e.nodeName)==="inline"?p.display="inline-block":p.zoom=1)),n.overflow&&(p.overflow="hidden",v.support.shrinkWrapBlocks||h.done(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t){s=t[r];if(Un.exec(s)){delete t[r],a=a||s==="toggle";if(s===(g?"hide":"show"))continue;m.push(r)}}o=m.length;if(o){u=v._data(e,"fxshow")||v._data(e,"fxshow",{}),"hidden"in u&&(g=u.hidden),a&&(u.hidden=!g),g?v(e).show():h.done(function(){v(e).hide()}),h.done(function(){var t;v.removeData(e,"fxshow",!0);for(t in d)v.style(e,t,d[t])});for(r=0;r<o;r++)i=m[r],f=h.createTween(i,g?u[i]:0),d[i]=u[i]||v.style(e,i),i in u||(u[i]=f.start,g&&(f.end=f.start,f.start=i==="width"||i==="height"?1:0))}}function Yn(e,t,n,r,i){return new Yn.prototype.init(e,t,n,r,i)}function Zn(e,t){var n,r={height:e},i=0;t=t?1:0;for(;i<4;i+=2-t)n=$t[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function tr(e){return v.isWindow(e)?e:e.nodeType===9?e.defaultView||e.parentWindow:!1}var n,r,i=e.document,s=e.location,o=e.navigator,u=e.jQuery,a=e.$,f=Array.prototype.push,l=Array.prototype.slice,c=Array.prototype.indexOf,h=Object.prototype.toString,p=Object.prototype.hasOwnProperty,d=String.prototype.trim,v=function(e,t){return new v.fn.init(e,t,n)},m=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,g=/\S/,y=/\s+/,b=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,w=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,E=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,S=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,T=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,N=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,C=/^-ms-/,k=/-([\da-z])/gi,L=function(e,t){return(t+"").toUpperCase()},A=function(){i.addEventListener?(i.removeEventListener("DOMContentLoaded",A,!1),v.ready()):i.readyState==="complete"&&(i.detachEvent("onreadystatechange",A),v.ready())},O={};v.fn=v.prototype={constructor:v,init:function(e,n,r){var s,o,u,a;if(!e)return this;if(e.nodeType)return this.context=this[0]=e,this.length=1,this;if(typeof e=="string"){e.charAt(0)==="<"&&e.charAt(e.length-1)===">"&&e.length>=3?s=[null,e,null]:s=w.exec(e);if(s&&(s[1]||!n)){if(s[1])return n=n instanceof v?n[0]:n,a=n&&n.nodeType?n.ownerDocument||n:i,e=v.parseHTML(s[1],a,!0),E.test(s[1])&&v.isPlainObject(n)&&this.attr.call(e,n,!0),v.merge(this,e);o=i.getElementById(s[2]);if(o&&o.parentNode){if(o.id!==s[2])return r.find(e);this.length=1,this[0]=o}return this.context=i,this.selector=e,this}return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e)}return v.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),v.makeArray(e,this))},selector:"",jquery:"1.8.3",length:0,size:function(){return this.length},toArray:function(){return l.call(this)},get:function(e){return e==null?this.toArray():e<0?this[this.length+e]:this[e]},pushStack:function(e,t,n){var r=v.merge(this.constructor(),e);return r.prevObject=this,r.context=this.context,t==="find"?r.selector=this.selector+(this.selector?" ":"")+n:t&&(r.selector=this.selector+"."+t+"("+n+")"),r},each:function(e,t){return v.each(this,e,t)},ready:function(e){return v.ready.promise().done(e),this},eq:function(e){return e=+e,e===-1?this.slice(e):this.slice(e,e+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(l.apply(this,arguments),"slice",l.call(arguments).join(","))},map:function(e){return this.pushStack(v.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:[].sort,splice:[].splice},v.fn.init.prototype=v.fn,v.extend=v.fn.extend=function(){var e,n,r,i,s,o,u=arguments[0]||{},a=1,f=arguments.length,l=!1;typeof u=="boolean"&&(l=u,u=arguments[1]||{},a=2),typeof u!="object"&&!v.isFunction(u)&&(u={}),f===a&&(u=this,--a);for(;a<f;a++)if((e=arguments[a])!=null)for(n in e){r=u[n],i=e[n];if(u===i)continue;l&&i&&(v.isPlainObject(i)||(s=v.isArray(i)))?(s?(s=!1,o=r&&v.isArray(r)?r:[]):o=r&&v.isPlainObject(r)?r:{},u[n]=v.extend(l,o,i)):i!==t&&(u[n]=i)}return u},v.extend({noConflict:function(t){return e.$===v&&(e.$=a),t&&e.jQuery===v&&(e.jQuery=u),v},isReady:!1,readyWait:1,holdReady:function(e){e?v.readyWait++:v.ready(!0)},ready:function(e){if(e===!0?--v.readyWait:v.isReady)return;if(!i.body)return setTimeout(v.ready,1);v.isReady=!0;if(e!==!0&&--v.readyWait>0)return;r.resolveWith(i,[v]),v.fn.trigger&&v(i).trigger("ready").off("ready")},isFunction:function(e){return v.type(e)==="function"},isArray:Array.isArray||function(e){return v.type(e)==="array"},isWindow:function(e){return e!=null&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return e==null?String(e):O[h.call(e)]||"object"},isPlainObject:function(e){if(!e||v.type(e)!=="object"||e.nodeType||v.isWindow(e))return!1;try{if(e.constructor&&!p.call(e,"constructor")&&!p.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var r;for(r in e);return r===t||p.call(e,r)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw new Error(e)},parseHTML:function(e,t,n){var r;return!e||typeof e!="string"?null:(typeof t=="boolean"&&(n=t,t=0),t=t||i,(r=E.exec(e))?[t.createElement(r[1])]:(r=v.buildFragment([e],t,n?null:[]),v.merge([],(r.cacheable?v.clone(r.fragment):r.fragment).childNodes)))},parseJSON:function(t){if(!t||typeof t!="string")return null;t=v.trim(t);if(e.JSON&&e.JSON.parse)return e.JSON.parse(t);if(S.test(t.replace(T,"@").replace(N,"]").replace(x,"")))return(new Function("return "+t))();v.error("Invalid JSON: "+t)},parseXML:function(n){var r,i;if(!n||typeof n!="string")return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(s){r=t}return(!r||!r.documentElement||r.getElementsByTagName("parsererror").length)&&v.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&g.test(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(C,"ms-").replace(k,L)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,n,r){var i,s=0,o=e.length,u=o===t||v.isFunction(e);if(r){if(u){for(i in e)if(n.apply(e[i],r)===!1)break}else for(;s<o;)if(n.apply(e[s++],r)===!1)break}else if(u){for(i in e)if(n.call(e[i],i,e[i])===!1)break}else for(;s<o;)if(n.call(e[s],s,e[s++])===!1)break;return e},trim:d&&!d.call("\ufeff\u00a0")?function(e){return e==null?"":d.call(e)}:function(e){return e==null?"":(e+"").replace(b,"")},makeArray:function(e,t){var n,r=t||[];return e!=null&&(n=v.type(e),e.length==null||n==="string"||n==="function"||n==="regexp"||v.isWindow(e)?f.call(r,e):v.merge(r,e)),r},inArray:function(e,t,n){var r;if(t){if(c)return c.call(t,e,n);r=t.length,n=n?n<0?Math.max(0,r+n):n:0;for(;n<r;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,s=0;if(typeof r=="number")for(;s<r;s++)e[i++]=n[s];else while(n[s]!==t)e[i++]=n[s++];return e.length=i,e},grep:function(e,t,n){var r,i=[],s=0,o=e.length;n=!!n;for(;s<o;s++)r=!!t(e[s],s),n!==r&&i.push(e[s]);return i},map:function(e,n,r){var i,s,o=[],u=0,a=e.length,f=e instanceof v||a!==t&&typeof a=="number"&&(a>0&&e[0]&&e[a-1]||a===0||v.isArray(e));if(f)for(;u<a;u++)i=n(e[u],u,r),i!=null&&(o[o.length]=i);else for(s in e)i=n(e[s],s,r),i!=null&&(o[o.length]=i);return o.concat.apply([],o)},guid:1,proxy:function(e,n){var r,i,s;return typeof n=="string"&&(r=e[n],n=e,e=r),v.isFunction(e)?(i=l.call(arguments,2),s=function(){return e.apply(n,i.concat(l.call(arguments)))},s.guid=e.guid=e.guid||v.guid++,s):t},access:function(e,n,r,i,s,o,u){var a,f=r==null,l=0,c=e.length;if(r&&typeof r=="object"){for(l in r)v.access(e,n,l,r[l],1,o,i);s=1}else if(i!==t){a=u===t&&v.isFunction(i),f&&(a?(a=n,n=function(e,t,n){return a.call(v(e),n)}):(n.call(e,i),n=null));if(n)for(;l<c;l++)n(e[l],r,a?i.call(e[l],l,n(e[l],r)):i,u);s=1}return s?e:f?n.call(e):c?n(e[0],r):o},now:function(){return(new Date).getTime()}}),v.ready.promise=function(t){if(!r){r=v.Deferred();if(i.readyState==="complete")setTimeout(v.ready,1);else if(i.addEventListener)i.addEventListener("DOMContentLoaded",A,!1),e.addEventListener("load",v.ready,!1);else{i.attachEvent("onreadystatechange",A),e.attachEvent("onload",v.ready);var n=!1;try{n=e.frameElement==null&&i.documentElement}catch(s){}n&&n.doScroll&&function o(){if(!v.isReady){try{n.doScroll("left")}catch(e){return setTimeout(o,50)}v.ready()}}()}}return r.promise(t)},v.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(e,t){O["[object "+t+"]"]=t.toLowerCase()}),n=v(i);var M={};v.Callbacks=function(e){e=typeof e=="string"?M[e]||_(e):v.extend({},e);var n,r,i,s,o,u,a=[],f=!e.once&&[],l=function(t){n=e.memory&&t,r=!0,u=s||0,s=0,o=a.length,i=!0;for(;a&&u<o;u++)if(a[u].apply(t[0],t[1])===!1&&e.stopOnFalse){n=!1;break}i=!1,a&&(f?f.length&&l(f.shift()):n?a=[]:c.disable())},c={add:function(){if(a){var t=a.length;(function r(t){v.each(t,function(t,n){var i=v.type(n);i==="function"?(!e.unique||!c.has(n))&&a.push(n):n&&n.length&&i!=="string"&&r(n)})})(arguments),i?o=a.length:n&&(s=t,l(n))}return this},remove:function(){return a&&v.each(arguments,function(e,t){var n;while((n=v.inArray(t,a,n))>-1)a.splice(n,1),i&&(n<=o&&o--,n<=u&&u--)}),this},has:function(e){return v.inArray(e,a)>-1},empty:function(){return a=[],this},disable:function(){return a=f=n=t,this},disabled:function(){return!a},lock:function(){return f=t,n||c.disable(),this},locked:function(){return!f},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],a&&(!r||f)&&(i?f.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!r}};return c},v.extend({Deferred:function(e){var t=[["resolve","done",v.Callbacks("once memory"),"resolved"],["reject","fail",v.Callbacks("once memory"),"rejected"],["notify","progress",v.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return v.Deferred(function(n){v.each(t,function(t,r){var s=r[0],o=e[t];i[r[1]](v.isFunction(o)?function(){var e=o.apply(this,arguments);e&&v.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===i?n:this,[e])}:n[s])}),e=null}).promise()},promise:function(e){return e!=null?v.extend(e,r):r}},i={};return r.pipe=r.then,v.each(t,function(e,s){var o=s[2],u=s[3];r[s[1]]=o.add,u&&o.add(function(){n=u},t[e^1][2].disable,t[2][2].lock),i[s[0]]=o.fire,i[s[0]+"With"]=o.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=l.call(arguments),r=n.length,i=r!==1||e&&v.isFunction(e.promise)?r:0,s=i===1?e:v.Deferred(),o=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?l.call(arguments):r,n===u?s.notifyWith(t,n):--i||s.resolveWith(t,n)}},u,a,f;if(r>1){u=new Array(r),a=new Array(r),f=new Array(r);for(;t<r;t++)n[t]&&v.isFunction(n[t].promise)?n[t].promise().done(o(t,f,n)).fail(s.reject).progress(o(t,a,u)):--i}return i||s.resolveWith(f,n),s.promise()}}),v.support=function(){var t,n,r,s,o,u,a,f,l,c,h,p=i.createElement("div");p.setAttribute("className","t"),p.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=p.getElementsByTagName("*"),r=p.getElementsByTagName("a")[0];if(!n||!r||!n.length)return{};s=i.createElement("select"),o=s.appendChild(i.createElement("option")),u=p.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(r.getAttribute("style")),hrefNormalized:r.getAttribute("href")==="/a",opacity:/^0.5/.test(r.style.opacity),cssFloat:!!r.style.cssFloat,checkOn:u.value==="on",optSelected:o.selected,getSetAttribute:p.className!=="t",enctype:!!i.createElement("form").enctype,html5Clone:i.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:i.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},u.checked=!0,t.noCloneChecked=u.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!o.disabled;try{delete p.test}catch(d){t.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",h=function(){t.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick"),p.detachEvent("onclick",h)),u=i.createElement("input"),u.value="t",u.setAttribute("type","radio"),t.radioValue=u.value==="t",u.setAttribute("checked","checked"),u.setAttribute("name","t"),p.appendChild(u),a=i.createDocumentFragment(),a.appendChild(p.lastChild),t.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,t.appendChecked=u.checked,a.removeChild(u),a.appendChild(p);if(p.attachEvent)for(l in{submit:!0,change:!0,focusin:!0})f="on"+l,c=f in p,c||(p.setAttribute(f,"return;"),c=typeof p[f]=="function"),t[l+"Bubbles"]=c;return v(function(){var n,r,s,o,u="padding:0;margin:0;border:0;display:block;overflow:hidden;",a=i.getElementsByTagName("body")[0];if(!a)return;n=i.createElement("div"),n.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",a.insertBefore(n,a.firstChild),r=i.createElement("div"),n.appendChild(r),r.innerHTML="<table><tr><td></td><td>t</td></tr></table>",s=r.getElementsByTagName("td"),s[0].style.cssText="padding:0;margin:0;border:0;display:none",c=s[0].offsetHeight===0,s[0].style.display="",s[1].style.display="none",t.reliableHiddenOffsets=c&&s[0].offsetHeight===0,r.innerHTML="",r.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=r.offsetWidth===4,t.doesNotIncludeMarginInBodyOffset=a.offsetTop!==1,e.getComputedStyle&&(t.pixelPosition=(e.getComputedStyle(r,null)||{}).top!=="1%",t.boxSizingReliable=(e.getComputedStyle(r,null)||{width:"4px"}).width==="4px",o=i.createElement("div"),o.style.cssText=r.style.cssText=u,o.style.marginRight=o.style.width="0",r.style.width="1px",r.appendChild(o),t.reliableMarginRight=!parseFloat((e.getComputedStyle(o,null)||{}).marginRight)),typeof r.style.zoom!="undefined"&&(r.innerHTML="",r.style.cssText=u+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=r.offsetWidth===3,r.style.display="block",r.style.overflow="visible",r.innerHTML="<div></div>",r.firstChild.style.width="5px",t.shrinkWrapBlocks=r.offsetWidth!==3,n.style.zoom=1),a.removeChild(n),n=r=s=o=null}),a.removeChild(p),n=r=s=o=u=a=p=null,t}();var D=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;v.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(v.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?v.cache[e[v.expando]]:e[v.expando],!!e&&!B(e)},data:function(e,n,r,i){if(!v.acceptData(e))return;var s,o,u=v.expando,a=typeof n=="string",f=e.nodeType,l=f?v.cache:e,c=f?e[u]:e[u]&&u;if((!c||!l[c]||!i&&!l[c].data)&&a&&r===t)return;c||(f?e[u]=c=v.deletedIds.pop()||v.guid++:c=u),l[c]||(l[c]={},f||(l[c].toJSON=v.noop));if(typeof n=="object"||typeof n=="function")i?l[c]=v.extend(l[c],n):l[c].data=v.extend(l[c].data,n);return s=l[c],i||(s.data||(s.data={}),s=s.data),r!==t&&(s[v.camelCase(n)]=r),a?(o=s[n],o==null&&(o=s[v.camelCase(n)])):o=s,o},removeData:function(e,t,n){if(!v.acceptData(e))return;var r,i,s,o=e.nodeType,u=o?v.cache:e,a=o?e[v.expando]:v.expando;if(!u[a])return;if(t){r=n?u[a]:u[a].data;if(r){v.isArray(t)||(t in r?t=[t]:(t=v.camelCase(t),t in r?t=[t]:t=t.split(" ")));for(i=0,s=t.length;i<s;i++)delete r[t[i]];if(!(n?B:v.isEmptyObject)(r))return}}if(!n){delete u[a].data;if(!B(u[a]))return}o?v.cleanData([e],!0):v.support.deleteExpando||u!=u.window?delete u[a]:u[a]=null},_data:function(e,t,n){return v.data(e,t,n,!0)},acceptData:function(e){var t=e.nodeName&&v.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),v.fn.extend({data:function(e,n){var r,i,s,o,u,a=this[0],f=0,l=null;if(e===t){if(this.length){l=v.data(a);if(a.nodeType===1&&!v._data(a,"parsedAttrs")){s=a.attributes;for(u=s.length;f<u;f++)o=s[f].name,o.indexOf("data-")||(o=v.camelCase(o.substring(5)),H(a,o,l[o]));v._data(a,"parsedAttrs",!0)}}return l}return typeof e=="object"?this.each(function(){v.data(this,e)}):(r=e.split(".",2),r[1]=r[1]?"."+r[1]:"",i=r[1]+"!",v.access(this,function(n){if(n===t)return l=this.triggerHandler("getData"+i,[r[0]]),l===t&&a&&(l=v.data(a,e),l=H(a,e,l)),l===t&&r[1]?this.data(r[0]):l;r[1]=n,this.each(function(){var t=v(this);t.triggerHandler("setData"+i,r),v.data(this,e,n),t.triggerHandler("changeData"+i,r)})},null,n,arguments.length>1,null,!1))},removeData:function(e){return this.each(function(){v.removeData(this,e)})}}),v.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=v._data(e,t),n&&(!r||v.isArray(n)?r=v._data(e,t,v.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=v.queue(e,t),r=n.length,i=n.shift(),s=v._queueHooks(e,t),o=function(){v.dequeue(e,t)};i==="inprogress"&&(i=n.shift(),r--),i&&(t==="fx"&&n.unshift("inprogress"),delete s.stop,i.call(e,o,s)),!r&&s&&s.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return v._data(e,n)||v._data(e,n,{empty:v.Callbacks("once memory").add(function(){v.removeData(e,t+"queue",!0),v.removeData(e,n,!0)})})}}),v.fn.extend({queue:function(e,n){var r=2;return typeof e!="string"&&(n=e,e="fx",r--),arguments.length<r?v.queue(this[0],e):n===t?this:this.each(function(){var t=v.queue(this,e,n);v._queueHooks(this,e),e==="fx"&&t[0]!=="inprogress"&&v.dequeue(this,e)})},dequeue:function(e){return this.each(function(){v.dequeue(this,e)})},delay:function(e,t){return e=v.fx?v.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,s=v.Deferred(),o=this,u=this.length,a=function(){--i||s.resolveWith(o,[o])};typeof e!="string"&&(n=e,e=t),e=e||"fx";while(u--)r=v._data(o[u],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(a));return a(),s.promise(n)}});var j,F,I,q=/[\t\r\n]/g,R=/\r/g,U=/^(?:button|input)$/i,z=/^(?:button|input|object|select|textarea)$/i,W=/^a(?:rea|)$/i,X=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,V=v.support.getSetAttribute;v.fn.extend({attr:function(e,t){return v.access(this,v.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){v.removeAttr(this,e)})},prop:function(e,t){return v.access(this,v.prop,e,t,arguments.length>1)},removeProp:function(e){return e=v.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,s,o,u;if(v.isFunction(e))return this.each(function(t){v(this).addClass(e.call(this,t,this.className))});if(e&&typeof e=="string"){t=e.split(y);for(n=0,r=this.length;n<r;n++){i=this[n];if(i.nodeType===1)if(!i.className&&t.length===1)i.className=e;else{s=" "+i.className+" ";for(o=0,u=t.length;o<u;o++)s.indexOf(" "+t[o]+" ")<0&&(s+=t[o]+" ");i.className=v.trim(s)}}}return this},removeClass:function(e){var n,r,i,s,o,u,a;if(v.isFunction(e))return this.each(function(t){v(this).removeClass(e.call(this,t,this.className))});if(e&&typeof e=="string"||e===t){n=(e||"").split(y);for(u=0,a=this.length;u<a;u++){i=this[u];if(i.nodeType===1&&i.className){r=(" "+i.className+" ").replace(q," ");for(s=0,o=n.length;s<o;s++)while(r.indexOf(" "+n[s]+" ")>=0)r=r.replace(" "+n[s]+" "," ");i.className=e?v.trim(r):""}}}return this},toggleClass:function(e,t){var n=typeof e,r=typeof t=="boolean";return v.isFunction(e)?this.each(function(n){v(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if(n==="string"){var i,s=0,o=v(this),u=t,a=e.split(y);while(i=a[s++])u=r?u:!o.hasClass(i),o[u?"addClass":"removeClass"](i)}else if(n==="undefined"||n==="boolean")this.className&&v._data(this,"__className__",this.className),this.className=this.className||e===!1?"":v._data(this,"__className__")||""})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;n<r;n++)if(this[n].nodeType===1&&(" "+this[n].className+" ").replace(q," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,s=this[0];if(!arguments.length){if(s)return n=v.valHooks[s.type]||v.valHooks[s.nodeName.toLowerCase()],n&&"get"in n&&(r=n.get(s,"value"))!==t?r:(r=s.value,typeof r=="string"?r.replace(R,""):r==null?"":r);return}return i=v.isFunction(e),this.each(function(r){var s,o=v(this);if(this.nodeType!==1)return;i?s=e.call(this,r,o.val()):s=e,s==null?s="":typeof s=="number"?s+="":v.isArray(s)&&(s=v.map(s,function(e){return e==null?"":e+""})),n=v.valHooks[this.type]||v.valHooks[this.nodeName.toLowerCase()];if(!n||!("set"in n)||n.set(this,s,"value")===t)this.value=s})}}),v.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,s=e.type==="select-one"||i<0,o=s?null:[],u=s?i+1:r.length,a=i<0?u:s?i:0;for(;a<u;a++){n=r[a];if((n.selected||a===i)&&(v.support.optDisabled?!n.disabled:n.getAttribute("disabled")===null)&&(!n.parentNode.disabled||!v.nodeName(n.parentNode,"optgroup"))){t=v(n).val();if(s)return t;o.push(t)}}return o},set:function(e,t){var n=v.makeArray(t);return v(e).find("option").each(function(){this.selected=v.inArray(v(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attrFn:{},attr:function(e,n,r,i){var s,o,u,a=e.nodeType;if(!e||a===3||a===8||a===2)return;if(i&&v.isFunction(v.fn[n]))return v(e)[n](r);if(typeof e.getAttribute=="undefined")return v.prop(e,n,r);u=a!==1||!v.isXMLDoc(e),u&&(n=n.toLowerCase(),o=v.attrHooks[n]||(X.test(n)?F:j));if(r!==t){if(r===null){v.removeAttr(e,n);return}return o&&"set"in o&&u&&(s=o.set(e,r,n))!==t?s:(e.setAttribute(n,r+""),r)}return o&&"get"in o&&u&&(s=o.get(e,n))!==null?s:(s=e.getAttribute(n),s===null?t:s)},removeAttr:function(e,t){var n,r,i,s,o=0;if(t&&e.nodeType===1){r=t.split(y);for(;o<r.length;o++)i=r[o],i&&(n=v.propFix[i]||i,s=X.test(i),s||v.attr(e,i,""),e.removeAttribute(V?i:n),s&&n in e&&(e[n]=!1))}},attrHooks:{type:{set:function(e,t){if(U.test(e.nodeName)&&e.parentNode)v.error("type property can't be changed");else if(!v.support.radioValue&&t==="radio"&&v.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}},value:{get:function(e,t){return j&&v.nodeName(e,"button")?j.get(e,t):t in e?e.value:null},set:function(e,t,n){if(j&&v.nodeName(e,"button"))return j.set(e,t,n);e.value=t}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,r){var i,s,o,u=e.nodeType;if(!e||u===3||u===8||u===2)return;return o=u!==1||!v.isXMLDoc(e),o&&(n=v.propFix[n]||n,s=v.propHooks[n]),r!==t?s&&"set"in s&&(i=s.set(e,r,n))!==t?i:e[n]=r:s&&"get"in s&&(i=s.get(e,n))!==null?i:e[n]},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):z.test(e.nodeName)||W.test(e.nodeName)&&e.href?0:t}}}}),F={get:function(e,n){var r,i=v.prop(e,n);return i===!0||typeof i!="boolean"&&(r=e.getAttributeNode(n))&&r.nodeValue!==!1?n.toLowerCase():t},set:function(e,t,n){var r;return t===!1?v.removeAttr(e,n):(r=v.propFix[n]||n,r in e&&(e[r]=!0),e.setAttribute(n,n.toLowerCase())),n}},V||(I={name:!0,id:!0,coords:!0},j=v.valHooks.button={get:function(e,n){var r;return r=e.getAttributeNode(n),r&&(I[n]?r.value!=="":r.specified)?r.value:t},set:function(e,t,n){var r=e.getAttributeNode(n);return r||(r=i.createAttribute(n),e.setAttributeNode(r)),r.value=t+""}},v.each(["width","height"],function(e,t){v.attrHooks[t]=v.extend(v.attrHooks[t],{set:function(e,n){if(n==="")return e.setAttribute(t,"auto"),n}})}),v.attrHooks.contenteditable={get:j.get,set:function(e,t,n){t===""&&(t="false"),j.set(e,t,n)}}),v.support.hrefNormalized||v.each(["href","src","width","height"],function(e,n){v.attrHooks[n]=v.extend(v.attrHooks[n],{get:function(e){var r=e.getAttribute(n,2);return r===null?t:r}})}),v.support.style||(v.attrHooks.style={get:function(e){return e.style.cssText.toLowerCase()||t},set:function(e,t){return e.style.cssText=t+""}}),v.support.optSelected||(v.propHooks.selected=v.extend(v.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),v.support.enctype||(v.propFix.enctype="encoding"),v.support.checkOn||v.each(["radio","checkbox"],function(){v.valHooks[this]={get:function(e){return e.getAttribute("value")===null?"on":e.value}}}),v.each(["radio","checkbox"],function(){v.valHooks[this]=v.extend(v.valHooks[this],{set:function(e,t){if(v.isArray(t))return e.checked=v.inArray(v(e).val(),t)>=0}})});var $=/^(?:textarea|input|select)$/i,J=/^([^\.]*|)(?:\.(.+)|)$/,K=/(?:^|\s)hover(\.\S+|)\b/,Q=/^key/,G=/^(?:mouse|contextmenu)|click/,Y=/^(?:focusinfocus|focusoutblur)$/,Z=function(e){return v.event.special.hover?e:e.replace(K,"mouseenter$1 mouseleave$1")};v.event={add:function(e,n,r,i,s){var o,u,a,f,l,c,h,p,d,m,g;if(e.nodeType===3||e.nodeType===8||!n||!r||!(o=v._data(e)))return;r.handler&&(d=r,r=d.handler,s=d.selector),r.guid||(r.guid=v.guid++),a=o.events,a||(o.events=a={}),u=o.handle,u||(o.handle=u=function(e){return typeof v=="undefined"||!!e&&v.event.triggered===e.type?t:v.event.dispatch.apply(u.elem,arguments)},u.elem=e),n=v.trim(Z(n)).split(" ");for(f=0;f<n.length;f++){l=J.exec(n[f])||[],c=l[1],h=(l[2]||"").split(".").sort(),g=v.event.special[c]||{},c=(s?g.delegateType:g.bindType)||c,g=v.event.special[c]||{},p=v.extend({type:c,origType:l[1],data:i,handler:r,guid:r.guid,selector:s,needsContext:s&&v.expr.match.needsContext.test(s),namespace:h.join(".")},d),m=a[c];if(!m){m=a[c]=[],m.delegateCount=0;if(!g.setup||g.setup.call(e,i,h,u)===!1)e.addEventListener?e.addEventListener(c,u,!1):e.attachEvent&&e.attachEvent("on"+c,u)}g.add&&(g.add.call(e,p),p.handler.guid||(p.handler.guid=r.guid)),s?m.splice(m.delegateCount++,0,p):m.push(p),v.event.global[c]=!0}e=null},global:{},remove:function(e,t,n,r,i){var s,o,u,a,f,l,c,h,p,d,m,g=v.hasData(e)&&v._data(e);if(!g||!(h=g.events))return;t=v.trim(Z(t||"")).split(" ");for(s=0;s<t.length;s++){o=J.exec(t[s])||[],u=a=o[1],f=o[2];if(!u){for(u in h)v.event.remove(e,u+t[s],n,r,!0);continue}p=v.event.special[u]||{},u=(r?p.delegateType:p.bindType)||u,d=h[u]||[],l=d.length,f=f?new RegExp("(^|\\.)"+f.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(c=0;c<d.length;c++)m=d[c],(i||a===m.origType)&&(!n||n.guid===m.guid)&&(!f||f.test(m.namespace))&&(!r||r===m.selector||r==="**"&&m.selector)&&(d.splice(c--,1),m.selector&&d.delegateCount--,p.remove&&p.remove.call(e,m));d.length===0&&l!==d.length&&((!p.teardown||p.teardown.call(e,f,g.handle)===!1)&&v.removeEvent(e,u,g.handle),delete h[u])}v.isEmptyObject(h)&&(delete g.handle,v.removeData(e,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(n,r,s,o){if(!s||s.nodeType!==3&&s.nodeType!==8){var u,a,f,l,c,h,p,d,m,g,y=n.type||n,b=[];if(Y.test(y+v.event.triggered))return;y.indexOf("!")>=0&&(y=y.slice(0,-1),a=!0),y.indexOf(".")>=0&&(b=y.split("."),y=b.shift(),b.sort());if((!s||v.event.customEvent[y])&&!v.event.global[y])return;n=typeof n=="object"?n[v.expando]?n:new v.Event(y,n):new v.Event(y),n.type=y,n.isTrigger=!0,n.exclusive=a,n.namespace=b.join("."),n.namespace_re=n.namespace?new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,h=y.indexOf(":")<0?"on"+y:"";if(!s){u=v.cache;for(f in u)u[f].events&&u[f].events[y]&&v.event.trigger(n,r,u[f].handle.elem,!0);return}n.result=t,n.target||(n.target=s),r=r!=null?v.makeArray(r):[],r.unshift(n),p=v.event.special[y]||{};if(p.trigger&&p.trigger.apply(s,r)===!1)return;m=[[s,p.bindType||y]];if(!o&&!p.noBubble&&!v.isWindow(s)){g=p.delegateType||y,l=Y.test(g+y)?s:s.parentNode;for(c=s;l;l=l.parentNode)m.push([l,g]),c=l;c===(s.ownerDocument||i)&&m.push([c.defaultView||c.parentWindow||e,g])}for(f=0;f<m.length&&!n.isPropagationStopped();f++)l=m[f][0],n.type=m[f][1],d=(v._data(l,"events")||{})[n.type]&&v._data(l,"handle"),d&&d.apply(l,r),d=h&&l[h],d&&v.acceptData(l)&&d.apply&&d.apply(l,r)===!1&&n.preventDefault();return n.type=y,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(s.ownerDocument,r)===!1)&&(y!=="click"||!v.nodeName(s,"a"))&&v.acceptData(s)&&h&&s[y]&&(y!=="focus"&&y!=="blur"||n.target.offsetWidth!==0)&&!v.isWindow(s)&&(c=s[h],c&&(s[h]=null),v.event.triggered=y,s[y](),v.event.triggered=t,c&&(s[h]=c)),n.result}return},dispatch:function(n){n=v.event.fix(n||e.event);var r,i,s,o,u,a,f,c,h,p,d=(v._data(this,"events")||{})[n.type]||[],m=d.delegateCount,g=l.call(arguments),y=!n.exclusive&&!n.namespace,b=v.event.special[n.type]||{},w=[];g[0]=n,n.delegateTarget=this;if(b.preDispatch&&b.preDispatch.call(this,n)===!1)return;if(m&&(!n.button||n.type!=="click"))for(s=n.target;s!=this;s=s.parentNode||this)if(s.disabled!==!0||n.type!=="click"){u={},f=[];for(r=0;r<m;r++)c=d[r],h=c.selector,u[h]===t&&(u[h]=c.needsContext?v(h,this).index(s)>=0:v.find(h,this,null,[s]).length),u[h]&&f.push(c);f.length&&w.push({elem:s,matches:f})}d.length>m&&w.push({elem:this,matches:d.slice(m)});for(r=0;r<w.length&&!n.isPropagationStopped();r++){a=w[r],n.currentTarget=a.elem;for(i=0;i<a.matches.length&&!n.isImmediatePropagationStopped();i++){c=a.matches[i];if(y||!n.namespace&&!c.namespace||n.namespace_re&&n.namespace_re.test(c.namespace))n.data=c.data,n.handleObj=c,o=((v.event.special[c.origType]||{}).handle||c.handler).apply(a.elem,g),o!==t&&(n.result=o,o===!1&&(n.preventDefault(),n.stopPropagation()))}}return b.postDispatch&&b.postDispatch.call(this,n),n.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return e.which==null&&(e.which=t.charCode!=null?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,s,o,u=n.button,a=n.fromElement;return e.pageX==null&&n.clientX!=null&&(r=e.target.ownerDocument||i,s=r.documentElement,o=r.body,e.pageX=n.clientX+(s&&s.scrollLeft||o&&o.scrollLeft||0)-(s&&s.clientLeft||o&&o.clientLeft||0),e.pageY=n.clientY+(s&&s.scrollTop||o&&o.scrollTop||0)-(s&&s.clientTop||o&&o.clientTop||0)),!e.relatedTarget&&a&&(e.relatedTarget=a===e.target?n.toElement:a),!e.which&&u!==t&&(e.which=u&1?1:u&2?3:u&4?2:0),e}},fix:function(e){if(e[v.expando])return e;var t,n,r=e,s=v.event.fixHooks[e.type]||{},o=s.props?this.props.concat(s.props):this.props;e=v.Event(r);for(t=o.length;t;)n=o[--t],e[n]=r[n];return e.target||(e.target=r.srcElement||i),e.target.nodeType===3&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,r):e},special:{load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(e,t,n){v.isWindow(this)&&(this.onbeforeunload=n)},teardown:function(e,t){this.onbeforeunload===t&&(this.onbeforeunload=null)}}},simulate:function(e,t,n,r){var i=v.extend(new v.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?v.event.trigger(i,null,t):v.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},v.event.handle=v.event.dispatch,v.removeEvent=i.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]=="undefined"&&(e[r]=null),e.detachEvent(r,n))},v.Event=function(e,t){if(!(this instanceof v.Event))return new v.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?tt:et):this.type=e,t&&v.extend(this,t),this.timeStamp=e&&e.timeStamp||v.now(),this[v.expando]=!0},v.Event.prototype={preventDefault:function(){this.isDefaultPrevented=tt;var e=this.originalEvent;if(!e)return;e.preventDefault?e.preventDefault():e.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=tt;var e=this.originalEvent;if(!e)return;e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=tt,this.stopPropagation()},isDefaultPrevented:et,isPropagationStopped:et,isImmediatePropagationStopped:et},v.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){v.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,s=e.handleObj,o=s.selector;if(!i||i!==r&&!v.contains(r,i))e.type=s.origType,n=s.handler.apply(this,arguments),e.type=t;return n}}}),v.support.submitBubbles||(v.event.special.submit={setup:function(){if(v.nodeName(this,"form"))return!1;v.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=v.nodeName(n,"input")||v.nodeName(n,"button")?n.form:t;r&&!v._data(r,"_submit_attached")&&(v.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),v._data(r,"_submit_attached",!0))})},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&v.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){if(v.nodeName(this,"form"))return!1;v.event.remove(this,"._submit")}}),v.support.changeBubbles||(v.event.special.change={setup:function(){if($.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")v.event.add(this,"propertychange._change",function(e){e.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),v.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),v.event.simulate("change",this,e,!0)});return!1}v.event.add(this,"beforeactivate._change",function(e){var t=e.target;$.test(t.nodeName)&&!v._data(t,"_change_attached")&&(v.event.add(t,"change._change",function(e){this.parentNode&&!e.isSimulated&&!e.isTrigger&&v.event.simulate("change",this.parentNode,e,!0)}),v._data(t,"_change_attached",!0))})},handle:function(e){var t=e.target;if(this!==t||e.isSimulated||e.isTrigger||t.type!=="radio"&&t.type!=="checkbox")return e.handleObj.handler.apply(this,arguments)},teardown:function(){return v.event.remove(this,"._change"),!$.test(this.nodeName)}}),v.support.focusinBubbles||v.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){v.event.simulate(t,e.target,v.event.fix(e),!0)};v.event.special[t]={setup:function(){n++===0&&i.addEventListener(e,r,!0)},teardown:function(){--n===0&&i.removeEventListener(e,r,!0)}}}),v.fn.extend({on:function(e,n,r,i,s){var o,u;if(typeof e=="object"){typeof n!="string"&&(r=r||n,n=t);for(u in e)this.on(u,n,r,e[u],s);return this}r==null&&i==null?(i=n,r=n=t):i==null&&(typeof n=="string"?(i=r,r=t):(i=r,r=n,n=t));if(i===!1)i=et;else if(!i)return this;return s===1&&(o=i,i=function(e){return v().off(e),o.apply(this,arguments)},i.guid=o.guid||(o.guid=v.guid++)),this.each(function(){v.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,s;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,v(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if(typeof e=="object"){for(s in e)this.off(s,n,e[s]);return this}if(n===!1||typeof n=="function")r=n,n=t;return r===!1&&(r=et),this.each(function(){v.event.remove(this,e,r,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},live:function(e,t,n){return v(this.context).on(e,this.selector,t,n),this},die:function(e,t){return v(this.context).off(e,this.selector||"**",t),this},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return arguments.length===1?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){v.event.trigger(e,t,this)})},triggerHandler:function(e,t){if(this[0])return v.event.trigger(e,t,this[0],!0)},toggle:function(e){var t=arguments,n=e.guid||v.guid++,r=0,i=function(n){var i=(v._data(this,"lastToggle"+e.guid)||0)%r;return v._data(this,"lastToggle"+e.guid,i+1),n.preventDefault(),t[i].apply(this,arguments)||!1};i.guid=n;while(r<t.length)t[r++].guid=n;return this.click(i)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),v.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){v.fn[t]=function(e,n){return n==null&&(n=e,e=null),arguments.length>0?this.on(t,null,e,n):this.trigger(t)},Q.test(t)&&(v.event.fixHooks[t]=v.event.keyHooks),G.test(t)&&(v.event.fixHooks[t]=v.event.mouseHooks)}),function(e,t){function nt(e,t,n,r){n=n||[],t=t||g;var i,s,a,f,l=t.nodeType;if(!e||typeof e!="string")return n;if(l!==1&&l!==9)return[];a=o(t);if(!a&&!r)if(i=R.exec(e))if(f=i[1]){if(l===9){s=t.getElementById(f);if(!s||!s.parentNode)return n;if(s.id===f)return n.push(s),n}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(f))&&u(t,s)&&s.id===f)return n.push(s),n}else{if(i[2])return S.apply(n,x.call(t.getElementsByTagName(e),0)),n;if((f=i[3])&&Z&&t.getElementsByClassName)return S.apply(n,x.call(t.getElementsByClassName(f),0)),n}return vt(e.replace(j,"$1"),t,n,r,a)}function rt(e){return function(t){var n=t.nodeName.toLowerCase();return n==="input"&&t.type===e}}function it(e){return function(t){var n=t.nodeName.toLowerCase();return(n==="input"||n==="button")&&t.type===e}}function st(e){return N(function(t){return t=+t,N(function(n,r){var i,s=e([],n.length,t),o=s.length;while(o--)n[i=s[o]]&&(n[i]=!(r[i]=n[i]))})})}function ot(e,t,n){if(e===t)return n;var r=e.nextSibling;while(r){if(r===t)return-1;r=r.nextSibling}return 1}function ut(e,t){var n,r,s,o,u,a,f,l=L[d][e+" "];if(l)return t?0:l.slice(0);u=e,a=[],f=i.preFilter;while(u){if(!n||(r=F.exec(u)))r&&(u=u.slice(r[0].length)||u),a.push(s=[]);n=!1;if(r=I.exec(u))s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=r[0].replace(j," ");for(o in i.filter)(r=J[o].exec(u))&&(!f[o]||(r=f[o](r)))&&(s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=o,n.matches=r);if(!n)break}return t?u.length:u?nt.error(e):L(e,a).slice(0)}function at(e,t,r){var i=t.dir,s=r&&t.dir==="parentNode",o=w++;return t.first?function(t,n,r){while(t=t[i])if(s||t.nodeType===1)return e(t,n,r)}:function(t,r,u){if(!u){var a,f=b+" "+o+" ",l=f+n;while(t=t[i])if(s||t.nodeType===1){if((a=t[d])===l)return t.sizset;if(typeof a=="string"&&a.indexOf(f)===0){if(t.sizset)return t}else{t[d]=l;if(e(t,r,u))return t.sizset=!0,t;t.sizset=!1}}}else while(t=t[i])if(s||t.nodeType===1)if(e(t,r,u))return t}}function ft(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function lt(e,t,n,r,i){var s,o=[],u=0,a=e.length,f=t!=null;for(;u<a;u++)if(s=e[u])if(!n||n(s,r,i))o.push(s),f&&t.push(u);return o}function ct(e,t,n,r,i,s){return r&&!r[d]&&(r=ct(r)),i&&!i[d]&&(i=ct(i,s)),N(function(s,o,u,a){var f,l,c,h=[],p=[],d=o.length,v=s||dt(t||"*",u.nodeType?[u]:u,[]),m=e&&(s||!t)?lt(v,h,e,u,a):v,g=n?i||(s?e:d||r)?[]:o:m;n&&n(m,g,u,a);if(r){f=lt(g,p),r(f,[],u,a),l=f.length;while(l--)if(c=f[l])g[p[l]]=!(m[p[l]]=c)}if(s){if(i||e){if(i){f=[],l=g.length;while(l--)(c=g[l])&&f.push(m[l]=c);i(null,g=[],f,a)}l=g.length;while(l--)(c=g[l])&&(f=i?T.call(s,c):h[l])>-1&&(s[f]=!(o[f]=c))}}else g=lt(g===o?g.splice(d,g.length):g),i?i(null,o,g,a):S.apply(o,g)})}function ht(e){var t,n,r,s=e.length,o=i.relative[e[0].type],u=o||i.relative[" "],a=o?1:0,f=at(function(e){return e===t},u,!0),l=at(function(e){return T.call(t,e)>-1},u,!0),h=[function(e,n,r){return!o&&(r||n!==c)||((t=n).nodeType?f(e,n,r):l(e,n,r))}];for(;a<s;a++)if(n=i.relative[e[a].type])h=[at(ft(h),n)];else{n=i.filter[e[a].type].apply(null,e[a].matches);if(n[d]){r=++a;for(;r<s;r++)if(i.relative[e[r].type])break;return ct(a>1&&ft(h),a>1&&e.slice(0,a-1).join("").replace(j,"$1"),n,a<r&&ht(e.slice(a,r)),r<s&&ht(e=e.slice(r)),r<s&&e.join(""))}h.push(n)}return ft(h)}function pt(e,t){var r=t.length>0,s=e.length>0,o=function(u,a,f,l,h){var p,d,v,m=[],y=0,w="0",x=u&&[],T=h!=null,N=c,C=u||s&&i.find.TAG("*",h&&a.parentNode||a),k=b+=N==null?1:Math.E;T&&(c=a!==g&&a,n=o.el);for(;(p=C[w])!=null;w++){if(s&&p){for(d=0;v=e[d];d++)if(v(p,a,f)){l.push(p);break}T&&(b=k,n=++o.el)}r&&((p=!v&&p)&&y--,u&&x.push(p))}y+=w;if(r&&w!==y){for(d=0;v=t[d];d++)v(x,m,a,f);if(u){if(y>0)while(w--)!x[w]&&!m[w]&&(m[w]=E.call(l));m=lt(m)}S.apply(l,m),T&&!u&&m.length>0&&y+t.length>1&&nt.uniqueSort(l)}return T&&(b=k,c=N),x};return o.el=0,r?N(o):o}function dt(e,t,n){var r=0,i=t.length;for(;r<i;r++)nt(e,t[r],n);return n}function vt(e,t,n,r,s){var o,u,f,l,c,h=ut(e),p=h.length;if(!r&&h.length===1){u=h[0]=h[0].slice(0);if(u.length>2&&(f=u[0]).type==="ID"&&t.nodeType===9&&!s&&i.relative[u[1].type]){t=i.find.ID(f.matches[0].replace($,""),t,s)[0];if(!t)return n;e=e.slice(u.shift().length)}for(o=J.POS.test(e)?-1:u.length-1;o>=0;o--){f=u[o];if(i.relative[l=f.type])break;if(c=i.find[l])if(r=c(f.matches[0].replace($,""),z.test(u[0].type)&&t.parentNode||t,s)){u.splice(o,1),e=r.length&&u.join("");if(!e)return S.apply(n,x.call(r,0)),n;break}}}return a(e,h)(r,t,s,n,z.test(e)),n}function mt(){}var n,r,i,s,o,u,a,f,l,c,h=!0,p="undefined",d=("sizcache"+Math.random()).replace(".",""),m=String,g=e.document,y=g.documentElement,b=0,w=0,E=[].pop,S=[].push,x=[].slice,T=[].indexOf||function(e){var t=0,n=this.length;for(;t<n;t++)if(this[t]===e)return t;return-1},N=function(e,t){return e[d]=t==null||t,e},C=function(){var e={},t=[];return N(function(n,r){return t.push(n)>i.cacheLength&&delete e[t.shift()],e[n+" "]=r},e)},k=C(),L=C(),A=C(),O="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",_=M.replace("w","w#"),D="([*^$|!~]?=)",P="\\["+O+"*("+M+")"+O+"*(?:"+D+O+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+_+")|)|)"+O+"*\\]",H=":("+M+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+P+")|[^:]|\\\\.)*|.*))\\)|)",B=":(even|odd|eq|gt|lt|nth|first|last)(?:\\("+O+"*((?:-\\d)?\\d*)"+O+"*\\)|)(?=[^-]|$)",j=new RegExp("^"+O+"+|((?:^|[^\\\\])(?:\\\\.)*)"+O+"+$","g"),F=new RegExp("^"+O+"*,"+O+"*"),I=new RegExp("^"+O+"*([\\x20\\t\\r\\n\\f>+~])"+O+"*"),q=new RegExp(H),R=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,U=/^:not/,z=/[\x20\t\r\n\f]*[+~]/,W=/:not\($/,X=/h\d/i,V=/input|select|textarea|button/i,$=/\\(?!\\)/g,J={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),NAME:new RegExp("^\\[name=['\"]?("+M+")['\"]?\\]"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+H),POS:new RegExp(B,"i"),CHILD:new RegExp("^:(only|nth|first|last)-child(?:\\("+O+"*(even|odd|(([+-]|)(\\d*)n|)"+O+"*(?:([+-]|)"+O+"*(\\d+)|))"+O+"*\\)|)","i"),needsContext:new RegExp("^"+O+"*[>+~]|"+B,"i")},K=function(e){var t=g.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}},Q=K(function(e){return e.appendChild(g.createComment("")),!e.getElementsByTagName("*").length}),G=K(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==p&&e.firstChild.getAttribute("href")==="#"}),Y=K(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return t!=="boolean"&&t!=="string"}),Z=K(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!e.getElementsByClassName||!e.getElementsByClassName("e").length?!1:(e.lastChild.className="e",e.getElementsByClassName("e").length===2)}),et=K(function(e){e.id=d+0,e.innerHTML="<a name='"+d+"'></a><div name='"+d+"'></div>",y.insertBefore(e,y.firstChild);var t=g.getElementsByName&&g.getElementsByName(d).length===2+g.getElementsByName(d+0).length;return r=!g.getElementById(d),y.removeChild(e),t});try{x.call(y.childNodes,0)[0].nodeType}catch(tt){x=function(e){var t,n=[];for(;t=this[e];e++)n.push(t);return n}}nt.matches=function(e,t){return nt(e,null,null,t)},nt.matchesSelector=function(e,t){return nt(t,null,null,[e]).length>0},s=nt.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(i===1||i===9||i===11){if(typeof e.textContent=="string")return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=s(e)}else if(i===3||i===4)return e.nodeValue}else for(;t=e[r];r++)n+=s(t);return n},o=nt.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?t.nodeName!=="HTML":!1},u=nt.contains=y.contains?function(e,t){var n=e.nodeType===9?e.documentElement:e,r=t&&t.parentNode;return e===r||!!(r&&r.nodeType===1&&n.contains&&n.contains(r))}:y.compareDocumentPosition?function(e,t){return t&&!!(e.compareDocumentPosition(t)&16)}:function(e,t){while(t=t.parentNode)if(t===e)return!0;return!1},nt.attr=function(e,t){var n,r=o(e);return r||(t=t.toLowerCase()),(n=i.attrHandle[t])?n(e):r||Y?e.getAttribute(t):(n=e.getAttributeNode(t),n?typeof e[t]=="boolean"?e[t]?t:null:n.specified?n.value:null:null)},i=nt.selectors={cacheLength:50,createPseudo:N,match:J,attrHandle:G?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},find:{ID:r?function(e,t,n){if(typeof t.getElementById!==p&&!n){var r=t.getElementById(e);return r&&r.parentNode?[r]:[]}}:function(e,n,r){if(typeof n.getElementById!==p&&!r){var i=n.getElementById(e);return i?i.id===e||typeof i.getAttributeNode!==p&&i.getAttributeNode("id").value===e?[i]:t:[]}},TAG:Q?function(e,t){if(typeof t.getElementsByTagName!==p)return t.getElementsByTagName(e)}:function(e,t){var n=t.getElementsByTagName(e);if(e==="*"){var r,i=[],s=0;for(;r=n[s];s++)r.nodeType===1&&i.push(r);return i}return n},NAME:et&&function(e,t){if(typeof t.getElementsByName!==p)return t.getElementsByName(name)},CLASS:Z&&function(e,t,n){if(typeof t.getElementsByClassName!==p&&!n)return t.getElementsByClassName(e)}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace($,""),e[3]=(e[4]||e[5]||"").replace($,""),e[2]==="~="&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),e[1]==="nth"?(e[2]||nt.error(e[0]),e[3]=+(e[3]?e[4]+(e[5]||1):2*(e[2]==="even"||e[2]==="odd")),e[4]=+(e[6]+e[7]||e[2]==="odd")):e[2]&&nt.error(e[0]),e},PSEUDO:function(e){var t,n;if(J.CHILD.test(e[0]))return null;if(e[3])e[2]=e[3];else if(t=e[4])q.test(t)&&(n=ut(t,!0))&&(n=t.indexOf(")",t.length-n)-t.length)&&(t=t.slice(0,n),e[0]=e[0].slice(0,n)),e[2]=t;return e.slice(0,3)}},filter:{ID:r?function(e){return e=e.replace($,""),function(t){return t.getAttribute("id")===e}}:function(e){return e=e.replace($,""),function(t){var n=typeof t.getAttributeNode!==p&&t.getAttributeNode("id");return n&&n.value===e}},TAG:function(e){return e==="*"?function(){return!0}:(e=e.replace($,"").toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=k[d][e+" "];return t||(t=new RegExp("(^|"+O+")"+e+"("+O+"|$)"))&&k(e,function(e){return t.test(e.className||typeof e.getAttribute!==p&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r,i){var s=nt.attr(r,e);return s==null?t==="!=":t?(s+="",t==="="?s===n:t==="!="?s!==n:t==="^="?n&&s.indexOf(n)===0:t==="*="?n&&s.indexOf(n)>-1:t==="$="?n&&s.substr(s.length-n.length)===n:t==="~="?(" "+s+" ").indexOf(n)>-1:t==="|="?s===n||s.substr(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r){return e==="nth"?function(e){var t,i,s=e.parentNode;if(n===1&&r===0)return!0;if(s){i=0;for(t=s.firstChild;t;t=t.nextSibling)if(t.nodeType===1){i++;if(e===t)break}}return i-=r,i===n||i%n===0&&i/n>=0}:function(t){var n=t;switch(e){case"only":case"first":while(n=n.previousSibling)if(n.nodeType===1)return!1;if(e==="first")return!0;n=t;case"last":while(n=n.nextSibling)if(n.nodeType===1)return!1;return!0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||nt.error("unsupported pseudo: "+e);return r[d]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?N(function(e,n){var i,s=r(e,t),o=s.length;while(o--)i=T.call(e,s[o]),e[i]=!(n[i]=s[o])}):function(e){return r(e,0,n)}):r}},pseudos:{not:N(function(e){var t=[],n=[],r=a(e.replace(j,"$1"));return r[d]?N(function(e,t,n,i){var s,o=r(e,null,i,[]),u=e.length;while(u--)if(s=o[u])e[u]=!(t[u]=s)}):function(e,i,s){return t[0]=e,r(t,null,s,n),!n.pop()}}),has:N(function(e){return function(t){return nt(e,t).length>0}}),contains:N(function(e){return function(t){return(t.textContent||t.innerText||s(t)).indexOf(e)>-1}}),enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&!!e.checked||t==="option"&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},parent:function(e){return!i.pseudos.empty(e)},empty:function(e){var t;e=e.firstChild;while(e){if(e.nodeName>"@"||(t=e.nodeType)===3||t===4)return!1;e=e.nextSibling}return!0},header:function(e){return X.test(e.nodeName)},text:function(e){var t,n;return e.nodeName.toLowerCase()==="input"&&(t=e.type)==="text"&&((n=e.getAttribute("type"))==null||n.toLowerCase()===t)},radio:rt("radio"),checkbox:rt("checkbox"),file:rt("file"),password:rt("password"),image:rt("image"),submit:it("submit"),reset:it("reset"),button:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&e.type==="button"||t==="button"},input:function(e){return V.test(e.nodeName)},focus:function(e){var t=e.ownerDocument;return e===t.activeElement&&(!t.hasFocus||t.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},active:function(e){return e===e.ownerDocument.activeElement},first:st(function(){return[0]}),last:st(function(e,t){return[t-1]}),eq:st(function(e,t,n){return[n<0?n+t:n]}),even:st(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:st(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:st(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:st(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},f=y.compareDocumentPosition?function(e,t){return e===t?(l=!0,0):(!e.compareDocumentPosition||!t.compareDocumentPosition?e.compareDocumentPosition:e.compareDocumentPosition(t)&4)?-1:1}:function(e,t){if(e===t)return l=!0,0;if(e.sourceIndex&&t.sourceIndex)return e.sourceIndex-t.sourceIndex;var n,r,i=[],s=[],o=e.parentNode,u=t.parentNode,a=o;if(o===u)return ot(e,t);if(!o)return-1;if(!u)return 1;while(a)i.unshift(a),a=a.parentNode;a=u;while(a)s.unshift(a),a=a.parentNode;n=i.length,r=s.length;for(var f=0;f<n&&f<r;f++)if(i[f]!==s[f])return ot(i[f],s[f]);return f===n?ot(e,s[f],-1):ot(i[f],t,1)},[0,0].sort(f),h=!l,nt.uniqueSort=function(e){var t,n=[],r=1,i=0;l=h,e.sort(f);if(l){for(;t=e[r];r++)t===e[r-1]&&(i=n.push(r));while(i--)e.splice(n[i],1)}return e},nt.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},a=nt.compile=function(e,t){var n,r=[],i=[],s=A[d][e+" "];if(!s){t||(t=ut(e)),n=t.length;while(n--)s=ht(t[n]),s[d]?r.push(s):i.push(s);s=A(e,pt(i,r))}return s},g.querySelectorAll&&function(){var e,t=vt,n=/'|\\/g,r=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,i=[":focus"],s=[":active"],u=y.matchesSelector||y.mozMatchesSelector||y.webkitMatchesSelector||y.oMatchesSelector||y.msMatchesSelector;K(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||i.push("\\["+O+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||i.push(":checked")}),K(function(e){e.innerHTML="<p test=''></p>",e.querySelectorAll("[test^='']").length&&i.push("[*^$]="+O+"*(?:\"\"|'')"),e.innerHTML="<input type='hidden'/>",e.querySelectorAll(":enabled").length||i.push(":enabled",":disabled")}),i=new RegExp(i.join("|")),vt=function(e,r,s,o,u){if(!o&&!u&&!i.test(e)){var a,f,l=!0,c=d,h=r,p=r.nodeType===9&&e;if(r.nodeType===1&&r.nodeName.toLowerCase()!=="object"){a=ut(e),(l=r.getAttribute("id"))?c=l.replace(n,"\\$&"):r.setAttribute("id",c),c="[id='"+c+"'] ",f=a.length;while(f--)a[f]=c+a[f].join("");h=z.test(e)&&r.parentNode||r,p=a.join(",")}if(p)try{return S.apply(s,x.call(h.querySelectorAll(p),0)),s}catch(v){}finally{l||r.removeAttribute("id")}}return t(e,r,s,o,u)},u&&(K(function(t){e=u.call(t,"div");try{u.call(t,"[test!='']:sizzle"),s.push("!=",H)}catch(n){}}),s=new RegExp(s.join("|")),nt.matchesSelector=function(t,n){n=n.replace(r,"='$1']");if(!o(t)&&!s.test(n)&&!i.test(n))try{var a=u.call(t,n);if(a||e||t.document&&t.document.nodeType!==11)return a}catch(f){}return nt(n,null,null,[t]).length>0})}(),i.pseudos.nth=i.pseudos.eq,i.filters=mt.prototype=i.pseudos,i.setFilters=new mt,nt.attr=v.attr,v.find=nt,v.expr=nt.selectors,v.expr[":"]=v.expr.pseudos,v.unique=nt.uniqueSort,v.text=nt.getText,v.isXMLDoc=nt.isXML,v.contains=nt.contains}(e);var nt=/Until$/,rt=/^(?:parents|prev(?:Until|All))/,it=/^.[^:#\[\.,]*$/,st=v.expr.match.needsContext,ot={children:!0,contents:!0,next:!0,prev:!0};v.fn.extend({find:function(e){var t,n,r,i,s,o,u=this;if(typeof e!="string")return v(e).filter(function(){for(t=0,n=u.length;t<n;t++)if(v.contains(u[t],this))return!0});o=this.pushStack("","find",e);for(t=0,n=this.length;t<n;t++){r=o.length,v.find(e,this[t],o);if(t>0)for(i=r;i<o.length;i++)for(s=0;s<r;s++)if(o[s]===o[i]){o.splice(i--,1);break}}return o},has:function(e){var t,n=v(e,this),r=n.length;return this.filter(function(){for(t=0;t<r;t++)if(v.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e,!1),"not",e)},filter:function(e){return this.pushStack(ft(this,e,!0),"filter",e)},is:function(e){return!!e&&(typeof e=="string"?st.test(e)?v(e,this.context).index(this[0])>=0:v.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,s=[],o=st.test(e)||typeof e!="string"?v(e,t||this.context):0;for(;r<i;r++){n=this[r];while(n&&n.ownerDocument&&n!==t&&n.nodeType!==11){if(o?o.index(n)>-1:v.find.matchesSelector(n,e)){s.push(n);break}n=n.parentNode}}return s=s.length>1?v.unique(s):s,this.pushStack(s,"closest",e)},index:function(e){return e?typeof e=="string"?v.inArray(this[0],v(e)):v.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(e,t){var n=typeof e=="string"?v(e,t):v.makeArray(e&&e.nodeType?[e]:e),r=v.merge(this.get(),n);return this.pushStack(ut(n[0])||ut(r[0])?r:v.unique(r))},addBack:function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}}),v.fn.andSelf=v.fn.addBack,v.each({parent:function(e){var t=e.parentNode;return t&&t.nodeType!==11?t:null},parents:function(e){return v.dir(e,"parentNode")},parentsUntil:function(e,t,n){return v.dir(e,"parentNode",n)},next:function(e){return at(e,"nextSibling")},prev:function(e){return at(e,"previousSibling")},nextAll:function(e){return v.dir(e,"nextSibling")},prevAll:function(e){return v.dir(e,"previousSibling")},nextUntil:function(e,t,n){return v.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return v.dir(e,"previousSibling",n)},siblings:function(e){return v.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return v.sibling(e.firstChild)},contents:function(e){return v.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:v.merge([],e.childNodes)}},function(e,t){v.fn[e]=function(n,r){var i=v.map(this,t,n);return nt.test(e)||(r=n),r&&typeof r=="string"&&(i=v.filter(r,i)),i=this.length>1&&!ot[e]?v.unique(i):i,this.length>1&&rt.test(e)&&(i=i.reverse()),this.pushStack(i,e,l.call(arguments).join(","))}}),v.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),t.length===1?v.find.matchesSelector(t[0],e)?[t[0]]:[]:v.find.matches(e,t)},dir:function(e,n,r){var i=[],s=e[n];while(s&&s.nodeType!==9&&(r===t||s.nodeType!==1||!v(s).is(r)))s.nodeType===1&&i.push(s),s=s[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)e.nodeType===1&&e!==t&&n.push(e);return n}});var ct="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",ht=/ jQuery\d+="(?:null|\d+)"/g,pt=/^\s+/,dt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,vt=/<([\w:]+)/,mt=/<tbody/i,gt=/<|&#?\w+;/,yt=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,wt=new RegExp("<(?:"+ct+")[\\s/>]","i"),Et=/^(?:checkbox|radio)$/,St=/checked\s*(?:[^=]|=\s*.checked.)/i,xt=/\/(java|ecma)script/i,Tt=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,Nt={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},Ct=lt(i),kt=Ct.appendChild(i.createElement("div"));Nt.optgroup=Nt.option,Nt.tbody=Nt.tfoot=Nt.colgroup=Nt.caption=Nt.thead,Nt.th=Nt.td,v.support.htmlSerialize||(Nt._default=[1,"X<div>","</div>"]),v.fn.extend({text:function(e){return v.access(this,function(e){return e===t?v.text(this):this.empty().append((this[0]&&this[0].ownerDocument||i).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(v.isFunction(e))return this.each(function(t){v(this).wrapAll(e.call(this,t))});if(this[0]){var t=v(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&e.firstChild.nodeType===1)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return v.isFunction(e)?this.each(function(t){v(this).wrapInner(e.call(this,t))}):this.each(function(){var t=v(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=v.isFunction(e);return this.each(function(n){v(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){v.nodeName(this,"body")||v(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(e,this.firstChild)})},before:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(e,this),"before",this.selector)}},after:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this.nextSibling)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(this,e),"after",this.selector)}},remove:function(e,t){var n,r=0;for(;(n=this[r])!=null;r++)if(!e||v.filter(e,[n]).length)!t&&n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),v.cleanData([n])),n.parentNode&&n.parentNode.removeChild(n);return this},empty:function(){var e,t=0;for(;(e=this[t])!=null;t++){e.nodeType===1&&v.cleanData(e.getElementsByTagName("*"));while(e.firstChild)e.removeChild(e.firstChild)}return this},clone:function(e,t){return e=e==null?!1:e,t=t==null?e:t,this.map(function(){return v.clone(this,e,t)})},html:function(e){return v.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return n.nodeType===1?n.innerHTML.replace(ht,""):t;if(typeof e=="string"&&!yt.test(e)&&(v.support.htmlSerialize||!wt.test(e))&&(v.support.leadingWhitespace||!pt.test(e))&&!Nt[(vt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(dt,"<$1></$2>");try{for(;r<i;r++)n=this[r]||{},n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),n.innerHTML=e);n=0}catch(s){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){return ut(this[0])?this.length?this.pushStack(v(v.isFunction(e)?e():e),"replaceWith",e):this:v.isFunction(e)?this.each(function(t){var n=v(this),r=n.html();n.replaceWith(e.call(this,t,r))}):(typeof e!="string"&&(e=v(e).detach()),this.each(function(){var t=this.nextSibling,n=this.parentNode;v(this).remove(),t?v(t).before(e):v(n).append(e)}))},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,r){e=[].concat.apply([],e);var i,s,o,u,a=0,f=e[0],l=[],c=this.length;if(!v.support.checkClone&&c>1&&typeof f=="string"&&St.test(f))return this.each(function(){v(this).domManip(e,n,r)});if(v.isFunction(f))return this.each(function(i){var s=v(this);e[0]=f.call(this,i,n?s.html():t),s.domManip(e,n,r)});if(this[0]){i=v.buildFragment(e,this,l),o=i.fragment,s=o.firstChild,o.childNodes.length===1&&(o=s);if(s){n=n&&v.nodeName(s,"tr");for(u=i.cacheable||c-1;a<c;a++)r.call(n&&v.nodeName(this[a],"table")?Lt(this[a],"tbody"):this[a],a===u?o:v.clone(o,!0,!0))}o=s=null,l.length&&v.each(l,function(e,t){t.src?v.ajax?v.ajax({url:t.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):v.error("no ajax"):v.globalEval((t.text||t.textContent||t.innerHTML||"").replace(Tt,"")),t.parentNode&&t.parentNode.removeChild(t)})}return this}}),v.buildFragment=function(e,n,r){var s,o,u,a=e[0];return n=n||i,n=!n.nodeType&&n[0]||n,n=n.ownerDocument||n,e.length===1&&typeof a=="string"&&a.length<512&&n===i&&a.charAt(0)==="<"&&!bt.test(a)&&(v.support.checkClone||!St.test(a))&&(v.support.html5Clone||!wt.test(a))&&(o=!0,s=v.fragments[a],u=s!==t),s||(s=n.createDocumentFragment(),v.clean(e,n,s,r),o&&(v.fragments[a]=u&&s)),{fragment:s,cacheable:o}},v.fragments={},v.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){v.fn[e]=function(n){var r,i=0,s=[],o=v(n),u=o.length,a=this.length===1&&this[0].parentNode;if((a==null||a&&a.nodeType===11&&a.childNodes.length===1)&&u===1)return o[t](this[0]),this;for(;i<u;i++)r=(i>0?this.clone(!0):this).get(),v(o[i])[t](r),s=s.concat(r);return this.pushStack(s,e,o.selector)}}),v.extend({clone:function(e,t,n){var r,i,s,o;v.support.html5Clone||v.isXMLDoc(e)||!wt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(kt.innerHTML=e.outerHTML,kt.removeChild(o=kt.firstChild));if((!v.support.noCloneEvent||!v.support.noCloneChecked)&&(e.nodeType===1||e.nodeType===11)&&!v.isXMLDoc(e)){Ot(e,o),r=Mt(e),i=Mt(o);for(s=0;r[s];++s)i[s]&&Ot(r[s],i[s])}if(t){At(e,o);if(n){r=Mt(e),i=Mt(o);for(s=0;r[s];++s)At(r[s],i[s])}}return r=i=null,o},clean:function(e,t,n,r){var s,o,u,a,f,l,c,h,p,d,m,g,y=t===i&&Ct,b=[];if(!t||typeof t.createDocumentFragment=="undefined")t=i;for(s=0;(u=e[s])!=null;s++){typeof u=="number"&&(u+="");if(!u)continue;if(typeof u=="string")if(!gt.test(u))u=t.createTextNode(u);else{y=y||lt(t),c=t.createElement("div"),y.appendChild(c),u=u.replace(dt,"<$1></$2>"),a=(vt.exec(u)||["",""])[1].toLowerCase(),f=Nt[a]||Nt._default,l=f[0],c.innerHTML=f[1]+u+f[2];while(l--)c=c.lastChild;if(!v.support.tbody){h=mt.test(u),p=a==="table"&&!h?c.firstChild&&c.firstChild.childNodes:f[1]==="<table>"&&!h?c.childNodes:[];for(o=p.length-1;o>=0;--o)v.nodeName(p[o],"tbody")&&!p[o].childNodes.length&&p[o].parentNode.removeChild(p[o])}!v.support.leadingWhitespace&&pt.test(u)&&c.insertBefore(t.createTextNode(pt.exec(u)[0]),c.firstChild),u=c.childNodes,c.parentNode.removeChild(c)}u.nodeType?b.push(u):v.merge(b,u)}c&&(u=c=y=null);if(!v.support.appendChecked)for(s=0;(u=b[s])!=null;s++)v.nodeName(u,"input")?_t(u):typeof u.getElementsByTagName!="undefined"&&v.grep(u.getElementsByTagName("input"),_t);if(n){m=function(e){if(!e.type||xt.test(e.type))return r?r.push(e.parentNode?e.parentNode.removeChild(e):e):n.appendChild(e)};for(s=0;(u=b[s])!=null;s++)if(!v.nodeName(u,"script")||!m(u))n.appendChild(u),typeof u.getElementsByTagName!="undefined"&&(g=v.grep(v.merge([],u.getElementsByTagName("script")),m),b.splice.apply(b,[s+1,0].concat(g)),s+=g.length)}return b},cleanData:function(e,t){var n,r,i,s,o=0,u=v.expando,a=v.cache,f=v.support.deleteExpando,l=v.event.special;for(;(i=e[o])!=null;o++)if(t||v.acceptData(i)){r=i[u],n=r&&a[r];if(n){if(n.events)for(s in n.events)l[s]?v.event.remove(i,s):v.removeEvent(i,s,n.handle);a[r]&&(delete a[r],f?delete i[u]:i.removeAttribute?i.removeAttribute(u):i[u]=null,v.deletedIds.push(r))}}}}),function(){var e,t;v.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e=v.uaMatch(o.userAgent),t={},e.browser&&(t[e.browser]=!0,t.version=e.version),t.chrome?t.webkit=!0:t.webkit&&(t.safari=!0),v.browser=t,v.sub=function(){function e(t,n){return new e.fn.init(t,n)}v.extend(!0,e,this),e.superclass=this,e.fn=e.prototype=this(),e.fn.constructor=e,e.sub=this.sub,e.fn.init=function(r,i){return i&&i instanceof v&&!(i instanceof e)&&(i=e(i)),v.fn.init.call(this,r,i,t)},e.fn.init.prototype=e.fn;var t=e(i);return e}}();var Dt,Pt,Ht,Bt=/alpha\([^)]*\)/i,jt=/opacity=([^)]*)/,Ft=/^(top|right|bottom|left)$/,It=/^(none|table(?!-c[ea]).+)/,qt=/^margin/,Rt=new RegExp("^("+m+")(.*)$","i"),Ut=new RegExp("^("+m+")(?!px)[a-z%]+$","i"),zt=new RegExp("^([-+])=("+m+")","i"),Wt={BODY:"block"},Xt={position:"absolute",visibility:"hidden",display:"block"},Vt={letterSpacing:0,fontWeight:400},$t=["Top","Right","Bottom","Left"],Jt=["Webkit","O","Moz","ms"],Kt=v.fn.toggle;v.fn.extend({css:function(e,n){return v.access(this,function(e,n,r){return r!==t?v.style(e,n,r):v.css(e,n)},e,n,arguments.length>1)},show:function(){return Yt(this,!0)},hide:function(){return Yt(this)},toggle:function(e,t){var n=typeof e=="boolean";return v.isFunction(e)&&v.isFunction(t)?Kt.apply(this,arguments):this.each(function(){(n?e:Gt(this))?v(this).show():v(this).hide()})}}),v.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Dt(e,"opacity");return n===""?"1":n}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":v.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(!e||e.nodeType===3||e.nodeType===8||!e.style)return;var s,o,u,a=v.camelCase(n),f=e.style;n=v.cssProps[a]||(v.cssProps[a]=Qt(f,a)),u=v.cssHooks[n]||v.cssHooks[a];if(r===t)return u&&"get"in u&&(s=u.get(e,!1,i))!==t?s:f[n];o=typeof r,o==="string"&&(s=zt.exec(r))&&(r=(s[1]+1)*s[2]+parseFloat(v.css(e,n)),o="number");if(r==null||o==="number"&&isNaN(r))return;o==="number"&&!v.cssNumber[a]&&(r+="px");if(!u||!("set"in u)||(r=u.set(e,r,i))!==t)try{f[n]=r}catch(l){}},css:function(e,n,r,i){var s,o,u,a=v.camelCase(n);return n=v.cssProps[a]||(v.cssProps[a]=Qt(e.style,a)),u=v.cssHooks[n]||v.cssHooks[a],u&&"get"in u&&(s=u.get(e,!0,i)),s===t&&(s=Dt(e,n)),s==="normal"&&n in Vt&&(s=Vt[n]),r||i!==t?(o=parseFloat(s),r||v.isNumeric(o)?o||0:s):s},swap:function(e,t,n){var r,i,s={};for(i in t)s[i]=e.style[i],e.style[i]=t[i];r=n.call(e);for(i in t)e.style[i]=s[i];return r}}),e.getComputedStyle?Dt=function(t,n){var r,i,s,o,u=e.getComputedStyle(t,null),a=t.style;return u&&(r=u.getPropertyValue(n)||u[n],r===""&&!v.contains(t.ownerDocument,t)&&(r=v.style(t,n)),Ut.test(r)&&qt.test(n)&&(i=a.width,s=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=r,r=u.width,a.width=i,a.minWidth=s,a.maxWidth=o)),r}:i.documentElement.currentStyle&&(Dt=function(e,t){var n,r,i=e.currentStyle&&e.currentStyle[t],s=e.style;return i==null&&s&&s[t]&&(i=s[t]),Ut.test(i)&&!Ft.test(t)&&(n=s.left,r=e.runtimeStyle&&e.runtimeStyle.left,r&&(e.runtimeStyle.left=e.currentStyle.left),s.left=t==="fontSize"?"1em":i,i=s.pixelLeft+"px",s.left=n,r&&(e.runtimeStyle.left=r)),i===""?"auto":i}),v.each(["height","width"],function(e,t){v.cssHooks[t]={get:function(e,n,r){if(n)return e.offsetWidth===0&&It.test(Dt(e,"display"))?v.swap(e,Xt,function(){return tn(e,t,r)}):tn(e,t,r)},set:function(e,n,r){return Zt(e,n,r?en(e,t,r,v.support.boxSizing&&v.css(e,"boxSizing")==="border-box"):0)}}}),v.support.opacity||(v.cssHooks.opacity={get:function(e,t){return jt.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=v.isNumeric(t)?"alpha(opacity="+t*100+")":"",s=r&&r.filter||n.filter||"";n.zoom=1;if(t>=1&&v.trim(s.replace(Bt,""))===""&&n.removeAttribute){n.removeAttribute("filter");if(r&&!r.filter)return}n.filter=Bt.test(s)?s.replace(Bt,i):s+" "+i}}),v(function(){v.support.reliableMarginRight||(v.cssHooks.marginRight={get:function(e,t){return v.swap(e,{display:"inline-block"},function(){if(t)return Dt(e,"marginRight")})}}),!v.support.pixelPosition&&v.fn.position&&v.each(["top","left"],function(e,t){v.cssHooks[t]={get:function(e,n){if(n){var r=Dt(e,t);return Ut.test(r)?v(e).position()[t]+"px":r}}}})}),v.expr&&v.expr.filters&&(v.expr.filters.hidden=function(e){return e.offsetWidth===0&&e.offsetHeight===0||!v.support.reliableHiddenOffsets&&(e.style&&e.style.display||Dt(e,"display"))==="none"},v.expr.filters.visible=function(e){return!v.expr.filters.hidden(e)}),v.each({margin:"",padding:"",border:"Width"},function(e,t){v.cssHooks[e+t]={expand:function(n){var r,i=typeof n=="string"?n.split(" "):[n],s={};for(r=0;r<4;r++)s[e+$t[r]+t]=i[r]||i[r-2]||i[0];return s}},qt.test(e)||(v.cssHooks[e+t].set=Zt)});var rn=/%20/g,sn=/\[\]$/,on=/\r?\n/g,un=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,an=/^(?:select|textarea)/i;v.fn.extend({serialize:function(){return v.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?v.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||an.test(this.nodeName)||un.test(this.type))}).map(function(e,t){var n=v(this).val();return n==null?null:v.isArray(n)?v.map(n,function(e,n){return{name:t.name,value:e.replace(on,"\r\n")}}):{name:t.name,value:n.replace(on,"\r\n")}}).get()}}),v.param=function(e,n){var r,i=[],s=function(e,t){t=v.isFunction(t)?t():t==null?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};n===t&&(n=v.ajaxSettings&&v.ajaxSettings.traditional);if(v.isArray(e)||e.jquery&&!v.isPlainObject(e))v.each(e,function(){s(this.name,this.value)});else for(r in e)fn(r,e[r],n,s);return i.join("&").replace(rn,"+")};var ln,cn,hn=/#.*$/,pn=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,dn=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,vn=/^(?:GET|HEAD)$/,mn=/^\/\//,gn=/\?/,yn=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bn=/([?&])_=[^&]*/,wn=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,En=v.fn.load,Sn={},xn={},Tn=["*/"]+["*"];try{cn=s.href}catch(Nn){cn=i.createElement("a"),cn.href="",cn=cn.href}ln=wn.exec(cn.toLowerCase())||[],v.fn.load=function(e,n,r){if(typeof e!="string"&&En)return En.apply(this,arguments);if(!this.length)return this;var i,s,o,u=this,a=e.indexOf(" ");return a>=0&&(i=e.slice(a,e.length),e=e.slice(0,a)),v.isFunction(n)?(r=n,n=t):n&&typeof n=="object"&&(s="POST"),v.ajax({url:e,type:s,dataType:"html",data:n,complete:function(e,t){r&&u.each(r,o||[e.responseText,t,e])}}).done(function(e){o=arguments,u.html(i?v("<div>").append(e.replace(yn,"")).find(i):e)}),this},v.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(e,t){v.fn[t]=function(e){return this.on(t,e)}}),v.each(["get","post"],function(e,n){v[n]=function(e,r,i,s){return v.isFunction(r)&&(s=s||i,i=r,r=t),v.ajax({type:n,url:e,data:r,success:i,dataType:s})}}),v.extend({getScript:function(e,n){return v.get(e,t,n,"script")},getJSON:function(e,t,n){return v.get(e,t,n,"json")},ajaxSetup:function(e,t){return t?Ln(e,v.ajaxSettings):(t=e,e=v.ajaxSettings),Ln(e,t),e},ajaxSettings:{url:cn,isLocal:dn.test(ln[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":Tn},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":v.parseJSON,"text xml":v.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:Cn(Sn),ajaxTransport:Cn(xn),ajax:function(e,n){function T(e,n,s,a){var l,y,b,w,S,T=n;if(E===2)return;E=2,u&&clearTimeout(u),o=t,i=a||"",x.readyState=e>0?4:0,s&&(w=An(c,x,s));if(e>=200&&e<300||e===304)c.ifModified&&(S=x.getResponseHeader("Last-Modified"),S&&(v.lastModified[r]=S),S=x.getResponseHeader("Etag"),S&&(v.etag[r]=S)),e===304?(T="notmodified",l=!0):(l=On(c,w),T=l.state,y=l.data,b=l.error,l=!b);else{b=T;if(!T||e)T="error",e<0&&(e=0)}x.status=e,x.statusText=(n||T)+"",l?d.resolveWith(h,[y,T,x]):d.rejectWith(h,[x,T,b]),x.statusCode(g),g=t,f&&p.trigger("ajax"+(l?"Success":"Error"),[x,c,l?y:b]),m.fireWith(h,[x,T]),f&&(p.trigger("ajaxComplete",[x,c]),--v.active||v.event.trigger("ajaxStop"))}typeof e=="object"&&(n=e,e=t),n=n||{};var r,i,s,o,u,a,f,l,c=v.ajaxSetup({},n),h=c.context||c,p=h!==c&&(h.nodeType||h instanceof v)?v(h):v.event,d=v.Deferred(),m=v.Callbacks("once memory"),g=c.statusCode||{},b={},w={},E=0,S="canceled",x={readyState:0,setRequestHeader:function(e,t){if(!E){var n=e.toLowerCase();e=w[n]=w[n]||e,b[e]=t}return this},getAllResponseHeaders:function(){return E===2?i:null},getResponseHeader:function(e){var n;if(E===2){if(!s){s={};while(n=pn.exec(i))s[n[1].toLowerCase()]=n[2]}n=s[e.toLowerCase()]}return n===t?null:n},overrideMimeType:function(e){return E||(c.mimeType=e),this},abort:function(e){return e=e||S,o&&o.abort(e),T(0,e),this}};d.promise(x),x.success=x.done,x.error=x.fail,x.complete=m.add,x.statusCode=function(e){if(e){var t;if(E<2)for(t in e)g[t]=[g[t],e[t]];else t=e[x.status],x.always(t)}return this},c.url=((e||c.url)+"").replace(hn,"").replace(mn,ln[1]+"//"),c.dataTypes=v.trim(c.dataType||"*").toLowerCase().split(y),c.crossDomain==null&&(a=wn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===ln[1]&&a[2]===ln[2]&&(a[3]||(a[1]==="http:"?80:443))==(ln[3]||(ln[1]==="http:"?80:443)))),c.data&&c.processData&&typeof c.data!="string"&&(c.data=v.param(c.data,c.traditional)),kn(Sn,c,n,x);if(E===2)return x;f=c.global,c.type=c.type.toUpperCase(),c.hasContent=!vn.test(c.type),f&&v.active++===0&&v.event.trigger("ajaxStart");if(!c.hasContent){c.data&&(c.url+=(gn.test(c.url)?"&":"?")+c.data,delete c.data),r=c.url;if(c.cache===!1){var N=v.now(),C=c.url.replace(bn,"$1_="+N);c.url=C+(C===c.url?(gn.test(c.url)?"&":"?")+"_="+N:"")}}(c.data&&c.hasContent&&c.contentType!==!1||n.contentType)&&x.setRequestHeader("Content-Type",c.contentType),c.ifModified&&(r=r||c.url,v.lastModified[r]&&x.setRequestHeader("If-Modified-Since",v.lastModified[r]),v.etag[r]&&x.setRequestHeader("If-None-Match",v.etag[r])),x.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+(c.dataTypes[0]!=="*"?", "+Tn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)x.setRequestHeader(l,c.headers[l]);if(!c.beforeSend||c.beforeSend.call(h,x,c)!==!1&&E!==2){S="abort";for(l in{success:1,error:1,complete:1})x[l](c[l]);o=kn(xn,c,n,x);if(!o)T(-1,"No Transport");else{x.readyState=1,f&&p.trigger("ajaxSend",[x,c]),c.async&&c.timeout>0&&(u=setTimeout(function(){x.abort("timeout")},c.timeout));try{E=1,o.send(b,T)}catch(k){if(!(E<2))throw k;T(-1,k)}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var Mn=[],_n=/\?/,Dn=/(=)\?(?=&|$)|\?\?/,Pn=v.now();v.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Mn.pop()||v.expando+"_"+Pn++;return this[e]=!0,e}}),v.ajaxPrefilter("json jsonp",function(n,r,i){var s,o,u,a=n.data,f=n.url,l=n.jsonp!==!1,c=l&&Dn.test(f),h=l&&!c&&typeof a=="string"&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Dn.test(a);if(n.dataTypes[0]==="jsonp"||c||h)return s=n.jsonpCallback=v.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,o=e[s],c?n.url=f.replace(Dn,"$1"+s):h?n.data=a.replace(Dn,"$1"+s):l&&(n.url+=(_n.test(f)?"&":"?")+n.jsonp+"="+s),n.converters["script json"]=function(){return u||v.error(s+" was not called"),u[0]},n.dataTypes[0]="json",e[s]=function(){u=arguments},i.always(function(){e[s]=o,n[s]&&(n.jsonpCallback=r.jsonpCallback,Mn.push(s)),u&&v.isFunction(o)&&o(u[0]),u=o=t}),"script"}),v.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(e){return v.globalEval(e),e}}}),v.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),v.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=i.head||i.getElementsByTagName("head")[0]||i.documentElement;return{send:function(s,o){n=i.createElement("script"),n.async="async",e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,i){if(i||!n.readyState||/loaded|complete/.test(n.readyState))n.onload=n.onreadystatechange=null,r&&n.parentNode&&r.removeChild(n),n=t,i||o(200,"success")},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(0,1)}}}});var Hn,Bn=e.ActiveXObject?function(){for(var e in Hn)Hn[e](0,1)}:!1,jn=0;v.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&Fn()||In()}:Fn,function(e){v.extend(v.support,{ajax:!!e,cors:!!e&&"withCredentials"in e})}(v.ajaxSettings.xhr()),v.support.ajax&&v.ajaxTransport(function(n){if(!n.crossDomain||v.support.cors){var r;return{send:function(i,s){var o,u,a=n.xhr();n.username?a.open(n.type,n.url,n.async,n.username,n.password):a.open(n.type,n.url,n.async);if(n.xhrFields)for(u in n.xhrFields)a[u]=n.xhrFields[u];n.mimeType&&a.overrideMimeType&&a.overrideMimeType(n.mimeType),!n.crossDomain&&!i["X-Requested-With"]&&(i["X-Requested-With"]="XMLHttpRequest");try{for(u in i)a.setRequestHeader(u,i[u])}catch(f){}a.send(n.hasContent&&n.data||null),r=function(e,i){var u,f,l,c,h;try{if(r&&(i||a.readyState===4)){r=t,o&&(a.onreadystatechange=v.noop,Bn&&delete Hn[o]);if(i)a.readyState!==4&&a.abort();else{u=a.status,l=a.getAllResponseHeaders(),c={},h=a.responseXML,h&&h.documentElement&&(c.xml=h);try{c.text=a.responseText}catch(p){}try{f=a.statusText}catch(p){f=""}!u&&n.isLocal&&!n.crossDomain?u=c.text?200:404:u===1223&&(u=204)}}}catch(d){i||s(-1,d)}c&&s(u,f,c,l)},n.async?a.readyState===4?setTimeout(r,0):(o=++jn,Bn&&(Hn||(Hn={},v(e).unload(Bn)),Hn[o]=r),a.onreadystatechange=r):r()},abort:function(){r&&r(0,1)}}}});var qn,Rn,Un=/^(?:toggle|show|hide)$/,zn=new RegExp("^(?:([-+])=|)("+m+")([a-z%]*)$","i"),Wn=/queueHooks$/,Xn=[Gn],Vn={"*":[function(e,t){var n,r,i=this.createTween(e,t),s=zn.exec(t),o=i.cur(),u=+o||0,a=1,f=20;if(s){n=+s[2],r=s[3]||(v.cssNumber[e]?"":"px");if(r!=="px"&&u){u=v.css(i.elem,e,!0)||n||1;do a=a||".5",u/=a,v.style(i.elem,e,u+r);while(a!==(a=i.cur()/o)&&a!==1&&--f)}i.unit=r,i.start=u,i.end=s[1]?u+(s[1]+1)*n:n}return i}]};v.Animation=v.extend(Kn,{tweener:function(e,t){v.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;r<i;r++)n=e[r],Vn[n]=Vn[n]||[],Vn[n].unshift(t)},prefilter:function(e,t){t?Xn.unshift(e):Xn.push(e)}}),v.Tween=Yn,Yn.prototype={constructor:Yn,init:function(e,t,n,r,i,s){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=s||(v.cssNumber[n]?"":"px")},cur:function(){var e=Yn.propHooks[this.prop];return e&&e.get?e.get(this):Yn.propHooks._default.get(this)},run:function(e){var t,n=Yn.propHooks[this.prop];return this.options.duration?this.pos=t=v.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Yn.propHooks._default.set(this),this}},Yn.prototype.init.prototype=Yn.prototype,Yn.propHooks={_default:{get:function(e){var t;return e.elem[e.prop]==null||!!e.elem.style&&e.elem.style[e.prop]!=null?(t=v.css(e.elem,e.prop,!1,""),!t||t==="auto"?0:t):e.elem[e.prop]},set:function(e){v.fx.step[e.prop]?v.fx.step[e.prop](e):e.elem.style&&(e.elem.style[v.cssProps[e.prop]]!=null||v.cssHooks[e.prop])?v.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Yn.propHooks.scrollTop=Yn.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},v.each(["toggle","show","hide"],function(e,t){var n=v.fn[t];v.fn[t]=function(r,i,s){return r==null||typeof r=="boolean"||!e&&v.isFunction(r)&&v.isFunction(i)?n.apply(this,arguments):this.animate(Zn(t,!0),r,i,s)}}),v.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Gt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=v.isEmptyObject(e),s=v.speed(t,n,r),o=function(){var t=Kn(this,v.extend({},e),s);i&&t.stop(!0)};return i||s.queue===!1?this.each(o):this.queue(s.queue,o)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return typeof e!="string"&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=e!=null&&e+"queueHooks",s=v.timers,o=v._data(this);if(n)o[n]&&o[n].stop&&i(o[n]);else for(n in o)o[n]&&o[n].stop&&Wn.test(n)&&i(o[n]);for(n=s.length;n--;)s[n].elem===this&&(e==null||s[n].queue===e)&&(s[n].anim.stop(r),t=!1,s.splice(n,1));(t||!r)&&v.dequeue(this,e)})}}),v.each({slideDown:Zn("show"),slideUp:Zn("hide"),slideToggle:Zn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){v.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),v.speed=function(e,t,n){var r=e&&typeof e=="object"?v.extend({},e):{complete:n||!n&&t||v.isFunction(e)&&e,duration:e,easing:n&&t||t&&!v.isFunction(t)&&t};r.duration=v.fx.off?0:typeof r.duration=="number"?r.duration:r.duration in v.fx.speeds?v.fx.speeds[r.duration]:v.fx.speeds._default;if(r.queue==null||r.queue===!0)r.queue="fx";return r.old=r.complete,r.complete=function(){v.isFunction(r.old)&&r.old.call(this),r.queue&&v.dequeue(this,r.queue)},r},v.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},v.timers=[],v.fx=Yn.prototype.init,v.fx.tick=function(){var e,n=v.timers,r=0;qn=v.now();for(;r<n.length;r++)e=n[r],!e()&&n[r]===e&&n.splice(r--,1);n.length||v.fx.stop(),qn=t},v.fx.timer=function(e){e()&&v.timers.push(e)&&!Rn&&(Rn=setInterval(v.fx.tick,v.fx.interval))},v.fx.interval=13,v.fx.stop=function(){clearInterval(Rn),Rn=null},v.fx.speeds={slow:600,fast:200,_default:400},v.fx.step={},v.expr&&v.expr.filters&&(v.expr.filters.animated=function(e){return v.grep(v.timers,function(t){return e===t.elem}).length});var er=/^(?:body|html)$/i;v.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){v.offset.setOffset(this,e,t)});var n,r,i,s,o,u,a,f={top:0,left:0},l=this[0],c=l&&l.ownerDocument;if(!c)return;return(r=c.body)===l?v.offset.bodyOffset(l):(n=c.documentElement,v.contains(n,l)?(typeof l.getBoundingClientRect!="undefined"&&(f=l.getBoundingClientRect()),i=tr(c),s=n.clientTop||r.clientTop||0,o=n.clientLeft||r.clientLeft||0,u=i.pageYOffset||n.scrollTop,a=i.pageXOffset||n.scrollLeft,{top:f.top+u-s,left:f.left+a-o}):f)},v.offset={bodyOffset:function(e){var t=e.offsetTop,n=e.offsetLeft;return v.support.doesNotIncludeMarginInBodyOffset&&(t+=parseFloat(v.css(e,"marginTop"))||0,n+=parseFloat(v.css(e,"marginLeft"))||0),{top:t,left:n}},setOffset:function(e,t,n){var r=v.css(e,"position");r==="static"&&(e.style.position="relative");var i=v(e),s=i.offset(),o=v.css(e,"top"),u=v.css(e,"left"),a=(r==="absolute"||r==="fixed")&&v.inArray("auto",[o,u])>-1,f={},l={},c,h;a?(l=i.position(),c=l.top,h=l.left):(c=parseFloat(o)||0,h=parseFloat(u)||0),v.isFunction(t)&&(t=t.call(e,n,s)),t.top!=null&&(f.top=t.top-s.top+c),t.left!=null&&(f.left=t.left-s.left+h),"using"in t?t.using.call(e,f):i.css(f)}},v.fn.extend({position:function(){if(!this[0])return;var e=this[0],t=this.offsetParent(),n=this.offset(),r=er.test(t[0].nodeName)?{top:0,left:0}:t.offset();return n.top-=parseFloat(v.css(e,"marginTop"))||0,n.left-=parseFloat(v.css(e,"marginLeft"))||0,r.top+=parseFloat(v.css(t[0],"borderTopWidth"))||0,r.left+=parseFloat(v.css(t[0],"borderLeftWidth"))||0,{top:n.top-r.top,left:n.left-r.left}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||i.body;while(e&&!er.test(e.nodeName)&&v.css(e,"position")==="static")e=e.offsetParent;return e||i.body})}}),v.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);v.fn[e]=function(i){return v.access(this,function(e,i,s){var o=tr(e);if(s===t)return o?n in o?o[n]:o.document.documentElement[i]:e[i];o?o.scrollTo(r?v(o).scrollLeft():s,r?s:v(o).scrollTop()):e[i]=s},e,i,arguments.length,null)}}),v.each({Height:"height",Width:"width"},function(e,n){v.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){v.fn[i]=function(i,s){var o=arguments.length&&(r||typeof i!="boolean"),u=r||(i===!0||s===!0?"margin":"border");return v.access(this,function(n,r,i){var s;return v.isWindow(n)?n.document.documentElement["client"+e]:n.nodeType===9?(s=n.documentElement,Math.max(n.body["scroll"+e],s["scroll"+e],n.body["offset"+e],s["offset"+e],s["client"+e])):i===t?v.css(n,r,i,u):v.style(n,r,i,u)},n,o?i:t,o,null)}})}),e.jQuery=e.$=v,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return v})})(window);
/*! jQuery UI - v1.9.2 - 2012-11-23
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.slider.js, jquery.ui.sortable.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js
* Copyright (c) 2012 jQuery Foundation and other contributors Licensed MIT */

(function(e,t){function i(t,n){var r,i,o,u=t.nodeName.toLowerCase();return"area"===u?(r=t.parentNode,i=r.name,!t.href||!i||r.nodeName.toLowerCase()!=="map"?!1:(o=e("img[usemap=#"+i+"]")[0],!!o&&s(o))):(/input|select|textarea|button|object/.test(u)?!t.disabled:"a"===u?t.href||n:n)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().andSelf().filter(function(){return e.css(this,"visibility")==="hidden"}).length}var n=0,r=/^ui-id-\d+$/;e.ui=e.ui||{};if(e.ui.version)return;e.extend(e.ui,{version:"1.9.2",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({_focus:e.fn.focus,focus:function(t,n){return typeof t=="number"?this.each(function(){var r=this;setTimeout(function(){e(r).focus(),n&&n.call(r)},t)}):this._focus.apply(this,arguments)},scrollParent:function(){var t;return e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?t=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):t=this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(n){if(n!==t)return this.css("zIndex",n);if(this.length){var r=e(this[0]),i,s;while(r.length&&r[0]!==document){i=r.css("position");if(i==="absolute"||i==="relative"||i==="fixed"){s=parseInt(r.css("zIndex"),10);if(!isNaN(s)&&s!==0)return s}r=r.parent()}}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++n)})},removeUniqueId:function(){return this.each(function(){r.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(n){return!!e.data(n,t)}}):function(t,n,r){return!!e.data(t,r[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var n=e.attr(t,"tabindex"),r=isNaN(n);return(r||n>=0)&&i(t,!r)}}),e(function(){var t=document.body,n=t.appendChild(n=document.createElement("div"));n.offsetHeight,e.extend(n.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),e.support.minHeight=n.offsetHeight===100,e.support.selectstart="onselectstart"in n,t.removeChild(n).style.display="none"}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(n,r){function u(t,n,r,s){return e.each(i,function(){n-=parseFloat(e.css(t,"padding"+this))||0,r&&(n-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(n-=parseFloat(e.css(t,"margin"+this))||0)}),n}var i=r==="Width"?["Left","Right"]:["Top","Bottom"],s=r.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+r]=function(n){return n===t?o["inner"+r].call(this):this.each(function(){e(this).css(s,u(this,n)+"px")})},e.fn["outer"+r]=function(t,n){return typeof t!="number"?o["outer"+r].call(this,t):this.each(function(){e(this).css(s,u(this,t,!0,n)+"px")})}}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(n){return arguments.length?t.call(this,e.camelCase(n)):t.call(this)}}(e.fn.removeData)),function(){var t=/msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase())||[];e.ui.ie=t.length?!0:!1,e.ui.ie6=parseFloat(t[1],10)===6}(),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,n,r){var i,s=e.ui[t].prototype;for(i in r)s.plugins[i]=s.plugins[i]||[],s.plugins[i].push([n,r[i]])},call:function(e,t,n){var r,i=e.plugins[t];if(!i||!e.element[0].parentNode||e.element[0].parentNode.nodeType===11)return;for(r=0;r<i.length;r++)e.options[i[r][0]]&&i[r][1].apply(e.element,n)}},contains:e.contains,hasScroll:function(t,n){if(e(t).css("overflow")==="hidden")return!1;var r=n&&n==="left"?"scrollLeft":"scrollTop",i=!1;return t[r]>0?!0:(t[r]=1,i=t[r]>0,t[r]=0,i)},isOverAxis:function(e,t,n){return e>t&&e<t+n},isOver:function(t,n,r,i,s,o){return e.ui.isOverAxis(t,r,s)&&e.ui.isOverAxis(n,i,o)}})})(jQuery);(function(e,t){var n=0,r=Array.prototype.slice,i=e.cleanData;e.cleanData=function(t){for(var n=0,r;(r=t[n])!=null;n++)try{e(r).triggerHandler("remove")}catch(s){}i(t)},e.widget=function(t,n,r){var i,s,o,u,a=t.split(".")[0];t=t.split(".")[1],i=a+"-"+t,r||(r=n,n=e.Widget),e.expr[":"][i.toLowerCase()]=function(t){return!!e.data(t,i)},e[a]=e[a]||{},s=e[a][t],o=e[a][t]=function(e,t){if(!this._createWidget)return new o(e,t);arguments.length&&this._createWidget(e,t)},e.extend(o,s,{version:r.version,_proto:e.extend({},r),_childConstructors:[]}),u=new n,u.options=e.widget.extend({},u.options),e.each(r,function(t,i){e.isFunction(i)&&(r[t]=function(){var e=function(){return n.prototype[t].apply(this,arguments)},r=function(e){return n.prototype[t].apply(this,e)};return function(){var t=this._super,n=this._superApply,s;return this._super=e,this._superApply=r,s=i.apply(this,arguments),this._super=t,this._superApply=n,s}}())}),o.prototype=e.widget.extend(u,{widgetEventPrefix:s?u.widgetEventPrefix:t},r,{constructor:o,namespace:a,widgetName:t,widgetBaseClass:i,widgetFullName:i}),s?(e.each(s._childConstructors,function(t,n){var r=n.prototype;e.widget(r.namespace+"."+r.widgetName,o,n._proto)}),delete s._childConstructors):n._childConstructors.push(o),e.widget.bridge(t,o)},e.widget.extend=function(n){var i=r.call(arguments,1),s=0,o=i.length,u,a;for(;s<o;s++)for(u in i[s])a=i[s][u],i[s].hasOwnProperty(u)&&a!==t&&(e.isPlainObject(a)?n[u]=e.isPlainObject(n[u])?e.widget.extend({},n[u],a):e.widget.extend({},a):n[u]=a);return n},e.widget.bridge=function(n,i){var s=i.prototype.widgetFullName||n;e.fn[n]=function(o){var u=typeof o=="string",a=r.call(arguments,1),f=this;return o=!u&&a.length?e.widget.extend.apply(null,[o].concat(a)):o,u?this.each(function(){var r,i=e.data(this,s);if(!i)return e.error("cannot call methods on "+n+" prior to initialization; "+"attempted to call method '"+o+"'");if(!e.isFunction(i[o])||o.charAt(0)==="_")return e.error("no such method '"+o+"' for "+n+" widget instance");r=i[o].apply(i,a);if(r!==i&&r!==t)return f=r&&r.jquery?f.pushStack(r.get()):r,!1}):this.each(function(){var t=e.data(this,s);t?t.option(o||{})._init():e.data(this,s,new i(o,this))}),f}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,r){r=e(r||this.defaultElement||this)[0],this.element=e(r),this.uuid=n++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),r!==this&&(e.data(r,this.widgetName,this),e.data(r,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===r&&this.destroy()}}),this.document=e(r.style?r.ownerDocument:r.document||r),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(n,r){var i=n,s,o,u;if(arguments.length===0)return e.widget.extend({},this.options);if(typeof n=="string"){i={},s=n.split("."),n=s.shift();if(s.length){o=i[n]=e.widget.extend({},this.options[n]);for(u=0;u<s.length-1;u++)o[s[u]]=o[s[u]]||{},o=o[s[u]];n=s.pop();if(r===t)return o[n]===t?null:o[n];o[n]=r}else{if(r===t)return this.options[n]===t?null:this.options[n];i[n]=r}}return this._setOptions(i),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,e==="disabled"&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(t,n,r){var i,s=this;typeof t!="boolean"&&(r=n,n=t,t=!1),r?(n=i=e(n),this.bindings=this.bindings.add(n)):(r=n,n=this.element,i=this.widget()),e.each(r,function(r,o){function u(){if(!t&&(s.options.disabled===!0||e(this).hasClass("ui-state-disabled")))return;return(typeof o=="string"?s[o]:o).apply(s,arguments)}typeof o!="string"&&(u.guid=o.guid=o.guid||u.guid||e.guid++);var a=r.match(/^(\w+)\s*(.*)$/),f=a[1]+s.eventNamespace,l=a[2];l?i.delegate(l,f,u):n.bind(f,u)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function n(){return(typeof e=="string"?r[e]:e).apply(r,arguments)}var r=this;return setTimeout(n,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,n,r){var i,s,o=this.options[t];r=r||{},n=e.Event(n),n.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),n.target=this.element[0],s=n.originalEvent;if(s)for(i in s)i in n||(n[i]=s[i]);return this.element.trigger(n,r),!(e.isFunction(o)&&o.apply(this.element[0],[n].concat(r))===!1||n.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,n){e.Widget.prototype["_"+t]=function(r,i,s){typeof i=="string"&&(i={effect:i});var o,u=i?i===!0||typeof i=="number"?n:i.effect||n:t;i=i||{},typeof i=="number"&&(i={duration:i}),o=!e.isEmptyObject(i),i.complete=s,i.delay&&r.delay(i.delay),o&&e.effects&&(e.effects.effect[u]||e.uiBackCompat!==!1&&e.effects[u])?r[t](i):u!==t&&r[u]?r[u](i.duration,i.easing,s):r.queue(function(n){e(this)[t](),s&&s.call(r[0]),n()})}}),e.uiBackCompat!==!1&&(e.Widget.prototype._getCreateOptions=function(){return e.metadata&&e.metadata.get(this.element[0])[this.widgetName]})})(jQuery);(function(e,t){var n=!1;e(document).mouseup(function(e){n=!1}),e.widget("ui.mouse",{version:"1.9.2",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(n){if(!0===e.data(n.target,t.widgetName+".preventClickEvent"))return e.removeData(n.target,t.widgetName+".preventClickEvent"),n.stopImmediatePropagation(),!1}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(t){if(n)return;this._mouseStarted&&this._mouseUp(t),this._mouseDownEvent=t;var r=this,i=t.which===1,s=typeof this.options.cancel=="string"&&t.target.nodeName?e(t.target).closest(this.options.cancel).length:!1;if(!i||s||!this._mouseCapture(t))return!0;this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){r.mouseDelayMet=!0},this.options.delay));if(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)){this._mouseStarted=this._mouseStart(t)!==!1;if(!this._mouseStarted)return t.preventDefault(),!0}return!0===e.data(t.target,this.widgetName+".preventClickEvent")&&e.removeData(t.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return r._mouseMove(e)},this._mouseUpDelegate=function(e){return r._mouseUp(e)},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),t.preventDefault(),n=!0,!0},_mouseMove:function(t){return!e.ui.ie||document.documentMode>=9||!!t.button?this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted):this._mouseUp(t)},_mouseUp:function(t){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(e){return this.mouseDelayMet},_mouseStart:function(e){},_mouseDrag:function(e){},_mouseStop:function(e){},_mouseCapture:function(e){return!0}})})(jQuery);(function(e,t){function h(e,t,n){return[parseInt(e[0],10)*(l.test(e[0])?t/100:1),parseInt(e[1],10)*(l.test(e[1])?n/100:1)]}function p(t,n){return parseInt(e.css(t,n),10)||0}e.ui=e.ui||{};var n,r=Math.max,i=Math.abs,s=Math.round,o=/left|center|right/,u=/top|center|bottom/,a=/[\+\-]\d+%?/,f=/^\w+/,l=/%$/,c=e.fn.position;e.position={scrollbarWidth:function(){if(n!==t)return n;var r,i,s=e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=s.children()[0];return e("body").append(s),r=o.offsetWidth,s.css("overflow","scroll"),i=o.offsetWidth,r===i&&(i=s[0].clientWidth),s.remove(),n=r-i},getScrollInfo:function(t){var n=t.isWindow?"":t.element.css("overflow-x"),r=t.isWindow?"":t.element.css("overflow-y"),i=n==="scroll"||n==="auto"&&t.width<t.element[0].scrollWidth,s=r==="scroll"||r==="auto"&&t.height<t.element[0].scrollHeight;return{width:i?e.position.scrollbarWidth():0,height:s?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var n=e(t||window),r=e.isWindow(n[0]);return{element:n,isWindow:r,offset:n.offset()||{left:0,top:0},scrollLeft:n.scrollLeft(),scrollTop:n.scrollTop(),width:r?n.width():n.outerWidth(),height:r?n.height():n.outerHeight()}}},e.fn.position=function(t){if(!t||!t.of)return c.apply(this,arguments);t=e.extend({},t);var n,l,d,v,m,g=e(t.of),y=e.position.getWithinInfo(t.within),b=e.position.getScrollInfo(y),w=g[0],E=(t.collision||"flip").split(" "),S={};return w.nodeType===9?(l=g.width(),d=g.height(),v={top:0,left:0}):e.isWindow(w)?(l=g.width(),d=g.height(),v={top:g.scrollTop(),left:g.scrollLeft()}):w.preventDefault?(t.at="left top",l=d=0,v={top:w.pageY,left:w.pageX}):(l=g.outerWidth(),d=g.outerHeight(),v=g.offset()),m=e.extend({},v),e.each(["my","at"],function(){var e=(t[this]||"").split(" "),n,r;e.length===1&&(e=o.test(e[0])?e.concat(["center"]):u.test(e[0])?["center"].concat(e):["center","center"]),e[0]=o.test(e[0])?e[0]:"center",e[1]=u.test(e[1])?e[1]:"center",n=a.exec(e[0]),r=a.exec(e[1]),S[this]=[n?n[0]:0,r?r[0]:0],t[this]=[f.exec(e[0])[0],f.exec(e[1])[0]]}),E.length===1&&(E[1]=E[0]),t.at[0]==="right"?m.left+=l:t.at[0]==="center"&&(m.left+=l/2),t.at[1]==="bottom"?m.top+=d:t.at[1]==="center"&&(m.top+=d/2),n=h(S.at,l,d),m.left+=n[0],m.top+=n[1],this.each(function(){var o,u,a=e(this),f=a.outerWidth(),c=a.outerHeight(),w=p(this,"marginLeft"),x=p(this,"marginTop"),T=f+w+p(this,"marginRight")+b.width,N=c+x+p(this,"marginBottom")+b.height,C=e.extend({},m),k=h(S.my,a.outerWidth(),a.outerHeight());t.my[0]==="right"?C.left-=f:t.my[0]==="center"&&(C.left-=f/2),t.my[1]==="bottom"?C.top-=c:t.my[1]==="center"&&(C.top-=c/2),C.left+=k[0],C.top+=k[1],e.support.offsetFractions||(C.left=s(C.left),C.top=s(C.top)),o={marginLeft:w,marginTop:x},e.each(["left","top"],function(r,i){e.ui.position[E[r]]&&e.ui.position[E[r]][i](C,{targetWidth:l,targetHeight:d,elemWidth:f,elemHeight:c,collisionPosition:o,collisionWidth:T,collisionHeight:N,offset:[n[0]+k[0],n[1]+k[1]],my:t.my,at:t.at,within:y,elem:a})}),e.fn.bgiframe&&a.bgiframe(),t.using&&(u=function(e){var n=v.left-C.left,s=n+l-f,o=v.top-C.top,u=o+d-c,h={target:{element:g,left:v.left,top:v.top,width:l,height:d},element:{element:a,left:C.left,top:C.top,width:f,height:c},horizontal:s<0?"left":n>0?"right":"center",vertical:u<0?"top":o>0?"bottom":"middle"};l<f&&i(n+s)<l&&(h.horizontal="center"),d<c&&i(o+u)<d&&(h.vertical="middle"),r(i(n),i(s))>r(i(o),i(u))?h.important="horizontal":h.important="vertical",t.using.call(this,e,h)}),a.offset(e.extend(C,{using:u}))})},e.ui.position={fit:{left:function(e,t){var n=t.within,i=n.isWindow?n.scrollLeft:n.offset.left,s=n.width,o=e.left-t.collisionPosition.marginLeft,u=i-o,a=o+t.collisionWidth-s-i,f;t.collisionWidth>s?u>0&&a<=0?(f=e.left+u+t.collisionWidth-s-i,e.left+=u-f):a>0&&u<=0?e.left=i:u>a?e.left=i+s-t.collisionWidth:e.left=i:u>0?e.left+=u:a>0?e.left-=a:e.left=r(e.left-o,e.left)},top:function(e,t){var n=t.within,i=n.isWindow?n.scrollTop:n.offset.top,s=t.within.height,o=e.top-t.collisionPosition.marginTop,u=i-o,a=o+t.collisionHeight-s-i,f;t.collisionHeight>s?u>0&&a<=0?(f=e.top+u+t.collisionHeight-s-i,e.top+=u-f):a>0&&u<=0?e.top=i:u>a?e.top=i+s-t.collisionHeight:e.top=i:u>0?e.top+=u:a>0?e.top-=a:e.top=r(e.top-o,e.top)}},flip:{left:function(e,t){var n=t.within,r=n.offset.left+n.scrollLeft,s=n.width,o=n.isWindow?n.scrollLeft:n.offset.left,u=e.left-t.collisionPosition.marginLeft,a=u-o,f=u+t.collisionWidth-s-o,l=t.my[0]==="left"?-t.elemWidth:t.my[0]==="right"?t.elemWidth:0,c=t.at[0]==="left"?t.targetWidth:t.at[0]==="right"?-t.targetWidth:0,h=-2*t.offset[0],p,d;if(a<0){p=e.left+l+c+h+t.collisionWidth-s-r;if(p<0||p<i(a))e.left+=l+c+h}else if(f>0){d=e.left-t.collisionPosition.marginLeft+l+c+h-o;if(d>0||i(d)<f)e.left+=l+c+h}},top:function(e,t){var n=t.within,r=n.offset.top+n.scrollTop,s=n.height,o=n.isWindow?n.scrollTop:n.offset.top,u=e.top-t.collisionPosition.marginTop,a=u-o,f=u+t.collisionHeight-s-o,l=t.my[1]==="top",c=l?-t.elemHeight:t.my[1]==="bottom"?t.elemHeight:0,h=t.at[1]==="top"?t.targetHeight:t.at[1]==="bottom"?-t.targetHeight:0,p=-2*t.offset[1],d,v;a<0?(v=e.top+c+h+p+t.collisionHeight-s-r,e.top+c+h+p>a&&(v<0||v<i(a))&&(e.top+=c+h+p)):f>0&&(d=e.top-t.collisionPosition.marginTop+c+h+p-o,e.top+c+h+p>f&&(d>0||i(d)<f)&&(e.top+=c+h+p))}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}},function(){var t,n,r,i,s,o=document.getElementsByTagName("body")[0],u=document.createElement("div");t=document.createElement(o?"div":"body"),r={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&e.extend(r,{position:"absolute",left:"-1000px",top:"-1000px"});for(s in r)t.style[s]=r[s];t.appendChild(u),n=o||document.documentElement,n.insertBefore(t,n.firstChild),u.style.cssText="position: absolute; left: 10.7432222px;",i=e(u).offset().left,e.support.offsetFractions=i>10&&i<11,t.innerHTML="",n.removeChild(t)}(),e.uiBackCompat!==!1&&function(e){var n=e.fn.position;e.fn.position=function(r){if(!r||!r.offset)return n.call(this,r);var i=r.offset.split(" "),s=r.at.split(" ");return i.length===1&&(i[1]=i[0]),/^\d/.test(i[0])&&(i[0]="+"+i[0]),/^\d/.test(i[1])&&(i[1]="+"+i[1]),s.length===1&&(/left|center|right/.test(s[0])?s[1]="center":(s[1]=s[0],s[0]="center")),n.call(this,e.extend(r,{at:s[0]+i[0]+" "+s[1]+i[1],offset:t}))}}(jQuery)})(jQuery);(function(e,t){var n=0,r={},i={};r.height=r.paddingTop=r.paddingBottom=r.borderTopWidth=r.borderBottomWidth="hide",i.height=i.paddingTop=i.paddingBottom=i.borderTopWidth=i.borderBottomWidth="show",e.widget("ui.accordion",{version:"1.9.2",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},_create:function(){var t=this.accordionId="ui-accordion-"+(this.element.attr("id")||++n),r=this.options;this.prevShow=this.prevHide=e(),this.element.addClass("ui-accordion ui-widget ui-helper-reset"),this.headers=this.element.find(r.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"),this._hoverable(this.headers),this._focusable(this.headers),this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").hide(),!r.collapsible&&(r.active===!1||r.active==null)&&(r.active=0),r.active<0&&(r.active+=this.headers.length),this.active=this._findActive(r.active).addClass("ui-accordion-header-active ui-state-active").toggleClass("ui-corner-all ui-corner-top"),this.active.next().addClass("ui-accordion-content-active").show(),this._createIcons(),this.refresh(),this.element.attr("role","tablist"),this.headers.attr("role","tab").each(function(n){var r=e(this),i=r.attr("id"),s=r.next(),o=s.attr("id");i||(i=t+"-header-"+n,r.attr("id",i)),o||(o=t+"-panel-"+n,s.attr("id",o)),r.attr("aria-controls",o),s.attr("aria-labelledby",i)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false",tabIndex:-1}).next().attr({"aria-expanded":"false","aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true",tabIndex:0}).next().attr({"aria-expanded":"true","aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._on(this.headers,{keydown:"_keydown"}),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._setupEvents(r.event)},_getCreateEventData:function(){return{header:this.active,content:this.active.length?this.active.next():e()}},_createIcons:function(){var t=this.options.icons;t&&(e("<span>").addClass("ui-accordion-header-icon ui-icon "+t.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(t.header).addClass(t.activeHeader),this.headers.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var e;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),this._destroyIcons(),e=this.headers.next().css("display","").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),this.options.heightStyle!=="content"&&e.css("height","")},_setOption:function(e,t){if(e==="active"){this._activate(t);return}e==="event"&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(t)),this._super(e,t),e==="collapsible"&&!t&&this.options.active===!1&&this._activate(0),e==="icons"&&(this._destroyIcons(),t&&this._createIcons()),e==="disabled"&&this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!t)},_keydown:function(t){if(t.altKey||t.ctrlKey)return;var n=e.ui.keyCode,r=this.headers.length,i=this.headers.index(t.target),s=!1;switch(t.keyCode){case n.RIGHT:case n.DOWN:s=this.headers[(i+1)%r];break;case n.LEFT:case n.UP:s=this.headers[(i-1+r)%r];break;case n.SPACE:case n.ENTER:this._eventHandler(t);break;case n.HOME:s=this.headers[0];break;case n.END:s=this.headers[r-1]}s&&(e(t.target).attr("tabIndex",-1),e(s).attr("tabIndex",0),s.focus(),t.preventDefault())},_panelKeyDown:function(t){t.keyCode===e.ui.keyCode.UP&&t.ctrlKey&&e(t.currentTarget).prev().focus()},refresh:function(){var t,n,r=this.options.heightStyle,i=this.element.parent();r==="fill"?(e.support.minHeight||(n=i.css("overflow"),i.css("overflow","hidden")),t=i.height(),this.element.siblings(":visible").each(function(){var n=e(this),r=n.css("position");if(r==="absolute"||r==="fixed")return;t-=n.outerHeight(!0)}),n&&i.css("overflow",n),this.headers.each(function(){t-=e(this).outerHeight(!0)}),this.headers.next().each(function(){e(this).height(Math.max(0,t-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):r==="auto"&&(t=0,this.headers.next().each(function(){t=Math.max(t,e(this).css("height","").height())}).height(t))},_activate:function(t){var n=this._findActive(t)[0];if(n===this.active[0])return;n=n||this.active[0],this._eventHandler({target:n,currentTarget:n,preventDefault:e.noop})},_findActive:function(t){return typeof t=="number"?this.headers.eq(t):e()},_setupEvents:function(t){var n={};if(!t)return;e.each(t.split(" "),function(e,t){n[t]="_eventHandler"}),this._on(this.headers,n)},_eventHandler:function(t){var n=this.options,r=this.active,i=e(t.currentTarget),s=i[0]===r[0],o=s&&n.collapsible,u=o?e():i.next(),a=r.next(),f={oldHeader:r,oldPanel:a,newHeader:o?e():i,newPanel:u};t.preventDefault();if(s&&!n.collapsible||this._trigger("beforeActivate",t,f)===!1)return;n.active=o?!1:this.headers.index(i),this.active=s?e():i,this._toggle(f),r.removeClass("ui-accordion-header-active ui-state-active"),n.icons&&r.children(".ui-accordion-header-icon").removeClass(n.icons.activeHeader).addClass(n.icons.header),s||(i.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),n.icons&&i.children(".ui-accordion-header-icon").removeClass(n.icons.header).addClass(n.icons.activeHeader),i.next().addClass("ui-accordion-content-active"))},_toggle:function(t){var n=t.newPanel,r=this.prevShow.length?this.prevShow:t.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=n,this.prevHide=r,this.options.animate?this._animate(n,r,t):(r.hide(),n.show(),this._toggleComplete(t)),r.attr({"aria-expanded":"false","aria-hidden":"true"}),r.prev().attr("aria-selected","false"),n.length&&r.length?r.prev().attr("tabIndex",-1):n.length&&this.headers.filter(function(){return e(this).attr("tabIndex")===0}).attr("tabIndex",-1),n.attr({"aria-expanded":"true","aria-hidden":"false"}).prev().attr({"aria-selected":"true",tabIndex:0})},_animate:function(e,t,n){var s,o,u,a=this,f=0,l=e.length&&(!t.length||e.index()<t.index()),c=this.options.animate||{},h=l&&c.down||c,p=function(){a._toggleComplete(n)};typeof h=="number"&&(u=h),typeof h=="string"&&(o=h),o=o||h.easing||c.easing,u=u||h.duration||c.duration;if(!t.length)return e.animate(i,u,o,p);if(!e.length)return t.animate(r,u,o,p);s=e.show().outerHeight(),t.animate(r,{duration:u,easing:o,step:function(e,t){t.now=Math.round(e)}}),e.hide().animate(i,{duration:u,easing:o,complete:p,step:function(e,n){n.now=Math.round(e),n.prop!=="height"?f+=n.now:a.options.heightStyle!=="content"&&(n.now=Math.round(s-t.outerHeight()-f),f=0)}})},_toggleComplete:function(e){var t=e.oldPanel;t.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),t.length&&(t.parent()[0].className=t.parent()[0].className),this._trigger("activate",null,e)}}),e.uiBackCompat!==!1&&(function(e,t){e.extend(t.options,{navigation:!1,navigationFilter:function(){return this.href.toLowerCase()===location.href.toLowerCase()}});var n=t._create;t._create=function(){if(this.options.navigation){var t=this,r=this.element.find(this.options.header),i=r.next(),s=r.add(i).find("a").filter(this.options.navigationFilter)[0];s&&r.add(i).each(function(n){if(e.contains(this,s))return t.options.active=Math.floor(n/2),!1})}n.call(this)}}(jQuery,jQuery.ui.accordion.prototype),function(e,t){e.extend(t.options,{heightStyle:null,autoHeight:!0,clearStyle:!1,fillSpace:!1});var n=t._create,r=t._setOption;e.extend(t,{_create:function(){this.options.heightStyle=this.options.heightStyle||this._mergeHeightStyle(),n.call(this)},_setOption:function(e){if(e==="autoHeight"||e==="clearStyle"||e==="fillSpace")this.options.heightStyle=this._mergeHeightStyle();r.apply(this,arguments)},_mergeHeightStyle:function(){var e=this.options;if(e.fillSpace)return"fill";if(e.clearStyle)return"content";if(e.autoHeight)return"auto"}})}(jQuery,jQuery.ui.accordion.prototype),function(e,t){e.extend(t.options.icons,{activeHeader:null,headerSelected:"ui-icon-triangle-1-s"});var n=t._createIcons;t._createIcons=function(){this.options.icons&&(this.options.icons.activeHeader=this.options.icons.activeHeader||this.options.icons.headerSelected),n.call(this)}}(jQuery,jQuery.ui.accordion.prototype),function(e,t){t.activate=t._activate;var n=t._findActive;t._findActive=function(e){return e===-1&&(e=!1),e&&typeof e!="number"&&(e=this.headers.index(this.headers.filter(e)),e===-1&&(e=!1)),n.call(this,e)}}(jQuery,jQuery.ui.accordion.prototype),jQuery.ui.accordion.prototype.resize=jQuery.ui.accordion.prototype.refresh,function(e,t){e.extend(t.options,{change:null,changestart:null});var n=t._trigger;t._trigger=function(e,t,r){var i=n.apply(this,arguments);return i?(e==="beforeActivate"?i=n.call(this,"changestart",t,{oldHeader:r.oldHeader,oldContent:r.oldPanel,newHeader:r.newHeader,newContent:r.newPanel}):e==="activate"&&(i=n.call(this,"change",t,{oldHeader:r.oldHeader,oldContent:r.oldPanel,newHeader:r.newHeader,newContent:r.newPanel})),i):!1}}(jQuery,jQuery.ui.accordion.prototype),function(e,t){e.extend(t.options,{animate:null,animated:"slide"});var n=t._create;t._create=function(){var e=this.options;e.animate===null&&(e.animated?e.animated==="slide"?e.animate=300:e.animated==="bounceslide"?e.animate={duration:200,down:{easing:"easeOutBounce",duration:1e3}}:e.animate=e.animated:e.animate=!1),n.call(this)}}(jQuery,jQuery.ui.accordion.prototype))})(jQuery);(function(e,t){var n=0;e.widget("ui.autocomplete",{version:"1.9.2",defaultElement:"<input>",options:{appendTo:"body",autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var t,n,r;this.isMultiLine=this._isMultiLine(),this.valueMethod=this.element[this.element.is("input,textarea")?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(i){if(this.element.prop("readOnly")){t=!0,r=!0,n=!0;return}t=!1,r=!1,n=!1;var s=e.ui.keyCode;switch(i.keyCode){case s.PAGE_UP:t=!0,this._move("previousPage",i);break;case s.PAGE_DOWN:t=!0,this._move("nextPage",i);break;case s.UP:t=!0,this._keyEvent("previous",i);break;case s.DOWN:t=!0,this._keyEvent("next",i);break;case s.ENTER:case s.NUMPAD_ENTER:this.menu.active&&(t=!0,i.preventDefault(),this.menu.select(i));break;case s.TAB:this.menu.active&&this.menu.select(i);break;case s.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(i),i.preventDefault());break;default:n=!0,this._searchTimeout(i)}},keypress:function(r){if(t){t=!1,r.preventDefault();return}if(n)return;var i=e.ui.keyCode;switch(r.keyCode){case i.PAGE_UP:this._move("previousPage",r);break;case i.PAGE_DOWN:this._move("nextPage",r);break;case i.UP:this._keyEvent("previous",r);break;case i.DOWN:this._keyEvent("next",r)}},input:function(e){if(r){r=!1,e.preventDefault();return}this._searchTimeout(e)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(e){if(this.cancelBlur){delete this.cancelBlur;return}clearTimeout(this.searching),this.close(e),this._change(e)}}),this._initSource(),this.menu=e("<ul>").addClass("ui-autocomplete").appendTo(this.document.find(this.options.appendTo||"body")[0]).menu({input:e(),role:null}).zIndex(this.element.zIndex()+1).hide().data("menu"),this._on(this.menu.element,{mousedown:function(t){t.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var n=this.menu.element[0];e(t.target).closest(".ui-menu-item").length||this._delay(function(){var t=this;this.document.one("mousedown",function(r){r.target!==t.element[0]&&r.target!==n&&!e.contains(n,r.target)&&t.close()})})},menufocus:function(t,n){if(this.isNewMenu){this.isNewMenu=!1;if(t.originalEvent&&/^mouse/.test(t.originalEvent.type)){this.menu.blur(),this.document.one("mousemove",function(){e(t.target).trigger(t.originalEvent)});return}}var r=n.item.data("ui-autocomplete-item")||n.item.data("item.autocomplete");!1!==this._trigger("focus",t,{item:r})?t.originalEvent&&/^key/.test(t.originalEvent.type)&&this._value(r.value):this.liveRegion.text(r.value)},menuselect:function(e,t){var n=t.item.data("ui-autocomplete-item")||t.item.data("item.autocomplete"),r=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=r,this._delay(function(){this.previous=r,this.selectedItem=n})),!1!==this._trigger("select",e,{item:n})&&this._value(n.value),this.term=this._value(),this.close(e),this.selectedItem=n}}),this.liveRegion=e("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertAfter(this.element),e.fn.bgiframe&&this.menu.element.bgiframe(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(e,t){this._super(e,t),e==="source"&&this._initSource(),e==="appendTo"&&this.menu.element.appendTo(this.document.find(t||"body")[0]),e==="disabled"&&t&&this.xhr&&this.xhr.abort()},_isMultiLine:function(){return this.element.is("textarea")?!0:this.element.is("input")?!1:this.element.prop("isContentEditable")},_initSource:function(){var t,n,r=this;e.isArray(this.options.source)?(t=this.options.source,this.source=function(n,r){r(e.ui.autocomplete.filter(t,n.term))}):typeof this.options.source=="string"?(n=this.options.source,this.source=function(t,i){r.xhr&&r.xhr.abort(),r.xhr=e.ajax({url:n,data:t,dataType:"json",success:function(e){i(e)},error:function(){i([])}})}):this.source=this.options.source},_searchTimeout:function(e){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,e))},this.options.delay)},search:function(e,t){e=e!=null?e:this._value(),this.term=this._value();if(e.length<this.options.minLength)return this.close(t);if(this._trigger("search",t)===!1)return;return this._search(e)},_search:function(e){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:e},this._response())},_response:function(){var e=this,t=++n;return function(r){t===n&&e.__response(r),e.pending--,e.pending||e.element.removeClass("ui-autocomplete-loading")}},__response:function(e){e&&(e=this._normalize(e)),this._trigger("response",null,{content:e}),!this.options.disabled&&e&&e.length&&!this.cancelSearch?(this._suggest(e),this._trigger("open")):this._close()},close:function(e){this.cancelSearch=!0,this._close(e)},_close:function(e){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",e))},_change:function(e){this.previous!==this._value()&&this._trigger("change",e,{item:this.selectedItem})},_normalize:function(t){return t.length&&t[0].label&&t[0].value?t:e.map(t,function(t){return typeof t=="string"?{label:t,value:t}:e.extend({label:t.label||t.value,value:t.value||t.label},t)})},_suggest:function(t){var n=this.menu.element.empty().zIndex(this.element.zIndex()+1);this._renderMenu(n,t),this.menu.refresh(),n.show(),this._resizeMenu(),n.position(e.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var e=this.menu.element;e.outerWidth(Math.max(e.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(t,n){var r=this;e.each(n,function(e,n){r._renderItemData(t,n)})},_renderItemData:function(e,t){return this._renderItem(e,t).data("ui-autocomplete-item",t)},_renderItem:function(t,n){return e("<li>").append(e("<a>").text(n.label)).appendTo(t)},_move:function(e,t){if(!this.menu.element.is(":visible")){this.search(null,t);return}if(this.menu.isFirstItem()&&/^previous/.test(e)||this.menu.isLastItem()&&/^next/.test(e)){this._value(this.term),this.menu.blur();return}this.menu[e](t)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(e,t){if(!this.isMultiLine||this.menu.element.is(":visible"))this._move(e,t),t.preventDefault()}}),e.extend(e.ui.autocomplete,{escapeRegex:function(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(t,n){var r=new RegExp(e.ui.autocomplete.escapeRegex(n),"i");return e.grep(t,function(e){return r.test(e.label||e.value||e)})}}),e.widget("ui.autocomplete",e.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(e){return e+(e>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(e){var t;this._superApply(arguments);if(this.options.disabled||this.cancelSearch)return;e&&e.length?t=this.options.messages.results(e.length):t=this.options.messages.noResults,this.liveRegion.text(t)}})})(jQuery);(function(e,t){var n,r,i,s,o="ui-button ui-widget ui-state-default ui-corner-all",u="ui-state-hover ui-state-active ",a="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",f=function(){var t=e(this).find(":ui-button");setTimeout(function(){t.button("refresh")},1)},l=function(t){var n=t.name,r=t.form,i=e([]);return n&&(r?i=e(r).find("[name='"+n+"']"):i=e("[name='"+n+"']",t.ownerDocument).filter(function(){return!this.form})),i};e.widget("ui.button",{version:"1.9.2",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,f),typeof this.options.disabled!="boolean"?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var t=this,u=this.options,a=this.type==="checkbox"||this.type==="radio",c=a?"":"ui-state-active",h="ui-state-focus";u.label===null&&(u.label=this.type==="input"?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(o).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){if(u.disabled)return;this===n&&e(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){if(u.disabled)return;e(this).removeClass(c)}).bind("click"+this.eventNamespace,function(e){u.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}),this.element.bind("focus"+this.eventNamespace,function(){t.buttonElement.addClass(h)}).bind("blur"+this.eventNamespace,function(){t.buttonElement.removeClass(h)}),a&&(this.element.bind("change"+this.eventNamespace,function(){if(s)return;t.refresh()}),this.buttonElement.bind("mousedown"+this.eventNamespace,function(e){if(u.disabled)return;s=!1,r=e.pageX,i=e.pageY}).bind("mouseup"+this.eventNamespace,function(e){if(u.disabled)return;if(r!==e.pageX||i!==e.pageY)s=!0})),this.type==="checkbox"?this.buttonElement.bind("click"+this.eventNamespace,function(){if(u.disabled||s)return!1;e(this).toggleClass("ui-state-active"),t.buttonElement.attr("aria-pressed",t.element[0].checked)}):this.type==="radio"?this.buttonElement.bind("click"+this.eventNamespace,function(){if(u.disabled||s)return!1;e(this).addClass("ui-state-active"),t.buttonElement.attr("aria-pressed","true");var n=t.element[0];l(n).not(n).map(function(){return e(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){if(u.disabled)return!1;e(this).addClass("ui-state-active"),n=this,t.document.one("mouseup",function(){n=null})}).bind("mouseup"+this.eventNamespace,function(){if(u.disabled)return!1;e(this).removeClass("ui-state-active")}).bind("keydown"+this.eventNamespace,function(t){if(u.disabled)return!1;(t.keyCode===e.ui.keyCode.SPACE||t.keyCode===e.ui.keyCode.ENTER)&&e(this).addClass("ui-state-active")}).bind("keyup"+this.eventNamespace,function(){e(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(t){t.keyCode===e.ui.keyCode.SPACE&&e(this).click()})),this._setOption("disabled",u.disabled),this._resetButton()},_determineButtonType:function(){var e,t,n;this.element.is("[type=checkbox]")?this.type="checkbox":this.element.is("[type=radio]")?this.type="radio":this.element.is("input")?this.type="input":this.type="button",this.type==="checkbox"||this.type==="radio"?(e=this.element.parents().last(),t="label[for='"+this.element.attr("id")+"']",this.buttonElement=e.find(t),this.buttonElement.length||(e=e.length?e.siblings():this.element.siblings(),this.buttonElement=e.filter(t),this.buttonElement.length||(this.buttonElement=e.find(t))),this.element.addClass("ui-helper-hidden-accessible"),n=this.element.is(":checked"),n&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",n)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(o+" "+u+" "+a).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(e,t){this._super(e,t);if(e==="disabled"){t?this.element.prop("disabled",!0):this.element.prop("disabled",!1);return}this._resetButton()},refresh:function(){var t=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");t!==this.options.disabled&&this._setOption("disabled",t),this.type==="radio"?l(this.element[0]).each(function(){e(this).is(":checked")?e(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):e(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):this.type==="checkbox"&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if(this.type==="input"){this.options.label&&this.element.val(this.options.label);return}var t=this.buttonElement.removeClass(a),n=e("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(t.empty()).text(),r=this.options.icons,i=r.primary&&r.secondary,s=[];r.primary||r.secondary?(this.options.text&&s.push("ui-button-text-icon"+(i?"s":r.primary?"-primary":"-secondary")),r.primary&&t.prepend("<span class='ui-button-icon-primary ui-icon "+r.primary+"'></span>"),r.secondary&&t.append("<span class='ui-button-icon-secondary ui-icon "+r.secondary+"'></span>"),this.options.text||(s.push(i?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||t.attr("title",e.trim(n)))):s.push("ui-button-text-only"),t.addClass(s.join(" "))}}),e.widget("ui.buttonset",{version:"1.9.2",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(e,t){e==="disabled"&&this.buttons.button("option",e,t),this._super(e,t)},refresh:function(){var t=this.element.css("direction")==="rtl";this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(t?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})})(jQuery);(function($,undefined){function Datepicker(){this.debug=!1,this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},$.extend(this._defaults,this.regional[""]),this.dpDiv=bindHover($('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}function bindHover(e){var t="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return e.delegate(t,"mouseout",function(){$(this).removeClass("ui-state-hover"),this.className.indexOf("ui-datepicker-prev")!=-1&&$(this).removeClass("ui-datepicker-prev-hover"),this.className.indexOf("ui-datepicker-next")!=-1&&$(this).removeClass("ui-datepicker-next-hover")}).delegate(t,"mouseover",function(){$.datepicker._isDisabledDatepicker(instActive.inline?e.parent()[0]:instActive.input[0])||($(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),$(this).addClass("ui-state-hover"),this.className.indexOf("ui-datepicker-prev")!=-1&&$(this).addClass("ui-datepicker-prev-hover"),this.className.indexOf("ui-datepicker-next")!=-1&&$(this).addClass("ui-datepicker-next-hover"))})}function extendRemove(e,t){$.extend(e,t);for(var n in t)if(t[n]==null||t[n]==undefined)e[n]=t[n];return e}$.extend($.ui,{datepicker:{version:"1.9.2"}});var PROP_NAME="datepicker",dpuuid=(new Date).getTime(),instActive;$.extend(Datepicker.prototype,{markerClassName:"hasDatepicker",maxRows:4,log:function(){this.debug&&console.log.apply("",arguments)},_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(e){return extendRemove(this._defaults,e||{}),this},_attachDatepicker:function(target,settings){var inlineSettings=null;for(var attrName in this._defaults){var attrValue=target.getAttribute("date:"+attrName);if(attrValue){inlineSettings=inlineSettings||{};try{inlineSettings[attrName]=eval(attrValue)}catch(err){inlineSettings[attrName]=attrValue}}}var nodeName=target.nodeName.toLowerCase(),inline=nodeName=="div"||nodeName=="span";target.id||(this.uuid+=1,target.id="dp"+this.uuid);var inst=this._newInst($(target),inline);inst.settings=$.extend({},settings||{},inlineSettings||{}),nodeName=="input"?this._connectDatepicker(target,inst):inline&&this._inlineDatepicker(target,inst)},_newInst:function(e,t){var n=e[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1");return{id:n,input:e,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:t,dpDiv:t?bindHover($('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')):this.dpDiv}},_connectDatepicker:function(e,t){var n=$(e);t.append=$([]),t.trigger=$([]);if(n.hasClass(this.markerClassName))return;this._attachments(n,t),n.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",function(e,n,r){t.settings[n]=r}).bind("getData.datepicker",function(e,n){return this._get(t,n)}),this._autoSize(t),$.data(e,PROP_NAME,t),t.settings.disabled&&this._disableDatepicker(e)},_attachments:function(e,t){var n=this._get(t,"appendText"),r=this._get(t,"isRTL");t.append&&t.append.remove(),n&&(t.append=$('<span class="'+this._appendClass+'">'+n+"</span>"),e[r?"before":"after"](t.append)),e.unbind("focus",this._showDatepicker),t.trigger&&t.trigger.remove();var i=this._get(t,"showOn");(i=="focus"||i=="both")&&e.focus(this._showDatepicker);if(i=="button"||i=="both"){var s=this._get(t,"buttonText"),o=this._get(t,"buttonImage");t.trigger=$(this._get(t,"buttonImageOnly")?$("<img/>").addClass(this._triggerClass).attr({src:o,alt:s,title:s}):$('<button type="button"></button>').addClass(this._triggerClass).html(o==""?s:$("<img/>").attr({src:o,alt:s,title:s}))),e[r?"before":"after"](t.trigger),t.trigger.click(function(){return $.datepicker._datepickerShowing&&$.datepicker._lastInput==e[0]?$.datepicker._hideDatepicker():$.datepicker._datepickerShowing&&$.datepicker._lastInput!=e[0]?($.datepicker._hideDatepicker(),$.datepicker._showDatepicker(e[0])):$.datepicker._showDatepicker(e[0]),!1})}},_autoSize:function(e){if(this._get(e,"autoSize")&&!e.inline){var t=new Date(2009,11,20),n=this._get(e,"dateFormat");if(n.match(/[DM]/)){var r=function(e){var t=0,n=0;for(var r=0;r<e.length;r++)e[r].length>t&&(t=e[r].length,n=r);return n};t.setMonth(r(this._get(e,n.match(/MM/)?"monthNames":"monthNamesShort"))),t.setDate(r(this._get(e,n.match(/DD/)?"dayNames":"dayNamesShort"))+20-t.getDay())}e.input.attr("size",this._formatDate(e,t).length)}},_inlineDatepicker:function(e,t){var n=$(e);if(n.hasClass(this.markerClassName))return;n.addClass(this.markerClassName).append(t.dpDiv).bind("setData.datepicker",function(e,n,r){t.settings[n]=r}).bind("getData.datepicker",function(e,n){return this._get(t,n)}),$.data(e,PROP_NAME,t),this._setDate(t,this._getDefaultDate(t),!0),this._updateDatepicker(t),this._updateAlternate(t),t.settings.disabled&&this._disableDatepicker(e),t.dpDiv.css("display","block")},_dialogDatepicker:function(e,t,n,r,i){var s=this._dialogInst;if(!s){this.uuid+=1;var o="dp"+this.uuid;this._dialogInput=$('<input type="text" id="'+o+'" style="position: absolute; top: -100px; width: 0px;"/>'),this._dialogInput.keydown(this._doKeyDown),$("body").append(this._dialogInput),s=this._dialogInst=this._newInst(this._dialogInput,!1),s.settings={},$.data(this._dialogInput[0],PROP_NAME,s)}extendRemove(s.settings,r||{}),t=t&&t.constructor==Date?this._formatDate(s,t):t,this._dialogInput.val(t),this._pos=i?i.length?i:[i.pageX,i.pageY]:null;if(!this._pos){var u=document.documentElement.clientWidth,a=document.documentElement.clientHeight,f=document.documentElement.scrollLeft||document.body.scrollLeft,l=document.documentElement.scrollTop||document.body.scrollTop;this._pos=[u/2-100+f,a/2-150+l]}return this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),s.settings.onSelect=n,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),$.blockUI&&$.blockUI(this.dpDiv),$.data(this._dialogInput[0],PROP_NAME,s),this},_destroyDatepicker:function(e){var t=$(e),n=$.data(e,PROP_NAME);if(!t.hasClass(this.markerClassName))return;var r=e.nodeName.toLowerCase();$.removeData(e,PROP_NAME),r=="input"?(n.append.remove(),n.trigger.remove(),t.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):(r=="div"||r=="span")&&t.removeClass(this.markerClassName).empty()},_enableDatepicker:function(e){var t=$(e),n=$.data(e,PROP_NAME);if(!t.hasClass(this.markerClassName))return;var r=e.nodeName.toLowerCase();if(r=="input")e.disabled=!1,n.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""});else if(r=="div"||r=="span"){var i=t.children("."+this._inlineClass);i.children().removeClass("ui-state-disabled"),i.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)}this._disabledInputs=$.map(this._disabledInputs,function(t){return t==e?null:t})},_disableDatepicker:function(e){var t=$(e),n=$.data(e,PROP_NAME);if(!t.hasClass(this.markerClassName))return;var r=e.nodeName.toLowerCase();if(r=="input")e.disabled=!0,n.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"});else if(r=="div"||r=="span"){var i=t.children("."+this._inlineClass);i.children().addClass("ui-state-disabled"),i.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)}this._disabledInputs=$.map(this._disabledInputs,function(t){return t==e?null:t}),this._disabledInputs[this._disabledInputs.length]=e},_isDisabledDatepicker:function(e){if(!e)return!1;for(var t=0;t<this._disabledInputs.length;t++)if(this._disabledInputs[t]==e)return!0;return!1},_getInst:function(e){try{return $.data(e,PROP_NAME)}catch(t){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(e,t,n){var r=this._getInst(e);if(arguments.length==2&&typeof t=="string")return t=="defaults"?$.extend({},$.datepicker._defaults):r?t=="all"?$.extend({},r.settings):this._get(r,t):null;var i=t||{};typeof t=="string"&&(i={},i[t]=n);if(r){this._curInst==r&&this._hideDatepicker();var s=this._getDateDatepicker(e,!0),o=this._getMinMaxDate(r,"min"),u=this._getMinMaxDate(r,"max");extendRemove(r.settings,i),o!==null&&i.dateFormat!==undefined&&i.minDate===undefined&&(r.settings.minDate=this._formatDate(r,o)),u!==null&&i.dateFormat!==undefined&&i.maxDate===undefined&&(r.settings.maxDate=this._formatDate(r,u)),this._attachments($(e),r),this._autoSize(r),this._setDate(r,s),this._updateAlternate(r),this._updateDatepicker(r)}},_changeDatepicker:function(e,t,n){this._optionDatepicker(e,t,n)},_refreshDatepicker:function(e){var t=this._getInst(e);t&&this._updateDatepicker(t)},_setDateDatepicker:function(e,t){var n=this._getInst(e);n&&(this._setDate(n,t),this._updateDatepicker(n),this._updateAlternate(n))},_getDateDatepicker:function(e,t){var n=this._getInst(e);return n&&!n.inline&&this._setDateFromField(n,t),n?this._getDate(n):null},_doKeyDown:function(e){var t=$.datepicker._getInst(e.target),n=!0,r=t.dpDiv.is(".ui-datepicker-rtl");t._keyEvent=!0;if($.datepicker._datepickerShowing)switch(e.keyCode){case 9:$.datepicker._hideDatepicker(),n=!1;break;case 13:var i=$("td."+$.datepicker._dayOverClass+":not(."+$.datepicker._currentClass+")",t.dpDiv);i[0]&&$.datepicker._selectDay(e.target,t.selectedMonth,t.selectedYear,i[0]);var s=$.datepicker._get(t,"onSelect");if(s){var o=$.datepicker._formatDate(t);s.apply(t.input?t.input[0]:null,[o,t])}else $.datepicker._hideDatepicker();return!1;case 27:$.datepicker._hideDatepicker();break;case 33:$.datepicker._adjustDate(e.target,e.ctrlKey?-$.datepicker._get(t,"stepBigMonths"):-$.datepicker._get(t,"stepMonths"),"M");break;case 34:$.datepicker._adjustDate(e.target,e.ctrlKey?+$.datepicker._get(t,"stepBigMonths"):+$.datepicker._get(t,"stepMonths"),"M");break;case 35:(e.ctrlKey||e.metaKey)&&$.datepicker._clearDate(e.target),n=e.ctrlKey||e.metaKey;break;case 36:(e.ctrlKey||e.metaKey)&&$.datepicker._gotoToday(e.target),n=e.ctrlKey||e.metaKey;break;case 37:(e.ctrlKey||e.metaKey)&&$.datepicker._adjustDate(e.target,r?1:-1,"D"),n=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&$.datepicker._adjustDate(e.target,e.ctrlKey?-$.datepicker._get(t,"stepBigMonths"):-$.datepicker._get(t,"stepMonths"),"M");break;case 38:(e.ctrlKey||e.metaKey)&&$.datepicker._adjustDate(e.target,-7,"D"),n=e.ctrlKey||e.metaKey;break;case 39:(e.ctrlKey||e.metaKey)&&$.datepicker._adjustDate(e.target,r?-1:1,"D"),n=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&$.datepicker._adjustDate(e.target,e.ctrlKey?+$.datepicker._get(t,"stepBigMonths"):+$.datepicker._get(t,"stepMonths"),"M");break;case 40:(e.ctrlKey||e.metaKey)&&$.datepicker._adjustDate(e.target,7,"D"),n=e.ctrlKey||e.metaKey;break;default:n=!1}else e.keyCode==36&&e.ctrlKey?$.datepicker._showDatepicker(this):n=!1;n&&(e.preventDefault(),e.stopPropagation())},_doKeyPress:function(e){var t=$.datepicker._getInst(e.target);if($.datepicker._get(t,"constrainInput")){var n=$.datepicker._possibleChars($.datepicker._get(t,"dateFormat")),r=String.fromCharCode(e.charCode==undefined?e.keyCode:e.charCode);return e.ctrlKey||e.metaKey||r<" "||!n||n.indexOf(r)>-1}},_doKeyUp:function(e){var t=$.datepicker._getInst(e.target);if(t.input.val()!=t.lastVal)try{var n=$.datepicker.parseDate($.datepicker._get(t,"dateFormat"),t.input?t.input.val():null,$.datepicker._getFormatConfig(t));n&&($.datepicker._setDateFromField(t),$.datepicker._updateAlternate(t),$.datepicker._updateDatepicker(t))}catch(r){$.datepicker.log(r)}return!0},_showDatepicker:function(e){e=e.target||e,e.nodeName.toLowerCase()!="input"&&(e=$("input",e.parentNode)[0]);if($.datepicker._isDisabledDatepicker(e)||$.datepicker._lastInput==e)return;var t=$.datepicker._getInst(e);$.datepicker._curInst&&$.datepicker._curInst!=t&&($.datepicker._curInst.dpDiv.stop(!0,!0),t&&$.datepicker._datepickerShowing&&$.datepicker._hideDatepicker($.datepicker._curInst.input[0]));var n=$.datepicker._get(t,"beforeShow"),r=n?n.apply(e,[e,t]):{};if(r===!1)return;extendRemove(t.settings,r),t.lastVal=null,$.datepicker._lastInput=e,$.datepicker._setDateFromField(t),$.datepicker._inDialog&&(e.value=""),$.datepicker._pos||($.datepicker._pos=$.datepicker._findPos(e),$.datepicker._pos[1]+=e.offsetHeight);var i=!1;$(e).parents().each(function(){return i|=$(this).css("position")=="fixed",!i});var s={left:$.datepicker._pos[0],top:$.datepicker._pos[1]};$.datepicker._pos=null,t.dpDiv.empty(),t.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),$.datepicker._updateDatepicker(t),s=$.datepicker._checkOffset(t,s,i),t.dpDiv.css({position:$.datepicker._inDialog&&$.blockUI?"static":i?"fixed":"absolute",display:"none",left:s.left+"px",top:s.top+"px"});if(!t.inline){var o=$.datepicker._get(t,"showAnim"),u=$.datepicker._get(t,"duration"),a=function(){var e=t.dpDiv.find("iframe.ui-datepicker-cover");if(!!e.length){var n=$.datepicker._getBorders(t.dpDiv);e.css({left:-n[0],top:-n[1],width:t.dpDiv.outerWidth(),height:t.dpDiv.outerHeight()})}};t.dpDiv.zIndex($(e).zIndex()+1),$.datepicker._datepickerShowing=!0,$.effects&&($.effects.effect[o]||$.effects[o])?t.dpDiv.show(o,$.datepicker._get(t,"showOptions"),u,a):t.dpDiv[o||"show"](o?u:null,a),(!o||!u)&&a(),t.input.is(":visible")&&!t.input.is(":disabled")&&t.input.focus(),$.datepicker._curInst=t}},_updateDatepicker:function(e){this.maxRows=4;var t=$.datepicker._getBorders(e.dpDiv);instActive=e,e.dpDiv.empty().append(this._generateHTML(e)),this._attachHandlers(e);var n=e.dpDiv.find("iframe.ui-datepicker-cover");!n.length||n.css({left:-t[0],top:-t[1],width:e.dpDiv.outerWidth(),height:e.dpDiv.outerHeight()}),e.dpDiv.find("."+this._dayOverClass+" a").mouseover();var r=this._getNumberOfMonths(e),i=r[1],s=17;e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),i>1&&e.dpDiv.addClass("ui-datepicker-multi-"+i).css("width",s*i+"em"),e.dpDiv[(r[0]!=1||r[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi"),e.dpDiv[(this._get(e,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),e==$.datepicker._curInst&&$.datepicker._datepickerShowing&&e.input&&e.input.is(":visible")&&!e.input.is(":disabled")&&e.input[0]!=document.activeElement&&e.input.focus();if(e.yearshtml){var o=e.yearshtml;setTimeout(function(){o===e.yearshtml&&e.yearshtml&&e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml),o=e.yearshtml=null},0)}},_getBorders:function(e){var t=function(e){return{thin:1,medium:2,thick:3}[e]||e};return[parseFloat(t(e.css("border-left-width"))),parseFloat(t(e.css("border-top-width")))]},_checkOffset:function(e,t,n){var r=e.dpDiv.outerWidth(),i=e.dpDiv.outerHeight(),s=e.input?e.input.outerWidth():0,o=e.input?e.input.outerHeight():0,u=document.documentElement.clientWidth+(n?0:$(document).scrollLeft()),a=document.documentElement.clientHeight+(n?0:$(document).scrollTop());return t.left-=this._get(e,"isRTL")?r-s:0,t.left-=n&&t.left==e.input.offset().left?$(document).scrollLeft():0,t.top-=n&&t.top==e.input.offset().top+o?$(document).scrollTop():0,t.left-=Math.min(t.left,t.left+r>u&&u>r?Math.abs(t.left+r-u):0),t.top-=Math.min(t.top,t.top+i>a&&a>i?Math.abs(i+o):0),t},_findPos:function(e){var t=this._getInst(e),n=this._get(t,"isRTL");while(e&&(e.type=="hidden"||e.nodeType!=1||$.expr.filters.hidden(e)))e=e[n?"previousSibling":"nextSibling"];var r=$(e).offset();return[r.left,r.top]},_hideDatepicker:function(e){var t=this._curInst;if(!t||e&&t!=$.data(e,PROP_NAME))return;if(this._datepickerShowing){var n=this._get(t,"showAnim"),r=this._get(t,"duration"),i=function(){$.datepicker._tidyDialog(t)};$.effects&&($.effects.effect[n]||$.effects[n])?t.dpDiv.hide(n,$.datepicker._get(t,"showOptions"),r,i):t.dpDiv[n=="slideDown"?"slideUp":n=="fadeIn"?"fadeOut":"hide"](n?r:null,i),n||i(),this._datepickerShowing=!1;var s=this._get(t,"onClose");s&&s.apply(t.input?t.input[0]:null,[t.input?t.input.val():"",t]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),$.blockUI&&($.unblockUI(),$("body").append(this.dpDiv))),this._inDialog=!1}},_tidyDialog:function(e){e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(e){if(!$.datepicker._curInst)return;var t=$(e.target),n=$.datepicker._getInst(t[0]);(t[0].id!=$.datepicker._mainDivId&&t.parents("#"+$.datepicker._mainDivId).length==0&&!t.hasClass($.datepicker.markerClassName)&&!t.closest("."+$.datepicker._triggerClass).length&&$.datepicker._datepickerShowing&&(!$.datepicker._inDialog||!$.blockUI)||t.hasClass($.datepicker.markerClassName)&&$.datepicker._curInst!=n)&&$.datepicker._hideDatepicker()},_adjustDate:function(e,t,n){var r=$(e),i=this._getInst(r[0]);if(this._isDisabledDatepicker(r[0]))return;this._adjustInstDate(i,t+(n=="M"?this._get(i,"showCurrentAtPos"):0),n),this._updateDatepicker(i)},_gotoToday:function(e){var t=$(e),n=this._getInst(t[0]);if(this._get(n,"gotoCurrent")&&n.currentDay)n.selectedDay=n.currentDay,n.drawMonth=n.selectedMonth=n.currentMonth,n.drawYear=n.selectedYear=n.currentYear;else{var r=new Date;n.selectedDay=r.getDate(),n.drawMonth=n.selectedMonth=r.getMonth(),n.drawYear=n.selectedYear=r.getFullYear()}this._notifyChange(n),this._adjustDate(t)},_selectMonthYear:function(e,t,n){var r=$(e),i=this._getInst(r[0]);i["selected"+(n=="M"?"Month":"Year")]=i["draw"+(n=="M"?"Month":"Year")]=parseInt(t.options[t.selectedIndex].value,10),this._notifyChange(i),this._adjustDate(r)},_selectDay:function(e,t,n,r){var i=$(e);if($(r).hasClass(this._unselectableClass)||this._isDisabledDatepicker(i[0]))return;var s=this._getInst(i[0]);s.selectedDay=s.currentDay=$("a",r).html(),s.selectedMonth=s.currentMonth=t,s.selectedYear=s.currentYear=n,this._selectDate(e,this._formatDate(s,s.currentDay,s.currentMonth,s.currentYear))},_clearDate:function(e){var t=$(e),n=this._getInst(t[0]);this._selectDate(t,"")},_selectDate:function(e,t){var n=$(e),r=this._getInst(n[0]);t=t!=null?t:this._formatDate(r),r.input&&r.input.val(t),this._updateAlternate(r);var i=this._get(r,"onSelect");i?i.apply(r.input?r.input[0]:null,[t,r]):r.input&&r.input.trigger("change"),r.inline?this._updateDatepicker(r):(this._hideDatepicker(),this._lastInput=r.input[0],typeof r.input[0]!="object"&&r.input.focus(),this._lastInput=null)},_updateAlternate:function(e){var t=this._get(e,"altField");if(t){var n=this._get(e,"altFormat")||this._get(e,"dateFormat"),r=this._getDate(e),i=this.formatDate(n,r,this._getFormatConfig(e));$(t).each(function(){$(this).val(i)})}},noWeekends:function(e){var t=e.getDay();return[t>0&&t<6,""]},iso8601Week:function(e){var t=new Date(e.getTime());t.setDate(t.getDate()+4-(t.getDay()||7));var n=t.getTime();return t.setMonth(0),t.setDate(1),Math.floor(Math.round((n-t)/864e5)/7)+1},parseDate:function(e,t,n){if(e==null||t==null)throw"Invalid arguments";t=typeof t=="object"?t.toString():t+"";if(t=="")return null;var r=(n?n.shortYearCutoff:null)||this._defaults.shortYearCutoff;r=typeof r!="string"?r:(new Date).getFullYear()%100+parseInt(r,10);var i=(n?n.dayNamesShort:null)||this._defaults.dayNamesShort,s=(n?n.dayNames:null)||this._defaults.dayNames,o=(n?n.monthNamesShort:null)||this._defaults.monthNamesShort,u=(n?n.monthNames:null)||this._defaults.monthNames,a=-1,f=-1,l=-1,c=-1,h=!1,p=function(t){var n=y+1<e.length&&e.charAt(y+1)==t;return n&&y++,n},d=function(e){var n=p(e),r=e=="@"?14:e=="!"?20:e=="y"&&n?4:e=="o"?3:2,i=new RegExp("^\\d{1,"+r+"}"),s=t.substring(g).match(i);if(!s)throw"Missing number at position "+g;return g+=s[0].length,parseInt(s[0],10)},v=function(e,n,r){var i=$.map(p(e)?r:n,function(e,t){return[[t,e]]}).sort(function(e,t){return-(e[1].length-t[1].length)}),s=-1;$.each(i,function(e,n){var r=n[1];if(t.substr(g,r.length).toLowerCase()==r.toLowerCase())return s=n[0],g+=r.length,!1});if(s!=-1)return s+1;throw"Unknown name at position "+g},m=function(){if(t.charAt(g)!=e.charAt(y))throw"Unexpected literal at position "+g;g++},g=0;for(var y=0;y<e.length;y++)if(h)e.charAt(y)=="'"&&!p("'")?h=!1:m();else switch(e.charAt(y)){case"d":l=d("d");break;case"D":v("D",i,s);break;case"o":c=d("o");break;case"m":f=d("m");break;case"M":f=v("M",o,u);break;case"y":a=d("y");break;case"@":var b=new Date(d("@"));a=b.getFullYear(),f=b.getMonth()+1,l=b.getDate();break;case"!":var b=new Date((d("!")-this._ticksTo1970)/1e4);a=b.getFullYear(),f=b.getMonth()+1,l=b.getDate();break;case"'":p("'")?m():h=!0;break;default:m()}if(g<t.length){var w=t.substr(g);if(!/^\s+/.test(w))throw"Extra/unparsed characters found in date: "+w}a==-1?a=(new Date).getFullYear():a<100&&(a+=(new Date).getFullYear()-(new Date).getFullYear()%100+(a<=r?0:-100));if(c>-1){f=1,l=c;do{var E=this._getDaysInMonth(a,f-1);if(l<=E)break;f++,l-=E}while(!0)}var b=this._daylightSavingAdjust(new Date(a,f-1,l));if(b.getFullYear()!=a||b.getMonth()+1!=f||b.getDate()!=l)throw"Invalid date";return b},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*24*60*60*1e7,formatDate:function(e,t,n){if(!t)return"";var r=(n?n.dayNamesShort:null)||this._defaults.dayNamesShort,i=(n?n.dayNames:null)||this._defaults.dayNames,s=(n?n.monthNamesShort:null)||this._defaults.monthNamesShort,o=(n?n.monthNames:null)||this._defaults.monthNames,u=function(t){var n=h+1<e.length&&e.charAt(h+1)==t;return n&&h++,n},a=function(e,t,n){var r=""+t;if(u(e))while(r.length<n)r="0"+r;return r},f=function(e,t,n,r){return u(e)?r[t]:n[t]},l="",c=!1;if(t)for(var h=0;h<e.length;h++)if(c)e.charAt(h)=="'"&&!u("'")?c=!1:l+=e.charAt(h);else switch(e.charAt(h)){case"d":l+=a("d",t.getDate(),2);break;case"D":l+=f("D",t.getDay(),r,i);break;case"o":l+=a("o",Math.round(((new Date(t.getFullYear(),t.getMonth(),t.getDate())).getTime()-(new Date(t.getFullYear(),0,0)).getTime())/864e5),3);break;case"m":l+=a("m",t.getMonth()+1,2);break;case"M":l+=f("M",t.getMonth(),s,o);break;case"y":l+=u("y")?t.getFullYear():(t.getYear()%100<10?"0":"")+t.getYear()%100;break;case"@":l+=t.getTime();break;case"!":l+=t.getTime()*1e4+this._ticksTo1970;break;case"'":u("'")?l+="'":c=!0;break;default:l+=e.charAt(h)}return l},_possibleChars:function(e){var t="",n=!1,r=function(t){var n=i+1<e.length&&e.charAt(i+1)==t;return n&&i++,n};for(var i=0;i<e.length;i++)if(n)e.charAt(i)=="'"&&!r("'")?n=!1:t+=e.charAt(i);else switch(e.charAt(i)){case"d":case"m":case"y":case"@":t+="0123456789";break;case"D":case"M":return null;case"'":r("'")?t+="'":n=!0;break;default:t+=e.charAt(i)}return t},_get:function(e,t){return e.settings[t]!==undefined?e.settings[t]:this._defaults[t]},_setDateFromField:function(e,t){if(e.input.val()==e.lastVal)return;var n=this._get(e,"dateFormat"),r=e.lastVal=e.input?e.input.val():null,i,s;i=s=this._getDefaultDate(e);var o=this._getFormatConfig(e);try{i=this.parseDate(n,r,o)||s}catch(u){this.log(u),r=t?"":r}e.selectedDay=i.getDate(),e.drawMonth=e.selectedMonth=i.getMonth(),e.drawYear=e.selectedYear=i.getFullYear(),e.currentDay=r?i.getDate():0,e.currentMonth=r?i.getMonth():0,e.currentYear=r?i.getFullYear():0,this._adjustInstDate(e)},_getDefaultDate:function(e){return this._restrictMinMax(e,this._determineDate(e,this._get(e,"defaultDate"),new Date))},_determineDate:function(e,t,n){var r=function(e){var t=new Date;return t.setDate(t.getDate()+e),t},i=function(t){try{return $.datepicker.parseDate($.datepicker._get(e,"dateFormat"),t,$.datepicker._getFormatConfig(e))}catch(n){}var r=(t.toLowerCase().match(/^c/)?$.datepicker._getDate(e):null)||new Date,i=r.getFullYear(),s=r.getMonth(),o=r.getDate(),u=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,a=u.exec(t);while(a){switch(a[2]||"d"){case"d":case"D":o+=parseInt(a[1],10);break;case"w":case"W":o+=parseInt(a[1],10)*7;break;case"m":case"M":s+=parseInt(a[1],10),o=Math.min(o,$.datepicker._getDaysInMonth(i,s));break;case"y":case"Y":i+=parseInt(a[1],10),o=Math.min(o,$.datepicker._getDaysInMonth(i,s))}a=u.exec(t)}return new Date(i,s,o)},s=t==null||t===""?n:typeof t=="string"?i(t):typeof t=="number"?isNaN(t)?n:r(t):new Date(t.getTime());return s=s&&s.toString()=="Invalid Date"?n:s,s&&(s.setHours(0),s.setMinutes(0),s.setSeconds(0),s.setMilliseconds(0)),this._daylightSavingAdjust(s)},_daylightSavingAdjust:function(e){return e?(e.setHours(e.getHours()>12?e.getHours()+2:0),e):null},_setDate:function(e,t,n){var r=!t,i=e.selectedMonth,s=e.selectedYear,o=this._restrictMinMax(e,this._determineDate(e,t,new Date));e.selectedDay=e.currentDay=o.getDate(),e.drawMonth=e.selectedMonth=e.currentMonth=o.getMonth(),e.drawYear=e.selectedYear=e.currentYear=o.getFullYear(),(i!=e.selectedMonth||s!=e.selectedYear)&&!n&&this._notifyChange(e),this._adjustInstDate(e),e.input&&e.input.val(r?"":this._formatDate(e))},_getDate:function(e){var t=!e.currentYear||e.input&&e.input.val()==""?null:this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return t},_attachHandlers:function(e){var t=this._get(e,"stepMonths"),n="#"+e.id.replace(/\\\\/g,"\\");e.dpDiv.find("[data-handler]").map(function(){var e={prev:function(){window["DP_jQuery_"+dpuuid].datepicker._adjustDate(n,-t,"M")},next:function(){window["DP_jQuery_"+dpuuid].datepicker._adjustDate(n,+t,"M")},hide:function(){window["DP_jQuery_"+dpuuid].datepicker._hideDatepicker()},today:function(){window["DP_jQuery_"+dpuuid].datepicker._gotoToday(n)},selectDay:function(){return window["DP_jQuery_"+dpuuid].datepicker._selectDay(n,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return window["DP_jQuery_"+dpuuid].datepicker._selectMonthYear(n,this,"M"),!1},selectYear:function(){return window["DP_jQuery_"+dpuuid].datepicker._selectMonthYear(n,this,"Y"),!1}};$(this).bind(this.getAttribute("data-event"),e[this.getAttribute("data-handler")])})},_generateHTML:function(e){var t=new Date;t=this._daylightSavingAdjust(new Date(t.getFullYear(),t.getMonth(),t.getDate()));var n=this._get(e,"isRTL"),r=this._get(e,"showButtonPanel"),i=this._get(e,"hideIfNoPrevNext"),s=this._get(e,"navigationAsDateFormat"),o=this._getNumberOfMonths(e),u=this._get(e,"showCurrentAtPos"),a=this._get(e,"stepMonths"),f=o[0]!=1||o[1]!=1,l=this._daylightSavingAdjust(e.currentDay?new Date(e.currentYear,e.currentMonth,e.currentDay):new Date(9999,9,9)),c=this._getMinMaxDate(e,"min"),h=this._getMinMaxDate(e,"max"),p=e.drawMonth-u,d=e.drawYear;p<0&&(p+=12,d--);if(h){var v=this._daylightSavingAdjust(new Date(h.getFullYear(),h.getMonth()-o[0]*o[1]+1,h.getDate()));v=c&&v<c?c:v;while(this._daylightSavingAdjust(new Date(d,p,1))>v)p--,p<0&&(p=11,d--)}e.drawMonth=p,e.drawYear=d;var m=this._get(e,"prevText");m=s?this.formatDate(m,this._daylightSavingAdjust(new Date(d,p-a,1)),this._getFormatConfig(e)):m;var g=this._canAdjustMonth(e,-1,d,p)?'<a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click" title="'+m+'"><span class="ui-icon ui-icon-circle-triangle-'+(n?"e":"w")+'">'+m+"</span></a>":i?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+m+'"><span class="ui-icon ui-icon-circle-triangle-'+(n?"e":"w")+'">'+m+"</span></a>",y=this._get(e,"nextText");y=s?this.formatDate(y,this._daylightSavingAdjust(new Date(d,p+a,1)),this._getFormatConfig(e)):y;var b=this._canAdjustMonth(e,1,d,p)?'<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="'+y+'"><span class="ui-icon ui-icon-circle-triangle-'+(n?"w":"e")+'">'+y+"</span></a>":i?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+y+'"><span class="ui-icon ui-icon-circle-triangle-'+(n?"w":"e")+'">'+y+"</span></a>",w=this._get(e,"currentText"),E=this._get(e,"gotoCurrent")&&e.currentDay?l:t;w=s?this.formatDate(w,E,this._getFormatConfig(e)):w;var S=e.inline?"":'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">'+this._get(e,"closeText")+"</button>",x=r?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(n?S:"")+(this._isInRange(e,E)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click">'+w+"</button>":"")+(n?"":S)+"</div>":"",T=parseInt(this._get(e,"firstDay"),10);T=isNaN(T)?0:T;var N=this._get(e,"showWeek"),C=this._get(e,"dayNames"),k=this._get(e,"dayNamesShort"),L=this._get(e,"dayNamesMin"),A=this._get(e,"monthNames"),O=this._get(e,"monthNamesShort"),M=this._get(e,"beforeShowDay"),_=this._get(e,"showOtherMonths"),D=this._get(e,"selectOtherMonths"),P=this._get(e,"calculateWeek")||this.iso8601Week,H=this._getDefaultDate(e),B="";for(var j=0;j<o[0];j++){var F="";this.maxRows=4;for(var I=0;I<o[1];I++){var q=this._daylightSavingAdjust(new Date(d,p,e.selectedDay)),R=" ui-corner-all",U="";if(f){U+='<div class="ui-datepicker-group';if(o[1]>1)switch(I){case 0:U+=" ui-datepicker-group-first",R=" ui-corner-"+(n?"right":"left");break;case o[1]-1:U+=" ui-datepicker-group-last",R=" ui-corner-"+(n?"left":"right");break;default:U+=" ui-datepicker-group-middle",R=""}U+='">'}U+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+R+'">'+(/all|left/.test(R)&&j==0?n?b:g:"")+(/all|right/.test(R)&&j==0?n?g:b:"")+this._generateMonthYearHeader(e,p,d,c,h,j>0||I>0,A,O)+'</div><table class="ui-datepicker-calendar"><thead>'+"<tr>";var z=N?'<th class="ui-datepicker-week-col">'+this._get(e,"weekHeader")+"</th>":"";for(var W=0;W<7;W++){var X=(W+T)%7;z+="<th"+((W+T+6)%7>=5?' class="ui-datepicker-week-end"':"")+">"+'<span title="'+C[X]+'">'+L[X]+"</span></th>"}U+=z+"</tr></thead><tbody>";var V=this._getDaysInMonth(d,p);d==e.selectedYear&&p==e.selectedMonth&&(e.selectedDay=Math.min(e.selectedDay,V));var J=(this._getFirstDayOfMonth(d,p)-T+7)%7,K=Math.ceil((J+V)/7),Q=f?this.maxRows>K?this.maxRows:K:K;this.maxRows=Q;var G=this._daylightSavingAdjust(new Date(d,p,1-J));for(var Y=0;Y<Q;Y++){U+="<tr>";var Z=N?'<td class="ui-datepicker-week-col">'+this._get(e,"calculateWeek")(G)+"</td>":"";for(var W=0;W<7;W++){var et=M?M.apply(e.input?e.input[0]:null,[G]):[!0,""],tt=G.getMonth()!=p,nt=tt&&!D||!et[0]||c&&G<c||h&&G>h;Z+='<td class="'+((W+T+6)%7>=5?" ui-datepicker-week-end":"")+(tt?" ui-datepicker-other-month":"")+(G.getTime()==q.getTime()&&p==e.selectedMonth&&e._keyEvent||H.getTime()==G.getTime()&&H.getTime()==q.getTime()?" "+this._dayOverClass:"")+(nt?" "+this._unselectableClass+" ui-state-disabled":"")+(tt&&!_?"":" "+et[1]+(G.getTime()==l.getTime()?" "+this._currentClass:"")+(G.getTime()==t.getTime()?" ui-datepicker-today":""))+'"'+((!tt||_)&&et[2]?' title="'+et[2]+'"':"")+(nt?"":' data-handler="selectDay" data-event="click" data-month="'+G.getMonth()+'" data-year="'+G.getFullYear()+'"')+">"+(tt&&!_?"&#xa0;":nt?'<span class="ui-state-default">'+G.getDate()+"</span>":'<a class="ui-state-default'+(G.getTime()==t.getTime()?" ui-state-highlight":"")+(G.getTime()==l.getTime()?" ui-state-active":"")+(tt?" ui-priority-secondary":"")+'" href="#">'+G.getDate()+"</a>")+"</td>",G.setDate(G.getDate()+1),G=this._daylightSavingAdjust(G)}U+=Z+"</tr>"}p++,p>11&&(p=0,d++),U+="</tbody></table>"+(f?"</div>"+(o[0]>0&&I==o[1]-1?'<div class="ui-datepicker-row-break"></div>':""):""),F+=U}B+=F}return B+=x+($.ui.ie6&&!e.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':""),e._keyEvent=!1,B},_generateMonthYearHeader:function(e,t,n,r,i,s,o,u){var a=this._get(e,"changeMonth"),f=this._get(e,"changeYear"),l=this._get(e,"showMonthAfterYear"),c='<div class="ui-datepicker-title">',h="";if(s||!a)h+='<span class="ui-datepicker-month">'+o[t]+"</span>";else{var p=r&&r.getFullYear()==n,d=i&&i.getFullYear()==n;h+='<select class="ui-datepicker-month" data-handler="selectMonth" data-event="change">';for(var v=0;v<12;v++)(!p||v>=r.getMonth())&&(!d||v<=i.getMonth())&&(h+='<option value="'+v+'"'+(v==t?' selected="selected"':"")+">"+u[v]+"</option>");h+="</select>"}l||(c+=h+(s||!a||!f?"&#xa0;":""));if(!e.yearshtml){e.yearshtml="";if(s||!f)c+='<span class="ui-datepicker-year">'+n+"</span>";else{var m=this._get(e,"yearRange").split(":"),g=(new Date).getFullYear(),y=function(e){var t=e.match(/c[+-].*/)?n+parseInt(e.substring(1),10):e.match(/[+-].*/)?g+parseInt(e,10):parseInt(e,10);return isNaN(t)?g:t},b=y(m[0]),w=Math.max(b,y(m[1]||""));b=r?Math.max(b,r.getFullYear()):b,w=i?Math.min(w,i.getFullYear()):w,e.yearshtml+='<select class="ui-datepicker-year" data-handler="selectYear" data-event="change">';for(;b<=w;b++)e.yearshtml+='<option value="'+b+'"'+(b==n?' selected="selected"':"")+">"+b+"</option>";e.yearshtml+="</select>",c+=e.yearshtml,e.yearshtml=null}}return c+=this._get(e,"yearSuffix"),l&&(c+=(s||!a||!f?"&#xa0;":"")+h),c+="</div>",c},_adjustInstDate:function(e,t,n){var r=e.drawYear+(n=="Y"?t:0),i=e.drawMonth+(n=="M"?t:0),s=Math.min(e.selectedDay,this._getDaysInMonth(r,i))+(n=="D"?t:0),o=this._restrictMinMax(e,this._daylightSavingAdjust(new Date(r,i,s)));e.selectedDay=o.getDate(),e.drawMonth=e.selectedMonth=o.getMonth(),e.drawYear=e.selectedYear=o.getFullYear(),(n=="M"||n=="Y")&&this._notifyChange(e)},_restrictMinMax:function(e,t){var n=this._getMinMaxDate(e,"min"),r=this._getMinMaxDate(e,"max"),i=n&&t<n?n:t;return i=r&&i>r?r:i,i},_notifyChange:function(e){var t=this._get(e,"onChangeMonthYear");t&&t.apply(e.input?e.input[0]:null,[e.selectedYear,e.selectedMonth+1,e])},_getNumberOfMonths:function(e){var t=this._get(e,"numberOfMonths");return t==null?[1,1]:typeof t=="number"?[1,t]:t},_getMinMaxDate:function(e,t){return this._determineDate(e,this._get(e,t+"Date"),null)},_getDaysInMonth:function(e,t){return 32-this._daylightSavingAdjust(new Date(e,t,32)).getDate()},_getFirstDayOfMonth:function(e,t){return(new Date(e,t,1)).getDay()},_canAdjustMonth:function(e,t,n,r){var i=this._getNumberOfMonths(e),s=this._daylightSavingAdjust(new Date(n,r+(t<0?t:i[0]*i[1]),1));return t<0&&s.setDate(this._getDaysInMonth(s.getFullYear(),s.getMonth())),this._isInRange(e,s)},_isInRange:function(e,t){var n=this._getMinMaxDate(e,"min"),r=this._getMinMaxDate(e,"max");return(!n||t.getTime()>=n.getTime())&&(!r||t.getTime()<=r.getTime())},_getFormatConfig:function(e){var t=this._get(e,"shortYearCutoff");return t=typeof t!="string"?t:(new Date).getFullYear()%100+parseInt(t,10),{shortYearCutoff:t,dayNamesShort:this._get(e,"dayNamesShort"),dayNames:this._get(e,"dayNames"),monthNamesShort:this._get(e,"monthNamesShort"),monthNames:this._get(e,"monthNames")}},_formatDate:function(e,t,n,r){t||(e.currentDay=e.selectedDay,e.currentMonth=e.selectedMonth,e.currentYear=e.selectedYear);var i=t?typeof t=="object"?t:this._daylightSavingAdjust(new Date(r,n,t)):this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return this.formatDate(this._get(e,"dateFormat"),i,this._getFormatConfig(e))}}),$.fn.datepicker=function(e){if(!this.length)return this;$.datepicker.initialized||($(document).mousedown($.datepicker._checkExternalClick).find(document.body).append($.datepicker.dpDiv),$.datepicker.initialized=!0);var t=Array.prototype.slice.call(arguments,1);return typeof e!="string"||e!="isDisabled"&&e!="getDate"&&e!="widget"?e=="option"&&arguments.length==2&&typeof arguments[1]=="string"?$.datepicker["_"+e+"Datepicker"].apply($.datepicker,[this[0]].concat(t)):this.each(function(){typeof e=="string"?$.datepicker["_"+e+"Datepicker"].apply($.datepicker,[this].concat(t)):$.datepicker._attachDatepicker(this,e)}):$.datepicker["_"+e+"Datepicker"].apply($.datepicker,[this[0]].concat(t))},$.datepicker=new Datepicker,$.datepicker.initialized=!1,$.datepicker.uuid=(new Date).getTime(),$.datepicker.version="1.9.2",window["DP_jQuery_"+dpuuid]=$})(jQuery);(function(e,t){var n="ui-dialog ui-widget ui-widget-content ui-corner-all ",r={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};e.widget("ui.dialog",{version:"1.9.2",options:{autoOpen:!0,buttons:{},closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:!1,maxWidth:!1,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(t){var n=e(this).css(t).offset().top;n<0&&e(this).css("top",t.top-n)}},resizable:!0,show:null,stack:!0,title:"",width:300,zIndex:1e3},_create:function(){this.originalTitle=this.element.attr("title"),typeof this.originalTitle!="string"&&(this.originalTitle=""),this.oldPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.options.title=this.options.title||this.originalTitle;var t=this,r=this.options,i=r.title||"&#160;",s,o,u,a,f;s=(this.uiDialog=e("<div>")).addClass(n+r.dialogClass).css({display:"none",outline:0,zIndex:r.zIndex}).attr("tabIndex",-1).keydown(function(n){r.closeOnEscape&&!n.isDefaultPrevented()&&n.keyCode&&n.keyCode===e.ui.keyCode.ESCAPE&&(t.close(n),n.preventDefault())}).mousedown(function(e){t.moveToTop(!1,e)}).appendTo("body"),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(s),o=(this.uiDialogTitlebar=e("<div>")).addClass("ui-dialog-titlebar  ui-widget-header  ui-corner-all  ui-helper-clearfix").bind("mousedown",function(){s.focus()}).prependTo(s),u=e("<a href='#'></a>").addClass("ui-dialog-titlebar-close  ui-corner-all").attr("role","button").click(function(e){e.preventDefault(),t.close(e)}).appendTo(o),(this.uiDialogTitlebarCloseText=e("<span>")).addClass("ui-icon ui-icon-closethick").text(r.closeText).appendTo(u),a=e("<span>").uniqueId().addClass("ui-dialog-title").html(i).prependTo(o),f=(this.uiDialogButtonPane=e("<div>")).addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),(this.uiButtonSet=e("<div>")).addClass("ui-dialog-buttonset").appendTo(f),s.attr({role:"dialog","aria-labelledby":a.attr("id")}),o.find("*").add(o).disableSelection(),this._hoverable(u),this._focusable(u),r.draggable&&e.fn.draggable&&this._makeDraggable(),r.resizable&&e.fn.resizable&&this._makeResizable(),this._createButtons(r.buttons),this._isOpen=!1,e.fn.bgiframe&&s.bgiframe(),this._on(s,{keydown:function(t){if(!r.modal||t.keyCode!==e.ui.keyCode.TAB)return;var n=e(":tabbable",s),i=n.filter(":first"),o=n.filter(":last");if(t.target===o[0]&&!t.shiftKey)return i.focus(1),!1;if(t.target===i[0]&&t.shiftKey)return o.focus(1),!1}})},_init:function(){this.options.autoOpen&&this.open()},_destroy:function(){var e,t=this.oldPosition;this.overlay&&this.overlay.destroy(),this.uiDialog.hide(),this.element.removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"),this.uiDialog.remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),e=t.parent.children().eq(t.index),e.length&&e[0]!==this.element[0]?e.before(this.element):t.parent.append(this.element)},widget:function(){return this.uiDialog},close:function(t){var n=this,r,i;if(!this._isOpen)return;if(!1===this._trigger("beforeClose",t))return;return this._isOpen=!1,this.overlay&&this.overlay.destroy(),this.options.hide?this._hide(this.uiDialog,this.options.hide,function(){n._trigger("close",t)}):(this.uiDialog.hide(),this._trigger("close",t)),e.ui.dialog.overlay.resize(),this.options.modal&&(r=0,e(".ui-dialog").each(function(){this!==n.uiDialog[0]&&(i=e(this).css("z-index"),isNaN(i)||(r=Math.max(r,i)))}),e.ui.dialog.maxZ=r),this},isOpen:function(){return this._isOpen},moveToTop:function(t,n){var r=this.options,i;return r.modal&&!t||!r.stack&&!r.modal?this._trigger("focus",n):(r.zIndex>e.ui.dialog.maxZ&&(e.ui.dialog.maxZ=r.zIndex),this.overlay&&(e.ui.dialog.maxZ+=1,e.ui.dialog.overlay.maxZ=e.ui.dialog.maxZ,this.overlay.$el.css("z-index",e.ui.dialog.overlay.maxZ)),i={scrollTop:this.element.scrollTop(),scrollLeft:this.element.scrollLeft()},e.ui.dialog.maxZ+=1,this.uiDialog.css("z-index",e.ui.dialog.maxZ),this.element.attr(i),this._trigger("focus",n),this)},open:function(){if(this._isOpen)return;var t,n=this.options,r=this.uiDialog;return this._size(),this._position(n.position),r.show(n.show),this.overlay=n.modal?new e.ui.dialog.overlay(this):null,this.moveToTop(!0),t=this.element.find(":tabbable"),t.length||(t=this.uiDialogButtonPane.find(":tabbable"),t.length||(t=r)),t.eq(0).focus(),this._isOpen=!0,this._trigger("open"),this},_createButtons:function(t){var n=this,r=!1;this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),typeof t=="object"&&t!==null&&e.each(t,function(){return!(r=!0)}),r?(e.each(t,function(t,r){var i,s;r=e.isFunction(r)?{click:r,text:t}:r,r=e.extend({type:"button"},r),s=r.click,r.click=function(){s.apply(n.element[0],arguments)},i=e("<button></button>",r).appendTo(n.uiButtonSet),e.fn.button&&i.button()}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog)):this.uiDialog.removeClass("ui-dialog-buttons")},_makeDraggable:function(){function r(e){return{position:e.position,offset:e.offset}}var t=this,n=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(n,i){e(this).addClass("ui-dialog-dragging"),t._trigger("dragStart",n,r(i))},drag:function(e,n){t._trigger("drag",e,r(n))},stop:function(i,s){n.position=[s.position.left-t.document.scrollLeft(),s.position.top-t.document.scrollTop()],e(this).removeClass("ui-dialog-dragging"),t._trigger("dragStop",i,r(s)),e.ui.dialog.overlay.resize()}})},_makeResizable:function(n){function u(e){return{originalPosition:e.originalPosition,originalSize:e.originalSize,position:e.position,size:e.size}}n=n===t?this.options.resizable:n;var r=this,i=this.options,s=this.uiDialog.css("position"),o=typeof n=="string"?n:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:i.maxWidth,maxHeight:i.maxHeight,minWidth:i.minWidth,minHeight:this._minHeight(),handles:o,start:function(t,n){e(this).addClass("ui-dialog-resizing"),r._trigger("resizeStart",t,u(n))},resize:function(e,t){r._trigger("resize",e,u(t))},stop:function(t,n){e(this).removeClass("ui-dialog-resizing"),i.height=e(this).height(),i.width=e(this).width(),r._trigger("resizeStop",t,u(n)),e.ui.dialog.overlay.resize()}}).css("position",s).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var e=this.options;return e.height==="auto"?e.minHeight:Math.min(e.minHeight,e.height)},_position:function(t){var n=[],r=[0,0],i;if(t){if(typeof t=="string"||typeof t=="object"&&"0"in t)n=t.split?t.split(" "):[t[0],t[1]],n.length===1&&(n[1]=n[0]),e.each(["left","top"],function(e,t){+n[e]===n[e]&&(r[e]=n[e],n[e]=t)}),t={my:n[0]+(r[0]<0?r[0]:"+"+r[0])+" "+n[1]+(r[1]<0?r[1]:"+"+r[1]),at:n.join(" ")};t=e.extend({},e.ui.dialog.prototype.options.position,t)}else t=e.ui.dialog.prototype.options.position;i=this.uiDialog.is(":visible"),i||this.uiDialog.show(),this.uiDialog.position(t),i||this.uiDialog.hide()},_setOptions:function(t){var n=this,s={},o=!1;e.each(t,function(e,t){n._setOption(e,t),e in r&&(o=!0),e in i&&(s[e]=t)}),o&&this._size(),this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",s)},_setOption:function(t,r){var i,s,o=this.uiDialog;switch(t){case"buttons":this._createButtons(r);break;case"closeText":this.uiDialogTitlebarCloseText.text(""+r);break;case"dialogClass":o.removeClass(this.options.dialogClass).addClass(n+r);break;case"disabled":r?o.addClass("ui-dialog-disabled"):o.removeClass("ui-dialog-disabled");break;case"draggable":i=o.is(":data(draggable)"),i&&!r&&o.draggable("destroy"),!i&&r&&this._makeDraggable();break;case"position":this._position(r);break;case"resizable":s=o.is(":data(resizable)"),s&&!r&&o.resizable("destroy"),s&&typeof r=="string"&&o.resizable("option","handles",r),!s&&r!==!1&&this._makeResizable(r);break;case"title":e(".ui-dialog-title",this.uiDialogTitlebar).html(""+(r||"&#160;"))}this._super(t,r)},_size:function(){var t,n,r,i=this.options,s=this.uiDialog.is(":visible");this.element.show().css({width:"auto",minHeight:0,height:0}),i.minWidth>i.width&&(i.width=i.minWidth),t=this.uiDialog.css({height:"auto",width:i.width}).outerHeight(),n=Math.max(0,i.minHeight-t),i.height==="auto"?e.support.minHeight?this.element.css({minHeight:n,height:"auto"}):(this.uiDialog.show(),r=this.element.css("height","auto").height(),s||this.uiDialog.hide(),this.element.height(Math.max(r,n))):this.element.height(Math.max(i.height-t,0)),this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())}}),e.extend(e.ui.dialog,{uuid:0,maxZ:0,getTitleId:function(e){var t=e.attr("id");return t||(this.uuid+=1,t=this.uuid),"ui-dialog-title-"+t},overlay:function(t){this.$el=e.ui.dialog.overlay.create(t)}}),e.extend(e.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:e.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(e){return e+".dialog-overlay"}).join(" "),create:function(t){this.instances.length===0&&(setTimeout(function(){e.ui.dialog.overlay.instances.length&&e(document).bind(e.ui.dialog.overlay.events,function(t){if(e(t.target).zIndex()<e.ui.dialog.overlay.maxZ)return!1})},1),e(window).bind("resize.dialog-overlay",e.ui.dialog.overlay.resize));var n=this.oldInstances.pop()||e("<div>").addClass("ui-widget-overlay");return e(document).bind("keydown.dialog-overlay",function(r){var i=e.ui.dialog.overlay.instances;i.length!==0&&i[i.length-1]===n&&t.options.closeOnEscape&&!r.isDefaultPrevented()&&r.keyCode&&r.keyCode===e.ui.keyCode.ESCAPE&&(t.close(r),r.preventDefault())}),n.appendTo(document.body).css({width:this.width(),height:this.height()}),e.fn.bgiframe&&n.bgiframe(),this.instances.push(n),n},destroy:function(t){var n=e.inArray(t,this.instances),r=0;n!==-1&&this.oldInstances.push(this.instances.splice(n,1)[0]),this.instances.length===0&&e([document,window]).unbind(".dialog-overlay"),t.height(0).width(0).remove(),e.each(this.instances,function(){r=Math.max(r,this.css("z-index"))}),this.maxZ=r},height:function(){var t,n;return e.ui.ie?(t=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight),n=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight),t<n?e(window).height()+"px":t+"px"):e(document).height()+"px"},width:function(){var t,n;return e.ui.ie?(t=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),n=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth),t<n?e(window).width()+"px":t+"px"):e(document).width()+"px"},resize:function(){var t=e([]);e.each(e.ui.dialog.overlay.instances,function(){t=t.add(this)}),t.css({width:0,height:0}).css({width:e.ui.dialog.overlay.width(),height:e.ui.dialog.overlay.height()})}}),e.extend(e.ui.dialog.overlay.prototype,{destroy:function(){e.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);(function(e,t){e.widget("ui.draggable",e.ui.mouse,{version:"1.9.2",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))&&(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(t){var n=this.options;return this.helper||n.disabled||e(t.target).is(".ui-resizable-handle")?!1:(this.handle=this._getHandle(t),this.handle?(e(n.iframeFix===!0?"iframe":n.iframeFix).each(function(){e('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(e(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(t){var n=this.options;return this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),e.ui.ddmanager&&(e.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,n.cursorAt&&this._adjustOffsetFromHelper(n.cursorAt),n.containment&&this._setContainment(),this._trigger("start",t)===!1?(this._clear(),!1):(this._cacheHelperProportions(),e.ui.ddmanager&&!n.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this._mouseDrag(t,!0),e.ui.ddmanager&&e.ui.ddmanager.dragStart(this,t),!0)},_mouseDrag:function(t,n){this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute");if(!n){var r=this._uiHash();if(this._trigger("drag",t,r)===!1)return this._mouseUp({}),!1;this.position=r.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";return e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),!1},_mouseStop:function(t){var n=!1;e.ui.ddmanager&&!this.options.dropBehaviour&&(n=e.ui.ddmanager.drop(this,t)),this.dropped&&(n=this.dropped,this.dropped=!1);var r=this.element[0],i=!1;while(r&&(r=r.parentNode))r==document&&(i=!0);if(!i&&this.options.helper==="original")return!1;if(this.options.revert=="invalid"&&!n||this.options.revert=="valid"&&n||this.options.revert===!0||e.isFunction(this.options.revert)&&this.options.revert.call(this.element,n)){var s=this;e(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){s._trigger("stop",t)!==!1&&s._clear()})}else this._trigger("stop",t)!==!1&&this._clear();return!1},_mouseUp:function(t){return e("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),e.ui.ddmanager&&e.ui.ddmanager.dragStop(this,t),e.ui.mouse.prototype._mouseUp.call(this,t)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(t){var n=!this.options.handle||!e(this.options.handle,this.element).length?!0:!1;return e(this.options.handle,this.element).find("*").andSelf().each(function(){this==t.target&&(n=!0)}),n},_createHelper:function(t){var n=this.options,r=e.isFunction(n.helper)?e(n.helper.apply(this.element[0],[t])):n.helper=="clone"?this.element.clone().removeAttr("id"):this.element;return r.parents("body").length||r.appendTo(n.appendTo=="parent"?this.element[0].parentNode:n.appendTo),r[0]!=this.element[0]&&!/(fixed|absolute)/.test(r.css("position"))&&r.css("position","absolute"),r},_adjustOffsetFromHelper:function(t){typeof t=="string"&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&e.ui.ie)t={top:0,left:0};return{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var e=this.element.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t=this.options;t.containment=="parent"&&(t.containment=this.helper[0].parentNode);if(t.containment=="document"||t.containment=="window")this.containment=[t.containment=="document"?0:e(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t.containment=="document"?0:e(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(t.containment=="document"?0:e(window).scrollLeft())+e(t.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(t.containment=="document"?0:e(window).scrollTop())+(e(t.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(t.containment)&&t.containment.constructor!=Array){var n=e(t.containment),r=n[0];if(!r)return;var i=n.offset(),s=e(r).css("overflow")!="hidden";this.containment=[(parseInt(e(r).css("borderLeftWidth"),10)||0)+(parseInt(e(r).css("paddingLeft"),10)||0),(parseInt(e(r).css("borderTopWidth"),10)||0)+(parseInt(e(r).css("paddingTop"),10)||0),(s?Math.max(r.scrollWidth,r.offsetWidth):r.offsetWidth)-(parseInt(e(r).css("borderLeftWidth"),10)||0)-(parseInt(e(r).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(s?Math.max(r.scrollHeight,r.offsetHeight):r.offsetHeight)-(parseInt(e(r).css("borderTopWidth"),10)||0)-(parseInt(e(r).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=n}else t.containment.constructor==Array&&(this.containment=t.containment)},_convertPositionTo:function(t,n){n||(n=this.position);var r=t=="absolute"?1:-1,i=this.options,s=this.cssPosition!="absolute"||this.scrollParent[0]!=document&&!!e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(s[0].tagName);return{top:n.top+this.offset.relative.top*r+this.offset.parent.top*r-(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():o?0:s.scrollTop())*r,left:n.left+this.offset.relative.left*r+this.offset.parent.left*r-(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():o?0:s.scrollLeft())*r}},_generatePosition:function(t){var n=this.options,r=this.cssPosition!="absolute"||this.scrollParent[0]!=document&&!!e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,i=/(html|body)/i.test(r[0].tagName),s=t.pageX,o=t.pageY;if(this.originalPosition){var u;if(this.containment){if(this.relative_container){var a=this.relative_container.offset();u=[this.containment[0]+a.left,this.containment[1]+a.top,this.containment[2]+a.left,this.containment[3]+a.top]}else u=this.containment;t.pageX-this.offset.click.left<u[0]&&(s=u[0]+this.offset.click.left),t.pageY-this.offset.click.top<u[1]&&(o=u[1]+this.offset.click.top),t.pageX-this.offset.click.left>u[2]&&(s=u[2]+this.offset.click.left),t.pageY-this.offset.click.top>u[3]&&(o=u[3]+this.offset.click.top)}if(n.grid){var f=n.grid[1]?this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1]:this.originalPageY;o=u?f-this.offset.click.top<u[1]||f-this.offset.click.top>u[3]?f-this.offset.click.top<u[1]?f+n.grid[1]:f-n.grid[1]:f:f;var l=n.grid[0]?this.originalPageX+Math.round((s-this.originalPageX)/n.grid[0])*n.grid[0]:this.originalPageX;s=u?l-this.offset.click.left<u[0]||l-this.offset.click.left>u[2]?l-this.offset.click.left<u[0]?l+n.grid[0]:l-n.grid[0]:l:l}}return{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():i?0:r.scrollTop()),left:s-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():i?0:r.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(t,n,r){return r=r||this._uiHash(),e.ui.plugin.call(this,t,[n,r]),t=="drag"&&(this.positionAbs=this._convertPositionTo("absolute")),e.Widget.prototype._trigger.call(this,t,n,r)},plugins:{},_uiHash:function(e){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),e.ui.plugin.add("draggable","connectToSortable",{start:function(t,n){var r=e(this).data("draggable"),i=r.options,s=e.extend({},n,{item:r.element});r.sortables=[],e(i.connectToSortable).each(function(){var n=e.data(this,"sortable");n&&!n.options.disabled&&(r.sortables.push({instance:n,shouldRevert:n.options.revert}),n.refreshPositions(),n._trigger("activate",t,s))})},stop:function(t,n){var r=e(this).data("draggable"),i=e.extend({},n,{item:r.element});e.each(r.sortables,function(){this.instance.isOver?(this.instance.isOver=0,r.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=!0),this.instance._mouseStop(t),this.instance.options.helper=this.instance.options._helper,r.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",t,i))})},drag:function(t,n){var r=e(this).data("draggable"),i=this,s=function(t){var n=this.offset.click.top,r=this.offset.click.left,i=this.positionAbs.top,s=this.positionAbs.left,o=t.height,u=t.width,a=t.top,f=t.left;return e.ui.isOver(i+n,s+r,a,f,o,u)};e.each(r.sortables,function(s){var o=!1,u=this;this.instance.positionAbs=r.positionAbs,this.instance.helperProportions=r.helperProportions,this.instance.offset.click=r.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(o=!0,e.each(r.sortables,function(){return this.instance.positionAbs=r.positionAbs,this.instance.helperProportions=r.helperProportions,this.instance.offset.click=r.offset.click,this!=u&&this.instance._intersectsWith(this.instance.containerCache)&&e.ui.contains(u.instance.element[0],this.instance.element[0])&&(o=!1),o})),o?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=e(i).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return n.helper[0]},t.target=this.instance.currentItem[0],this.instance._mouseCapture(t,!0),this.instance._mouseStart(t,!0,!0),this.instance.offset.click.top=r.offset.click.top,this.instance.offset.click.left=r.offset.click.left,this.instance.offset.parent.left-=r.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=r.offset.parent.top-this.instance.offset.parent.top,r._trigger("toSortable",t),r.dropped=this.instance.element,r.currentItem=r.element,this.instance.fromOutside=r),this.instance.currentItem&&this.instance._mouseDrag(t)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",t,this.instance._uiHash(this.instance)),this.instance._mouseStop(t,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),r._trigger("fromSortable",t),r.dropped=!1)})}}),e.ui.plugin.add("draggable","cursor",{start:function(t,n){var r=e("body"),i=e(this).data("draggable").options;r.css("cursor")&&(i._cursor=r.css("cursor")),r.css("cursor",i.cursor)},stop:function(t,n){var r=e(this).data("draggable").options;r._cursor&&e("body").css("cursor",r._cursor)}}),e.ui.plugin.add("draggable","opacity",{start:function(t,n){var r=e(n.helper),i=e(this).data("draggable").options;r.css("opacity")&&(i._opacity=r.css("opacity")),r.css("opacity",i.opacity)},stop:function(t,n){var r=e(this).data("draggable").options;r._opacity&&e(n.helper).css("opacity",r._opacity)}}),e.ui.plugin.add("draggable","scroll",{start:function(t,n){var r=e(this).data("draggable");r.scrollParent[0]!=document&&r.scrollParent[0].tagName!="HTML"&&(r.overflowOffset=r.scrollParent.offset())},drag:function(t,n){var r=e(this).data("draggable"),i=r.options,s=!1;if(r.scrollParent[0]!=document&&r.scrollParent[0].tagName!="HTML"){if(!i.axis||i.axis!="x")r.overflowOffset.top+r.scrollParent[0].offsetHeight-t.pageY<i.scrollSensitivity?r.scrollParent[0].scrollTop=s=r.scrollParent[0].scrollTop+i.scrollSpeed:t.pageY-r.overflowOffset.top<i.scrollSensitivity&&(r.scrollParent[0].scrollTop=s=r.scrollParent[0].scrollTop-i.scrollSpeed);if(!i.axis||i.axis!="y")r.overflowOffset.left+r.scrollParent[0].offsetWidth-t.pageX<i.scrollSensitivity?r.scrollParent[0].scrollLeft=s=r.scrollParent[0].scrollLeft+i.scrollSpeed:t.pageX-r.overflowOffset.left<i.scrollSensitivity&&(r.scrollParent[0].scrollLeft=s=r.scrollParent[0].scrollLeft-i.scrollSpeed)}else{if(!i.axis||i.axis!="x")t.pageY-e(document).scrollTop()<i.scrollSensitivity?s=e(document).scrollTop(e(document).scrollTop()-i.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<i.scrollSensitivity&&(s=e(document).scrollTop(e(document).scrollTop()+i.scrollSpeed));if(!i.axis||i.axis!="y")t.pageX-e(document).scrollLeft()<i.scrollSensitivity?s=e(document).scrollLeft(e(document).scrollLeft()-i.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<i.scrollSensitivity&&(s=e(document).scrollLeft(e(document).scrollLeft()+i.scrollSpeed))}s!==!1&&e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(r,t)}}),e.ui.plugin.add("draggable","snap",{start:function(t,n){var r=e(this).data("draggable"),i=r.options;r.snapElements=[],e(i.snap.constructor!=String?i.snap.items||":data(draggable)":i.snap).each(function(){var t=e(this),n=t.offset();this!=r.element[0]&&r.snapElements.push({item:this,width:t.outerWidth(),height:t.outerHeight(),top:n.top,left:n.left})})},drag:function(t,n){var r=e(this).data("draggable"),i=r.options,s=i.snapTolerance,o=n.offset.left,u=o+r.helperProportions.width,a=n.offset.top,f=a+r.helperProportions.height;for(var l=r.snapElements.length-1;l>=0;l--){var c=r.snapElements[l].left,h=c+r.snapElements[l].width,p=r.snapElements[l].top,d=p+r.snapElements[l].height;if(!(c-s<o&&o<h+s&&p-s<a&&a<d+s||c-s<o&&o<h+s&&p-s<f&&f<d+s||c-s<u&&u<h+s&&p-s<a&&a<d+s||c-s<u&&u<h+s&&p-s<f&&f<d+s)){r.snapElements[l].snapping&&r.options.snap.release&&r.options.snap.release.call(r.element,t,e.extend(r._uiHash(),{snapItem:r.snapElements[l].item})),r.snapElements[l].snapping=!1;continue}if(i.snapMode!="inner"){var v=Math.abs(p-f)<=s,m=Math.abs(d-a)<=s,g=Math.abs(c-u)<=s,y=Math.abs(h-o)<=s;v&&(n.position.top=r._convertPositionTo("relative",{top:p-r.helperProportions.height,left:0}).top-r.margins.top),m&&(n.position.top=r._convertPositionTo("relative",{top:d,left:0}).top-r.margins.top),g&&(n.position.left=r._convertPositionTo("relative",{top:0,left:c-r.helperProportions.width}).left-r.margins.left),y&&(n.position.left=r._convertPositionTo("relative",{top:0,left:h}).left-r.margins.left)}var b=v||m||g||y;if(i.snapMode!="outer"){var v=Math.abs(p-a)<=s,m=Math.abs(d-f)<=s,g=Math.abs(c-o)<=s,y=Math.abs(h-u)<=s;v&&(n.position.top=r._convertPositionTo("relative",{top:p,left:0}).top-r.margins.top),m&&(n.position.top=r._convertPositionTo("relative",{top:d-r.helperProportions.height,left:0}).top-r.margins.top),g&&(n.position.left=r._convertPositionTo("relative",{top:0,left:c}).left-r.margins.left),y&&(n.position.left=r._convertPositionTo("relative",{top:0,left:h-r.helperProportions.width}).left-r.margins.left)}!r.snapElements[l].snapping&&(v||m||g||y||b)&&r.options.snap.snap&&r.options.snap.snap.call(r.element,t,e.extend(r._uiHash(),{snapItem:r.snapElements[l].item})),r.snapElements[l].snapping=v||m||g||y||b}}}),e.ui.plugin.add("draggable","stack",{start:function(t,n){var r=e(this).data("draggable").options,i=e.makeArray(e(r.stack)).sort(function(t,n){return(parseInt(e(t).css("zIndex"),10)||0)-(parseInt(e(n).css("zIndex"),10)||0)});if(!i.length)return;var s=parseInt(i[0].style.zIndex)||0;e(i).each(function(e){this.style.zIndex=s+e}),this[0].style.zIndex=s+i.length}}),e.ui.plugin.add("draggable","zIndex",{start:function(t,n){var r=e(n.helper),i=e(this).data("draggable").options;r.css("zIndex")&&(i._zIndex=r.css("zIndex")),r.css("zIndex",i.zIndex)},stop:function(t,n){var r=e(this).data("draggable").options;r._zIndex&&e(n.helper).css("zIndex",r._zIndex)}})})(jQuery);(function(e,t){e.widget("ui.droppable",{version:"1.9.2",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect"},_create:function(){var t=this.options,n=t.accept;this.isover=0,this.isout=1,this.accept=e.isFunction(n)?n:function(e){return e.is(n)},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},e.ui.ddmanager.droppables[t.scope]=e.ui.ddmanager.droppables[t.scope]||[],e.ui.ddmanager.droppables[t.scope].push(this),t.addClasses&&this.element.addClass("ui-droppable")},_destroy:function(){var t=e.ui.ddmanager.droppables[this.options.scope];for(var n=0;n<t.length;n++)t[n]==this&&t.splice(n,1);this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(t,n){t=="accept"&&(this.accept=e.isFunction(n)?n:function(e){return e.is(n)}),e.Widget.prototype._setOption.apply(this,arguments)},_activate:function(t){var n=e.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),n&&this._trigger("activate",t,this.ui(n))},_deactivate:function(t){var n=e.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),n&&this._trigger("deactivate",t,this.ui(n))},_over:function(t){var n=e.ui.ddmanager.current;if(!n||(n.currentItem||n.element)[0]==this.element[0])return;this.accept.call(this.element[0],n.currentItem||n.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",t,this.ui(n)))},_out:function(t){var n=e.ui.ddmanager.current;if(!n||(n.currentItem||n.element)[0]==this.element[0])return;this.accept.call(this.element[0],n.currentItem||n.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",t,this.ui(n)))},_drop:function(t,n){var r=n||e.ui.ddmanager.current;if(!r||(r.currentItem||r.element)[0]==this.element[0])return!1;var i=!1;return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var t=e.data(this,"droppable");if(t.options.greedy&&!t.options.disabled&&t.options.scope==r.options.scope&&t.accept.call(t.element[0],r.currentItem||r.element)&&e.ui.intersect(r,e.extend(t,{offset:t.element.offset()}),t.options.tolerance))return i=!0,!1}),i?!1:this.accept.call(this.element[0],r.currentItem||r.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",t,this.ui(r)),this.element):!1},ui:function(e){return{draggable:e.currentItem||e.element,helper:e.helper,position:e.position,offset:e.positionAbs}}}),e.ui.intersect=function(t,n,r){if(!n.offset)return!1;var i=(t.positionAbs||t.position.absolute).left,s=i+t.helperProportions.width,o=(t.positionAbs||t.position.absolute).top,u=o+t.helperProportions.height,a=n.offset.left,f=a+n.proportions.width,l=n.offset.top,c=l+n.proportions.height;switch(r){case"fit":return a<=i&&s<=f&&l<=o&&u<=c;case"intersect":return a<i+t.helperProportions.width/2&&s-t.helperProportions.width/2<f&&l<o+t.helperProportions.height/2&&u-t.helperProportions.height/2<c;case"pointer":var h=(t.positionAbs||t.position.absolute).left+(t.clickOffset||t.offset.click).left,p=(t.positionAbs||t.position.absolute).top+(t.clickOffset||t.offset.click).top,d=e.ui.isOver(p,h,l,a,n.proportions.height,n.proportions.width);return d;case"touch":return(o>=l&&o<=c||u>=l&&u<=c||o<l&&u>c)&&(i>=a&&i<=f||s>=a&&s<=f||i<a&&s>f);default:return!1}},e.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(t,n){var r=e.ui.ddmanager.droppables[t.options.scope]||[],i=n?n.type:null,s=(t.currentItem||t.element).find(":data(droppable)").andSelf();e:for(var o=0;o<r.length;o++){if(r[o].options.disabled||t&&!r[o].accept.call(r[o].element[0],t.currentItem||t.element))continue;for(var u=0;u<s.length;u++)if(s[u]==r[o].element[0]){r[o].proportions.height=0;continue e}r[o].visible=r[o].element.css("display")!="none";if(!r[o].visible)continue;i=="mousedown"&&r[o]._activate.call(r[o],n),r[o].offset=r[o].element.offset(),r[o].proportions={width:r[o].element[0].offsetWidth,height:r[o].element[0].offsetHeight}}},drop:function(t,n){var r=!1;return e.each(e.ui.ddmanager.droppables[t.options.scope]||[],function(){if(!this.options)return;!this.options.disabled&&this.visible&&e.ui.intersect(t,this,this.options.tolerance)&&(r=this._drop.call(this,n)||r),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this.isout=1,this.isover=0,this._deactivate.call(this,n))}),r},dragStart:function(t,n){t.element.parentsUntil("body").bind("scroll.droppable",function(){t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,n)})},drag:function(t,n){t.options.refreshPositions&&e.ui.ddmanager.prepareOffsets(t,n),e.each(e.ui.ddmanager.droppables[t.options.scope]||[],function(){if(this.options.disabled||this.greedyChild||!this.visible)return;var r=e.ui.intersect(t,this,this.options.tolerance),i=!r&&this.isover==1?"isout":r&&this.isover==0?"isover":null;if(!i)return;var s;if(this.options.greedy){var o=this.options.scope,u=this.element.parents(":data(droppable)").filter(function(){return e.data(this,"droppable").options.scope===o});u.length&&(s=e.data(u[0],"droppable"),s.greedyChild=i=="isover"?1:0)}s&&i=="isover"&&(s.isover=0,s.isout=1,s._out.call(s,n)),this[i]=1,this[i=="isout"?"isover":"isout"]=0,this[i=="isover"?"_over":"_out"].call(this,n),s&&i=="isout"&&(s.isout=0,s.isover=1,s._over.call(s,n))})},dragStop:function(t,n){t.element.parentsUntil("body").unbind("scroll.droppable"),t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,n)}}})(jQuery);jQuery.effects||function(e,t){var n=e.uiBackCompat!==!1,r="ui-effects-";e.effects={effect:{}},function(t,n){function p(e,t,n){var r=a[t.type]||{};return e==null?n||!t.def?null:t.def:(e=r.floor?~~e:parseFloat(e),isNaN(e)?t.def:r.mod?(e+r.mod)%r.mod:0>e?0:r.max<e?r.max:e)}function d(e){var n=o(),r=n._rgba=[];return e=e.toLowerCase(),h(s,function(t,i){var s,o=i.re.exec(e),a=o&&i.parse(o),f=i.space||"rgba";if(a)return s=n[f](a),n[u[f].cache]=s[u[f].cache],r=n._rgba=s._rgba,!1}),r.length?(r.join()==="0,0,0,0"&&t.extend(r,c.transparent),n):c[e]}function v(e,t,n){return n=(n+1)%1,n*6<1?e+(t-e)*n*6:n*2<1?t:n*3<2?e+(t-e)*(2/3-n)*6:e}var r="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "),i=/^([\-+])=\s*(\d+\.?\d*)/,s=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(e){return[e[1],e[2],e[3],e[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(e){return[e[1]*2.55,e[2]*2.55,e[3]*2.55,e[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(e){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(e){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(e){return[e[1],e[2]/100,e[3]/100,e[4]]}}],o=t.Color=function(e,n,r,i){return new t.Color.fn.parse(e,n,r,i)},u={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},a={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},f=o.support={},l=t("<p>")[0],c,h=t.each;l.style.cssText="background-color:rgba(1,1,1,.5)",f.rgba=l.style.backgroundColor.indexOf("rgba")>-1,h(u,function(e,t){t.cache="_"+e,t.props.alpha={idx:3,type:"percent",def:1}}),o.fn=t.extend(o.prototype,{parse:function(r,i,s,a){if(r===n)return this._rgba=[null,null,null,null],this;if(r.jquery||r.nodeType)r=t(r).css(i),i=n;var f=this,l=t.type(r),v=this._rgba=[];i!==n&&(r=[r,i,s,a],l="array");if(l==="string")return this.parse(d(r)||c._default);if(l==="array")return h(u.rgba.props,function(e,t){v[t.idx]=p(r[t.idx],t)}),this;if(l==="object")return r instanceof o?h(u,function(e,t){r[t.cache]&&(f[t.cache]=r[t.cache].slice())}):h(u,function(t,n){var i=n.cache;h(n.props,function(e,t){if(!f[i]&&n.to){if(e==="alpha"||r[e]==null)return;f[i]=n.to(f._rgba)}f[i][t.idx]=p(r[e],t,!0)}),f[i]&&e.inArray(null,f[i].slice(0,3))<0&&(f[i][3]=1,n.from&&(f._rgba=n.from(f[i])))}),this},is:function(e){var t=o(e),n=!0,r=this;return h(u,function(e,i){var s,o=t[i.cache];return o&&(s=r[i.cache]||i.to&&i.to(r._rgba)||[],h(i.props,function(e,t){if(o[t.idx]!=null)return n=o[t.idx]===s[t.idx],n})),n}),n},_space:function(){var e=[],t=this;return h(u,function(n,r){t[r.cache]&&e.push(n)}),e.pop()},transition:function(e,t){var n=o(e),r=n._space(),i=u[r],s=this.alpha()===0?o("transparent"):this,f=s[i.cache]||i.to(s._rgba),l=f.slice();return n=n[i.cache],h(i.props,function(e,r){var i=r.idx,s=f[i],o=n[i],u=a[r.type]||{};if(o===null)return;s===null?l[i]=o:(u.mod&&(o-s>u.mod/2?s+=u.mod:s-o>u.mod/2&&(s-=u.mod)),l[i]=p((o-s)*t+s,r))}),this[r](l)},blend:function(e){if(this._rgba[3]===1)return this;var n=this._rgba.slice(),r=n.pop(),i=o(e)._rgba;return o(t.map(n,function(e,t){return(1-r)*i[t]+r*e}))},toRgbaString:function(){var e="rgba(",n=t.map(this._rgba,function(e,t){return e==null?t>2?1:0:e});return n[3]===1&&(n.pop(),e="rgb("),e+n.join()+")"},toHslaString:function(){var e="hsla(",n=t.map(this.hsla(),function(e,t){return e==null&&(e=t>2?1:0),t&&t<3&&(e=Math.round(e*100)+"%"),e});return n[3]===1&&(n.pop(),e="hsl("),e+n.join()+")"},toHexString:function(e){var n=this._rgba.slice(),r=n.pop();return e&&n.push(~~(r*255)),"#"+t.map(n,function(e){return e=(e||0).toString(16),e.length===1?"0"+e:e}).join("")},toString:function(){return this._rgba[3]===0?"transparent":this.toRgbaString()}}),o.fn.parse.prototype=o.fn,u.hsla.to=function(e){if(e[0]==null||e[1]==null||e[2]==null)return[null,null,null,e[3]];var t=e[0]/255,n=e[1]/255,r=e[2]/255,i=e[3],s=Math.max(t,n,r),o=Math.min(t,n,r),u=s-o,a=s+o,f=a*.5,l,c;return o===s?l=0:t===s?l=60*(n-r)/u+360:n===s?l=60*(r-t)/u+120:l=60*(t-n)/u+240,f===0||f===1?c=f:f<=.5?c=u/a:c=u/(2-a),[Math.round(l)%360,c,f,i==null?1:i]},u.hsla.from=function(e){if(e[0]==null||e[1]==null||e[2]==null)return[null,null,null,e[3]];var t=e[0]/360,n=e[1],r=e[2],i=e[3],s=r<=.5?r*(1+n):r+n-r*n,o=2*r-s;return[Math.round(v(o,s,t+1/3)*255),Math.round(v(o,s,t)*255),Math.round(v(o,s,t-1/3)*255),i]},h(u,function(e,r){var s=r.props,u=r.cache,a=r.to,f=r.from;o.fn[e]=function(e){a&&!this[u]&&(this[u]=a(this._rgba));if(e===n)return this[u].slice();var r,i=t.type(e),l=i==="array"||i==="object"?e:arguments,c=this[u].slice();return h(s,function(e,t){var n=l[i==="object"?e:t.idx];n==null&&(n=c[t.idx]),c[t.idx]=p(n,t)}),f?(r=o(f(c)),r[u]=c,r):o(c)},h(s,function(n,r){if(o.fn[n])return;o.fn[n]=function(s){var o=t.type(s),u=n==="alpha"?this._hsla?"hsla":"rgba":e,a=this[u](),f=a[r.idx],l;return o==="undefined"?f:(o==="function"&&(s=s.call(this,f),o=t.type(s)),s==null&&r.empty?this:(o==="string"&&(l=i.exec(s),l&&(s=f+parseFloat(l[2])*(l[1]==="+"?1:-1))),a[r.idx]=s,this[u](a)))}})}),h(r,function(e,n){t.cssHooks[n]={set:function(e,r){var i,s,u="";if(t.type(r)!=="string"||(i=d(r))){r=o(i||r);if(!f.rgba&&r._rgba[3]!==1){s=n==="backgroundColor"?e.parentNode:e;while((u===""||u==="transparent")&&s&&s.style)try{u=t.css(s,"backgroundColor"),s=s.parentNode}catch(a){}r=r.blend(u&&u!=="transparent"?u:"_default")}r=r.toRgbaString()}try{e.style[n]=r}catch(l){}}},t.fx.step[n]=function(e){e.colorInit||(e.start=o(e.elem,n),e.end=o(e.end),e.colorInit=!0),t.cssHooks[n].set(e.elem,e.start.transition(e.end,e.pos))}}),t.cssHooks.borderColor={expand:function(e){var t={};return h(["Top","Right","Bottom","Left"],function(n,r){t["border"+r+"Color"]=e}),t}},c=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(){var t=this.ownerDocument.defaultView?this.ownerDocument.defaultView.getComputedStyle(this,null):this.currentStyle,n={},r,i;if(t&&t.length&&t[0]&&t[t[0]]){i=t.length;while(i--)r=t[i],typeof t[r]=="string"&&(n[e.camelCase(r)]=t[r])}else for(r in t)typeof t[r]=="string"&&(n[r]=t[r]);return n}function s(t,n){var i={},s,o;for(s in n)o=n[s],t[s]!==o&&!r[s]&&(e.fx.step[s]||!isNaN(parseFloat(o)))&&(i[s]=o);return i}var n=["add","remove","toggle"],r={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};e.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(t,n){e.fx.step[n]=function(e){if(e.end!=="none"&&!e.setAttr||e.pos===1&&!e.setAttr)jQuery.style(e.elem,n,e.end),e.setAttr=!0}}),e.effects.animateClass=function(t,r,o,u){var a=e.speed(r,o,u);return this.queue(function(){var r=e(this),o=r.attr("class")||"",u,f=a.children?r.find("*").andSelf():r;f=f.map(function(){var t=e(this);return{el:t,start:i.call(this)}}),u=function(){e.each(n,function(e,n){t[n]&&r[n+"Class"](t[n])})},u(),f=f.map(function(){return this.end=i.call(this.el[0]),this.diff=s(this.start,this.end),this}),r.attr("class",o),f=f.map(function(){var t=this,n=e.Deferred(),r=jQuery.extend({},a,{queue:!1,complete:function(){n.resolve(t)}});return this.el.animate(this.diff,r),n.promise()}),e.when.apply(e,f.get()).done(function(){u(),e.each(arguments,function(){var t=this.el;e.each(this.diff,function(e){t.css(e,"")})}),a.complete.call(r[0])})})},e.fn.extend({_addClass:e.fn.addClass,addClass:function(t,n,r,i){return n?e.effects.animateClass.call(this,{add:t},n,r,i):this._addClass(t)},_removeClass:e.fn.removeClass,removeClass:function(t,n,r,i){return n?e.effects.animateClass.call(this,{remove:t},n,r,i):this._removeClass(t)},_toggleClass:e.fn.toggleClass,toggleClass:function(n,r,i,s,o){return typeof r=="boolean"||r===t?i?e.effects.animateClass.call(this,r?{add:n}:{remove:n},i,s,o):this._toggleClass(n,r):e.effects.animateClass.call(this,{toggle:n},r,i,s)},switchClass:function(t,n,r,i,s){return e.effects.animateClass.call(this,{add:n,remove:t},r,i,s)}})}(),function(){function i(t,n,r,i){e.isPlainObject(t)&&(n=t,t=t.effect),t={effect:t},n==null&&(n={}),e.isFunction(n)&&(i=n,r=null,n={});if(typeof n=="number"||e.fx.speeds[n])i=r,r=n,n={};return e.isFunction(r)&&(i=r,r=null),n&&e.extend(t,n),r=r||n.duration,t.duration=e.fx.off?0:typeof r=="number"?r:r in e.fx.speeds?e.fx.speeds[r]:e.fx.speeds._default,t.complete=i||n.complete,t}function s(t){return!t||typeof t=="number"||e.fx.speeds[t]?!0:typeof t=="string"&&!e.effects.effect[t]?n&&e.effects[t]?!1:!0:!1}e.extend(e.effects,{version:"1.9.2",save:function(e,t){for(var n=0;n<t.length;n++)t[n]!==null&&e.data(r+t[n],e[0].style[t[n]])},restore:function(e,n){var i,s;for(s=0;s<n.length;s++)n[s]!==null&&(i=e.data(r+n[s]),i===t&&(i=""),e.css(n[s],i))},setMode:function(e,t){return t==="toggle"&&(t=e.is(":hidden")?"show":"hide"),t},getBaseline:function(e,t){var n,r;switch(e[0]){case"top":n=0;break;case"middle":n=.5;break;case"bottom":n=1;break;default:n=e[0]/t.height}switch(e[1]){case"left":r=0;break;case"center":r=.5;break;case"right":r=1;break;default:r=e[1]/t.width}return{x:r,y:n}},createWrapper:function(t){if(t.parent().is(".ui-effects-wrapper"))return t.parent();var n={width:t.outerWidth(!0),height:t.outerHeight(!0),"float":t.css("float")},r=e("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),i={width:t.width(),height:t.height()},s=document.activeElement;try{s.id}catch(o){s=document.body}return t.wrap(r),(t[0]===s||e.contains(t[0],s))&&e(s).focus(),r=t.parent(),t.css("position")==="static"?(r.css({position:"relative"}),t.css({position:"relative"})):(e.extend(n,{position:t.css("position"),zIndex:t.css("z-index")}),e.each(["top","left","bottom","right"],function(e,r){n[r]=t.css(r),isNaN(parseInt(n[r],10))&&(n[r]="auto")}),t.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),t.css(i),r.css(n).show()},removeWrapper:function(t){var n=document.activeElement;return t.parent().is(".ui-effects-wrapper")&&(t.parent().replaceWith(t),(t[0]===n||e.contains(t[0],n))&&e(n).focus()),t},setTransition:function(t,n,r,i){return i=i||{},e.each(n,function(e,n){var s=t.cssUnit(n);s[0]>0&&(i[n]=s[0]*r+s[1])}),i}}),e.fn.extend({effect:function(){function a(n){function u(){e.isFunction(i)&&i.call(r[0]),e.isFunction(n)&&n()}var r=e(this),i=t.complete,s=t.mode;(r.is(":hidden")?s==="hide":s==="show")?u():o.call(r[0],t,u)}var t=i.apply(this,arguments),r=t.mode,s=t.queue,o=e.effects.effect[t.effect],u=!o&&n&&e.effects[t.effect];return e.fx.off||!o&&!u?r?this[r](t.duration,t.complete):this.each(function(){t.complete&&t.complete.call(this)}):o?s===!1?this.each(a):this.queue(s||"fx",a):u.call(this,{options:t,duration:t.duration,callback:t.complete,mode:t.mode})},_show:e.fn.show,show:function(e){if(s(e))return this._show.apply(this,arguments);var t=i.apply(this,arguments);return t.mode="show",this.effect.call(this,t)},_hide:e.fn.hide,hide:function(e){if(s(e))return this._hide.apply(this,arguments);var t=i.apply(this,arguments);return t.mode="hide",this.effect.call(this,t)},__toggle:e.fn.toggle,toggle:function(t){if(s(t)||typeof t=="boolean"||e.isFunction(t))return this.__toggle.apply(this,arguments);var n=i.apply(this,arguments);return n.mode="toggle",this.effect.call(this,n)},cssUnit:function(t){var n=this.css(t),r=[];return e.each(["em","px","%","pt"],function(e,t){n.indexOf(t)>0&&(r=[parseFloat(n),t])}),r}})}(),function(){var t={};e.each(["Quad","Cubic","Quart","Quint","Expo"],function(e,n){t[n]=function(t){return Math.pow(t,e+2)}}),e.extend(t,{Sine:function(e){return 1-Math.cos(e*Math.PI/2)},Circ:function(e){return 1-Math.sqrt(1-e*e)},Elastic:function(e){return e===0||e===1?e:-Math.pow(2,8*(e-1))*Math.sin(((e-1)*80-7.5)*Math.PI/15)},Back:function(e){return e*e*(3*e-2)},Bounce:function(e){var t,n=4;while(e<((t=Math.pow(2,--n))-1)/11);return 1/Math.pow(4,3-n)-7.5625*Math.pow((t*3-2)/22-e,2)}}),e.each(t,function(t,n){e.easing["easeIn"+t]=n,e.easing["easeOut"+t]=function(e){return 1-n(1-e)},e.easing["easeInOut"+t]=function(e){return e<.5?n(e*2)/2:1-n(e*-2+2)/2}})}()}(jQuery);(function(e,t){var n=/up|down|vertical/,r=/up|left|vertical|horizontal/;e.effects.effect.blind=function(t,i){var s=e(this),o=["position","top","bottom","left","right","height","width"],u=e.effects.setMode(s,t.mode||"hide"),a=t.direction||"up",f=n.test(a),l=f?"height":"width",c=f?"top":"left",h=r.test(a),p={},d=u==="show",v,m,g;s.parent().is(".ui-effects-wrapper")?e.effects.save(s.parent(),o):e.effects.save(s,o),s.show(),v=e.effects.createWrapper(s).css({overflow:"hidden"}),m=v[l](),g=parseFloat(v.css(c))||0,p[l]=d?m:0,h||(s.css(f?"bottom":"right",0).css(f?"top":"left","auto").css({position:"absolute"}),p[c]=d?g:m+g),d&&(v.css(l,0),h||v.css(c,g+m)),v.animate(p,{duration:t.duration,easing:t.easing,queue:!1,complete:function(){u==="hide"&&s.hide(),e.effects.restore(s,o),e.effects.removeWrapper(s),i()}})}})(jQuery);(function(e,t){e.effects.effect.bounce=function(t,n){var r=e(this),i=["position","top","bottom","left","right","height","width"],s=e.effects.setMode(r,t.mode||"effect"),o=s==="hide",u=s==="show",a=t.direction||"up",f=t.distance,l=t.times||5,c=l*2+(u||o?1:0),h=t.duration/c,p=t.easing,d=a==="up"||a==="down"?"top":"left",v=a==="up"||a==="left",m,g,y,b=r.queue(),w=b.length;(u||o)&&i.push("opacity"),e.effects.save(r,i),r.show(),e.effects.createWrapper(r),f||(f=r[d==="top"?"outerHeight":"outerWidth"]()/3),u&&(y={opacity:1},y[d]=0,r.css("opacity",0).css(d,v?-f*2:f*2).animate(y,h,p)),o&&(f/=Math.pow(2,l-1)),y={},y[d]=0;for(m=0;m<l;m++)g={},g[d]=(v?"-=":"+=")+f,r.animate(g,h,p).animate(y,h,p),f=o?f*2:f/2;o&&(g={opacity:0},g[d]=(v?"-=":"+=")+f,r.animate(g,h,p)),r.queue(function(){o&&r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n()}),w>1&&b.splice.apply(b,[1,0].concat(b.splice(w,c+1))),r.dequeue()}})(jQuery);(function(e,t){e.effects.effect.clip=function(t,n){var r=e(this),i=["position","top","bottom","left","right","height","width"],s=e.effects.setMode(r,t.mode||"hide"),o=s==="show",u=t.direction||"vertical",a=u==="vertical",f=a?"height":"width",l=a?"top":"left",c={},h,p,d;e.effects.save(r,i),r.show(),h=e.effects.createWrapper(r).css({overflow:"hidden"}),p=r[0].tagName==="IMG"?h:r,d=p[f](),o&&(p.css(f,0),p.css(l,d/2)),c[f]=o?d:0,c[l]=o?0:d/2,p.animate(c,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){o||r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n()}})}})(jQuery);(function(e,t){e.effects.effect.drop=function(t,n){var r=e(this),i=["position","top","bottom","left","right","opacity","height","width"],s=e.effects.setMode(r,t.mode||"hide"),o=s==="show",u=t.direction||"left",a=u==="up"||u==="down"?"top":"left",f=u==="up"||u==="left"?"pos":"neg",l={opacity:o?1:0},c;e.effects.save(r,i),r.show(),e.effects.createWrapper(r),c=t.distance||r[a==="top"?"outerHeight":"outerWidth"](!0)/2,o&&r.css("opacity",0).css(a,f==="pos"?-c:c),l[a]=(o?f==="pos"?"+=":"-=":f==="pos"?"-=":"+=")+c,r.animate(l,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){s==="hide"&&r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n()}})}})(jQuery);(function(e,t){e.effects.effect.explode=function(t,n){function y(){c.push(this),c.length===r*i&&b()}function b(){s.css({visibility:"visible"}),e(c).remove(),u||s.hide(),n()}var r=t.pieces?Math.round(Math.sqrt(t.pieces)):3,i=r,s=e(this),o=e.effects.setMode(s,t.mode||"hide"),u=o==="show",a=s.show().css("visibility","hidden").offset(),f=Math.ceil(s.outerWidth()/i),l=Math.ceil(s.outerHeight()/r),c=[],h,p,d,v,m,g;for(h=0;h<r;h++){v=a.top+h*l,g=h-(r-1)/2;for(p=0;p<i;p++)d=a.left+p*f,m=p-(i-1)/2,s.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-p*f,top:-h*l}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:f,height:l,left:d+(u?m*f:0),top:v+(u?g*l:0),opacity:u?0:1}).animate({left:d+(u?0:m*f),top:v+(u?0:g*l),opacity:u?1:0},t.duration||500,t.easing,y)}}})(jQuery);(function(e,t){e.effects.effect.fade=function(t,n){var r=e(this),i=e.effects.setMode(r,t.mode||"toggle");r.animate({opacity:i},{queue:!1,duration:t.duration,easing:t.easing,complete:n})}})(jQuery);(function(e,t){e.effects.effect.fold=function(t,n){var r=e(this),i=["position","top","bottom","left","right","height","width"],s=e.effects.setMode(r,t.mode||"hide"),o=s==="show",u=s==="hide",a=t.size||15,f=/([0-9]+)%/.exec(a),l=!!t.horizFirst,c=o!==l,h=c?["width","height"]:["height","width"],p=t.duration/2,d,v,m={},g={};e.effects.save(r,i),r.show(),d=e.effects.createWrapper(r).css({overflow:"hidden"}),v=c?[d.width(),d.height()]:[d.height(),d.width()],f&&(a=parseInt(f[1],10)/100*v[u?0:1]),o&&d.css(l?{height:0,width:a}:{height:a,width:0}),m[h[0]]=o?v[0]:a,g[h[1]]=o?v[1]:0,d.animate(m,p,t.easing).animate(g,p,t.easing,function(){u&&r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n()})}})(jQuery);(function(e,t){e.effects.effect.highlight=function(t,n){var r=e(this),i=["backgroundImage","backgroundColor","opacity"],s=e.effects.setMode(r,t.mode||"show"),o={backgroundColor:r.css("backgroundColor")};s==="hide"&&(o.opacity=0),e.effects.save(r,i),r.show().css({backgroundImage:"none",backgroundColor:t.color||"#ffff99"}).animate(o,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){s==="hide"&&r.hide(),e.effects.restore(r,i),n()}})}})(jQuery);(function(e,t){e.effects.effect.pulsate=function(t,n){var r=e(this),i=e.effects.setMode(r,t.mode||"show"),s=i==="show",o=i==="hide",u=s||i==="hide",a=(t.times||5)*2+(u?1:0),f=t.duration/a,l=0,c=r.queue(),h=c.length,p;if(s||!r.is(":visible"))r.css("opacity",0).show(),l=1;for(p=1;p<a;p++)r.animate({opacity:l},f,t.easing),l=1-l;r.animate({opacity:l},f,t.easing),r.queue(function(){o&&r.hide(),n()}),h>1&&c.splice.apply(c,[1,0].concat(c.splice(h,a+1))),r.dequeue()}})(jQuery);(function(e,t){e.effects.effect.puff=function(t,n){var r=e(this),i=e.effects.setMode(r,t.mode||"hide"),s=i==="hide",o=parseInt(t.percent,10)||150,u=o/100,a={height:r.height(),width:r.width(),outerHeight:r.outerHeight(),outerWidth:r.outerWidth()};e.extend(t,{effect:"scale",queue:!1,fade:!0,mode:i,complete:n,percent:s?o:100,from:s?a:{height:a.height*u,width:a.width*u,outerHeight:a.outerHeight*u,outerWidth:a.outerWidth*u}}),r.effect(t)},e.effects.effect.scale=function(t,n){var r=e(this),i=e.extend(!0,{},t),s=e.effects.setMode(r,t.mode||"effect"),o=parseInt(t.percent,10)||(parseInt(t.percent,10)===0?0:s==="hide"?0:100),u=t.direction||"both",a=t.origin,f={height:r.height(),width:r.width(),outerHeight:r.outerHeight(),outerWidth:r.outerWidth()},l={y:u!=="horizontal"?o/100:1,x:u!=="vertical"?o/100:1};i.effect="size",i.queue=!1,i.complete=n,s!=="effect"&&(i.origin=a||["middle","center"],i.restore=!0),i.from=t.from||(s==="show"?{height:0,width:0,outerHeight:0,outerWidth:0}:f),i.to={height:f.height*l.y,width:f.width*l.x,outerHeight:f.outerHeight*l.y,outerWidth:f.outerWidth*l.x},i.fade&&(s==="show"&&(i.from.opacity=0,i.to.opacity=1),s==="hide"&&(i.from.opacity=1,i.to.opacity=0)),r.effect(i)},e.effects.effect.size=function(t,n){var r,i,s,o=e(this),u=["position","top","bottom","left","right","width","height","overflow","opacity"],a=["position","top","bottom","left","right","overflow","opacity"],f=["width","height","overflow"],l=["fontSize"],c=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],h=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=e.effects.setMode(o,t.mode||"effect"),d=t.restore||p!=="effect",v=t.scale||"both",m=t.origin||["middle","center"],g=o.css("position"),y=d?u:a,b={height:0,width:0,outerHeight:0,outerWidth:0};p==="show"&&o.show(),r={height:o.height(),width:o.width(),outerHeight:o.outerHeight(),outerWidth:o.outerWidth()},t.mode==="toggle"&&p==="show"?(o.from=t.to||b,o.to=t.from||r):(o.from=t.from||(p==="show"?b:r),o.to=t.to||(p==="hide"?b:r)),s={from:{y:o.from.height/r.height,x:o.from.width/r.width},to:{y:o.to.height/r.height,x:o.to.width/r.width}};if(v==="box"||v==="both")s.from.y!==s.to.y&&(y=y.concat(c),o.from=e.effects.setTransition(o,c,s.from.y,o.from),o.to=e.effects.setTransition(o,c,s.to.y,o.to)),s.from.x!==s.to.x&&(y=y.concat(h),o.from=e.effects.setTransition(o,h,s.from.x,o.from),o.to=e.effects.setTransition(o,h,s.to.x,o.to));(v==="content"||v==="both")&&s.from.y!==s.to.y&&(y=y.concat(l).concat(f),o.from=e.effects.setTransition(o,l,s.from.y,o.from),o.to=e.effects.setTransition(o,l,s.to.y,o.to)),e.effects.save(o,y),o.show(),e.effects.createWrapper(o),o.css("overflow","hidden").css(o.from),m&&(i=e.effects.getBaseline(m,r),o.from.top=(r.outerHeight-o.outerHeight())*i.y,o.from.left=(r.outerWidth-o.outerWidth())*i.x,o.to.top=(r.outerHeight-o.to.outerHeight)*i.y,o.to.left=(r.outerWidth-o.to.outerWidth)*i.x),o.css(o.from);if(v==="content"||v==="both")c=c.concat(["marginTop","marginBottom"]).concat(l),h=h.concat(["marginLeft","marginRight"]),f=u.concat(c).concat(h),o.find("*[width]").each(function(){var n=e(this),r={height:n.height(),width:n.width(),outerHeight:n.outerHeight(),outerWidth:n.outerWidth()};d&&e.effects.save(n,f),n.from={height:r.height*s.from.y,width:r.width*s.from.x,outerHeight:r.outerHeight*s.from.y,outerWidth:r.outerWidth*s.from.x},n.to={height:r.height*s.to.y,width:r.width*s.to.x,outerHeight:r.height*s.to.y,outerWidth:r.width*s.to.x},s.from.y!==s.to.y&&(n.from=e.effects.setTransition(n,c,s.from.y,n.from),n.to=e.effects.setTransition(n,c,s.to.y,n.to)),s.from.x!==s.to.x&&(n.from=e.effects.setTransition(n,h,s.from.x,n.from),n.to=e.effects.setTransition(n,h,s.to.x,n.to)),n.css(n.from),n.animate(n.to,t.duration,t.easing,function(){d&&e.effects.restore(n,f)})});o.animate(o.to,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){o.to.opacity===0&&o.css("opacity",o.from.opacity),p==="hide"&&o.hide(),e.effects.restore(o,y),d||(g==="static"?o.css({position:"relative",top:o.to.top,left:o.to.left}):e.each(["top","left"],function(e,t){o.css(t,function(t,n){var r=parseInt(n,10),i=e?o.to.left:o.to.top;return n==="auto"?i+"px":r+i+"px"})})),e.effects.removeWrapper(o),n()}})}})(jQuery);(function(e,t){e.effects.effect.shake=function(t,n){var r=e(this),i=["position","top","bottom","left","right","height","width"],s=e.effects.setMode(r,t.mode||"effect"),o=t.direction||"left",u=t.distance||20,a=t.times||3,f=a*2+1,l=Math.round(t.duration/f),c=o==="up"||o==="down"?"top":"left",h=o==="up"||o==="left",p={},d={},v={},m,g=r.queue(),y=g.length;e.effects.save(r,i),r.show(),e.effects.createWrapper(r),p[c]=(h?"-=":"+=")+u,d[c]=(h?"+=":"-=")+u*2,v[c]=(h?"-=":"+=")+u*2,r.animate(p,l,t.easing);for(m=1;m<a;m++)r.animate(d,l,t.easing).animate(v,l,t.easing);r.animate(d,l,t.easing).animate(p,l/2,t.easing).queue(function(){s==="hide"&&r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n()}),y>1&&g.splice.apply(g,[1,0].concat(g.splice(y,f+1))),r.dequeue()}})(jQuery);(function(e,t){e.effects.effect.slide=function(t,n){var r=e(this),i=["position","top","bottom","left","right","width","height"],s=e.effects.setMode(r,t.mode||"show"),o=s==="show",u=t.direction||"left",a=u==="up"||u==="down"?"top":"left",f=u==="up"||u==="left",l,c={};e.effects.save(r,i),r.show(),l=t.distance||r[a==="top"?"outerHeight":"outerWidth"](!0),e.effects.createWrapper(r).css({overflow:"hidden"}),o&&r.css(a,f?isNaN(l)?"-"+l:-l:l),c[a]=(o?f?"+=":"-=":f?"-=":"+=")+l,r.animate(c,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){s==="hide"&&r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n()}})}})(jQuery);(function(e,t){e.effects.effect.transfer=function(t,n){var r=e(this),i=e(t.to),s=i.css("position")==="fixed",o=e("body"),u=s?o.scrollTop():0,a=s?o.scrollLeft():0,f=i.offset(),l={top:f.top-u,left:f.left-a,height:i.innerHeight(),width:i.innerWidth()},c=r.offset(),h=e('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(t.className).css({top:c.top-u,left:c.left-a,height:r.innerHeight(),width:r.innerWidth(),position:s?"fixed":"absolute"}).animate(l,t.duration,t.easing,function(){h.remove(),n()})}})(jQuery);(function(e,t){var n=!1;e.widget("ui.menu",{version:"1.9.2",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,e.proxy(function(e){this.options.disabled&&e.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(e){e.preventDefault()},"click .ui-state-disabled > a":function(e){e.preventDefault()},"click .ui-menu-item:has(a)":function(t){var r=e(t.target).closest(".ui-menu-item");!n&&r.not(".ui-state-disabled").length&&(n=!0,this.select(t),r.has(".ui-menu").length?this.expand(t):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&this.active.parents(".ui-menu").length===1&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(t){var n=e(t.currentTarget);n.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(t,n)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(e,t){var n=this.active||this.element.children(".ui-menu-item").eq(0);t||this.focus(e,n)},blur:function(t){this._delay(function(){e.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(t)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(t){e(t.target).closest(".ui-menu").length||this.collapseAll(t),n=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").andSelf().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var t=e(this);t.data("ui-menu-submenu-carat")&&t.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(t){function a(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var n,r,i,s,o,u=!0;switch(t.keyCode){case e.ui.keyCode.PAGE_UP:this.previousPage(t);break;case e.ui.keyCode.PAGE_DOWN:this.nextPage(t);break;case e.ui.keyCode.HOME:this._move("first","first",t);break;case e.ui.keyCode.END:this._move("last","last",t);break;case e.ui.keyCode.UP:this.previous(t);break;case e.ui.keyCode.DOWN:this.next(t);break;case e.ui.keyCode.LEFT:this.collapse(t);break;case e.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(t);break;case e.ui.keyCode.ENTER:case e.ui.keyCode.SPACE:this._activate(t);break;case e.ui.keyCode.ESCAPE:this.collapse(t);break;default:u=!1,r=this.previousFilter||"",i=String.fromCharCode(t.keyCode),s=!1,clearTimeout(this.filterTimer),i===r?s=!0:i=r+i,o=new RegExp("^"+a(i),"i"),n=this.activeMenu.children(".ui-menu-item").filter(function(){return o.test(e(this).children("a").text())}),n=s&&n.index(this.active.next())!==-1?this.active.nextAll(".ui-menu-item"):n,n.length||(i=String.fromCharCode(t.keyCode),o=new RegExp("^"+a(i),"i"),n=this.activeMenu.children(".ui-menu-item").filter(function(){return o.test(e(this).children("a").text())})),n.length?(this.focus(t,n),n.length>1?(this.previousFilter=i,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}u&&t.preventDefault()},_activate:function(e){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(e):this.select(e))},refresh:function(){var t,n=this.options.icons.submenu,r=this.element.find(this.options.menus);r.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var t=e(this),r=t.prev("a"),i=e("<span>").addClass("ui-menu-icon ui-icon "+n).data("ui-menu-submenu-carat",!0);r.attr("aria-haspopup","true").prepend(i),t.attr("aria-labelledby",r.attr("id"))}),t=r.add(this.element),t.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),t.children(":not(.ui-menu-item)").each(function(){var t=e(this);/[^\-—–\s]/.test(t.text())||t.addClass("ui-widget-content ui-menu-divider")}),t.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!e.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},focus:function(e,t){var n,r;this.blur(e,e&&e.type==="focus"),this._scrollIntoView(t),this.active=t.first(),r=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",r.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),e&&e.type==="keydown"?this._close():this.timer=this._delay(function(){this._close()},this.delay),n=t.children(".ui-menu"),n.length&&/^mouse/.test(e.type)&&this._startOpening(n),this.activeMenu=t.parent(),this._trigger("focus",e,{item:t})},_scrollIntoView:function(t){var n,r,i,s,o,u;this._hasScroll()&&(n=parseFloat(e.css(this.activeMenu[0],"borderTopWidth"))||0,r=parseFloat(e.css(this.activeMenu[0],"paddingTop"))||0,i=t.offset().top-this.activeMenu.offset().top-n-r,s=this.activeMenu.scrollTop(),o=this.activeMenu.height(),u=t.height(),i<0?this.activeMenu.scrollTop(s+i):i+u>o&&this.activeMenu.scrollTop(s+i-o+u))},blur:function(e,t){t||clearTimeout(this.timer);if(!this.active)return;this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",e,{item:this.active})},_startOpening:function(e){clearTimeout(this.timer);if(e.attr("aria-hidden")!=="true")return;this.timer=this._delay(function(){this._close(),this._open(e)},this.delay)},_open:function(t){var n=e.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden","true"),t.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(n)},collapseAll:function(t,n){clearTimeout(this.timer),this.timer=this._delay(function(){var r=n?this.element:e(t&&t.target).closest(this.element.find(".ui-menu"));r.length||(r=this.element),this._close(r),this.blur(t),this.activeMenu=r},this.delay)},_close:function(e){e||(e=this.active?this.active.parent():this.element),e.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(e){var t=this.active&&this.active.parent().closest(".ui-menu-item",this.element);t&&t.length&&(this._close(),this.focus(e,t))},expand:function(e){var t=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();t&&t.length&&(this._open(t.parent()),this._delay(function(){this.focus(e,t)}))},next:function(e){this._move("next","first",e)},previous:function(e){this._move("prev","last",e)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(e,t,n){var r;this.active&&(e==="first"||e==="last"?r=this.active[e==="first"?"prevAll":"nextAll"](".ui-menu-item").eq(-1):r=this.active[e+"All"](".ui-menu-item").eq(0));if(!r||!r.length||!this.active)r=this.activeMenu.children(".ui-menu-item")[t]();this.focus(n,r)},nextPage:function(t){var n,r,i;if(!this.active){this.next(t);return}if(this.isLastItem())return;this._hasScroll()?(r=this.active.offset().top,i=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return n=e(this),n.offset().top-r-i<0}),this.focus(t,n)):this.focus(t,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())},previousPage:function(t){var n,r,i;if(!this.active){this.next(t);return}if(this.isFirstItem())return;this._hasScroll()?(r=this.active.offset().top,i=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return n=e(this),n.offset().top-r+i>0}),this.focus(t,n)):this.focus(t,this.activeMenu.children(".ui-menu-item").first())},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(t){this.active=this.active||e(t.target).closest(".ui-menu-item");var n={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(t,!0),this._trigger("select",t,n)}})})(jQuery);(function(e,t){e.widget("ui.progressbar",{version:"1.9.2",options:{value:0,max:100},min:0,_create:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min,"aria-valuemax":this.options.max,"aria-valuenow":this._value()}),this.valueDiv=e("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this.oldValue=this._value(),this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove()},value:function(e){return e===t?this._value():(this._setOption("value",e),this)},_setOption:function(e,t){e==="value"&&(this.options.value=t,this._refreshValue(),this._value()===this.options.max&&this._trigger("complete")),this._super(e,t)},_value:function(){var e=this.options.value;return typeof e!="number"&&(e=0),Math.min(this.options.max,Math.max(this.min,e))},_percentage:function(){return 100*this._value()/this.options.max},_refreshValue:function(){var e=this.value(),t=this._percentage();this.oldValue!==e&&(this.oldValue=e,this._trigger("change")),this.valueDiv.toggle(e>this.min).toggleClass("ui-corner-right",e===this.options.max).width(t.toFixed(0)+"%"),this.element.attr("aria-valuenow",e)}})})(jQuery);(function(e,t){e.widget("ui.resizable",e.ui.mouse,{version:"1.9.2",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1e3},_create:function(){var t=this,n=this.options;this.element.addClass("ui-resizable"),e.extend(this,{_aspectRatio:!!n.aspectRatio,aspectRatio:n.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:n.helper||n.ghost||n.animate?n.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("resizable",this.element.data("resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=n.handles||(e(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se");if(this.handles.constructor==String){this.handles=="all"&&(this.handles="n,e,s,w,se,sw,ne,nw");var r=this.handles.split(",");this.handles={};for(var i=0;i<r.length;i++){var s=e.trim(r[i]),o="ui-resizable-"+s,u=e('<div class="ui-resizable-handle '+o+'"></div>');u.css({zIndex:n.zIndex}),"se"==s&&u.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(u)}}this._renderAxis=function(t){t=t||this.element;for(var n in this.handles){this.handles[n].constructor==String&&(this.handles[n]=e(this.handles[n],this.element).show());if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var r=e(this.handles[n],this.element),i=0;i=/sw|ne|nw|se|n|s/.test(n)?r.outerHeight():r.outerWidth();var s=["padding",/ne|nw|n/.test(n)?"Top":/se|sw|s/.test(n)?"Bottom":/^e$/.test(n)?"Right":"Left"].join("");t.css(s,i),this._proportionallyResize()}if(!e(this.handles[n]).length)continue}},this._renderAxis(this.element),this._handles=e(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){if(!t.resizing){if(this.className)var e=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);t.axis=e&&e[1]?e[1]:"se"}}),n.autoHide&&(this._handles.hide(),e(this.element).addClass("ui-resizable-autohide").mouseenter(function(){if(n.disabled)return;e(this).removeClass("ui-resizable-autohide"),t._handles.show()}).mouseleave(function(){if(n.disabled)return;t.resizing||(e(this).addClass("ui-resizable-autohide"),t._handles.hide())})),this._mouseInit()},_destroy:function(){this._mouseDestroy();var t=function(t){e(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};if(this.elementIsWrapper){t(this.element);var n=this.element;this.originalElement.css({position:n.css("position"),width:n.outerWidth(),height:n.outerHeight(),top:n.css("top"),left:n.css("left")}).insertAfter(n),n.remove()}return this.originalElement.css("resize",this.originalResizeStyle),t(this.originalElement),this},_mouseCapture:function(t){var n=!1;for(var r in this.handles)e(this.handles[r])[0]==t.target&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(t){var r=this.options,i=this.element.position(),s=this.element;this.resizing=!0,this.documentScroll={top:e(document).scrollTop(),left:e(document).scrollLeft()},(s.is(".ui-draggable")||/absolute/.test(s.css("position")))&&s.css({position:"absolute",top:i.top,left:i.left}),this._renderProxy();var o=n(this.helper.css("left")),u=n(this.helper.css("top"));r.containment&&(o+=e(r.containment).scrollLeft()||0,u+=e(r.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:o,top:u},this.size=this._helper?{width:s.outerWidth(),height:s.outerHeight()}:{width:s.width(),height:s.height()},this.originalSize=this._helper?{width:s.outerWidth(),height:s.outerHeight()}:{width:s.width(),height:s.height()},this.originalPosition={left:o,top:u},this.sizeDiff={width:s.outerWidth()-s.width(),height:s.outerHeight()-s.height()},this.originalMousePosition={left:t.pageX,top:t.pageY},this.aspectRatio=typeof r.aspectRatio=="number"?r.aspectRatio:this.originalSize.width/this.originalSize.height||1;var a=e(".ui-resizable-"+this.axis).css("cursor");return e("body").css("cursor",a=="auto"?this.axis+"-resize":a),s.addClass("ui-resizable-resizing"),this._propagate("start",t),!0},_mouseDrag:function(e){var t=this.helper,n=this.options,r={},i=this,s=this.originalMousePosition,o=this.axis,u=e.pageX-s.left||0,a=e.pageY-s.top||0,f=this._change[o];if(!f)return!1;var l=f.apply(this,[e,u,a]);this._updateVirtualBoundaries(e.shiftKey);if(this._aspectRatio||e.shiftKey)l=this._updateRatio(l,e);return l=this._respectSize(l,e),this._propagate("resize",e),t.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"}),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),this._updateCache(l),this._trigger("resize",e,this.ui()),!1},_mouseStop:function(t){this.resizing=!1;var n=this.options,r=this;if(this._helper){var i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),o=s&&e.ui.hasScroll(i[0],"left")?0:r.sizeDiff.height,u=s?0:r.sizeDiff.width,a={width:r.helper.width()-u,height:r.helper.height()-o},f=parseInt(r.element.css("left"),10)+(r.position.left-r.originalPosition.left)||null,l=parseInt(r.element.css("top"),10)+(r.position.top-r.originalPosition.top)||null;n.animate||this.element.css(e.extend(a,{top:l,left:f})),r.helper.height(r.size.height),r.helper.width(r.size.width),this._helper&&!n.animate&&this._proportionallyResize()}return e("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",t),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(e){var t=this.options,n,i,s,o,u;u={minWidth:r(t.minWidth)?t.minWidth:0,maxWidth:r(t.maxWidth)?t.maxWidth:Infinity,minHeight:r(t.minHeight)?t.minHeight:0,maxHeight:r(t.maxHeight)?t.maxHeight:Infinity};if(this._aspectRatio||e)n=u.minHeight*this.aspectRatio,s=u.minWidth/this.aspectRatio,i=u.maxHeight*this.aspectRatio,o=u.maxWidth/this.aspectRatio,n>u.minWidth&&(u.minWidth=n),s>u.minHeight&&(u.minHeight=s),i<u.maxWidth&&(u.maxWidth=i),o<u.maxHeight&&(u.maxHeight=o);this._vBoundaries=u},_updateCache:function(e){var t=this.options;this.offset=this.helper.offset(),r(e.left)&&(this.position.left=e.left),r(e.top)&&(this.position.top=e.top),r(e.height)&&(this.size.height=e.height),r(e.width)&&(this.size.width=e.width)},_updateRatio:function(e,t){var n=this.options,i=this.position,s=this.size,o=this.axis;return r(e.height)?e.width=e.height*this.aspectRatio:r(e.width)&&(e.height=e.width/this.aspectRatio),o=="sw"&&(e.left=i.left+(s.width-e.width),e.top=null),o=="nw"&&(e.top=i.top+(s.height-e.height),e.left=i.left+(s.width-e.width)),e},_respectSize:function(e,t){var n=this.helper,i=this._vBoundaries,s=this._aspectRatio||t.shiftKey,o=this.axis,u=r(e.width)&&i.maxWidth&&i.maxWidth<e.width,a=r(e.height)&&i.maxHeight&&i.maxHeight<e.height,f=r(e.width)&&i.minWidth&&i.minWidth>e.width,l=r(e.height)&&i.minHeight&&i.minHeight>e.height;f&&(e.width=i.minWidth),l&&(e.height=i.minHeight),u&&(e.width=i.maxWidth),a&&(e.height=i.maxHeight);var c=this.originalPosition.left+this.originalSize.width,h=this.position.top+this.size.height,p=/sw|nw|w/.test(o),d=/nw|ne|n/.test(o);f&&p&&(e.left=c-i.minWidth),u&&p&&(e.left=c-i.maxWidth),l&&d&&(e.top=h-i.minHeight),a&&d&&(e.top=h-i.maxHeight);var v=!e.width&&!e.height;return v&&!e.left&&e.top?e.top=null:v&&!e.top&&e.left&&(e.left=null),e},_proportionallyResize:function(){var t=this.options;if(!this._proportionallyResizeElements.length)return;var n=this.helper||this.element;for(var r=0;r<this._proportionallyResizeElements.length;r++){var i=this._proportionallyResizeElements[r];if(!this.borderDif){var s=[i.css("borderTopWidth"),i.css("borderRightWidth"),i.css("borderBottomWidth"),i.css("borderLeftWidth")],o=[i.css("paddingTop"),i.css("paddingRight"),i.css("paddingBottom"),i.css("paddingLeft")];this.borderDif=e.map(s,function(e,t){var n=parseInt(e,10)||0,r=parseInt(o[t],10)||0;return n+r})}i.css({height:n.height()-this.borderDif[0]-this.borderDif[2]||0,width:n.width()-this.borderDif[1]-this.borderDif[3]||0})}},_renderProxy:function(){var t=this.element,n=this.options;this.elementOffset=t.offset();if(this._helper){this.helper=this.helper||e('<div style="overflow:hidden;"></div>');var r=e.ui.ie6?1:0,i=e.ui.ie6?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+i,height:this.element.outerHeight()+i,position:"absolute",left:this.elementOffset.left-r+"px",top:this.elementOffset.top-r+"px",zIndex:++n.zIndex}),this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(e,t,n){return{width:this.originalSize.width+t}},w:function(e,t,n){var r=this.options,i=this.originalSize,s=this.originalPosition;return{left:s.left+t,width:i.width-t}},n:function(e,t,n){var r=this.options,i=this.originalSize,s=this.originalPosition;return{top:s.top+n,height:i.height-n}},s:function(e,t,n){return{height:this.originalSize.height+n}},se:function(t,n,r){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[t,n,r]))},sw:function(t,n,r){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[t,n,r]))},ne:function(t,n,r){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[t,n,r]))},nw:function(t,n,r){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[t,n,r]))}},_propagate:function(t,n){e.ui.plugin.call(this,t,[n,this.ui()]),t!="resize"&&this._trigger(t,n,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),e.ui.plugin.add("resizable","alsoResize",{start:function(t,n){var r=e(this).data("resizable"),i=r.options,s=function(t){e(t).each(function(){var t=e(this);t.data("resizable-alsoresize",{width:parseInt(t.width(),10),height:parseInt(t.height(),10),left:parseInt(t.css("left"),10),top:parseInt(t.css("top"),10)})})};typeof i.alsoResize=="object"&&!i.alsoResize.parentNode?i.alsoResize.length?(i.alsoResize=i.alsoResize[0],s(i.alsoResize)):e.each(i.alsoResize,function(e){s(e)}):s(i.alsoResize)},resize:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r.originalSize,o=r.originalPosition,u={height:r.size.height-s.height||0,width:r.size.width-s.width||0,top:r.position.top-o.top||0,left:r.position.left-o.left||0},a=function(t,r){e(t).each(function(){var t=e(this),i=e(this).data("resizable-alsoresize"),s={},o=r&&r.length?r:t.parents(n.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(o,function(e,t){var n=(i[t]||0)+(u[t]||0);n&&n>=0&&(s[t]=n||null)}),t.css(s)})};typeof i.alsoResize=="object"&&!i.alsoResize.nodeType?e.each(i.alsoResize,function(e,t){a(e,t)}):a(i.alsoResize)},stop:function(t,n){e(this).removeData("resizable-alsoresize")}}),e.ui.plugin.add("resizable","animate",{stop:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r._proportionallyResizeElements,o=s.length&&/textarea/i.test(s[0].nodeName),u=o&&e.ui.hasScroll(s[0],"left")?0:r.sizeDiff.height,a=o?0:r.sizeDiff.width,f={width:r.size.width-a,height:r.size.height-u},l=parseInt(r.element.css("left"),10)+(r.position.left-r.originalPosition.left)||null,c=parseInt(r.element.css("top"),10)+(r.position.top-r.originalPosition.top)||null;r.element.animate(e.extend(f,c&&l?{top:c,left:l}:{}),{duration:i.animateDuration,easing:i.animateEasing,step:function(){var n={width:parseInt(r.element.css("width"),10),height:parseInt(r.element.css("height"),10),top:parseInt(r.element.css("top"),10),left:parseInt(r.element.css("left"),10)};s&&s.length&&e(s[0]).css({width:n.width,height:n.height}),r._updateCache(n),r._propagate("resize",t)}})}}),e.ui.plugin.add("resizable","containment",{start:function(t,r){var i=e(this).data("resizable"),s=i.options,o=i.element,u=s.containment,a=u instanceof e?u.get(0):/parent/.test(u)?o.parent().get(0):u;if(!a)return;i.containerElement=e(a);if(/document/.test(u)||u==document)i.containerOffset={left:0,top:0},i.containerPosition={left:0,top:0},i.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight};else{var f=e(a),l=[];e(["Top","Right","Left","Bottom"]).each(function(e,t){l[e]=n(f.css("padding"+t))}),i.containerOffset=f.offset(),i.containerPosition=f.position(),i.containerSize={height:f.innerHeight()-l[3],width:f.innerWidth()-l[1]};var c=i.containerOffset,h=i.containerSize.height,p=i.containerSize.width,d=e.ui.hasScroll(a,"left")?a.scrollWidth:p,v=e.ui.hasScroll(a)?a.scrollHeight:h;i.parentData={element:a,left:c.left,top:c.top,width:d,height:v}}},resize:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r.containerSize,o=r.containerOffset,u=r.size,a=r.position,f=r._aspectRatio||t.shiftKey,l={top:0,left:0},c=r.containerElement;c[0]!=document&&/static/.test(c.css("position"))&&(l=o),a.left<(r._helper?o.left:0)&&(r.size.width=r.size.width+(r._helper?r.position.left-o.left:r.position.left-l.left),f&&(r.size.height=r.size.width/r.aspectRatio),r.position.left=i.helper?o.left:0),a.top<(r._helper?o.top:0)&&(r.size.height=r.size.height+(r._helper?r.position.top-o.top:r.position.top),f&&(r.size.width=r.size.height*r.aspectRatio),r.position.top=r._helper?o.top:0),r.offset.left=r.parentData.left+r.position.left,r.offset.top=r.parentData.top+r.position.top;var h=Math.abs((r._helper?r.offset.left-l.left:r.offset.left-l.left)+r.sizeDiff.width),p=Math.abs((r._helper?r.offset.top-l.top:r.offset.top-o.top)+r.sizeDiff.height),d=r.containerElement.get(0)==r.element.parent().get(0),v=/relative|absolute/.test(r.containerElement.css("position"));d&&v&&(h-=r.parentData.left),h+r.size.width>=r.parentData.width&&(r.size.width=r.parentData.width-h,f&&(r.size.height=r.size.width/r.aspectRatio)),p+r.size.height>=r.parentData.height&&(r.size.height=r.parentData.height-p,f&&(r.size.width=r.size.height*r.aspectRatio))},stop:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r.position,o=r.containerOffset,u=r.containerPosition,a=r.containerElement,f=e(r.helper),l=f.offset(),c=f.outerWidth()-r.sizeDiff.width,h=f.outerHeight()-r.sizeDiff.height;r._helper&&!i.animate&&/relative/.test(a.css("position"))&&e(this).css({left:l.left-u.left-o.left,width:c,height:h}),r._helper&&!i.animate&&/static/.test(a.css("position"))&&e(this).css({left:l.left-u.left-o.left,width:c,height:h})}}),e.ui.plugin.add("resizable","ghost",{start:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r.size;r.ghost=r.originalElement.clone(),r.ghost.css({opacity:.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof i.ghost=="string"?i.ghost:""),r.ghost.appendTo(r.helper)},resize:function(t,n){var r=e(this).data("resizable"),i=r.options;r.ghost&&r.ghost.css({position:"relative",height:r.size.height,width:r.size.width})},stop:function(t,n){var r=e(this).data("resizable"),i=r.options;r.ghost&&r.helper&&r.helper.get(0).removeChild(r.ghost.get(0))}}),e.ui.plugin.add("resizable","grid",{resize:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r.size,o=r.originalSize,u=r.originalPosition,a=r.axis,f=i._aspectRatio||t.shiftKey;i.grid=typeof i.grid=="number"?[i.grid,i.grid]:i.grid;var l=Math.round((s.width-o.width)/(i.grid[0]||1))*(i.grid[0]||1),c=Math.round((s.height-o.height)/(i.grid[1]||1))*(i.grid[1]||1);/^(se|s|e)$/.test(a)?(r.size.width=o.width+l,r.size.height=o.height+c):/^(ne)$/.test(a)?(r.size.width=o.width+l,r.size.height=o.height+c,r.position.top=u.top-c):/^(sw)$/.test(a)?(r.size.width=o.width+l,r.size.height=o.height+c,r.position.left=u.left-l):(r.size.width=o.width+l,r.size.height=o.height+c,r.position.top=u.top-c,r.position.left=u.left-l)}});var n=function(e){return parseInt(e,10)||0},r=function(e){return!isNaN(parseInt(e,10))}})(jQuery);(function(e,t){e.widget("ui.selectable",e.ui.mouse,{version:"1.9.2",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch"},_create:function(){var t=this;this.element.addClass("ui-selectable"),this.dragged=!1;var n;this.refresh=function(){n=e(t.options.filter,t.element[0]),n.addClass("ui-selectee"),n.each(function(){var t=e(this),n=t.offset();e.data(this,"selectable-item",{element:this,$element:t,left:n.left,top:n.top,right:n.left+t.outerWidth(),bottom:n.top+t.outerHeight(),startselected:!1,selected:t.hasClass("ui-selected"),selecting:t.hasClass("ui-selecting"),unselecting:t.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=n.addClass("ui-selectee"),this._mouseInit(),this.helper=e("<div class='ui-selectable-helper'></div>")},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled"),this._mouseDestroy()},_mouseStart:function(t){var n=this;this.opos=[t.pageX,t.pageY];if(this.options.disabled)return;var r=this.options;this.selectees=e(r.filter,this.element[0]),this._trigger("start",t),e(r.appendTo).append(this.helper),this.helper.css({left:t.clientX,top:t.clientY,width:0,height:0}),r.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var r=e.data(this,"selectable-item");r.startselected=!0,!t.metaKey&&!t.ctrlKey&&(r.$element.removeClass("ui-selected"),r.selected=!1,r.$element.addClass("ui-unselecting"),r.unselecting=!0,n._trigger("unselecting",t,{unselecting:r.element}))}),e(t.target).parents().andSelf().each(function(){var r=e.data(this,"selectable-item");if(r){var i=!t.metaKey&&!t.ctrlKey||!r.$element.hasClass("ui-selected");return r.$element.removeClass(i?"ui-unselecting":"ui-selected").addClass(i?"ui-selecting":"ui-unselecting"),r.unselecting=!i,r.selecting=i,r.selected=i,i?n._trigger("selecting",t,{selecting:r.element}):n._trigger("unselecting",t,{unselecting:r.element}),!1}})},_mouseDrag:function(t){var n=this;this.dragged=!0;if(this.options.disabled)return;var r=this.options,i=this.opos[0],s=this.opos[1],o=t.pageX,u=t.pageY;if(i>o){var a=o;o=i,i=a}if(s>u){var a=u;u=s,s=a}return this.helper.css({left:i,top:s,width:o-i,height:u-s}),this.selectees.each(function(){var a=e.data(this,"selectable-item");if(!a||a.element==n.element[0])return;var f=!1;r.tolerance=="touch"?f=!(a.left>o||a.right<i||a.top>u||a.bottom<s):r.tolerance=="fit"&&(f=a.left>i&&a.right<o&&a.top>s&&a.bottom<u),f?(a.selected&&(a.$element.removeClass("ui-selected"),a.selected=!1),a.unselecting&&(a.$element.removeClass("ui-unselecting"),a.unselecting=!1),a.selecting||(a.$element.addClass("ui-selecting"),a.selecting=!0,n._trigger("selecting",t,{selecting:a.element}))):(a.selecting&&((t.metaKey||t.ctrlKey)&&a.startselected?(a.$element.removeClass("ui-selecting"),a.selecting=!1,a.$element.addClass("ui-selected"),a.selected=!0):(a.$element.removeClass("ui-selecting"),a.selecting=!1,a.startselected&&(a.$element.addClass("ui-unselecting"),a.unselecting=!0),n._trigger("unselecting",t,{unselecting:a.element}))),a.selected&&!t.metaKey&&!t.ctrlKey&&!a.startselected&&(a.$element.removeClass("ui-selected"),a.selected=!1,a.$element.addClass("ui-unselecting"),a.unselecting=!0,n._trigger("unselecting",t,{unselecting:a.element})))}),!1},_mouseStop:function(t){var n=this;this.dragged=!1;var r=this.options;return e(".ui-unselecting",this.element[0]).each(function(){var r=e.data(this,"selectable-item");r.$element.removeClass("ui-unselecting"),r.unselecting=!1,r.startselected=!1,n._trigger("unselected",t,{unselected:r.element})}),e(".ui-selecting",this.element[0]).each(function(){var r=e.data(this,"selectable-item");r.$element.removeClass("ui-selecting").addClass("ui-selected"),r.selecting=!1,r.selected=!0,r.startselected=!0,n._trigger("selected",t,{selected:r.element})}),this._trigger("stop",t),this.helper.remove(),!1}})})(jQuery);(function(e,t){var n=5;e.widget("ui.slider",e.ui.mouse,{version:"1.9.2",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null},_create:function(){var t,r,i=this.options,s=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),o="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",u=[];this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"+(i.disabled?" ui-slider-disabled ui-disabled":"")),this.range=e([]),i.range&&(i.range===!0&&(i.values||(i.values=[this._valueMin(),this._valueMin()]),i.values.length&&i.values.length!==2&&(i.values=[i.values[0],i.values[0]])),this.range=e("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+(i.range==="min"||i.range==="max"?" ui-slider-range-"+i.range:""))),r=i.values&&i.values.length||1;for(t=s.length;t<r;t++)u.push(o);this.handles=s.add(e(u.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.add(this.range).filter("a").click(function(e){e.preventDefault()}).mouseenter(function(){i.disabled||e(this).addClass("ui-state-hover")}).mouseleave(function(){e(this).removeClass("ui-state-hover")}).focus(function(){i.disabled?e(this).blur():(e(".ui-slider .ui-state-focus").removeClass("ui-state-focus"),e(this).addClass("ui-state-focus"))}).blur(function(){e(this).removeClass("ui-state-focus")}),this.handles.each(function(t){e(this).data("ui-slider-handle-index",t)}),this._on(this.handles,{keydown:function(t){var r,i,s,o,u=e(t.target).data("ui-slider-handle-index");switch(t.keyCode){case e.ui.keyCode.HOME:case e.ui.keyCode.END:case e.ui.keyCode.PAGE_UP:case e.ui.keyCode.PAGE_DOWN:case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:t.preventDefault();if(!this._keySliding){this._keySliding=!0,e(t.target).addClass("ui-state-active"),r=this._start(t,u);if(r===!1)return}}o=this.options.step,this.options.values&&this.options.values.length?i=s=this.values(u):i=s=this.value();switch(t.keyCode){case e.ui.keyCode.HOME:s=this._valueMin();break;case e.ui.keyCode.END:s=this._valueMax();break;case e.ui.keyCode.PAGE_UP:s=this._trimAlignValue(i+(this._valueMax()-this._valueMin())/n);break;case e.ui.keyCode.PAGE_DOWN:s=this._trimAlignValue(i-(this._valueMax()-this._valueMin())/n);break;case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:if(i===this._valueMax())return;s=this._trimAlignValue(i+o);break;case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(i===this._valueMin())return;s=this._trimAlignValue(i-o)}this._slide(t,u,s)},keyup:function(t){var n=e(t.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(t,n),this._change(t,n),e(t.target).removeClass("ui-state-active"))}}),this._refreshValue(),this._animateOff=!1},_destroy:function(){this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(t){var n,r,i,s,o,u,a,f,l=this,c=this.options;return c.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),n={x:t.pageX,y:t.pageY},r=this._normValueFromMouse(n),i=this._valueMax()-this._valueMin()+1,this.handles.each(function(t){var n=Math.abs(r-l.values(t));i>n&&(i=n,s=e(this),o=t)}),c.range===!0&&this.values(1)===c.min&&(o+=1,s=e(this.handles[o])),u=this._start(t,o),u===!1?!1:(this._mouseSliding=!0,this._handleIndex=o,s.addClass("ui-state-active").focus(),a=s.offset(),f=!e(t.target).parents().andSelf().is(".ui-slider-handle"),this._clickOffset=f?{left:0,top:0}:{left:t.pageX-a.left-s.width()/2,top:t.pageY-a.top-s.height()/2-(parseInt(s.css("borderTopWidth"),10)||0)-(parseInt(s.css("borderBottomWidth"),10)||0)+(parseInt(s.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(t,o,r),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(e){var t={x:e.pageX,y:e.pageY},n=this._normValueFromMouse(t);return this._slide(e,this._handleIndex,n),!1},_mouseStop:function(e){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(e,this._handleIndex),this._change(e,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(e){var t,n,r,i,s;return this.orientation==="horizontal"?(t=this.elementSize.width,n=e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(t=this.elementSize.height,n=e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),r=n/t,r>1&&(r=1),r<0&&(r=0),this.orientation==="vertical"&&(r=1-r),i=this._valueMax()-this._valueMin(),s=this._valueMin()+r*i,this._trimAlignValue(s)},_start:function(e,t){var n={handle:this.handles[t],value:this.value()};return this.options.values&&this.options.values.length&&(n.value=this.values(t),n.values=this.values()),this._trigger("start",e,n)},_slide:function(e,t,n){var r,i,s;this.options.values&&this.options.values.length?(r=this.values(t?0:1),this.options.values.length===2&&this.options.range===!0&&(t===0&&n>r||t===1&&n<r)&&(n=r),n!==this.values(t)&&(i=this.values(),i[t]=n,s=this._trigger("slide",e,{handle:this.handles[t],value:n,values:i}),r=this.values(t?0:1),s!==!1&&this.values(t,n,!0))):n!==this.value()&&(s=this._trigger("slide",e,{handle:this.handles[t],value:n}),s!==!1&&this.value(n))},_stop:function(e,t){var n={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(n.value=this.values(t),n.values=this.values()),this._trigger("stop",e,n)},_change:function(e,t){if(!this._keySliding&&!this._mouseSliding){var n={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(n.value=this.values(t),n.values=this.values()),this._trigger("change",e,n)}},value:function(e){if(arguments.length){this.options.value=this._trimAlignValue(e),this._refreshValue(),this._change(null,0);return}return this._value()},values:function(t,n){var r,i,s;if(arguments.length>1){this.options.values[t]=this._trimAlignValue(n),this._refreshValue(),this._change(null,t);return}if(!arguments.length)return this._values();if(!e.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(t):this.value();r=this.options.values,i=arguments[0];for(s=0;s<r.length;s+=1)r[s]=this._trimAlignValue(i[s]),this._change(null,s);this._refreshValue()},_setOption:function(t,n){var r,i=0;e.isArray(this.options.values)&&(i=this.options.values.length),e.Widget.prototype._setOption.apply(this,arguments);switch(t){case"disabled":n?(this.handles.filter(".ui-state-focus").blur(),this.handles.removeClass("ui-state-hover"),this.handles.prop("disabled",!0),this.element.addClass("ui-disabled")):(this.handles.prop("disabled",!1),this.element.removeClass("ui-disabled"));break;case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":this._animateOff=!0,this._refreshValue();for(r=0;r<i;r+=1)this._change(null,r);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1}},_value:function(){var e=this.options.value;return e=this._trimAlignValue(e),e},_values:function(e){var t,n,r;if(arguments.length)return t=this.options.values[e],t=this._trimAlignValue(t),t;n=this.options.values.slice();for(r=0;r<n.length;r+=1)n[r]=this._trimAlignValue(n[r]);return n},_trimAlignValue:function(e){if(e<=this._valueMin())return this._valueMin();if(e>=this._valueMax())return this._valueMax();var t=this.options.step>0?this.options.step:1,n=(e-this._valueMin())%t,r=e-n;return Math.abs(n)*2>=t&&(r+=n>0?t:-t),parseFloat(r.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var t,n,r,i,s,o=this.options.range,u=this.options,a=this,f=this._animateOff?!1:u.animate,l={};this.options.values&&this.options.values.length?this.handles.each(function(r){n=(a.values(r)-a._valueMin())/(a._valueMax()-a._valueMin())*100,l[a.orientation==="horizontal"?"left":"bottom"]=n+"%",e(this).stop(1,1)[f?"animate":"css"](l,u.animate),a.options.range===!0&&(a.orientation==="horizontal"?(r===0&&a.range.stop(1,1)[f?"animate":"css"]({left:n+"%"},u.animate),r===1&&a.range[f?"animate":"css"]({width:n-t+"%"},{queue:!1,duration:u.animate})):(r===0&&a.range.stop(1,1)[f?"animate":"css"]({bottom:n+"%"},u.animate),r===1&&a.range[f?"animate":"css"]({height:n-t+"%"},{queue:!1,duration:u.animate}))),t=n}):(r=this.value(),i=this._valueMin(),s=this._valueMax(),n=s!==i?(r-i)/(s-i)*100:0,l[this.orientation==="horizontal"?"left":"bottom"]=n+"%",this.handle.stop(1,1)[f?"animate":"css"](l,u.animate),o==="min"&&this.orientation==="horizontal"&&this.range.stop(1,1)[f?"animate":"css"]({width:n+"%"},u.animate),o==="max"&&this.orientation==="horizontal"&&this.range[f?"animate":"css"]({width:100-n+"%"},{queue:!1,duration:u.animate}),o==="min"&&this.orientation==="vertical"&&this.range.stop(1,1)[f?"animate":"css"]({height:n+"%"},u.animate),o==="max"&&this.orientation==="vertical"&&this.range[f?"animate":"css"]({height:100-n+"%"},{queue:!1,duration:u.animate}))}})})(jQuery);(function(e,t){e.widget("ui.sortable",e.ui.mouse,{version:"1.9.2",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3},_create:function(){var e=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?e.axis==="x"||/left|right/.test(this.items[0].item.css("float"))||/inline|table-cell/.test(this.items[0].item.css("display")):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var e=this.items.length-1;e>=0;e--)this.items[e].item.removeData(this.widgetName+"-item");return this},_setOption:function(t,n){t==="disabled"?(this.options[t]=n,this.widget().toggleClass("ui-sortable-disabled",!!n)):e.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(t,n){var r=this;if(this.reverting)return!1;if(this.options.disabled||this.options.type=="static")return!1;this._refreshItems(t);var i=null,s=e(t.target).parents().each(function(){if(e.data(this,r.widgetName+"-item")==r)return i=e(this),!1});e.data(t.target,r.widgetName+"-item")==r&&(i=e(t.target));if(!i)return!1;if(this.options.handle&&!n){var o=!1;e(this.options.handle,i).find("*").andSelf().each(function(){this==t.target&&(o=!0)});if(!o)return!1}return this.currentItem=i,this._removeCurrentsFromItems(),!0},_mouseStart:function(t,n,r){var i=this.options;this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(t),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!=this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),i.containment&&this._setContainment(),i.cursor&&(e("body").css("cursor")&&(this._storedCursor=e("body").css("cursor")),e("body").css("cursor",i.cursor)),i.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",i.opacity)),i.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",i.zIndex)),this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",t,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions();if(!r)for(var s=this.containers.length-1;s>=0;s--)this.containers[s]._trigger("activate",t,this._uiHash(this));return e.ui.ddmanager&&(e.ui.ddmanager.current=this),e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(t),!0},_mouseDrag:function(t){this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs);if(this.options.scroll){var n=this.options,r=!1;this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-t.pageY<n.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+n.scrollSpeed:t.pageY-this.overflowOffset.top<n.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-n.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-t.pageX<n.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+n.scrollSpeed:t.pageX-this.overflowOffset.left<n.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-n.scrollSpeed)):(t.pageY-e(document).scrollTop()<n.scrollSensitivity?r=e(document).scrollTop(e(document).scrollTop()-n.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<n.scrollSensitivity&&(r=e(document).scrollTop(e(document).scrollTop()+n.scrollSpeed)),t.pageX-e(document).scrollLeft()<n.scrollSensitivity?r=e(document).scrollLeft(e(document).scrollLeft()-n.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<n.scrollSensitivity&&(r=e(document).scrollLeft(e(document).scrollLeft()+n.scrollSpeed))),r!==!1&&e.ui.ddmanager&&!n.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";for(var i=this.items.length-1;i>=0;i--){var s=this.items[i],o=s.item[0],u=this._intersectsWithPointer(s);if(!u)continue;if(s.instance!==this.currentContainer)continue;if(o!=this.currentItem[0]&&this.placeholder[u==1?"next":"prev"]()[0]!=o&&!e.contains(this.placeholder[0],o)&&(this.options.type=="semi-dynamic"?!e.contains(this.element[0],o):!0)){this.direction=u==1?"down":"up";if(this.options.tolerance!="pointer"&&!this._intersectsWithSides(s))break;this._rearrange(t,s),this._trigger("change",t,this._uiHash());break}}return this._contactContainers(t),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),this._trigger("sort",t,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(t,n){if(!t)return;e.ui.ddmanager&&!this.options.dropBehaviour&&e.ui.ddmanager.drop(this,t);if(this.options.revert){var r=this,i=this.placeholder.offset();this.reverting=!0,e(this.helper).animate({left:i.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:i.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){r._clear(t)})}else this._clear(t,n);return!1},cancel:function(){if(this.dragging){this._mouseUp({target:null}),this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var t=this.containers.length-1;t>=0;t--)this.containers[t]._trigger("deactivate",null,this._uiHash(this)),this.containers[t].containerCache.over&&(this.containers[t]._trigger("out",null,this._uiHash(this)),this.containers[t].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),e.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?e(this.domPosition.prev).after(this.currentItem):e(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(t){var n=this._getItemsAsjQuery(t&&t.connected),r=[];return t=t||{},e(n).each(function(){var n=(e(t.item||this).attr(t.attribute||"id")||"").match(t.expression||/(.+)[-=_](.+)/);n&&r.push((t.key||n[1]+"[]")+"="+(t.key&&t.expression?n[1]:n[2]))}),!r.length&&t.key&&r.push(t.key+"="),r.join("&")},toArray:function(t){var n=this._getItemsAsjQuery(t&&t.connected),r=[];return t=t||{},n.each(function(){r.push(e(t.item||this).attr(t.attribute||"id")||"")}),r},_intersectsWith:function(e){var t=this.positionAbs.left,n=t+this.helperProportions.width,r=this.positionAbs.top,i=r+this.helperProportions.height,s=e.left,o=s+e.width,u=e.top,a=u+e.height,f=this.offset.click.top,l=this.offset.click.left,c=r+f>u&&r+f<a&&t+l>s&&t+l<o;return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>e[this.floating?"width":"height"]?c:s<t+this.helperProportions.width/2&&n-this.helperProportions.width/2<o&&u<r+this.helperProportions.height/2&&i-this.helperProportions.height/2<a},_intersectsWithPointer:function(t){var n=this.options.axis==="x"||e.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,t.top,t.height),r=this.options.axis==="y"||e.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,t.left,t.width),i=n&&r,s=this._getDragVerticalDirection(),o=this._getDragHorizontalDirection();return i?this.floating?o&&o=="right"||s=="down"?2:1:s&&(s=="down"?2:1):!1},_intersectsWithSides:function(t){var n=e.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),r=e.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),i=this._getDragVerticalDirection(),s=this._getDragHorizontalDirection();return this.floating&&s?s=="right"&&r||s=="left"&&!r:i&&(i=="down"&&n||i=="up"&&!n)},_getDragVerticalDirection:function(){var e=this.positionAbs.top-this.lastPositionAbs.top;return e!=0&&(e>0?"down":"up")},_getDragHorizontalDirection:function(){var e=this.positionAbs.left-this.lastPositionAbs.left;return e!=0&&(e>0?"right":"left")},refresh:function(e){return this._refreshItems(e),this.refreshPositions(),this},_connectWith:function(){var e=this.options;return e.connectWith.constructor==String?[e.connectWith]:e.connectWith},_getItemsAsjQuery:function(t){var n=[],r=[],i=this._connectWith();if(i&&t)for(var s=i.length-1;s>=0;s--){var o=e(i[s]);for(var u=o.length-1;u>=0;u--){var a=e.data(o[u],this.widgetName);a&&a!=this&&!a.options.disabled&&r.push([e.isFunction(a.options.items)?a.options.items.call(a.element):e(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a])}}r.push([e.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):e(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);for(var s=r.length-1;s>=0;s--)r[s][0].each(function(){n.push(this)});return e(n)},_removeCurrentsFromItems:function(){var t=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=e.grep(this.items,function(e){for(var n=0;n<t.length;n++)if(t[n]==e.item[0])return!1;return!0})},_refreshItems:function(t){this.items=[],this.containers=[this];var n=this.items,r=[[e.isFunction(this.options.items)?this.options.items.call(this.element[0],t,{item:this.currentItem}):e(this.options.items,this.element),this]],i=this._connectWith();if(i&&this.ready)for(var s=i.length-1;s>=0;s--){var o=e(i[s]);for(var u=o.length-1;u>=0;u--){var a=e.data(o[u],this.widgetName);a&&a!=this&&!a.options.disabled&&(r.push([e.isFunction(a.options.items)?a.options.items.call(a.element[0],t,{item:this.currentItem}):e(a.options.items,a.element),a]),this.containers.push(a))}}for(var s=r.length-1;s>=0;s--){var f=r[s][1],l=r[s][0];for(var u=0,c=l.length;u<c;u++){var h=e(l[u]);h.data(this.widgetName+"-item",f),n.push({item:h,instance:f,width:0,height:0,left:0,top:0})}}},refreshPositions:function(t){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());for(var n=this.items.length-1;n>=0;n--){var r=this.items[n];if(r.instance!=this.currentContainer&&this.currentContainer&&r.item[0]!=this.currentItem[0])continue;var i=this.options.toleranceElement?e(this.options.toleranceElement,r.item):r.item;t||(r.width=i.outerWidth(),r.height=i.outerHeight());var s=i.offset();r.left=s.left,r.top=s.top}if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(var n=this.containers.length-1;n>=0;n--){var s=this.containers[n].element.offset();this.containers[n].containerCache.left=s.left,this.containers[n].containerCache.top=s.top,this.containers[n].containerCache.width=this.containers[n].element.outerWidth(),this.containers[n].containerCache.height=this.containers[n].element.outerHeight()}return this},_createPlaceholder:function(t){t=t||this;var n=t.options;if(!n.placeholder||n.placeholder.constructor==String){var r=n.placeholder;n.placeholder={element:function(){var n=e(document.createElement(t.currentItem[0].nodeName)).addClass(r||t.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];return r||(n.style.visibility="hidden"),n},update:function(e,i){if(r&&!n.forcePlaceholderSize)return;i.height()||i.height(t.currentItem.innerHeight()-parseInt(t.currentItem.css("paddingTop")||0,10)-parseInt(t.currentItem.css("paddingBottom")||0,10)),i.width()||i.width(t.currentItem.innerWidth()-parseInt(t.currentItem.css("paddingLeft")||0,10)-parseInt(t.currentItem.css("paddingRight")||0,10))}}}t.placeholder=e(n.placeholder.element.call(t.element,t.currentItem)),t.currentItem.after(t.placeholder),n.placeholder.update(t,t.placeholder)},_contactContainers:function(t){var n=null,r=null;for(var i=this.containers.length-1;i>=0;i--){if(e.contains(this.currentItem[0],this.containers[i].element[0]))continue;if(this._intersectsWith(this.containers[i].containerCache)){if(n&&e.contains(this.containers[i].element[0],n.element[0]))continue;n=this.containers[i],r=i}else this.containers[i].containerCache.over&&(this.containers[i]._trigger("out",t,this._uiHash(this)),this.containers[i].containerCache.over=0)}if(!n)return;if(this.containers.length===1)this.containers[r]._trigger("over",t,this._uiHash(this)),this.containers[r].containerCache.over=1;else{var s=1e4,o=null,u=this.containers[r].floating?"left":"top",a=this.containers[r].floating?"width":"height",f=this.positionAbs[u]+this.offset.click[u];for(var l=this.items.length-1;l>=0;l--){if(!e.contains(this.containers[r].element[0],this.items[l].item[0]))continue;if(this.items[l].item[0]==this.currentItem[0])continue;var c=this.items[l].item.offset()[u],h=!1;Math.abs(c-f)>Math.abs(c+this.items[l][a]-f)&&(h=!0,c+=this.items[l][a]),Math.abs(c-f)<s&&(s=Math.abs(c-f),o=this.items[l],this.direction=h?"up":"down")}if(!o&&!this.options.dropOnEmpty)return;this.currentContainer=this.containers[r],o?this._rearrange(t,o,null,!0):this._rearrange(t,null,this.containers[r].element,!0),this._trigger("change",t,this._uiHash()),this.containers[r]._trigger("change",t,this._uiHash(this)),this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[r]._trigger("over",t,this._uiHash(this)),this.containers[r].containerCache.over=1}},_createHelper:function(t){var n=this.options,r=e.isFunction(n.helper)?e(n.helper.apply(this.element[0],[t,this.currentItem])):n.helper=="clone"?this.currentItem.clone():this.currentItem;return r.parents("body").length||e(n.appendTo!="parent"?n.appendTo:this.currentItem[0].parentNode)[0].appendChild(r[0]),r[0]==this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(r[0].style.width==""||n.forceHelperSize)&&r.width(this.currentItem.width()),(r[0].style.height==""||n.forceHelperSize)&&r.height(this.currentItem.height()),r},_adjustOffsetFromHelper:function(t){typeof t=="string"&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&e.ui.ie)t={top:0,left:0};return{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var e=this.currentItem.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t=this.options;t.containment=="parent"&&(t.containment=this.helper[0].parentNode);if(t.containment=="document"||t.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,e(t.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(e(t.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(t.containment)){var n=e(t.containment)[0],r=e(t.containment).offset(),i=e(n).css("overflow")!="hidden";this.containment=[r.left+(parseInt(e(n).css("borderLeftWidth"),10)||0)+(parseInt(e(n).css("paddingLeft"),10)||0)-this.margins.left,r.top+(parseInt(e(n).css("borderTopWidth"),10)||0)+(parseInt(e(n).css("paddingTop"),10)||0)-this.margins.top,r.left+(i?Math.max(n.scrollWidth,n.offsetWidth):n.offsetWidth)-(parseInt(e(n).css("borderLeftWidth"),10)||0)-(parseInt(e(n).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,r.top+(i?Math.max(n.scrollHeight,n.offsetHeight):n.offsetHeight)-(parseInt(e(n).css("borderTopWidth"),10)||0)-(parseInt(e(n).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(t,n){n||(n=this.position);var r=t=="absolute"?1:-1,i=this.options,s=this.cssPosition!="absolute"||this.scrollParent[0]!=document&&!!e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(s[0].tagName);return{top:n.top+this.offset.relative.top*r+this.offset.parent.top*r-(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():o?0:s.scrollTop())*r,left:n.left+this.offset.relative.left*r+this.offset.parent.left*r-(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():o?0:s.scrollLeft())*r}},_generatePosition:function(t){var n=this.options,r=this.cssPosition!="absolute"||this.scrollParent[0]!=document&&!!e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,i=/(html|body)/i.test(r[0].tagName);this.cssPosition=="relative"&&(this.scrollParent[0]==document||this.scrollParent[0]==this.offsetParent[0])&&(this.offset.relative=this._getRelativeOffset());var s=t.pageX,o=t.pageY;if(this.originalPosition){this.containment&&(t.pageX-this.offset.click.left<this.containment[0]&&(s=this.containment[0]+this.offset.click.left),t.pageY-this.offset.click.top<this.containment[1]&&(o=this.containment[1]+this.offset.click.top),t.pageX-this.offset.click.left>this.containment[2]&&(s=this.containment[2]+this.offset.click.left),t.pageY-this.offset.click.top>this.containment[3]&&(o=this.containment[3]+this.offset.click.top));if(n.grid){var u=this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1];o=this.containment?u-this.offset.click.top<this.containment[1]||u-this.offset.click.top>this.containment[3]?u-this.offset.click.top<this.containment[1]?u+n.grid[1]:u-n.grid[1]:u:u;var a=this.originalPageX+Math.round((s-this.originalPageX)/n.grid[0])*n.grid[0];s=this.containment?a-this.offset.click.left<this.containment[0]||a-this.offset.click.left>this.containment[2]?a-this.offset.click.left<this.containment[0]?a+n.grid[0]:a-n.grid[0]:a:a}}return{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():i?0:r.scrollTop()),left:s-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():i?0:r.scrollLeft())}},_rearrange:function(e,t,n,r){n?n[0].appendChild(this.placeholder[0]):t.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?t.item[0]:t.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var i=this.counter;this._delay(function(){i==this.counter&&this.refreshPositions(!r)})},_clear:function(t,n){this.reverting=!1;var r=[];!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var i in this._storedCSS)if(this._storedCSS[i]=="auto"||this._storedCSS[i]=="static")this._storedCSS[i]="";this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();this.fromOutside&&!n&&r.push(function(e){this._trigger("receive",e,this._uiHash(this.fromOutside))}),(this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!n&&r.push(function(e){this._trigger("update",e,this._uiHash())}),this!==this.currentContainer&&(n||(r.push(function(e){this._trigger("remove",e,this._uiHash())}),r.push(function(e){return function(t){e._trigger("receive",t,this._uiHash(this))}}.call(this,this.currentContainer)),r.push(function(e){return function(t){e._trigger("update",t,this._uiHash(this))}}.call(this,this.currentContainer))));for(var i=this.containers.length-1;i>=0;i--)n||r.push(function(e){return function(t){e._trigger("deactivate",t,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(r.push(function(e){return function(t){e._trigger("out",t,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);this._storedCursor&&e("body").css("cursor",this._storedCursor),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex),this.dragging=!1;if(this.cancelHelperRemoval){if(!n){this._trigger("beforeStop",t,this._uiHash());for(var i=0;i<r.length;i++)r[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!1}n||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!=this.currentItem[0]&&this.helper.remove(),this.helper=null;if(!n){for(var i=0;i<r.length;i++)r[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){e.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(t){var n=t||this;return{helper:n.helper,placeholder:n.placeholder||e([]),position:n.position,originalPosition:n.originalPosition,offset:n.positionAbs,item:n.currentItem,sender:t?t.element:null}}})})(jQuery);(function(e){function t(e){return function(){var t=this.element.val();e.apply(this,arguments),this._refresh(),t!==this.element.val()&&this._trigger("change")}}e.widget("ui.spinner",{version:"1.9.2",defaultElement:"<input>",widgetEventPrefix:"spin",options:{culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var t={},n=this.element;return e.each(["min","max","step"],function(e,r){var i=n.attr(r);i!==undefined&&i.length&&(t[r]=i)}),t},_events:{keydown:function(e){this._start(e)&&this._keydown(e)&&e.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(e){if(this.cancelBlur){delete this.cancelBlur;return}this._refresh(),this.previous!==this.element.val()&&this._trigger("change",e)},mousewheel:function(e,t){if(!t)return;if(!this.spinning&&!this._start(e))return!1;this._spin((t>0?1:-1)*this.options.step,e),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(e)},100),e.preventDefault()},"mousedown .ui-spinner-button":function(t){function r(){var e=this.element[0]===this.document[0].activeElement;e||(this.element.focus(),this.previous=n,this._delay(function(){this.previous=n}))}var n;n=this.element[0]===this.document[0].activeElement?this.previous:this.element.val(),t.preventDefault(),r.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,r.call(this)});if(this._start(t)===!1)return;this._repeat(null,e(t.currentTarget).hasClass("ui-spinner-up")?1:-1,t)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(t){if(!e(t.currentTarget).hasClass("ui-state-active"))return;if(this._start(t)===!1)return!1;this._repeat(null,e(t.currentTarget).hasClass("ui-spinner-up")?1:-1,t)},"mouseleave .ui-spinner-button":"_stop"},_draw:function(){var e=this.uiSpinner=this.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());this.element.attr("role","spinbutton"),this.buttons=e.find(".ui-spinner-button").attr("tabIndex",-1).button().removeClass("ui-corner-all"),this.buttons.height()>Math.ceil(e.height()*.5)&&e.height()>0&&e.height(e.height()),this.options.disabled&&this.disable()},_keydown:function(t){var n=this.options,r=e.ui.keyCode;switch(t.keyCode){case r.UP:return this._repeat(null,1,t),!0;case r.DOWN:return this._repeat(null,-1,t),!0;case r.PAGE_UP:return this._repeat(null,n.page,t),!0;case r.PAGE_DOWN:return this._repeat(null,-n.page,t),!0}return!1},_uiSpinnerHtml:function(){return"<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>"},_buttonHtml:function(){return"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon "+this.options.icons.up+"'>&#9650;</span>"+"</a>"+"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>"+"<span class='ui-icon "+this.options.icons.down+"'>&#9660;</span>"+"</a>"},_start:function(e){return!this.spinning&&this._trigger("start",e)===!1?!1:(this.counter||(this.counter=1),this.spinning=!0,!0)},_repeat:function(e,t,n){e=e||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,t,n)},e),this._spin(t*this.options.step,n)},_spin:function(e,t){var n=this.value()||0;this.counter||(this.counter=1),n=this._adjustValue(n+e*this._increment(this.counter));if(!this.spinning||this._trigger("spin",t,{value:n})!==!1)this._value(n),this.counter++},_increment:function(t){var n=this.options.incremental;return n?e.isFunction(n)?n(t):Math.floor(t*t*t/5e4-t*t/500+17*t/200+1):1},_precision:function(){var e=this._precisionOf(this.options.step);return this.options.min!==null&&(e=Math.max(e,this._precisionOf(this.options.min))),e},_precisionOf:function(e){var t=e.toString(),n=t.indexOf(".");return n===-1?0:t.length-n-1},_adjustValue:function(e){var t,n,r=this.options;return t=r.min!==null?r.min:0,n=e-t,n=Math.round(n/r.step)*r.step,e=t+n,e=parseFloat(e.toFixed(this._precision())),r.max!==null&&e>r.max?r.max:r.min!==null&&e<r.min?r.min:e},_stop:function(e){if(!this.spinning)return;clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",e)},_setOption:function(e,t){if(e==="culture"||e==="numberFormat"){var n=this._parse(this.element.val());this.options[e]=t,this.element.val(this._format(n));return}(e==="max"||e==="min"||e==="step")&&typeof t=="string"&&(t=this._parse(t)),this._super(e,t),e==="disabled"&&(t?(this.element.prop("disabled",!0),this.buttons.button("disable")):(this.element.prop("disabled",!1),this.buttons.button("enable")))},_setOptions:t(function(e){this._super(e),this._value(this.element.val())}),_parse:function(e){return typeof e=="string"&&e!==""&&(e=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(e,10,this.options.culture):+e),e===""||isNaN(e)?null:e},_format:function(e){return e===""?"":window.Globalize&&this.options.numberFormat?Globalize.format(e,this.options.numberFormat,this.options.culture):e},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},_value:function(e,t){var n;e!==""&&(n=this._parse(e),n!==null&&(t||(n=this._adjustValue(n)),e=this._format(n))),this.element.val(e),this._refresh()},_destroy:function(){this.element.removeClass("ui-spinner-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:t(function(e){this._stepUp(e)}),_stepUp:function(e){this._spin((e||1)*this.options.step)},stepDown:t(function(e){this._stepDown(e)}),_stepDown:function(e){this._spin((e||1)*-this.options.step)},pageUp:t(function(e){this._stepUp((e||1)*this.options.page)}),pageDown:t(function(e){this._stepDown((e||1)*this.options.page)}),value:function(e){if(!arguments.length)return this._parse(this.element.val());t(this._value).call(this,e)},widget:function(){return this.uiSpinner}})})(jQuery);(function(e,t){function i(){return++n}function s(e){return e.hash.length>1&&e.href.replace(r,"")===location.href.replace(r,"").replace(/\s/g,"%20")}var n=0,r=/#.*$/;e.widget("ui.tabs",{version:"1.9.2",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var t=this,n=this.options,r=n.active,i=location.hash.substring(1);this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",n.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(t){e(this).is(".ui-state-disabled")&&t.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){e(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this._processTabs();if(r===null){i&&this.tabs.each(function(t,n){if(e(n).attr("aria-controls")===i)return r=t,!1}),r===null&&(r=this.tabs.index(this.tabs.filter(".ui-tabs-active")));if(r===null||r===-1)r=this.tabs.length?0:!1}r!==!1&&(r=this.tabs.index(this.tabs.eq(r)),r===-1&&(r=n.collapsible?!1:0)),n.active=r,!n.collapsible&&n.active===!1&&this.anchors.length&&(n.active=0),e.isArray(n.disabled)&&(n.disabled=e.unique(n.disabled.concat(e.map(this.tabs.filter(".ui-state-disabled"),function(e){return t.tabs.index(e)}))).sort()),this.options.active!==!1&&this.anchors.length?this.active=this._findActive(this.options.active):this.active=e(),this._refresh(),this.active.length&&this.load(n.active)},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):e()}},_tabKeydown:function(t){var n=e(this.document[0].activeElement).closest("li"),r=this.tabs.index(n),i=!0;if(this._handlePageNav(t))return;switch(t.keyCode){case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:r++;break;case e.ui.keyCode.UP:case e.ui.keyCode.LEFT:i=!1,r--;break;case e.ui.keyCode.END:r=this.anchors.length-1;break;case e.ui.keyCode.HOME:r=0;break;case e.ui.keyCode.SPACE:t.preventDefault(),clearTimeout(this.activating),this._activate(r);return;case e.ui.keyCode.ENTER:t.preventDefault(),clearTimeout(this.activating),this._activate(r===this.options.active?!1:r);return;default:return}t.preventDefault(),clearTimeout(this.activating),r=this._focusNextTab(r,i),t.ctrlKey||(n.attr("aria-selected","false"),this.tabs.eq(r).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",r)},this.delay))},_panelKeydown:function(t){if(this._handlePageNav(t))return;t.ctrlKey&&t.keyCode===e.ui.keyCode.UP&&(t.preventDefault(),this.active.focus())},_handlePageNav:function(t){if(t.altKey&&t.keyCode===e.ui.keyCode.PAGE_UP)return this._activate(this._focusNextTab(this.options.active-1,!1)),!0;if(t.altKey&&t.keyCode===e.ui.keyCode.PAGE_DOWN)return this._activate(this._focusNextTab(this.options.active+1,!0)),!0},_findNextTab:function(t,n){function i(){return t>r&&(t=0),t<0&&(t=r),t}var r=this.tabs.length-1;while(e.inArray(i(),this.options.disabled)!==-1)t=n?t+1:t-1;return t},_focusNextTab:function(e,t){return e=this._findNextTab(e,t),this.tabs.eq(e).focus(),e},_setOption:function(e,t){if(e==="active"){this._activate(t);return}if(e==="disabled"){this._setupDisabled(t);return}this._super(e,t),e==="collapsible"&&(this.element.toggleClass("ui-tabs-collapsible",t),!t&&this.options.active===!1&&this._activate(0)),e==="event"&&this._setupEvents(t),e==="heightStyle"&&this._setupHeightStyle(t)},_tabId:function(e){return e.attr("aria-controls")||"ui-tabs-"+i()},_sanitizeSelector:function(e){return e?e.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var t=this.options,n=this.tablist.children(":has(a[href])");t.disabled=e.map(n.filter(".ui-state-disabled"),function(e){return n.index(e)}),this._processTabs(),t.active===!1||!this.anchors.length?(t.active=!1,this.active=e()):this.active.length&&!e.contains(this.tablist[0],this.active[0])?this.tabs.length===t.disabled.length?(t.active=!1,this.active=e()):this._activate(this._findNextTab(Math.max(0,t.active-1),!1)):t.active=this.tabs.index(this.active),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var t=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return e("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=e(),this.anchors.each(function(n,r){var i,o,u,a=e(r).uniqueId().attr("id"),f=e(r).closest("li"),l=f.attr("aria-controls");s(r)?(i=r.hash,o=t.element.find(t._sanitizeSelector(i))):(u=t._tabId(f),i="#"+u,o=t.element.find(i),o.length||(o=t._createPanel(u),o.insertAfter(t.panels[n-1]||t.tablist)),o.attr("aria-live","polite")),o.length&&(t.panels=t.panels.add(o)),l&&f.data("ui-tabs-aria-controls",l),f.attr({"aria-controls":i.substring(1),"aria-labelledby":a}),o.attr("aria-labelledby",a)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.element.find("ol,ul").eq(0)},_createPanel:function(t){return e("<div>").attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(t){e.isArray(t)&&(t.length?t.length===this.anchors.length&&(t=!0):t=!1);for(var n=0,r;r=this.tabs[n];n++)t===!0||e.inArray(n,t)!==-1?e(r).addClass("ui-state-disabled").attr("aria-disabled","true"):e(r).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=t},_setupEvents:function(t){var n={click:function(e){e.preventDefault()}};t&&e.each(t.split(" "),function(e,t){n[t]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,n),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(t){var n,r,i=this.element.parent();t==="fill"?(e.support.minHeight||(r=i.css("overflow"),i.css("overflow","hidden")),n=i.height(),this.element.siblings(":visible").each(function(){var t=e(this),r=t.css("position");if(r==="absolute"||r==="fixed")return;n-=t.outerHeight(!0)}),r&&i.css("overflow",r),this.element.children().not(this.panels).each(function(){n-=e(this).outerHeight(!0)}),this.panels.each(function(){e(this).height(Math.max(0,n-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):t==="auto"&&(n=0,this.panels.each(function(){n=Math.max(n,e(this).height("").height())}).height(n))},_eventHandler:function(t){var n=this.options,r=this.active,i=e(t.currentTarget),s=i.closest("li"),o=s[0]===r[0],u=o&&n.collapsible,a=u?e():this._getPanelForTab(s),f=r.length?this._getPanelForTab(r):e(),l={oldTab:r,oldPanel:f,newTab:u?e():s,newPanel:a};t.preventDefault();if(s.hasClass("ui-state-disabled")||s.hasClass("ui-tabs-loading")||this.running||o&&!n.collapsible||this._trigger("beforeActivate",t,l)===!1)return;n.active=u?!1:this.tabs.index(s),this.active=o?e():s,this.xhr&&this.xhr.abort(),!f.length&&!a.length&&e.error("jQuery UI Tabs: Mismatching fragment identifier."),a.length&&this.load(this.tabs.index(s),t),this._toggle(t,l)},_toggle:function(t,n){function o(){r.running=!1,r._trigger("activate",t,n)}function u(){n.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),i.length&&r.options.show?r._show(i,r.options.show,o):(i.show(),o())}var r=this,i=n.newPanel,s=n.oldPanel;this.running=!0,s.length&&this.options.hide?this._hide(s,this.options.hide,function(){n.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),u()}):(n.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),s.hide(),u()),s.attr({"aria-expanded":"false","aria-hidden":"true"}),n.oldTab.attr("aria-selected","false"),i.length&&s.length?n.oldTab.attr("tabIndex",-1):i.length&&this.tabs.filter(function(){return e(this).attr("tabIndex")===0}).attr("tabIndex",-1),i.attr({"aria-expanded":"true","aria-hidden":"false"}),n.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(t){var n,r=this._findActive(t);if(r[0]===this.active[0])return;r.length||(r=this.active),n=r.find(".ui-tabs-anchor")[0],this._eventHandler({target:n,currentTarget:n,preventDefault:e.noop})},_findActive:function(t){return t===!1?e():this.tabs.eq(t)},_getIndex:function(e){return typeof e=="string"&&(e=this.anchors.index(this.anchors.filter("[href$='"+e+"']"))),e},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeData("href.tabs").removeData("load.tabs").removeUniqueId(),this.tabs.add(this.panels).each(function(){e.data(this,"ui-tabs-destroy")?e(this).remove():e(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var t=e(this),n=t.data("ui-tabs-aria-controls");n?t.attr("aria-controls",n):t.removeAttr("aria-controls")}),this.panels.show(),this.options.heightStyle!=="content"&&this.panels.css("height","")},enable:function(n){var r=this.options.disabled;if(r===!1)return;n===t?r=!1:(n=this._getIndex(n),e.isArray(r)?r=e.map(r,function(e){return e!==n?e:null}):r=e.map(this.tabs,function(e,t){return t!==n?t:null})),this._setupDisabled(r)},disable:function(n){var r=this.options.disabled;if(r===!0)return;if(n===t)r=!0;else{n=this._getIndex(n);if(e.inArray(n,r)!==-1)return;e.isArray(r)?r=e.merge([n],r).sort():r=[n]}this._setupDisabled(r)},load:function(t,n){t=this._getIndex(t);var r=this,i=this.tabs.eq(t),o=i.find(".ui-tabs-anchor"),u=this._getPanelForTab(i),a={tab:i,panel:u};if(s(o[0]))return;this.xhr=e.ajax(this._ajaxSettings(o,n,a)),this.xhr&&this.xhr.statusText!=="canceled"&&(i.addClass("ui-tabs-loading"),u.attr("aria-busy","true"),this.xhr.success(function(e){setTimeout(function(){u.html(e),r._trigger("load",n,a)},1)}).complete(function(e,t){setTimeout(function(){t==="abort"&&r.panels.stop(!1,!0),i.removeClass("ui-tabs-loading"),u.removeAttr("aria-busy"),e===r.xhr&&delete r.xhr},1)}))},_ajaxSettings:function(t,n,r){var i=this;return{url:t.attr("href"),beforeSend:function(t,s){return i._trigger("beforeLoad",n,e.extend({jqXHR:t,ajaxSettings:s},r))}}},_getPanelForTab:function(t){var n=e(t).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+n))}}),e.uiBackCompat!==!1&&(e.ui.tabs.prototype._ui=function(e,t){return{tab:e,panel:t,index:this.anchors.index(e)}},e.widget("ui.tabs",e.ui.tabs,{url:function(e,t){this.anchors.eq(e).attr("href",t)}}),e.widget("ui.tabs",e.ui.tabs,{options:{ajaxOptions:null,cache:!1},_create:function(){this._super();var t=this;this._on({tabsbeforeload:function(n,r){if(e.data(r.tab[0],"cache.tabs")){n.preventDefault();return}r.jqXHR.success(function(){t.options.cache&&e.data(r.tab[0],"cache.tabs",!0)})}})},_ajaxSettings:function(t,n,r){var i=this.options.ajaxOptions;return e.extend({},i,{error:function(e,t){try{i.error(e,t,r.tab.closest("li").index(),r.tab[0])}catch(n){}}},this._superApply(arguments))},_setOption:function(e,t){e==="cache"&&t===!1&&this.anchors.removeData("cache.tabs"),this._super(e,t)},_destroy:function(){this.anchors.removeData("cache.tabs"),this._super()},url:function(e){this.anchors.eq(e).removeData("cache.tabs"),this._superApply(arguments)}}),e.widget("ui.tabs",e.ui.tabs,{abort:function(){this.xhr&&this.xhr.abort()}}),e.widget("ui.tabs",e.ui.tabs,{options:{spinner:"<em>Loading&#8230;</em>"},_create:function(){this._super(),this._on({tabsbeforeload:function(e,t){if(e.target!==this.element[0]||!this.options.spinner)return;var n=t.tab.find("span"),r=n.html();n.html(this.options.spinner),t.jqXHR.complete(function(){n.html(r)})}})}}),e.widget("ui.tabs",e.ui.tabs,{options:{enable:null,disable:null},enable:function(t){var n=this.options,r;if(t&&n.disabled===!0||e.isArray(n.disabled)&&e.inArray(t,n.disabled)!==-1)r=!0;this._superApply(arguments),r&&this._trigger("enable",null,this._ui(this.anchors[t],this.panels[t]))},disable:function(t){var n=this.options,r;if(t&&n.disabled===!1||e.isArray(n.disabled)&&e.inArray(t,n.disabled)===-1)r=!0;this._superApply(arguments),r&&this._trigger("disable",null,this._ui(this.anchors[t],this.panels[t]))}}),e.widget("ui.tabs",e.ui.tabs,{options:{add:null,remove:null,tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},add:function(n,r,i){i===t&&(i=this.anchors.length);var s,o,u=this.options,a=e(u.tabTemplate.replace(/#\{href\}/g,n).replace(/#\{label\}/g,r)),f=n.indexOf("#")?this._tabId(a):n.replace("#","");return a.addClass("ui-state-default ui-corner-top").data("ui-tabs-destroy",!0),a.attr("aria-controls",f),s=i>=this.tabs.length,o=this.element.find("#"+f),o.length||(o=this._createPanel(f),s?i>0?o.insertAfter(this.panels.eq(-1)):o.appendTo(this.element):o.insertBefore(this.panels[i])),o.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").hide(),s?a.appendTo(this.tablist):a.insertBefore(this.tabs[i]),u.disabled=e.map(u.disabled,function(e){return e>=i?++e:e}),this.refresh(),this.tabs.length===1&&u.active===!1&&this.option("active",0),this._trigger("add",null,this._ui(this.anchors[i],this.panels[i])),this},remove:function(t){t=this._getIndex(t);var n=this.options,r=this.tabs.eq(t).remove(),i=this._getPanelForTab(r).remove();return r.hasClass("ui-tabs-active")&&this.anchors.length>2&&this._activate(t+(t+1<this.anchors.length?1:-1)),n.disabled=e.map(e.grep(n.disabled,function(e){return e!==t}),function(e){return e>=t?--e:e}),this.refresh(),this._trigger("remove",null,this._ui(r.find("a")[0],i[0])),this}}),e.widget("ui.tabs",e.ui.tabs,{length:function(){return this.anchors.length}}),e.widget("ui.tabs",e.ui.tabs,{options:{idPrefix:"ui-tabs-"},_tabId:function(t){var n=t.is("li")?t.find("a[href]"):t;return n=n[0],e(n).closest("li").attr("aria-controls")||n.title&&n.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF\-]/g,"")||this.options.idPrefix+i()}}),e.widget("ui.tabs",e.ui.tabs,{options:{panelTemplate:"<div></div>"},_createPanel:function(t){return e(this.options.panelTemplate).attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)}}),e.widget("ui.tabs",e.ui.tabs,{_create:function(){var e=this.options;e.active===null&&e.selected!==t&&(e.active=e.selected===-1?!1:e.selected),this._super(),e.selected=e.active,e.selected===!1&&(e.selected=-1)},_setOption:function(e,t){if(e!=="selected")return this._super(e,t);var n=this.options;this._super("active",t===-1?!1:t),n.selected=n.active,n.selected===!1&&(n.selected=-1)},_eventHandler:function(){this._superApply(arguments),this.options.selected=this.options.active,this.options.selected===!1&&(this.options.selected=-1)}}),e.widget("ui.tabs",e.ui.tabs,{options:{show:null,select:null},_create:function(){this._super(),this.options.active!==!1&&this._trigger("show",null,this._ui(this.active.find(".ui-tabs-anchor")[0],this._getPanelForTab(this.active)[0]))},_trigger:function(e,t,n){var r,i,s=this._superApply(arguments);return s?(e==="beforeActivate"?(r=n.newTab.length?n.newTab:n.oldTab,i=n.newPanel.length?n.newPanel:n.oldPanel,s=this._super("select",t,{tab:r.find(".ui-tabs-anchor")[0],panel:i[0],index:r.closest("li").index()})):e==="activate"&&n.newTab.length&&(s=this._super("show",t,{tab:n.newTab.find(".ui-tabs-anchor")[0],panel:n.newPanel[0],index:n.newTab.closest("li").index()})),s):!1}}),e.widget("ui.tabs",e.ui.tabs,{select:function(e){e=this._getIndex(e);if(e===-1){if(!this.options.collapsible||this.options.selected===-1)return;e=this.options.selected}this.anchors.eq(e).trigger(this.options.event+this.eventNamespace)}}),function(){var t=0;e.widget("ui.tabs",e.ui.tabs,{options:{cookie:null},_create:function(){var e=this.options,t;e.active==null&&e.cookie&&(t=parseInt(this._cookie(),10),t===-1&&(t=!1),e.active=t),this._super()},_cookie:function(n){var r=[this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+ ++t)];return arguments.length&&(r.push(n===!1?-1:n),r.push(this.options.cookie)),e.cookie.apply(null,r)},_refresh:function(){this._super(),this.options.cookie&&this._cookie(this.options.active,this.options.cookie)},_eventHandler:function(){this._superApply(arguments),this.options.cookie&&this._cookie(this.options.active,this.options.cookie)},_destroy:function(){this._super(),this.options.cookie&&this._cookie(null,this.options.cookie)}})}(),e.widget("ui.tabs",e.ui.tabs,{_trigger:function(t,n,r){var i=e.extend({},r);return t==="load"&&(i.panel=i.panel[0],i.tab=i.tab.find(".ui-tabs-anchor")[0]),this._super(t,n,i)}}),e.widget("ui.tabs",e.ui.tabs,{options:{fx:null},_getFx:function(){var t,n,r=this.options.fx;return r&&(e.isArray(r)?(t=r[0],n=r[1]):t=n=r),r?{show:n,hide:t}:null},_toggle:function(e,t){function o(){n.running=!1,n._trigger("activate",e,t)}function u(){t.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),r.length&&s.show?r.animate(s.show,s.show.duration,function(){o()}):(r.show(),o())}var n=this,r=t.newPanel,i=t.oldPanel,s=this._getFx();if(!s)return this._super(e,t);n.running=!0,i.length&&s.hide?i.animate(s.hide,s.hide.duration,function(){t.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),u()}):(t.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),i.hide(),u())}}))})(jQuery);(function(e){function n(t,n){var r=(t.attr("aria-describedby")||"").split(/\s+/);r.push(n),t.data("ui-tooltip-id",n).attr("aria-describedby",e.trim(r.join(" ")))}function r(t){var n=t.data("ui-tooltip-id"),r=(t.attr("aria-describedby")||"").split(/\s+/),i=e.inArray(n,r);i!==-1&&r.splice(i,1),t.removeData("ui-tooltip-id"),r=e.trim(r.join(" ")),r?t.attr("aria-describedby",r):t.removeAttr("aria-describedby")}var t=0;e.widget("ui.tooltip",{version:"1.9.2",options:{content:function(){return e(this).attr("title")},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable()},_setOption:function(t,n){var r=this;if(t==="disabled"){this[n?"_disable":"_enable"](),this.options[t]=n;return}this._super(t,n),t==="content"&&e.each(this.tooltips,function(e,t){r._updateContent(t)})},_disable:function(){var t=this;e.each(this.tooltips,function(n,r){var i=e.Event("blur");i.target=i.currentTarget=r[0],t.close(i,!0)}),this.element.find(this.options.items).andSelf().each(function(){var t=e(this);t.is("[title]")&&t.data("ui-tooltip-title",t.attr("title")).attr("title","")})},_enable:function(){this.element.find(this.options.items).andSelf().each(function(){var t=e(this);t.data("ui-tooltip-title")&&t.attr("title",t.data("ui-tooltip-title"))})},open:function(t){var n=this,r=e(t?t.target:this.element).closest(this.options.items);if(!r.length||r.data("ui-tooltip-id"))return;r.attr("title")&&r.data("ui-tooltip-title",r.attr("title")),r.data("ui-tooltip-open",!0),t&&t.type==="mouseover"&&r.parents().each(function(){var t=e(this),r;t.data("ui-tooltip-open")&&(r=e.Event("blur"),r.target=r.currentTarget=this,n.close(r,!0)),t.attr("title")&&(t.uniqueId(),n.parents[this.id]={element:this,title:t.attr("title")},t.attr("title",""))}),this._updateContent(r,t)},_updateContent:function(e,t){var n,r=this.options.content,i=this,s=t?t.type:null;if(typeof r=="string")return this._open(t,e,r);n=r.call(e[0],function(n){if(!e.data("ui-tooltip-open"))return;i._delay(function(){t&&(t.type=s),this._open(t,e,n)})}),n&&this._open(t,e,n)},_open:function(t,r,i){function f(e){a.of=e;if(s.is(":hidden"))return;s.position(a)}var s,o,u,a=e.extend({},this.options.position);if(!i)return;s=this._find(r);if(s.length){s.find(".ui-tooltip-content").html(i);return}r.is("[title]")&&(t&&t.type==="mouseover"?r.attr("title",""):r.removeAttr("title")),s=this._tooltip(r),n(r,s.attr("id")),s.find(".ui-tooltip-content").html(i),this.options.track&&t&&/^mouse/.test(t.type)?(this._on(this.document,{mousemove:f}),f(t)):s.position(e.extend({of:r},this.options.position)),s.hide(),this._show(s,this.options.show),this.options.show&&this.options.show.delay&&(u=setInterval(function(){s.is(":visible")&&(f(a.of),clearInterval(u))},e.fx.interval)),this._trigger("open",t,{tooltip:s}),o={keyup:function(t){if(t.keyCode===e.ui.keyCode.ESCAPE){var n=e.Event(t);n.currentTarget=r[0],this.close(n,!0)}},remove:function(){this._removeTooltip(s)}};if(!t||t.type==="mouseover")o.mouseleave="close";if(!t||t.type==="focusin")o.focusout="close";this._on(!0,r,o)},close:function(t){var n=this,i=e(t?t.currentTarget:this.element),s=this._find(i);if(this.closing)return;i.data("ui-tooltip-title")&&i.attr("title",i.data("ui-tooltip-title")),r(i),s.stop(!0),this._hide(s,this.options.hide,function(){n._removeTooltip(e(this))}),i.removeData("ui-tooltip-open"),this._off(i,"mouseleave focusout keyup"),i[0]!==this.element[0]&&this._off(i,"remove"),this._off(this.document,"mousemove"),t&&t.type==="mouseleave"&&e.each(this.parents,function(t,r){e(r.element).attr("title",r.title),delete n.parents[t]}),this.closing=!0,this._trigger("close",t,{tooltip:s}),this.closing=!1},_tooltip:function(n){var r="ui-tooltip-"+t++,i=e("<div>").attr({id:r,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||""));return e("<div>").addClass("ui-tooltip-content").appendTo(i),i.appendTo(this.document[0].body),e.fn.bgiframe&&i.bgiframe(),this.tooltips[r]=n,i},_find:function(t){var n=t.data("ui-tooltip-id");return n?e("#"+n):e()},_removeTooltip:function(e){e.remove(),delete this.tooltips[e.attr("id")]},_destroy:function(){var t=this;e.each(this.tooltips,function(n,r){var i=e.Event("blur");i.target=i.currentTarget=r[0],t.close(i,!0),e("#"+n).remove(),r.data("ui-tooltip-title")&&(r.attr("title",r.data("ui-tooltip-title")),r.removeData("ui-tooltip-title"))})}})})(jQuery);
/* Concierge Plugin v.1
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/
/*global jQuery:true console:true*/
var NB$ = jQuery.noConflict();

(function($) {   
 var Concierge = function(){
    var self = this;
    this.providers = {};
    this.listeners={};
    this.transitions={};
    this.state = {a:{}, o:{}};//a: active state, o: stored states
    this.factories={};
    this.features={};
    this.views={};
    this.constants = {};
    this.components = {};
    this.allowed_repeat_event={};
    this.keydown_block = true;
    this.historyHelper = {
        ptr: null,
        log: {}, 
        fct: null, 
        T: null, 
        latestentrytime:(new Date()).getTime(), 
        T_idle: 120000,
        latesteventtime: false, 
        timeout: 0
    };
    this.activeView = null;
    /*
    this.keydown = function(event){
        if (self.activeView !== null){
        return self.activeView._keydown(event);
        }
    };
    */
    //keypress is better in mozilla, since we get repeated strokes, but doesn't work in other browsers
    var f_key_cb = function(event){
        if (document.activeElement !== document.body && document.activeElement.tagName !== "A"){
        return true; //a "non-anchor" focusable element has the focus: let's not interfere
        }
        if ("activeView" in self && self.activeView !== null){
        return self.activeView._keydown(event);
        }
        else{
        return !(self.keydown_block); // do NOT propagate by default.
        }
    };
    if ( $.browser.mozilla){
        $(document.documentElement).keypress(f_key_cb);
    }
    else{
        $(document.documentElement).keydown(f_key_cb);
    }
    };
    Concierge.prototype.allowRepeatedEvents = function(list){
    for (var i in list){
        this.allowed_repeat_event[list[i]]=true;
    }
    };
    Concierge.prototype.addListeners = function(view, o, _id){
    /*
     * pre: view is a object that has a:  
     *  - _defaultHandler method, or that passed a specific listener function. See step??.js for an example where ui.perspective?.js is used as a view, 
     *     although perspectives don't have a _defaultHandler method
     *  - an id that can be retrieved by  element[0].id that is passed explicitely as a third optional parameter
     * In any case it DOESN'T need to be a class derived from ui.view
    */
        var id = _id === undefined ? view.element[0].id : _id;
    var x = this.listeners;
    for (var i in o){
        if (!(i in x)){
        x[i]={};
        }
        x[i][id]={l:view, cb:o[i]};
    }
    };
    Concierge.prototype.setConstants = function(o){
    this.constants = o;
    };
    Concierge.prototype.addConstants = function(o){
    for (var k in o){
        this.constants[k]=o[k];
    }
    };
    Concierge.prototype.addComponents = function(o){
    for (var k in o){
        this.components[k]=o[k];
    }
    };
    Concierge.prototype.get_component = function(key){
    //return an component
    return this.components[key];
    };

    Concierge.prototype.__updateIdleStatus = function(){
    var now = (new Date()).getTime();
    if (this.historyHelper.latesteventtime &&(now-this.historyHelper.latesteventtime>this.historyHelper.T_idle)){
        this.logHistory("idle", this.historyHelper.latesteventtime);
    }
    this.historyHelper.latesteventtime = now;
    };
    Concierge.prototype.setHistoryHelper = function(fct, T, cb, timeout){
    //cb and timeout are optional
    var self=this;
    self.historyHelper.T = T;
    if (timeout){
        self.historyHelper.timeout = timeout;
    }
    var f = function(){
        var now = (new Date()).getTime();
        var delta = now-self.historyHelper.latestentrytime;
        if ((self.historyHelper.latestentrytime && delta<T) || 
        (self.historyHelper.timeout && delta > self.historyHelper.timeout)){
        //there have been some events or a timeout        
        fct(self.historyHelper.log, cb || function(){});
        self.historyHelper.log={};
        }
    };
    $(window).unload(function(){
        self.__updateIdleStatus();
        f();
        });
    setInterval(f, T);
    };
    Concierge.prototype.logHistory = function(name, id){
    var now = (new Date()).getTime();
    if (!(name in this.historyHelper.log)){
        this.historyHelper.log[name]={};
    }
    this.historyHelper.log[name][id]=now;
    this.historyHelper.latestentrytime = now;
    };
    Concierge.prototype.addProviders =  function(id, o){
    var i;
    var x = this.providers;
    for (i in o){
        if (!(o[i] in x)){
        x[o[i]]={};
        }
        x[o[i]][id]=true;
    }
    };
    Concierge.prototype.get_state = function(key){
    return this.state.a[key];
    };
    Concierge.prototype.get_previous_state = function(key){
    //return an previous state variable. 
    return this.state.p[key];
    };
    Concierge.prototype.get_constant = function(key){
    //return an constant
    return this.constants[key];
    };
    Concierge.prototype.setTransitions = function(id, o){
    this.transitions[id] = o;
    };
    Concierge.prototype.addFactory=function(prop_type, feature, factory){
    if (!(prop_type in this.factories)){
        this.factories[prop_type]={};
    }
    if (!(feature in this.features)){
        this.features[feature]={};
    }
    this.factories[prop_type][feature]=factory;
    };
    Concierge.prototype.trigger = function(evt, view){
    /*
     * view is optional and used for transitions. 
     */
    //        $.L("---- event trigger: "+ evt.type +" (val="+evt.value+")");
    this.__updateIdleStatus();
    var O = this.state.o;
    var A = this.state.a;
    //set active state: 
        //    if ((evt.value !== A[evt.type]) || (evt.type in this.allowed_repeat_event)){
        A[evt.type] = evt.value;
        if (evt.type in this.listeners){
        var x = this.listeners[evt.type];
        for (var i in x){
            if (x[i].cb===null){//shorthand for views
            //            $.L("calling default evthandler for ", i);
            x[i].l._defaultHandler(evt);
            }
            else{
            x[i].cb(evt);
            }
        }
        }
        /*
            }
    else {
        $.L("[view] not propagating event resulting in same state: "+evt.type+", val="+evt.value);
    }
        */
    //do views need to be created ? If so, create them now. 
    if (evt.type in this.factories){
        for (var feature in  this.factories[evt.type]){
        if (!(evt.value in this.features[feature])){
            this.features[feature][evt.value]=null;
            this.factories[evt.type][feature](evt.value);
        }
        }
    }
    };
 $.concierge = new Concierge(); //singleton pattern
    var popup = $("<div class='ui-view-popup'/>");

    $.L = function(){
        if (window.console) {
            var args = Array.prototype.slice.call(arguments);
            args.forEach(function (arg) {
                console.log(arg);
            });
        }
    };

    $.I = function(msg, do_html, time_ms){
        if (time_ms === undefined){
            time_ms = 5000;
        }

        if (do_html === undefined){
            do_html = false;
        }

        var display_fct = do_html ? "html":"text";
        $("body").append(popup);

        popup[display_fct](msg).stop(true).hide().fadeIn(400).delay(time_ms).fadeOut(400, function() {$(this).remove();});

    };
    $.E = function(s){
        return s ? s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "None";
    };
    $.ellipsis = function(s, n){
    var l = s.length;
    return (l>n) ? s.substring(0,n) + "...": s;
    };
    $.pluralize = function(n, plural, singular){
    if (n === 1){
        return singular || "";
    }
    return plural || "s";
    };
      
})(NB$);

/* View Plugin v.5
 * Depends:
 *    ui.core.js
 *      concierge
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/
/*global jQuery:true*/
(function($) {   
    /*
     * The view object
     * options.headless set to false if the view is not meant to be displayed
     */
    var V_OBJ = {
    HEIGHT_MARGIN: 5,
    SERVICE: null,
    _create: function() {
        var self = this;
        var init = true;
        // initialization from scratch
        if (init) {            
        if (self.options.provides){
            $.concierge.addProviders(self.element[0].id, self.options.provides);
        }
        if (self.options.listens){
            $.concierge.addListeners(self, self.options.listens);
        }
        if (self.options.transitions){
            $.concierge.setTransitions(self.element[0].id, self.options.transitions);
        }
        if (!(self.options.headless)){
            self.element.addClass("view");

            //implement a concept of "active view"
            self.element.mouseenter(function(evt){        
                $.concierge.activeView = self;
                $("div.view").removeClass("active-view");
                self.element.addClass("active-view");
            });

            //register for perspective events: 
            self.element.closest("div.perspective").bind("resize_perspective", function(evt,directions){
                self.repaint();
            });
            
        }
        // $.L("setting view ", this.element[0].id, " to " , this);
        $.concierge.views[this.element[0].id]=this;
        }
    }, 
    defaultHandler: function(evt){
        $.L("[View]: default handler... override me !, evt=", evt);
    },
    beforeMove: function(evt){
        $.L("[View]: default beforemove... override me !, evt=", evt);
    },
    afterMove: function(evt){
        $.L("[View]: default aftermmove... override me !, evt=", evt);
    },
    set_model: function(model){
        this._model = model;
        //for now, we don't register to receive any particular updates.
        model.register($.ui.view.prototype.get_adapter.call(this),  {});
    },
    repaint: function(){
        //PRE: not a headless view
        var self = this;
        /*
          var outerview = self.element.parent("div.outerview");        
          var vp = outerview.parent("div.viewport");
          if(outerview.length && vp.length){
          //make sure we get offset of a visible component: 
          var y0 = vp.children(".outerview:visible").offset().top - vp.offset().top;
          outerview.height(vp.height()-y0);
          }
        */
        self._update();
    },
    _update: function(){
            /*
             * If you override this function in your view, don't forget to either: 
             * - to call this method to automatically use all the available space: 
             *   $.ui.view.prototype._update.call(this);
             * - or to expand your view manually to fit the new space in the way you need
             * 
             */
              
        this.element.height(this.element.parent().height());
        this.element.width(this.element.parent().width());
        this._expand();
    },
    _keydown: function(event){
        $.L("[view._keydown] override me for ", this.element);
     }, 
    get_adapter: function(){
        /* enables a view to be called by the methods of an mvc.model */
        var self = this;
        var adapter = {
        update: function(action, payload, items_fieldname){
            self.update(action, payload, items_fieldname);
        }
        };
        return adapter;
    },
    close: function(){
        var self = this;
        $.L("[View]: default closer ...override me !");
        delete $.concierge.views[self.element[0].id];
    },
    provides: function(){
        var self = this;
        return self.options.provides || {};
    },
    select: function(){
        $.L("[view]: selected ", this.element[0].id);
    }, 
    sayHello: function(){
        $.L("Hello, I'm view ", this.element.id);
    }, 
    update: function(action, payload, items_fieldname){
        $.L("[view] updating view:, ", action, payload);
    }, 
    keyboard_grabber: function(){
        return $("input.focusgrabber", this.element);
    },
    _expand: function(){
        //pre: this.option.expand, is defined, refers to selectors for some children of the element
        if (!(this.options.expand)){
        return;
        }
        var parent = this.element;                
        var $expand    = parent.children(this.options.expand);
        if ($expand.length === 0){
        return;
        }
        if ($expand.length === 1){ //allocate the whole available space
            var s0          = $expand.offset().top+parseInt($expand.css("margin-top")||0, 10)+parseInt($expand.css("margin-bottom")||0, 10)+parseInt($expand.css("border-top")||0, 10)+parseInt($expand.css("border-bottom")||0, 10) - this.element.offset().top;
        var new_height = this.element.height() - s0;
        $expand.height(new_height);
        return;
        }
        //expand refers to more than one element, so we'll allocate each height based on the expand elements' current heights.    
        var $others = parent.children().not(this.options.expand);
        var h_others = 0;
        $others.each(function(i){
            var $elt = $(this);
            h_others+=$elt.height()+parseInt($elt.css("margin-top")||0, 10)+parseInt($elt.css("margin-bottom")||0, 10)+parseInt($elt.css("border-top")||0, 10)+parseInt($elt.css("border-bottom")||0, 10);
        });
        var h_available = parent.height()-parseInt(parent.css("padding-top")||0, 10)-parseInt(parent.css("padding-bottom")||0, 10)-h_others;
        var $expand_visible = $expand.filter(":visible");
        var FIXED_PART = 0.3; //percentage assigned equally to each widget (intedepent of its current height)
        var h_available_fixed = h_available*FIXED_PART;
        var h_available_proportional = h_available - h_available_fixed;
        //now get a sense of how much each widget needs:
        var h_expands = 0;
        $expand_visible.each(function(i){            
            this.style.height = ""; //reset previous resize
            var $elt  = $(this);
            var h    = $elt.height();
            var m    = parseInt($elt.css("margin-top")||0, 10)+parseInt($elt.css("margin-bottom")||0, 10)+parseInt($elt.css("border-top")||0, 10)+parseInt($elt.css("border-bottom")||0, 10);
            h_expands += h+m;
            //        heights.push(h);
            //            margins.push(m);
        });
        //now resize. 
        var frac = h_available_proportional/h_expands;
        var fixed = parseInt(h_available_fixed/$expand_visible.length, 10);
        $expand_visible.each(function(i){            
            var $elt  = $(this);
            $elt.height(fixed+parseInt(frac*$elt.height(), 10));
        });
    }
    };
    
    $.widget("ui.view",V_OBJ );
    $.ui.view.prototype.options = {};
    $.extend($.ui.view, {
        version: '1.8',
        service: null, 
        provides: null,
        listens: null, 
        transitions: null
        });
})(jQuery);

/* Perspective Plugin v.5
 * Depends:
 *    ui.core.js
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 Example usage: 
 In your HTML: 
 <div id="pers1" label="Home">
   <div id="view-1" style="min-width: 250px;"  ></div>
   <div class="separator" orientation="vertical"/>
   <div class="pers-protection">
     <div id="view-2" style="min-height: 150px;" ></div>
     <div class="separator" orientation="horizontal"/>
     <div id="view-3"></div>      
   </div>
 </div>

 In your JS: 
 $("#pers1").perspective();
*/
/*global alert:true jQuery:true console:false*/
(function($) {
    var P_OBJ = {
    SEP_TOTAL_SIZE: 4,
    SEP_INSIDE_SIZE:4, 
    ORIENTATIONS: { 
            vertical:  {axis: "x", dir:  "left", dim: "width",  dim2:"height", cursor: "col-resize", margin: "margin-right" }, 
            horizontal:{axis: "y", dir:  "top" , dim: "height", dim2:"width",  cursor: "ns-resize", margin: "margin-bottom"}
    }, 
    CP_PARAMS : {
        width: {
        orientation1: "vertical", 
        orientation2: "horizontal", 
        cp : "_cpw", 
        scp : "_scpw", 
        dim: "_min_width"
        }, 
        height: {
        orientation1: "horizontal", 
        orientation2: "vertical", 
        cp : "_cph",
        scp : "_scph", 
         dim: "_min_height"
        }
    }, 
    CLA_PARAMS : {
        width: {
        dir: "_width", 
        cp : "_cpw", 
        scp : "_scpw", 
        d_min: "_min_width", 
        frac: "_frac_desired_width", 
        alloc: "_allocated_width", 
        des: "_desired_width", 
        mem: "_memorized_width"
        }, 
        height: {
        dir: "_height", 
        cp : "_cph",
         scp : "_scph", 
        d_min: "_min_height", 
        frac: "_frac_desired_height", 
        alloc: "_allocated_height", 
        des: "_desired_height", 
        mem:  "_memorized_height"
        }
    }, 
    PROPAGATE_PARAMS : {
        width: {
        alloc: "_allocated_width", 
        cp: "_cpw"

        },
        height: {
        alloc: "_allocated_height", 
        cp : "_cph"
        }
    }, 
    PREFIX_KEYS: ["v1", "v2"], 
    PREFIXES: {v1: 1, v2: 2},
    _protect: function($sep){
        /*
         * embeds each viewpane, vp1 and vp2 in a protection "cage" div (i.e position=relative), itself embedded in a widget
         * This way, embedded views can use regular coordinates, width=100% etc... without intererferting with other views. 
         */        
        var self = this;
        if ($sep.length===0){
        return;
        }    
        if ($sep.length !== 1){
        alert("There are "+ $sep.length +" separators in here... There should be at most 1"); 
        return;
        }
        var $p = $sep.parent();
        var $vp1 = $sep.prev();
        var $vp2 = $sep.next();
        var $sibs =  $sep.siblings();
        $sibs.not("div.pers-protection").wrap("<div class='pers-widget'><div class='pers-protection'/></div>");
        $sibs.filter("div.pers-protection").wrap("<div class='pers-widget'></div>");
        self._adjust($sep, true); //don't recurse...
        self._protect($vp1.children("div.separator"));
        self._protect($vp2.children("div.separator"));
    },
    _adjust: function($SEPS, dont_recurse){
        //PRE: containers have been embedded in their protection div and their widgets
        if ($SEPS.length===0){
        return;
        }
        var self = this;
        var f_adjust = function(i, sep){
        var $sep = $(sep);
        var $p = $sep.parent();
        var $prev = $sep.prev();
        var $next = $sep.next();
        var size1, margin, o_css ; //size1: desired size of prev
        var v = self.ORIENTATIONS[$sep.attr("orientation")];
        size1 = ($sep.attr("end")) ?  $p[v.dim]()-parseInt($sep.attr("end"), 10)-self.SEP_TOTAL_SIZE : $prev[v.dim]();
        margin = self.SEP_TOTAL_SIZE + Number(size1);
        o_css            = {};
        o_css[v.dim2]        = $p[v.dim2]()+"px";
        o_css[v.dim]        = size1+"px";
        $sep.prev().css(o_css);
        o_css            = {};        
        o_css["margin-"+v.dir]    =  margin + "px";
        o_css[v.dim2]        = $p[v.dim2]()+"px";
        o_css[v.dim]        = ($p[v.dim]()-margin)+"px";
        $sep.next().css(o_css);        
        o_css            = {};        
        o_css[v.dir]        = size1 + "px";
        o_css[v.dim2]        = $p[v.dim2]()+"px";
        o_css[v.dim]        = self.SEP_INSIDE_SIZE+"px";
        o_css["cursor"]        = v.cursor;
        //o_css["border-"+v.dir]    = "thin solid #FEFCFB";
        $sep.css(o_css);    
        };
        $SEPS.each(f_adjust); 
        if (!(dont_recurse)){
        self._adjust($(">div.pers-protection>div.separator",$SEPS.prev().add($SEPS.next())));
        }
    },
    _adjust_outerview_height: function(i, elt){
        var $elt=$(elt);
        var $p = $elt.parent();
        $elt.height($p.height()-$p.children("ul").height());
    },
    _f_new_draggable: function(o){
        var self = this;
        var v =  self.ORIENTATIONS[o];
        $("div.separator[orientation="+o+"]").draggable({
            axis: v.axis, 
            stop: function(event, ui){
            var VD    = self._views_data;
            var x1 = parseInt(this.style[v.dir], 10);
            var $elt = $(this);
            var $prev = $elt.prev();
            var $next = $elt.next(); 
            var leaf;
            $prev.css(v.dim, x1);
            //memorize if leaf: 
            leaf  = $(">div.pers-protection>div.view", $prev);
            if (leaf.length){
                VD["_memorized_"+v.dim][leaf[0].id] = x1;
            }        
            var o_css = {};
            o_css["margin-"+v.dir] = (x1+self.SEP_TOTAL_SIZE)+"px";
            var x2 = $elt.parent()[v.dim]()-self.SEP_TOTAL_SIZE-x1;
            leaf = $(">div.pers-protection>div.view", $next);
            if (leaf.length){
                VD["_memorized_"+v.dim][leaf[0].id] = x2;
            }
            o_css[v.dim] = x2 + "px";
            $next.css(o_css);
            self._adjust($(">div.pers-protection>div.separator",$prev.add($next)));
            self.element.trigger("resize_perspective", [v.axis]);
            }
        });
    }, 
    _fill_alloc_opts: function(prefix, views){
        var self    = this;
        var newprefix, id;
        var elt_id    = self.element[0].id+"_";
        //        var O    = self.options;
        var VD    = self._views_data;
        var W    = self._width();
        var H    = self._height();
        for (var v in self.PREFIXES){
        newprefix    = prefix+self.PREFIXES[v];
        id        = elt_id + newprefix;
        if ("data" in views[v]){//found a leaf
            VD._min_width[id]    =  "min_width" in views[v].data ?  views[v].data.min_width : W;
            VD._min_height[id]=  "min_height" in views[v].data ?  views[v].data.min_height : H;
            var priority        =  views[v].data.priority;
            if (priority !== 1 && priority !== 2){
            throw new Error("priority="+priority+"  but can only be 1 or 2 for now");
            }
            VD._pr2id[priority][id]    = null;
            VD._priority[id]        = views[v].data.priority;
            VD._desired_width[id]    = "desired_width" in views[v].data ?  views[v].data.desired_width*W/100: W;
            VD._desired_height[id]    = "desired_height" in views[v].data ?  views[v].data.desired_height*H/100: H;
            VD._frac_desired_width[id]    = Math.max(VD._desired_width[id]/VD._min_width[id], 1);           
            VD._frac_desired_height[id]    = Math.max(VD._desired_height[id]/VD._min_height[id], 1);           
            if ("transcient" in views[v].data && views[v].data.transcient){
            //existence of a key means the view is transcient and boolean value encodes for current visibility
            VD._transcient[id]        = false;
            }
        }
        else{//need to recurse
            self._fill_alloc_opts(newprefix, views[v].children);
        }
        }
        
    }, 
    _find_cp: function(prefix, views, orientation){
        //computes (an approximation of) the critical path in 'orientation' (width or height). 
        var self    = this;
        //        var O    = self.options;
        var VD    = self._views_data;
        var P    = self.CP_PARAMS[orientation];
        var newprefix, id;
        var elt_id    = self.element[0].id+"_";
        if (prefix === ""){ //reinit
        VD[P.cp] = {};
        }
        for (var v in self.PREFIXES){
        newprefix    = prefix+self.PREFIXES[v];
        id        = elt_id + newprefix;
        if ("data" in views[v]){//found a leaf
            if (views[v].data.priority === 1 && views.orientation === P.orientation1){
            //here we make the approx that this IS on the critical path
            VD[P.cp][id] = null;               
            }
        }
        else{            
            self._find_cp(newprefix, views[v].children, orientation);
        }
        }
        //"max" case (approx): leaves with separator in between
        //TODO: don't ignore transcient windows !
        if ( views.orientation === P.orientation2 && "data" in views.v1 && "data" in views.v2){                
        var id1 =  elt_id+prefix+self.PREFIXES.v1;
        var id2 =  elt_id+prefix+self.PREFIXES.v2;
        if ((VD[P.dim][id1] >  VD[P.dim][id2]) || (id2 in VD._transcient && VD._transcient[id2] === false)){
            VD[P.cp][id1] = null;
            VD[P.scp][id2] = id1;
        }
        else{
            VD[P.cp][id2] = null;
            VD[P.scp][id1] = id2;
        }
        }    
    }, 
    _propagate_allocations: function(prefix, views, orientation){
        var self = this;
        //        var O    = self.options;
        var VD    = self._views_data;
        var P    = self.PROPAGATE_PARAMS[orientation];        
        var newprefix, id;
        var elt_id = self.element[0].id+"_";
        var output = 0;
        for (var v in self.PREFIXES){
        newprefix = prefix+self.PREFIXES[v];
        id = elt_id + newprefix; 
        if (id in VD[P.alloc] && id in VD[P.cp]){
            output+=VD[P.alloc][id];
        }
        if ("children" in views[v]){
            output+= self._propagate_allocations(newprefix, views[v].children, orientation);           
        }
        }
        VD[P.alloc][elt_id+prefix] = output;
        return output;
    }, 
    _compute_leaves_allocations: function(orientation, use_memorized){
        var self = this;
        //        var O    = self.options;
        var VD    = self._views_data;
        var P    = self.CLA_PARAMS[orientation];
        //can we satisfy P1 minimum assignt ? 
        var D        = self[P.dir]();
        var available    = D;
        var remaining    = available;
        var P1        = VD._pr2id[1];
        var P2        = VD._pr2id[2];
        var req        = 0;
        var total_req_frac    = 0;
        var allocated    = 0;
        var v;
        if (!(use_memorized)){ //reinit
        VD[P.mem] = {};
        }
        for (v in  P1){
        if (v in  VD[P.cp] && ((!(v in VD._transcient)) || VD._transcient[v])){ //it's on the critical path
            req+=  VD[P.d_min][v];
        }
        }
        if (req<available){//every P1 widget will get at least min size
        remaining = available-req;
        for (v in  P2){ //every P2 widget
            if ((!(v in VD._transcient)) || VD._transcient[v]){
            req+=  VD[P.d_min][v];
            }
        }    
        if (req<available) {//the P1 widgets will get some extra space, since P1 and P2 already getting their min
            remaining = available-req;
            for (v in  P1){
            if ((!(v in VD._transcient)) || VD._transcient[v]){
                total_req_frac+=VD[P.frac][v];
            }
            }
            for (v in  P1){
            VD[P.alloc][v] =  ((!(v in VD._transcient)) || VD._transcient[v]) ? ((use_memorized && v in VD[P.mem]) ? VD[P.mem][v] : Math.min(VD[P.d_min][v] + Math.floor(remaining*VD[P.frac][v]/total_req_frac),VD[P.des][v]*D/100)) : 0;
            //TODO: we should check that the widget that isn't on the critical path didn't allocate more that the one that's on the critical path. 
            if (v in  VD[P.cp]){
                allocated+=VD[P.alloc][v];
            }
            }
            for (v in  P2){/// and for now, P2 views get their min
            VD[P.alloc][v] = ((!(v in VD._transcient)) || VD._transcient[v]) ? VD[P.d_min][v]: 0;
            allocated+=VD[P.alloc][v];
            }
            //anything left ? 
            if (allocated < available){
            remaining = available - allocated;
            //now give extra space to P2 widgets (//TODO refactor)
            total_req_frac = 0;
            for (v in  P2){
                if ((!(v in VD._transcient)) || VD._transcient[v]){
                total_req_frac+=VD[P.frac][v];
                }
            }
            for (v in  P2){
                allocated-=VD[P.alloc][v]; //remove current P2 size i.e. minsize 
                VD[P.alloc][v] =  ((!(v in VD._transcient)) || VD._transcient[v]) ? Math.min(VD[P.d_min][v] + Math.floor(remaining*VD[P.frac][v]/total_req_frac),VD[P.des][v]*D/100) : 0;
                allocated+=VD[P.alloc][v];                
            }
            }            
        }
        else{ //P2 widgets get less than their min
            req = 0;
            for (v in  P2){
            if ((!(v in VD._transcient)) || VD._transcient[v]){                                
                req += VD[P.d_min][v];            
                VD[P.alloc][v] = Math.floor(remaining*VD[P.d_min][v]/req);
            }
            else{
                VD[P.alloc][v] = 0;
            }
            }
            for (v in  P1){/// and for now, P2 views get their min
            VD[P.alloc][v] = ((!(v in VD._transcient)) || VD._transcient[v]) ?  ((use_memorized && v in VD[P.mem]) ? VD[P.mem][v] : VD[P.d_min][v]) : 0;
            if (v in  VD[P.cp]){
                allocated+=VD[P.alloc][v];
            }
            }
        }        
        }
        else{ //P1 widget gets less than min, and P2 are collapsed
        for (v in  P1){
            if (v in VD[P.cp]){
            VD[P.alloc][v] =  ((!(v in VD._transcient)) || VD._transcient[v]) ?  ((use_memorized && v in VD[P.mem]) ? VD[P.mem][v] : Math.floor(available*VD[P.d_min][v]/req)): 0;
            }            
            else if (v in  VD[P.scp]){ //this view has a sibling that's on the critical path for this orientation. Use sibling's size
            VD[P.alloc][v] = ((!(v in VD._transcient)) || VD._transcient[v]) ? Math.floor(available*VD[P.d_min][VD[P.scp][v]]/req): 0;
            }
            else{ //TODO: this is an approx. For now, just allocate desired size
            VD[P.alloc][v] = ((!(v in VD._transcient)) || VD._transcient[v]) ? VD[P.des][v]: 0;
            }
        }
        for (v in  P2){
            VD[P.alloc][v] = 0;
        }
        }
    }, 
    _create_ext_separator: function(){ 
            var self = this;
            if (self._ext_separator){
                var v =  self.ORIENTATIONS[self._ext_separator.orientation];
                var $p=$(self._ext_separator.container);      
                var  o_css            = {};        
                o_css[v.dir]        = 0;
                o_css[v.dim2]        = "100%";
                o_css[v.dim]        = self.SEP_INSIDE_SIZE+"px";
                o_css["cursor"]        = v.cursor;
                //o_css["border-"+v.dir]    = "thin solid #FEFCFB";
                var sep = $("<div class='external-separator' orientation='"+self._ext_separator.orientation+"'/>").css(o_css).draggable({
                         axis: v.axis, 
            stop: function(event, ui){
            var VD    = self._views_data;
            var x1 = parseInt(this.style[v.dir], 10);
            var $elt = $(this);           
            var $p = $elt.parent();
            var newdim = $p[v.dim]()-$elt.position()[v.dir];
            $p[v.dim](newdim);
            $p.parent().css(v.margin, newdim+"px");
            $elt.css(v.dir, 0);
            self.f_on_window_resize();
                        }
                    });
                $p.prepend(sep);
            }    
        },
    _create_contents: function(prefix, elt, views){
        var self        = this;
        var VD        = self._views_data;
        var elt_id        = self.element[0].id+"_";
        var did_sep        = false;
        var newprefix, id, $div;
        var key;
        var f_transcient = function(id, do_transcient){
            return function(){
                VD._transcient[id] = do_transcient;
                self._resize_contents(true);
                self._adjust(self.element.children("div.separator"));
                self.element.trigger("resize_perspective", ["xy"]);
            };
        };

        for (var i in self.PREFIX_KEYS){
        key = self.PREFIX_KEYS[i];     
        newprefix = prefix+self.PREFIXES[key];
        id = elt_id + newprefix;
        if ("data" in views[key]){
            $div = $("<div id='"+id+"' style='width: "+VD._allocated_width[id]+"px; height: "+VD._allocated_height[id]+"px;'/>");
            elt.append($div);
            if ("content" in views[key].data){
            views[key].data.content($div);
            if (id in VD._transcient){
                $div.bind({minimize: f_transcient(id, false), restore:  f_transcient(id, true)});
            }
            }
            else{
            $div.append("No contents for view <i>"+id+"</i>");
            }
        }
        else{
            var p = $("<div class='pers-protection'/>");
            elt.append(p);
            self._create_contents(newprefix, p, views[key].children);
        }
        if (!(did_sep )){
            did_sep = true;
            elt.append("<div class='separator' orientation='"+views.orientation+"'/>");
        }
        }
    },
    _resize_contents: function(use_memorized){ //resizes contents if the window has been resized. 
        var self    = this;
        var VD    = self._views_data;
        if (self._views){    
        self._find_cp("", self._views, "width"); //critical path for width
        self._find_cp("", self._views, "height"); //critical path for width
        self._compute_leaves_allocations("width", use_memorized);
        self._compute_leaves_allocations("height", use_memorized);
        self._propagate_allocations("", self._views, "width");
        self._propagate_allocations("", self._views, "height");
                
        for (var v in VD._allocated_width){
            //resize the view and the  correspoding pers-widget
            $("#"+v).css({width: VD._allocated_width[v]+"px", height: VD._allocated_height[v]+"px"}).parent().parent(".pers-widget").css({width: VD._allocated_width[v]+"px", height: VD._allocated_height[v]+"px"});
        }
        }
    },
    _create: function() {
        var self = this;
        self.element.addClass("perspective");//.css({width: self.options.width(self.element), height: self.options.height(self.element)});
        //stuff in options gets shared bewteen each instance, so let's make our own copy now (at creation time) before another instance changes it ! 
        self._views        = self.options.views;
        self._width        = self.options.width || function(){return self.element.parent().width();};
        self._height    = self.options.height || function(){return self.element.parent().height();};
        self._orientation    = self.options.orientation;
        self._listens    = self.options.listens;
        self._ext_separator = self.options.ext_separator;
        if (self._views){//are we creating any contents ? 
        var views_data = {
            _min_width: {}, 
            _desired_width: {}, 
            _frac_desired_width: {},
            _allocated_width: {}, 
            _min_height: {}, 
            _desired_height: {}, 
            _frac_desired_height: {},
            _allocated_height: {},             
            _priority:{}, 
            _pr2id:{1:{}, 2:{}}, 
            _cpw: {}, 
            _cph: {}, 
            _scpw: {}, //sibling of a view that's in the critical path for its width 
            _scph: {}, 
            _transcient: {}, 
            _memorized_width: {}, 
            _memorized_height: {}
        };
        self._views_data = views_data;
        self._fill_alloc_opts("", self._views);
        self._find_cp("", self._views, "width"); //critical path for width
        self._find_cp("", self._views, "height"); //critical path for width
        self._compute_leaves_allocations("width", false);
        self._compute_leaves_allocations("height", false);
        self._propagate_allocations("", self._views, "width");
        self._propagate_allocations("", self._views, "height");
        self._create_contents("", self.element, self._views);        
        self._create_ext_separator();
        if (self._listens){
            $.concierge.addListeners(self, self._listens);
        }
        }

        //self.element.addClass("perspective");
        self._protect(self.element.children("div.separator"));        
        for (var o in self.ORIENTATIONS){
        /* here it's necessary to put the loop code into a function so that the 
           parameter (o) gets copied, because if we inlined the code, the callback 
           function declared in _f_new_draggable ("stop") would only have the value
           of the closure variable at the last iteration */
            self._f_new_draggable(o); 
        }            
        window.addEventListener("resize", self.f_on_window_resize.bind(self), false);           
        if (self._views){
            //this is needed when opening a 3rd perspective for instance
            self._resize_contents(true);
            self._adjust(self.element.children("div.separator"));
            self.element.trigger("resize_perspective", ["xy"]); 
        }
        },
    f_on_window_resize: function(evt){
            var self = this;
            var $vp = self.element.closest("div.viewport");
            if ($vp.length){
                $vp.viewport("adjust_height");
            }
            self._resize_contents(false);
            self._adjust(self.element.children("div.separator"));
            self.element.trigger("resize_perspective", ["xy"]);
        },
    update: function(){
        var self=this;
        self._adjust(self.element.children("div.separator"));
        //send update to all registered observers: 
        self.element.trigger("resize_perspective", ["xy"]);
    }
    };   
    $.widget("ui.perspective",P_OBJ );
    $.ui.perspective.prototype.options = {
    width:  null, 
    height: null,
    orientation: null, 
    views: null
    };
    $.extend($.ui.perspective, {
        version: '1.8'
    });
})(jQuery);

/*!
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {
(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),

			// support: jQuery 1.6.x
			// jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
			width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !supportsOffsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function() {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

})();

return $.ui.position;

}));

/*!
 * jQuery contextMenu v1.10.3 - Plugin for simple contextMenu handling
 *
 * Version: v1.10.3
 *
 * Authors: Björn Brala (SWIS.nl), Rodney Rehm, Addy Osmani (patches for FF)
 * Web: http://swisnl.github.io/jQuery-contextMenu/
 *
 * Copyright (c) 2011-2015 SWIS BV and contributors
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 * Date: 2015-12-03T20:12:18.918Z
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function ($) {

    'use strict';

    // TODO: -
    // ARIA stuff: menuitem, menuitemcheckbox und menuitemradio
    // create <menu> structure if $.support[htmlCommand || htmlMenuitem] and !opt.disableNative

    // determine html5 compatibility
    $.support.htmlMenuitem = ('HTMLMenuItemElement' in window);
    $.support.htmlCommand = ('HTMLCommandElement' in window);
    $.support.eventSelectstart = ('onselectstart' in document.documentElement);
    /* // should the need arise, test for css user-select
     $.support.cssUserSelect = (function(){
     var t = false,
     e = document.createElement('div');

     $.each('Moz|Webkit|Khtml|O|ms|Icab|'.split('|'), function(i, prefix) {
     var propCC = prefix + (prefix ? 'U' : 'u') + 'serSelect',
     prop = (prefix ? ('-' + prefix.toLowerCase() + '-') : '') + 'user-select';

     e.style.cssText = prop + ': text;';
     if (e.style[propCC] == 'text') {
     t = true;
     return false;
     }

     return true;
     });

     return t;
     })();
     */

    if (!$.ui || !$.widget) {
        // duck punch $.cleanData like jQueryUI does to get that remove event
        $.cleanData = (function (orig) {
            return function (elems) {
                var events, elem, i;
                for (i = 0; (elem = elems[i]) != null; i++) {
                    try {
                        // Only trigger remove when necessary to save time
                        events = $._data(elem, 'events');
                        if (events && events.remove) {
                            $(elem).triggerHandler('remove');
                        }

                        // Http://bugs.jquery.com/ticket/8235
                    } catch (e) {}
                }
                orig(elems);
            };
        })($.cleanData);
    }

    var // currently active contextMenu trigger
        $currentTrigger = null,
    // is contextMenu initialized with at least one menu?
        initialized = false,
    // window handle
        $win = $(window),
    // number of registered menus
        counter = 0,
    // mapping selector to namespace
        namespaces = {},
    // mapping namespace to options
        menus = {},
    // custom command type handlers
        types = {},
    // default values
        defaults = {
            // selector of contextMenu trigger
            selector: null,
            // where to append the menu to
            appendTo: null,
            // method to trigger context menu ["right", "left", "hover"]
            trigger: 'right',
            // hide menu when mouse leaves trigger / menu elements
            autoHide: false,
            // ms to wait before showing a hover-triggered context menu
            delay: 200,
            // flag denoting if a second trigger should simply move (true) or rebuild (false) an open menu
            // as long as the trigger happened on one of the trigger-element's child nodes
            reposition: true,

            // Default classname configuration to be able avoid conflicts in frameworks
            classNames : {

                hover: 'hover', // Item hover
                disabled: 'disabled', // Item disabled
                visible: 'visible', // Item visible
                notSelectable: 'not-selectable', // Item not selectable

                icon: 'icon',
                iconEdit: 'icon-edit',
                iconCut: 'icon-cut',
                iconCopy: 'icon-copy',
                iconPaste: 'icon-paste',
                iconDelete: 'icon-delete',
                iconAdd: 'icon-add',
                iconQuit: 'icon-quit'
            },

            // determine position to show menu at
            determinePosition: function ($menu) {
                // position to the lower middle of the trigger element
                if ($.ui && $.ui.position) {
                    // .position() is provided as a jQuery UI utility
                    // (...and it won't work on hidden elements)
                    $menu.css('display', 'block').position({
                        my: 'center top',
                        at: 'center bottom',
                        of: this,
                        offset: '0 5',
                        collision: 'fit'
                    }).css('display', 'none');
                } else {
                    // determine contextMenu position
                    var offset = this.offset();
                    offset.top += this.outerHeight();
                    offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
                    $menu.css(offset);
                }
            },
            // position menu
            position: function (opt, x, y) {
                var offset;
                // determine contextMenu position
                if (!x && !y) {
                    opt.determinePosition.call(this, opt.$menu);
                    return;
                } else if (x === 'maintain' && y === 'maintain') {
                    // x and y must not be changed (after re-show on command click)
                    offset = opt.$menu.position();
                } else {
                    // x and y are given (by mouse event)
                    offset = {top: y, left: x};
                }

                // correct offset if viewport demands it
                var bottom = $win.scrollTop() + $win.height(),
                    right = $win.scrollLeft() + $win.width(),
                    height = opt.$menu.outerHeight(),
                    width = opt.$menu.outerWidth();

                if (offset.top + height > bottom) {
                    offset.top -= height;
                }

                if (offset.top < 0) {
                    offset.top = 0;
                }

                if (offset.left + width > right) {
                    offset.left -= width;
                }

                if (offset.left < 0) {
                    offset.left = 0;
                }

                opt.$menu.css(offset);
            },
            // position the sub-menu
            positionSubmenu: function ($menu) {
                if ($.ui && $.ui.position) {
                    // .position() is provided as a jQuery UI utility
                    // (...and it won't work on hidden elements)
                    $menu.css('display', 'block').position({
                        my: 'left top',
                        at: 'right top',
                        of: this,
                        collision: 'flipfit fit'
                    }).css('display', '');
                } else {
                    // determine contextMenu position
                    var offset = {
                        top: 0,
                        left: this.outerWidth()
                    };
                    $menu.css(offset);
                }
            },
            // offset to add to zIndex
            zIndex: 1,
            // show hide animation settings
            animation: {
                duration: 50,
                show: 'slideDown',
                hide: 'slideUp'
            },
            // events
            events: {
                show: $.noop,
                hide: $.noop
            },
            // default callback
            callback: null,
            // list of contextMenu items
            items: {}
        },
    // mouse position for hover activation
        hoveract = {
            timer: null,
            pageX: null,
            pageY: null
        },
    // determine zIndex
        zindex = function ($t) {
            var zin = 0,
                $tt = $t;

            while (true) {
                zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
                $tt = $tt.parent();
                if (!$tt || !$tt.length || 'html body'.indexOf($tt.prop('nodeName').toLowerCase()) > -1) {
                    break;
                }
            }
            return zin;
        },
    // event handlers
        handle = {
            // abort anything
            abortevent: function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
            },
            // contextmenu show dispatcher
            contextmenu: function (e) {
                var $this = $(this);

                // disable actual context-menu if we are using the right mouse button as the trigger
                if (e.data.trigger === 'right') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }

                // abort native-triggered events unless we're triggering on right click
                if ((e.data.trigger !== 'right' && e.data.trigger !== 'demand') && e.originalEvent) {
                    return;
                }

                // Let the current contextmenu decide if it should show or not based on its own trigger settings
                if (e.mouseButton !== undefined && e.data) {
                    if (!(e.data.trigger == 'left' && e.mouseButton === 0) && !(e.data.trigger == 'right' && e.mouseButton === 2)) {
                        // Mouse click is not valid.
                        return;
                    }
                }

                // abort event if menu is visible for this trigger
                if ($this.hasClass('context-menu-active')) {
                    return;
                }

                if (!$this.hasClass('context-menu-disabled')) {
                    // theoretically need to fire a show event at <menu>
                    // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#context-menus
                    // var evt = jQuery.Event("show", { data: data, pageX: e.pageX, pageY: e.pageY, relatedTarget: this });
                    // e.data.$menu.trigger(evt);

                    $currentTrigger = $this;
                    if (e.data.build) {
                        var built = e.data.build($currentTrigger, e);
                        // abort if build() returned false
                        if (built === false) {
                            return;
                        }

                        // dynamically build menu on invocation
                        e.data = $.extend(true, {}, defaults, e.data, built || {});

                        // abort if there are no items to display
                        if (!e.data.items || $.isEmptyObject(e.data.items)) {
                            // Note: jQuery captures and ignores errors from event handlers
                            if (window.console) {
                                (console.error || console.log).call(console, 'No items specified to show in contextMenu');
                            }

                            throw new Error('No Items specified');
                        }

                        // backreference for custom command type creation
                        e.data.$trigger = $currentTrigger;

                        op.create(e.data);
                    }
                    var showMenu = false;
                    for (var item in e.data.items) {
                        if (e.data.items.hasOwnProperty(item)) {
                            var visible;
                            if ($.isFunction(e.data.items[item].visible)) {
                                visible = e.data.items[item].visible.call($(e.currentTarget), item, e.data);
                            } else if (typeof item.visible !== 'undefined') {
                                visible = e.data.items[item].visible === true;
                            } else {
                                visible = true;
                            }
                            if (visible) {
                                showMenu = true;
                            }
                        }
                    }
                    if (showMenu) {
                        // show menu
                        op.show.call($this, e.data, e.pageX, e.pageY);
                    }
                }
            },
            // contextMenu left-click trigger
            click: function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $(this).trigger($.Event('contextmenu', {data: e.data, pageX: e.pageX, pageY: e.pageY}));
            },
            // contextMenu right-click trigger
            mousedown: function (e) {
                // register mouse down
                var $this = $(this);

                // hide any previous menus
                if ($currentTrigger && $currentTrigger.length && !$currentTrigger.is($this)) {
                    $currentTrigger.data('contextMenu').$menu.trigger('contextmenu:hide');
                }

                // activate on right click
                if (e.button === 2) {
                    $currentTrigger = $this.data('contextMenuActive', true);
                }
            },
            // contextMenu right-click trigger
            mouseup: function (e) {
                // show menu
                var $this = $(this);
                if ($this.data('contextMenuActive') && $currentTrigger && $currentTrigger.length && $currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $currentTrigger = $this;
                    $this.trigger($.Event('contextmenu', {data: e.data, pageX: e.pageX, pageY: e.pageY}));
                }

                $this.removeData('contextMenuActive');
            },
            // contextMenu hover trigger
            mouseenter: function (e) {
                var $this = $(this),
                    $related = $(e.relatedTarget),
                    $document = $(document);

                // abort if we're coming from a menu
                if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                    return;
                }

                // abort if a menu is shown
                if ($currentTrigger && $currentTrigger.length) {
                    return;
                }

                hoveract.pageX = e.pageX;
                hoveract.pageY = e.pageY;
                hoveract.data = e.data;
                $document.on('mousemove.contextMenuShow', handle.mousemove);
                hoveract.timer = setTimeout(function () {
                    hoveract.timer = null;
                    $document.off('mousemove.contextMenuShow');
                    $currentTrigger = $this;
                    $this.trigger($.Event('contextmenu', {
                        data: hoveract.data,
                        pageX: hoveract.pageX,
                        pageY: hoveract.pageY
                    }));
                }, e.data.delay);
            },
            // contextMenu hover trigger
            mousemove: function (e) {
                hoveract.pageX = e.pageX;
                hoveract.pageY = e.pageY;
            },
            // contextMenu hover trigger
            mouseleave: function (e) {
                // abort if we're leaving for a menu
                var $related = $(e.relatedTarget);
                if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                    return;
                }

                try {
                    clearTimeout(hoveract.timer);
                } catch (e) {
                }

                hoveract.timer = null;
            },
            // click on layer to hide contextMenu
            layerClick: function (e) {
                var $this = $(this),
                    root = $this.data('contextMenuRoot'),
                    button = e.button,
                    x = e.pageX,
                    y = e.pageY,
                    target,
                    offset;

                e.preventDefault();
                e.stopImmediatePropagation();

                setTimeout(function () {
                    var $window;
                    var triggerAction = ((root.trigger === 'left' && button === 0) || (root.trigger === 'right' && button === 2));

                    // find the element that would've been clicked, wasn't the layer in the way
                    if (document.elementFromPoint && root.$layer) {
                        root.$layer.hide();
                        target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());
                        root.$layer.show();
                    }

                    if (root.reposition && triggerAction) {
                        if (document.elementFromPoint) {
                            if (root.$trigger.is(target) || root.$trigger.has(target).length) {
                                root.position.call(root.$trigger, root, x, y);
                                return;
                            }
                        } else {
                            offset = root.$trigger.offset();
                            $window = $(window);
                            // while this looks kinda awful, it's the best way to avoid
                            // unnecessarily calculating any positions
                            offset.top += $window.scrollTop();
                            if (offset.top <= e.pageY) {
                                offset.left += $window.scrollLeft();
                                if (offset.left <= e.pageX) {
                                    offset.bottom = offset.top + root.$trigger.outerHeight();
                                    if (offset.bottom >= e.pageY) {
                                        offset.right = offset.left + root.$trigger.outerWidth();
                                        if (offset.right >= e.pageX) {
                                            // reposition
                                            root.position.call(root.$trigger, root, x, y);
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (target && triggerAction) {
                        root.$trigger.one('contextmenu:hidden', function () {
                            $(target).contextMenu({ x: x, y: y, button: button });
                        });
                    }

                    root.$menu.trigger('contextmenu:hide');
                }, 50);
            },
            // key handled :hover
            keyStop: function (e, opt) {
                if (!opt.isInput) {
                    e.preventDefault();
                }

                e.stopPropagation();
            },
            key: function (e) {

                var opt = {};

                // Only get the data from $currentTrigger if it exists
                if ($currentTrigger) {
                    opt = $currentTrigger.data('contextMenu') || {};
                }

                switch (e.keyCode) {
                    case 9:
                    case 38: // up
                        handle.keyStop(e, opt);
                        // if keyCode is [38 (up)] or [9 (tab) with shift]
                        if (opt.isInput) {
                            if (e.keyCode === 9 && e.shiftKey) {
                                e.preventDefault();
                                opt.$selected && opt.$selected.find('input, textarea, select').blur();
                                opt.$menu.trigger('prevcommand');
                                return;
                            } else if (e.keyCode === 38 && opt.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                                // checkboxes don't capture this key
                                e.preventDefault();
                                return;
                            }
                        } else if (e.keyCode !== 9 || e.shiftKey) {
                            opt.$menu.trigger('prevcommand');
                            return;
                        }
                    // omitting break;
                    // case 9: // tab - reached through omitted break;
                    case 40: // down
                        handle.keyStop(e, opt);
                        if (opt.isInput) {
                            if (e.keyCode === 9) {
                                e.preventDefault();
                                opt.$selected && opt.$selected.find('input, textarea, select').blur();
                                opt.$menu.trigger('nextcommand');
                                return;
                            } else if (e.keyCode === 40 && opt.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                                // checkboxes don't capture this key
                                e.preventDefault();
                                return;
                            }
                        } else {
                            opt.$menu.trigger('nextcommand');
                            return;
                        }
                        break;

                    case 37: // left
                        handle.keyStop(e, opt);
                        if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                            break;
                        }

                        if (!opt.$selected.parent().hasClass('context-menu-root')) {
                            var $parent = opt.$selected.parent().parent();
                            opt.$selected.trigger('contextmenu:blur');
                            opt.$selected = $parent;
                            return;
                        }
                        break;

                    case 39: // right
                        handle.keyStop(e, opt);
                        if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                            break;
                        }

                        var itemdata = opt.$selected.data('contextMenu') || {};
                        if (itemdata.$menu && opt.$selected.hasClass('context-menu-submenu')) {
                            opt.$selected = null;
                            itemdata.$selected = null;
                            itemdata.$menu.trigger('nextcommand');
                            return;
                        }
                        break;

                    case 35: // end
                    case 36: // home
                        if (opt.$selected && opt.$selected.find('input, textarea, select').length) {
                            return;
                        } else {
                            (opt.$selected && opt.$selected.parent() || opt.$menu)
                                .children(':not(.' + opt.classNames.disabled + ', .' + opt.classNames.notSelectable + ')')[e.keyCode === 36 ? 'first' : 'last']()
                                .trigger('contextmenu:focus');
                            e.preventDefault();
                            return;
                        }
                        break;

                    case 13: // enter
                        handle.keyStop(e, opt);
                        if (opt.isInput) {
                            if (opt.$selected && !opt.$selected.is('textarea, select')) {
                                e.preventDefault();
                                return;
                            }
                            break;
                        }
                        if (typeof opt.$selected !== 'undefined' && opt.$selected !== null) {
                            opt.$selected.trigger('mouseup');
                        }
                        return;

                    case 32: // space
                    case 33: // page up
                    case 34: // page down
                        // prevent browser from scrolling down while menu is visible
                        handle.keyStop(e, opt);
                        return;

                    case 27: // esc
                        handle.keyStop(e, opt);
                        opt.$menu.trigger('contextmenu:hide');
                        return;

                    default: // 0-9, a-z
                        var k = (String.fromCharCode(e.keyCode)).toUpperCase();
                        if (opt.accesskeys && opt.accesskeys[k]) {
                            // according to the specs accesskeys must be invoked immediately
                            opt.accesskeys[k].$node.trigger(opt.accesskeys[k].$menu ? 'contextmenu:focus' : 'mouseup');
                            return;
                        }
                        break;
                }
                // pass event to selected item,
                // stop propagation to avoid endless recursion
                e.stopPropagation();
                if (typeof opt.$selected !== 'undefined' && opt.$selected !== null) {
                    opt.$selected.trigger(e);
                }
            },
            // select previous possible command in menu
            prevItem: function (e) {
                e.stopPropagation();
                var opt = $(this).data('contextMenu') || {};
                var root = $(this).data('contextMenuRoot') || {};

                // obtain currently selected menu
                if (opt.$selected) {
                    var $s = opt.$selected;
                    opt = opt.$selected.parent().data('contextMenu') || {};
                    opt.$selected = $s;
                }

                var $children = opt.$menu.children(),
                    $prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev(),
                    $round = $prev;

                // skip disabled
                while ($prev.hasClass(root.classNames.disabled) || $prev.hasClass(root.classNames.notSelectable)) {
                    if ($prev.prev().length) {
                        $prev = $prev.prev();
                    } else {
                        $prev = $children.last();
                    }
                    if ($prev.is($round)) {
                        // break endless loop
                        return;
                    }
                }

                // leave current
                if (opt.$selected) {
                    handle.itemMouseleave.call(opt.$selected.get(0), e);
                }

                // activate next
                handle.itemMouseenter.call($prev.get(0), e);

                // focus input
                var $input = $prev.find('input, textarea, select');
                if ($input.length) {
                    $input.focus();
                }
            },
            // select next possible command in menu
            nextItem: function (e) {
                e.stopPropagation();
                var opt = $(this).data('contextMenu') || {};
                var root = $(this).data('contextMenuRoot') || {};

                // obtain currently selected menu
                if (opt.$selected) {
                    var $s = opt.$selected;
                    opt = opt.$selected.parent().data('contextMenu') || {};
                    opt.$selected = $s;
                }

                var $children = opt.$menu.children(),
                    $next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next(),
                    $round = $next;

                // skip disabled
                while ($next.hasClass(root.classNames.disabled) || $next.hasClass(root.classNames.notSelectable)) {
                    if ($next.next().length) {
                        $next = $next.next();
                    } else {
                        $next = $children.first();
                    }
                    if ($next.is($round)) {
                        // break endless loop
                        return;
                    }
                }

                // leave current
                if (opt.$selected) {
                    handle.itemMouseleave.call(opt.$selected.get(0), e);
                }

                // activate next
                handle.itemMouseenter.call($next.get(0), e);

                // focus input
                var $input = $next.find('input, textarea, select');
                if ($input.length) {
                    $input.focus();
                }
            },
            // flag that we're inside an input so the key handler can act accordingly
            focusInput: function () {
                var $this = $(this).closest('.context-menu-item'),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                root.$selected = opt.$selected = $this;
                root.isInput = opt.isInput = true;
            },
            // flag that we're inside an input so the key handler can act accordingly
            blurInput: function () {
                var $this = $(this).closest('.context-menu-item'),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                root.isInput = opt.isInput = false;
            },
            // :hover on menu
            menuMouseenter: function () {
                var root = $(this).data().contextMenuRoot;
                root.hovering = true;
            },
            // :hover on menu
            menuMouseleave: function (e) {
                var root = $(this).data().contextMenuRoot;
                if (root.$layer && root.$layer.is(e.relatedTarget)) {
                    root.hovering = false;
                }
            },
            // :hover done manually so key handling is possible
            itemMouseenter: function (e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                root.hovering = true;

                // abort if we're re-entering
                if (e && root.$layer && root.$layer.is(e.relatedTarget)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }

                // make sure only one item is selected
                (opt.$menu ? opt : root).$menu
                    .children('.hover').trigger('contextmenu:blur');

                if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
                    opt.$selected = null;
                    return;
                }

                $this.trigger('contextmenu:focus');
            },
            // :hover done manually so key handling is possible
            itemMouseleave: function (e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                if (root !== opt && root.$layer && root.$layer.is(e.relatedTarget)) {
                    if (typeof root.$selected !== 'undefined' && root.$selected !== null) {
                        root.$selected.trigger('contextmenu:blur');
                    }
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    root.$selected = opt.$selected = opt.$node;
                    return;
                }

                $this.trigger('contextmenu:blur');
            },
            // contextMenu item click
            itemClick: function (e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot,
                    key = data.contextMenuKey,
                    callback;

                // abort if the key is unknown or disabled or is a menu
                if (!opt.items[key] || $this.is('.' + root.classNames.disabled + ', .context-menu-submenu, .context-menu-separator, .' + root.classNames.notSelectable)) {
                    return;
                }

                e.preventDefault();
                e.stopImmediatePropagation();

                if ($.isFunction(root.callbacks[key]) && Object.prototype.hasOwnProperty.call(root.callbacks, key)) {
                    // item-specific callback
                    callback = root.callbacks[key];
                } else if ($.isFunction(root.callback)) {
                    // default callback
                    callback = root.callback;
                } else {
                    // no callback, no action
                    return;
                }

                // hide menu if callback doesn't stop that
                if (callback.call(root.$trigger, key, root) !== false) {
                    root.$menu.trigger('contextmenu:hide');
                } else if (root.$menu.parent().length) {
                    op.update.call(root.$trigger, root);
                }
            },
            // ignore click events on input elements
            inputClick: function (e) {
                e.stopImmediatePropagation();
            },
            // hide <menu>
            hideMenu: function (e, data) {
                var root = $(this).data('contextMenuRoot');
                op.hide.call(root.$trigger, root, data && data.force);
            },
            // focus <command>
            focusItem: function (e) {
                e.stopPropagation();
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                $this
                    .addClass([root.classNames.hover, root.classNames.visible].join(' '))
                    .siblings()
                    .removeClass(root.classNames.visible)
                    .filter(root.classNames.hover)
                    .trigger('contextmenu:blur');

                // remember selected
                opt.$selected = root.$selected = $this;

                // position sub-menu - do after show so dumb $.ui.position can keep up
                if (opt.$node) {
                    root.positionSubmenu.call(opt.$node, opt.$menu);
                }
            },
            // blur <command>
            blurItem: function (e) {
                e.stopPropagation();
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                if (opt.autoHide) { // for tablets and touch screens this needs to remain
                    $this.removeClass(root.classNames.visible);
                }
                $this.removeClass(root.classNames.hover);
                opt.$selected = null;
            }
        },
    // operations
        op = {
            show: function (opt, x, y) {
                var $trigger = $(this),
                    css = {};

                // hide any open menus
                $('#context-menu-layer').trigger('mousedown');

                // backreference for callbacks
                opt.$trigger = $trigger;

                // show event
                if (opt.events.show.call($trigger, opt) === false) {
                    $currentTrigger = null;
                    return;
                }

                // create or update context menu
                op.update.call($trigger, opt);

                // position menu
                opt.position.call($trigger, opt, x, y);

                // make sure we're in front
                if (opt.zIndex) {
                    css.zIndex = zindex($trigger) + opt.zIndex;
                }

                // add layer
                op.layer.call(opt.$menu, opt, css.zIndex);

                // adjust sub-menu zIndexes
                opt.$menu.find('ul').css('zIndex', css.zIndex + 1);

                // position and show context menu
                opt.$menu.css(css)[opt.animation.show](opt.animation.duration, function () {
                    $trigger.trigger('contextmenu:visible');
                });
                // make options available and set state
                $trigger
                    .data('contextMenu', opt)
                    .addClass('context-menu-active');

                // register key handler
                $(document).off('keydown.contextMenu').on('keydown.contextMenu', handle.key);
                // register autoHide handler
                if (opt.autoHide) {
                    // mouse position handler
                    $(document).on('mousemove.contextMenuAutoHide', function (e) {
                        // need to capture the offset on mousemove,
                        // since the page might've been scrolled since activation
                        var pos = $trigger.offset();
                        pos.right = pos.left + $trigger.outerWidth();
                        pos.bottom = pos.top + $trigger.outerHeight();

                        if (opt.$layer && !opt.hovering && (!(e.pageX >= pos.left && e.pageX <= pos.right) || !(e.pageY >= pos.top && e.pageY <= pos.bottom))) {
                            // if mouse in menu...
                            opt.$menu.trigger('contextmenu:hide');
                        }
                    });
                }
            },
            hide: function (opt, force) {
                var $trigger = $(this);
                if (!opt) {
                    opt = $trigger.data('contextMenu') || {};
                }

                // hide event
                if (!force && opt.events && opt.events.hide.call($trigger, opt) === false) {
                    return;
                }

                // remove options and revert state
                $trigger
                    .removeData('contextMenu')
                    .removeClass('context-menu-active');

                if (opt.$layer) {
                    // keep layer for a bit so the contextmenu event can be aborted properly by opera
                    setTimeout((function ($layer) {
                        return function () {
                            $layer.remove();
                        };
                    })(opt.$layer), 10);

                    try {
                        delete opt.$layer;
                    } catch (e) {
                        opt.$layer = null;
                    }
                }

                // remove handle
                $currentTrigger = null;
                // remove selected
                opt.$menu.find('.' + opt.classNames.hover).trigger('contextmenu:blur');
                opt.$selected = null;
                // unregister key and mouse handlers
                // $(document).off('.contextMenuAutoHide keydown.contextMenu'); // http://bugs.jquery.com/ticket/10705
                $(document).off('.contextMenuAutoHide').off('keydown.contextMenu');
                // hide menu
                opt.$menu && opt.$menu[opt.animation.hide](opt.animation.duration, function () {
                    // tear down dynamically built menu after animation is completed.
                    if (opt.build) {
                        opt.$menu.remove();
                        $.each(opt, function (key) {
                            switch (key) {
                                case 'ns':
                                case 'selector':
                                case 'build':
                                case 'trigger':
                                    return true;

                                default:
                                    opt[key] = undefined;
                                    try {
                                        delete opt[key];
                                    } catch (e) {
                                    }
                                    return true;
                            }
                        });
                    }

                    setTimeout(function () {
                        $trigger.trigger('contextmenu:hidden');
                    }, 10);
                });
            },
            create: function (opt, root) {
                if (root === undefined) {
                    root = opt;
                }
                // create contextMenu
                opt.$menu = $('<ul class="context-menu-list"></ul>').addClass(opt.className || '').data({
                    'contextMenu': opt,
                    'contextMenuRoot': root
                });

                $.each(['callbacks', 'commands', 'inputs'], function (i, k) {
                    opt[k] = {};
                    if (!root[k]) {
                        root[k] = {};
                    }
                });

                root.accesskeys || (root.accesskeys = {});

                function createNameNode(item) {
                    var $name = $('<span></span>');
                    if (item._accesskey) {
                        if (item._beforeAccesskey) {
                            $name.append(document.createTextNode(item._beforeAccesskey));
                        }
                        $('<span></span>')
                            .addClass('context-menu-accesskey')
                            .text(item._accesskey)
                            .appendTo($name);
                        if (item._afterAccesskey) {
                            $name.append(document.createTextNode(item._afterAccesskey));
                        }
                    } else {
                        $name.text(item.name);
                    }
                    return $name;
                }

                // create contextMenu items
                $.each(opt.items, function (key, item) {
                    var $t = $('<li class="context-menu-item"></li>').addClass(item.className || ''),
                        $label = null,
                        $input = null;

                    // iOS needs to see a click-event bound to an element to actually
                    // have the TouchEvents infrastructure trigger the click event
                    $t.on('click', $.noop);

                    // Make old school string seperator a real item so checks wont be
                    // akward later.
                    if (typeof item === 'string') {
                        item = { type : 'cm_seperator' };
                    }

                    item.$node = $t.data({
                        'contextMenu': opt,
                        'contextMenuRoot': root,
                        'contextMenuKey': key
                    });

                    // register accesskey
                    // NOTE: the accesskey attribute should be applicable to any element, but Safari5 and Chrome13 still can't do that
                    if (typeof item.accesskey !== 'undefined') {
                        var aks = splitAccesskey(item.accesskey);
                        for (var i = 0, ak; ak = aks[i]; i++) {
                            if (!root.accesskeys[ak]) {
                                root.accesskeys[ak] = item;
                                var matched = item.name.match(new RegExp('^(.*?)(' + ak + ')(.*)$', 'i'));
                                if (matched) {
                                    item._beforeAccesskey = matched[1];
                                    item._accesskey = matched[2];
                                    item._afterAccesskey = matched[3];
                                }
                                break;
                            }
                        }
                    }

                    if (item.type && types[item.type]) {
                        // run custom type handler
                        types[item.type].call($t, item, opt, root);
                        // register commands
                        $.each([opt, root], function (i, k) {
                            k.commands[key] = item;
                            if ($.isFunction(item.callback)) {
                                k.callbacks[key] = item.callback;
                            }
                        });
                    } else {
                        // add label for input
                        if (item.type === 'cm_seperator') {
                            $t.addClass('context-menu-separator ' + root.classNames.notSelectable);
                        } else if (item.type === 'html') {
                            $t.addClass('context-menu-html ' + root.classNames.notSelectable);
                        } else if (item.type) {
                            $label = $('<label></label>').appendTo($t);
                            createNameNode(item).appendTo($label);

                            $t.addClass('context-menu-input');
                            opt.hasTypes = true;
                            $.each([opt, root], function (i, k) {
                                k.commands[key] = item;
                                k.inputs[key] = item;
                            });
                        } else if (item.items) {
                            item.type = 'sub';
                        }

                        switch (item.type) {
                            case 'seperator':
                                break;

                            case 'text':
                                $input = $('<input type="text" value="1" name="" value="">')
                                    .attr('name', 'context-menu-input-' + key)
                                    .val(item.value || '')
                                    .appendTo($label);
                                break;

                            case 'textarea':
                                $input = $('<textarea name=""></textarea>')
                                    .attr('name', 'context-menu-input-' + key)
                                    .val(item.value || '')
                                    .appendTo($label);

                                if (item.height) {
                                    $input.height(item.height);
                                }
                                break;

                            case 'checkbox':
                                $input = $('<input type="checkbox" value="1" name="" value="">')
                                    .attr('name', 'context-menu-input-' + key)
                                    .val(item.value || '')
                                    .prop('checked', !!item.selected)
                                    .prependTo($label);
                                break;

                            case 'radio':
                                $input = $('<input type="radio" value="1" name="" value="">')
                                    .attr('name', 'context-menu-input-' + item.radio)
                                    .val(item.value || '')
                                    .prop('checked', !!item.selected)
                                    .prependTo($label);
                                break;

                            case 'select':
                                $input = $('<select name="">')
                                    .attr('name', 'context-menu-input-' + key)
                                    .appendTo($label);
                                if (item.options) {
                                    $.each(item.options, function (value, text) {
                                        $('<option></option>').val(value).text(text).appendTo($input);
                                    });
                                    $input.val(item.selected);
                                }
                                break;

                            case 'sub':
                                createNameNode(item).appendTo($t);

                                item.appendTo = item.$node;
                                op.create(item, root);
                                $t.data('contextMenu', item).addClass('context-menu-submenu');
                                item.callback = null;
                                break;

                            case 'html':
                                $(item.html).appendTo($t);
                                break;

                            default:
                                $.each([opt, root], function (i, k) {
                                    k.commands[key] = item;
                                    if ($.isFunction(item.callback)) {
                                        k.callbacks[key] = item.callback;
                                    }
                                });
                                createNameNode(item).appendTo($t);
                                break;
                        }

                        // disable key listener in <input>
                        if (item.type && item.type !== 'sub' && item.type !== 'html' && item.type !== 'cm_seperator') {
                            $input
                                .on('focus', handle.focusInput)
                                .on('blur', handle.blurInput);

                            if (item.events) {
                                $input.on(item.events, opt);
                            }
                        }

                        // add icons
                        if (item.icon) {
                            if ($.isFunction(item.icon)) {
                                item._icon = item.icon.call(this, this, $t, key, item);
                            } else {
                                item._icon = root.classNames.icon + ' ' + root.classNames.icon + '-' + item.icon;

                            }
                            $t.addClass(item._icon);
                        }
                    }

                    // cache contained elements
                    item.$input = $input;
                    item.$label = $label;

                    // attach item to menu
                    $t.appendTo(opt.$menu);

                    // Disable text selection
                    if (!opt.hasTypes && $.support.eventSelectstart) {
                        // browsers support user-select: none,
                        // IE has a special event for text-selection
                        // browsers supporting neither will not be preventing text-selection
                        $t.on('selectstart.disableTextSelect', handle.abortevent);
                    }
                });
                // attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
                if (!opt.$node) {
                    opt.$menu.css('display', 'none').addClass('context-menu-root');
                }
                opt.$menu.appendTo(opt.appendTo || document.body);
            },
            resize: function ($menu, nested) {
                // determine widths of submenus, as CSS won't grow them automatically
                // position:absolute within position:absolute; min-width:100; max-width:200; results in width: 100;
                // kinda sucks hard...

                // determine width of absolutely positioned element
                $menu.css({position: 'absolute', display: 'block'});
                // don't apply yet, because that would break nested elements' widths
                $menu.data('width', Math.ceil($menu.width()));
                // reset styles so they allow nested elements to grow/shrink naturally
                $menu.css({
                    position: 'static',
                    minWidth: '0px',
                    maxWidth: '100000px'
                });
                // identify width of nested menus
                $menu.find('> li > ul').each(function () {
                    op.resize($(this), true);
                });
                // reset and apply changes in the end because nested
                // elements' widths wouldn't be calculatable otherwise
                if (!nested) {
                    $menu.find('ul').addBack().css({
                        position: '',
                        display: '',
                        minWidth: '',
                        maxWidth: ''
                    }).width(function () {
                        return $(this).data('width');
                    });
                }
            },
            update: function (opt, root) {
                var $trigger = this;
                if (root === undefined) {
                    root = opt;
                    op.resize(opt.$menu);
                }
                // re-check disabled for each item
                opt.$menu.children().each(function () {
                    var $item = $(this),
                        key = $item.data('contextMenuKey'),
                        item = opt.items[key],
                        disabled = ($.isFunction(item.disabled) && item.disabled.call($trigger, key, root)) || item.disabled === true,
                        visible;
                    if ($.isFunction(item.visible)) {
                        visible = item.visible.call($trigger, key, root);
                    } else if (typeof item.visible !== 'undefined') {
                        visible = item.visible === true;
                    } else {
                        visible = true;
                    }
                    $item[visible ? 'show' : 'hide']();

                    // dis- / enable item
                    $item[disabled ? 'addClass' : 'removeClass'](root.classNames.disabled);

                    if ($.isFunction(item.icon)) {
                        $item.removeClass(item._icon);
                        item._icon = item.icon.call(this, $trigger, $item, key, item);
                        $item.addClass(item._icon);
                    }

                    if (item.type) {
                        // dis- / enable input elements
                        $item.find('input, select, textarea').prop('disabled', disabled);

                        // update input states
                        switch (item.type) {
                            case 'text':
                            case 'textarea':
                                item.$input.val(item.value || '');
                                break;

                            case 'checkbox':
                            case 'radio':
                                item.$input.val(item.value || '').prop('checked', !!item.selected);
                                break;

                            case 'select':
                                item.$input.val(item.selected || '');
                                break;
                        }
                    }

                    if (item.$menu) {
                        // update sub-menu
                        op.update.call($trigger, item, root);
                    }
                });
            },
            layer: function (opt, zIndex) {
                // add transparent layer for click area
                // filter and background for Internet Explorer, Issue #23
                var $layer = opt.$layer = $('<div id="context-menu-layer" style="position:fixed; z-index:' + zIndex + '; top:0; left:0; opacity: 0; filter: alpha(opacity=0); background-color: #000;"></div>')
                    .css({height: $win.height(), width: $win.width(), display: 'block'})
                    .data('contextMenuRoot', opt)
                    .insertBefore(this)
                    .on('contextmenu', handle.abortevent)
                    .on('mousedown', handle.layerClick);

                // IE6 doesn't know position:fixed;
                if (document.body.style.maxWidth === undefined) { // IE6 doesn't support maxWidth
                    $layer.css({
                        'position': 'absolute',
                        'height': $(document).height()
                    });
                }

                return $layer;
            }
        };

    // split accesskey according to http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key
    function splitAccesskey(val) {
        var t = val.split(/\s+/),
            keys = [];

        for (var i = 0, k; k = t[i]; i++) {
            k = k.charAt(0).toUpperCase(); // first character only
            // theoretically non-accessible characters should be ignored, but different systems, different keyboard layouts, ... screw it.
            // a map to look up already used access keys would be nice
            keys.push(k);
        }

        return keys;
    }

// handle contextMenu triggers
    $.fn.contextMenu = function (operation) {
        var $t = this, $o = operation;
        if (this.length > 0) {  // this is not a build on demand menu
            if (operation === undefined) {
                this.first().trigger('contextmenu');
            } else if (operation.x !== undefined && operation.y !== undefined) {
                this.first().trigger($.Event('contextmenu', { pageX: operation.x, pageY: operation.y, mouseButton: operation.button }));
            } else if (operation === 'hide') {
                var $menu = this.first().data('contextMenu') ? this.first().data('contextMenu').$menu : null;
                $menu && $menu.trigger('contextmenu:hide');
            } else if (operation === 'destroy') {
                $.contextMenu('destroy', {context: this});
            } else if ($.isPlainObject(operation)) {
                operation.context = this;
                $.contextMenu('create', operation);
            } else if (operation) {
                this.removeClass('context-menu-disabled');
            } else if (!operation) {
                this.addClass('context-menu-disabled');
            }
        } else {
            $.each(menus, function () {
                if (this.selector === $t.selector) {
                    $o.data = this;

                    $.extend($o.data, {trigger: 'demand'});
                }
            });

            handle.contextmenu.call($o.target, $o);
        }

        return this;
    };

    // manage contextMenu instances
    $.contextMenu = function (operation, options) {
        if (typeof operation !== 'string') {
            options = operation;
            operation = 'create';
        }

        if (typeof options === 'string') {
            options = {selector: options};
        } else if (options === undefined) {
            options = {};
        }

        // merge with default options
        var o = $.extend(true, {}, defaults, options || {});
        var $document = $(document);
        var $context = $document;
        var _hasContext = false;

        if (!o.context || !o.context.length) {
            o.context = document;
        } else {
            // you never know what they throw at you...
            $context = $(o.context).first();
            o.context = $context.get(0);
            _hasContext = o.context !== document;
        }

        switch (operation) {
            case 'create':
                // no selector no joy
                if (!o.selector) {
                    throw new Error('No selector specified');
                }
                // make sure internal classes are not bound to
                if (o.selector.match(/.context-menu-(list|item|input)($|\s)/)) {
                    throw new Error('Cannot bind to selector "' + o.selector + '" as it contains a reserved className');
                }
                if (!o.build && (!o.items || $.isEmptyObject(o.items))) {
                    throw new Error('No Items specified');
                }
                counter++;
                o.ns = '.contextMenu' + counter;
                if (!_hasContext) {
                    namespaces[o.selector] = o.ns;
                }
                menus[o.ns] = o;

                // default to right click
                if (!o.trigger) {
                    o.trigger = 'right';
                }

                if (!initialized) {
                    // make sure item click is registered first
                    $document
                        .on({
                            'contextmenu:hide.contextMenu': handle.hideMenu,
                            'prevcommand.contextMenu': handle.prevItem,
                            'nextcommand.contextMenu': handle.nextItem,
                            'contextmenu.contextMenu': handle.abortevent,
                            'mouseenter.contextMenu': handle.menuMouseenter,
                            'mouseleave.contextMenu': handle.menuMouseleave
                        }, '.context-menu-list')
                        .on('mouseup.contextMenu', '.context-menu-input', handle.inputClick)
                        .on({
                            'mouseup.contextMenu': handle.itemClick,
                            'contextmenu:focus.contextMenu': handle.focusItem,
                            'contextmenu:blur.contextMenu': handle.blurItem,
                            'contextmenu.contextMenu': handle.abortevent,
                            'mouseenter.contextMenu': handle.itemMouseenter,
                            'mouseleave.contextMenu': handle.itemMouseleave
                        }, '.context-menu-item');

                    initialized = true;
                }

                // engage native contextmenu event
                $context
                    .on('contextmenu' + o.ns, o.selector, o, handle.contextmenu);

                if (_hasContext) {
                    // add remove hook, just in case
                    $context.on('remove' + o.ns, function () {
                        $(this).contextMenu('destroy');
                    });
                }

                switch (o.trigger) {
                    case 'hover':
                        $context
                            .on('mouseenter' + o.ns, o.selector, o, handle.mouseenter)
                            .on('mouseleave' + o.ns, o.selector, o, handle.mouseleave);
                        break;

                    case 'left':
                        $context.on('click' + o.ns, o.selector, o, handle.click);
                        break;
                    /*
                     default:
                     // http://www.quirksmode.org/dom/events/contextmenu.html
                     $document
                     .on('mousedown' + o.ns, o.selector, o, handle.mousedown)
                     .on('mouseup' + o.ns, o.selector, o, handle.mouseup);
                     break;
                     */
                }

                // create menu
                if (!o.build) {
                    op.create(o);
                }
                break;

            case 'destroy':
                var $visibleMenu;
                if (_hasContext) {
                    // get proper options
                    var context = o.context;
                    $.each(menus, function (ns, o) {
                        if (o.context !== context) {
                            return true;
                        }

                        $visibleMenu = $('.context-menu-list').filter(':visible');
                        if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is($(o.context).find(o.selector))) {
                            $visibleMenu.trigger('contextmenu:hide', {force: true});
                        }

                        try {
                            if (menus[o.ns].$menu) {
                                menus[o.ns].$menu.remove();
                            }

                            delete menus[o.ns];
                        } catch (e) {
                            menus[o.ns] = null;
                        }

                        $(o.context).off(o.ns);

                        return true;
                    });
                } else if (!o.selector) {
                    $document.off('.contextMenu .contextMenuAutoHide');
                    $.each(menus, function (ns, o) {
                        $(o.context).off(o.ns);
                    });

                    namespaces = {};
                    menus = {};
                    counter = 0;
                    initialized = false;

                    $('#context-menu-layer, .context-menu-list').remove();
                } else if (namespaces[o.selector]) {
                    $visibleMenu = $('.context-menu-list').filter(':visible');
                    if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is(o.selector)) {
                        $visibleMenu.trigger('contextmenu:hide', {force: true});
                    }

                    try {
                        if (menus[namespaces[o.selector]].$menu) {
                            menus[namespaces[o.selector]].$menu.remove();
                        }

                        delete menus[namespaces[o.selector]];
                    } catch (e) {
                        menus[namespaces[o.selector]] = null;
                    }

                    $document.off(namespaces[o.selector]);
                }
                break;

            case 'html5':
                // if <command> or <menuitem> are not handled by the browser,
                // or options was a bool true,
                // initialize $.contextMenu for them
                if ((!$.support.htmlCommand && !$.support.htmlMenuitem) || (typeof options === 'boolean' && options)) {
                    $('menu[type="context"]').each(function () {
                        if (this.id) {
                            $.contextMenu({
                                selector: '[contextmenu=' + this.id + ']',
                                items: $.contextMenu.fromMenu(this)
                            });
                        }
                    }).css('display', 'none');
                }
                break;

            default:
                throw new Error('Unknown operation "' + operation + '"');
        }

        return this;
    };

// import values into <input> commands
    $.contextMenu.setInputValues = function (opt, data) {
        if (data === undefined) {
            data = {};
        }

        $.each(opt.inputs, function (key, item) {
            switch (item.type) {
                case 'text':
                case 'textarea':
                    item.value = data[key] || '';
                    break;

                case 'checkbox':
                    item.selected = data[key] ? true : false;
                    break;

                case 'radio':
                    item.selected = (data[item.radio] || '') === item.value;
                    break;

                case 'select':
                    item.selected = data[key] || '';
                    break;
            }
        });
    };

// export values from <input> commands
    $.contextMenu.getInputValues = function (opt, data) {
        if (data === undefined) {
            data = {};
        }

        $.each(opt.inputs, function (key, item) {
            switch (item.type) {
                case 'text':
                case 'textarea':
                case 'select':
                    data[key] = item.$input.val();
                    break;

                case 'checkbox':
                    data[key] = item.$input.prop('checked');
                    break;

                case 'radio':
                    if (item.$input.prop('checked')) {
                        data[item.radio] = item.value;
                    }
                    break;
            }
        });

        return data;
    };

// find <label for="xyz">
    function inputLabel(node) {
        return (node.id && $('label[for="' + node.id + '"]').val()) || node.name;
    }

// convert <menu> to items object
    function menuChildren(items, $children, counter) {
        if (!counter) {
            counter = 0;
        }

        $children.each(function () {
            var $node = $(this),
                node = this,
                nodeName = this.nodeName.toLowerCase(),
                label,
                item;

            // extract <label><input>
            if (nodeName === 'label' && $node.find('input, textarea, select').length) {
                label = $node.text();
                $node = $node.children().first();
                node = $node.get(0);
                nodeName = node.nodeName.toLowerCase();
            }

            /*
             * <menu> accepts flow-content as children. that means <embed>, <canvas> and such are valid menu items.
             * Not being the sadistic kind, $.contextMenu only accepts:
             * <command>, <menuitem>, <hr>, <span>, <p> <input [text, radio, checkbox]>, <textarea>, <select> and of course <menu>.
             * Everything else will be imported as an html node, which is not interfaced with contextMenu.
             */

            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#concept-command
            switch (nodeName) {
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#the-menu-element
                case 'menu':
                    item = {name: $node.attr('label'), items: {}};
                    counter = menuChildren(item.items, $node.children(), counter);
                    break;

                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-a-element-to-define-a-command
                case 'a':
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-button-element-to-define-a-command
                case 'button':
                    item = {
                        name: $node.text(),
                        disabled: !!$node.attr('disabled'),
                        callback: (function () {
                            return function () {
                                $node.click();
                            };
                        })()
                    };
                    break;

                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-command-element-to-define-a-command

                case 'menuitem':
                case 'command':
                    switch ($node.attr('type')) {
                        case undefined:
                        case 'command':
                        case 'menuitem':
                            item = {
                                name: $node.attr('label'),
                                disabled: !!$node.attr('disabled'),
                                icon: $node.attr('icon'),
                                callback: (function () {
                                    return function () {
                                        $node.click();
                                    };
                                })()
                            };
                            break;

                        case 'checkbox':
                            item = {
                                type: 'checkbox',
                                disabled: !!$node.attr('disabled'),
                                name: $node.attr('label'),
                                selected: !!$node.attr('checked')
                            };
                            break;
                        case 'radio':
                            item = {
                                type: 'radio',
                                disabled: !!$node.attr('disabled'),
                                name: $node.attr('label'),
                                radio: $node.attr('radiogroup'),
                                value: $node.attr('id'),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        default:
                            item = undefined;
                    }
                    break;

                case 'hr':
                    item = '-------';
                    break;

                case 'input':
                    switch ($node.attr('type')) {
                        case 'text':
                            item = {
                                type: 'text',
                                name: label || inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                value: $node.val()
                            };
                            break;

                        case 'checkbox':
                            item = {
                                type: 'checkbox',
                                name: label || inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        case 'radio':
                            item = {
                                type: 'radio',
                                name: label || inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                radio: !!$node.attr('name'),
                                value: $node.val(),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        default:
                            item = undefined;
                            break;
                    }
                    break;

                case 'select':
                    item = {
                        type: 'select',
                        name: label || inputLabel(node),
                        disabled: !!$node.attr('disabled'),
                        selected: $node.val(),
                        options: {}
                    };
                    $node.children().each(function () {
                        item.options[this.value] = $(this).text();
                    });
                    break;

                case 'textarea':
                    item = {
                        type: 'textarea',
                        name: label || inputLabel(node),
                        disabled: !!$node.attr('disabled'),
                        value: $node.val()
                    };
                    break;

                case 'label':
                    break;

                default:
                    item = {type: 'html', html: $node.clone(true)};
                    break;
            }

            if (item) {
                counter++;
                items['key' + counter] = item;
            }
        });

        return counter;
    }

// convert html5 menu
    $.contextMenu.fromMenu = function (element) {
        var $this = $(element),
            items = {};

        menuChildren(items, $this.children());

        return items;
    };

// make defaults accessible
    $.contextMenu.defaults = defaults;
    $.contextMenu.types = types;
// export internal functions - undocumented, for hacking only!
    $.contextMenu.handle = handle;
    $.contextMenu.op = op;
    $.contextMenu.menus = menus;


});

/* filterwizard Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *
*/
/*global jQuery:true NB$:true */
(function($) {
    var $str        = "NB$" in window ? "NB$" : "jQuery";
    var V_OBJ = $.extend({},$.ui.view.prototype,{
        _create: function() {
            $.ui.view.prototype._create.call(this);
            var self = this;
            self.element.addClass("filterWizard");
            self._model = null;
            self._render();
        },
        _defaultHandler: function(evt){
            this._render();
        },
        _render: function(){
            var self=this;
            self.element.empty();

            var $h = $("<h3>Filter Threads&hellip;</h3>");
            var $e = $("<p>").addClass("error-message");
            var $p = $("<p>");

            self.element.append($h).append($e).append($p);

            // Basic Idea:
            // The controls for these text fields are:
            //  - $n : number (raw or %, according to $r)
            //  - $r : ratio? (either "percentage" or "total")
            //  - $filterType : type of filter ["random", "reply", "students", "longest"]

            var $n = $("<input>").attr("type", "text").addClass("filter-number").val(10);
            var $r = $("<select>")
                .append("<option value='threads'>threads</option>")
                .append("<option value='percent'>% of all threads</option>");
            var $filterType = $("<select>")
                .append("<option value='reply'>that have the most responses</option>")
                .append("<option value='students'>that have the most student participation</option>")
                .append("<option value='longest'>that have the longest initial post</option>")
                .append("<option value='random'>randomly</option>");
            var $go = $("<input>").attr("type", "button").attr("value", "Go");
            var $cancel = $("<input>").attr("type", "button").attr("value", "Cancel");

            $p.append("Show me&nbsp;").
                append($n).append("&nbsp;").
                append($r).append("&nbsp;").
                append($filterType).append(".&nbsp;").
                append($go).
                append($cancel);

            $cancel.click(function() {
                if (self.options.callbacks.onCancel) {
                    self.options.callbacks.onCancel();
                }
            });

            $go.click(function() {
                // Step 1: validate [formatting + n/r compatibility]
                var n = parseInt($n.val(), 10);
                var r = $r.val();
                var filterType = $filterType.val();

                $(".input-error", self.element).removeClass("input-error");

                if (isNaN(n) || n < 0) {
                    $n.addClass("input-error");
                    $e.text("You must enter a valid number or percentage of posts.");
                    return;
                }

                if (r === "percent") {
                    if (n > 100) {
                        $n.addClass("input-error");
                        $e.text("You must enter a valid percentage between 0 and 100.");
                        return;
                     }
                } else if (r === "threads") {
                    // any thread-specific checking
                } else {
                    $r.addClass("input-error");
                    $e.text("You must choose a valid quantity.");
                    return;
                }

                // Step 2: fire event OR callback
                if (self.options.callbacks.fireEvent) {
                    self.options.callbacks.fireEvent(n, r, filterType);
                } else {
                    $.concierge.trigger({
                        type: "filter_threads",
                        value: {
                            n: n,
                            r: r,
                            type: filterType
                        }
                    });
                }

                // Step 3: call callback if set
                if (self.options.callbacks.onOk) {
                    self.options.callbacks.onOk();
                }

            });

        },
        set_model: function(model){
            var self=this;
            self._model = model;
            model.register(
                $.ui.view.prototype.get_adapter.call(this),
                {
                    file: null,
                    folder: null,
                    file_stats: null,
                    replyrating: null,
                    question: null
                });

        },
        update: function(action, payload, items_fieldname){

        }
    });

    $.widget("ui.filterWizard",V_OBJ );
    $.ui.filterWizard.prototype.options = {
	listens: {
	},
	admin: false,
        callbacks: {
            onOk: null,
            fireEvent: null,
            onCancel: null
        }
    };
})(jQuery);

/* notepaneView Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *

 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true NB$:true*/
(function($) {
    var $str = "NB$" in window ? "NB$" : "jQuery";
    var V_OBJ = $.extend({},$.ui.view.prototype,{
        _f_location_seen: function(id_location){
            var self = this;
            return function(){
                var m = self._model;
                var o = m.get("comment", {ID_location: id_location}).items;
                var i;
                var new_seen = {};
                for (i in o){
                    if (!(i in m.o.seen)){
                        new_seen[i] = {id: i, id_location: id_location};
                        $.concierge.logHistory("seen", i);
                    }
                }
                self._model.add("seen", new_seen);
            };
        },
        _create: function() {
            $.ui.view.prototype._create.call(this);
            var self = this;
            self._pages =  {}; //pages that have been rendered
            self._maxpage =  0; //last (i.e. max page number of) page that has been rendered
            self._page = null; 
            self._scrollTimerID = null;
            self._seenTimerID = null;
            self._id_location = null; //location_id of selected thread
            self._is_first_stroke = true;
            self._rendered = false;
            self._filters = {me: false, star: false, question: false, advanced: false};
            self.QUESTION = null;
            self.STAR = null;
            self._selected_locs = {all: [], top: []};
            self._mode_select = false;
            self._export_id = null;

            self.locs = null;
            self.element.addClass("notepaneView");

            if (window.location.hash !== "") {
                var match = window.location.hash.match(/#(.*[?&])?export_to=([0-9]+)(\?|&|$)/);
                if (match) {
                    self._export_id = parseInt( match[2], 10);
                    if (isNaN(self._export_id) === false) {
                        self._mode_select = true;
                    }
                }
            }

            if (self._mode_select) {
                self.element.addClass("mode-select");
            }

            var $header = $("<div>").addClass("notepaneView-header");
            var $filters = $("<div>").addClass("filter-controls");
            var $filter_me = $("<a>")
                .addClass("filter")
                .attr("title", "toggle filter: threads I participated in")
                .attr("action", "me")
                .html("<span>me</span><div class='filter-count'>0</div>")
                .click(function() {
                    $.concierge.trigger({
                        type: 'filter_toggle',
                        value: 'me'
                    });
                });
            var $filter_star = $("<a>")
                .addClass("filter")
                .attr("title", "toggle filter: starred threads")
                .attr("action", "star")
                .html("<span><div class='nbicon staricon' /></span><div class='filter-count'>...</div>")
                .click(function() {
                    $.concierge.trigger({
                        type: 'filter_toggle',
                        value: 'star'
                    });
                });
            var $filter_question = $("<a>")
                .addClass("filter")
                .attr("title", "toggle filter: threads with standing questions")
                .attr("action", "question")
                .html("<span><div class='nbicon questionicon' /></span><div class='filter-count'>...</div>")
                .click(function() {
                    $.concierge.trigger({
                        type: 'filter_toggle',
                        value: 'question'
                    });
                });
            var $filter_advanced = $("<a>")
                .addClass("filter")
                .attr("title", "toggle filter: toggle by advanced features")
                .attr("action", "advanced")
                .html("<div class='filter-count'>more filters</div>")
                .click(function() {
                    if ($(this).hasClass("active")) {
                        $(this).removeClass("active");
                        self._filters.advanced = false;
                        self._page = 1;
                        self._pages = {};
                        self._maxpage = 0;
                        self._render(true);
                    } else {
                        $wizard.dialog("open");
                    }
                });

            var $filtered_message = $("<span class='filter-msg-filtered'><span class='n_filtered'>0</span> threads out of <span class='n_total'>0</span></span>");
            var $unfiltered_message = $("<span class='filter-msg-unfiltered'><span class='n_unfiltered'>0</span> threads</span>");

            var $selected_threads = $("<div>").
                addClass("notepaneView-selected").
                html("<div class='action-bar'><span class='selected-count'>0</span> selected threads for transfer.</div>");

            var $notepaneView_pages = $("<div>").addClass("notepaneView-pages");

            var $export_button = $("<input type=\"button\" value=\"Transfer\">").
                click(function() {
                    var to_export = [];
                    if (self._selected_locs.all.length) {
                        to_export.push("all");
                    }
                    if (self._selected_locs.top.length) {
                        to_export.push("top");
                    }

                    if (to_export.length === 0) {
                        return;
                    }

                    var export_function = function(type) {
                        if (self._mode_select) {
                            $.concierge.get_component("bulk_import_annotations")({
                                locs_array: self._selected_locs[type],
                                from_source_id: self._id_source,
                                to_source_id: self._export_id,
                                import_type: type
                            }, function(import_result) {
                                self._selected_locs[type] = [];

                                if (to_export.length) {
                                    export_function(to_export.pop());
                                    return;
                                }

                                self._mode_select = false;
                                self.element.removeClass("mode-select");
                                self._pages = {};
                                self._render.call(self, true);
                            });

                        }
                    };

                    export_function(to_export.pop());
                }).attr("disabled", "disabled");

            var $select_bar = $("<div>").addClass("select-bar").
                html("<div class='labels'>" +
                     "<abbr title='Import Top Comment for Selected Thread'>Top</abbr>" +
                     "<abbr title='Import Entire Selected Thread'>Thread</abbr>" +
                     "</div>" +
                     "<div class='select-all'>" +
                     "<span class='selectors'></span>" +
                     "<label>Select All</label>" +
                     "</div>");

            var recalculate_selected = function() {
                var count = self._selected_locs.all.length +
                    self._selected_locs.top.length;

                $(".selected-count", self.element).
                    text(count);
                
                $export_button[0].disabled = (count === 0);
            };

            var select_all = function(mode_select, what) {
                var select_what;
                var deselect_what;
                var other;
                var loc_id;
                var other_index;

                var checkme = function() {
                    this.checked = true;
                };

                var uncheckme = function() {
                    this.checked = false;
                };

                if (what === "all") {
                    other = "top";
                } else if (what === "top") {
                    other = "all";
                } else {
                    return;
                }

                if (mode_select) {
                    select_what = self._selected_locs[what];
                    deselect_what = self._selected_locs[other];

                    for (loc_id in self.locs.values("ID")) {
                        loc_id = parseInt(loc_id, 10);

                        // is it already selected? if so, do nothing
                        if (select_what.indexOf(loc_id) > -1) {
                            continue;
                        }
                        // we should select it, make sure other is unselected
                        other_index = deselect_what.indexOf(loc_id);
                        if (other_index > -1) {
                            deselect_what.splice(other_index, 1);
                            $("input[type=checkbox][data-type=" + other+ "][data-loc=" + loc_id + "]").each(uncheckme);
                        }
                        // now select the checkbox, if it exists, and add it
                        $("input[type=checkbox][data-type="+what+"][data-loc="+loc_id+"]").each(checkme);
                        select_what.push(loc_id);
                    }

                } else {
                    deselect_what = self._selected_locs[what];
                    for (loc_id in self.locs.values("ID")) {
                        loc_id = parseInt(loc_id, 10);
                        var my_index = deselect_what.indexOf(loc_id);
                        if (my_index > -1) {
                            deselect_what.splice(my_index, 1);
                            $("input[type=checkbox][data-type="+what+"][data-loc="+loc_id+"]").each(uncheckme);
                        }
                    }

                }

                recalculate_selected();

            };

            var $selectall_top = $("<input type='checkbox'>").
                change(function() {
                    select_all(this.checked, "top");

                    if (this.checked){
                        var o = $selectall_thread[0];
                        if (o.checked) {
                            o.indeterminate = true;
                        }
                    }

                });

            var $selectall_thread = $("<input type='checkbox'>").
                change(function() {
                    select_all(this.checked, "all");

                    if (this.checked) {
                        var o = $selectall_top[0];
                        if (o.checked) {
                            o.indeterminate = true;
                        }
                    }

                });

            $select_bar.find('.selectors').
                append( $("<span>").append($selectall_top) ).
                append( $("<span>").append($selectall_thread) );

            $selected_threads.find('.action-bar').append($export_button);
            $selected_threads.append($select_bar);

            $filters.append($filter_me).append($filter_star).append($filter_question).append($filter_advanced);
            $header.append($filters).append($filtered_message).append($unfiltered_message);
            self.element.append($header).append($selected_threads).append($notepaneView_pages);

            // Declare NotepaneView.Doc ContextMenu
            $.contextMenu({
                selector: '.location-lens',
                build: function ($trigger, event) {
                    var item_object = self._context_build.call(self, $trigger, event);
                    return {
                        callback: function (key, options) {
                            self._context_callback.call(self, this, key, options);
                        },
                        items: item_object
                    };
                }
            });

            $("body").append(
                $("<div>").attr("id", "filterWizardDialog")
            );

            var $wizard = $("#filterWizardDialog");
            $wizard.filterWizard({
                admin: true, // TODO: properly populate this value
                callbacks: {
                    onOk: function() { $wizard.dialog("close"); },
                    onCancel: function() { $wizard.dialog("close"); }
                }
            }).dialog({
                width: 800,
                height: 200,
                modal: true,
                autoOpen: false
            });

            $("#contextmenu_notepaneView").bind("beforeShow", function(event, el) {
                var id_item = el.closest("div.location-lens").attr("id_item");
                var m = self._model;
                var c = m.o.comment[id_item];
                $("li", this).show();
            });

            self.element.on("change", ".location-lens .selectors input[type=checkbox]", function() {

                var loc_id = parseInt($(this).attr("data-loc"), 10);
                var select_type = $(this).attr("data-type");
                var other_type;
                var remove_type;

                if (select_type === "top") {
                    other_type = "all";
                } else if (select_type === "all") {
                    other_type = "top";
                } else {
                    return;
                }

                var add_array;
                var remove_array;

                if (this.checked) {
                    add_array = self._selected_locs[select_type];
                    remove_array = self._selected_locs[other_type];
                    remove_type = other_type;
                } else {
                    remove_array = self._selected_locs[select_type];
                    remove_type = select_type;
                }

                add_array.push(loc_id);

                if (remove_array) {
                    var index = remove_array.indexOf(loc_id);
                    if (index > -1) {
                        remove_array.splice(index, 1);
                        $("input[type=checkbox][data-loc="+loc_id+"][data-type="+remove_type+"]")[0].checked = false;
                    }
                }

                recalculate_selected();

            });

        },
        _defaultHandler: function(evt){
            var self=this;
            if (self._id_source === $.concierge.get_state("file")){
                var sel, container, delta_top, delta_bottom, o, h, H, scrollby;
                switch (evt.type){
                case "page":
                    if (self._page !== parseInt(evt.value, 10)){
                        self._page =  parseInt(evt.value, 10);        
                        self._render();

                        container = $("div.notepaneView-pages", self.element);
                        sel = $("div.notepaneView-comments[page="+evt.value+"]",self.element);
                        delta_top = sel.offset().top - container.offset().top;
                        container.stop(true).animate({scrollTop: (delta_top>0?"+="+delta_top:"-="+(-delta_top))  + 'px'}, 300); 
                    }
                    break;
                case "filter_threads":
                    $.concierge.get_component("advanced_filter")({
                        id_source: self._id_source,
                        n: evt.value.n,
                        r: evt.value.r,
                        type: evt.value.type
                    }, function(result) {
                        self._filters.advanced = result.locs;
                        self._page = 1;
                        self._pages = {};
                        self._maxpage = 0;
                        self._render(true);
                    });

                    break;
                case "filter_toggle": 
                    if (evt.value in self._filters){
                        self._filters[evt.value] = (!(self._filters[evt.value]));
                        self._page =  1;
                        self._pages = {};
                        self._maxpage = 0;
                        self._render(true);
                    }
                    break;
                case "note_hover": 
                    $("div.location-lens[id_item="+evt.value+"]", self.element).addClass("hovered");
                    break;
                case "note_out": 
                    $("div.location-lens[id_item="+evt.value+"]", self.element).removeClass("hovered");        
                    break;
                case "warn_page_change": 
                    o = self._model.o.location[evt.value];
                    var page_summary;
                    if (o.page > self._page){
                        self._render_one(o.page);
                        page_summary = o.page;
                    }
                    else{
                        page_summary = self._page;
                    }
                    sel = $("div.location-pagesummary[page="+page_summary+"]", self.element).addClass("selected");
                    container = $("div.notepaneView-pages", self.element);
                    if (sel.length>0){

                        h = sel.height() ;
                        H = container.height();
                        delta_top = sel.offset().top - container.offset().top;
                        delta_bottom = delta_top + h - H;
                        if (delta_top > 0){ //selected note is not too high
                            if (delta_bottom > 0) {//but it's too low... scroll down
                                //delta_bottom is how much to scroll so that bottom of lens coincides with bottom of widget.
                                scrollby = delta_bottom + H/2-h;
                                container.stop(true).animate({scrollTop: '+=' + scrollby  + 'px'}, 300);
                            }
                        }
                        else{ //too high: recenter: 
                            scrollby = delta_top + (h-H)/2;
                            container.stop(true).animate({scrollTop: '+=' + scrollby + 'px'}, 300);
                        }
                    }
                    break;
                case "select_thread": 
                    $("div.location-pagesummary.selected", self.element).removeClass("selected");
                    if (self._seenTimerID !== null){
                        window.clearTimeout(self._seenTimerID);
                    }
                    self._seenTimerID = window.setTimeout(self._f_location_seen(evt.value), 1000);
                    o = self._model.o.location[evt.value];
                    if (o.page !==  self._page){
                        self._page =  o.page;
                        self._render();
                    }
                    $("div.location-lens[id_item="+self._id_location+"]", self.element).removeClass("selected");
                    self._id_location = evt.value;
                    sel = $("div.location-lens[id_item="+evt.value+"]",self.element).addClass("selected");
                    container = $("div.notepaneView-pages", self.element);
                    if (sel.length>0){
                        h = sel.height() ;
                        H = container.height();
                        delta_top = sel.offset().top - container.offset().top;
                        delta_bottom = delta_top + h - H;
                        if (delta_top > 0){ //selected note is not too high
                            if (delta_bottom > 0) {//but it's too low... scroll down
                                scrollby = delta_bottom + H/2-h; //delta_bottom is how much to scroll so that bottom of lens coincides with bottom of widget. 
                                container.stop(true).animate({scrollTop: '+=' + scrollby  + 'px'}, 300);     
                            }
                        }
                        else{ //too high: recenter: 
                            scrollby = delta_top + (h-H)/2;
                            container.stop(true).animate({scrollTop: '+=' + scrollby + 'px'}, 300);         
                        }
                    }
                    break;
                case "keydown": 
                    self._keydown(evt.value);
                    break;
                case "export_threads":
                    self._export_id = evt.value.export_id;
                    self._mode_select = true;
                    self.element.addClass("mode-select");
                    self._render(true);
                    break;
                }
            }
        },
        _update_filters: function(){
            var self = this;
            var m = self._model;
            var locs = m.get("location", {id_source:  self._id_source});
            var me = $.concierge.get_component("get_userinfo")();
            var n_unfiltered = locs.length();
            var $filters = $("a.filter", self.element).removeClass("active");
            var $filter_me = $filters.filter("[action=me]");
            var $filter_star = $filters.filter("[action=star]");
            var $filter_question = $filters.filter("[action=question]");
            var $filter_advanced = $filters.filter("[action=advanced]");

            var locs_me = locs.intersect(m.get("comment", {id_author: me.id}).values("ID_location"));
            var locs_star = m.get("threadmark", {active: true, type: self._STAR });
            var locs_question = m.get("threadmark", {active: true, type: self._QUESTION });

            var filters_on = (self._filters.me || self._filters.star || self._filters.question || self._filters.advanced);

            if (self._filters.me){
                $filter_me.addClass("active");
            }
            if (self._filters.star){
                $filter_star.addClass("active");
            }
            if (self._filters.question){
                $filter_question.addClass("active");
            }
            if (self._filters.advanced) {
                $filter_advanced.addClass("active");
            }

            var n_me =  locs_me.length();
            var n_star = locs_star.length();
            var n_question = locs_question.length();

            $("div.filter-count", $filter_me).text(n_me);
            $("div.filter-count", $filter_star).text(n_star);
            $("div.filter-count", $filter_question).text(n_question);
            if (filters_on){
                $("span.filter-msg-unfiltered", self.element).hide();
                $("span.filter-msg-filtered", self.element).show();
                $("span.n_total", self.element).text(n_unfiltered);
                $("span.n_filtered", self.element).text( self.locs.length() );
            }
            else{
                $("span.filter-msg-unfiltered", self.element).show();
                $("span.filter-msg-filtered", self.element).hide();    
                $("span.n_unfiltered", self.element).text( self.locs.length() );
            }

            self._recalculate_locs();

        },
        _lens: function(l){
            var self = this;
            var m = self._model;
            var me = $.concierge.get_component("get_userinfo")();
            var numnotes = m.get("comment", {ID_location: l.ID}).length();
            var numseen = m.get("seen", {id_location: l.ID}).length();
            var numstar = m.get("threadmark",  {active: true, type: self._STAR, location_id: l.ID }).length();
            var numquestion = m.get("threadmark",  {active: true, type: self._QUESTION, location_id: l.ID }).length();

            var unseen_me = m.get("comment", {ID_location: l.ID, id_author: me.id}).length() -  m.get("seen", {ID_location: l.ID, id_author: me.id}).length(); 
            var numnew    = numnotes - numseen - unseen_me; //so that notes that I've authored but that I haven't seen don't count.     
            var lf_numnotes =  "<ins class='locationflag "+(numnew>0?"lf-numnewnotes":"lf-numnotes")+"'>"+numnotes+"</ins>";
            var lf_admin    = m.get("comment", {ID_location: l.ID, admin:1}).is_empty() ? "" : "<ins class='locationflag'><div class='nbicon adminicon' title='An instructor/admin has participated to this thread'>&nbsp;</div></ins>";
            var lf_me_private =  m.get("comment", {ID_location: l.ID, id_author:me.id}).is_empty() ? "": (m.get("comment", {ID_location: l.ID, type:1}).is_empty() ?  "<ins class='locationflag'><div class='nbicon meicon' title='I participated to this thread'/></ins>" : "<ins class='locationflag'><div class='nbicon privateicon' title='I have private comments in  this thread'/></ins>" );
            var bold_cl    = numnew > 0 ? "location-bold" : "";
            var lf_star    = numstar > 0 ? "<ins class='locationflag'><div class='nbicon staricon-hicontrast' title='This thread has been starred'/></ins>" : "";
            var lf_question    = numquestion > 0 ? "<ins class='locationflag'><div class='nbicon questionicon-hicontrast' title='A reply is requested on this thread'/></ins>" : "";
            var root =  m.get("comment", {ID_location: l.ID, id_parent: null}).first();
            
            var body = (root===null || root.body.replace(/\s/g, "") === "") ? "<span class='empty_comment'>Empty Comment</span>" : $.E(root.body.substring(0, 200));

            var selected_top = (self._selected_locs.top.indexOf(l.ID) !== -1);
            var selected_all = (self._selected_locs.all.indexOf(l.ID) !== -1);

            var select_top_box = "<input type='checkbox' data-loc='"+l.ID+"' data-type='top' "+(selected_top ? " checked='checked'" : "") + "/>";
            var select_all_box = "<input type='checkbox' data-loc='"+l.ID+"' data-type='all' "+(selected_all ? " checked='checked'" : "") + "/>";

            var select_button =
                self._mode_select ?
                ("<span class='selectors'><span>" + select_top_box + "</span><span>" + select_all_box + "</span></span>") :
                "";

            return "<div class='location-flags'>"+lf_numnotes+lf_admin+lf_me_private+lf_star+lf_question+"</div>" +
                select_button +
                "<div class='location-shortbody "+(numquestion>0?"replyrequested":"")+"'>" +
                    "<div class='location-shortbody-text "+bold_cl+"'>"+body+"</div>" +
                "</div>";
        },
        _keydown: function(event){
            var self=this;
            var codes = {37: {sel: "prev", no_sel: "last", dir: "up", msg:"No more comments above..."}, 39: {sel: "next", no_sel:"first", dir: "down", msg:"No more comments below..."}}; 
            var new_sel, id_item, id_new;

            if (event.shiftKey || event.altKey || event.ctrlKey) {
                // We are not expecting shift, alt, or ctrl with our key codes, so we let others handle this
                return true;
            }

            if (event.keyCode in codes){
                var sel = $("div.location-lens.selected", self.element);
                if (sel.length){
                    new_sel = sel[codes[event.keyCode].sel]("div.location-lens");
                    if (new_sel.length){
                        self._is_first_stroke = true;
                        new_sel.click();
                    }        
                    else { // we need to find a following location on subsequent pages
                        id_item = sel.attr("id_item");
                        id_new = $.concierge.get_component("location_closestpage")({id: Number(id_item), model: self._model, direction: codes[event.keyCode].dir, filters: self._filters}); 
                        if (id_new !== null){
                            if (self._is_first_stroke){//add an extra keystroke between changing pages
                                self._is_first_stroke = false;                
                                $.concierge.trigger({type:"warn_page_change", value: id_new});
                            }
                            else{
                                self._is_first_stroke = true;                    
                                $.concierge.trigger({type:"select_thread", value: id_new});
                            }
                        }
                        else{
                            $.I( codes[event.keyCode].msg);
                        }
                    }
                }
                else{ // no selection on the page
                    new_sel = $("div.location-lens")[codes[event.keyCode].no_sel](); 
                    if (new_sel.length){
                        new_sel.click();
                        //                $.L("moving selection");
                    }
                }
                return false;
            }
            else{
                return true; // let the event be captured for other stuff
            }
            //        $.L("keypressed");
        }, 
        _f_location_click : function(event){
            var id_item = event.currentTarget.getAttribute("id_item");
            $.concierge.trigger({type:"select_thread", value: id_item});
        },
        _f_location_hover : function(event){
            var id_item = event.currentTarget.getAttribute("id_item");
            $.concierge.trigger({type:"note_hover", value: id_item});
        }, 
        _f_location_out : function(event){
            var id_item = event.currentTarget.getAttribute("id_item");
            $.concierge.trigger({type:"note_out", value: id_item});
        },
        _recalculate_locs: function() {
            var self = this;
            var m = self._model;
            var me = $.concierge.get_component("get_userinfo")();

            self.locs = m.get("location", {id_source: self._id_source});

            if (self._filters.me){
                self.locs = self.locs.intersect(m.get("comment", {id_author: me.id}).values("ID_location"));
            }
            if (self._filters.star){
                self.locs = self.locs.intersect(m.get("threadmark", {active: true, type: self._STAR }).values("location_id"));
            }
            if (self._filters.question){
                self.locs = self.locs.intersect(m.get("threadmark", {active: true, type: self._QUESTION }).values("location_id"));
            }
            if (self._filters.advanced){
                self.locs = self.locs.intersect(self._filters.advanced);
            }

            if (self._mode_select) {
                $(".select-all input[type=checkbox]").each(function() {
                    if (this.checked) {
                        this.indeterminate = true;
                    }
                });
            }

        },
        _context_build: function ($trigger, event) {
            var self = this;
            var id_item = $trigger.closest("div.location-lens").attr("id_item");
            var items = {
                "export-top": { name: "Transfer First Post", icon: "export-top" },
                "export-all": { name: "Transfer Entire Thread", icon: "export-all" },
                "promote": {
                    name: "Promote",
                    items: {
                        "promote-entire": { name: "Promote thread to entire class" },
                        "promote-copy": { name: "Copy first post to each section separately" }
                    }
                },
                "reassign-section": {
                    name: "Reassign Section",
                    items: {
                        "unset-section": { name: "No section (visible to entire class)" }
                    }
                },
                "sep1": "---------",
                "delete-thread": { name: "Delete Thread" }
            };

            if (self._model.get("ensemble", {}).first().admin === false) {
                return false;
            }

            var loc = self._model.get("location", { ID: id_item }).first();
            var sections = self._model.get("section");
            var section_id, section;

            if (loc === undefined || loc === null) {
                return false;
            }

            if (loc.section_id === undefined || loc.section_id === null) {
                delete items["promote"];
                items["reassign-section"].items["unset-section"].name =
                    "[X] " + items["reassign-section"].items["unset-section"].name;
            }

            if (sections.is_empty()) {
                delete items["reassign-section"];
            } else {
                for (section_id in sections.items) {
                    section = sections.items[section_id];
                    var menu_item_name = ((String(loc.section_id) === section_id) ? "[X] " : "") + section.name;
                    items["reassign-section"].items["set-section:" + section_id] = {
                        name: menu_item_name
                    };
                }
            }

            return items;
        },
        _context_callback: function (el, action) {
            var $loc = el.closest("div.location-lens");
            var id_item = $loc.attr("id_item");
            var self = this;

            if (action === "export-top" || action === "export-all") {
                var text = "@import(" + id_item + ", " + ((action === "export-top") ? "top" : "all") + ")";
                window.prompt("Copy the text below and insert it as a new annotation to import it.", text);
                return;
            }

            if (action === "unset-section" || action === "promote-entire") {
                // set the section of the location with "ID_item" to "None"
                $.concierge.get_component("set_location_section")({
                    id_location: id_item,
                    id_section: null
                }, function (payload) {
                    self._model.add("location", payload);
                });
                return;
            }

            if (action === "promote-copy") {
                // copy location + top comment over to each section other than "this"
                $.concierge.get_component("promote_location_by_copy")({
                    id_location: id_item
                }, function (payload) {
                    self._model.add("comment", payload.comments);
                    self._model.add("location", payload.locations);
                    if ("html5locations" in payload) {
                        self._model.add("html5location", payload.html5location);
                    }
                });
                return;
            }

            if (action === "delete-thread" &&
                window.confirm("Are you sure you want to delete this thread" +
                "and all responses to it? This action cannot be undone")) {
                $.concierge.get_component("delete_thread")({ id_location: id_item }, function (payload) {
                    self._model.remove("location", payload.id_location);
                });
                return;
            }

            var regExp = /^set-section:([0-9]*)$/g;
            var result = regExp.exec(action);

            if (result) {
                // set the section ID for the location with "ID_item" to "section_id"
                var section_id = result[1];
                $.concierge.get_component("set_location_section")({
                    id_location: id_item,
                    id_section: section_id
                }, function (payload) {
                    self._model.add("location", payload);
                });
                return;
            }

        },
        _render: function(do_erase){
            /*
             * this is where we implement the caching strategy we want...
             */
            var self = this;
            if (do_erase){
                self.element.children("div.notepaneView-pages").children("div.notepaneView-comments").empty();
            }

            self._recalculate_locs();

            //first, render the current page...
            var f = this._model.o.file[ this._id_source];
            var p = this._page;
            var p_after = p; 
            var p_before = p;
            this._render_one(p);
            this._update_filters();
            //estimate how much space taken by annotations, and render 120% of a whole screen of them if not enough on current page
            var container = $("div.notepaneView-pages", this.element);
            while ( container.children().last().offset().top - container.offset().top < container.height() ){
                p_after++;
                if (p_after<=f.numpages){
                    this._render_one(p_after);
                }            
                p_before--;
                if (p_before>0){
                    this._render_one(p_before);
                }
                if (p_before<1 && p_after >= f.numpages){
                    //There's just not enough annotations to render a whole screen 
                    break;
                }
            }

            $(".notepaneView-selected", self.element).outerWidth($(".notepaneView-comments", self.element).outerWidth());

        }, 
        _render_one: function(page){

            var self    = this;        
            var nosummary = false;

            if (page > self._maxpage){
                self._maxpage =  page;
            }

            // If we only have one page, no need to display the page summary
            if (self._maxpage <= 1) {
                nosummary = true;
            }

            if (!(page in self._pages)){
                var m = self._model;
                var $pane = $("div.notepaneView-comments[page="+page+"]", self.element).empty();
                var page_locs = m.get("location", {id_source:  self._id_source, page: page });
                var locs = self.locs.intersect(page_locs.values("ID"));

                var locs_array = locs.sort(self.options.loc_sort_fct);
                var o;
                if (locs_array.length && !nosummary){
                    $pane.append("<div class='location-pagesummary' page='"+page+"'>"+locs_array.length+" thread"+$.pluralize(locs_array.length)+" on page "+page+"</div>");
                }

                var admin = m.get("ensemble", {}).first().admin === true;

                locs_array.forEach(function(o) {
                    var loc_lens =
                        $("<div class='location-lens' id_item='"+o.ID+"'>"+self._lens(o)+"</div>");
                    $pane.append(loc_lens);

                });

                $("div.location-lens", $pane).click(self._f_location_click).mouseenter(self._f_location_hover).mouseleave(self._f_location_out).removeClass("lens-odd").filter(":odd").addClass("lens-odd");
                if (self._id_location in locs.items && locs.items[self._id_location].page === page){//highlight selection
                    $("div.location-lens[id_item="+self._id_location+"]",self.element).addClass("selected");
                }
                self._pages[page] = true;           
                self._rendered = true;
                return locs;
            }
            self._rendered = true;
            return null;
        }, 
        set_model: function(model){
            var self = this;
            self._STAR = $.concierge.get_constant("STAR");
            self._QUESTION =  $.concierge.get_constant("QUESTION");
            self._model =  model;
            var id_source = $.concierge.get_state("file");
            self._id_source =  id_source ; 
            model.register($.ui.view.prototype.get_adapter.call(this),  {location: null, seen: null, threadmark: null});
            //make placeholders for each page: 
            var f = model.o.file[id_source];
            var $pane = $("div.notepaneView-pages", self.element);
            $pane.scroll(function(evt){
                var timerID = self._scrollTimerID;
                if (timerID !== null){
                    window.clearTimeout(timerID);
                }            
                timerID = window.setTimeout(function(){
                    //Are we within 20px from the bottom of scrolling ?
                    while ($pane.children().last().offset().top - $pane.offset().top - $pane.height() < 20){
                        var maxpage = self._maxpage;
                        $.L("scroll: maxpage="+maxpage);
                        if (maxpage < f.numpages){
                            self._render_one(maxpage+1);
                        }
                        else{
                            return; //last page has been rendered. 
                        }
                    }
                }, 300);
                self._scrollTimerID =  timerID;   
                
            });
            for (var i = 1;i<=f.numpages;i++){
                $pane.append("<div class='notepaneView-comments' page='"+i+"'/>");
            }
            self._update();    
        }, 
        update: function(action, payload, items_fieldname){
            var self = this;
            var m = self._model;
            var i, D, loc, pages_done, id_source, page, pages, pages_to_render;

            var admin = m.get("ensemble", {}).first().admin === true;

            if (admin) {
                self.element.addClass("admin");
            } else {
                self.element.removeClass("admin");
            }

            self._recalculate_locs();

            if (action === "add" && items_fieldname === "location"){
                id_source    = self._id_source; 
                page        = self._page;
                if (page === null || id_source === null ){
                    //initial rendering: Let's render the first page. We don't check the id_source here since other documents will most likely have their page variable already set. 
                    self._page =  1;
                    self._pages = {};
                    self._maxpage = 0;
                    self._render();
                    //TODO: in other  "add location" cases we may have to use different method, that forces a to redraw the pages that have been rendered already. 
                }
                else{
                    //send signal to redraw pages that needs to be redrawn: 
                    D        = payload.diff;
                    pages    = self._pages;
                    pages_to_render = {};
                    for (i in D){
                        if (D[i].id_source === id_source){
                            delete pages[D[i].page];
                            pages_to_render[[D[i].page]] = null;
                        }
                    }
                    for (i in pages_to_render){
                        self._render_one(i);
                    }
                }
            }
            else if (action === "add" && items_fieldname === "seen" && self._rendered){
                D        = payload.diff;
                var locs_done = {};
                for (i in D){
                    loc = m.get("location", {ID: D[i].id_location}).first();
                    if (loc !== null && loc.id_source === self._id_source && (!(loc.ID in locs_done))){
                        locs_done[loc.ID] = null;
                        $("div.location-lens[id_item="+loc.ID+"]",self.element).html(self._lens(loc));
                    }
                }           
            }
            else if (action === "remove" && items_fieldname === "location"){ //just re-render the pages where locations were just removed. 
                D        = payload.diff;
                pages_done    = {};

                for (i in D){
                    page = D[i].page;
                    if (! (page in pages_done)){
                        pages_done[page] = null;
                        delete self._pages[page];
                        self._render_one(page);
                    }
                }
            }
            else if (action === "add" && items_fieldname === "threadmark" && self._rendered){
                D = payload.diff;
                
                pages_done    = {};
                for (i in D){
                    loc = m.get("location", {ID: D[i].location_id}).first();
                    if (loc!= null){
                        page = loc.page;
                        if (! (page in pages_done)){
                            delete self._pages[page];
                            self._render_one(page);
                        }
                    }
                }
                self._update_filters();
            }
        }    
    });
    $.widget("ui.notepaneView",V_OBJ );
    $.ui.notepaneView.prototype.options = {
        loc_sort_fct: function(o1, o2){return o1.top-o2.top;},
        expand: "div.notepaneView-pages", 
        listens: {
            page: null, 
            note_hover: null, 
            note_out: null, 
            select_thread: null, 
            warn_page_change: null, 
            keydown: null,
            filter_toggle: null,
            filter_threads: null,
            export_threads: null,
        }
    };
})(jQuery);

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};


/**
 * Additions
 */

var getWeekNumber = function(d) {
    // Copy date so don't modify original
    d = new Date(d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    return Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
}

Date.prototype.getWeek = function() {
        return getWeekNumber(this);
};

Date.prototype.toPrettyString = function () {
        var current_date = new Date();

        if (this.getFullYear() !== current_date.getFullYear()) { // Not even this year
            return this.format("d mmm yyyy");
        } else if (this.getWeek() !== current_date.getWeek()) { // This year but not this week
            return this.format("d mmm, hh:MMTT");
        } else if (this.getDay() !== current_date.getDay()) { // This week but not today
            return this.format("ddd hh:MMTT");
        }

        // Today
        return this.format("hh:MMTT");

};

/* threadview Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *

 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true confirm:true*/
(function($) {
    var V_OBJ = $.extend({},$.ui.view.prototype,{
        _create: function() {
        $.ui.view.prototype._create.call(this);
        var self = this;
        self._location =  null; 
        //SACHA: FIXME (HACK) the 2 vars below are needed in order to defer rendering if code hasn't been loaded yet. For instance, when we have ?c=id_comment in the URL
        self._ready = false;
        self._doDelayedRender = false;
        self._STAR = null;
        self._QUESTION = null;

        /*
          self.element.addClass("threadview").append("<div class='threadview-header'><button action='prev'>Prev</button> <button action='next'>Next</button> </div><div class='threadview-pane'/>");
          
          $("button[action=prev]", self.element).click(function(){
          alert("todo");
          });
          $("button[action=next]", self.element).click(function(){
          alert("todo");
          });
        */
        self.element.addClass("threadview").append("<div class='threadview-header'><div class='threadview-header-sectioninfo'/><div class='threadview-filter-controls'> <div class='nbicon questionicon' /><button class='mark-toggle' arg='add' action='question'>+</button><span class='n_question'>...</span><button class='mark-toggle' arg='remove' action='question'>-</button> <span id='thread_request_reply'>replies requested</span>  <!--<button class='mark-toggle' action='star'><div class='nbicon staricon-hicontrast' /><span class='n_star'>...</span><span id='thread_mark_favorite'>Mark as Favorite.</span></button>--></div></div><div class='threadview-pane'/>");
        var star_button = $("button.mark-toggle[action=star]", self.element).click(function(event){
            var comment_id = self._model.get("comment", {ID_location: self._location, id_parent: null }).first().ID;
            $.concierge.get_component("mark_thread")({comment_id: comment_id, id_location: self._location, type: self._STAR}, function(p){                
                self._model.add("threadmark", p.threadmarks);
                var i, tm;
                for ( i in p.threadmarks){
                    tm = p.threadmarks[i];
                    $.I("Thread #"+tm.location_id+ " has been "+(tm.active ? "":"un")+"marked as favorite.");
                }
                });
            }); 
        var question_button = $("button.mark-toggle[action=question]", self.element).click(function(event){
            //var comment_id = event.target.getAttribute("arg")=="remove" ? null : self._model.get("comment", {ID_location: self._location, id_parent: null }).first().ID;
            var comment_id = self._model.get("comment", {ID_location: self._location, id_parent: null }).first().ID;
            var active =  event.target.getAttribute("arg") !== "remove";
            $.concierge.get_component("mark_thread")({active: active, comment_id: comment_id, id_location: self._location, type: self._QUESTION}, function(p){                
                self._model.add("threadmark", p.threadmarks);
                var i, tm;
                for ( i in p.threadmarks){
                    tm = p.threadmarks[i];
                    $.I("Thread #"+tm.location_id+ " has been "+(tm.active ? "":"un")+"marked as 'Reply Requested'.");
                }
                });
            }); 

            //splash screen: 
            $("div.threadview-pane", self.element).append($.concierge.get_component("mini_splashscreen")());        
            $("div.threadview-header", self.element).hide();
            self._ready = true;
            if (self._doDelayedRender){
                self._render();
            }

	    var builder = function($trigger, e) {

                var item_object = self._context_build.call(self, $trigger, e);

                return {
                    callback: function(key, options) {
                        // we use 'call' and supply 'self' so that _context
                        // will use 'self' as 'this', not the context menu.
                        self._context_callback.call(self,this, key, options);
                    },
                    items: item_object
                };
            };
            // Declare Threadview Context Menu
            $.contextMenu({
                selector: 'div.note-lens',
                build: builder
            });
            $.contextMenu({
                selector: 'a.optionmenu',
		trigger: 'left',
                build: builder
            });

        },
        _defaultHandler: function(evt){
        if (this._file ===  $.concierge.get_state("file")){
            switch (evt.type){
            case "select_thread":
            this._location =  evt.value;
            this._render();
            break;
            case "foo":
            break;
            }    
        }    
        },
        _commentLabelsFactory : function(o, scope ){
            //o: comment for which to draw labels
            //scope: 
            //  1 to draw them for the specified comment 
            //  2 to draw them for the whole thread. 
            var self = this;
            var m = self._model;
             if (self.options.commentLabels){
            var cl_container = ["<div style='position: relative'><div class='commentlabel_container' scope='"+scope+"' id_item='"+o.ID+"'>"];
            var cats = m.get("labelcategory", {scope: scope}).items;
            var i, j, label, tags = [], cat, caption; 
            //tags are categories for which pointgrade=2: we just want to display the tag,
            //instead of displaying the name and the list of grades, we just want to display the name and whether it's toggled or not.            
            for (i in cats){
                cat = cats[i];
                if (cat.pointscale === 2){
                    tags.push(i);
                }
                else{
                    label = m.get("commentlabel", {comment_id: o.ID, category_id: cat.id}).first();
                    cl_container.push("<div class='commentlabel_cat' id_item='"+i+"'><div class='cat_name'>"+$.E(cat.name)+"</div>");
                    for (j=0;j<cat.pointscale;j++){
                        try{
                            caption = m.get("labelcategorycaption", {category_id: cat.id, grade: j}).first().caption;
                        }catch(e){
                            caption = j;
                        }
                        cl_container.push("<span class='cat_elt"+((label !== null && label.category_id===cat.id &&  label.grade===j)? " selected":"" )+"' val='"+j+"'>"+caption+"</span>");
                    }
                    cl_container.push("</div>");
                }              
            }
            //now display tags: 
            cl_container.push("<div>");
            for (j=0;j<tags.length;j++){
                cat = cats[tags[j]];
                label = m.get("commentlabel", {comment_id: o.ID, category_id: cat.id}).first();
                cl_container.push("<span id_item='"+tags[j]+"' class='tag cat_elt"+((label !== null && label.category_id===cat.id &&  label.grade===1)? " selected":"" )+"'>"+$.E(cat.name)+"</span>");

            }
            cl_container.push("</div>");            
            cl_container.push("</div></div>");
            return  cl_container.join("");
             }
            return "";
        }, 
        _lens: function(o){
        var self        = this;
        var m            = self._model;
        var bold_cl        = (m.get("seen", {id: o.ID}).is_empty()===false || o.id_author === self._me.id) ? "" : "note-bold";
        var admin_info        = o.admin ? " <div class='nbicon adminicon'  title='This user is an instructor/admin for this class' /> ": " ";
        var me_info        = (o.id_author === self._me.id) ? " <div class='nbicon meicon' title='I am the author of this comment'/> ":" ";
        var question_info_me    = (m.get("threadmark", {comment_id: o.ID, user_id: self._me.id, active: true, type: self._QUESTION }).is_empty()) ? " " : " <div class='nbicon questionicon-hicontrast' title='I am requesting a reply on this comment'/> " ;

        var tms            = m.get("threadmark", {comment_id: o.ID,  active: true, type: self._QUESTION });        
        var tms_me        = tms.intersect( self._me.id, "user_id");
        var tms_me_label    = tms_me.is_empty() ? "" : ", including mine"; 
        var tms_me_class    = tms_me.is_empty() ? "" : "active";
        var question_info    = tms.is_empty()  ? " " : "<div class='stat-count "+tms_me_class+"' title='"+tms.length()+" "+ $.pluralize(tms.length(), "replies", "reply") +" requested on this comment"+tms_me_label+" '><div class='nbicon questionicon' /> "+tms.length()+" </div>";

        var type_info        = "";
        if (o.type === 1) {
            type_info        = " <div class='nbicon privateicon' title='[me] This comment is private'/> ";
        }
        else if (o.type === 2){
            type_info        = " <div class='nbicon stafficon' title='[staff] This comment is for Instructors and TAs'/> ";
        }            
        var author_name;
        if (!o.signed && self.is_admin) {
            author_name = " <span class='author author-revealed' title='anonymous comment'>"+o.fullname+"</span> ";
        } else {
            author_name = " <span class='author'>"+o.fullname+"</span> ";
        }
        var creation_info = " <span class='created'> &ndash; " + (new Date(o.created * 1000)).toPrettyString() + "</span> ";
        var replymenu        = "<a class='replymenu' href='javascript:void(0)'><div class='nbicon replyicon' title='Reply' /></a>";
        var optionmenu        = " <a class='optionmenu' href='javascript:void(0)'><div title='Actions'>&middot;&middot;&middot;</div></a> ";
        var url_regex = /(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/ig;
        var body        = o.body.replace(/\s/g, "") === "" ? "<span class='empty_comment'>Empty Comment</span>" : $.E(o.body).replace(/\n/g, "<br/>").replace(url_regex, "<a href=\"$1\">$1</a>");
        var commentlabels = self._commentLabelsFactory(o,1 );
       
        return ["<div class='note-lens ",tms.is_empty() ? "":"replyrequested" , "' id_item='",o.ID,"'><div class='lensmenu'>", replymenu, optionmenu,"</div>",commentlabels,"<span class='note-body ",bold_cl,"'>",body,"</span><div class='authorship-info'>", author_name,admin_info, me_info, question_info, type_info, creation_info,"</div>", "</div>"].join("");
        },
        _comment_sort_fct: function(o1, o2){return o1.ID-o2.ID;},
        _fill_tree: function(m, c){
        var $div = $("<div class='threadview-branch'>"+this._lens(c)+"</div>");
        var children = m.get("comment", {ID_location: c.ID_location, id_parent: c.ID}).sort(this._comment_sort_fct);        
        for (var i = 0; i<children.length;i++){
            $div.append(this._fill_tree(m,children[i]));
        }
        return $div;
        },
        _render_header: function(){
        var self = this;
        var header = $("div.threadview-header", self.element);
        var m = self._model;
        var tm_star = m.get("threadmark", {location_id: self._location, active:true, type: self._STAR});
        var tm_star_me = m.get("threadmark", {location_id: self._location, active:true, type: self._STAR, user_id: self._me.id});
        var tm_question = m.get("threadmark", {location_id: self._location, active:true, type: self._QUESTION});
        var tm_question_me = m.get("threadmark", {location_id: self._location, active:true, type: self._QUESTION, user_id: self._me.id});
        var buttons = $("button.mark-toggle", header).removeClass("active");
        if (tm_star_me.length()>0){
            buttons.filter("[action=star]", header).addClass("active");
        }
        $("span.n_star", header).text(tm_star.length());
        if (tm_question_me.length()>0){
            buttons.filter("[action=question][arg=add]").attr("disabled", "disabled");
            buttons.filter("[action=question][arg=remove]").removeAttr("disabled");            
            }
        else{          
            buttons.filter("[action=question][arg=remove]").attr("disabled", "disabled");
            buttons.filter("[action=question][arg=add]").removeAttr("disabled");
        }
        $("span.n_question", header).text(tm_question.length());
        $("#thread_request_reply").text($.pluralize(tm_question.length(), "replies requested", "reply requested"));
            //indicate the section name if this thread is section-based: 
            var section_header =  $(".threadview-header-sectioninfo", header);
            section_header.text("");
            var section_id = m.o.location[self._location].section_id;
            if (section_id !== null){
                var section = m.o.section[section_id];
                if (section){
                    section_header.text(section.name);
                }              
            }
        },
        _context_build: function(el, event){
            var self = this;
            var id_item = el.closest("div.note-lens").attr("id_item");
            var m = self._model;                   
            var c = m.o.comment[id_item];

            var items = {
                "thanks": { name: "That helped. Thanks!", icon: "thanks" },
                "edit": { name: "Edit", icon: "edit" },
                "reply": { name: "Reply", icon: "reply" },
                "sep1": "---------",
                "question": { name: "Request a reply", icon: "question" },
                "noquestion": { name: "Remove 'reply requested'", icon: "noquestion" },
                "star": { name: "Mark as favorite", icon: "star" },
                "nostar": { name: "Remove from favorites", icon: "nostar"},
                "sep2": "---------",
                "delete": { name: "Delete", icon: "delete" }
            };

            //edit and delete: 
            if ((c.id_author !== self._me.id) || (!(m.get("comment", {id_parent: id_item}).is_empty()))){
                delete items["edit"];
                delete items["delete"];
            }

            //star and question: 
            var tms_location = m.get("threadmark", {location_id: c.ID_location, user_id: self._me.id, active: true, type: self._QUESTION });
            var tms_comment = tms_location.intersect(c.ID, "comment_id");

            //is this one of my active questions: if so, hide context.question
            if ( tms_comment.is_empty() ) {
                delete items["noquestion"];
            } else {
                delete items["question"];
            }

            
            if (m.get("threadmark", {comment_id: c.ID, user_id: self._me.id, active: true, type:self._STAR }).is_empty()) {
                delete items["li.context.nostar"];
            } else {
                delete items["li.context.star"];
            }

            // can't thank a comment for which I'm the author or where I haven't
            // any replyrequested or which was authored before the comment I
            // marked as "reply requested".
            if ( tms_location.is_empty() || c.id_author === self._me.id || tms_comment.is_empty() || tms_comment.first().comment_id>=c.ID){
                delete items["thanks"];
            }

            return items;
        },
        _on_delete: function(p){
            var self = this;
            var model = self._model;
            var c = model.o.comment[p.id_comment];

            $.I("Note #"+p.id_comment+" has been deleted");
            model.remove("comment", p.id_comment);

            if (c.id_parent === null){
                model.remove("location", c.ID_location);
                // model.remove("html5location", c.ID_location); FIXME: This is not working, but it should.
            } else {
                //we force an update of locations in case some styling needs to be changed. 
                var locs = {};
                locs[c.ID_location] = model.o.location[c.ID_location];
                model.add("location", locs);
            }
        },
        _context_callback: function(el, action, options){
            var self = this;
            var $el = $(el);
            var $note = $el.closest("div.note-lens");
            var id_item = $note.attr("id_item");

            switch (action) {
            case "reply":             
                $.concierge.trigger({type: "reply_thread", value: id_item});
                break;
            case "edit": 
                $.concierge.trigger({type: "edit_thread", value: id_item});
                break;
            case "question": 
            case "noquestion": 
                $.concierge.get_component("mark_thread")({
                    id_location: self._location,
                    type: self._QUESTION,
                    comment_id: id_item
                }, function(p){                
                    self._model.add("threadmark", p.threadmarks);
                    var i, tm;
                    for ( i in p.threadmarks){
                        tm = p.threadmarks[i];
                        $.I("Comment #"+tm.comment_id+ " has been "+(tm.active ? "":"un")+"marked as 'Reply Requested'.");
                    }
                });
                break;
            case "star": 
            case "nostar": 
                $.concierge.get_component("mark_thread")({
                    id_location: self._location,
                    type: self._STAR,
                    comment_id: id_item
                }, function(p){                
                    self._model.add("threadmark", p.threadmarks);
                    var i, tm;
                    for ( i in p.threadmarks){
                        tm = p.threadmarks[i];
                        $.I("Comment #"+tm.comment_id+ " has been "+(tm.active ? "":"un")+"marked as favorite.");
                    }
                });
                break;
            case "thanks": 
                $.L("TODO: " + action);
            break;
            case "delete":
                if (confirm("Are you sure you want to delete this note ?")){
                    $.concierge.get_component("note_deleter")({id_comment: id_item}, self._on_delete);
                }
                break;
            }
        },
        _render: function(){    
        var self    = this;
        self._me =  $.concierge.get_component("get_userinfo")();
        if (self._ready === false){
            self._doDelayedRender = true;
            return;
        }
        var model    = self._model;     
        self.is_admin    = model.get("ensemble", {}).first().admin;
        $("div.threadview-header", self.element).show();
        self._render_header();
        var $pane    = $("div.threadview-pane", self.element).empty();
        var root    = model.get("comment", {ID_location: self._location, id_parent: null}).first();
        if (root === undefined){ //happens after deleting a thread that only contains 1 annotation
            return;
        }
        $pane.append(this._commentLabelsFactory(root, 2));
        $pane.append(this._fill_tree(model, root));
        var f_reply = function(event){
            var id_item = $(event.target).closest("div.note-lens").attr("id_item");
            $.concierge.trigger({type: "reply_thread", value: id_item});
        };
        var f_comment_label = function(event){
            var t = $(event.target), 
            comment_id = parseInt(t.closest("div.commentlabel_container").attr("id_item"), 10), grade, category_id;
            if (t.hasClass("cat_elt")){
                if (t.hasClass("tag")){
                    grade = t.hasClass("selected") ? 0 : 1; //toggle 
                    category_id = parseInt(t.attr("id_item"), 10);
                }
                else{
                    grade = parseInt(t.attr("val"), 10);
                    category_id = parseInt(t.parent().attr("id_item"), 10);
                }
                $.concierge.get_component("set_comment_label")({grade: grade, category_id:category_id, comment_id:comment_id}, function(P){ 
                        var m    = self._model;                   
                        m.add("commentlabel", P.commentlabels);
                    });
            }
        };
        $("a.replymenu", $pane).click(f_reply);
        $("div.commentlabel_container", $pane).click(f_comment_label);
        },
        set_model: function(model){
        var self=this;
        self._model =  model;
        self._me = null;
        var id_source = $.concierge.get_state("file");
        self._file =  id_source ; 
        self._QUESTION = $.concierge.get_constant("QUESTION");
        self._STAR = $.concierge.get_constant("STAR");
        model.register($.ui.view.prototype.get_adapter.call(this),  {comment: null, threadmark: null, commentlabel: null});
        },
        _keydown: function(event){ // same as ui.noteview8.js
        //just proxy to other view if any interested. 
        $.concierge.trigger({type: "keydown", value: event});
        return true;
        }, 
        update: function(action, payload, items_fieldname){
        if ((action === "add"|| action === "remove") && (items_fieldname ==="comment" || items_fieldname ==="threadmark" || items_fieldname==="commentlabel") && this._location){
            this._render();
        }
        }
    });
             
    $.widget("ui.threadview",V_OBJ );
    $.ui.threadview.prototype.options = {
    loc_sort_fct: function(o1, o2){return o1.top-o2.top;},
    listens: {
        select_thread: null
    }, 
    commentLabels: false
    };
})(jQuery);

/* editorview Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *

 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true NB$:true*/
/*global console:false*/

(function($) {
    var $str        = "NB$" in window ? "NB$" : "jQuery";
    var FILETYPES = {TYPE_PDF: 1, TYPE_YOUTUBE: 2, TYPE_HTML5VIDEO: 3, TYPE_HTML5: 4};
    var V_OBJ = $.extend({},$.ui.view.prototype,{
            _create: function() {
                $.ui.view.prototype._create.call(this);
                var self = this;
                var O        = self.options;
                self._allowStaffOnly = O.allowStaffOnly;
                self._allowAnonymous = O.allowAnonymous;
                self._allowTagPrivate = O.allowTagPrivate;
		self._SEC_MULT_FACTOR = $.concierge.get_component("get_sec_mult_factor")();
		self._videoCover = null;
		self._lastDuration = "";
            }, 
            _defaultHandler: function(evt){
                var self        = this;
                var model        = self._model;
                var me            = $.concierge.get_component("get_userinfo")();
                var guest_msg    = "<span>You need to <a href='javascript:"+$str+".concierge.get_component(\"register_user_menu\")()'>register</a>  or  <a href='javascript:"+$str+".concierge.get_component(\"login_user_menu\")()'>login</a> in order to post a reply...</span>";
                var id_item, draft, drafts;
                console.log("Editor Event: "+evt.type);
                switch (evt.type){
		case "set_video_cover":
		    self._videoCover = evt.value;
		break;
                case "new_thread":
                    if (me.guest) {
                        $.I("<span>You need to <a href='javascript:"+$str+".concierge.get_component(\"register_user_menu\")()'>register</a>  or  <a href='javascript:"+$str+".concierge.get_component(\"login_user_menu\")()'>login</a> in order to write annotations...</span>", true, 10000);
                        return;
                    }

                    // only allow one current editor if draft is not empty
                    if (self.element.children().length){
                        if ($("textarea", self.element).val().length > 0) {
                            $.I("You have an active comment being authored right now. If you want to create a new one, please either save or cancel this draft.");
                            return;
                        } else {
                            $("button[action=discard]", self.element).click(); // HACK: get f_discard to work from our scope.
                        }
                    }

                    //TODO: if existting draft, sync its content w/ its model
                    //now create new draft: 
                    id_item        = (new Date()).getTime();
                    draft        = {};
                    draft[id_item]        = id_item;
                    drafts            = {};
                    drafts[id_item]        = draft;
                    self._doEdit        = false;
                    self._inReplyTo        = 0 ;
                    self._selection        = evt.value.selection;
                    self._html5range    = evt.value.html5range; 
                    self._sel        = null;
                    self._note        = null;
                    model.add("draft", drafts);
                    self._render(id_item, evt.value.suppressFocus);
                    break;
                case "reply_thread": 
                    if (me.guest) {
                        $.I("<span>You need to <a href='javascript:"+$str+".concierge.get_component(\"register_user_menu\")()'>register</a>  or  <a href='javascript:"+$str+".concierge.get_component(\"login_user_menu\")()'>login</a> in order to write annotations...</span>", true, 10000);
                        return;
                    }

                    // only allow one current editor if draft is not empty
                    if (self.element.children().length){
                        if ($("textarea", self.element).val().length > 0) {
                            $.I("You have an active comment being authored right now. If you want to create a new one, please either save or cancel this draft.");
                            return;
                        } else {
                            $("button[action=discard]", self.element).click(); // HACK: get f_discard to work from our scope.
                        }
                    }

                    id_item        = (new Date()).getTime();
                    draft        = {};
                    draft[id_item]        = id_item;
                    drafts            = {};
                    drafts[id_item]        = draft;
                    self._doEdit        = false;
                    self._inReplyTo        = evt.value;
                    self._selection        = null;
                    self._sel        = null;
                    self._note        = model.o.comment[evt.value];
                    model.add("draft", drafts);
                    self._render(id_item);    
                    break;
                case "edit_thread": 

                    // only allow one current editor if draft is not empty
                    if (self.element.children().length){
                        if ($("textarea", self.element).val().length > 0) {
                            $.I("You have an active comment being authored right now. If you want to create a new one, please either save or cancel this draft.");
                            return;
                        } else {
                            $("button[action=discard]", self.element).click(); // HACK: get f_discard to work from our scope.
                        }
                    }

                    id_item        = (new Date()).getTime();
                    draft        = {};
                    draft[id_item]        = id_item;
                    drafts            = {};
                    drafts[id_item]        = draft;
                    self._doEdit        = true;
                    self._inReplyTo        = 0 ;
                    self._selection        = null;
                    self._sel        = null;
                    self._note        = model.o.comment[evt.value];
                    model.add("draft", drafts);
                    self._render(id_item);    
                    break;
                case "focus_thread":
                    // We assume the thread is already rendered, we simply focus
                    $("textarea", self.element).focus();
                    break;
		case "set_duration_box":
		    var durationBox = $("#duration")[0];
		    durationBox.value = evt.value;
		break;
                case "discard_if_empty":
                    // only allow one current editor if draft is not empty
                    if (self.element.children().length){
                        if ($("textarea", self.element).val().length === 0) {
                            $("button[action=discard]", self.element).click(); // HACK: get f_discard to work from our scope.
                        }
                    }
                    break;
                }
            },
            _get_tags_at_comment: function(comment_id){
                var self = this;
                var m = self._model;
		var tags = m.get("tags", {comment_id: comment_id});
                return tags;
            },
            _populate_tag_list: function(){
                var self = this;
                var m = self._model;
                var members = m.get("members", {});
                var tag_table = $("#tagBoxes");
                var i = 0;
		var row;
                // Helper for generating checkbox HTML
                var get_checkbox_html = function(member){
                    return "<input type='checkbox' class='tag_checkbox' name='tags' value='"+member.id+"' id='tag_checkbox_"+member.id+"'>";
                };

		members = members.items || {};
		for (var id in members) {
		    if (members.hasOwnProperty(id)) {
			var member = members[id];
			if (member.firstname !== null ||
			    //hack to skip "guest" accounts
			    member.lastname !== null) {
			    var member_html = "<td>"+get_checkbox_html(member)+" "+member.firstname+" "+member.lastname+"</td>";
			    if (i%3 === 0) {
				row = $("<tr>").addClass('data')
				    .appendTo(tag_table);
			    }
			    row.append(member_html);
			    i++;
			}
		    }
		}
            },
            _render: function(id_item, suppress_focus){
                var self        = this;
                var model        = self._model;
                self.element.trigger("restore");
                //Various ways to create a selection
                if (self._selection){ //editor connected to a location
                    self._sel = self._selection.clone();
                }
                else if (self._inReplyTo){ //
            
                }
    
                //TODO: maybe other case to see if we should create selection from draft

                //Now construct the editor. 
                var timeout_save_button;
                var timeout_func = function(self) { $("button[action=save]", self.element).removeAttr("disabled"); };

                var f_cleanup = function(){
                    window.clearTimeout(timeout_save_button);
                    self.element.trigger("before_cleanup", true);
                    self.element.trigger("minimize");
                    self.element.empty();
                    model.remove("draft", id_item);
                    if (self._sel){
                        self._sel.remove();
                    }            
                };
		var is_video = model.o.file[self._file].filetype === FILETYPES.TYPE_YOUTUBE;
                var staffoption    = self._allowStaffOnly ? "<option value='2'>Instructors and TAs</option>" : " ";
                var tagPrivateOption = self._allowTagPrivate ? "<option value='4'>Myself and Tagged Users</option>" : " ";
                var signoption    = self._allowAnonymous ? "<span id='signoption' title=\"check to keep this comment anonymous to other students\"><input type='checkbox' id='checkbox_sign' value='anonymous'/><label for='checkbox_sign'>Anonymous to students</label></div>": " ";
                var questionoption = self._doEdit ? " " : "<span><input type='checkbox' id='checkbox_question' value='question'/><label for='checkbox_question'>Reply Requested</label></span><br/> ";
                var titleoption = self._note === null && is_video ? "<span><input type='checkbox' id='checkbox_title' value='title' /><label for='checkbox_question'>Is Section Title</label></span><br/> " : " ";
                var checkbox_options = questionoption+titleoption+signoption;

                // Determines whether setting time and duration should be allowed
                var allow_time_set = is_video && !self._inReplyTo && (!self._doEdit || (self._note && self._note.id_parent == null));
		var fetch_duration = self._note ? model.get("location", {ID: self._note.ID_location}).first().duration: null;
                var init_duration = allow_time_set && self._doEdit && fetch_duration != null ? String(fetch_duration/self._SEC_MULT_FACTOR) : "2.00";
                
                var duration_option = allow_time_set ? "<label for='duration'>Duration:</label><br/><input id='duration' type='text' size='1' value='"+init_duration+"' /> seconds<br/>" : " ";
                var header    = self._inReplyTo ? "Re: "+$.E($.ellipsis(self._note.body, 100)) : "New note...";

		var set_time_buttons = allow_time_set ? "<button action='start' class='time_button'>Set Start Time Here</button><button action='end' class='time_button'>Set End Time Here</button>" : "";

                var section_tag_option2 = "<br /><br /><label for='section_tag'>Tag Full Section:</label><br /><select id='section_tag' name='section_tag'><option value='0'>----Select Section to Tag----</option></select>";
		var section_tag_option = ""; //hack to hide tags

                var contents = $([
                                  "<div class='editor-header'>",header,"</div><div class='notebox'><div class='notebox-body'><div><a class='ui-view-tab-close ui-corner-all ui-view-semiopaque' role='button' href='#'><span class='ui-icon ui-icon-close'></span></a></div><textarea/><br/></div><div class='editor-footer'><table class='editorcontrols'><tr><td class='group'>",duration_option,"<label for='share_to'>Shared&nbsp;with:&nbsp;</label><select id='share_to' name='vis_", id_item, "'><option value='3'>The entire class</option>", staffoption, 
                                  "<option value='1'>Myself only</option>"+tagPrivateOption+"</select><br/>"+checkbox_options+"</td><td class='save-cancel'>"+set_time_buttons+"<button action='save' >Submit</button><button action='discard' >Cancel</button>"+section_tag_option+"</td></tr></table><br><table id='tagBoxes'><tr><td><b>Select Users to Tag:</b></td><td><button id='select_all_button' action='select_all'>Select All</button></td><td><button id='deselect_all_button' action='deselect_all'>Deselect All</button></td></tr></table></div></div>"].join(""));

                self.element.append(contents);

                var sections = model.get("section", {});
                for (var sec_id in sections.items) {
                    var sec_obj = sections.items[sec_id];
                    var section_html = "<option value='"+String(sec_obj.id)+"'>"+String(sec_obj.name)+"</option>";
                    $("#section_tag").append(section_html);
                }

                $("#section_tag").change(function() {
                    var tagged_section_id = parseInt($(this).val());
                    $(this).val("0");
                    var section_members = model.get("members", {section: tagged_section_id});
                    for (var tagged_member_id in section_members.items) {
                        $("#tag_checkbox_"+String(tagged_member_id)).prop("checked", true);
                    }
                });

                $("#checkbox_title").click(function() {
                    var dur_box = $("#duration")[0];
                    if ($("#checkbox_title")[0].checked) {
                        self._lastDuration = dur_box.value;
                        dur_box.value = "-----";
                        $(".time_button").prop("disabled", true);
                    } else {
                        dur_box.value = self._lastDuration;
                        self._lastDuration = "";
                        $(".time_button").prop("disabled", false);
                    }
                });

                $("#tagBoxes").css("visibility", "visible");

                // Set Up Tagging
                self._populate_tag_list();

                $("#select_all_button").click(function() {
                    $("#tagBoxes input").prop("checked", true);
                });

                $("#deselect_all_button").click(function() {
                    $("#tagBoxes input").prop("checked", false);
                });

                // Check boxes for tagged people if editing
                if (self._doEdit) {
                    var tags = self._get_tags_at_comment(self._note.ID);
                    var tagged_users = tags.values("user_id");
                    $("#tagBoxes input").each(function(index, element) {
                        var id = parseInt(element.value);
                        if (id in tagged_users) {
                            element.checked = true;
                        } else {
                            element.checked = false;
                        }
                    });
                } else {
                    $("#tagBoxes input").prop("checked", false);
                }

                $("a[role='button']", self.element).click(f_cleanup).hover(function(e){$(this).addClass('ui-state-hover').removeClass('ui-view-semiopaque');},function(e){$(this).removeClass('ui-state-hover').addClass('ui-view-semiopaque');} );
                var $textarea = $("textarea", self.element).keypress(function(e){
                        if(e.keyCode === 27 && this.value.length === 0){
                            f_cleanup();
                        }
                    });
                $textarea.css('minHeight', $textarea.height() + self.element.height() - $("div.notebox", self.element).height() - 42);
                var f_sel = function(evt, ui){
                    $.L("sel has moved to", self._sel.width(), "x",  self._sel.height(), "+" ,  self._sel.css("left"), "+", self._sel.css("top"));
                };

                var f_discard = function(evt){
                    f_cleanup();
                    $.concierge.trigger({type:"editor_delete", value: ""});
                };
                var f_on_save = function(payload){
                    model.add("comment", payload["comments"]);
                    model.add("threadmark", payload["threadmarks"]);
                    model.add("tags", payload["tags"]);

                    if ("cid" in payload) {
                        var cid = payload["cid"];
                        // Remove tags not in payload
                        var remove_tags = {};
                        for (var tag_id in model.get("tags", {comment_id: cid}).items) {
                            if (!(tag_id in payload["tags"])) {
                                remove_tags[tag_id] = null;
                            }
                        }
                        model.remove("tags", remove_tags);
                    }

                    if ("html5locations" in payload){
                        model.add("html5location", payload["html5locations"]);
                    }

                    //important to add location even when edit or reply since it can change styling (if adding private comment etc...)
                    if ("locations" in payload){
                        model.add("location", payload["locations"]);
                    }
                    else{
                        var id_comment; for (id_comment in payload["comments"]){break;}
                        var id_loc = model.o.comment[id_comment]["ID_location"];
                        if (id_loc in model.o.location){
                            var locs = {};
                            locs[id_loc] = model.o.location[id_loc];
                            model.add("location", locs);
                        }
                    }

                    // Location was edited, reflect in display
                    if ("edit_location" in payload) {
                        var new_loc = payload["edit_location"];
                        var new_loc_id = new_loc.ID;
                        // Hack to remove tick since remove event doesn't work
                        $.concierge.trigger({type: "remove_tick", value: new_loc_id});
                        var _locs = model.get("location", {}).items;
                        _locs[new_loc_id] = new_loc;
			console.log(model.get("location", {}).items);
			model.set("location", _locs);
			console.log(model.get("location", {}).items);
                    }
                    f_cleanup();
                };
                var f_save = function(evt){
                    $("button[action=save]", self.element).attr("disabled", "disabled");
                    timeout_save_button = window.setTimeout(function() { timeout_func(self); } , 3000);
                    $.concierge.trigger({type: "editor_prepare", value: 0});
                    var tagset = {};
                    $("#tagBoxes input:checked").each(function(index, element) {
                        var members = model.get("members", {}).items;
                        var id = parseInt(element.value);
                        tagset[id] = members[id];
                    });

                    var msg = {
                        type: $("select[name=vis_"+id_item+"]", self.element).val(),
                        body:  $("textarea", self.element)[0].value,            
                        signed: self._allowAnonymous ? $("input[value=anonymous]:not(:checked)", self.element).length : 1,
                        marks: {},
                        title: $("input[value=title]:checked", self.element).length,
                        tags: tagset
                    };
                    
                    
                    if ($("input[value=question]:checked", self.element).length){
                        msg.marks.question = true;
                    }
                    var component_name;
                    var file = model.o.file[self._file];
                    if (!(self._note)){ //new note, local or global
                        var s_inv, fudge, drawingarea, s_inv_w, s_inv_h;
                        msg.id_ensemble =file.ID_ensemble;
                        msg.id_source=self._file;
                        switch (file.filetype){
                        case FILETYPES.TYPE_PDF: 
                            s_inv =        100*$.concierge.get_constant("RESOLUTION_COORDINATES") / ($.concierge.get_constant("res")*$.concierge.get_state("scale")+0.0);
                            fudge = (file.rotation === 90 || file.rotation === 270 ? file.h : file.w)/612.0;
                            s_inv = s_inv/fudge;
                            msg.top = self._sel ? s_inv*parseInt(self._sel.css("top"), 10):0;
                            msg.left= self._sel ? s_inv*parseInt(self._sel.css("left"), 10):0;
                            msg.w =  self._sel ? s_inv*self._sel.width():0;
                            msg.h =  self._sel ? s_inv*self._sel.height():0;
                            msg.x0= 0;
                            msg.y0= 0;
                            msg.page= self._sel ? self._sel.parent().attr("page"):0;
                            break;
                        case FILETYPES.TYPE_HTML5: 
                            msg.top = self._html5range.apparent_height;
                            msg.left= 0;
                            msg.w = 0;
                            msg.h = 0;
                            msg.x0= 0;
                            msg.y0= 0;
                            msg.page= 1;
                            delete self._html5range.apparent_height;
                            msg.html5range = self._html5range;
                            break;
                        case FILETYPES.TYPE_HTML5VIDEO:
                            throw "editorview: HTML5VIDEO not implemented";
                        case FILETYPES.TYPE_YOUTUBE:
                            drawingarea = self._sel.parent();
                            var durationBox = $("#duration")[0];
			    //var durationBox = drawingarea.parent().parent().find("#durationInput")[0];
                            s_inv_w = 1000.0/drawingarea.width();
                            s_inv_h = 1000.0/drawingarea.height();
                            msg.top = self._sel ? s_inv_h*parseInt(self._sel.css("top"), 10):0;
                            msg.left= self._sel ? s_inv_w*parseInt(self._sel.css("left"), 10):0;
                            msg.w =  self._sel ? s_inv_w*self._sel.width():0;
                            msg.h =  self._sel ? s_inv_h*self._sel.height():0;
                            msg.x0= 0;
                            msg.y0= 0;
                            msg.page= self._sel ? drawingarea.attr("page"):0;
			    msg.duration = self._sel ? Math.floor(parseFloat(durationBox.value)*self._SEC_MULT_FACTOR):0;
                            break;
                        }
                        component_name =  "note_creator";
                    }
                    else{ //reply or edit
                        msg.id_location = self._note.ID_location;
                        msg.id_ensemble = model.o.location[msg.id_location].id_ensemble;
                        if  (self._doEdit){
                            msg.id_comment = self._note.ID;
                            component_name =  "note_editor";
                            console.log(self._sel);
                            if (file.filetype === FILETYPES.TYPE_YOUTUBE && self._videoCover) {
                                msg.page = parseInt(self._videoCover.attr("page"));
                                msg.duration = Math.floor(parseFloat($("#duration")[0].value)*self._SEC_MULT_FACTOR);
                            }
                        }
                        else{
                            msg.id_parent = self._note.ID;
                            component_name =  "note_creator";
                        }
                    }
                    console.log(msg);
                    $.concierge.get_component(component_name)(msg, f_on_save);
                    $.concierge.trigger({type: "editor_saving", value: 0});
                };

		var f_set_start = function() {
		    $.concierge.trigger({type: "set_start_time"});
		};

		var f_set_end = function() {
		    $.concierge.trigger({type: "set_end_time"});
		};

                $("button[action=save]",self.element).click(f_save);
                $("button[action=discard]",self.element).click(f_discard);
		if (allow_time_set) {
		    $("button[action=start]",self.element).click(f_set_start);
		    $("button[action=end]",self.element).click(f_set_end);
		}
                if (self._sel){
                    var p = self._selection.parent();
                    // Make annotation box resizable
                    self._sel.addClass("ui-drawable-selection").removeClass("ui-drawable-helper").resizable().appendTo(p).draggable({drag: f_sel, containment: 'parent' });
                    //animate transition so user understands that the editor is connected to the selection
                    self._sel.effect("transfer",{to: self.element} , 500);
                }        
                self.element.addClass("editor");

                //if editing: fill in w/ exising values. 
                if (self._doEdit){
                    $("textarea", self.element)[0].value = self._note.body;
                    $("input[name=vis_"+id_item+"]:checked", self.element).removeAttr("checked");
                    $("input[name=vis_"+id_item+"][value="+self._note.type+"]", self.element).attr("checked", "checked");
                    if (self._note.signed){
                        $("input[value=anonymous]", self.element).removeAttr("checked");
                    }
                    else{
                        $("input[value=anonymous]", self.element).attr("checked", "checked");
                    }
                }

                if (suppress_focus !== true || typeof suppress_focus === 'undefined') {
                    $("textarea", self.element).focus();
                }
            },
            set_model: function(model){
                var self=this;
                self._model =  model;
                var id_source = $.concierge.get_state("file");
                self._file =  id_source ; 
                // add this to be notified of model events: 
                //model.register($.ui.view.prototype.get_adapter.call(this),  {YOUR_EVENT1: null});
            },
            update: function(action, payload, items_fieldname){
            }
        });
             
    $.widget("ui.editorview",V_OBJ );
    $.ui.editorview.prototype.options = {
        listens: {
            new_thread: null, 
            reply_thread: null, 
            edit_thread: null,
            focus_thread: null,
            discard_if_empty: null,
	    set_duration_box: null,
	    set_video_cover: null
        },
        id_source: null, 
        note: null, 
        doEdit: false, 
        selection: null, 
        model: null, 
        allowAnonymous: false, 
        allowStaffOnly: false
    };
})(jQuery);

/**
 * NB.js: Main module file
 *
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */
var NB;

if (NB && (typeof NB !== "object")){
    alert("Error: NB already exists and isn't an object!");
}

NB = {};

NB.log = function(){
    if (window.console){
	console.log(arguments);
    }
};

NB.warn = function(){
    if (window.console){
	console.warn(arguments);
    }
};

NB.error = function(){
    if (window.console){
	console.error(arguments);
    }
};

NB.len = function(o){
    var i = 0;
    for (i in o){
	i++;
    }
    return i;
};




/**
 * auth.js: Convenience fcts for AUTH manipulation
 * see: http://www.elated.com/articles/javascript-and-cookies
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/

(function(GLOB){
    GLOB.auth = {};
    GLOB.auth.set_cookie = function( name, value, expires_year, expires_month, expires_day, path, domain, secure ){
	var cookie_string = name + "=" + escape ( value );
    
	if ( expires_year )  {
	    var expires = new Date ( expires_year, expires_month, expires_day );
	    cookie_string += "; expires=" + expires.toGMTString();
	}

	if ( path ){
	    cookie_string += "; path=" + escape ( path );
	} else {
	    cookie_string += "; path=/";
	}

	if ( domain ){
	    cookie_string += "; domain=" + escape ( domain );
	}
	if ( secure ){
	    cookie_string += "; secure";
	}
	document.cookie = cookie_string;
    };

    GLOB.auth.delete_cookie =function( cookie_name , path){
	document.cookie = cookie_name 
	    + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=" 
	    + (path ? escape (path) : "/")
	    + ";"
    };

    GLOB.auth.get_cookie = function ( cookie_name ){
	var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
	if ( results ){
	    return ( unescape ( results[2] ) );
	}
	else{
	    return null;
	}
    };
})(NB);

/**
 * dom.js: Convenience fcts for DOM manipulation
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/

(function(GLOB){
    if ("NB$" in window){
	var $ = NB$;
    };
    GLOB.dom = {};
    GLOB.dom.elementItem = function(node, n){ //0-based    
	var i=0;
	var child = node.firstChild;
	while(true){
	    while (child.nodeType != 1){
		child = child.nextSibling;
	    }
	    if (i==n){
		return child;
	    }
	    else{
		i++;
		child = child.nextSibling;
	    }
	}
    };



    GLOB.dom.firstElement = function(node){
	var child = node.firstChild;
	while (child.nodeType != 1){
	    child = child.nextSibling;
	}
	return child;
    };

    GLOB.dom.previousElement = function(node){
	var n = node.previousSibling;
	while(n){
	    if (n.nodeType == 1){
		return n;
	    }
	    else{
		n = n.previousSibling;
	    }
	}
	return null;
    };


    GLOB.dom.nextElement = function(node){
	var n = node.nextSibling;
	while(n){
	    if (n.nodeType == 1){
		return n;
	    }
	    else{
		n = n.nextSibling;
	    }
	}
	return null;
    };

    GLOB.dom.elementPosition = function(node){ 
	/**
	 * returns the 0-based element-position of 'node',
	 * i.e. the number of DOM **elements** that are before 'node'
	 *
	 **/
	var i = 0;
	var n = GLOB.dom.previousElement(node);
	while(n){
	    i++;
	    n= GLOB.dom.previousElement(n);
	}
	return i;
    };


    GLOB.dom.getAncestorByHasAttribute = function(elt, name){
	var parent = elt.parentNode; 	
	while(parent && (!(parent.hasAttribute(name)))){	
	    parent = parent.parentNode;
	}
	return parent;
    };

    GLOB.dom.getParams = function(){
	var s = document.location.search;
	var params = {};
	if (s != ""){	
	    s = s.substring(1);
	    var a = s.split("&");	
	    for (var i in a){
		var pos = a[i].search("=");
		var len = a[i].length;
		if (pos != -1){
		    params[a[i].substring(0,pos)] = a[i].substring(pos+1, len);
		}
	    }
	}
	return params;
    };


    GLOB.dom.__sections = {
	do_toc: false, 
	toc_id: "toc", 
	do_b2t: false
    }; //parameters. 
    GLOB.dom.addSection = function(){
	/*
	 * inspired from sections.js in stats2
	 * just need to initialize it with
	 *     $("div.section").each(GLOB.dom.addSection);
	 */
	var title = this.getAttribute("label");
	if (GLOB.dom.__sections.do_toc){
	    $("#"+GLOB.dom.__sections.toc_id).append("<a href='#"+this.id+"'>"+title+"</a>");
	}
	$(this).children().wrapAll("<div class='section-body'></div>");
	var b2t = (GLOB.dom.__sections.do_b2t) ? "<a class=\"navlink\"  href=\"#"+GLOB.dom.__sections.toc_id+"\">back to top </a>" : "";
	$(this).prepend("<div class='section-header'>"+b2t+title+"</div>");
    };
})(NB);
/**
 * mvc.js: Generic definitions for models and views
 *		NB
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/

(function(GLOB){
    GLOB.mvc = {};

    GLOB.mvc.model = function(){
	this.observers = []; 
	this.logger = null;
    };
    GLOB.mvc.model.prototype.register = function(obs, propList){
	this.observers.push({o:obs, p:propList||{}});
	//by default, relay the logger if the model has one and the view doesn't
	if ((obs.logger === null )  && (this.logger !== null)){
	    obs.setLogger(this.logger);
	}
	if (propList){
	    //transmit current state to observer, if we know what to transmit
	    obs.update("create", {model: this}, propList);
	}
    };
    GLOB.mvc.model.prototype.unregister = function(obs){
	var i;
	for (i in this.observers){
	    if (this.observers[i] == obs){
		delete this.observers[i];
		return;
	    }
	}
    };

    GLOB.mvc.model.prototype.setLogger = function(logger){
	this.logger = logger;
    };

    GLOB.mvc.model.prototype.info = function(msg){
	if (this.logger !== null){
	    this.logger.info(msg);
	}
    };


    GLOB.mvc.model.prototype.warning = function(msg){
	if (this.logger !== null){
	    this.logger.warning(msg);
	}
    };

    GLOB.mvc.model.prototype.error = function(msg){
	if (this.logger !== null){
	    this.logger.error(msg);
	}
    };

    //GLOB.mvc.model.prototype.modify = function(){alert("[GLOB.mvc.model.prototype.modify] I'm virtual");};

    GLOB.mvc.view = function(){
	this.id = (new Date()).getTime(); //this will generate a default id for the view
	this.logger = null;
    };

    GLOB.mvc.view.prototype.setLogger = function(logger){
	this.logger = logger;
    };

    GLOB.mvc.view.prototype.info = function(msg){
	if (this.logger !== null){
	    this.logger.info(msg);
	}
    };


    GLOB.mvc.view.prototype.warning = function(msg){
	if (this.logger !== null){
	    this.logger.warning(msg);
	}
    };

    GLOB.mvc.view.prototype.error = function(msg){
	if (this.logger !== null){
	    this.logger.error(msg);
	}
    };

    //GLOB.mvc.view.prototype.update = function(){alert("[GLOB.mvc.view.prototype.update] I'm virtual");};

    /** 
     * COLLECTION: Collection of objects that have an unique "id" field
     * note: the current implemetation can return undefinied items if they have been deleted
     */
    GLOB.mvc.collection = function(type){
	this.superclass();
	this.items = {};//indexed by item.id
	this.type = type; //sometimes useful to specify a collection of what...
    }; 
    GLOB.mvc.collection.prototype = new GLOB.mvc.model();
    GLOB.mvc.collection.prototype.constructor = GLOB.mvc.collection;
    GLOB.mvc.collection.prototype.superclass = GLOB.mvc.model;
    GLOB.mvc.collection.prototype.modify = function(action, payload, items_fieldname){
	var i;
	var items = payload[items_fieldname];
	if (action == "create"){	
	    for (i=0;i<items.length;i++){
		this.items[items[i].id] = items[i];
	    }
	}
	else if (action == "add" || action == "update"){
	    for (i=0;i<items.length;i++){
		this.items[items[i].id] = items[i];
	    }
	}
	else if (action == "delete"){
	    for (i=0;i<items.length;i++){
		delete this.items[items[i].id];
	    }
	}
	else{
	    alert("[GLOB.mvc.collection.modify] unknown action: " + action);
	    return;
	}
	for (i in this.observers){
	    this.observers[i].o.update(action, {"model": this, "diff": payload}, items_fieldname);
	}
    };

    GLOB.mvc.collection.prototype.getItems = function(){
	return this.items;
    };

    GLOB.mvc.collection.prototype.get = function(id){
	return this.items[id];
    };

})(NB);


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
(function(GLOB){
    //require: mvc;
    GLOB.models = {};

    /*
     * Collections of Tables relevant to document management
     */
    GLOB.models.Store = function(){
    this.superclass();
    this.o = {}; //objects
    this.indexes = {}; //existing indexes
    this.rangeindex_info = {}; // index name -> {fieldname, width}
    this.schema =null;
    }; 
    GLOB.models.Store.prototype = new GLOB.mvc.model();
    GLOB.models.Store.prototype.constructor = GLOB.models.Store;
    GLOB.models.Store.prototype.superclass = GLOB.mvc.model;
    GLOB.models.Store.prototype.create = function(payload, schema){
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
    var self=this;
    var tabledef, pFieldName, obs;
    if (schema === undefined){
        schema = {};
        //make up a default schema: just use all the fields from payload
        for (var k in payload){
        schema[k] = null;
        }
    }
    this.schema = schema;
    for (var type_name in schema){
        if  (type_name.substring(0,2) === "__"){
        throw new Error("table names can't start w/ '__' , tablename="+type_name); 
        }
        tabledef = schema[type_name];    
        if (tabledef===null){
        tabledef = {pFieldName: type_name};
        }
        pFieldName = tabledef.pFieldName;
        if (pFieldName in payload){
        /*
         * this can cover scenarios like: 
         * this.ensembles = payload.channels
         * OR
         * this.Ensembles = {123: new Ensemble(payload.channels[123], ...}
         */
        if ("obj_type" in tabledef){//need to apply constructor
            for (var id in payload[pFieldName]){
            this.o[type_name][id] = new tabledef.obj_type(payload[pFieldName][id]);
            }
        }
        else{//just lazy copy
            this.o[type_name] =  payload[pFieldName];
        }
        
        }
        else{ //just create an empty table
        if (!(type_name in this.o)){
            this.o[type_name]={};
        }
        }
        for (var i in this.observers){
        obs = self.observers[i];
        if (type_name in obs.p){
            obs.o.update("create", {model: self, diff: this.o[type_name]}, type_name);
        }
        }
    }
    };


    GLOB.models.Store.prototype.__get_indexes = function(type_name){
    //PRE: Schema already defined. 
    var self = this, 
    indexes = {}, 
    rangeindexes = {}, 
    tabledef = self.schema[type_name], 
    ref,refs, i;
    if ("references" in tabledef){
        for (i in tabledef.references){
        ref =  tabledef.references[i];
        if (ref in self.indexes && type_name in self.indexes[ref]){
            indexes[i] =  self.indexes[ref][type_name];
        }
        }
    }
    if ("__ref" in tabledef){
        var r=/__in(\d*)$/;
        for (i in tabledef.__ref){
            refs =  tabledef.__ref[i];
            for (ref in refs){
                if (ref in self.indexes && type_name in self.indexes[ref]){
                    if (r.exec(ref)==null){
                        indexes[i]=  self.indexes[ref][type_name];
                    }
                    else{
                        rangeindexes[i] = {index: self.indexes[ref][type_name], info: self.rangeindex_info[ref]};
                    }
                }
            }
        } 
    }
    return [indexes, rangeindexes];
    };

    GLOB.models.Store.prototype.set = function(type_name, objs){
    //PRE: Schema already defined. 
    var self=this;
    if (type_name in self.schema){
        self.__dropIndexes(type_name);
        self.o[type_name] = {};
        self.add(type_name, objs);
    }
    else{
        console.log(type_name, " not found in schema: ", self.schema);
    }

    };



    GLOB.models.Store.prototype.add = function(type_name, objs){
    //PRE: Schema already defined. 
    var self=this;
    var is_update;
    if (type_name in self.schema){
        var all_indexes = self.__get_indexes(type_name);
        var regular_indexes = all_indexes[0];
        var range_indexes = all_indexes[1];
        var index,index_info, v_new, v_old, newbin, oldbin, pk, fk, fieldname;        
        for (pk in objs){
        is_update = pk in this.o[type_name];    
        //now, update existing indexes if any
        if (is_update){

            for (fieldname in  regular_indexes){
            index = regular_indexes[fieldname];            
            v_new = objs[pk][fieldname];
            v_old = this.o[type_name][pk][fieldname];
            //if the foreign key has changed, propagate the change: 
            if (v_new !== v_old){
                //regular index
                delete(index[v_old][pk]);
                if  (!(v_new in index)){
                index[v_new] = {};
                }
                index[v_new][pk]=null;
            }
            }
            for (fieldname in  range_indexes){
            index = range_indexes[fieldname].index;            
            index_info = range_indexes[fieldname].info;
            v_new = objs[pk][fieldname];
            v_old = this.o[type_name][pk][fieldname];
            //if the foreign key has changed, propagate the change: 
            if (v_new !== v_old){
                //will the new val end up affecting the bin ? 
                newbin = Math.floor(v_new/index_info.width);
                if ((!(newbin in index))||(!(pk in index[newbin]))){
                oldbin = Math.floor(v_old/index_info.width);
                delete index[oldbin][pk];
                if (!(newbin in index)){
                    index[newbin]={};
                }
                index[newbin][pk]=v_new;
                }
                else{ //still, update value;
                index[oldbin][pk]=v_new;
                }
            }
            }
        }
        else{
            for (fieldname in  regular_indexes){
            index = regular_indexes[fieldname];            
            fk = objs[pk][fieldname];
            if (!(fk in index)){
                index[fk]={};
            }
            index[fk][pk] = null;
            }
            for (fieldname in  range_indexes){
            index = range_indexes[fieldname].index;            
            index_info = range_indexes[fieldname].info;
            fk = objs[pk][fieldname];
            newbin = Math.floor(fk/index_info.width);
            if (!(newbin in index)){
                index[newbin]={};
            }
            index[newbin][pk]=fk;
            }
        }
        this.o[type_name][pk]=objs[pk];
        }
        var obs;
        for (var i in this.observers){
        obs = self.observers[i];
        if (type_name in obs.p){
            obs.o.update("add", {diff: objs}, type_name);
        }
        }
    }
    else{
        console.error(type_name, " not found in schema: ", self.schema);
    }
    };


    GLOB.models.Store.prototype.remove = function(type_name, pkeys){
    /* 
       pkeys can either be 
       - in integer (i.e. the primary key of a single object to remove)
       - dictionary of integer keys (values are disregarded): in this case, we only issue 1 notification to the observers (for performance), once all the objects have been removed. 
    */
    var self = this;
    var ids = {};
    if (typeof(pkeys) === "object"){
        ids = pkeys;
    }
    else{
        ids[pkeys] = null;
    }
    var id = null;
    var objs_deleted = {}, index, val, index_info;
    var bin; //for range index
    for (id in ids){
        if ((type_name in this.o) && (id in this.o[type_name])){
        objs_deleted[id]=this.o[type_name][id];
        var all_indexes = self.__get_indexes(type_name);
        var regular_indexes = all_indexes[0];
        var range_indexes = all_indexes[1];
        for (var fieldname in regular_indexes){
            index = regular_indexes[fieldname];            
            val = this.o[type_name][id][fieldname];
            delete(index[val][id]);
        }
        for (fieldname in range_indexes){
            index = range_indexes[fieldname].index;            
            index_info = range_indexes[fieldname].info;
            val = this.o[type_name][id][fieldname];
            bin =  Math.floor(val/index_info.width);
            delete(index[bin][id]);
        }
        delete(this.o[type_name][id]);
        }
        var did_delete = false;
        for (var i in objs_deleted){
        did_delete = true;
        break;
        }
        if (did_delete){
        var obs;
        for (i in this.observers){
            obs = self.observers[i];
            if (type_name in obs.p){
            obs.o.update("remove", {diff: objs_deleted}, type_name);
            }
        }
        }
    }
    };

    GLOB.models.Store.prototype.__dropIndexes = function(type_name){
        var self = this;
        var tabledef = self.schema[type_name];
        var ref, i, j, refs;
        if ("references" in tabledef){
            for (i in tabledef.references){
                ref =  tabledef.references[i];
                if (ref in self.indexes && type_name in self.indexes[ref]){
                    delete self.indexes[ref][type_name];
                }
            }
        }
        if ("__ref" in tabledef){
            for (i in tabledef.__ref){
                refs =  tabledef.__ref[i];
                for (ref in refs){
                    if (ref in self.indexes && type_name in self.indexes[ref]){
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
    GLOB.models.Store.prototype.__addIndex = function(table, o, fieldname){
    var self = this;
    // '__..." is a reserved family of tablenames so we can add indexes on fields that aren't references. 
    
    if (table.substring(0,2) !== "__" && ((!(table in self.o))||(!(o in self.o)))){
        throw new Error("missing table, args="+table+", "+o ); 
    }
    
    if (table.substring(0,2) === "__"){
        if (!("__ref" in self.schema[o])){
            self.schema[o].__ref = {};
        }    
        if (!(self.schema[o].__ref[fieldname])){
            self.schema[o].__ref[fieldname] = {};
        } 
        self.schema[o].__ref[fieldname][table] = null;
    }
    
    if (!(table in self.indexes)){
        self.indexes[table]={};
    }
    if (!(o in self.indexes[table])){
        self.indexes[table][o]={};
    }
    var objects =  self.o[o];
    for (var i in objects){
        var key = objects[i][fieldname];
        if (!(key in self.indexes[table][o])){
        self.indexes[table][o][key] = {};
        }
        self.indexes[table][o][key][i]=null;
    }
    };

    /**
     * Same as add index except that this one is used to perform lookups with a range of keys
     *
     */
    GLOB.models.Store.prototype.__addRangeIndex = function(table, o, fieldname, width){  
    var self = this;

    if (!("__ref" in self.schema[o])){
        self.schema[o].__ref = {};
    }    
    if (!(self.schema[o].__ref[fieldname])){
        self.schema[o].__ref[fieldname] = {};
    }
     self.schema[o].__ref[fieldname][table] = null;
    
    if (!(table in self.indexes)){
        self.indexes[table]={};
    }
    if (!(o in self.indexes[table])){
        self.indexes[table][o]={};
    }
    var key, i, bin;
    var objects =  self.o[o];
    for (i in objects){
        key = objects[i][fieldname];
        bin = Math.floor(key/width);
        if (!(bin in self.indexes[table][o])){
        self.indexes[table][o][bin] = {};
        }
        self.indexes[table][o][bin][i]=key;
    }
    self.rangeindex_info[table] = {fieldname: fieldname, width: width};
    };
    GLOB.models.QuerySet = function(model, type){
    this.model = model;
    this.type = type;
    this.__length = null;
    this.items = {};
    };



    GLOB.models.QuerySet.prototype.is_empty = function(){
    var items = this.items;
    for (var i in items){
        return false;
    }
    return true;
    };

    GLOB.models.QuerySet.prototype.length = function(){
    if (this.__length !== null){ //speedup if gets called multiple times
        return this.__length;
    }
    var l=0; 
    var items = this.items;
    for (var i in items){
        l++;
    }
    this.__length = l;
    return l;
    };

    GLOB.models.QuerySet.prototype.sort = function(sortfct){
    //returns an array of sorted objects. 
    var output = [];
    var items = this.items;
    for (var i in items){
        output.push(items[i]);
    }
    output.sort(sortfct);
    return output;
    };

    GLOB.models.QuerySet.prototype.min = function(attr){
    // returns pk of record which has the min value for attr
    var x = Number.POSITIVE_INFINITY;
    var items = this.items;
    var output = null;
    for (var i in items){
        if (items[i][attr]<x){
        x = items[i][attr];
        output = i;
        }
    }
    return output;
    };


    GLOB.models.QuerySet.prototype.max = function(attr){
    // returns pk of record which has the max value for attr
    var x = Number.NEGATIVE_INFINITY;
    var output = null;
    var items = this.items;
    for (var i in items){
        if (items[i][attr]>x){
        x = items[i][attr];
        output = i;
        }
    }
    return output;
    };


    GLOB.models.QuerySet.prototype.first = function(){
    /*caution: this doesn't imply any order: it just picks the 1st record it finds*/
    var output = null;
    var items = this.items;
    for (var i in items){
        return items[i];
    }
    return null;
    };

    GLOB.models.QuerySet.prototype.values = function(fieldname){
    var output = {};
    var items = this.items;
    for (var i in items){
        output[items[i][fieldname]] = null;
    } 
    return output;
    };

    GLOB.models.QuerySet.prototype.intersect = function(ids, field){
    /**
     *  ids: a dictionary (only keys matter, not values), or just a single value
     */    
    var model = this.model, 
    output = new GLOB.models.QuerySet(this.model, this.type), 
    items = this.items, 
    new_items = output.items, 
    i;
    
    if (!(ids instanceof Object)){
        var new_ids = {};
        new_ids[ids] = null;
        ids = new_ids;
    }
    if (field !== undefined){ 
        for (i in items){
        if (items[i][field] in ids){
            new_items[i] =items[i];
        }
        }
    }
    else{
        for (i in items){
        if (i in ids){
            new_items[i] =items[i];
        }
        } 
    }
    return output;
    };

    GLOB.models.QuerySet.prototype.exclude = function(where){
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
    var i=null;
    var ref; 
    var references = model.schema[this.type].references || {};
    var from = this.type;
    var o = {};
    var o_old = null;
    for (i in where){
        ref = i in references ?  references[i] : "__"+i;
        if ( (!(ref in model.indexes)) || (!(from in model.indexes[ref])) ){
        model.__addIndex(ref, from, i);
        }
        o = model.indexes[ref][from][where[i]] || {};
        o = GLOB.models.__intersect(o_old, o);
        o_old = o;
    }
    if (i==null){ //there was no where clause: return all objects
        o = this.o[from];
    }
    //Now remove objects that have an id in o: 
    var items = this.items;   
    var n_removed = 0;
    for (i in o){
        delete items[i];
        n_removed++;
    }
    if (this.__length !== null){ //update length if already computed
        this.__length-=n_removed;
    }
    return this;
    };

    GLOB.models.__intersect = function(o1, o2){
    if (o1==null){ return o2 || {};}
    if (o2==null){   return o1 || {};}
    var o = {};
    for (var i in o1){
        if (i in o2){o[i] = null;}
    }
    return o;
    };
    
    GLOB.models.Store.prototype.get = function(from, where){
    var self = this;
    var o_old = null;
    var o = {};
    var output = new GLOB.models.QuerySet(self, from);
    var f = this;
    var ref; 
    var references={};
    var i=null;
    var r = /(.*)__in$/; //for range querying
    var matches, v, width, bin, idx;

    if (self.schema[from] && self.schema[from].references) {
	references = self.schema[from].references;
	}
    for (i in where){
        matches = r.exec(i);
        if (matches !== null){ //range query
        v = (where[i][0] + where[i][1])>>1; //half-point. 
        width = where[i][1] - where[i][0];
        ref = "__"+i+width;
        if (!(ref in self.indexes)){
            self.__addRangeIndex(ref, from ,matches[1], width );
        }
        o = {};
        var bins = [Math.floor(where[i][0]/width), Math.floor(where[i][1]/width)];
        for (var b = 0;b<bins.length;b++){
            bin = bins[b];
            idx = self.indexes[ref][from][bin];
            for (var oid in idx){
            if (idx[oid] >= where[i][0] && idx[oid] <= where[i][1]){
                o[oid] = null;
            }
            }
        }
        
        }
        else{
        v = where[i];
        ref = i in references ?  references[i] : "__"+i;
        if ( (!(ref in self.indexes)) || (!(from in self.indexes[ref])) ){
            self.__addIndex(ref, from, i);
        }
        o =  self.indexes[ref][from][v] || {};
        }
        o = GLOB.models.__intersect(o_old, o);
        o_old = o;
    }
    if (i==null){ //there was no where clause: return all objects
        o = self.o[from];
    }

    //we now have a list of IDs in o. Just need to attach the objects: 
    var items = output.items;
    for (i in o){
        items[i] = self.o[from][i];
    }
    return output;
    };
})(NB);

/**
 * Rangy, a cross-browser JavaScript range and selection library
 * https://github.com/timdown/rangy
 *
 * Copyright 2015, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3.0
 * Build date: 10 May 2015
 */
!function(e,t){"function"==typeof define&&define.amd?define(e):"undefined"!=typeof module&&"object"==typeof exports?module.exports=e():t.rangy=e()}(function(){function e(e,t){var n=typeof e[t];return n==N||!(n!=C||!e[t])||"unknown"==n}function t(e,t){return!(typeof e[t]!=C||!e[t])}function n(e,t){return typeof e[t]!=E}function r(e){return function(t,n){for(var r=n.length;r--;)if(!e(t,n[r]))return!1;return!0}}function o(e){return e&&O(e,T)&&D(e,w)}function i(e){return t(e,"body")?e.body:e.getElementsByTagName("body")[0]}function a(t){typeof console!=E&&e(console,"log")&&console.log(t)}function s(e,t){b&&t?alert(e):a(e)}function c(e){I.initialized=!0,I.supported=!1,s("Rangy is not supported in this environment. Reason: "+e,I.config.alertOnFail)}function d(e){s("Rangy warning: "+e,I.config.alertOnWarn)}function f(e){return e.message||e.description||String(e)}function u(){if(b&&!I.initialized){var t,n=!1,r=!1;e(document,"createRange")&&(t=document.createRange(),O(t,y)&&D(t,S)&&(n=!0));var s=i(document);if(!s||"body"!=s.nodeName.toLowerCase())return void c("No body element found");if(s&&e(s,"createTextRange")&&(t=s.createTextRange(),o(t)&&(r=!0)),!n&&!r)return void c("Neither Range nor TextRange are available");I.initialized=!0,I.features={implementsDomRange:n,implementsTextRange:r};var d,u;for(var l in x)(d=x[l])instanceof p&&d.init(d,I);for(var h=0,g=M.length;g>h;++h)try{M[h](I)}catch(m){u="Rangy init listener threw an exception. Continuing. Detail: "+f(m),a(u)}}}function l(e,t,n){n&&(e+=" in module "+n.name),I.warn("DEPRECATED: "+e+" is deprecated. Please use "+t+" instead.")}function h(e,t,n,r){e[t]=function(){return l(t,n,r),e[n].apply(e,P.toArray(arguments))}}function g(e){e=e||window,u();for(var t=0,n=k.length;n>t;++t)k[t](e)}function p(e,t,n){this.name=e,this.dependencies=t,this.initialized=!1,this.supported=!1,this.initializer=n}function m(e,t,n){var r=new p(e,t,function(t){if(!t.initialized){t.initialized=!0;try{n(I,t),t.supported=!0}catch(r){var o="Module '"+e+"' failed to load: "+f(r);a(o),r.stack&&a(r.stack)}}});return x[e]=r,r}function R(){}function v(){}var C="object",N="function",E="undefined",S=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer"],y=["setStart","setStartBefore","setStartAfter","setEnd","setEndBefore","setEndAfter","collapse","selectNode","selectNodeContents","compareBoundaryPoints","deleteContents","extractContents","cloneContents","insertNode","surroundContents","cloneRange","toString","detach"],w=["boundingHeight","boundingLeft","boundingTop","boundingWidth","htmlText","text"],T=["collapse","compareEndPoints","duplicate","moveToElementText","parentElement","select","setEndPoint","getBoundingClientRect"],O=r(e),_=r(t),D=r(n),A=[].forEach?function(e,t){e.forEach(t)}:function(e,t){for(var n=0,r=e.length;r>n;++n)t(e[n],n)},x={},b=typeof window!=E&&typeof document!=E,P={isHostMethod:e,isHostObject:t,isHostProperty:n,areHostMethods:O,areHostObjects:_,areHostProperties:D,isTextRange:o,getBody:i,forEach:A},I={version:"1.3.0",initialized:!1,isBrowser:b,supported:!0,util:P,features:{},modules:x,config:{alertOnFail:!1,alertOnWarn:!1,preferTextRange:!1,autoInitialize:typeof rangyAutoInitialize==E?!0:rangyAutoInitialize}};I.fail=c,I.warn=d;var B;({}).hasOwnProperty?(P.extend=B=function(e,t,n){var r,o;for(var i in t)t.hasOwnProperty(i)&&(r=e[i],o=t[i],n&&null!==r&&"object"==typeof r&&null!==o&&"object"==typeof o&&B(r,o,!0),e[i]=o);return t.hasOwnProperty("toString")&&(e.toString=t.toString),e},P.createOptions=function(e,t){var n={};return B(n,t),e&&B(n,e),n}):c("hasOwnProperty not supported"),b||c("Rangy can only run in a browser"),function(){var e;if(b){var t=document.createElement("div");t.appendChild(document.createElement("span"));var n=[].slice;try{1==n.call(t.childNodes,0)[0].nodeType&&(e=function(e){return n.call(e,0)})}catch(r){}}e||(e=function(e){for(var t=[],n=0,r=e.length;r>n;++n)t[n]=e[n];return t}),P.toArray=e}();var H;b&&(e(document,"addEventListener")?H=function(e,t,n){e.addEventListener(t,n,!1)}:e(document,"attachEvent")?H=function(e,t,n){e.attachEvent("on"+t,n)}:c("Document does not have required addEventListener or attachEvent method"),P.addListener=H);var M=[];P.deprecationNotice=l,P.createAliasForDeprecatedMethod=h,I.init=u,I.addInitListener=function(e){I.initialized?e(I):M.push(e)};var k=[];I.addShimListener=function(e){k.push(e)},b&&(I.shim=I.createMissingNativeApi=g,h(I,"createMissingNativeApi","shim")),p.prototype={init:function(){for(var e,t,n=this.dependencies||[],r=0,o=n.length;o>r;++r){if(t=n[r],e=x[t],!(e&&e instanceof p))throw new Error("required module '"+t+"' not found");if(e.init(),!e.supported)throw new Error("required module '"+t+"' not supported")}this.initializer(this)},fail:function(e){throw this.initialized=!0,this.supported=!1,new Error(e)},warn:function(e){I.warn("Module "+this.name+": "+e)},deprecationNotice:function(e,t){I.warn("DEPRECATED: "+e+" in module "+this.name+" is deprecated. Please use "+t+" instead")},createError:function(e){return new Error("Error in Rangy "+this.name+" module: "+e)}},I.createModule=function(e){var t,n;2==arguments.length?(t=arguments[1],n=[]):(t=arguments[2],n=arguments[1]);var r=m(e,n,t);I.initialized&&I.supported&&r.init()},I.createCoreModule=function(e,t,n){m(e,t,n)},I.RangePrototype=R,I.rangePrototype=new R,I.selectionPrototype=new v,I.createCoreModule("DomUtil",[],function(e,t){function n(e){var t;return typeof e.namespaceURI==b||null===(t=e.namespaceURI)||"http://www.w3.org/1999/xhtml"==t}function r(e){var t=e.parentNode;return 1==t.nodeType?t:null}function o(e){for(var t=0;e=e.previousSibling;)++t;return t}function i(e){switch(e.nodeType){case 7:case 10:return 0;case 3:case 8:return e.length;default:return e.childNodes.length}}function a(e,t){var n,r=[];for(n=e;n;n=n.parentNode)r.push(n);for(n=t;n;n=n.parentNode)if(M(r,n))return n;return null}function s(e,t,n){for(var r=n?t:t.parentNode;r;){if(r===e)return!0;r=r.parentNode}return!1}function c(e,t){return s(e,t,!0)}function d(e,t,n){for(var r,o=n?e:e.parentNode;o;){if(r=o.parentNode,r===t)return o;o=r}return null}function f(e){var t=e.nodeType;return 3==t||4==t||8==t}function u(e){if(!e)return!1;var t=e.nodeType;return 3==t||8==t}function l(e,t){var n=t.nextSibling,r=t.parentNode;return n?r.insertBefore(e,n):r.appendChild(e),e}function h(e,t,n){var r=e.cloneNode(!1);if(r.deleteData(0,t),e.deleteData(t,e.length-t),l(r,e),n)for(var i,a=0;i=n[a++];)i.node==e&&i.offset>t?(i.node=r,i.offset-=t):i.node==e.parentNode&&i.offset>o(e)&&++i.offset;return r}function g(e){if(9==e.nodeType)return e;if(typeof e.ownerDocument!=b)return e.ownerDocument;if(typeof e.document!=b)return e.document;if(e.parentNode)return g(e.parentNode);throw t.createError("getDocument: no document found for node")}function p(e){var n=g(e);if(typeof n.defaultView!=b)return n.defaultView;if(typeof n.parentWindow!=b)return n.parentWindow;throw t.createError("Cannot get a window object for node")}function m(e){if(typeof e.contentDocument!=b)return e.contentDocument;if(typeof e.contentWindow!=b)return e.contentWindow.document;throw t.createError("getIframeDocument: No Document object found for iframe element")}function R(e){if(typeof e.contentWindow!=b)return e.contentWindow;if(typeof e.contentDocument!=b)return e.contentDocument.defaultView;throw t.createError("getIframeWindow: No Window object found for iframe element")}function v(e){return e&&P.isHostMethod(e,"setTimeout")&&P.isHostObject(e,"document")}function C(e,t,n){var r;if(e?P.isHostProperty(e,"nodeType")?r=1==e.nodeType&&"iframe"==e.tagName.toLowerCase()?m(e):g(e):v(e)&&(r=e.document):r=document,!r)throw t.createError(n+"(): Parameter must be a Window object or DOM node");return r}function N(e){for(var t;t=e.parentNode;)e=t;return e}function E(e,n,r,i){var s,c,f,u,l;if(e==r)return n===i?0:i>n?-1:1;if(s=d(r,e,!0))return n<=o(s)?-1:1;if(s=d(e,r,!0))return o(s)<i?-1:1;if(c=a(e,r),!c)throw new Error("comparePoints error: nodes have no common ancestor");if(f=e===c?c:d(e,c,!0),u=r===c?c:d(r,c,!0),f===u)throw t.createError("comparePoints got to case 4 and childA and childB are the same!");for(l=c.firstChild;l;){if(l===f)return-1;if(l===u)return 1;l=l.nextSibling}}function S(e){var t;try{return t=e.parentNode,!1}catch(n){return!0}}function y(e){if(!e)return"[No node]";if(k&&S(e))return"[Broken node]";if(f(e))return'"'+e.data+'"';if(1==e.nodeType){var t=e.id?' id="'+e.id+'"':"";return"<"+e.nodeName+t+">[index:"+o(e)+",length:"+e.childNodes.length+"]["+(e.innerHTML||"[innerHTML not supported]").slice(0,25)+"]"}return e.nodeName}function w(e){for(var t,n=g(e).createDocumentFragment();t=e.firstChild;)n.appendChild(t);return n}function T(e,t,n){var r=I(e),o=e.createElement("div");o.contentEditable=""+!!n,t&&(o.innerHTML=t);var i=r.firstChild;return i?r.insertBefore(o,i):r.appendChild(o),o}function O(e){return e.parentNode.removeChild(e)}function _(e){this.root=e,this._next=e}function D(e){return new _(e)}function A(e,t){this.node=e,this.offset=t}function x(e){this.code=this[e],this.codeName=e,this.message="DOMException: "+this.codeName}var b="undefined",P=e.util,I=P.getBody;P.areHostMethods(document,["createDocumentFragment","createElement","createTextNode"])||t.fail("document missing a Node creation method"),P.isHostMethod(document,"getElementsByTagName")||t.fail("document missing getElementsByTagName method");var B=document.createElement("div");P.areHostMethods(B,["insertBefore","appendChild","cloneNode"]||!P.areHostObjects(B,["previousSibling","nextSibling","childNodes","parentNode"]))||t.fail("Incomplete Element implementation"),P.isHostProperty(B,"innerHTML")||t.fail("Element is missing innerHTML property");var H=document.createTextNode("test");P.areHostMethods(H,["splitText","deleteData","insertData","appendData","cloneNode"]||!P.areHostObjects(B,["previousSibling","nextSibling","childNodes","parentNode"])||!P.areHostProperties(H,["data"]))||t.fail("Incomplete Text Node implementation");var M=function(e,t){for(var n=e.length;n--;)if(e[n]===t)return!0;return!1},k=!1;!function(){var t=document.createElement("b");t.innerHTML="1";var n=t.firstChild;t.innerHTML="<br />",k=S(n),e.features.crashyTextNodes=k}();var L;typeof window.getComputedStyle!=b?L=function(e,t){return p(e).getComputedStyle(e,null)[t]}:typeof document.documentElement.currentStyle!=b?L=function(e,t){return e.currentStyle?e.currentStyle[t]:""}:t.fail("No means of obtaining computed style properties found"),_.prototype={_current:null,hasNext:function(){return!!this._next},next:function(){var e,t,n=this._current=this._next;if(this._current)if(e=n.firstChild)this._next=e;else{for(t=null;n!==this.root&&!(t=n.nextSibling);)n=n.parentNode;this._next=t}return this._current},detach:function(){this._current=this._next=this.root=null}},A.prototype={equals:function(e){return!!e&&this.node===e.node&&this.offset==e.offset},inspect:function(){return"[DomPosition("+y(this.node)+":"+this.offset+")]"},toString:function(){return this.inspect()}},x.prototype={INDEX_SIZE_ERR:1,HIERARCHY_REQUEST_ERR:3,WRONG_DOCUMENT_ERR:4,NO_MODIFICATION_ALLOWED_ERR:7,NOT_FOUND_ERR:8,NOT_SUPPORTED_ERR:9,INVALID_STATE_ERR:11,INVALID_NODE_TYPE_ERR:24},x.prototype.toString=function(){return this.message},e.dom={arrayContains:M,isHtmlNamespace:n,parentElement:r,getNodeIndex:o,getNodeLength:i,getCommonAncestor:a,isAncestorOf:s,isOrIsAncestorOf:c,getClosestAncestorIn:d,isCharacterDataNode:f,isTextOrCommentNode:u,insertAfter:l,splitDataNode:h,getDocument:g,getWindow:p,getIframeWindow:R,getIframeDocument:m,getBody:I,isWindow:v,getContentDocument:C,getRootContainer:N,comparePoints:E,isBrokenNode:S,inspectNode:y,getComputedStyleProperty:L,createTestElement:T,removeNode:O,fragmentFromNodeChildren:w,createIterator:D,DomPosition:A},e.DOMException=x}),I.createCoreModule("DomRange",["DomUtil"],function(e){function t(e,t){return 3!=e.nodeType&&(F(e,t.startContainer)||F(e,t.endContainer))}function n(e){return e.document||j(e.startContainer)}function r(e){return Q(e.startContainer)}function o(e){return new M(e.parentNode,W(e))}function i(e){return new M(e.parentNode,W(e)+1)}function a(e,t,n){var r=11==e.nodeType?e.firstChild:e;return L(t)?n==t.length?B.insertAfter(e,t):t.parentNode.insertBefore(e,0==n?t:U(t,n)):n>=t.childNodes.length?t.appendChild(e):t.insertBefore(e,t.childNodes[n]),r}function s(e,t,r){if(w(e),w(t),n(t)!=n(e))throw new k("WRONG_DOCUMENT_ERR");var o=z(e.startContainer,e.startOffset,t.endContainer,t.endOffset),i=z(e.endContainer,e.endOffset,t.startContainer,t.startOffset);return r?0>=o&&i>=0:0>o&&i>0}function c(e){for(var t,r,o,i=n(e.range).createDocumentFragment();r=e.next();){if(t=e.isPartiallySelectedSubtree(),r=r.cloneNode(!t),t&&(o=e.getSubtreeIterator(),r.appendChild(c(o)),o.detach()),10==r.nodeType)throw new k("HIERARCHY_REQUEST_ERR");i.appendChild(r)}return i}function d(e,t,n){var r,o;n=n||{stop:!1};for(var i,a;i=e.next();)if(e.isPartiallySelectedSubtree()){if(t(i)===!1)return void(n.stop=!0);if(a=e.getSubtreeIterator(),d(a,t,n),a.detach(),n.stop)return}else for(r=B.createIterator(i);o=r.next();)if(t(o)===!1)return void(n.stop=!0)}function f(e){for(var t;e.next();)e.isPartiallySelectedSubtree()?(t=e.getSubtreeIterator(),f(t),t.detach()):e.remove()}function u(e){for(var t,r,o=n(e.range).createDocumentFragment();t=e.next();){if(e.isPartiallySelectedSubtree()?(t=t.cloneNode(!1),r=e.getSubtreeIterator(),t.appendChild(u(r)),r.detach()):e.remove(),10==t.nodeType)throw new k("HIERARCHY_REQUEST_ERR");o.appendChild(t)}return o}function l(e,t,n){var r,o=!(!t||!t.length),i=!!n;o&&(r=new RegExp("^("+t.join("|")+")$"));var a=[];return d(new g(e,!1),function(t){if(!(o&&!r.test(t.nodeType)||i&&!n(t))){var s=e.startContainer;if(t!=s||!L(s)||e.startOffset!=s.length){var c=e.endContainer;t==c&&L(c)&&0==e.endOffset||a.push(t)}}}),a}function h(e){var t="undefined"==typeof e.getName?"Range":e.getName();return"["+t+"("+B.inspectNode(e.startContainer)+":"+e.startOffset+", "+B.inspectNode(e.endContainer)+":"+e.endOffset+")]"}function g(e,t){if(this.range=e,this.clonePartiallySelectedTextNodes=t,!e.collapsed){this.sc=e.startContainer,this.so=e.startOffset,this.ec=e.endContainer,this.eo=e.endOffset;var n=e.commonAncestorContainer;this.sc===this.ec&&L(this.sc)?(this.isSingleCharacterDataNode=!0,this._first=this._last=this._next=this.sc):(this._first=this._next=this.sc!==n||L(this.sc)?V(this.sc,n,!0):this.sc.childNodes[this.so],this._last=this.ec!==n||L(this.ec)?V(this.ec,n,!0):this.ec.childNodes[this.eo-1])}}function p(e){return function(t,n){for(var r,o=n?t:t.parentNode;o;){if(r=o.nodeType,Y(e,r))return o;o=o.parentNode}return null}}function m(e,t){if(rt(e,t))throw new k("INVALID_NODE_TYPE_ERR")}function R(e,t){if(!Y(t,e.nodeType))throw new k("INVALID_NODE_TYPE_ERR")}function v(e,t){if(0>t||t>(L(e)?e.length:e.childNodes.length))throw new k("INDEX_SIZE_ERR")}function C(e,t){if(tt(e,!0)!==tt(t,!0))throw new k("WRONG_DOCUMENT_ERR")}function N(e){if(nt(e,!0))throw new k("NO_MODIFICATION_ALLOWED_ERR")}function E(e,t){if(!e)throw new k(t)}function S(e,t){return t<=(L(e)?e.length:e.childNodes.length)}function y(e){return!!e.startContainer&&!!e.endContainer&&!(G&&(B.isBrokenNode(e.startContainer)||B.isBrokenNode(e.endContainer)))&&Q(e.startContainer)==Q(e.endContainer)&&S(e.startContainer,e.startOffset)&&S(e.endContainer,e.endOffset)}function w(e){if(!y(e))throw new Error("Range error: Range is not valid. This usually happens after DOM mutation. Range: ("+e.inspect()+")")}function T(e,t){w(e);var n=e.startContainer,r=e.startOffset,o=e.endContainer,i=e.endOffset,a=n===o;L(o)&&i>0&&i<o.length&&U(o,i,t),L(n)&&r>0&&r<n.length&&(n=U(n,r,t),a?(i-=r,o=n):o==n.parentNode&&i>=W(n)&&i++,r=0),e.setStartAndEnd(n,r,o,i)}function O(e){w(e);var t=e.commonAncestorContainer.parentNode.cloneNode(!1);return t.appendChild(e.cloneContents()),t.innerHTML}function _(e){e.START_TO_START=dt,e.START_TO_END=ft,e.END_TO_END=ut,e.END_TO_START=lt,e.NODE_BEFORE=ht,e.NODE_AFTER=gt,e.NODE_BEFORE_AND_AFTER=pt,e.NODE_INSIDE=mt}function D(e){_(e),_(e.prototype)}function A(e,t){return function(){w(this);var n,r,o=this.startContainer,a=this.startOffset,s=this.commonAncestorContainer,c=new g(this,!0);o!==s&&(n=V(o,s,!0),r=i(n),o=r.node,a=r.offset),d(c,N),c.reset();var f=e(c);return c.detach(),t(this,o,a,o,a),f}}function x(n,r){function a(e,t){return function(n){R(n,Z),R(Q(n),$);var r=(e?o:i)(n);(t?s:c)(this,r.node,r.offset)}}function s(e,t,n){var o=e.endContainer,i=e.endOffset;(t!==e.startContainer||n!==e.startOffset)&&((Q(t)!=Q(o)||1==z(t,n,o,i))&&(o=t,i=n),r(e,t,n,o,i))}function c(e,t,n){var o=e.startContainer,i=e.startOffset;(t!==e.endContainer||n!==e.endOffset)&&((Q(t)!=Q(o)||-1==z(t,n,o,i))&&(o=t,i=n),r(e,o,i,t,n))}var d=function(){};d.prototype=e.rangePrototype,n.prototype=new d,H.extend(n.prototype,{setStart:function(e,t){m(e,!0),v(e,t),s(this,e,t)},setEnd:function(e,t){m(e,!0),v(e,t),c(this,e,t)},setStartAndEnd:function(){var e=arguments,t=e[0],n=e[1],o=t,i=n;switch(e.length){case 3:i=e[2];break;case 4:o=e[2],i=e[3]}r(this,t,n,o,i)},setBoundary:function(e,t,n){this["set"+(n?"Start":"End")](e,t)},setStartBefore:a(!0,!0),setStartAfter:a(!1,!0),setEndBefore:a(!0,!1),setEndAfter:a(!1,!1),collapse:function(e){w(this),e?r(this,this.startContainer,this.startOffset,this.startContainer,this.startOffset):r(this,this.endContainer,this.endOffset,this.endContainer,this.endOffset)},selectNodeContents:function(e){m(e,!0),r(this,e,0,e,q(e))},selectNode:function(e){m(e,!1),R(e,Z);var t=o(e),n=i(e);r(this,t.node,t.offset,n.node,n.offset)},extractContents:A(u,r),deleteContents:A(f,r),canSurroundContents:function(){w(this),N(this.startContainer),N(this.endContainer);var e=new g(this,!0),n=e._first&&t(e._first,this)||e._last&&t(e._last,this);return e.detach(),!n},splitBoundaries:function(){T(this)},splitBoundariesPreservingPositions:function(e){T(this,e)},normalizeBoundaries:function(){w(this);var e,t=this.startContainer,n=this.startOffset,o=this.endContainer,i=this.endOffset,a=function(e){var t=e.nextSibling;t&&t.nodeType==e.nodeType&&(o=e,i=e.length,e.appendData(t.data),X(t))},s=function(e){var r=e.previousSibling;if(r&&r.nodeType==e.nodeType){t=e;var a=e.length;if(n=r.length,e.insertData(0,r.data),X(r),t==o)i+=n,o=t;else if(o==e.parentNode){var s=W(e);i==s?(o=e,i=a):i>s&&i--}}},c=!0;if(L(o))i==o.length?a(o):0==i&&(e=o.previousSibling,e&&e.nodeType==o.nodeType&&(i=e.length,t==o&&(c=!1),e.appendData(o.data),X(o),o=e));else{if(i>0){var d=o.childNodes[i-1];d&&L(d)&&a(d)}c=!this.collapsed}if(c){if(L(t))0==n?s(t):n==t.length&&(e=t.nextSibling,e&&e.nodeType==t.nodeType&&(o==e&&(o=t,i+=t.length),t.appendData(e.data),X(e)));else if(n<t.childNodes.length){var f=t.childNodes[n];f&&L(f)&&s(f)}}else t=o,n=i;r(this,t,n,o,i)},collapseToPoint:function(e,t){m(e,!0),v(e,t),this.setStartAndEnd(e,t)}}),D(n)}function b(e){e.collapsed=e.startContainer===e.endContainer&&e.startOffset===e.endOffset,e.commonAncestorContainer=e.collapsed?e.startContainer:B.getCommonAncestor(e.startContainer,e.endContainer)}function P(e,t,n,r,o){e.startContainer=t,e.startOffset=n,e.endContainer=r,e.endOffset=o,e.document=B.getDocument(t),b(e)}function I(e){this.startContainer=e,this.startOffset=0,this.endContainer=e,this.endOffset=0,this.document=e,b(this)}var B=e.dom,H=e.util,M=B.DomPosition,k=e.DOMException,L=B.isCharacterDataNode,W=B.getNodeIndex,F=B.isOrIsAncestorOf,j=B.getDocument,z=B.comparePoints,U=B.splitDataNode,V=B.getClosestAncestorIn,q=B.getNodeLength,Y=B.arrayContains,Q=B.getRootContainer,G=e.features.crashyTextNodes,X=B.removeNode;g.prototype={_current:null,_next:null,_first:null,_last:null,isSingleCharacterDataNode:!1,reset:function(){this._current=null,this._next=this._first},hasNext:function(){return!!this._next},next:function(){var e=this._current=this._next;return e&&(this._next=e!==this._last?e.nextSibling:null,L(e)&&this.clonePartiallySelectedTextNodes&&(e===this.ec&&(e=e.cloneNode(!0)).deleteData(this.eo,e.length-this.eo),this._current===this.sc&&(e=e.cloneNode(!0)).deleteData(0,this.so))),e},remove:function(){var e,t,n=this._current;!L(n)||n!==this.sc&&n!==this.ec?n.parentNode&&X(n):(e=n===this.sc?this.so:0,t=n===this.ec?this.eo:n.length,e!=t&&n.deleteData(e,t-e))},isPartiallySelectedSubtree:function(){var e=this._current;return t(e,this.range)},getSubtreeIterator:function(){var e;if(this.isSingleCharacterDataNode)e=this.range.cloneRange(),e.collapse(!1);else{e=new I(n(this.range));var t=this._current,r=t,o=0,i=t,a=q(t);F(t,this.sc)&&(r=this.sc,o=this.so),F(t,this.ec)&&(i=this.ec,a=this.eo),P(e,r,o,i,a)}return new g(e,this.clonePartiallySelectedTextNodes)},detach:function(){this.range=this._current=this._next=this._first=this._last=this.sc=this.so=this.ec=this.eo=null}};var Z=[1,3,4,5,7,8,10],$=[2,9,11],J=[5,6,10,12],K=[1,3,4,5,7,8,10,11],et=[1,3,4,5,7,8],tt=p([9,11]),nt=p(J),rt=p([6,10,12]),ot=document.createElement("style"),it=!1;try{ot.innerHTML="<b>x</b>",it=3==ot.firstChild.nodeType}catch(at){}e.features.htmlParsingConforms=it;var st=it?function(e){var t=this.startContainer,n=j(t);if(!t)throw new k("INVALID_STATE_ERR");var r=null;return 1==t.nodeType?r=t:L(t)&&(r=B.parentElement(t)),r=null===r||"HTML"==r.nodeName&&B.isHtmlNamespace(j(r).documentElement)&&B.isHtmlNamespace(r)?n.createElement("body"):r.cloneNode(!1),r.innerHTML=e,B.fragmentFromNodeChildren(r)}:function(e){var t=n(this),r=t.createElement("body");return r.innerHTML=e,B.fragmentFromNodeChildren(r)},ct=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer"],dt=0,ft=1,ut=2,lt=3,ht=0,gt=1,pt=2,mt=3;H.extend(e.rangePrototype,{compareBoundaryPoints:function(e,t){w(this),C(this.startContainer,t.startContainer);var n,r,o,i,a=e==lt||e==dt?"start":"end",s=e==ft||e==dt?"start":"end";return n=this[a+"Container"],r=this[a+"Offset"],o=t[s+"Container"],i=t[s+"Offset"],z(n,r,o,i)},insertNode:function(e){if(w(this),R(e,K),N(this.startContainer),F(e,this.startContainer))throw new k("HIERARCHY_REQUEST_ERR");var t=a(e,this.startContainer,this.startOffset);this.setStartBefore(t)},cloneContents:function(){w(this);var e,t;if(this.collapsed)return n(this).createDocumentFragment();if(this.startContainer===this.endContainer&&L(this.startContainer))return e=this.startContainer.cloneNode(!0),e.data=e.data.slice(this.startOffset,this.endOffset),t=n(this).createDocumentFragment(),t.appendChild(e),t;var r=new g(this,!0);return e=c(r),r.detach(),e},canSurroundContents:function(){w(this),N(this.startContainer),N(this.endContainer);var e=new g(this,!0),n=e._first&&t(e._first,this)||e._last&&t(e._last,this);return e.detach(),!n},surroundContents:function(e){if(R(e,et),!this.canSurroundContents())throw new k("INVALID_STATE_ERR");var t=this.extractContents();if(e.hasChildNodes())for(;e.lastChild;)e.removeChild(e.lastChild);a(e,this.startContainer,this.startOffset),e.appendChild(t),this.selectNode(e)},cloneRange:function(){w(this);for(var e,t=new I(n(this)),r=ct.length;r--;)e=ct[r],t[e]=this[e];return t},toString:function(){w(this);var e=this.startContainer;if(e===this.endContainer&&L(e))return 3==e.nodeType||4==e.nodeType?e.data.slice(this.startOffset,this.endOffset):"";var t=[],n=new g(this,!0);return d(n,function(e){(3==e.nodeType||4==e.nodeType)&&t.push(e.data)}),n.detach(),t.join("")},compareNode:function(e){w(this);var t=e.parentNode,n=W(e);if(!t)throw new k("NOT_FOUND_ERR");var r=this.comparePoint(t,n),o=this.comparePoint(t,n+1);return 0>r?o>0?pt:ht:o>0?gt:mt},comparePoint:function(e,t){return w(this),E(e,"HIERARCHY_REQUEST_ERR"),C(e,this.startContainer),z(e,t,this.startContainer,this.startOffset)<0?-1:z(e,t,this.endContainer,this.endOffset)>0?1:0},createContextualFragment:st,toHtml:function(){return O(this)},intersectsNode:function(e,t){if(w(this),Q(e)!=r(this))return!1;var n=e.parentNode,o=W(e);if(!n)return!0;var i=z(n,o,this.endContainer,this.endOffset),a=z(n,o+1,this.startContainer,this.startOffset);return t?0>=i&&a>=0:0>i&&a>0},isPointInRange:function(e,t){return w(this),E(e,"HIERARCHY_REQUEST_ERR"),C(e,this.startContainer),z(e,t,this.startContainer,this.startOffset)>=0&&z(e,t,this.endContainer,this.endOffset)<=0},intersectsRange:function(e){return s(this,e,!1)},intersectsOrTouchesRange:function(e){return s(this,e,!0)},intersection:function(e){if(this.intersectsRange(e)){var t=z(this.startContainer,this.startOffset,e.startContainer,e.startOffset),n=z(this.endContainer,this.endOffset,e.endContainer,e.endOffset),r=this.cloneRange();return-1==t&&r.setStart(e.startContainer,e.startOffset),1==n&&r.setEnd(e.endContainer,e.endOffset),r}return null},union:function(e){if(this.intersectsOrTouchesRange(e)){var t=this.cloneRange();return-1==z(e.startContainer,e.startOffset,this.startContainer,this.startOffset)&&t.setStart(e.startContainer,e.startOffset),1==z(e.endContainer,e.endOffset,this.endContainer,this.endOffset)&&t.setEnd(e.endContainer,e.endOffset),t}throw new k("Ranges do not intersect")},containsNode:function(e,t){return t?this.intersectsNode(e,!1):this.compareNode(e)==mt},containsNodeContents:function(e){return this.comparePoint(e,0)>=0&&this.comparePoint(e,q(e))<=0},containsRange:function(e){var t=this.intersection(e);return null!==t&&e.equals(t)},containsNodeText:function(e){var t=this.cloneRange();t.selectNode(e);var n=t.getNodes([3]);if(n.length>0){t.setStart(n[0],0);var r=n.pop();return t.setEnd(r,r.length),this.containsRange(t)}return this.containsNodeContents(e)},getNodes:function(e,t){return w(this),l(this,e,t)},getDocument:function(){return n(this)},collapseBefore:function(e){this.setEndBefore(e),this.collapse(!1)},collapseAfter:function(e){this.setStartAfter(e),this.collapse(!0)},getBookmark:function(t){var r=n(this),o=e.createRange(r);t=t||B.getBody(r),o.selectNodeContents(t);var i=this.intersection(o),a=0,s=0;return i&&(o.setEnd(i.startContainer,i.startOffset),a=o.toString().length,s=a+i.toString().length),{start:a,end:s,containerNode:t}},moveToBookmark:function(e){var t=e.containerNode,n=0;this.setStart(t,0),this.collapse(!0);for(var r,o,i,a,s=[t],c=!1,d=!1;!d&&(r=s.pop());)if(3==r.nodeType)o=n+r.length,!c&&e.start>=n&&e.start<=o&&(this.setStart(r,e.start-n),c=!0),c&&e.end>=n&&e.end<=o&&(this.setEnd(r,e.end-n),d=!0),n=o;else for(a=r.childNodes,i=a.length;i--;)s.push(a[i])},getName:function(){return"DomRange"},equals:function(e){return I.rangesEqual(this,e)},isValid:function(){return y(this)},inspect:function(){return h(this)},detach:function(){}}),x(I,P),H.extend(I,{rangeProperties:ct,RangeIterator:g,copyComparisonConstants:D,createPrototypeRange:x,inspect:h,toHtml:O,getRangeDocument:n,rangesEqual:function(e,t){return e.startContainer===t.startContainer&&e.startOffset===t.startOffset&&e.endContainer===t.endContainer&&e.endOffset===t.endOffset}}),e.DomRange=I}),I.createCoreModule("WrappedRange",["DomRange"],function(e,t){var n,r,o=e.dom,i=e.util,a=o.DomPosition,s=e.DomRange,c=o.getBody,d=o.getContentDocument,f=o.isCharacterDataNode;if(e.features.implementsDomRange&&!function(){function r(e){for(var t,n=l.length;n--;)t=l[n],e[t]=e.nativeRange[t];e.collapsed=e.startContainer===e.endContainer&&e.startOffset===e.endOffset}function a(e,t,n,r,o){var i=e.startContainer!==t||e.startOffset!=n,a=e.endContainer!==r||e.endOffset!=o,s=!e.equals(e.nativeRange);(i||a||s)&&(e.setEnd(r,o),e.setStart(t,n))}var f,u,l=s.rangeProperties;n=function(e){if(!e)throw t.createError("WrappedRange: Range must be specified");this.nativeRange=e,r(this)},s.createPrototypeRange(n,a),f=n.prototype,f.selectNode=function(e){this.nativeRange.selectNode(e),r(this)},f.cloneContents=function(){return this.nativeRange.cloneContents()},f.surroundContents=function(e){this.nativeRange.surroundContents(e),r(this)},f.collapse=function(e){this.nativeRange.collapse(e),r(this)},f.cloneRange=function(){return new n(this.nativeRange.cloneRange())},f.refresh=function(){r(this)},f.toString=function(){return this.nativeRange.toString()};var h=document.createTextNode("test");c(document).appendChild(h);var g=document.createRange();g.setStart(h,0),g.setEnd(h,0);try{g.setStart(h,1),f.setStart=function(e,t){this.nativeRange.setStart(e,t),r(this)},f.setEnd=function(e,t){this.nativeRange.setEnd(e,t),r(this)},u=function(e){return function(t){this.nativeRange[e](t),r(this)}}}catch(p){f.setStart=function(e,t){try{this.nativeRange.setStart(e,t)}catch(n){this.nativeRange.setEnd(e,t),this.nativeRange.setStart(e,t)}r(this)},f.setEnd=function(e,t){try{this.nativeRange.setEnd(e,t)}catch(n){this.nativeRange.setStart(e,t),this.nativeRange.setEnd(e,t)}r(this)},u=function(e,t){return function(n){try{this.nativeRange[e](n)}catch(o){this.nativeRange[t](n),this.nativeRange[e](n)}r(this)}}}f.setStartBefore=u("setStartBefore","setEndBefore"),f.setStartAfter=u("setStartAfter","setEndAfter"),f.setEndBefore=u("setEndBefore","setStartBefore"),f.setEndAfter=u("setEndAfter","setStartAfter"),f.selectNodeContents=function(e){this.setStartAndEnd(e,0,o.getNodeLength(e))},g.selectNodeContents(h),g.setEnd(h,3);var m=document.createRange();m.selectNodeContents(h),m.setEnd(h,4),m.setStart(h,2),f.compareBoundaryPoints=-1==g.compareBoundaryPoints(g.START_TO_END,m)&&1==g.compareBoundaryPoints(g.END_TO_START,m)?function(e,t){return t=t.nativeRange||t,e==t.START_TO_END?e=t.END_TO_START:e==t.END_TO_START&&(e=t.START_TO_END),this.nativeRange.compareBoundaryPoints(e,t)}:function(e,t){return this.nativeRange.compareBoundaryPoints(e,t.nativeRange||t)};var R=document.createElement("div");R.innerHTML="123";var v=R.firstChild,C=c(document);C.appendChild(R),g.setStart(v,1),g.setEnd(v,2),g.deleteContents(),"13"==v.data&&(f.deleteContents=function(){this.nativeRange.deleteContents(),r(this)},f.extractContents=function(){var e=this.nativeRange.extractContents();return r(this),e}),C.removeChild(R),C=null,i.isHostMethod(g,"createContextualFragment")&&(f.createContextualFragment=function(e){return this.nativeRange.createContextualFragment(e)}),c(document).removeChild(h),f.getName=function(){return"WrappedRange"},e.WrappedRange=n,e.createNativeRange=function(e){return e=d(e,t,"createNativeRange"),e.createRange()}}(),e.features.implementsTextRange){var u=function(e){var t=e.parentElement(),n=e.duplicate();n.collapse(!0);var r=n.parentElement();n=e.duplicate(),n.collapse(!1);var i=n.parentElement(),a=r==i?r:o.getCommonAncestor(r,i);return a==t?a:o.getCommonAncestor(t,a)},l=function(e){return 0==e.compareEndPoints("StartToEnd",e)},h=function(e,t,n,r,i){var s=e.duplicate();s.collapse(n);var c=s.parentElement();if(o.isOrIsAncestorOf(t,c)||(c=t),!c.canHaveHTML){var d=new a(c.parentNode,o.getNodeIndex(c));return{boundaryPosition:d,nodeInfo:{nodeIndex:d.offset,containerElement:d.node}}}var u=o.getDocument(c).createElement("span");u.parentNode&&o.removeNode(u);for(var l,h,g,p,m,R=n?"StartToStart":"StartToEnd",v=i&&i.containerElement==c?i.nodeIndex:0,C=c.childNodes.length,N=C,E=N;;){if(E==C?c.appendChild(u):c.insertBefore(u,c.childNodes[E]),s.moveToElementText(u),l=s.compareEndPoints(R,e),0==l||v==N)break;if(-1==l){if(N==v+1)break;v=E}else N=N==v+1?v:E;E=Math.floor((v+N)/2),c.removeChild(u)}if(m=u.nextSibling,-1==l&&m&&f(m)){s.setEndPoint(n?"EndToStart":"EndToEnd",e);var S;if(/[\r\n]/.test(m.data)){var y=s.duplicate(),w=y.text.replace(/\r\n/g,"\r").length;for(S=y.moveStart("character",w);-1==(l=y.compareEndPoints("StartToEnd",y));)S++,y.moveStart("character",1)}else S=s.text.length;p=new a(m,S)}else h=(r||!n)&&u.previousSibling,g=(r||n)&&u.nextSibling,p=g&&f(g)?new a(g,0):h&&f(h)?new a(h,h.data.length):new a(c,o.getNodeIndex(u));return o.removeNode(u),{boundaryPosition:p,nodeInfo:{nodeIndex:E,containerElement:c}}},g=function(e,t){var n,r,i,a,s=e.offset,d=o.getDocument(e.node),u=c(d).createTextRange(),l=f(e.node);return l?(n=e.node,r=n.parentNode):(a=e.node.childNodes,n=s<a.length?a[s]:null,r=e.node),i=d.createElement("span"),i.innerHTML="&#feff;",n?r.insertBefore(i,n):r.appendChild(i),u.moveToElementText(i),u.collapse(!t),r.removeChild(i),l&&u[t?"moveStart":"moveEnd"]("character",s),u};r=function(e){this.textRange=e,this.refresh()},r.prototype=new s(document),r.prototype.refresh=function(){var e,t,n,r=u(this.textRange);
l(this.textRange)?t=e=h(this.textRange,r,!0,!0).boundaryPosition:(n=h(this.textRange,r,!0,!1),e=n.boundaryPosition,t=h(this.textRange,r,!1,!1,n.nodeInfo).boundaryPosition),this.setStart(e.node,e.offset),this.setEnd(t.node,t.offset)},r.prototype.getName=function(){return"WrappedTextRange"},s.copyComparisonConstants(r);var p=function(e){if(e.collapsed)return g(new a(e.startContainer,e.startOffset),!0);var t=g(new a(e.startContainer,e.startOffset),!0),n=g(new a(e.endContainer,e.endOffset),!1),r=c(s.getRangeDocument(e)).createTextRange();return r.setEndPoint("StartToStart",t),r.setEndPoint("EndToEnd",n),r};if(r.rangeToTextRange=p,r.prototype.toTextRange=function(){return p(this)},e.WrappedTextRange=r,!e.features.implementsDomRange||e.config.preferTextRange){var m=function(e){return e("return this;")()}(Function);"undefined"==typeof m.Range&&(m.Range=r),e.createNativeRange=function(e){return e=d(e,t,"createNativeRange"),c(e).createTextRange()},e.WrappedRange=r}}e.createRange=function(n){return n=d(n,t,"createRange"),new e.WrappedRange(e.createNativeRange(n))},e.createRangyRange=function(e){return e=d(e,t,"createRangyRange"),new s(e)},i.createAliasForDeprecatedMethod(e,"createIframeRange","createRange"),i.createAliasForDeprecatedMethod(e,"createIframeRangyRange","createRangyRange"),e.addShimListener(function(t){var n=t.document;"undefined"==typeof n.createRange&&(n.createRange=function(){return e.createRange(n)}),n=t=null})}),I.createCoreModule("WrappedSelection",["DomRange","WrappedRange"],function(e,t){function n(e){return"string"==typeof e?/^backward(s)?$/i.test(e):!!e}function r(e,n){if(e){if(D.isWindow(e))return e;if(e instanceof R)return e.win;var r=D.getContentDocument(e,t,n);return D.getWindow(r)}return window}function o(e){return r(e,"getWinSelection").getSelection()}function i(e){return r(e,"getDocSelection").document.selection}function a(e){var t=!1;return e.anchorNode&&(t=1==D.comparePoints(e.anchorNode,e.anchorOffset,e.focusNode,e.focusOffset)),t}function s(e,t,n){var r=n?"end":"start",o=n?"start":"end";e.anchorNode=t[r+"Container"],e.anchorOffset=t[r+"Offset"],e.focusNode=t[o+"Container"],e.focusOffset=t[o+"Offset"]}function c(e){var t=e.nativeSelection;e.anchorNode=t.anchorNode,e.anchorOffset=t.anchorOffset,e.focusNode=t.focusNode,e.focusOffset=t.focusOffset}function d(e){e.anchorNode=e.focusNode=null,e.anchorOffset=e.focusOffset=0,e.rangeCount=0,e.isCollapsed=!0,e._ranges.length=0}function f(t){var n;return t instanceof b?(n=e.createNativeRange(t.getDocument()),n.setEnd(t.endContainer,t.endOffset),n.setStart(t.startContainer,t.startOffset)):t instanceof P?n=t.nativeRange:H.implementsDomRange&&t instanceof D.getWindow(t.startContainer).Range&&(n=t),n}function u(e){if(!e.length||1!=e[0].nodeType)return!1;for(var t=1,n=e.length;n>t;++t)if(!D.isAncestorOf(e[0],e[t]))return!1;return!0}function l(e){var n=e.getNodes();if(!u(n))throw t.createError("getSingleElementFromRange: range "+e.inspect()+" did not consist of a single element");return n[0]}function h(e){return!!e&&"undefined"!=typeof e.text}function g(e,t){var n=new P(t);e._ranges=[n],s(e,n,!1),e.rangeCount=1,e.isCollapsed=n.collapsed}function p(t){if(t._ranges.length=0,"None"==t.docSelection.type)d(t);else{var n=t.docSelection.createRange();if(h(n))g(t,n);else{t.rangeCount=n.length;for(var r,o=k(n.item(0)),i=0;i<t.rangeCount;++i)r=e.createRange(o),r.selectNode(n.item(i)),t._ranges.push(r);t.isCollapsed=1==t.rangeCount&&t._ranges[0].collapsed,s(t,t._ranges[t.rangeCount-1],!1)}}}function m(e,n){for(var r=e.docSelection.createRange(),o=l(n),i=k(r.item(0)),a=L(i).createControlRange(),s=0,c=r.length;c>s;++s)a.add(r.item(s));try{a.add(o)}catch(d){throw t.createError("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)")}a.select(),p(e)}function R(e,t,n){this.nativeSelection=e,this.docSelection=t,this._ranges=[],this.win=n,this.refresh()}function v(e){e.win=e.anchorNode=e.focusNode=e._ranges=null,e.rangeCount=e.anchorOffset=e.focusOffset=0,e.detached=!0}function C(e,t){for(var n,r,o=tt.length;o--;)if(n=tt[o],r=n.selection,"deleteAll"==t)v(r);else if(n.win==e)return"delete"==t?(tt.splice(o,1),!0):r;return"deleteAll"==t&&(tt.length=0),null}function N(e,n){for(var r,o=k(n[0].startContainer),i=L(o).createControlRange(),a=0,s=n.length;s>a;++a){r=l(n[a]);try{i.add(r)}catch(c){throw t.createError("setRanges(): Element within one of the specified Ranges could not be added to control selection (does it have layout?)")}}i.select(),p(e)}function E(e,t){if(e.win.document!=k(t))throw new I("WRONG_DOCUMENT_ERR")}function S(t){return function(n,r){var o;this.rangeCount?(o=this.getRangeAt(0),o["set"+(t?"Start":"End")](n,r)):(o=e.createRange(this.win.document),o.setStartAndEnd(n,r)),this.setSingleRange(o,this.isBackward())}}function y(e){var t=[],n=new B(e.anchorNode,e.anchorOffset),r=new B(e.focusNode,e.focusOffset),o="function"==typeof e.getName?e.getName():"Selection";if("undefined"!=typeof e.rangeCount)for(var i=0,a=e.rangeCount;a>i;++i)t[i]=b.inspect(e.getRangeAt(i));return"["+o+"(Ranges: "+t.join(", ")+")(anchor: "+n.inspect()+", focus: "+r.inspect()+"]"}e.config.checkSelectionRanges=!0;var w,T,O="boolean",_="number",D=e.dom,A=e.util,x=A.isHostMethod,b=e.DomRange,P=e.WrappedRange,I=e.DOMException,B=D.DomPosition,H=e.features,M="Control",k=D.getDocument,L=D.getBody,W=b.rangesEqual,F=x(window,"getSelection"),j=A.isHostObject(document,"selection");H.implementsWinGetSelection=F,H.implementsDocSelection=j;var z=j&&(!F||e.config.preferTextRange);if(z)w=i,e.isSelectionValid=function(e){var t=r(e,"isSelectionValid").document,n=t.selection;return"None"!=n.type||k(n.createRange().parentElement())==t};else{if(!F)return t.fail("Neither document.selection or window.getSelection() detected."),!1;w=o,e.isSelectionValid=function(){return!0}}e.getNativeSelection=w;var U=w();if(!U)return t.fail("Native selection was null (possibly issue 138?)"),!1;var V=e.createNativeRange(document),q=L(document),Y=A.areHostProperties(U,["anchorNode","focusNode","anchorOffset","focusOffset"]);H.selectionHasAnchorAndFocus=Y;var Q=x(U,"extend");H.selectionHasExtend=Q;var G=typeof U.rangeCount==_;H.selectionHasRangeCount=G;var X=!1,Z=!0,$=Q?function(t,n){var r=b.getRangeDocument(n),o=e.createRange(r);o.collapseToPoint(n.endContainer,n.endOffset),t.addRange(f(o)),t.extend(n.startContainer,n.startOffset)}:null;A.areHostMethods(U,["addRange","getRangeAt","removeAllRanges"])&&typeof U.rangeCount==_&&H.implementsDomRange&&!function(){var t=window.getSelection();if(t){for(var n=t.rangeCount,r=n>1,o=[],i=a(t),s=0;n>s;++s)o[s]=t.getRangeAt(s);var c=D.createTestElement(document,"",!1),d=c.appendChild(document.createTextNode("   ")),f=document.createRange();if(f.setStart(d,1),f.collapse(!0),t.removeAllRanges(),t.addRange(f),Z=1==t.rangeCount,t.removeAllRanges(),!r){var u=window.navigator.appVersion.match(/Chrome\/(.*?) /);if(u&&parseInt(u[1])>=36)X=!1;else{var l=f.cloneRange();f.setStart(d,0),l.setEnd(d,3),l.setStart(d,2),t.addRange(f),t.addRange(l),X=2==t.rangeCount}}for(D.removeNode(c),t.removeAllRanges(),s=0;n>s;++s)0==s&&i?$?$(t,o[s]):(e.warn("Rangy initialization: original selection was backwards but selection has been restored forwards because the browser does not support Selection.extend"),t.addRange(o[s])):t.addRange(o[s])}}(),H.selectionSupportsMultipleRanges=X,H.collapsedNonEditableSelectionsSupported=Z;var J,K=!1;q&&x(q,"createControlRange")&&(J=q.createControlRange(),A.areHostProperties(J,["item","add"])&&(K=!0)),H.implementsControlRange=K,T=Y?function(e){return e.anchorNode===e.focusNode&&e.anchorOffset===e.focusOffset}:function(e){return e.rangeCount?e.getRangeAt(e.rangeCount-1).collapsed:!1};var et;x(U,"getRangeAt")?et=function(e,t){try{return e.getRangeAt(t)}catch(n){return null}}:Y&&(et=function(t){var n=k(t.anchorNode),r=e.createRange(n);return r.setStartAndEnd(t.anchorNode,t.anchorOffset,t.focusNode,t.focusOffset),r.collapsed!==this.isCollapsed&&r.setStartAndEnd(t.focusNode,t.focusOffset,t.anchorNode,t.anchorOffset),r}),R.prototype=e.selectionPrototype;var tt=[],nt=function(e){if(e&&e instanceof R)return e.refresh(),e;e=r(e,"getNativeSelection");var t=C(e),n=w(e),o=j?i(e):null;return t?(t.nativeSelection=n,t.docSelection=o,t.refresh()):(t=new R(n,o,e),tt.push({win:e,selection:t})),t};e.getSelection=nt,A.createAliasForDeprecatedMethod(e,"getIframeSelection","getSelection");var rt=R.prototype;if(!z&&Y&&A.areHostMethods(U,["removeAllRanges","addRange"])){rt.removeAllRanges=function(){this.nativeSelection.removeAllRanges(),d(this)};var ot=function(e,t){$(e.nativeSelection,t),e.refresh()};rt.addRange=G?function(t,r){if(K&&j&&this.docSelection.type==M)m(this,t);else if(n(r)&&Q)ot(this,t);else{var o;X?o=this.rangeCount:(this.removeAllRanges(),o=0);var i=f(t).cloneRange();try{this.nativeSelection.addRange(i)}catch(a){}if(this.rangeCount=this.nativeSelection.rangeCount,this.rangeCount==o+1){if(e.config.checkSelectionRanges){var c=et(this.nativeSelection,this.rangeCount-1);c&&!W(c,t)&&(t=new P(c))}this._ranges[this.rangeCount-1]=t,s(this,t,st(this.nativeSelection)),this.isCollapsed=T(this)}else this.refresh()}}:function(e,t){n(t)&&Q?ot(this,e):(this.nativeSelection.addRange(f(e)),this.refresh())},rt.setRanges=function(e){if(K&&j&&e.length>1)N(this,e);else{this.removeAllRanges();for(var t=0,n=e.length;n>t;++t)this.addRange(e[t])}}}else{if(!(x(U,"empty")&&x(V,"select")&&K&&z))return t.fail("No means of selecting a Range or TextRange was found"),!1;rt.removeAllRanges=function(){try{if(this.docSelection.empty(),"None"!=this.docSelection.type){var e;if(this.anchorNode)e=k(this.anchorNode);else if(this.docSelection.type==M){var t=this.docSelection.createRange();t.length&&(e=k(t.item(0)))}if(e){var n=L(e).createTextRange();n.select(),this.docSelection.empty()}}}catch(r){}d(this)},rt.addRange=function(t){this.docSelection.type==M?m(this,t):(e.WrappedTextRange.rangeToTextRange(t).select(),this._ranges[0]=t,this.rangeCount=1,this.isCollapsed=this._ranges[0].collapsed,s(this,t,!1))},rt.setRanges=function(e){this.removeAllRanges();var t=e.length;t>1?N(this,e):t&&this.addRange(e[0])}}rt.getRangeAt=function(e){if(0>e||e>=this.rangeCount)throw new I("INDEX_SIZE_ERR");return this._ranges[e].cloneRange()};var it;if(z)it=function(t){var n;e.isSelectionValid(t.win)?n=t.docSelection.createRange():(n=L(t.win.document).createTextRange(),n.collapse(!0)),t.docSelection.type==M?p(t):h(n)?g(t,n):d(t)};else if(x(U,"getRangeAt")&&typeof U.rangeCount==_)it=function(t){if(K&&j&&t.docSelection.type==M)p(t);else if(t._ranges.length=t.rangeCount=t.nativeSelection.rangeCount,t.rangeCount){for(var n=0,r=t.rangeCount;r>n;++n)t._ranges[n]=new e.WrappedRange(t.nativeSelection.getRangeAt(n));s(t,t._ranges[t.rangeCount-1],st(t.nativeSelection)),t.isCollapsed=T(t)}else d(t)};else{if(!Y||typeof U.isCollapsed!=O||typeof V.collapsed!=O||!H.implementsDomRange)return t.fail("No means of obtaining a Range or TextRange from the user's selection was found"),!1;it=function(e){var t,n=e.nativeSelection;n.anchorNode?(t=et(n,0),e._ranges=[t],e.rangeCount=1,c(e),e.isCollapsed=T(e)):d(e)}}rt.refresh=function(e){var t=e?this._ranges.slice(0):null,n=this.anchorNode,r=this.anchorOffset;if(it(this),e){var o=t.length;if(o!=this._ranges.length)return!0;if(this.anchorNode!=n||this.anchorOffset!=r)return!0;for(;o--;)if(!W(t[o],this._ranges[o]))return!0;return!1}};var at=function(e,t){var n=e.getAllRanges();e.removeAllRanges();for(var r=0,o=n.length;o>r;++r)W(t,n[r])||e.addRange(n[r]);e.rangeCount||d(e)};rt.removeRange=K&&j?function(e){if(this.docSelection.type==M){for(var t,n=this.docSelection.createRange(),r=l(e),o=k(n.item(0)),i=L(o).createControlRange(),a=!1,s=0,c=n.length;c>s;++s)t=n.item(s),t!==r||a?i.add(n.item(s)):a=!0;i.select(),p(this)}else at(this,e)}:function(e){at(this,e)};var st;!z&&Y&&H.implementsDomRange?(st=a,rt.isBackward=function(){return st(this)}):st=rt.isBackward=function(){return!1},rt.isBackwards=rt.isBackward,rt.toString=function(){for(var e=[],t=0,n=this.rangeCount;n>t;++t)e[t]=""+this._ranges[t];return e.join("")},rt.collapse=function(t,n){E(this,t);var r=e.createRange(t);r.collapseToPoint(t,n),this.setSingleRange(r),this.isCollapsed=!0},rt.collapseToStart=function(){if(!this.rangeCount)throw new I("INVALID_STATE_ERR");var e=this._ranges[0];this.collapse(e.startContainer,e.startOffset)},rt.collapseToEnd=function(){if(!this.rangeCount)throw new I("INVALID_STATE_ERR");var e=this._ranges[this.rangeCount-1];this.collapse(e.endContainer,e.endOffset)},rt.selectAllChildren=function(t){E(this,t);var n=e.createRange(t);n.selectNodeContents(t),this.setSingleRange(n)},rt.deleteFromDocument=function(){if(K&&j&&this.docSelection.type==M){for(var e,t=this.docSelection.createRange();t.length;)e=t.item(0),t.remove(e),D.removeNode(e);this.refresh()}else if(this.rangeCount){var n=this.getAllRanges();if(n.length){this.removeAllRanges();for(var r=0,o=n.length;o>r;++r)n[r].deleteContents();this.addRange(n[o-1])}}},rt.eachRange=function(e,t){for(var n=0,r=this._ranges.length;r>n;++n)if(e(this.getRangeAt(n)))return t},rt.getAllRanges=function(){var e=[];return this.eachRange(function(t){e.push(t)}),e},rt.setSingleRange=function(e,t){this.removeAllRanges(),this.addRange(e,t)},rt.callMethodOnEachRange=function(e,t){var n=[];return this.eachRange(function(r){n.push(r[e].apply(r,t||[]))}),n},rt.setStart=S(!0),rt.setEnd=S(!1),e.rangePrototype.select=function(e){nt(this.getDocument()).setSingleRange(this,e)},rt.changeEachRange=function(e){var t=[],n=this.isBackward();this.eachRange(function(n){e(n),t.push(n)}),this.removeAllRanges(),n&&1==t.length?this.addRange(t[0],"backward"):this.setRanges(t)},rt.containsNode=function(e,t){return this.eachRange(function(n){return n.containsNode(e,t)},!0)||!1},rt.getBookmark=function(e){return{backward:this.isBackward(),rangeBookmarks:this.callMethodOnEachRange("getBookmark",[e])}},rt.moveToBookmark=function(t){for(var n,r,o=[],i=0;n=t.rangeBookmarks[i++];)r=e.createRange(this.win),r.moveToBookmark(n),o.push(r);t.backward?this.setSingleRange(o[0],"backward"):this.setRanges(o)},rt.saveRanges=function(){return{backward:this.isBackward(),ranges:this.callMethodOnEachRange("cloneRange")}},rt.restoreRanges=function(e){this.removeAllRanges();for(var t,n=0;t=e.ranges[n];++n)this.addRange(t,e.backward&&0==n)},rt.toHtml=function(){var e=[];return this.eachRange(function(t){e.push(b.toHtml(t))}),e.join("")},H.implementsTextRange&&(rt.getNativeTextRange=function(){var n;if(n=this.docSelection){var r=n.createRange();if(h(r))return r;throw t.createError("getNativeTextRange: selection is a control selection")}if(this.rangeCount>0)return e.WrappedTextRange.rangeToTextRange(this.getRangeAt(0));throw t.createError("getNativeTextRange: selection contains no range")}),rt.getName=function(){return"WrappedSelection"},rt.inspect=function(){return y(this)},rt.detach=function(){C(this.win,"delete"),v(this)},R.detachAll=function(){C(null,"deleteAll")},R.inspect=y,R.isDirectionBackward=n,e.Selection=R,e.selectionPrototype=rt,e.addShimListener(function(e){"undefined"==typeof e.getSelection&&(e.getSelection=function(){return nt(e)}),e=null})});var L=!1,W=function(){L||(L=!0,!I.initialized&&I.config.autoInitialize&&u())};return b&&("complete"==document.readyState?W():(e(document,"addEventListener")&&document.addEventListener("DOMContentLoaded",W,!1),H(window,"load",W))),I},this);
/**
 * Class Applier module for Rangy.
 * Adds, removes and toggles classes on Ranges and Selections
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * https://github.com/timdown/rangy
 *
 * Depends on Rangy core.
 *
 * Copyright 2015, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3.0
 * Build date: 10 May 2015
 */
!function(e,t){"function"==typeof define&&define.amd?define(["./rangy-core"],e):"undefined"!=typeof module&&"object"==typeof exports?module.exports=e(require("rangy")):e(t.rangy)}(function(e){return e.createModule("ClassApplier",["WrappedSelection"],function(e,t){function n(e,t){for(var n in e)if(e.hasOwnProperty(n)&&t(n,e[n])===!1)return!1;return!0}function s(e){return e.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}function r(e,t){return!!e&&new RegExp("(?:^|\\s)"+t+"(?:\\s|$)").test(e)}function o(e,t){if("object"==typeof e.classList)return e.classList.contains(t);var n="string"==typeof e.className,s=n?e.className:e.getAttribute("class");return r(s,t)}function a(e,t){if("object"==typeof e.classList)e.classList.add(t);else{var n="string"==typeof e.className,s=n?e.className:e.getAttribute("class");s?r(s,t)||(s+=" "+t):s=t,n?e.className=s:e.setAttribute("class",s)}}function l(e){var t="string"==typeof e.className;return t?e.className:e.getAttribute("class")}function u(e){return e&&e.split(/\s+/).sort().join(" ")}function f(e){return u(l(e))}function c(e,t){return f(e)==f(t)}function p(e,t){for(var n=t.split(/\s+/),r=0,i=n.length;i>r;++r)if(!o(e,s(n[r])))return!1;return!0}function d(e){var t=e.parentNode;return t&&1==t.nodeType&&!/^(textarea|style|script|select|iframe)$/i.test(t.nodeName)}function h(e,t,n,s,r){var i=e.node,o=e.offset,a=i,l=o;i==s&&o>r&&++l,i!=t||o!=n&&o!=n+1||(a=s,l+=r-n),i==t&&o>n+1&&--l,e.node=a,e.offset=l}function m(e,t,n){e.node==t&&e.offset>n&&--e.offset}function g(e,t,n,s){-1==n&&(n=t.childNodes.length);var r=e.parentNode,i=$.getNodeIndex(e);U(s,function(e){h(e,r,i,t,n)}),t.childNodes.length==n?t.appendChild(e):t.insertBefore(e,t.childNodes[n])}function N(e,t){var n=e.parentNode,s=$.getNodeIndex(e);U(t,function(e){m(e,n,s)}),$.removeNode(e)}function v(e,t,n,s,r){for(var i,o=[];i=e.firstChild;)g(i,t,n++,r),o.push(i);return s&&N(e,r),o}function y(e,t){return v(e,e.parentNode,$.getNodeIndex(e),!0,t)}function C(e,t){var n=e.cloneRange();n.selectNodeContents(t);var s=n.intersection(e),r=s?s.toString():"";return""!=r}function T(e){for(var t,n=e.getNodes([3]),s=0;(t=n[s])&&!C(e,t);)++s;for(var r=n.length-1;(t=n[r])&&!C(e,t);)--r;return n.slice(s,r+1)}function E(e,t){if(e.attributes.length!=t.attributes.length)return!1;for(var n,s,r,i=0,o=e.attributes.length;o>i;++i)if(n=e.attributes[i],r=n.name,"class"!=r){if(s=t.attributes.getNamedItem(r),null===n!=(null===s))return!1;if(n.specified!=s.specified)return!1;if(n.specified&&n.nodeValue!==s.nodeValue)return!1}return!0}function b(e,t){for(var n,s=0,r=e.attributes.length;r>s;++s)if(n=e.attributes[s].name,(!t||!B(t,n))&&e.attributes[s].specified&&"class"!=n)return!0;return!1}function A(e){var t;return e&&1==e.nodeType&&((t=e.parentNode)&&9==t.nodeType&&"on"==t.designMode||G(e)&&!G(e.parentNode))}function S(e){return(G(e)||1!=e.nodeType&&G(e.parentNode))&&!A(e)}function x(e){return e&&1==e.nodeType&&!J.test(F(e,"display"))}function R(e){if(0==e.data.length)return!0;if(K.test(e.data))return!1;var t=F(e.parentNode,"whiteSpace");switch(t){case"pre":case"pre-wrap":case"-moz-pre-wrap":return!1;case"pre-line":if(/[\r\n]/.test(e.data))return!1}return x(e.previousSibling)||x(e.nextSibling)}function P(e){var t,n,s=[];for(t=0;n=e[t++];)s.push(new z(n.startContainer,n.startOffset),new z(n.endContainer,n.endOffset));return s}function w(e,t){for(var n,s,r,i=0,o=e.length;o>i;++i)n=e[i],s=t[2*i],r=t[2*i+1],n.setStartAndEnd(s.node,s.offset,r.node,r.offset)}function O(e,t){return $.isCharacterDataNode(e)?0==t?!!e.previousSibling:t==e.length?!!e.nextSibling:!0:t>0&&t<e.childNodes.length}function I(e,n,s,r){var i,o,a=0==s;if($.isAncestorOf(n,e))return e;if($.isCharacterDataNode(n)){var l=$.getNodeIndex(n);if(0==s)s=l;else{if(s!=n.length)throw t.createError("splitNodeAt() should not be called with offset in the middle of a data node ("+s+" in "+n.data);s=l+1}n=n.parentNode}if(O(n,s)){i=n.cloneNode(!1),o=n.parentNode,i.id&&i.removeAttribute("id");for(var u,f=0;u=n.childNodes[s];)g(u,i,f++,r);return g(i,o,$.getNodeIndex(n)+1,r),n==e?i:I(e,o,$.getNodeIndex(i),r)}if(e!=n){i=n.parentNode;var c=$.getNodeIndex(n);return a||c++,I(e,i,c,r)}return e}function W(e,t){return e.namespaceURI==t.namespaceURI&&e.tagName.toLowerCase()==t.tagName.toLowerCase()&&c(e,t)&&E(e,t)&&"inline"==F(e,"display")&&"inline"==F(t,"display")}function L(e){var t=e?"nextSibling":"previousSibling";return function(n,s){var r=n.parentNode,i=n[t];if(i){if(i&&3==i.nodeType)return i}else if(s&&(i=r[t],i&&1==i.nodeType&&W(r,i))){var o=i[e?"firstChild":"lastChild"];if(o&&3==o.nodeType)return o}return null}}function M(e){this.isElementMerge=1==e.nodeType,this.textNodes=[];var t=this.isElementMerge?e.lastChild:e;t&&(this.textNodes[0]=t)}function H(e,t,r){var i,o,a,l,f=this;f.cssClass=f.className=e;var c=null,p={};if("object"==typeof t&&null!==t){for("undefined"!=typeof t.elementTagName&&(t.elementTagName=t.elementTagName.toLowerCase()),r=t.tagNames,c=t.elementProperties,p=t.elementAttributes,o=0;l=Y[o++];)t.hasOwnProperty(l)&&(f[l]=t[l]);i=t.normalize}else i=t;f.normalize="undefined"==typeof i?!0:i,f.attrExceptions=[];var d=document.createElement(f.elementTagName);f.elementProperties=f.copyPropertiesToElement(c,d,!0),n(p,function(e,t){f.attrExceptions.push(e),p[e]=""+t}),f.elementAttributes=p,f.elementSortedClassName=f.elementProperties.hasOwnProperty("className")?u(f.elementProperties.className+" "+e):e,f.applyToAnyTagName=!1;var h=typeof r;if("string"==h)"*"==r?f.applyToAnyTagName=!0:f.tagNames=s(r.toLowerCase()).split(/\s*,\s*/);else if("object"==h&&"number"==typeof r.length)for(f.tagNames=[],o=0,a=r.length;a>o;++o)"*"==r[o]?f.applyToAnyTagName=!0:f.tagNames.push(r[o].toLowerCase());else f.tagNames=[f.elementTagName]}function j(e,t,n){return new H(e,t,n)}var $=e.dom,z=$.DomPosition,B=$.arrayContains,D=e.util,U=D.forEach,V="span",k=D.isHostMethod(document,"createElementNS"),q=function(){function e(e,t,n){return t&&n?" ":""}return function(t,n){if("object"==typeof t.classList)t.classList.remove(n);else{var s="string"==typeof t.className,r=s?t.className:t.getAttribute("class");r=r.replace(new RegExp("(^|\\s)"+n+"(\\s|$)"),e),s?t.className=r:t.setAttribute("class",r)}}}(),F=$.getComputedStyleProperty,G=function(){var e=document.createElement("div");return"boolean"==typeof e.isContentEditable?function(e){return e&&1==e.nodeType&&e.isContentEditable}:function(e){return e&&1==e.nodeType&&"false"!=e.contentEditable?"true"==e.contentEditable||G(e.parentNode):!1}}(),J=/^inline(-block|-table)?$/i,K=/[^\r\n\t\f \u200B]/,Q=L(!1),X=L(!0);M.prototype={doMerge:function(e){var t=this.textNodes,n=t[0];if(t.length>1){var s,r=$.getNodeIndex(n),i=[],o=0;U(t,function(t,a){s=t.parentNode,a>0&&(s.removeChild(t),s.hasChildNodes()||$.removeNode(s),e&&U(e,function(e){e.node==t&&(e.node=n,e.offset+=o),e.node==s&&e.offset>r&&(--e.offset,e.offset==r+1&&len-1>a&&(e.node=n,e.offset=o))})),i[a]=t.data,o+=t.data.length}),n.data=i.join("")}return n.data},getLength:function(){for(var e=this.textNodes.length,t=0;e--;)t+=this.textNodes[e].length;return t},toString:function(){var e=[];return U(this.textNodes,function(t,n){e[n]="'"+t.data+"'"}),"[Merge("+e.join(",")+")]"}};var Y=["elementTagName","ignoreWhiteSpace","applyToEditableOnly","useExistingElements","removeEmptyElements","onElementCreate"],Z={};H.prototype={elementTagName:V,elementProperties:{},elementAttributes:{},ignoreWhiteSpace:!0,applyToEditableOnly:!1,useExistingElements:!0,removeEmptyElements:!0,onElementCreate:null,copyPropertiesToElement:function(e,t,n){var s,r,i,o,l,f,c={};for(var p in e)if(e.hasOwnProperty(p))if(o=e[p],l=t[p],"className"==p)a(t,o),a(t,this.className),t[p]=u(t[p]),n&&(c[p]=o);else if("style"==p){r=l,n&&(c[p]=i={});for(s in e[p])e[p].hasOwnProperty(s)&&(r[s]=o[s],n&&(i[s]=r[s]));this.attrExceptions.push(p)}else t[p]=o,n&&(c[p]=t[p],f=Z.hasOwnProperty(p)?Z[p]:p,this.attrExceptions.push(f));return n?c:""},copyAttributesToElement:function(e,t){for(var n in e)e.hasOwnProperty(n)&&!/^class(?:Name)?$/i.test(n)&&t.setAttribute(n,e[n])},appliesToElement:function(e){return B(this.tagNames,e.tagName.toLowerCase())},getEmptyElements:function(e){var t=this;return e.getNodes([1],function(e){return t.appliesToElement(e)&&!e.hasChildNodes()})},hasClass:function(e){return 1==e.nodeType&&(this.applyToAnyTagName||this.appliesToElement(e))&&o(e,this.className)},getSelfOrAncestorWithClass:function(e){for(;e;){if(this.hasClass(e))return e;e=e.parentNode}return null},isModifiable:function(e){return!this.applyToEditableOnly||S(e)},isIgnorableWhiteSpaceNode:function(e){return this.ignoreWhiteSpace&&e&&3==e.nodeType&&R(e)},postApply:function(e,t,n,s){var r,o,a=e[0],l=e[e.length-1],u=[],f=a,c=l,p=0,d=l.length;U(e,function(e){o=Q(e,!s),o?(r||(r=new M(o),u.push(r)),r.textNodes.push(e),e===a&&(f=r.textNodes[0],p=f.length),e===l&&(c=r.textNodes[0],d=r.getLength())):r=null});var h=X(l,!s);if(h&&(r||(r=new M(l),u.push(r)),r.textNodes.push(h)),u.length){for(i=0,len=u.length;len>i;++i)u[i].doMerge(n);t.setStartAndEnd(f,p,c,d)}},createContainer:function(e){var t,n=$.getDocument(e),s=k&&!$.isHtmlNamespace(e)&&(t=e.namespaceURI)?n.createElementNS(e.namespaceURI,this.elementTagName):n.createElement(this.elementTagName);return this.copyPropertiesToElement(this.elementProperties,s,!1),this.copyAttributesToElement(this.elementAttributes,s),a(s,this.className),this.onElementCreate&&this.onElementCreate(s,this),s},elementHasProperties:function(e,t){var s=this;return n(t,function(t,n){if("className"==t)return p(e,n);if("object"==typeof n){if(!s.elementHasProperties(e[t],n))return!1}else if(e[t]!==n)return!1})},elementHasAttributes:function(e,t){return n(t,function(t,n){return e.getAttribute(t)!==n?!1:void 0})},applyToTextNode:function(e){if(d(e)){var t=e.parentNode;if(1==t.childNodes.length&&this.useExistingElements&&this.appliesToElement(t)&&this.elementHasProperties(t,this.elementProperties)&&this.elementHasAttributes(t,this.elementAttributes))a(t,this.className);else{var n=e.parentNode,s=this.createContainer(n);n.insertBefore(s,e),s.appendChild(e)}}},isRemovable:function(e){return e.tagName.toLowerCase()==this.elementTagName&&f(e)==this.elementSortedClassName&&this.elementHasProperties(e,this.elementProperties)&&!b(e,this.attrExceptions)&&this.elementHasAttributes(e,this.elementAttributes)&&this.isModifiable(e)},isEmptyContainer:function(e){var t=e.childNodes.length;return 1==e.nodeType&&this.isRemovable(e)&&(0==t||1==t&&this.isEmptyContainer(e.firstChild))},removeEmptyContainers:function(e){var t=this,n=e.getNodes([1],function(e){return t.isEmptyContainer(e)}),s=[e],r=P(s);U(n,function(e){N(e,r)}),w(s,r)},undoToTextNode:function(e,t,n,s){if(!t.containsNode(n)){var r=t.cloneRange();r.selectNode(n),r.isPointInRange(t.endContainer,t.endOffset)&&(I(n,t.endContainer,t.endOffset,s),t.setEndAfter(n)),r.isPointInRange(t.startContainer,t.startOffset)&&(n=I(n,t.startContainer,t.startOffset,s))}this.isRemovable(n)?y(n,s):q(n,this.className)},splitAncestorWithClass:function(e,t,n){var s=this.getSelfOrAncestorWithClass(e);s&&I(s,e,t,n)},undoToAncestor:function(e,t){this.isRemovable(e)?y(e,t):q(e,this.className)},applyToRange:function(e,t){var n=this;t=t||[];var s=P(t||[]);e.splitBoundariesPreservingPositions(s),n.removeEmptyElements&&n.removeEmptyContainers(e);var r=T(e);if(r.length){U(r,function(e){n.isIgnorableWhiteSpaceNode(e)||n.getSelfOrAncestorWithClass(e)||!n.isModifiable(e)||n.applyToTextNode(e,s)});var i=r[r.length-1];e.setStartAndEnd(r[0],0,i,i.length),n.normalize&&n.postApply(r,e,s,!1),w(t,s)}var o=n.getEmptyElements(e);U(o,function(e){a(e,n.className)})},applyToRanges:function(e){for(var t=e.length;t--;)this.applyToRange(e[t],e);return e},applyToSelection:function(t){var n=e.getSelection(t);n.setRanges(this.applyToRanges(n.getAllRanges()))},undoToRange:function(e,t){var n=this;t=t||[];var s=P(t);e.splitBoundariesPreservingPositions(s),n.removeEmptyElements&&n.removeEmptyContainers(e,s);var r,i,o=T(e),a=o[o.length-1];if(o.length){n.splitAncestorWithClass(e.endContainer,e.endOffset,s),n.splitAncestorWithClass(e.startContainer,e.startOffset,s);for(var l=0,u=o.length;u>l;++l)r=o[l],i=n.getSelfOrAncestorWithClass(r),i&&n.isModifiable(r)&&n.undoToAncestor(i,s);e.setStartAndEnd(o[0],0,a,a.length),n.normalize&&n.postApply(o,e,s,!0),w(t,s)}var f=n.getEmptyElements(e);U(f,function(e){q(e,n.className)})},undoToRanges:function(e){for(var t=e.length;t--;)this.undoToRange(e[t],e);return e},undoToSelection:function(t){var n=e.getSelection(t),s=e.getSelection(t).getAllRanges();this.undoToRanges(s),n.setRanges(s)},isAppliedToRange:function(e){if(e.collapsed||""==e.toString())return!!this.getSelfOrAncestorWithClass(e.commonAncestorContainer);var t=e.getNodes([3]);if(t.length)for(var n,s=0;n=t[s++];)if(!this.isIgnorableWhiteSpaceNode(n)&&C(e,n)&&this.isModifiable(n)&&!this.getSelfOrAncestorWithClass(n))return!1;return!0},isAppliedToRanges:function(e){var t=e.length;if(0==t)return!1;for(;t--;)if(!this.isAppliedToRange(e[t]))return!1;return!0},isAppliedToSelection:function(t){var n=e.getSelection(t);return this.isAppliedToRanges(n.getAllRanges())},toggleRange:function(e){this.isAppliedToRange(e)?this.undoToRange(e):this.applyToRange(e)},toggleSelection:function(e){this.isAppliedToSelection(e)?this.undoToSelection(e):this.applyToSelection(e)},getElementsWithClassIntersectingRange:function(e){var t=[],n=this;return e.getNodes([3],function(e){var s=n.getSelfOrAncestorWithClass(e);s&&!B(t,s)&&t.push(s)}),t},detach:function(){}},H.util={hasClass:o,addClass:a,removeClass:q,getClass:l,hasSameClasses:c,hasAllClasses:p,replaceWithOwnChildren:y,elementsHaveSameNonClassAttributes:E,elementHasNonClassAttributes:b,splitNodeAt:I,isEditableElement:G,isEditingHost:A,isEditable:S},e.CssClassApplier=e.ClassApplier=H,e.createClassApplier=j,D.createAliasForDeprecatedMethod(e,"createCssClassApplier","createClassApplier",t)}),e},this);
/**
 * Text range module for Rangy.
 * Text-based manipulation and searching of ranges and selections.
 *
 * Features
 *
 * - Ability to move range boundaries by character or word offsets
 * - Customizable word tokenizer
 * - Ignores text nodes inside <script> or <style> elements or those hidden by CSS display and visibility properties
 * - Range findText method to search for text or regex within the page or within a range. Flags for whole words and case
 *   sensitivity
 * - Selection and range save/restore as text offsets within a node
 * - Methods to return visible text within a range or selection
 * - innerText method for elements
 *
 * References
 *
 * https://www.w3.org/Bugs/Public/show_bug.cgi?id=13145
 * http://aryeh.name/spec/innertext/innertext.html
 * http://dvcs.w3.org/hg/editing/raw-file/tip/editing.html
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * https://github.com/timdown/rangy
 *
 * Depends on Rangy core.
 *
 * Copyright 2015, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3.0
 * Build date: 10 May 2015
 */
!function(e,t){"function"==typeof define&&define.amd?define(["./rangy-core"],e):"undefined"!=typeof module&&"object"==typeof exports?module.exports=e(require("rangy")):e(t.rangy)}(function(e){return e.createModule("TextRange",["WrappedSelection"],function(e,t){function n(e,t){function n(e,t,n){s.push({start:e,end:t,isWord:n})}for(var r,i,o,a=e.join(""),s=[],c=0;r=t.wordRegex.exec(a);){if(i=r.index,o=i+r[0].length,i>c&&n(c,i,!1),t.includeTrailingSpace)for(;X.test(e[o]);)++o;n(i,o,!0),c=o}return c<e.length&&n(c,e.length,!1),s}function r(e,t){for(var n=e.slice(t.start,t.end),r={isWord:t.isWord,chars:n,toString:function(){return n.join("")}},i=0,o=n.length;o>i;++i)n[i].token=r;return r}function i(e,t,n){for(var i,o=n(e,t),a=[],s=0;i=o[s++];)a.push(r(e,i));return a}function o(e){var t=e||"",n="string"==typeof t?t.split(""):t;return n.sort(function(e,t){return e.charCodeAt(0)-t.charCodeAt(0)}),n.join("").replace(/(.)\1+/g,"$1")}function a(e){var t,n;return e?(t=e.language||Z,n={},K(n,ct[t]||ct[Z]),K(n,e),n):ct[Z]}function s(e,t){var n=z(e,t);return t.hasOwnProperty("wordOptions")&&(n.wordOptions=a(n.wordOptions)),t.hasOwnProperty("characterOptions")&&(n.characterOptions=z(n.characterOptions,at)),n}function c(e,t){var n=pt(e,"display",t),r=e.tagName.toLowerCase();return"block"==n&&ot&&ft.hasOwnProperty(r)?ft[r]:n}function u(e){for(var t=f(e),n=0,r=t.length;r>n;++n)if(1==t[n].nodeType&&"none"==c(t[n]))return!0;return!1}function d(e){var t;return 3==e.nodeType&&(t=e.parentNode)&&"hidden"==pt(t,"visibility")}function l(e){return e&&(1==e.nodeType&&!/^(inline(-block|-table)?|none)$/.test(c(e))||9==e.nodeType||11==e.nodeType)}function h(e){return U.isCharacterDataNode(e)||!/^(area|base|basefont|br|col|frame|hr|img|input|isindex|link|meta|param)$/i.test(e.nodeName)}function p(e){for(var t=[];e.parentNode;)t.unshift(e.parentNode),e=e.parentNode;return t}function f(e){return p(e).concat([e])}function g(e){for(;e&&!e.nextSibling;)e=e.parentNode;return e?e.nextSibling:null}function v(e,t){return!t&&e.hasChildNodes()?e.firstChild:g(e)}function S(e){var t=e.previousSibling;if(t){for(e=t;e.hasChildNodes();)e=e.lastChild;return e}var n=e.parentNode;return n&&1==n.nodeType?n:null}function C(e){if(!e||3!=e.nodeType)return!1;var t=e.data;if(""===t)return!0;var n=e.parentNode;if(!n||1!=n.nodeType)return!1;var r=pt(e.parentNode,"whiteSpace");return/^[\t\n\r ]+$/.test(t)&&/^(normal|nowrap)$/.test(r)||/^[\t\r ]+$/.test(t)&&"pre-line"==r}function N(e){if(""===e.data)return!0;if(!C(e))return!1;var t=e.parentNode;return t?u(e)?!0:!1:!0}function y(e){var t=e.nodeType;return 7==t||8==t||u(e)||/^(script|style)$/i.test(e.nodeName)||d(e)||N(e)}function m(e,t){var n=e.nodeType;return 7==n||8==n||1==n&&"none"==c(e,t)}function x(){this.store={}}function T(e,t,n){return function(r){var i=this.cache;if(i.hasOwnProperty(e))return gt++,i[e];vt++;var o=t.call(this,n?this[n]:this,r);return i[e]=o,o}}function P(e,t){this.node=e,this.session=t,this.cache=new x,this.positions=new x}function b(e,t){this.offset=t,this.nodeWrapper=e,this.node=e.node,this.session=e.session,this.cache=new x}function w(){return"[Position("+U.inspectNode(this.node)+":"+this.offset+")]"}function R(){return B(),Bt=new Ot}function E(){return Bt||R()}function B(){Bt&&Bt.detach(),Bt=null}function O(e,n,r,i){function o(){var e=null;return n?(e=s,c||(s=s.previousVisible(),c=!s||r&&s.equals(r))):c||(e=s=s.nextVisible(),c=!s||r&&s.equals(r)),c&&(s=null),e}r&&(n?y(r.node)&&(r=e.previousVisible()):y(r.node)&&(r=r.nextVisible()));var a,s=e,c=!1,u=!1;return{next:function(){if(u)return u=!1,a;for(var e,t;e=o();)if(t=e.getCharacter(i))return a=e,e;return null},rewind:function(){if(!a)throw t.createError("createCharacterIterator: cannot rewind. Only one position can be rewound.");u=!0},dispose:function(){e=r=null}}}function k(e,t,n){function r(e){for(var t,n,r=[],i=e?o:a,s=!1,c=!1;t=i.next();){if(n=t.character,Q.test(n))c&&(c=!1,s=!0);else{if(s){i.rewind();break}c=!0}r.push(t)}return r}var o=O(e,!1,null,t),a=O(e,!0,null,t),s=n.tokenizer,c=r(!0),u=r(!1).reverse(),d=i(u.concat(c),n,s),l=c.length?d.slice(kt(d,c[0].token)):[],h=u.length?d.slice(0,kt(d,u.pop().token)+1):[];return{nextEndToken:function(){for(var e,t;1==l.length&&!(e=l[0]).isWord&&(t=r(!0)).length>0;)l=i(e.chars.concat(t),n,s);return l.shift()},previousStartToken:function(){for(var e,t;1==h.length&&!(e=h[0]).isWord&&(t=r(!1)).length>0;)h=i(t.reverse().concat(e.chars),n,s);return h.pop()},dispose:function(){o.dispose(),a.dispose(),l=h=null}}}function L(e,t,n,r,i){var o,a,s,c,u=0,d=e,l=Math.abs(n);if(0!==n){var h=0>n;switch(t){case M:for(a=O(e,h,null,r);(o=a.next())&&l>u;)++u,d=o;s=o,a.dispose();break;case j:for(var p=k(e,r,i),f=h?p.previousStartToken:p.nextEndToken;(c=f())&&l>u;)c.isWord&&(++u,d=h?c.chars[0]:c.chars[c.chars.length-1]);break;default:throw new Error("movePositionBy: unit '"+t+"' not implemented")}h?(d=d.previousVisible(),u=-u):d&&d.isLeadingSpace&&!d.isTrailingSpace&&(t==j&&(a=O(e,!1,null,r),s=a.next(),a.dispose()),s&&(d=s.previousVisible()))}return{position:d,unitsMoved:u}}function I(e,t,n,r){var i=e.getRangeBoundaryPosition(t,!0),o=e.getRangeBoundaryPosition(t,!1),a=r?o:i,s=r?i:o;return O(a,!!r,s,n)}function A(e,t,n){for(var r,i=[],o=I(e,t,n);r=o.next();)i.push(r);return o.dispose(),i}function W(t,n,r){var i=e.createRange(t.node);return i.setStartAndEnd(t.node,t.offset,n.node,n.offset),!i.expand("word",{wordOptions:r})}function _(e,t,n,r,i){function o(e,t){var n=g[e].previousVisible(),r=g[t-1],o=!i.wholeWordsOnly||W(n,r,i.wordOptions);return{startPos:n,endPos:r,valid:o}}for(var a,s,c,u,d,l,h=et(i.direction),p=O(e,h,e.session.getRangeBoundaryPosition(r,h),i.characterOptions),f="",g=[],v=null;a=p.next();)if(s=a.character,n||i.caseSensitive||(s=s.toLowerCase()),h?(g.unshift(a),f=s+f):(g.push(a),f+=s),n){if(d=t.exec(f))if(c=d.index,u=c+d[0].length,l){if(!h&&u<f.length||h&&c>0){v=o(c,u);break}}else l=!0}else if(-1!=(c=f.indexOf(t))){v=o(c,c+t.length);break}return l&&(v=o(c,u)),p.dispose(),v}function D(e){return function(){var t=!!Bt,n=E(),r=[n].concat(G.toArray(arguments)),i=e.apply(this,r);return t||B(),i}}function F(e,t){return D(function(n,r,i,o){typeof i==q&&(i=r,r=M),o=s(o,dt);var a=e;t&&(a=i>=0,this.collapse(!a));var c=L(n.getRangeBoundaryPosition(this,a),r,i,o.characterOptions,o.wordOptions),u=c.position;return this[a?"setStart":"setEnd"](u.node,u.offset),c.unitsMoved})}function V(e){return D(function(t,n){n=z(n,at);for(var r,i=I(t,this,n,!e),o=0;(r=i.next())&&Q.test(r.character);)++o;i.dispose();var a=o>0;return a&&this[e?"moveStart":"moveEnd"]("character",e?o:-o,{characterOptions:n}),a})}function $(e){return D(function(t,n){var r=!1;return this.changeEachRange(function(t){r=t[e](n)||r}),r})}var q="undefined",M="character",j="word",U=e.dom,G=e.util,K=G.extend,z=G.createOptions,H=U.getBody,Y=/^[ \t\f\r\n]+$/,J=/^[ \t\f\r]+$/,Q=/^[\t-\r \u0085\u00A0\u1680\u180E\u2000-\u200B\u2028\u2029\u202F\u205F\u3000]+$/,X=/^[\t \u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000]+$/,Z="en",et=e.Selection.isDirectionBackward,tt=!1,nt=!1,rt=!1,it=!0;!function(){var t=U.createTestElement(document,"<p>1 </p><p></p>",!0),n=t.firstChild,r=e.getSelection();r.collapse(n.lastChild,2),r.setStart(n.firstChild,0),tt=1==(""+r).length,t.innerHTML="1 <br />",r.collapse(t,2),r.setStart(t.firstChild,0),nt=1==(""+r).length,t.innerHTML="1 <p>1</p>",r.collapse(t,2),r.setStart(t.firstChild,0),rt=1==(""+r).length,U.removeNode(t),r.removeAllRanges()}();var ot,at={includeBlockContentTrailingSpace:!0,includeSpaceBeforeBr:!0,includeSpaceBeforeBlock:!0,includePreLineTrailingSpace:!0,ignoreCharacters:""},st={includeBlockContentTrailingSpace:!it,includeSpaceBeforeBr:!nt,includeSpaceBeforeBlock:!rt,includePreLineTrailingSpace:!0},ct={en:{wordRegex:/[a-z0-9]+('[a-z0-9]+)*/gi,includeTrailingSpace:!1,tokenizer:n}},ut={caseSensitive:!1,withinRange:null,wholeWordsOnly:!1,wrap:!1,direction:"forward",wordOptions:null,characterOptions:null},dt={wordOptions:null,characterOptions:null},lt={wordOptions:null,characterOptions:null,trim:!1,trimStart:!0,trimEnd:!0},ht={wordOptions:null,characterOptions:null,direction:"forward"},pt=U.getComputedStyleProperty;!function(){var e=document.createElement("table"),t=H(document);t.appendChild(e),ot="block"==pt(e,"display"),t.removeChild(e)}();var ft={table:"table",caption:"table-caption",colgroup:"table-column-group",col:"table-column",thead:"table-header-group",tbody:"table-row-group",tfoot:"table-footer-group",tr:"table-row",td:"table-cell",th:"table-cell"};x.prototype={get:function(e){return this.store.hasOwnProperty(e)?this.store[e]:null},set:function(e,t){return this.store[e]=t}};var gt=0,vt=0,St={getPosition:function(e){var t=this.positions;return t.get(e)||t.set(e,new b(this,e))},toString:function(){return"[NodeWrapper("+U.inspectNode(this.node)+")]"}};P.prototype=St;var Ct="EMPTY",Nt="NON_SPACE",yt="UNCOLLAPSIBLE_SPACE",mt="COLLAPSIBLE_SPACE",xt="TRAILING_SPACE_BEFORE_BLOCK",Tt="TRAILING_SPACE_IN_BLOCK",Pt="TRAILING_SPACE_BEFORE_BR",bt="PRE_LINE_TRAILING_SPACE_BEFORE_LINE_BREAK",wt="TRAILING_LINE_BREAK_AFTER_BR",Rt="INCLUDED_TRAILING_LINE_BREAK_AFTER_BR";K(St,{isCharacterDataNode:T("isCharacterDataNode",U.isCharacterDataNode,"node"),getNodeIndex:T("nodeIndex",U.getNodeIndex,"node"),getLength:T("nodeLength",U.getNodeLength,"node"),containsPositions:T("containsPositions",h,"node"),isWhitespace:T("isWhitespace",C,"node"),isCollapsedWhitespace:T("isCollapsedWhitespace",N,"node"),getComputedDisplay:T("computedDisplay",c,"node"),isCollapsed:T("collapsed",y,"node"),isIgnored:T("ignored",m,"node"),next:T("nextPos",v,"node"),previous:T("previous",S,"node"),getTextNodeInfo:T("textNodeInfo",function(e){var t=null,n=!1,r=pt(e.parentNode,"whiteSpace"),i="pre-line"==r;return i?(t=J,n=!0):("normal"==r||"nowrap"==r)&&(t=Y,n=!0),{node:e,text:e.data,spaceRegex:t,collapseSpaces:n,preLine:i}},"node"),hasInnerText:T("hasInnerText",function(e,t){for(var n=this.session,r=n.getPosition(e.parentNode,this.getNodeIndex()+1),i=n.getPosition(e,0),o=t?r:i,a=t?i:r;o!==a;){if(o.prepopulateChar(),o.isDefinitelyNonEmpty())return!0;o=t?o.previousVisible():o.nextVisible()}return!1},"node"),isRenderedBlock:T("isRenderedBlock",function(e){for(var t=e.getElementsByTagName("br"),n=0,r=t.length;r>n;++n)if(!y(t[n]))return!0;return this.hasInnerText()},"node"),getTrailingSpace:T("trailingSpace",function(e){if("br"==e.tagName.toLowerCase())return"";switch(this.getComputedDisplay()){case"inline":for(var t=e.lastChild;t;){if(!m(t))return 1==t.nodeType?this.session.getNodeWrapper(t).getTrailingSpace():"";t=t.previousSibling}break;case"inline-block":case"inline-table":case"none":case"table-column":case"table-column-group":break;case"table-cell":return"	";default:return this.isRenderedBlock(!0)?"\n":""}return""},"node"),getLeadingSpace:T("leadingSpace",function(){switch(this.getComputedDisplay()){case"inline":case"inline-block":case"inline-table":case"none":case"table-column":case"table-column-group":case"table-cell":break;default:return this.isRenderedBlock(!1)?"\n":""}return""},"node")});var Et={character:"",characterType:Ct,isBr:!1,prepopulateChar:function(){var e=this;if(!e.prepopulatedChar){var t=e.node,n=e.offset,r="",i=Ct,o=!1;if(n>0)if(3==t.nodeType){var a=t.data,s=a.charAt(n-1),c=e.nodeWrapper.getTextNodeInfo(),u=c.spaceRegex;c.collapseSpaces?u.test(s)?n>1&&u.test(a.charAt(n-2))||(c.preLine&&"\n"===a.charAt(n)?(r=" ",i=bt):(r=" ",i=mt)):(r=s,i=Nt,o=!0):(r=s,i=yt,o=!0)}else{var d=t.childNodes[n-1];if(d&&1==d.nodeType&&!y(d)&&("br"==d.tagName.toLowerCase()?(r="\n",e.isBr=!0,i=mt,o=!1):e.checkForTrailingSpace=!0),!r){var l=t.childNodes[n];l&&1==l.nodeType&&!y(l)&&(e.checkForLeadingSpace=!0)}}e.prepopulatedChar=!0,e.character=r,e.characterType=i,e.isCharInvariant=o}},isDefinitelyNonEmpty:function(){var e=this.characterType;return e==Nt||e==yt},resolveLeadingAndTrailingSpaces:function(){if(this.prepopulatedChar||this.prepopulateChar(),this.checkForTrailingSpace){var e=this.session.getNodeWrapper(this.node.childNodes[this.offset-1]).getTrailingSpace();e&&(this.isTrailingSpace=!0,this.character=e,this.characterType=mt),this.checkForTrailingSpace=!1}if(this.checkForLeadingSpace){var t=this.session.getNodeWrapper(this.node.childNodes[this.offset]).getLeadingSpace();t&&(this.isLeadingSpace=!0,this.character=t,this.characterType=mt),this.checkForLeadingSpace=!1}},getPrecedingUncollapsedPosition:function(e){for(var t,n=this;n=n.previousVisible();)if(t=n.getCharacter(e),""!==t)return n;return null},getCharacter:function(e){function t(){return p||(d=f.getPrecedingUncollapsedPosition(e),p=!0),d}this.resolveLeadingAndTrailingSpaces();var n,r=this.character,i=o(e.ignoreCharacters),a=""!==r&&i.indexOf(r)>-1;if(this.isCharInvariant)return n=a?"":r;var s=["character",e.includeSpaceBeforeBr,e.includeBlockContentTrailingSpace,e.includePreLineTrailingSpace,i].join("_"),c=this.cache.get(s);if(null!==c)return c;var u,d,l="",h=this.characterType==mt,p=!1,f=this;return h&&(this.type==Rt?l="\n":" "==r&&(!t()||d.isTrailingSpace||"\n"==d.character||" "==d.character&&d.characterType==mt)||("\n"==r&&this.isLeadingSpace?t()&&"\n"!=d.character&&(l="\n"):(u=this.nextUncollapsed(),u&&(u.isBr?this.type=Pt:u.isTrailingSpace&&"\n"==u.character?this.type=Tt:u.isLeadingSpace&&"\n"==u.character&&(this.type=xt),"\n"==u.character?(this.type!=Pt||e.includeSpaceBeforeBr)&&(this.type!=xt||e.includeSpaceBeforeBlock)&&(this.type==Tt&&u.isTrailingSpace&&!e.includeBlockContentTrailingSpace||(this.type!=bt||u.type!=Nt||e.includePreLineTrailingSpace)&&("\n"==r?u.isTrailingSpace?this.isTrailingSpace||this.isBr&&(u.type=wt,t()&&d.isLeadingSpace&&!d.isTrailingSpace&&"\n"==d.character?u.character="":u.type=Rt):l="\n":" "==r&&(l=" "))):l=r)))),i.indexOf(l)>-1&&(l=""),this.cache.set(s,l),l},equals:function(e){return!!e&&this.node===e.node&&this.offset===e.offset},inspect:w,toString:function(){return this.character}};b.prototype=Et,K(Et,{next:T("nextPos",function(e){var t=e.nodeWrapper,n=e.node,r=e.offset,i=t.session;if(!n)return null;var o,a,s;return r==t.getLength()?(o=n.parentNode,a=o?t.getNodeIndex()+1:0):t.isCharacterDataNode()?(o=n,a=r+1):(s=n.childNodes[r],i.getNodeWrapper(s).containsPositions()?(o=s,a=0):(o=n,a=r+1)),o?i.getPosition(o,a):null}),previous:T("previous",function(e){var t,n,r,i=e.nodeWrapper,o=e.node,a=e.offset,s=i.session;return 0==a?(t=o.parentNode,n=t?i.getNodeIndex():0):i.isCharacterDataNode()?(t=o,n=a-1):(r=o.childNodes[a-1],s.getNodeWrapper(r).containsPositions()?(t=r,n=U.getNodeLength(r)):(t=o,n=a-1)),t?s.getPosition(t,n):null}),nextVisible:T("nextVisible",function(e){var t=e.next();if(!t)return null;var n=t.nodeWrapper,r=t.node,i=t;return n.isCollapsed()&&(i=n.session.getPosition(r.parentNode,n.getNodeIndex()+1)),i}),nextUncollapsed:T("nextUncollapsed",function(e){for(var t=e;t=t.nextVisible();)if(t.resolveLeadingAndTrailingSpaces(),""!==t.character)return t;return null}),previousVisible:T("previousVisible",function(e){var t=e.previous();if(!t)return null;var n=t.nodeWrapper,r=t.node,i=t;return n.isCollapsed()&&(i=n.session.getPosition(r.parentNode,n.getNodeIndex())),i})});var Bt=null,Ot=function(){function e(e){var t=new x;return{get:function(n){var r=t.get(n[e]);if(r)for(var i,o=0;i=r[o++];)if(i.node===n)return i;return null},set:function(n){var r=n.node[e],i=t.get(r)||t.set(r,[]);i.push(n)}}}function t(){this.initCaches()}var n=G.isHostProperty(document.documentElement,"uniqueID");return t.prototype={initCaches:function(){this.elementCache=n?function(){var e=new x;return{get:function(t){return e.get(t.uniqueID)},set:function(t){e.set(t.node.uniqueID,t)}}}():e("tagName"),this.textNodeCache=e("data"),this.otherNodeCache=e("nodeName")},getNodeWrapper:function(e){var t;switch(e.nodeType){case 1:t=this.elementCache;break;case 3:t=this.textNodeCache;break;default:t=this.otherNodeCache}var n=t.get(e);return n||(n=new P(e,this),t.set(n)),n},getPosition:function(e,t){return this.getNodeWrapper(e).getPosition(t)},getRangeBoundaryPosition:function(e,t){var n=t?"start":"end";return this.getPosition(e[n+"Container"],e[n+"Offset"])},detach:function(){this.elementCache=this.textNodeCache=this.otherNodeCache=null}},t}();K(U,{nextNode:v,previousNode:S});var kt=Array.prototype.indexOf?function(e,t){return e.indexOf(t)}:function(e,t){for(var n=0,r=e.length;r>n;++n)if(e[n]===t)return n;return-1};K(e.rangePrototype,{moveStart:F(!0,!1),moveEnd:F(!1,!1),move:F(!0,!0),trimStart:V(!0),trimEnd:V(!1),trim:D(function(e,t){var n=this.trimStart(t),r=this.trimEnd(t);return n||r}),expand:D(function(e,t,n){var r=!1;n=s(n,lt);var i=n.characterOptions;if(t||(t=M),t==j){var o,a,c=n.wordOptions,u=e.getRangeBoundaryPosition(this,!0),d=e.getRangeBoundaryPosition(this,!1),l=k(u,i,c),h=l.nextEndToken(),p=h.chars[0].previousVisible();if(this.collapsed)o=h;else{var f=k(d,i,c);o=f.previousStartToken()}return a=o.chars[o.chars.length-1],p.equals(u)||(this.setStart(p.node,p.offset),r=!0),a&&!a.equals(d)&&(this.setEnd(a.node,a.offset),r=!0),n.trim&&(n.trimStart&&(r=this.trimStart(i)||r),n.trimEnd&&(r=this.trimEnd(i)||r)),r}return this.moveEnd(M,1,n)}),text:D(function(e,t){return this.collapsed?"":A(e,this,z(t,at)).join("")}),selectCharacters:D(function(e,t,n,r,i){var o={characterOptions:i};t||(t=H(this.getDocument())),this.selectNodeContents(t),this.collapse(!0),this.moveStart("character",n,o),this.collapse(!0),this.moveEnd("character",r-n,o)}),toCharacterRange:D(function(e,t,n){t||(t=H(this.getDocument()));var r,i,o=t.parentNode,a=U.getNodeIndex(t),s=-1==U.comparePoints(this.startContainer,this.endContainer,o,a),c=this.cloneRange();return s?(c.setStartAndEnd(this.startContainer,this.startOffset,o,a),r=-c.text(n).length):(c.setStartAndEnd(o,a,this.startContainer,this.startOffset),r=c.text(n).length),i=r+this.text(n).length,{start:r,end:i}}),findText:D(function(t,n,r){r=s(r,ut),r.wholeWordsOnly&&(r.wordOptions.includeTrailingSpace=!1);var i=et(r.direction),o=r.withinRange;o||(o=e.createRange(),o.selectNodeContents(this.getDocument()));var a=n,c=!1;"string"==typeof a?r.caseSensitive||(a=a.toLowerCase()):c=!0;var u=t.getRangeBoundaryPosition(this,!i),d=o.comparePoint(u.node,u.offset);-1===d?u=t.getRangeBoundaryPosition(o,!0):1===d&&(u=t.getRangeBoundaryPosition(o,!1));for(var l,h=u,p=!1;;)if(l=_(h,a,c,o,r)){if(l.valid)return this.setStartAndEnd(l.startPos.node,l.startPos.offset,l.endPos.node,l.endPos.offset),!0;h=i?l.startPos:l.endPos}else{if(!r.wrap||p)return!1;o=o.cloneRange(),h=t.getRangeBoundaryPosition(o,!i),o.setBoundary(u.node,u.offset,i),p=!0}}),pasteHtml:function(e){if(this.deleteContents(),e){var t=this.createContextualFragment(e),n=t.lastChild;this.insertNode(t),this.collapseAfter(n)}}}),K(e.selectionPrototype,{expand:D(function(e,t,n){this.changeEachRange(function(e){e.expand(t,n)})}),move:D(function(e,t,n,r){var i=0;if(this.focusNode){this.collapse(this.focusNode,this.focusOffset);var o=this.getRangeAt(0);r||(r={}),r.characterOptions=z(r.characterOptions,st),i=o.move(t,n,r),this.setSingleRange(o)}return i}),trimStart:$("trimStart"),trimEnd:$("trimEnd"),trim:$("trim"),selectCharacters:D(function(t,n,r,i,o,a){var s=e.createRange(n);s.selectCharacters(n,r,i,a),this.setSingleRange(s,o)}),saveCharacterRanges:D(function(e,t,n){for(var r=this.getAllRanges(),i=r.length,o=[],a=1==i&&this.isBackward(),s=0,c=r.length;c>s;++s)o[s]={characterRange:r[s].toCharacterRange(t,n),backward:a,characterOptions:n};return o}),restoreCharacterRanges:D(function(t,n,r){this.removeAllRanges();for(var i,o,a,s=0,c=r.length;c>s;++s)o=r[s],a=o.characterRange,i=e.createRange(n),i.selectCharacters(n,a.start,a.end,o.characterOptions),this.addRange(i,o.backward)}),text:D(function(e,t){for(var n=[],r=0,i=this.rangeCount;i>r;++r)n[r]=this.getRangeAt(r).text(t);return n.join("")})}),e.innerText=function(t,n){var r=e.createRange(t);r.selectNodeContents(t);var i=r.text(n);return i},e.createWordIterator=function(e,t,n){var r=E();n=s(n,ht);var i=r.getPosition(e,t),o=k(i,n.characterOptions,n.wordOptions),a=et(n.direction);return{next:function(){return a?o.previousStartToken():o.nextEndToken()},dispose:function(){o.dispose(),this.next=function(){}}}},e.noMutation=function(e){var t=E();e(t),B()},e.noMutation.createEntryPointFunction=D,e.textRange={isBlockNode:l,isCollapsedWhitespaceNode:N,createPosition:D(function(e,t,n){return e.getPosition(t,n)})}}),e},this);
;//'
(function(){function h(a){throw a;}var i=void 0,j=!0,k=null,l=!1;function m(a){return function(){return this[a]}}function aa(a){return function(){return a}}var n=this;function p(a){return"string"==typeof a}Math.floor(2147483648*Math.random()).toString(36);function q(a){var b=t;function c(){}c.prototype=b.prototype;a.t=b.prototype;a.prototype=new c};var u,ba,ca,da;function ea(){return n.navigator?n.navigator.userAgent:k}da=ca=ba=u=l;var fa;if(fa=ea()){var ga=n.navigator;u=0==fa.indexOf("Opera");ba=!u&&-1!=fa.indexOf("MSIE");ca=!u&&-1!=fa.indexOf("WebKit");da=!u&&!ca&&"Gecko"==ga.product}var w=ba,ha=da,ia=ca,ja;
a:{var ka="",y;if(u&&n.opera)var la=n.opera.version,ka="function"==typeof la?la():la;else if(ha?y=/rv\:([^\);]+)(\)|;)/:w?y=/MSIE\s+([^\);]+)(\)|;)/:ia&&(y=/WebKit\/(\S+)/),y)var ma=y.exec(ea()),ka=ma?ma[1]:"";if(w){var na,oa=n.document;na=oa?oa.documentMode:i;if(na>parseFloat(ka)){ja=String(na);break a}}ja=ka}var pa=ja,qa={};
function ra(a){if(!qa[a]){for(var b=0,c=String(pa).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",r=d[f]||"",v=RegExp("(\\d*)(\\D*)","g"),J=RegExp("(\\d*)(\\D*)","g");do{var s=v.exec(g)||["","",""],x=J.exec(r)||["","",""];if(0==s[0].length&&0==x[0].length)break;b=((0==s[1].length?0:parseInt(s[1],10))<(0==x[1].length?0:parseInt(x[1],10))?-1:(0==s[1].length?0:parseInt(s[1],10))>
(0==x[1].length?0:parseInt(x[1],10))?1:0)||((0==s[2].length)<(0==x[2].length)?-1:(0==s[2].length)>(0==x[2].length)?1:0)||(s[2]<x[2]?-1:s[2]>x[2]?1:0)}while(0==b)}qa[a]=0<=b}}var sa={};function z(a){return sa[a]||(sa[a]=w&&!!document.documentMode&&document.documentMode>=a)};function A(a,b,c){this.a=a;this.b=b||1;this.d=c||1};var B=Array.prototype,ta=B.indexOf?function(a,b,c){return B.indexOf.call(a,b,c)}:function(a,b,c){c=c==k?0:0>c?Math.max(0,a.length+c):c;if(p(a))return!p(b)||1!=b.length?-1:a.indexOf(b,c);for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},C=B.forEach?function(a,b,c){B.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},ua=B.filter?function(a,b,c){return B.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=p(a)?a.split(""):
a,r=0;r<d;r++)if(r in g){var v=g[r];b.call(c,v,r,a)&&(e[f++]=v)}return e};function va(a,b,c){if(a.reduce)return a.reduce(b,c);var d=c;C(a,function(c,f){d=b.call(i,d,c,f,a)});return d}var wa=B.some?function(a,b,c){return B.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return j;return l};function xa(a){return B.concat.apply(B,arguments)}function ya(a,b,c){return 2>=arguments.length?B.slice.call(a,b):B.slice.call(a,b,c)};!w||z(9);!ha&&!w||w&&z(9)||ha&&ra("1.9.1");w&&ra("9");function za(a,b){if(a.contains&&1==b.nodeType)return a==b||a.contains(b);if("undefined"!=typeof a.compareDocumentPosition)return a==b||Boolean(a.compareDocumentPosition(b)&16);for(;b&&a!=b;)b=b.parentNode;return b==a}
function Aa(a,b){if(a==b)return 0;if(a.compareDocumentPosition)return a.compareDocumentPosition(b)&2?1:-1;if(w&&!z(9)){if(9==a.nodeType)return-1;if(9==b.nodeType)return 1}if("sourceIndex"in a||a.parentNode&&"sourceIndex"in a.parentNode){var c=1==a.nodeType,d=1==b.nodeType;if(c&&d)return a.sourceIndex-b.sourceIndex;var e=a.parentNode,f=b.parentNode;return e==f?Ba(a,b):!c&&za(e,b)?-1*Ca(a,b):!d&&za(f,a)?Ca(b,a):(c?a.sourceIndex:e.sourceIndex)-(d?b.sourceIndex:f.sourceIndex)}d=9==a.nodeType?a:a.ownerDocument||
a.document;c=d.createRange();c.selectNode(a);c.collapse(j);d=d.createRange();d.selectNode(b);d.collapse(j);return c.compareBoundaryPoints(n.Range.START_TO_END,d)}function Ca(a,b){var c=a.parentNode;if(c==b)return-1;for(var d=b;d.parentNode!=c;)d=d.parentNode;return Ba(d,a)}function Ba(a,b){for(var c=b;c=c.previousSibling;)if(c==a)return-1;return 1};var D=w&&!z(9),Da=w&&!z(8);function E(a,b,c,d){this.a=a;this.nodeName=c;this.nodeValue=d;this.nodeType=2;this.parentNode=this.ownerElement=b}function Ea(a,b){var c=Da&&"href"==b.nodeName?a.getAttribute(b.nodeName,2):b.nodeValue;return new E(b,a,b.nodeName,c)};function Fa(a){this.b=a;this.a=0}var Ga=RegExp("\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+|\\/\\/|\\.\\.|::|\\d+(?:\\.\\d*)?|\\.\\d+|\"[^\"]*\"|'[^']*'|[!<>]=|\\s+|.","g"),Ha=/^\s/;function F(a,b){return a.b[a.a+(b||0)]}function G(a){return a.b[a.a++]};function H(a){var b=k,c=a.nodeType;1==c&&(b=a.textContent,b=b==i||b==k?a.innerText:b,b=b==i||b==k?"":b);if("string"!=typeof b)if(D&&"title"==a.nodeName.toLowerCase()&&1==c)b=a.text;else if(9==c||1==c)for(var a=9==c?a.documentElement:a.firstChild,c=0,d=[],b="";a;){do 1!=a.nodeType&&(b+=a.nodeValue),D&&"title"==a.nodeName.toLowerCase()&&(b+=a.text),d[c++]=a;while(a=a.firstChild);for(;c&&!(a=d[--c].nextSibling););}else b=a.nodeValue;return""+b}
function I(a,b,c){if(b===k)return j;try{if(!a.getAttribute)return l}catch(d){return l}Da&&"class"==b&&(b="className");return c==k?!!a.getAttribute(b):a.getAttribute(b,2)==c}function Ia(a,b,c,d,e){return(D?Ja:Ka).call(k,a,b,p(c)?c:k,p(d)?d:k,e||new K)}
function Ja(a,b,c,d,e){if(a instanceof L||8==a.b||c&&a.b===k){var f=b.all;if(!f)return e;a=La(a);if("*"!=a&&(f=b.getElementsByTagName(a),!f))return e;if(c){for(var g=[],r=0;b=f[r++];)I(b,c,d)&&g.push(b);f=g}for(r=0;b=f[r++];)("*"!=a||"!"!=b.tagName)&&M(e,b);return e}Ma(a,b,c,d,e);return e}
function Ka(a,b,c,d,e){b.getElementsByName&&d&&"name"==c&&!w?(b=b.getElementsByName(d),C(b,function(b){a.a(b)&&M(e,b)})):b.getElementsByClassName&&d&&"class"==c?(b=b.getElementsByClassName(d),C(b,function(b){b.className==d&&a.a(b)&&M(e,b)})):a instanceof N?Ma(a,b,c,d,e):b.getElementsByTagName&&(b=b.getElementsByTagName(a.d()),C(b,function(a){I(a,c,d)&&M(e,a)}));return e}
function Na(a,b,c,d,e){var f;if((a instanceof L||8==a.b||c&&a.b===k)&&(f=b.childNodes)){var g=La(a);if("*"!=g&&(f=ua(f,function(a){return a.tagName&&a.tagName.toLowerCase()==g}),!f))return e;c&&(f=ua(f,function(a){return I(a,c,d)}));C(f,function(a){("*"!=g||"!"!=a.tagName&&!("*"==g&&1!=a.nodeType))&&M(e,a)});return e}return Oa(a,b,c,d,e)}function Oa(a,b,c,d,e){for(b=b.firstChild;b;b=b.nextSibling)I(b,c,d)&&a.a(b)&&M(e,b);return e}
function Ma(a,b,c,d,e){for(b=b.firstChild;b;b=b.nextSibling)I(b,c,d)&&a.a(b)&&M(e,b),Ma(a,b,c,d,e)}function La(a){if(a instanceof N){if(8==a.b)return"!";if(a.b===k)return"*"}return a.d()};function K(){this.b=this.a=k;this.i=0}function Pa(a){this.b=a;this.a=this.d=k}function Qa(a,b){if(a.a){if(!b.a)return a}else return b;for(var c=a.a,d=b.a,e=k,f=k,g=0;c&&d;)c.b==d.b||c.b instanceof E&&d.b instanceof E&&c.b.a==d.b.a?(f=c,c=c.a,d=d.a):0<Aa(c.b,d.b)?(f=d,d=d.a):(f=c,c=c.a),(f.d=e)?e.a=f:a.a=f,e=f,g++;for(f=c||d;f;)f.d=e,e=e.a=f,g++,f=f.a;a.b=e;a.i=g;return a}function Ra(a,b){var c=new Pa(b);c.a=a.a;a.b?a.a.d=c:a.a=a.b=c;a.a=c;a.i++}
function M(a,b){var c=new Pa(b);c.d=a.b;a.a?a.b.a=c:a.a=a.b=c;a.b=c;a.i++}function Sa(a){return(a=a.a)?a.b:k}function Ta(a){return(a=Sa(a))?H(a):""}function O(a,b){return new Ua(a,!!b)}function Ua(a,b){this.d=a;this.b=(this.c=b)?a.b:a.a;this.a=k}function P(a){var b=a.b;if(b==k)return k;var c=a.a=b;a.b=a.c?b.d:b.a;return c.b};function t(a){this.g=a;this.b=this.f=l;this.d=k}function Q(a,b){var c=a.a(b);return c instanceof K?+Ta(c):+c}function R(a,b){var c=a.a(b);return c instanceof K?Ta(c):""+c}function S(a,b){var c=a.a(b);return c instanceof K?!!c.i:!!c};function Va(a,b,c){t.call(this,a.g);this.c=a;this.e=b;this.j=c;this.f=b.f||c.f;this.b=b.b||c.b;this.c==Wa&&(!c.b&&!c.f&&4!=c.g&&0!=c.g&&b.d?this.d={name:b.d.name,l:c}:!b.b&&(!b.f&&4!=b.g&&0!=b.g&&c.d)&&(this.d={name:c.d.name,l:b}))}q(Va);
function T(a,b,c,d,e){var b=b.a(d),c=c.a(d),f;if(b instanceof K&&c instanceof K){f=O(b);for(b=P(f);b;b=P(f)){e=O(c);for(d=P(e);d;d=P(e))if(a(H(b),H(d)))return j}return l}if(b instanceof K||c instanceof K){b instanceof K?e=b:(e=c,c=b);e=O(e);b=typeof c;for(d=P(e);d;d=P(e)){switch(b){case "number":f=+H(d);break;case "boolean":f=!!H(d);break;case "string":f=H(d);break;default:h(Error("Illegal primitive type for comparison."))}if(a(f,c))return j}return l}return e?"boolean"==typeof b||"boolean"==typeof c?
a(!!b,!!c):"number"==typeof b||"number"==typeof c?a(+b,+c):a(b,c):a(+b,+c)}Va.prototype.a=function(a){return this.c.k(this.e,this.j,a)};Va.prototype.toString=function(a){var a=a||"",b=a+"binary expression: "+this.c+"\n",a=a+"  ",b=b+(this.e.toString(a)+"\n");return b+=this.j.toString(a)};function Xa(a,b,c,d){this.a=a;this.p=b;this.g=c;this.k=d}Xa.prototype.toString=m("a");var Ya={};
function U(a,b,c,d){a in Ya&&h(Error("Binary operator already created: "+a));a=new Xa(a,b,c,d);return Ya[a.toString()]=a}U("div",6,1,function(a,b,c){return Q(a,c)/Q(b,c)});U("mod",6,1,function(a,b,c){return Q(a,c)%Q(b,c)});U("*",6,1,function(a,b,c){return Q(a,c)*Q(b,c)});U("+",5,1,function(a,b,c){return Q(a,c)+Q(b,c)});U("-",5,1,function(a,b,c){return Q(a,c)-Q(b,c)});U("<",4,2,function(a,b,c){return T(function(a,b){return a<b},a,b,c)});
U(">",4,2,function(a,b,c){return T(function(a,b){return a>b},a,b,c)});U("<=",4,2,function(a,b,c){return T(function(a,b){return a<=b},a,b,c)});U(">=",4,2,function(a,b,c){return T(function(a,b){return a>=b},a,b,c)});var Wa=U("=",3,2,function(a,b,c){return T(function(a,b){return a==b},a,b,c,j)});U("!=",3,2,function(a,b,c){return T(function(a,b){return a!=b},a,b,c,j)});U("and",2,2,function(a,b,c){return S(a,c)&&S(b,c)});U("or",1,2,function(a,b,c){return S(a,c)||S(b,c)});function Za(a,b){b.a.length&&4!=a.g&&h(Error("Primary expression must evaluate to nodeset if filter has predicate(s)."));t.call(this,a.g);this.c=a;this.e=b;this.f=a.f;this.b=a.b}q(Za);Za.prototype.a=function(a){a=this.c.a(a);return $a(this.e,a)};Za.prototype.toString=function(a){var a=a||"",b=a+"Filter: \n",a=a+"  ",b=b+this.c.toString(a);return b+=this.e.toString(a)};function ab(a,b){b.length<a.o&&h(Error("Function "+a.h+" expects at least"+a.o+" arguments, "+b.length+" given"));a.n!==k&&b.length>a.n&&h(Error("Function "+a.h+" expects at most "+a.n+" arguments, "+b.length+" given"));a.s&&C(b,function(b,d){4!=b.g&&h(Error("Argument "+d+" to function "+a.h+" is not of type Nodeset: "+b))});t.call(this,a.g);this.e=a;this.c=b;this.f=a.f||wa(b,function(a){return a.f});this.b=a.r&&!b.length||a.q&&!!b.length||wa(b,function(a){return a.b})}q(ab);
ab.prototype.a=function(a){return this.e.k.apply(k,xa(a,this.c))};ab.prototype.toString=function(a){var b=a||"",a=b+"Function: "+this.e+"\n",b=b+"  ";this.c.length&&(a+=b+"Arguments:",b+="  ",a=va(this.c,function(a,d){return a+"\n"+d.toString(b)},a));return a};function bb(a,b,c,d,e,f,g,r,v){this.h=a;this.g=b;this.f=c;this.r=d;this.q=e;this.k=f;this.o=g;this.n=r!==i?r:g;this.s=!!v}bb.prototype.toString=m("h");var cb={};
function V(a,b,c,d,e,f,g,r){a in cb&&h(Error("Function already created: "+a+"."));cb[a]=new bb(a,b,c,d,l,e,f,g,r)}V("boolean",2,l,l,function(a,b){return S(b,a)},1);V("ceiling",1,l,l,function(a,b){return Math.ceil(Q(b,a))},1);V("concat",3,l,l,function(a,b){var c=ya(arguments,1);return va(c,function(b,c){return b+R(c,a)},"")},2,k);V("contains",2,l,l,function(a,b,c){b=R(b,a);a=R(c,a);return-1!=b.indexOf(a)},2);V("count",1,l,l,function(a,b){return b.a(a).i},1,1,j);V("false",2,l,l,aa(l),0);
V("floor",1,l,l,function(a,b){return Math.floor(Q(b,a))},1);
V("id",4,l,l,function(a,b){function c(a){if(D){var b=e.all[a];if(b){if(b.nodeType&&a==b.id)return b;if(b.length){var c;a:{c=function(b){return a==b.id};for(var d=b.length,f=p(b)?b.split(""):b,g=0;g<d;g++)if(g in f&&c.call(i,f[g])){c=g;break a}c=-1}return 0>c?k:p(b)?b.charAt(c):b[c]}}return k}return e.getElementById(a)}var d=a.a,e=9==d.nodeType?d:d.ownerDocument,d=R(b,a).split(/\s+/),f=[];C(d,function(a){(a=c(a))&&!(0<=ta(f,a))&&f.push(a)});f.sort(Aa);var g=new K;C(f,function(a){M(g,a)});return g},
1);V("lang",2,l,l,aa(l),1);V("last",1,j,l,function(a){1!=arguments.length&&h(Error("Function last expects ()"));return a.d},0);V("local-name",3,l,j,function(a,b){var c=b?Sa(b.a(a)):a.a;return c?c.nodeName.toLowerCase():""},0,1,j);V("name",3,l,j,function(a,b){var c=b?Sa(b.a(a)):a.a;return c?c.nodeName.toLowerCase():""},0,1,j);V("namespace-uri",3,j,l,aa(""),0,1,j);V("normalize-space",3,l,j,function(a,b){return(b?R(b,a):H(a.a)).replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"")},0,1);
V("not",2,l,l,function(a,b){return!S(b,a)},1);V("number",1,l,j,function(a,b){return b?Q(b,a):+H(a.a)},0,1);V("position",1,j,l,function(a){return a.b},0);V("round",1,l,l,function(a,b){return Math.round(Q(b,a))},1);V("starts-with",2,l,l,function(a,b,c){b=R(b,a);a=R(c,a);return 0==b.lastIndexOf(a,0)},2);V("string",3,l,j,function(a,b){return b?R(b,a):H(a.a)},0,1);V("string-length",1,l,j,function(a,b){return(b?R(b,a):H(a.a)).length},0,1);
V("substring",3,l,l,function(a,b,c,d){c=Q(c,a);if(isNaN(c)||Infinity==c||-Infinity==c)return"";d=d?Q(d,a):Infinity;if(isNaN(d)||-Infinity===d)return"";var c=Math.round(c)-1,e=Math.max(c,0),a=R(b,a);if(Infinity==d)return a.substring(e);b=Math.round(d);return a.substring(e,c+b)},2,3);V("substring-after",3,l,l,function(a,b,c){b=R(b,a);a=R(c,a);c=b.indexOf(a);return-1==c?"":b.substring(c+a.length)},2);
V("substring-before",3,l,l,function(a,b,c){b=R(b,a);a=R(c,a);a=b.indexOf(a);return-1==a?"":b.substring(0,a)},2);V("sum",1,l,l,function(a,b){for(var c=O(b.a(a)),d=0,e=P(c);e;e=P(c))d+=+H(e);return d},1,1,j);V("translate",3,l,l,function(a,b,c,d){for(var b=R(b,a),c=R(c,a),e=R(d,a),a=[],d=0;d<c.length;d++){var f=c.charAt(d);f in a||(a[f]=e.charAt(d))}c="";for(d=0;d<b.length;d++)f=b.charAt(d),c+=f in a?a[f]:f;return c},3);V("true",2,l,l,aa(j),0);function N(a,b){this.e=a;this.c=b!==i?b:k;this.b=k;switch(a){case "comment":this.b=8;break;case "text":this.b=3;break;case "processing-instruction":this.b=7;break;case "node":break;default:h(Error("Unexpected argument"))}}function db(a){return"comment"==a||"text"==a||"processing-instruction"==a||"node"==a}N.prototype.a=function(a){return this.b===k||this.b==a.nodeType};N.prototype.d=m("e");
N.prototype.toString=function(a){var a=a||"",b=a+"kindtest: "+this.e;this.c===k||(b+="\n"+this.c.toString(a+"  "));return b};function eb(a){t.call(this,3);this.c=a.substring(1,a.length-1)}q(eb);eb.prototype.a=m("c");eb.prototype.toString=function(a){return(a||"")+"literal: "+this.c};function L(a){this.h=a.toLowerCase()}L.prototype.a=function(a){var b=a.nodeType;if(1==b||2==b)return"*"==this.h||this.h==a.nodeName.toLowerCase()?j:this.h==(a.namespaceURI||"http://www.w3.org/1999/xhtml")+":*"};L.prototype.d=m("h");L.prototype.toString=function(a){return(a||"")+"nametest: "+this.h};function fb(a){t.call(this,1);this.c=a}q(fb);fb.prototype.a=m("c");fb.prototype.toString=function(a){return(a||"")+"number: "+this.c};function gb(a,b){t.call(this,a.g);this.e=a;this.c=b;this.f=a.f;this.b=a.b;if(1==this.c.length){var c=this.c[0];!c.m&&c.e==hb&&(c=c.j,"*"!=c.d()&&(this.d={name:c.d(),l:k}))}}q(gb);function ib(){t.call(this,4)}q(ib);ib.prototype.a=function(a){var b=new K,a=a.a;9==a.nodeType?M(b,a):M(b,a.ownerDocument);return b};ib.prototype.toString=function(a){return a+"RootHelperExpr"};function jb(){t.call(this,4)}q(jb);jb.prototype.a=function(a){var b=new K;M(b,a.a);return b};
jb.prototype.toString=function(a){return a+"ContextHelperExpr"};gb.prototype.a=function(a){var b=this.e.a(a);b instanceof K||h(Error("FilterExpr must evaluate to nodeset."));for(var a=this.c,c=0,d=a.length;c<d&&b.i;c++){var e=a[c],f=O(b,e.e.a),g;if(!e.f&&e.e==kb){for(g=P(f);(b=P(f))&&(!g.contains||g.contains(b))&&b.compareDocumentPosition(g)&8;g=b);b=e.a(new A(g))}else if(!e.f&&e.e==lb)g=P(f),b=e.a(new A(g));else{g=P(f);for(b=e.a(new A(g));(g=P(f))!=k;)g=e.a(new A(g)),b=Qa(b,g)}}return b};
gb.prototype.toString=function(a){var b=a||"",c=b+"PathExpr:\n",b=b+"  ",c=c+this.e.toString(b);this.c.length&&(c+=b+"Steps:\n",b+="  ",C(this.c,function(a){c+=a.toString(b)}));return c};function mb(a,b){this.a=a;this.b=!!b}function $a(a,b,c){for(c=c||0;c<a.a.length;c++)for(var d=a.a[c],e=O(b),f=b.i,g,r=0;g=P(e);r++){var v=a.b?f-r:r+1;g=d.a(new A(g,v,f));var J;"number"==typeof g?J=v==g:"string"==typeof g||"boolean"==typeof g?J=!!g:g instanceof K?J=0<g.i:h(Error("Predicate.evaluate returned an unexpected type."));if(!J){v=e;g=v.d;var s=v.a;s||h(Error("Next must be called at least once before remove."));var x=s.d,s=s.a;x?x.a=s:g.a=s;s?s.d=x:g.b=x;g.i--;v.a=k}}return b}
mb.prototype.toString=function(a){var b=a||"",a=b+"Predicates:",b=b+"  ";return va(this.a,function(a,d){return a+"\n"+b+d.toString(b)},a)};function W(a,b,c,d){t.call(this,4);this.e=a;this.j=b;this.c=c||new mb([]);this.m=!!d;b=0<this.c.a.length?this.c.a[0].d:k;a.b&&b&&(a=b.name,a=D?a.toLowerCase():a,this.d={name:a,l:b.l});a:{a=this.c;for(b=0;b<a.a.length;b++)if(c=a.a[b],c.f||1==c.g||0==c.g){a=j;break a}a=l}this.f=a}q(W);
W.prototype.a=function(a){var b=a.a,c=k,c=this.d,d=k,e=k,f=0;c&&(d=c.name,e=c.l?R(c.l,a):k,f=1);if(this.m)if(!this.f&&this.e==nb)c=Ia(this.j,b,d,e),c=$a(this.c,c,f);else if(a=O((new W(ob,new N("node"))).a(a)),b=P(a))for(c=this.k(b,d,e,f);(b=P(a))!=k;)c=Qa(c,this.k(b,d,e,f));else c=new K;else c=this.k(a.a,d,e,f);return c};W.prototype.k=function(a,b,c,d){a=this.e.d(this.j,a,b,c);return a=$a(this.c,a,d)};
W.prototype.toString=function(a){var a=a||"",b=a+"Step: \n",a=a+"  ",b=b+(a+"Operator: "+(this.m?"//":"/")+"\n");this.e.h&&(b+=a+"Axis: "+this.e+"\n");b+=this.j.toString(a);if(this.c.length)for(var b=b+(a+"Predicates: \n"),c=0;c<this.c.length;c++)var d=c<this.c.length-1?", ":"",b=b+(this.c[c].toString(a)+d);return b};function pb(a,b,c,d){this.h=a;this.d=b;this.a=c;this.b=d}pb.prototype.toString=m("h");var qb={};
function X(a,b,c,d){a in qb&&h(Error("Axis already created: "+a));b=new pb(a,b,c,!!d);return qb[a]=b}X("ancestor",function(a,b){for(var c=new K,d=b;d=d.parentNode;)a.a(d)&&Ra(c,d);return c},j);X("ancestor-or-self",function(a,b){var c=new K,d=b;do a.a(d)&&Ra(c,d);while(d=d.parentNode);return c},j);
var hb=X("attribute",function(a,b){var c=new K,d=a.d();if("style"==d&&b.style&&D)return M(c,new E(b.style,b,"style",b.style.cssText)),c;var e=b.attributes;if(e)if(a instanceof N&&a.b===k||"*"==d)for(var d=0,f;f=e[d];d++)D?f.nodeValue&&M(c,Ea(b,f)):M(c,f);else(f=e.getNamedItem(d))&&(D?f.nodeValue&&M(c,Ea(b,f)):M(c,f));return c},l),nb=X("child",function(a,b,c,d,e){return(D?Na:Oa).call(k,a,b,p(c)?c:k,p(d)?d:k,e||new K)},l,j);X("descendant",Ia,l,j);
var ob=X("descendant-or-self",function(a,b,c,d){var e=new K;I(b,c,d)&&a.a(b)&&M(e,b);return Ia(a,b,c,d,e)},l,j),kb=X("following",function(a,b,c,d){var e=new K;do for(var f=b;f=f.nextSibling;)I(f,c,d)&&a.a(f)&&M(e,f),e=Ia(a,f,c,d,e);while(b=b.parentNode);return e},l,j);X("following-sibling",function(a,b){for(var c=new K,d=b;d=d.nextSibling;)a.a(d)&&M(c,d);return c},l);X("namespace",function(){return new K},l);
var rb=X("parent",function(a,b){var c=new K;if(9==b.nodeType)return c;if(2==b.nodeType)return M(c,b.ownerElement),c;var d=b.parentNode;a.a(d)&&M(c,d);return c},l),lb=X("preceding",function(a,b,c,d){var e=new K,f=[];do f.unshift(b);while(b=b.parentNode);for(var g=1,r=f.length;g<r;g++){for(var v=[],b=f[g];b=b.previousSibling;)v.unshift(b);for(var J=0,s=v.length;J<s;J++)b=v[J],I(b,c,d)&&a.a(b)&&M(e,b),e=Ia(a,b,c,d,e)}return e},j,j);
X("preceding-sibling",function(a,b){for(var c=new K,d=b;d=d.previousSibling;)a.a(d)&&Ra(c,d);return c},j);var sb=X("self",function(a,b){var c=new K;a.a(b)&&M(c,b);return c},l);function tb(a){t.call(this,1);this.c=a;this.f=a.f;this.b=a.b}q(tb);tb.prototype.a=function(a){return-Q(this.c,a)};tb.prototype.toString=function(a){var a=a||"",b=a+"UnaryExpr: -\n";return b+=this.c.toString(a+"  ")};function ub(a){t.call(this,4);this.c=a;this.f=wa(this.c,function(a){return a.f});this.b=wa(this.c,function(a){return a.b})}q(ub);ub.prototype.a=function(a){var b=new K;C(this.c,function(c){c=c.a(a);c instanceof K||h(Error("PathExpr must evaluate to NodeSet."));b=Qa(b,c)});return b};ub.prototype.toString=function(a){var b=a||"",c=b+"UnionExpr:\n",b=b+"  ";C(this.c,function(a){c+=a.toString(b)+"\n"});return c.substring(0,c.length)};function vb(a){this.a=a}function wb(a){for(var b,c=[];;){Y(a,"Missing right hand side of binary expression.");b=xb(a);var d=G(a.a);if(!d)break;var e=(d=Ya[d]||k)&&d.p;if(!e){a.a.a--;break}for(;c.length&&e<=c[c.length-1].p;)b=new Va(c.pop(),c.pop(),b);c.push(b,d)}for(;c.length;)b=new Va(c.pop(),c.pop(),b);return b}function Y(a,b){a.a.b.length<=a.a.a&&h(Error(b))}function yb(a,b){var c=G(a.a);c!=b&&h(Error("Bad token, expected: "+b+" got: "+c))}
function zb(a){a=G(a.a);")"!=a&&h(Error("Bad token: "+a))}function Ab(a){a=G(a.a);2>a.length&&h(Error("Unclosed literal string"));return new eb(a)}function Bb(a){return"*"!=F(a.a)&&":"==F(a.a,1)&&"*"==F(a.a,2)?new L(G(a.a)+G(a.a)+G(a.a)):new L(G(a.a))}
function Cb(a){var b,c=[],d;if("/"==F(a.a)||"//"==F(a.a)){b=G(a.a);d=F(a.a);if("/"==b&&(a.a.b.length<=a.a.a||"."!=d&&".."!=d&&"@"!=d&&"*"!=d&&!/(?![0-9])[\w]/.test(d)))return new ib;d=new ib;Y(a,"Missing next location step.");b=Db(a,b);c.push(b)}else{a:{b=F(a.a);d=b.charAt(0);switch(d){case "$":h(Error("Variable reference not allowed in HTML XPath"));case "(":G(a.a);b=wb(a);Y(a,'unclosed "("');yb(a,")");break;case '"':case "'":b=Ab(a);break;default:if(isNaN(+b))if(!db(b)&&/(?![0-9])[\w]/.test(d)&&
"("==F(a.a,1)){b=G(a.a);b=cb[b]||k;G(a.a);for(d=[];")"!=F(a.a);){Y(a,"Missing function argument list.");d.push(wb(a));if(","!=F(a.a))break;G(a.a)}Y(a,"Unclosed function argument list.");zb(a);b=new ab(b,d)}else{b=k;break a}else b=new fb(+G(a.a))}"["==F(a.a)&&(d=new mb(Eb(a)),b=new Za(b,d))}if(b)if("/"==F(a.a)||"//"==F(a.a))d=b;else return b;else b=Db(a,"/"),d=new jb,c.push(b)}for(;"/"==F(a.a)||"//"==F(a.a);)b=G(a.a),Y(a,"Missing next location step."),b=Db(a,b),c.push(b);return new gb(d,c)}
function Db(a,b){var c,d,e;"/"!=b&&"//"!=b&&h(Error('Step op should be "/" or "//"'));if("."==F(a.a))return d=new W(sb,new N("node")),G(a.a),d;if(".."==F(a.a))return d=new W(rb,new N("node")),G(a.a),d;var f;"@"==F(a.a)?(f=hb,G(a.a),Y(a,"Missing attribute name")):"::"==F(a.a,1)?(/(?![0-9])[\w]/.test(F(a.a).charAt(0))||h(Error("Bad token: "+G(a.a))),e=G(a.a),(f=qb[e]||k)||h(Error("No axis with name: "+e)),G(a.a),Y(a,"Missing node name")):f=nb;e=F(a.a);if(/(?![0-9])[\w]/.test(e.charAt(0)))if("("==F(a.a,
1)){db(e)||h(Error("Invalid node type: "+e));c=G(a.a);db(c)||h(Error("Invalid type name: "+c));yb(a,"(");Y(a,"Bad nodetype");e=F(a.a).charAt(0);var g=k;if('"'==e||"'"==e)g=Ab(a);Y(a,"Bad nodetype");zb(a);c=new N(c,g)}else c=Bb(a);else"*"==e?c=Bb(a):h(Error("Bad token: "+G(a.a)));e=new mb(Eb(a),f.a);return d||new W(f,c,e,"//"==b)}function Eb(a){for(var b=[];"["==F(a.a);){G(a.a);Y(a,"Missing predicate expression.");var c=wb(a);b.push(c);Y(a,"Unclosed predicate expression.");yb(a,"]")}return b}
function xb(a){if("-"==F(a.a))return G(a.a),new tb(xb(a));var b=Cb(a);if("|"!=F(a.a))a=b;else{for(b=[b];"|"==G(a.a);)Y(a,"Missing next union location path."),b.push(Cb(a));a.a.a--;a=new ub(b)}return a};function Fb(a){a.length||h(Error("Empty XPath expression."));for(var a=a.match(Ga),b=0;b<a.length;b++)Ha.test(a[b])&&a.splice(b,1);a=new Fa(a);a.b.length<=a.a&&h(Error("Invalid XPath expression."));var c=wb(new vb(a));a.b.length<=a.a||h(Error("Bad token: "+G(a)));this.evaluate=function(a,b){var f=c.a(new A(a));return new Z(f,b)}}
function Z(a,b){0==b&&(a instanceof K?b=4:"string"==typeof a?b=2:"number"==typeof a?b=1:"boolean"==typeof a?b=3:h(Error("Unexpected evaluation result.")));2!=b&&(1!=b&&3!=b&&!(a instanceof K))&&h(Error("value could not be converted to the specified type"));this.resultType=b;var c;switch(b){case 2:this.stringValue=a instanceof K?Ta(a):""+a;break;case 1:this.numberValue=a instanceof K?+Ta(a):+a;break;case 3:this.booleanValue=a instanceof K?0<a.i:!!a;break;case 4:case 5:case 6:case 7:var d=O(a);c=[];
for(var e=P(d);e;e=P(d))c.push(e instanceof E?e.a:e);this.snapshotLength=a.i;this.invalidIteratorState=l;break;case 8:case 9:d=Sa(a);this.singleNodeValue=d instanceof E?d.a:d;break;default:h(Error("Unknown XPathResult type."))}var f=0;this.iterateNext=function(){4!=b&&5!=b&&h(Error("iterateNext called with wrong result type"));return f>=c.length?k:c[f++]};this.snapshotItem=function(a){6!=b&&7!=b&&h(Error("snapshotItem called with wrong result type"));return a>=c.length||0>a?k:c[a]}}Z.ANY_TYPE=0;
Z.NUMBER_TYPE=1;Z.STRING_TYPE=2;Z.BOOLEAN_TYPE=3;Z.UNORDERED_NODE_ITERATOR_TYPE=4;Z.ORDERED_NODE_ITERATOR_TYPE=5;Z.UNORDERED_NODE_SNAPSHOT_TYPE=6;Z.ORDERED_NODE_SNAPSHOT_TYPE=7;Z.ANY_UNORDERED_NODE_TYPE=8;Z.FIRST_ORDERED_NODE_TYPE=9;function Gb(a){var a=a||n,b=a.document;b.evaluate||(a.XPathResult=Z,b.evaluate=function(a,b,e,f){return(new Fb(a)).evaluate(b,f)},b.createExpression=function(a){return new Fb(a)})}var Hb=["wgxpath","install"],$=n;!(Hb[0]in $)&&$.execScript&&$.execScript("var "+Hb[0]);for(var Ib;Hb.length&&(Ib=Hb.shift());)!Hb.length&&Gb!==i?$[Ib]=Gb:$=$[Ib]?$[Ib]:$[Ib]={};})()

;//'
/**
 * conf.js
 * Configuration Parameters for NB api 
 * This module defines the namespace NB.conf
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global  NB:true*/

(function(GLOB){
    GLOB.conf = {};
    GLOB.conf.servers = {
    rpc: "",
    img: "",
    upload: ""

    };

    /*************************************************************************************
     * Replace "" (right below) with your invite key if you'd live to be automatically authenticated
     ************************************************************************************/
    GLOB.conf.identity = "";
})(NB);

/*
 * pers.js: common fct for perspective-based views
 * This module defines the namespace NB.pers
 * It requires the following modules:
 *        Module
 *        NB
 *        NB.auth
 *        jquery
 *
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global unescape:true NB:true NB$:true jQuery:true alert:false*/
(function(GLOB){
    //require auth
    if ("NB$" in window){
    var $ = NB$;
    }    
    // it would be great to use document.currentScript, but it only seems to be supported 
    // on firefox for now, so we match by filename. 
    var scriptname = "_NB.js";
    var nb_script = jQuery("script[src$='"+scriptname+"']");
    if (nb_script.length===0){
        alert("Error: Couldn't find  NB script, i.e ending in : "+ scriptname); 
        return;
    }
    if (nb_script.length>1){
        alert("Warning: Found more than one  NB script, i.e ending in : "+ scriptname + "using the last one: " + nb_script[nb_script.length-1] ); 
    }
    GLOB.pers = {
        currentScript: nb_script[nb_script.length-1],
        embedded: false
    };
    var $str        = "NB$" in window ? "NB$" : "jQuery";

    /* trick for browsers that don't support document.activeElement 
       adapted from http://ajaxandxml.blogspot.com/2007/11/emulating-activeelement-property-with.html
    */
    if (!("activeElement" in document)){
    document.activeElement = document.body;
    document.addEventListener("focus",function(evt){ 
        document.activeElement = evt.target === document ? document.body : evt.target;
        } ,true);
    document.addEventListener("blur",function(evt){ 
        document.activeElement = document.body;
        } ,true);
    }

    GLOB.pers.connection_id = 0;
    GLOB.pers.first_connection = true;
    GLOB.pers.connection_T = 1000;  // in msec
    var server_info =  GLOB.pers.currentScript.src.match(/([^:]*):\/\/([^\/]*)/);    
    GLOB.pers.server_url = server_info[1]+"://"+server_info[2];
    GLOB.pers.call = function(fctname, dict, callback, errback){
    if ((!GLOB.pers.first_connection) && GLOB.pers.connection_id === 0) {
        // we haven't received a reply yet so put this function to wait for a while
        $.L("waiting until we get a connection id...");
        window.setTimeout(function(){
            GLOB.pers.call(fctname, dict, callback, errback);
        }, GLOB.pers.connection_T);
        return;
    }
    GLOB.pers.first_connection = false;
    var cb = function(x){
        if ("CID" in x.status){
        GLOB.pers.connection_id = x.status.CID;
        }
        if (x.status.errno){
        //just display that there was an error for now
        if (errback !== undefined){
            errback(x.status, x.payload);
        }
        $.L(x.status.msg);
        return;
        }
        //     console.log("cb w/ x=", x);
        callback(x.payload);
    };
    var auth_str = GLOB.conf.userinfo.guest ? "guest=1" : "ckey="+GLOB.conf.userinfo.ckey;
    $.post(GLOB.conf.servers.rpc+"/pdf4/rpc?"+auth_str ,{"cid": GLOB.pers.connection_id, "f": fctname, "a": JSON.stringify(dict)}, cb, "json");
    };


    GLOB.pers.__authenticate = function(init_ui){
    var uinfo = GLOB.conf.userinfo = JSON.parse(unescape(GLOB.auth.get_cookie("userinfo"))) || {guest: true}; 
    var nbhostname = GLOB.pers.server_url;
    var $login_contents;
    if (uinfo.guest){
        $login_contents = $("<ul class='dropdown-menu'><li><a id='login-name' href='#'>Guest</a><ul><li><a href='javascript:"+$str+".concierge.get_component(\"login_user_menu\")()'>Log in</a></li><li><a href='javascript:"+$str+".concierge.get_component(\"register_user_menu\")()'>Register</a></li><li><a href='javascript:"+$str+".concierge.get_component(\"logout\")()'>Log out</a></li></ul></li></ul>");
        var $util_window = $.concierge.get_component("get_util_window")();
        $("#register_user_dialog, #login_user_dialog").remove();    

        $util_window.append("<div id=\"register_user_dialog\">   <div id='reg_welcome'>Welcome to NB !</div><div id='reg_benefits'>Registering only takes a few seconds and lets you annotate online PDFs...</div>  <table> <tr><td>Firstname</td><td><input type=\"text\" id=\"register_user_firstname\" /></td></tr> <tr><td>Lastname</td><td><input type=\"text\" id=\"register_user_lastname\" /></td></tr> <tr style=\"display: none;\"><td>Pseudonym</td><td><input type=\"text\" id=\"register_user_pseudonym\" /></td></tr><tr><td>Email</td><td><input type=\"text\" id=\"register_user_email\" /></td></tr><tr><td>Password</td><td><input type=\"password\" id=\"register_user_password1\" /></td></tr><tr><td>Confirm Password</td><td><input type=\"password\" id=\"register_user_password2\" /></td></tr>  <tr><td><span>Or use</span> </td><td><button title='Register using your Google account' onclick='if("+$str+"(\"#termsandconditions:checked\").length){document.location=\""+nbhostname+"/openid/login?next="+(document.location.pathname==="/login" ? "/": document.location.pathname)+"\";}else{alert(\"In order to register with your Google account, please agree with NB Terms and Conditions by checking the checkbox below\");}'><img style='vertical-align: middle;' src='/content/data/icons/png/1345558452_social_google_box.png' alt='your Google account'/></button><button  title='Register using your Facebook account' onclick='if("+$str+"(\"#termsandconditions:checked\").length){document.location=\"/openid/login?next="+(document.location.pathname==="/login" ? "/": document.location.pathname)+"\";}else{alert(\"In order to register with your Facebook account, please agree with NB Terms and Conditions by checking the checkbox below\");}'><img style='vertical-align: middle;' src='"+nbhostname+"/content/data/icons/png/1345558472_social_facebook_box_blue.png' alt='your Facebook account'/></button> </td></tr> </table> <div>     <input type=\"checkbox\" id=\"termsandconditions\" />      <label for=\"termsandconditions\">I agree with <a target=\"_blank\" href=\""+nbhostname+"/terms_public_site\">NB Terms and Conditions</a></label></div>  <div class=\"form_errors\"></div> </div>").append($.concierge.get_component("get_login_dialog_markup")());

        if (init_ui){
        $("#login_user_password").keypress(function(e) {if(e.keyCode === 13 && this.value.length>0) {
                $.L("using shortcut");
                $("#login_user_dialog").parent().find("button:contains('Ok')").click();}});    
        }
    }
    else{
        var screenname = uinfo.firstname === null ? $.E(uinfo.email): $.E(uinfo.firstname) + " " + $.E(uinfo.lastname); 
        $login_contents = $("<ul class='dropdown-menu'><li><a id='login-name' title='"+$.E(uinfo.email)+"' href='#'>"+screenname+"</a><ul><li id='menu_settings'><a target='_blank' href='"+nbhostname+"/settings'>Settings</a></li><li id='menu_logout'><a href='javascript:"+$str+".concierge.get_component(\"logout\")()'>Log out</a></li></ul></li></ul>");
    }
    if (init_ui){
        $("#login-window").remove();
        var $login_window = $("<div id='login-window'/>");
        $login_contents.append($("<li><a href='#'>Help</a><ul><li><a href='"+nbhostname+"/tutorial'>Tutorial</a></li><li><a href='"+nbhostname+"/faq'>FAQ</a></li><li><a href='"+nbhostname+"/contact'>Contact Us</a></li><li><a href='"+nbhostname+"/disclaimer'>Disclaimer</a></li></ul></li>"));
        $login_window.append($login_contents);
        $("body").append($login_window);
    }
    GLOB.pers.params = GLOB.dom.getParams();
    };

    GLOB.pers.add_css = function(url){
        var o = document.createElement("link");
        o.type = "text/css";
        o.href = url;
        o.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(o);
    };

    GLOB.pers.preinit = function(init_ui){
    if (init_ui === undefined){
        init_ui = true;
    }
    $.concierge.addComponents(GLOB.pers.__components);
    GLOB.pers.__authenticate(init_ui);   
    if ("init" in GLOB.pers){ 
        GLOB.pers.init();
    }
    };
    
    /* stuff that can be used in various views */
    GLOB.pers.__components = {
        logout: function(p,cb){
            GLOB.auth.delete_cookie("userinfo");
            GLOB.auth.delete_cookie("ckey");
            if (GLOB.pers.embedded){
                document.location.reload();
            }
            else{
                document.location.pathname ="/logout";
            }

        },
        location_closestpage:  function(p, cb){ 
        /* given a location and id (in payload) returns "closest" location id found on a different page: 
           - if "direction" is "down": "closest" is the location at the top-most position of the next page which has a location
           - if "direction" is "up": "closest" is the location at the bottom-most position of the previous page which has a location
        */
        var m = p.model;
        var loc = m.o.location[p.id];
        var me = $.concierge.get_component("get_userinfo")();
        var file = m.o.file[loc.id_source];
        var page = loc.page;
        var f_sort_down = function(o1, o2){return o1.top-o2.top;};    
        var TYPE_STAR = $.concierge.get_constant("STAR");
        var TYPE_QUESTION = $.concierge.get_constant("QUESTION");
        var new_id = null;    
        var i, ids;
        var locs;
        if (p.direction === "down"){
        i = page+1;
        while (i<=file.numpages){
            locs = m.get("location", {id_source: loc.id_source, page: i});
            if (p.filters){
            if (p.filters.me){
                locs = locs.intersect(m.get("comment", {id_author: me.id}).values("ID_location"));
            }
            if (p.filters.star){
                locs = locs.intersect(m.get("threadmark", {active: true, type: TYPE_STAR }).values("location_id"));
            }
            if (p.filters.question){
                locs = locs.intersect(m.get("threadmark", {active: true, type: TYPE_QUESTION }).values("location_id"));
            }
            }
            if (locs.length()){
            new_id = locs.min("top");
            break;
            }
            i++;
        }
        }
        else{
        i = page-1;
        while (i>0){
            locs = m.get("location", {id_source: loc.id_source, page: i});
            if (p.filters){
            if (p.filters.me){
                locs = locs.intersect(m.get("comment", {id_author: me.id}).values("ID_location"));
            }
            if (p.filters.star){
                locs = locs.intersect(m.get("threadmark", {active: true, type: TYPE_STAR }).values("location_id"));
            }
            if (p.filters.question){
                locs = locs.intersect(m.get("threadmark", {active: true, type: TYPE_QUESTION }).values("location_id"));
            }
            }
            if (locs.length()){
            new_id = locs.max("top");
            break;
            }
            i--;
        }
        }
        return new_id;
    }, 
    register_user_menu : function(P, cb){
        $.L("register_user_menu");
        $('#register_user_dialog').dialog({
            title: "Register for a new account...", 
            width: 400,
            buttons: { 
            "Cancel": function() { 
                $(this).find("div.form_errors").empty();
                $(this).dialog("destroy");  
            },
                "Ok": function() {
                var $dlg = $(this);
                var err = function(msg){
                    $dlg.find("div.form_errors").hide().text(msg).show("fast");
                };
                if ($("#register_user_password1")[0].value !== $("#register_user_password2")[0].value){
                    err("passwords don't match: please retype them");
                    return;
                }
                if ($("#register_user_firstname")[0].value.length === 0){
                    err("Please enter your firstname");
                    return;
                }
                if ($("#register_user_lastname")[0].value.length === 0){
                    err("Please enter your lastname");
                    return;
                }
                if ($("#register_user_email")[0].value.match(/^([^@ ]+)@+([^@ ]+)$/)==null){
                    err("Please enter a valid e-mail address");
                    return;
                }
                if ($("#termsandconditions:checked").length === 0){
                    err("You need to accept NB terms and conditions in order to register.");
                    return;
                }
                var payload = {
                    firstname: $("#register_user_firstname")[0].value, 
                    lastname: $("#register_user_lastname")[0].value, 
                    email: $("#register_user_email")[0].value, 
                    pseudonym: $("#register_user_pseudonym")[0].value,
                    password: $("#register_user_password1")[0].value, 
                    ckey: GLOB.conf.userinfo.ckey};
                $.concierge.get_component("register_user")(payload, function(p){
                    $.I("Thanks for registering... You should receive a confirmation code by email in less than a minute...");
                    $dlg.dialog("destroy");
                    }, function(status, p){
                    err(status.msg);});
                }
            }
        });
        $('#register_user_dialog').dialog("open");
    }, 
    login_user_menu: function(P,cb){
        $.L("login_user_menu");
        $('#login_user_dialog').dialog({
            title: "Log in...", 
            width: 390,
            buttons: { 
            "Cancel": function() { 
                $(this).find("div.form_errors").empty();
                $(this).dialog("destroy");  
            },
                "Ok": function() { 
                var $dlg = $(this);
                var err = function(msg){
                    $dlg.find("div.form_errors").hide().text(msg).show("fast");
                };
                var payload = { 
                    email: $("#login_user_email")[0].value,
                    password: $("#login_user_password")[0].value
                };
                $.concierge.get_component("login_user")(payload , function(p){
                    if (p.ckey !== null){
                        $.concierge.trigger({type:"successful_login", value: p});
                        $dlg.find("div.form_errors").empty();
                        $dlg.dialog("destroy");  
                    }
                    else{
                        err("email or password doesn't match. Please try again");
                    }
                    });
                }
            }
        });    
        $('#login_user_dialog').dialog("open");
    }, 
    get_util_window: function(P, cb){
        var $util_window = $("div.util_windows");
    
        if ($util_window.length === 0){
        $util_window = $("<div class='util_windows' style='display:none'/>");
        }
        $("body").append($util_window);
        return $util_window;
    }, 
    register_user: function(P, cb, eb){
        GLOB.pers.call("register_user", P, cb, eb);
    },
    advanced_filter: function(P, cb, eb){
        GLOB.pers.call("advanced_filter", P, cb, eb);
    },
    login_user: function(P, cb){
        GLOB.pers.call("login_user", P, cb);
    }, 
    get_userinfo: function(P, cb){
        return GLOB.conf.userinfo;
    }, 
    mini_splashscreen: function(P,cb){
        var widget;
        var nbhostname  = GLOB.pers.server_url;
        if (GLOB.conf.userinfo.guest){ //splashscreen for non-registered user
        widget =  "<div class=\"minisplashscreen ui-corner-all\">  <div id=\"splash-welcome\">Welcome to NB !</div><div id=\"nb-def\">...a forum on top of every PDF.</div> <ul id=\"splash-list-instructions\"> <li>Use your mouse or the <span class=\"ui-icon ui-icon-circle-triangle-w\"></span> and <span class=\"ui-icon ui-icon-circle-triangle-e\"></span> keys to move from discussion to discussion.</li> <li>Use your mouse or the  <span class=\"ui-icon ui-icon-circle-triangle-n\"></span> and  <span class=\"ui-icon ui-icon-circle-triangle-s\"></span> keys to scroll up and down the document.</li> <li>New user ? <a href='javascript:$.concierge.get_component(\"register_user_menu\")()'>Register</a> now to be able to post comments...</li> <li>Existing user ? <a href='javascript:$.concierge.get_component(\"login_user_menu\")()'>Log in</a> now...</li> </ul>  <a target=\"_blank\" href=\""+nbhostname+"/help\">More help...</a>  </div>       ";
        }
        else{ //splashscreen for registered user
        widget = "<div class=\"minisplashscreen ui-corner-all\">  <div id=\"splash-welcome\">Welcome to NB !</div> <ul id=\"splash-list-instructions\"> <li>Use your mouse or the <span class=\"ui-icon ui-icon-circle-triangle-w\"></span> and <span class=\"ui-icon ui-icon-circle-triangle-e\"></span> keys to move from discussion to discussion.</li> <li>Use your mouse or the  <span class=\"ui-icon ui-icon-circle-triangle-n\"></span> and  <span class=\"ui-icon ui-icon-circle-triangle-s\"></span> keys to scroll up and down the document.</li> <li>Drag across any region on the pdf to create a new discussion</li> <li>Right-click on any comment to post a reply</li> </ul>  <a target=\"_blank\" href=\""+nbhostname+"/help\">More help...</a>  </div>       ";
        }
        return widget;
    },
    note_deleter: function(P, cb){GLOB.pers.call("deleteNote", P, cb);},
    rate_reply: function(P,cb){GLOB.pers.call("rate_reply", P, cb);}, 
    mark_thread: function(P,cb){GLOB.pers.call("markThread", P, cb);},
    get_login_window: function(P,cb){
        return $("#login-window");
    }, 
    get_file_stats: function(P,cb){
        var payload_objects = {types: ["file_stats"]};
        if ("id_ensemble" in P){
        payload_objects["payload"]= {id_ensemble: P.id_ensemble};
        }
        GLOB.pers.call("getObjects",payload_objects, cb);
    }, 
    in_progress: function(P,cb){
        var msg="Loading in progress...";
        if (P !== undefined && "msg" in P){
        msg = P.msg;
        }
        return "<div align='center' class='loadingpane'><img src='content/data/icons/gif/loader1.gif'/><div class='loadingpane-msg'>"+msg+"</div></div>";
    }, 
    pretty_print_timedelta: function(P,cb){
        var d = new Date(P.t);
        var now = new Date();
        var delta_s = parseInt((now-d)/1000, 10);    
        var s = "";
        if (delta_s<3600){       
            s += (parseInt(delta_s/60, 10) + " minutes ago");
        }
        else if (delta_s < 3600*24){
            s += (parseInt(delta_s/3600, 10) + " hours ago");
        }
        else{
            s += (parseInt(delta_s/(3600*24), 10) + " days ago");
        }
        return s;
    }, 
    get_login_dialog_markup: function(P,cb){
        var nbhostname = GLOB.pers.server_url;

        return "<div id='login_user_dialog' > <table cellspacing='5px'> <tr><td>Email</td><td><input type='text'  id='login_user_email' ></input></td></tr><tr><td>Password</td><td><input type='password'  id='login_user_password' ></input></td></tr><tr><td/><td><span id='loginbutton_classic'/><a style='padding-left: 10px;  font-size: x-small' href='"+nbhostname+"/password_reminder'>Lost password ?</a></td></tr><tr style='display: none'><td style='font-size: small'>Or use</td><td id='loginbuttons_sso'><button title='Login using your Google account' onclick='document.location=\""+nbhostname+"/openid/login?next="+(document.location.pathname==="/login" ? "/": document.location.pathname)+"\"'><img style='vertical-align: middle;' src='"+nbhostname+"/content/data/icons/png/1345558452_social_google_box.png' alt='your Google account'/></button><button style='display: none' title='Login using your Facebook account' onclick='document.location=\"/facebook/login?next="+(document.location.pathname==="/login" ? "/": document.location.pathname)+"\"'><img style='vertical-align: middle;' src='/content/data/icons/png/1345558472_social_facebook_box_blue.png' alt='your Facebook account'/></button></td></tr></table><div class='form_errors'/></div>";
        }, 
    get_sec_mult_factor: function(){
	return 100;
    }, 
    get_metronome_period_s: function(){
	return 0.2;
    }
    };
})(NB);

/*global NB:true NB$:true $:true rangy:true alert:true wgxpath:true jQuery:true getElementCSSSelector:true console:true */
(function(GLOB){
    var _scrollTimerID=null;
    var _scrollCounter=0;
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
                    // use window.innerHeight if available, else use document.body.clientHeight,
                    // else use documentElement.clientHeight
                    var viewHeight =
                        window.innerHeight || document.body.clientHeight || window.document.documentElement.clientHeight;
                    var viewBottom =
                        viewTop +
                        (viewHeight) * 0.9;
                    var elementTop = $(".nb-comment-highlight[id_item="+event.value+"]").offset().top;

                    if (viewTop > elementTop || viewBottom < elementTop) {

                        $("body, html").animate({
                            scrollTop: $(".nb-comment-highlight[id_item="+event.value+"]").offset().top - viewHeight / 4
                        });
                     }
                }
            }, 
            GLOB.html.id);

        rangy.init();
        
        $(window).scroll(function(evt){
                var timerID = _scrollTimerID;
                if (timerID !== null){
                    window.clearTimeout(timerID);
                    _scrollTimerID =  null;
                }
                timerID = window.setTimeout(function(){
                        $.concierge.logHistory("scrolling", ["s",$("html").scrollTop(),$(window).height(), _scrollCounter++, $("body").height(),$.concierge.get_state("file") ].join(","));
                    }, 300);               
                _scrollTimerID =  timerID;    
            });
        
        // Wrap elements with nb-comment-fresh which is then selected by jQuery and operated on properly;
        // the styled element must have an nb-comment-highlight class.
        cssApplier = rangy.createClassApplier("nb-comment-fresh", { normalize: true });

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
            var tagName, pathIndex, fullName;
            var terminate = false;

            if (element.id) {
                fullName = '/*[@id="' + element.id + '"]';
                terminate = true;
            } else {

                for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                    // Ignore document type declaration.
                    if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE){
                        continue;
                    }

                    if (sibling.nodeName === element.nodeName){
                        ++index;
                    }
                }

                tagName = element.nodeName.toLowerCase();
                pathIndex = (index ? "[" + (index + 1) + "]" : "");
                fullName = tagName + pathIndex;

            }

            paths.splice(0, 0, fullName);

            if (terminate) {
                break;
            }
        }

        return paths.length ? "/" + paths.join("/") : null;
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

})(NB);

/*
 * buildEmbed.js: build embedded NB 
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true $:true NB$:true NB:true alert:true escape:false console:false*/

(function(GLOB){
    
    if ("NB$" in window){
        var $ = NB$;
    }
    var $str        = "NB$" in window ? "NB$" : "jQuery";

    
    var $vp;
    var id_ensemble = null;  
    GLOB.pers.iframe_id = "nb_iframe";
    var f_after_successful_login = function(){
        //SACHA: TODO. Do a better job that just displaying the user name, and maybe refactor with pers2._authenticate.
        //for now, just update user name and email on hover. :
        var uinfo = GLOB.conf.userinfo;
        if (!uinfo.guest){
            var screenname = uinfo.firstname === null ? $.E(uinfo.email): $.E(uinfo.firstname) + " " + $.E(uinfo.lastname);         
            $("#login-name").text(screenname).attr("title", $.E(uinfo.email));
        }
        
        //now move stuff here it's supposed to be: 
        $vp = $("<div class='nb-viewport'><div class='nb-widget-header' style='height:24px;' /></div>").prependTo(".nb_sidebar");
        $("#login-window").appendTo(".nb-widget-header"); // add this here so it's fixed as well
        //TODO: get id_ensemble from cookie or localStorage if available. 
        $.concierge.addConstants({res: 288, scale: 25, QUESTION: 1, STAR: 2 });
        $.concierge.addComponents({
            notes_loader:    function(P, cb){GLOB.pers.call("getNotes", P, cb);}, 
            note_creator:    function(P, cb){GLOB.pers.call("saveNote", P, cb);},
            note_editor:    function(P, cb){GLOB.pers.call("editNote", P, cb);},
            bulk_import_annotations: function(P, cb) {
                GLOB.pers.call("bulk_import_annotations", {
                    locs_array: P.locs_array,
                    from_source_id: P.from_source_id,
                    to_source_id: P.to_source_id,
                    import_type: P.import_type
                }, cb);
            },
            set_location_section: function (P, cb) {
                GLOB.pers.call("set_location_section", {
                    id_location: P.id_location,
                    id_section: P.id_section
                }, cb);
            },
            promote_location_by_copy: function (P, cb) {
                GLOB.pers.call("promote_location_by_copy", {
                    id_location: P.id_location
                }, cb);
            },
            delete_thread: function (P, cb) {
                GLOB.pers.call("deleteThread", {
                    id_location: P.id_location
                }, cb);
            }
        });
        GLOB.pers.store = new GLOB.models.Store();
        GLOB.pers.call(
            "getHTML5Info", {id_ensemble: id_ensemble, url: document.location.href.replace(document.location.hash, "")},
                   function(payload){
                       //TODO: refactor (same as in step16.js:createStore)
                       GLOB.pers.store.create(payload, {
                               ensemble:    {pFieldName: "ensembles"}, 
            section:    {pFieldName: "sections", references: {id_ensemble: "ensemble"}},            
                                   file:    {pFieldName: "files", references: {id_ensemble: "ensemble", id_folder: "folder"}}, 
                                   folder: {pFieldName: "folders", references: {id_ensemble: "ensemble", id_parent: "folder"}}, 
                                   comment:{references: {id_location: "location"}},
                                   location:{references: {id_ensemble: "ensemble", id_source: "file"}}, 
                                   html5location:{references: {id_location: "location"}}, 
                                   link: {pFieldName: "links"}, 
                                   mark: {}, 
                                   threadmark: {pFieldName: "threadmarks", references: {location_id: "location"}},
                                   draft: {},
                                   seen:{references: {id_location: "location"}},
			   members: {},
			   tags: {references: {user_id: "members", comment_id: "comment"}}
                           });

		       var ensemble = NB.pers.store.get("ensemble", {}).first();
                     
                       //get the section info as well as info whether user is admin: 
                       GLOB.pers.call("getSectionsInfo", {id_ensemble: ensemble.ID}, function(P3){
                           var m = GLOB.pers.store;
                           m.add("section", P3["sections"]);
                           ensemble.admin=true; //we only get a callback if we're an admin for this ensemble
                       });


		       GLOB.pers.call("getMembers", {id_ensemble: ensemble.ID}, function(P5){
			   console.log("getMembers callback");

			   GLOB.pers.store.add("members", P5);
		       });
                       
                       //TODO: Take something else than first id_source
                       var source = GLOB.pers.id_source = NB.pers.store.get("file").first();
                       if (source === null){
                           $("<div class=\"nb-error\"><p>The URL for this page isn't registered on NB. Click this message to close the NB sidebar.</p></div>").
                             appendTo(".nb_sidebar>.nb-viewport").click(function() {
                                 $(".nb_sidebar").fadeOut(400);
                             });
                           return;
                       }
                       var id_source = GLOB.pers.id_source = NB.pers.store.get("file").first().ID;
                       $.concierge.setHistoryHelper(function(_payload, cb){
                               _payload["__return"] = {type:"newNotesOnFile", a:{id_source: GLOB.pers.id_source}};
                               GLOB.pers.call("log_history", _payload, cb);
                           }, 120000,  function(P2){    
                               //here we override the callback so that we can get new notes.
                                   
                               var m = GLOB.pers.store;
                               m.add("comment", P2["comments"]);
                               m.add("location", P2["locations"]);
                               m.add("html5location", P2["html5locations"]);
                               var msg="";
                               var l,c;
                               for (var i in P2["comments"]){
                                   c = m.o.comment[i];
                                   l = m.o.location[c.ID_location];
                                   if (c.id_author !==  $.concierge.get_component("get_userinfo")().id){    //do nothing if I'm the author:         
                                       msg+="<a href='javascript:"+$str+".concierge.trigger({type: \"select_thread\", value:\""+l.ID+"\"})'>New comment on page "+l.page+"</a><br/>";
                                   }
                               }
                               if (msg !== ""){
                                   $.I(msg, true);
                               }
                           });    
                       $.concierge.trigger({type:"file", value: id_source});

                       //let's create perspective here: 
                       var $pers        = $("<div id='pers_"+id_source+"'/>").appendTo($vp);

                       var notesview = {
                           priority: 1, 
                           min_width: 650, 
                           desired_width: 35, 
                           min_height: 1000, 
                           desired_height: 50, 
                           content: function($div){
                               $div.notepaneView();
                               $div.notepaneView("set_model",GLOB.pers.store );
                           }
                       }; 
                       var threadview = {
                           priority: 1, 
                           min_width: 650, 
                           desired_width: 35,  
                           min_height: 1000, 
                           desired_height: 50, 
                           content: function($div){
                               $div.threadview();
                               $div.threadview("set_model",GLOB.pers.store );                
                           }
                       };
                       var editorview = {
                           priority: 1, 
                           min_width: 650, 
                           desired_width: 35,  
                           min_height: 1500, 
                           desired_height: 50, 
                           transcient: true,  
                           content: function($div){
                               var m = GLOB.pers.store;
                               var ensemble = m.o.ensemble[m.o.file[id_source].id_ensemble];                    
                               $div.editorview({allowStaffOnly: ensemble.allow_staffonly, allowAnonymous: ensemble.allow_anonymous});
                               $div.editorview("set_model",GLOB.pers.store );                
                           }
                       };
                      
                       
                       //SACHA FIXME: Hack we embed the following into a delay because FF doesn't compute the right window height if we execute this right away
                       setTimeout(function(){                               
                          $pers.perspective({
                                  ext_separator: {
                                      container: ".nb_sidebar", 
                                          orientation: "vertical"
                                      
                                          },
                               height: function(){
                                   return $vp.height() - ($pers.offset().top - $vp.offset().top);
                               }, //3rd term is to account for the fact we have NB embedded as part of widget that has a 'fixed' position
                               listens: {
                                   page_peek: function(evt){
                                       //need to add 1 value for uniqueness
                                       $.concierge.logHistory("page", evt.value+"|"+id_source+"|"+(new Date()).getTime());
                                   }, 
                                   close_view: function(evt){
                                       if (evt.value === this.l.element[0].id){
                                           delete($.concierge.features.doc_viewer[id_source]);
                                       }
                                       $.L("closeview: ", evt, this.l.element[0].id);
                                   }                    
                               }, 
                               views: {
                                   v1: { data: notesview }, 
                                   v2: {
                                       children: {
                                           v1: { data: threadview},
                                           v2: {data: editorview},
                                           orientation: "horizontal"
                                   }},
                                   orientation: "horizontal"
                                   }
                           });
                       
                       //end of perspective creation code

                       var f = GLOB.pers.store.o.file[id_source];
                       $.concierge.get_component("notes_loader")( {file:id_source }, function(P){
                               var m = GLOB.pers.store;
                               m.add("seen", P["seen"]);
                               m.add("comment", P["comments"]);
                               m.add("location", P["locations"]);
                               m.add("html5location", P["html5locations"]);
                               m.add("link", P["links"]);
                               m.add("threadmark", P["threadmarks"]);
                               //now check if need to move to a given annotation: 
                               if ("c" in GLOB.pers.params){
                                   window.setTimeout(function(){
                                           var id =  GLOB.pers.params.c;
                                           var c = m.get("comment", {ID: id}).items[id];
                                           if ("reply" in GLOB.pers.params){
                                               $.concierge.trigger({type: "reply_thread", value: c.ID});
                                           }            
                                           $.concierge.trigger({type: "select_thread", value: c.ID_location});
                                           

                                       }, 300);
                               }
                               else if ("p" in GLOB.pers.params){
                                   window.setTimeout(function(){
                                           var page = GLOB.pers.params.p;
                                           $.concierge.trigger({type: "page", value: page});
                                       }, 300);
                               }
                               else{
                                   window.setTimeout(function(){
                                           $.concierge.trigger({type: "page", value: 1});
                                       }, 300);
                               }
                           });
                           }, 1000);

                       $("body").addClass("nb-active");
                       $(function(){GLOB.html.init();});
                   },
                   function(P){
                       $(".nb-widget-header").append("<button id='login_to_nb'>Login to NB</button>");
                       $("#login_to_nb").click(function(evt){
                               //sacha: disable this for now. 
                               //console.log("opening iframe");
                               //                               $("#"+GLOB.pers.iframe_id).removeClass("nb_hidden");
                               $.concierge.get_component("login_user_menu")();
                               
                       });
                   });    

};
    GLOB.pers.ckey_from_iframe = null;
    GLOB.pers.f_poll_iframe = function(){
        console.log("polling iframe");
        $("#"+GLOB.pers.iframe_id)[0].contentWindow.postMessage("confkey", "http://localhost:8001");
        if (GLOB.pers.ckey_from_iframe === null){
            setTimeout(GLOB.pers.f_poll_iframe, 500);
        }
        else{
            console.log("got ckey - no more polling", GLOB.pers.ckey_from_iframe);
        }
    }; 
    GLOB.pers.init = function(){
        GLOB.pers.connection_id = 0;
        GLOB.pers.embedded = true;
        //add our CSS
        var cur =  GLOB.pers.currentScript;
        var server_info =  cur.src.match(/([^:]*):\/\/([^\/]*)/);    
        var server_url = server_info[1]+"://"+server_info[2];
        GLOB.pers.add_css(server_url+"/content/compiled/embed_NB.css");
        //GLOB.pers.openid_url=server_url+"/openid/login?next=/embedopenid";
        //sacha: disabled this as well for now. 
        GLOB.pers.openid_url="";

        // Make sure concierge won't steal our keys!
        $.concierge.keydown_block = false;

        //register for some events: 
        $.concierge.addListeners(GLOB.pers, {
                successful_login: function(evt){
                    GLOB.auth.set_cookie("ckey", evt.value.ckey);
                    GLOB.auth.set_cookie("userinfo", escape(JSON.stringify(evt.value)));
                    GLOB.conf.userinfo = evt.value;
                    $.L("Welcome TO NB !");
                    $("#splash-welcome").parent().remove();
                    
                    f_after_successful_login();
                    
                    
                }
            }, "globalPersObject");
        
        //tell who to make rpc requests to
        GLOB.conf.servers.rpc=GLOB.pers.server_url;

        $("body").append("<div class='nb_sidebar' class='nb_inactive'></div><iframe src='"+GLOB.pers.openid_url+"' class='nb_iframe nb_hidden' id='"+GLOB.pers.iframe_id+"'></iframe>");
        
        $("#nb_loginbutton").click(function(){
                $.concierge.get_component("login_user_menu")();
            });

        //if authenticated already, let's proceed: 
        if (GLOB.conf.userinfo){
            f_after_successful_login();
        }

        window.addEventListener('message', function(e){
                console.log("got event: ", e);
                //TODO: clearTimeout
            }, false);

        

    }; 
    
    jQuery(function(){
            GLOB.pers.params = GLOB.dom.getParams(); 
            GLOB.pers.preinit();
        });

    })(NB);
