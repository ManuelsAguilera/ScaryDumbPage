const log = 0;

// index.js
function writeElem(elementId) {
    // Get the content of the specified element from elementos.html
    var element = document.getElementById(elementId);
    var div = document.getElementById("writeElems");
    

    // Log the current element to the hidden log div
    log.innerText =  elementId;

    div.innerHTML = element.innerHTML;
    copyElement = div.getElementById(elementId)
    //copyElement.
    // Append the new element to the writeElems div
    
}
//pong

