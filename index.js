

// index.js
function writeElem(elementId) {
    // Get the content of the specified element from elementos.html
    var element = document.getElementById(elementId);
    var div = document.getElementById("writeElems");
    var log = document.getElementById("log");

    // Log the current element to the hidden log div
    log.innerText =  elementId;

    console.log(log.innerHTML)
    // Remove the current content of writeElems div

    while (div.firstChild != null)
    {
        div.removeChild(div.firstChild)
    }

    // Append the new element to the writeElems div
    div.append(element);
}
//pong

