//NECESITO UN CODIGO para hacer un juego de pong

//make left paddle follow mouse

document.addEventListener("DOMContentLoaded", function () {
    const leftPaddle = document.getElementById("left");

    //ball move
    
    //mouse move
    document.addEventListener("mousemove", function (event) {
      const mouseY = event.clientY;
      leftPaddle.style.top = mouseY - leftPaddle.offsetHeight / 2 + "px";
    });
  });
  