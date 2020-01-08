// Global section
jQuery(document).ready(function() {
    mws_init_global_iframes();
});

function mws_init_global_iframes() {
    // resize all
    mws_resize_global_iframes();
}
window.onresize = function() {
    mws_resize_global_iframes();
}

function mws_resize_global_iframes() {
    $('section[global_section]').each(function() {
        mws_resize_iframe($('iframe', this)[0]);
    });
}

function mws_edit_global_section(el) {
    var iframeSrc = $(el).parent().parent().parent().parent().find("iframe").attr("src");
    var params = mws_get_params(iframeSrc);
    mws_new_window("page_edit_section_global?id=" + params.id);
}
var mws_get_params = function(url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

function mws_refresh_global_iframe(refreshEl) {
    $(refreshEl).parent().parent().parent().find('iframe')[0].contentWindow.location.reload();
}

function mws_disconnect_global_section(el) {
    var $html = $(el).parent().parent().parent().find('iframe').contents().find("#content").html();

    var placeholderDiv = document.createElement('div');
    $(placeholderDiv).html($html);
    // remove global_id attribute
    $(placeholderDiv).find('section[global_section]').removeAttr("global_section id").removeClass("mws-initiated mws-active mws-settings-active");

    if (confirm("You are making this section global. Proceed?")) {
        html = $(placeholderDiv).html()
        $(placeholderDiv).remove();
        $(el).parent().parent().parent().parent().replaceWith(html);
        // TODO: re-init editor id:62
        reload_sections();
    }
}

function make_global_section_id() {
    return "global_section_" + makeid();
}

// Make section global
function make_section_global() {
    if (confirm("{{lang_make_global_confirm}}")) {
        var id = make_global_section_id();
        var sectionId = $('.mws-active').attr('section');
        $('.mws-active').attr("id", id);
        // Destroy froala
        $('.mws-active .fr-box').froalaEditor('destroy');
        setTimeout(function() {
            var el = $('.mws-active')
            el.removeClass("mws-initiated mws-active mws-active");
            // el.removeAttr("id");
            var html = el[0].outerHTML;
            if (ws !== null) {
                ws.send(enc(tuple(atom("client"), tuple(atom("create_global_section"), bin(id), bin(html), bin(sectionId)))));
            }
        }, 200);
    }
}

// callback called after section was made global
function mws_make_global_success(Id) {
    mws_init_global_iframes();
}
