/* Global Elements */
const startScreenNode = document.querySelector('#start-screen');
const gameScreenNode = document.querySelector('#game-screen');
const gameOverScreenNode = document.querySelector('#game-over-screen');
const startButtonNode = document.querySelector('#start-button');
const restartButtonNode = document.querySelector('#restart-button');
const gameBoxNode = document.querySelector('#game-box');
const scoreValueNode = document.querySelector('#score-value');

/* Variables */
let myBall, paddle, obstacles = [];
let isGameRunning = false;
let score = 0;
const paddleData = { x: 350, y: 480, width: 100, height: 15, speed: 30 };

/* Setup Functions */
function createPaddle() {
    paddle = document.createElement('div');
    paddle.className = 'paddle';
    paddle.style.width = `${paddleData.width}px`;
    paddle.style.height = `${paddleData.height}px`;
    paddle.style.left = `${paddleData.x}px`;
    paddle.style.top = `${paddleData.y}px`;
    gameBoxNode.appendChild(paddle);
}

function createObstacles() {
    // 3 rows, 8 columns
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            const xPos = 40 + (j * 90);
            const yPos = 50 + (i * 30);
            obstacles.push(new Obstacle(gameBoxNode, xPos, yPos));
        }
    }
}

/* Core Game Logic */
function startGame() {
    // Reset State
    score = 0;
    scoreValueNode.innerText = score;
    obstacles = [];
    gameBoxNode.innerHTML = ''; 

    // UI Toggle
    startScreenNode.style.display = 'none';
    gameOverScreenNode.style.display = 'none';
    gameScreenNode.style.display = 'flex';

    // Initialize Elements
    createPaddle();
    createObstacles();
    myBall = new Ball(gameBoxNode); 
    
    isGameRunning = true;
    gameLoop();
}

function gameLoop() {
    if (isGameRunning) {
        // Update ball physics
        myBall.update(paddleData.x, paddleData.width, paddleData.height);

        // 1. Brick Collision
        obstacles.forEach((brick, index) => {
            if (
                myBall.x < brick.x + brick.width &&
                myBall.x + myBall.width > brick.x &&
                myBall.y < brick.y + brick.height &&
                myBall.y + myBall.height > brick.y
            ) {
                brick.destroy();
                obstacles.splice(index, 1);
                myBall.speedY *= -1;
                
                score += 10;
                scoreValueNode.innerText = score;
            }
        });

        // 2. Paddle Collision
        if (
            myBall.x + myBall.width > paddleData.x &&
            myBall.x < paddleData.x + paddleData.width &&
            myBall.y + myBall.height > paddleData.y &&
            myBall.y + myBall.height > paddleData.y // Bottom of ball hits top of paddle
        ) {
            // Check if ball is actually moving down towards the paddle
            if (myBall.speedY > 0) {
                myBall.speedY *= -1;
                myBall.y = paddleData.y - myBall.height; // Anti-sticking
            }
        }

        // 3. Win/Loss Checks
        if (obstacles.length === 0) endGame("YOU WIN!");
        if (myBall.y > gameBoxNode.clientHeight) endGame("GAME OVER");

        // 4. Update Visuals
        paddle.style.left = `${paddleData.x}px`;
        
        requestAnimationFrame(gameLoop);
    }
}

function endGame(msg) {
    isGameRunning = false;
    gameOverScreenNode.querySelector('h1').innerText = msg;
    gameOverScreenNode.style.display = 'flex';
    gameScreenNode.style.display = 'none';
    
    // Clean up
    if (myBall.element) myBall.element.remove();
    obstacles.forEach(o => o.element.remove());
}

/* Listeners */
startButtonNode.addEventListener('click', startGame);
restartButtonNode.addEventListener('click', startGame);

window.addEventListener('keydown', (e) => {
    // Move Paddle
    if (e.key === 'ArrowLeft' && paddleData.x > 0) {
        paddleData.x -= paddleData.speed;
    }
    if (e.key === 'ArrowRight' && paddleData.x < gameBoxNode.clientWidth - paddleData.width) {
        paddleData.x += paddleData.speed;
    }
    // Launch Ball
    if (e.key === ' ' || e.key === 'Spacebar') {
        myBall.isLaunched = true;
    }
});

//* Planning Notes:
// - Implemented basic game structure with start, game, and game over screens.
// - Created Paddle and Ball classes with movement and collision logic.
// - Added Obstacle class for bricks with destroy functionality.
// - Sound effects and scoring to be added in future iterations.
// - Obstacle and Ball classes are in separate files 
// - Game loop 
// - controls for paddle movement and ball launch
// - Collision detection between ball and obstacles
// - Win/Lose conditions and screen transitions
// - Reflection to catch ball on paddle
