const {body} = document;

const width = 500;
const height = 700;
const screenWidth = window.screen.width;
const canvasPosition = screenWidth / 2 - width / 2;
const gameOverEl = document.createElement('div');

const isMobile = window.matchMedia('(max-width: 600px)');

const paddleHeight = 10;
const paddleWidth = 50;
const paddleDiff = 25;
const paddleDistance = 10
let paddleBottomX = 225;
let paddleTopX = 225;
let playerMoved = false;
let paddleContact = false;

let ballX = 250;
let ballY = 350;
const ballRadius = 5;


let speedY;
let speedX;
let trajectoryX;
let computerSpeed;


if(isMobile.matches) {
    speedY = -2;
    speedX = speedY;
    computerSpeed = 4;
} else {
    speedY = -1;
    speedX = speedY;
    computerSpeed = 3
}



let playerScore = 0;
let computerScore = 0;
const winningScore = 7;
let isGameOver = true;
let isNewGame = true;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')

function renderCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'white';
    ctx.fillRect(paddleBottomX, height - paddleDistance - paddleHeight, paddleWidth, paddleHeight);

    ctx.fillRect(paddleTopX, paddleDistance, paddleWidth, paddleHeight);

    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.setLineDash([4]);
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.stroke();
    
    ctx.beginPath()
    ctx.arc(ballX, ballY, ballRadius, 2*Math.PI, 0, false);
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.font = '30px Courier New';
    ctx.fillText(computerScore, 20, height/2 - 25)
    ctx.fillText(playerScore, 20, height/2 + 45)


}

function ballReset() {
    ballX = width / 2;
    ballY = height / 2;
    speedY = -3;
    paddleContact = false;
}


function createCanvas() {
    canvas.width = width;
    canvas.height = height;
    body.appendChild(canvas);
    renderCanvas()
}

function ballBoundaries() {
    // bounce left wall
    if(ballX < 0 && speedX < 0) {
        speedX = -speedX;
    }

    // bounce right wall
    if(ballX > width && speedX > 0) {
        speedX = -speedX
    }

    if(ballY > height - paddleDiff) {
        if(ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
            paddleContact = true;

            if(playerMoved) {
                speedY -= 1;

                if(speedY < -5) {
                    speedY = -5;
                    computerSpeed = 6;
                }
            }
            speedY = -speedY;
            trajectoryX = ballX - (paddleBottomX + paddleDiff);
            speedX = trajectoryX * 0.3;
        } else if(ballY > height) {
            ballReset();
            computerScore++;
        }
    }

    if(ballY < paddleDiff) {
        if(ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
            if(playerMoved) {
                speedY += 1;

                // max speed
                if(speedY > 5) {
                    speedY = 5;
                }
            }
            speedY = -speedY;
        } else if(ballY < 0) {
            ballReset();
            playerScore++;
        }
    }

}


function ballMove() {
    ballY += -speedY;

    // horizontal speed
    if(playerMoved && paddleContact) {
        ballX += speedX;
    }
}


function gameOver() {
    if(playerScore === winningScore || computerScore === winningScore) {
        isGameOver = true;

        const winner = playerScore === winningScore ? 'Player' : 'Computer';
        showGameOverElement(winner)
    }
}

function computerAI() {
    if(playerMoved) {
        if(paddleTopX + paddleDiff < ballX) {
            paddleTopX += computerSpeed;
        } else {
            paddleTopX -= computerSpeed;
        }
    }
}

function animate() {
    renderCanvas();
    ballMove()
    ballBoundaries()
    gameOver();
    computerAI()
    if(!isGameOver) {
        window.requestAnimationFrame(animate);
    }
}


function showGameOverElement(winner) {
    canvas.hidden = true;

    gameOverEl.textContent = '';
    gameOverEl.classList.add('game-over-container');

    const title = document.createElement('h1');
    title.textContent = `${winner} Wins!`;

    const playAgainButton = document.createElement('button');
    playAgainButton.setAttribute('onclick', 'startGame()');
    playAgainButton.textContent = 'Play Again';

    gameOverEl.appendChild(title);
    gameOverEl.appendChild(playAgainButton)
    body.appendChild(gameOverEl)
}


function startGame() {
    if(isGameOver && !isNewGame) {
        body.removeChild(gameOverEl);
        canvas.hidden = false;
    }

    isGameOver = false;
    isNewGame = false;
    playerScore = 0;
    computerScore = 0;

    
    ballReset()
    createCanvas();
    animate()

    canvas.addEventListener('mousemove', (e) => {
        playerMoved = true;
        paddleBottomX = e.clientX - canvasPosition - paddleDiff;
        if(paddleBottomX < paddleDiff ){
            paddleBottomX = 0;
        }
        if(paddleBottomX > width - paddleWidth) {
            paddleBottomX = width - paddleWidth
        }
        canvas.style.cursor = 'none';
    })
}

startGame()