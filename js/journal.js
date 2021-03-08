(function() {
    let qs = '';
    let selectMode = false;
    const nodes = document.querySelectorAll('span');
    let matchingNodes = [];

    nodes.forEach(function(el, index) {
        el.setAttribute('auto-id', index); });

    const nodesArray = Array.prototype.slice.call(nodes).reduce(function(accL, el) {
        const id = el.getAttribute('auto-id');
        accL[id] = el.innerText.replaceAll(/[-$.,+-]/ig, '');
        return accL; }, []);

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (selectMode && matchingNodes[evt.key -1]) {
            document.getElementById(`indicator-${matchingNodes[evt.key -1].getAttribute('auto-id')}`).style.border = '4px solid green';
            document.getElementById(`indicator-${matchingNodes[evt.key -1].getAttribute('auto-id')}`).style.background = 'rgba(127,255,255,0.4)';
            document.getElementById(`indicator-${matchingNodes[evt.key -1].getAttribute('auto-id')}`).style.color = 'transparent';
            for(i=0;i<matchingNodes.length;i++) {
                if (i != (evt.key -1)) {
                    document.getElementById(`indicator-${matchingNodes[i].getAttribute('auto-id')}`).remove();
                }
            }
        } else {
            if (evt.key === "Enter" && evt.keyCode == 13) {
                qs = '';
                search(qs);
                selectMode = true;
                for(i=0;i<matchingNodes.length;i++)
                    document.getElementById(`indicator-${matchingNodes[i].getAttribute('auto-id')}`).style.color = 'black';
            }
            else {qs += evt.key; search(qs);}
        } };
        

    window.search = function (qs) {
        if (qs === '') return;
        let css = '';
        let matchingNodesList = [];
        
        const indicators = document.querySelectorAll('.indicator');
        for(i=0;i<indicators.length;i++) indicators[i].remove();
        
        nodesArray.forEach(function(v, k) {
            const autoId = "[auto-id='" + k.toString() + "']";
            const indicatorId = "indicator-" + k.toString();;
            const el = document.querySelector(autoId);
            if (v.startsWith(qs)) {
                matchingNodesList.push(el);
                var indicator = document.createElement("SPAN");
                indicator.className = 'indicator';
                indicator.innerHTML = matchingNodesList.length;
                indicator.id = indicatorId;
                document.body.appendChild(indicator);
                
                var rect = el.getBoundingClientRect();
                css += `#${indicatorId} {
                    position: absolute; 
                    top: ${rect.top}px; 
                    left: ${rect.left - 5}px;
                    width: ${rect.right - rect.left + 10}px;
                    height: ${rect.bottom - rect.top}px;
                    font-weight: bold; 
                    background: rgba(127,255,255,0); 
                    border: 2px solid red;
                    -webkit-border-radius: 4px;
                    text-indent: -150%;
                    border-radius: 4px;
                    display: inline-flex;
                    justify-content: flex-start;
                    color: transparent;
                    align-items: center;
                    font-family: Arial, Helvetica, sans-serif !important;}`; }
            else el.style.background = ''; });

        const style = document.getElementById('style');
        if (style) style.remove();
        document.head.insertAdjacentHTML("beforeend", '<style id=style>' + css + '</style>');
        matchingNodes = matchingNodesList;
    } })();
