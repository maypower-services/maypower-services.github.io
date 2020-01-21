function save_page() {
    var stage = document.getElementById('edit');

    // Destroy all froala instances
    forEach(window.froalaInstances, function(instance) {
        instance.destroy();
        arrayRemove(window.froalaInstances, instance);
    });

    // Clean up sections
    forEach(stage.children, function(section) {
        // clean up global section
        if (section.getAttribute('section') == "global_section") {
            section.removeAttribute("class");
            section.querySelector("iframe").removeAttribute("height");
        } else
            // destroy resizeable
            if ($(section).data('droppable')) $(section).resizable("destroy");
    });

    // remove animation
    $("[class*='ae-'].done, [class*='ae-'].do").each(function() {
        $(this).removeClass('do done')
    });

    // TODO: remove mws-dependencies id:48
    mws_init_global_iframes();
    mws_resetImages();

    // Further cleanup
    clearClasses(['mws-initiated', 'mws-hover', 'mws-active', 'mws-settings-active', 'maypower-theme', 'fr-draggable', 'fr-box', 'fr-inline']);
    deleteElements(['.mws-settings-panel', '[section=mws-placeholder]', '.ui-resizable-handle', '.fr-table-resizer', '.fr-image-resizer', '.fr-quick-insert', '.fr-floating-btn', '.fr-code', '.CodeMirror', '.fr-command']);
    replaceWithContents(['.fr-wrapper', '.fr-element']);

    // save
    ws.send(enc(tuple(atom('client'), tuple(atom('save_page'), bin(stage.innerHTML)))));

    window.contentChanged = false;
    setTimeout(function() {
        forEach(stage.children, function(section) {
            init_froala(section);
        });
    }, 300);
}
// Disable auto save because we do not want to interrupt
// the user by destroying froala
// setInterval(save_page, 60000);
