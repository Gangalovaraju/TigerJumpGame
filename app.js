const playerElement = document.querySelector('.player');
const obstacleElement = document.querySelector('.obstacle');
const scoreElement = document.querySelector('.score-card .score');
const highScoreElement = document.querySelector('.score-card .high-score');
const restartGameElement = document.querySelector('.restart-game');
const gameContainerElement = document.querySelector('.game-container');

const OBSTACLE_SIZES = ['xs', 's', 'm', 'l'];

// audio
var bgm = document.getElementById("bgm");
bgm.volume = 0.3;
bgm.play();

function gameEnded() {
    // Stop the music
    bgm.pause();
    bgm.currentTime = 0;
}

/**
 * JUMP
 */
function addJumpListener() {
    document.addEventListener('keydown', event => {
        if (event.key === ' ' || event.key === 'ArrowUp') {
            jump();
        }
    })
}

let jumping = false;

function jump() {
    if (jumping) {
        return;
    }

    jumping = true;
    playerElement.classList.add('jump');
    setTimeout(() => {
        playerElement.classList.remove('jump');
        jumping = false;
    }, 1200)
}


/**
 * COLLISION
 */
let collisionInterval;

function monitorCollision() {
    collisionInterval = setInterval(() => {
        if (isCollision()) {
            checkForHighScore();
            stopGame();
        }
    }, 10);
}

// Left buffer for tail
const LEFT_BUFFER = 50;

function isCollision() {
    const playerClientRect = playerElement.getBoundingClientRect();
    const playerL = playerClientRect.left;
    const playerR = playerClientRect.right;
    const playerB = playerClientRect.bottom;


    const obstacleClientRect = obstacleElement.getBoundingClientRect();
    const obstacleL = obstacleClientRect.left;
    const obstacleR = obstacleClientRect.right;
    const obstacleT = obstacleClientRect.top;

    const xCollision = (obstacleR - LEFT_BUFFER) > playerL && obstacleL < playerR;
    const yCollision = playerB > obstacleT;

    return xCollision && yCollision;
}

/**
 * SCORE
 */
let score = 0;

function setScore(newScore) {
    scoreElement.innerHTML = score = newScore;
}

let scoreInterval;

function countScore() {
    scoreInterval = setInterval(() => {
        setScore(score + 1);
    }, 100);
}

let highscore = localStorage.getItem('highscore') || 0;

function setHighScore(newScore) {
    highScoreElement.innerText = highscore = newScore;
    localStorage.setItem('highscore', newScore);
}

function checkForHighScore() {
    if (score > highscore) {
        setHighScore(score);
    }
}

/**
 * RANDOMISE OBSTACLE
 */
function getRandomObstacleSize() {
    const index = Math.floor(Math.random() * (OBSTACLE_SIZES.length - 1));
    return OBSTACLE_SIZES[index];
}

let changeObstacleInterval;

function randomiseObstacle() {
    changeObstacleInterval = setInterval(() => {
        const obstacleSize = getRandomObstacleSize();
        obstacleElement.className = `obstacle obstacle-${obstacleSize}`;
    }, 3000);
}

/**
 * STOP GAME
 */
function stopGame() {
    clearInterval(collisionInterval);
    clearInterval(scoreInterval);
    clearInterval(changeObstacleInterval);
    restartGameElement.classList.add('show');
    gameContainerElement.classList.add('stop')
    gameEnded();
}

function restart() {
    location.reload();
}

function main() {
    addJumpListener();
    monitorCollision();
    countScore();
    setHighScore(highscore);
    randomiseObstacle();
};

main();

function showToast() {
    var toaster = document.getElementById('toaster');
    toaster.style.display = 'block'; 
    setTimeout(function() {
        toaster.style.display = 'none';
    }, 3000);
}
window.onload = showToast;
