// Public facing function
function xyz_request_input(el) {
    var form_document = {form: [{"h1": "Hero"},
                                "test_wysiwyg",
                                {"p": "Example list"}, {"list:10:example_list": ["end_date", "example_image"]}],
                         validation: [{end_date: {min_date: "12.09.2019 12:00"}}],
                         labels: [{image: "Preview image"}]};
    yo_request_input(el, form_document, function(data) {
        console.log("data", data);
        document.getElementById('form_stage').innerHTML = data.test_wysiwyg; }); }
