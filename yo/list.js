function init_list(id) {
    var list = qi(id);
    if (mws_hasClass(list, 'yo-list')) return false;
    var fields = document.querySelectorAll("#" + id + " > .fields-group");
    l_forEach(fields, function(el_fields_group, index) {
        i = index +1;
        if (!is_visible(el_fields_group))
	    el_fields_group.style.display = 'none';
	l_update_visibility_class(el_fields_group);
            
        // add remove button
        var remove_button = document.createElement('button');
        remove_button.id = id + "_remove_" + i;
        remove_button.className = "list-remove-item remove-button";
        if (i == 1) remove_button.className = "list-remove-item-placeholder";
        el_fields_group.appendChild(remove_button);
        if (i != 1)
            // remove element and reset inputs
            l_addEventListener(document.getElementById(remove_button.id), "click", function() {
                this.parentNode.style.display = 'none';
		l_update_visibility_class(this.parentNode);
                l_forEach(this.parentNode.querySelectorAll("input:not([type=checkbox]), textarea"), function(input) {input.value = ''});
                // show the add button again if neccessary
                if (document.querySelectorAll("#" + id + " > .fields-group[style*='display: none']")[0])
                    document.getElementById(id + "_add_button").style = '';
                // reset preview image
                var image = this.parentNode.querySelector(".hidden-image-input");
                if (image) remove_image(image);
                l_update_borders(id);
            });
    });
    // always show the first element
    if (fields.length > 0) fields[0].style = '';
    // append add button
    var button = document.createElement("button");
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
    button.id = id + "_add_button";
    button.className = "button rounded is-primary";
    document.getElementById(id).appendChild(button);
    button = document.getElementById(button.id);
    // add item
    l_addEventListener(button, "click", function() {
        var next_visible_el = document.querySelectorAll("#" + id + " > .fields-group[style*='display: none']");
        if (next_visible_el[0])
            next_visible_el[0].style = "";
        if (!next_visible_el[1])
            button.style.display = 'none'; // hide button if there are no other fields left
        else
            button.style = '';
        l_update_borders(id);
	l_update_visibility_class(next_visible_el[0]);
    });
    l_update_borders(id);
    mws_addClass(list, 'yo-list');
};

function is_visible(el_fields_group) {
    var input_fields = el_fields_group.querySelectorAll("input:not([type=checkbox]), textarea");
    var visible = false;
    l_forEach(input_fields, function(input_field) {
        if (input_field.value != "")
            visible = true;
    });
    return visible;
};

function l_update_borders(id) {
    var fields = document.querySelectorAll('#' + id + ' > .fields-group:not([style*="display: none"])');
    var last = fields[fields.length - 1];
    l_forEach(fields, function(el, i) {
        if (i == (fields.length - 1))
            el.style.border = 0;
        else
            el.style.border = '';
    });
}

function l_update_visibility_class(el) {
    var className = 'is-visible';
    // add class if visible
    if (el.style.display != 'none') {
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
    } else {
	// remove class if invisible
	if (el.classList)
	    el.classList.remove(className);
	else
	    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}


function l_forEach(elements, fn) {
    for (var i = 0; i < elements.length; i++)
        fn(elements[i], i);
}

function l_addEventListener(el, eventName, handler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function(){
            handler.call(el);
        });
    }
}
