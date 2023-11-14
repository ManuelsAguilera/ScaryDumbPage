//code originaly from: https://codepen.io/bartomiej-krupa/pen/rRpBEb


//Global letiables
"use strict"

const DIRECTION = {
    UP: 1,
    DOWN: 2,
    RIGHT: 3,
    LEFT: 4,
    IDLE: 0
}

const Sounds = {
    bounce: new Audio('https://www.soundjay.com/button/button-29.wav'),
    start: new Audio('https://www.soundjay.com/button/button-27.wav'),
    wallCollision: new Audio('https://www.soundjay.com/button/button-50.wav'),
    endRound: new Audio('https://www.soundjay.com/button/beep-10.wav')
}

let Ball = {
    new: function (speedMeUp) {
        return {
            size: 10,
            x: (this.canvas.width / 2 - 5),
            y: (this.canvas.height / 2 - 5),
            xMove: DIRECTION.IDLE,
            yMove: DIRECTION.IDLE,
            speed: speedMeUp || 4
        }
    }
};

let Paddle = {
    new: function (side) {
        return {
            height: 100,
            width: 20,
            x: side === 'left' ? 70 : 910,
            y: 200,
            score: 0,
            move: 0,
            speed: 10
        }
    }
}

let Main = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 1000;
        this.canvas.height = 500;

        this.canvas.style.width = 150 + 'vh';
		this.canvas.style.height =  75 + 'vh';

        this.player = Paddle.new.call(this, 'left');
        this.computer = Paddle.new.call(this, 'right');
        this.ball = Ball.new.call(this);

        this.tableLineHeight = 20;
        this.tableLineWidth = 6;
        

        this.color =  "#7aff33" ;

        this.running = this.over = false;
        this.round = 0;

        PongGame.lobby();
        PongGame.listeners();
    },

    //STATIC
    lobby: function () {
        //Draw elements static
        PongGame.draw();

        //Text properity
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.ctx.font = '30px Courier';

        //White Rect for TEXT
        this.ctx.fillStyle = "rgba(0,0,0,0)";
        this.ctx.fillRect(
			this.canvas.width / 2 - 250,
			this.canvas.height - this.canvas.height,
			500,
			500
        );
        
        //Show welcome text
        this.ctx.fillStyle = "white";
       	this.ctx.fillText('Press SPACEBAR to start',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },

    //MAIN METHOD - UPDATE VARIABLES AND GIVE IT TO LOOP METHOD.
    update: function () { 
        if (!this.over) {
            if(this.ball.yMove === DIRECTION.IDLE) {
                PongGame._newRound.call(this, this.player);
            }

            //
            if (this.ball.x - this.ball.size <= 0) PongGame._newRound.call(this, this.computer, this.player);

            //Moving up/down, player updated by listeners
            if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
            else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;
            
            //Player and computer collision with wall
            if (this.player.y <= 0) this.player.y = 0;
            else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);
            if (this.computer.y >= this.canvas.height - this.computer.height) this.computer.y = this.canvas.height - this.computer.height;
			else if (this.computer.y <= 0) this.computer.y = 0;

            //Move in Y - BALL
            if(this.ball.y <= 0) {this.ball.yMove = DIRECTION.DOWN; Sounds.wallCollision.play();}
            else if (this.ball.y >= this.canvas.height - this.ball.size) { this.ball.yMove = DIRECTION.UP; Sounds.wallCollision.play();}
            if(this.ball.yMove === DIRECTION.DOWN) this.ball.y += this.ball.speed/2;
            else if(this.ball.yMove === DIRECTION.UP) this.ball.y -= this.ball.speed/2;

            //Move in X - BALL
            if(this.ball.x <= 0) {
                PongGame._newRound.call(this, this.computer); 
            } 
            else if (this.ball.x >= this.canvas.width + this.ball.size){
                PongGame._newRound.call(this, this.player); 
            }
            if(this.ball.xMove === DIRECTION.RIGHT) this.ball.x += this.ball.speed;
            else if(this.ball.xMove === DIRECTION.LEFT) this.ball.x -= this.ball.speed;

            //BALL - PLAYER COLLISION
            //1. Check ball x position with player x position and ball y position with player y position
            if (this.ball.x <= this.player.x + this.player.width && this.player.y <= this.ball.y + this.ball.size) {
                //2. If true check that ball not have x position less than player.
                if (this.ball.x - this.ball.size >= this.player.x) {
                    //3. If true check that ball is in player paddel range.
                    if(this.player.y + this.player.height >= this.ball.y - this.ball.size){
                        //4. If true chech that is upper paddel.
                        if(this.ball.y <= this.player.y + this.player.height / 2){
                            this.ball.xMove = DIRECTION.RIGHT;
                            this.ball.yMove = DIRECTION.UP;
                            this.ball.speed += Math.random() * (1 - 0.2) + 0.2;
                            Sounds.bounce.play();
                        //5. If false check for lower paddel.
                        }else if(this.ball.y >= this.player.y + this.player.height / 2){
                            this.ball.xMove = DIRECTION.RIGHT;
                            this.ball.yMove = DIRECTION.DOWN;
                            this.ball.speed += Math.random() * (1 - 0.2) + 0.2;
                            Sounds.bounce.play();
                        }
                    }
                }
            }

            //BALL - COMPUTER COLLISION
            //1. Check ball x position with player x position and ball y position with player y position
            if (this.ball.x >= this.computer.x - this.computer.width && this.computer.y <= this.ball.y + this.ball.size) {
                //2. If true check that ball not have x position less than computer.
                if (this.ball.x + this.ball.size <= this.computer.x) {
                    //3. If true check that ball is in computer paddel range.
                    if(this.computer.y + this.computer.height >= this.ball.y - this.ball.size){
                        //4. If true chech that is upper paddel.
                        if(this.ball.y <= this.computer.y + this.computer.height / 2){
                            this.ball.xMove = DIRECTION.LEFT;
                            this.ball.yMove = DIRECTION.UP;
                            this.ball.speed += .2;
                            Sounds.bounce.play();
                        //5. If false check for lower paddel.
                        }else if(this.ball.y >= this.computer.y + this.computer.height / 2){
                            this.ball.xMove = DIRECTION.LEFT;
                            this.ball.yMove = DIRECTION.DOWN;
                            this.ball.speed += .2;
                            Sounds.bounce.play();
                        }
                    }
                }
            }

            //COMPUTER
			if (this.computer.y > this.ball.y - (this.computer.height / 2)) {
				if (this.ball.x > this.canvas.width /2) this.computer.y -= 5
				else this.computer.y -= 1;
			}
			if (this.computer.y < this.ball.y - (this.computer.height / 2)) {
				if (this.ball.x > this.canvas.width /2) this.computer.y += 5
				else this.computer.y += 1;
            }
            
            //End game
            if(this.computer.score === 3 || this.player.score === 3) {
                if(this.computer.score === 3) {
                    this.over = true
                    setTimeout(function () { PongGame._endGame('Enemy'); }, 1000);
                }
                else if(this.player.score === 3) {
                    this.over = true
                    setTimeout(function () { PongGame._endGame('Player'); }, 1000);
                }
            }

        }
    },

    draw: function () {
        //Clear whole Canvas.
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        
        //Draw empty Canvas.
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
        );
        
        //Draw left paddle. (player)
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );

        //Draw right paddle. (computer)
        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(
            this.computer.x,
            this.computer.y,
            this.computer.width,
            this.computer.height
        );

        //Draw table line.
        for (let linePosition = 20; linePosition < this.canvas.height; linePosition += 30) {
            this.ctx.fillStyle = 'rgb(200,200,200) ';
            this.ctx.fillRect(
                this.canvas.width / 2 - this.tableLineWidth / 2,
                linePosition,
                this.tableLineWidth,
                this.tableLineHeight);
        };

		// Draw the players score (left)
		this.ctx.fillText(
			this.player.score.toString(),
			(this.canvas.width / 2) - 100,
			50
		);

		// Draw the computer score (right)
		this.ctx.fillText(
			this.computer.score.toString(),
			(this.canvas.width / 2) + 100,
			50
		);

        //Draw the ball.
        this.ctx.fillStyle = "#9900cc";
        this.ctx.fillRect(
            this.ball.x,
            this.ball.y,
            this.ball.size,
            this.ball.size
        );
    },

    loop: function () {
        //Loop function, update all elements, then draw new.
        PongGame.update();
        PongGame.draw();

        // If game is not over (over variable === false), draw frames. requestAnimationFrame is method from Window Object.
        if (!PongGame.over) requestAnimationFrame(PongGame.loop);
    },

    listeners: function () {
        //If push spacebar run the game (keycode 32 === spacebar) and call Window requestAnimationFrame method with my LOOP METHOD.
        document.addEventListener('keydown', function (key) {
            if (PongGame.running === false && key.keyCode === 32) {
                PongGame.running = true;
                window.requestAnimationFrame(PongGame.loop);
                Sounds.start.play();
            }

			// Handle up arrow and w key events
			if (key.keyCode === 38 || key.keyCode === 87) PongGame.player.move = DIRECTION.UP;

			// Handle down arrow and s key events
			if (key.keyCode === 40 || key.keyCode === 83) PongGame.player.move = DIRECTION.DOWN;
        });

        // Stop the player from moving when there are no keys being pressed.
		document.addEventListener('keyup', function (key) { PongGame.player.move = DIRECTION.IDLE; });
    },

    _newRound: function (winner) {
        this.ball = Ball.new.call(this);
        this.ball.xMove = DIRECTION.RIGHT;
        this.ball.yMove = DIRECTION.UP;
        console.log("Finish")
        this._writeElem("secret"); 
        //If it is start - clear scores.
        if(this.round === 0) {
            winner.score = 0;
            this.round += 1;
        }
        else {
            winner.score += 1;
            this.round += 1;
            Sounds.endRound.play();
        }
        
    },

    _writeElem: function (elementId) {
      // Get the content of the specified element from elementos.html
      var element = document.getElementById(elementId);
      var div = document.getElementById("writeElems");
  
      // Log the current element to the hidden log div
      let log = element.innerText
      console.log(log)
  
      // Remove the current content of writeElems div
  
      while (div.firstChild != null)
      {
          div.removeChild(div.firstChild)
      }
  
      // Append the new element to the writeElems div
      div.append(element);
  },
    _endGame: function (text) {
        //White Rect for TEXT
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(
			this.canvas.width / 2 - 250,
			this.canvas.height - this.canvas.height,
			500,
			500
        );
        
        
        //SHOW END GAME TEXT
        this.ctx.fillStyle = "black";
       	this.ctx.fillText(text + " wins!",
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );

        
        
        setTimeout(function () {
			PongGame = Object.assign({}, Main);
			PongGame.initialize();
      
		}, 3000);
    },
}

//-----------------------------------------------------------------------------------------------//
//----------------------------------------START GAME---------------------------------------------//
//-----------------------------------------------------------------------------------------------//
//Assign copy of object "Main" to PongGame and call initialize method.
let PongGame = Object.assign({}, Main);
PongGame.initialize();