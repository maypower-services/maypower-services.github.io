// closest
(function (ElementProto) {
    if (typeof ElementProto.matches !== 'function') {
	ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
	    var element = this;
	    var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
	    var index = 0;
	    
	    while (elements[index] && elements[index] !== element) {
		++index;
	    }
	    
	    return Boolean(elements[index]);
	};
    }
    
    if (typeof ElementProto.closest !== 'function') {
	ElementProto.closest = function closest(selector) {
	    var element = this;
	    
	    while (element && element.nodeType === 1) {
		if (element.matches(selector)) {
		    return element;
		}
		
		element = element.parentNode;
	    }
	    
	    return null;
	};
    }
})(window.Element.prototype);

// neccessary to make events work with dynamically replaced <script>
function mws_evalScripts(el) {
    if (!el) return false;
    var scripts = el.getElementsByTagName("script");
    Array.prototype.forEach.call(scripts, function(el, i){
        eval(el.innerHTML);
    });
}

function mws_clickOnEnter(el, event) {
    if (event.keyCode === 13) {
	event.preventDefault();
	el.click();
    }
}

function mws_hasClass (el, className) {
    if (el.classList)
	return el.classList.contains(className);
    else
	return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}

function siblings(el) {
    return Array.prototype.filter.call(el.parentNode.children, function(child){
        return child !== el;
    });
}

function forEach(array, fn) {
    for (var i = 0; i < array.length; i++)
        fn(array[i], i);
}

function mws_forEachElement (selector, fn) {forEachElement(selector, fn)}

function forEachElement(selector, fn) {
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++)
        fn(elements[i], i);
}

function mws_removeEventListener(el, eventName, handler) {
    if (el.removeEventListener)
	el.removeEventListener(eventName, handler);
    else
	el.detachEvent('on' + eventName, handler);
}

function mws_addEventListener(el, eventName, handler) {
    try {
	if (el instanceof Element) {
	    if (el.addEventListener)
		el.addEventListener(eventName, handler);
	    else
		el.attachEvent('on' + eventName, function(){
		    handler.call(el);
		});
	    return true;
	}
	else if (el.prototype && el.prototype.isPrototypeOf(nodes) && el.length <= 0)
	    return false;
	// nodelist
	return forEachElement(el, function(el1) {
	    mws_addEventListener(el1, eventName, handler);
	});

    } catch (error) {console.log(error, "addEventListener", el)}
}

function mws_ready(fn) {
    if (document.readyState != 'loading'){
	fn();
    } else if (document.addEventListener) {
	document.addEventListener('DOMContentLoaded', fn);
    } else {
	document.attachEvent('onreadystatechange', function() {
	    if (document.readyState != 'loading')
		fn();
	});
    }
}

function indexOf(array, item) {
    for (var i = 0; i < array.length; i++) {
	if (array[i] === item)
	    return i;
    }
    return -1;
}

isArray = Array.isArray || function(arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
};

function mws_map(arr, fn) {
    var results = [];
    for (var i = 0; i < arr.length; i++)
	results.push(fn(arr[i], i));
    return results;
}

function mws_toggleClass (el, className) {
    if (!(el instanceof Element)) return false;
    if (el.classList) {
	el.classList.toggle(className);
    } else {
	var classes = el.className.split(' ');
	var existingIndex = -1;
	for (var i = classes.length; i--;) {
	    if (classes[i] === className)
		existingIndex = i;
	}
	
	if (existingIndex >= 0)
	    classes.splice(existingIndex, 1);
	else
	    classes.push(className);
	
	el.className = classes.join(' ');
    }
};

function qsa (handle) {
    return document.querySelectorAll(handle);
}

function mws_removeClass (el, className) {
    try {
	if (el.classList)
	    el.classList.remove(className);
	else
	    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');	
    } catch (err) {}
};

function rmc (el, className) {return mws_removeClass(el, className)};

function mws_addClass (el, className) {
    if (el.classList) {
	el.classList.add(className);
    } else {
	var current = el.className, found = false;
	var all = current.split(' ');
	for(var i=0; i<all.length, !found; i++) found = all[i] === className;
	if(!found) {
	    if(current === '') el.className = className;
	    else el.className += ' ' + className;
	}
    }
}
