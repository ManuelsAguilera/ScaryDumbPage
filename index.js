

// index.js

function writeElem(elementId) {
    // Get the content of the specified element from elementos.html
    var elementos = document.getElementById(elementId);
    var div = document.getElementById("writeElems");
    div.removeChild(div.firstElementChild)
    div.appendChild(elementos)

    
}
