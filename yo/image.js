/* yo image: opens image library, listens to response and sets value with preview image */
(function() {
    if (window.addEventListener)
        window.addEventListener('message', image_library_message, false);
})();

function yo_open_image_library(el) {
    document.body.style.overflow = 'hidden';
    window.image_library_target = 'yo';
    // show library
    if (!document.getElementById('image-manager-modal'))
        document.getElementsByTagName('body')[0].appendChild(yo_imageManagerModalHTML());
    else
        document.getElementById('image-manager-modal').style.display = 'block';

    // remove active classes
    var className = 'yo-image-select-active';
    forEachElement('.' + className, function(el) {
        if (el.classList) el.classList.remove(className);
        else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    });
    // add active class
    if (el.classList) el.classList.add(className);
    else el.className += ' ' + className;

    window.image_library_select_callback = 'yo_imageSelect';
}

function closeImageManager() {
    window.image_library_target = undefined;
    document.getElementById('image-manager-modal').style.display = 'none';
    document.body.style.overflow = '';
    var className = 'yo-image-select-active';
    var el = document.querySelector('.' + className);
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function yo_imageManagerModalHTML() {
    var iframe = document.createElement('iframe');
    iframe.id = 'image-manager-modal';
    iframe.style = 'position: fixed;z-index: 9147483630;left: 0;top: 0;width: 100%;height: 100%;opacity: 1;visibility: visible;transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;background: linear-gradient(to right, #9fb4e7, #758ecd);background-color: #758ecd;width: 100%;min-height: 100vh;border: none;';
    iframe.src = (window.location.hostname == 'localhost' ? '' : "https://app.maypower.services/") + 'image_manager.htm';
    return iframe;
}

/* Listener to image library iframe messages */
function image_library_message(event) {
    // fühl dich nicht angesprochen!
    if (window.image_library_target != 'yo') return false;
    // Check sender origin to be trusted
    // if (event.origin !== 'https://app.maypower.services') return;
    var data = event.data;
    // set to yo
    if (data.func == 'imageSelect') data.func = 'yo_imageSelect';
    if (typeof(window[data.func]) == 'function') window[data.func].call(null, data.message);
    return Promise.resolve("Dummy response to keep the console quiet");
}

// Functions will be called from iframe
function yo_imageSelect(Image) {
    var el = document.querySelector('.yo-image-select-active');
    el.value = Image.url;
    yo_render_preview_image(el);
    closeImageManager();
}

function forEachElement(selector, fn) {
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++)
        fn(elements[i], i);
}

function yo_render_preview_image(el) {
    if (!el.value) return yo_update_image_buttons(el);
    var id = el.id + '_preview';
    var image = document.getElementById(id);
    if (!image) {
        // console.log("element id,", el.id);
        var img = '<img id="' + id + '" class="preview-image" onclick="yo_open_image_library(document.getElementById(\'' + el.id +'\'))"/>';
        el.insertAdjacentHTML('afterend', img);
        image = document.getElementById(id);
    }
    image.src = crop_image(el.value, 100, 100);
    yo_update_image_buttons(el);
}

// resets image
function yo_remove_image(el) {
    el.value = '';
    var preview = document.getElementById(el.id + '_preview');
    el.parentNode.removeChild(preview);
    yo_update_image_buttons(el);
}

function yo_update_image_buttons(el) {
    if (el.value == '') {
        el.parentNode.querySelector(".remove-button").style.display = 'none';
        el.parentNode.querySelector(".select-button").style = '';
    }
    else {
        el.parentNode.querySelector(".remove-button").style = '';
        el.parentNode.querySelector(".select-button").style.display = 'none';
    }
    var listNode = el.parentNode.parentNode.parentNode.parentNode;
    // console.log("list node", listNode);
    if (hasClass(listNode, "list")) listNode.style.border = '';
}

// crops unsplash and cloudinary images
function crop_image(url, width, height) {
    width = (width ? width : 100);
    height = (height ? height : false);
    switch (false) {
    case !/images.unsplash.com/.test(url):
        url = url.split(/[?#]/)[0] + "?fm=webp&fit=crop";
        url += "&w=" + width + (height ? "&h=" + height : "");
        break;
    case !/res.cloudinary.com/.test(url):
        url = url.replace(/(.*)upload(.*)\/v(.*)/, "$1upload/w_" + width + (height ? ",h_" + height : "") + ",c_thumb/v$3");
        url = url.substr(0, url.lastIndexOf(".")) + ".webp";
        break;
    }
    return url;
}

function hasClass(el, className) {
    if (el.classList) return el.classList.contains(className);
    else return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}
