function load_form(id, html, closeable) {
    if (document.getElementById('stage-' + id)) return false;
    var stage, form, scripts, firstInput;

    if (document.getElementById('app-wrapper'))
	document.getElementById('app-wrapper').insertAdjacentHTML('afterend', html);
    else if (document.getElementById('modal-stage'))
	document.getElementById('modal-stage').innerHTML = html;
    else if (document.getElementById('stage'))
	document.getElementById('stage').insertAdjacentHTML('afterend', html);
    else
	document.body.innerHTML += html;
    
    window.yo_form_id = id;
    stage = document.getElementById("stage-" + id);
    form = document.getElementById(id);
    scripts = form.getElementsByTagName("script");
    Array.prototype.forEach.call(scripts, function(el, i){
        try {eval(el.innerHTML);}catch(err) {}
    });

    // focus first
    firstInput = form.querySelector(".simple-form > .field:first-of-type input");
    if (firstInput) firstInput.focus();

    if (closeable)
    	// add esc listener
    	yo_addEventListener(document, 'keydown', close_on_esc);
}

function form_success(id) {
//     if (typeof toastr !== 'undefined') toastr.success("Success!");
    close_form(id);
}

function close_form(id) {
    var stage = document.getElementById("stage-" + id);
    if (stage) stage.remove();
    // remove esc listener
    yo_removeEventListener(document, 'keydown', close_on_esc);
}

var close_on_esc = function(e) {
    if (e.keyCode === 27) close_form(window.yo_form_id);
}

function is_loading(el) {
    var className = 'is-loading';
    if (el.classList) el.classList.add(className);
    else el.className += ' ' + className;
    el.disabled = 'disabled';
}

function loading_done(id) {
    try {
	el = document.querySelector("#" + id + " .is-loading");
	var className = 'is-loading';
	if (el.classList) el.classList.remove(className);
	else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	el.removeAttribute('disabled');
    } catch (err) {}
}

// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                if (this.parentNode === null) {
                    return;
                }
                this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

function yo_addEventListener(el, eventName, handler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function(){
            handler.call(el);
        });
    }
}

function yo_removeEventListener(el, eventName, handler) {
    if (el.removeEventListener)
        el.removeEventListener(eventName, handler);
    else
        el.detachEvent('on' + eventName, handler);
}
