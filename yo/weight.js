function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// appends $ to value, validates decimal side
// and puts cursor back in right position.
function formatWeight(input, blur) {
    var input_val = input.value;
    if (input_val === "") return;
    var original_len = input_val.length;
    var caret_pos = input.selectionStart;
    // check for decimal
    if (input_val.indexOf(".") >= 0) {
        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");
        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);
        left_side = formatNumber(left_side);
        right_side = formatNumber(right_side);
        // On blur make sure 2 numbers after decimal
        if (blur === "blur")
            right_side += "00";
        right_side = right_side.substring(0, 2);
        input_val = /*currency +*/ left_side + "." + right_side;
    } else {
        input_val = formatNumber(input_val);
        input_val = /*currency +*/ input_val;
        if (blur === "blur")
            input_val += ".00";
    }
    input.value = input_val;
    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input.setSelectionRange(caret_pos, caret_pos);
}
