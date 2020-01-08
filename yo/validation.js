function validation_clear_form(id) {
    forEachElement("#" + id + " input, #" + id + " textarea, #" + id + " .list", function(el) {
        el.style.border = "";
    });
}

function validation_error(form, id, message) {
    console.log("validation error", {form: form, id: id, message: message});
    el = document.getElementById(id);
    el.style.border = '1px solid red';
    el.parentNode.scrollIntoView();
    if (typeof toastr !== 'undefined') toastr["error"](message)
    else alert(message);
    if (el.tagName == 'INPUT' || el.tagName == 'TEXTAREA') el.select();
}

function hasClass(el, className) {
    if (el.classList) el.classList.contains(className);
    else new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}

function forEachElement(selector, fn) {
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++)
        fn(elements[i], i);
}
