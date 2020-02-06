// Request input fun
function yo_request_input(el, form, callback) {
    var object = {};
    try {object = JSON.parse(decodeURIComponent(escape(atob(el.getAttribute("data-stored-input"))))); }
    catch(e) { object = JSON.parse(el.getAttribute("data-stored-input")); }
    if (object) form.values = object;
    window.form_document = form;
    window.form_callback = callback;
    window.form_el = el;
    ws.send(enc(tuple(atom('client'), tuple(atom('yo'), bin(JSON.stringify(form)))))); }

function yo_execute_callback(data) {
    window.form_el.setAttribute("data-stored-input", btoa(unescape((JSON.stringify(data)))));
    window.form_callback(data); }
