const rootElem = document.querySelector(":root");
const gameElem = document.querySelector("#game");
const dinoElem = gameElem.querySelector(".dino");
const scoreElem = gameElem.querySelector(".score");
const groundElem = gameElem.querySelector(".ground");
const cactusElem = groundElem.querySelector(".cactus");

let gameSpeed = 4000;
let jumpSpeed = (gameSpeed / 10) * 2;
let maxJump = 250;
let speedScale = 1;

let score = 0;
let gameStarted = false;
let gameOver = false;
let SelfPlayMode = false;
let Jumping = false;

// Update Root Element in CSS to alter game difficulty like game speed (--game-speed)

function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value);
}

// Listening to the "Space" only. Add "jump" class for jump animation in CSS, remove it when the animation end so that you can re-add the class again.

function handleJump(e) {
    if (e.code !== "Space") return;
    const audio = document.querySelector(".audio-jump");
    audio.play();
    Jumping = true;
    dinoElem.classList.add("jump")
    dinoElem.addEventListener("animationend", () => {
        Jumping = false;
        dinoElem.classList.remove("jump")
    })
}

// Dino self-play logic
// Returns true or false whether the dino should jump

function shouldJump() {
    let minGap = 250;
    let cactusXPos = cactusElem.getBoundingClientRect().x

    if (cactusXPos <= 0 || Jumping) return false;
    if (cactusXPos < minGap) {
        return true;
    }
    return false;
}

// Entering the GameState. Use gameStarted boolean to keep track. Use CSS to execute the game state animation.
// It keeps update the game on every 100ms for the game state to keep running: Giving new obstacle, score tracking etc
// Event listener on keydown function
// However set interval has limitation, there's delay. 
// window.requestAnimationFrame() has better animation.

// Interval example

// // Using gameID to track the Interval ID

// let gameID = " "

// function startGame() {
//     gameStarted = true;
//     gameElem.classList.add("game-started");
//     document.addEventListener("keydown", handleJump);
//     gameID = setInterval(() => {
//         updateGame()
//     }, 100);
// }

// clearInterval(gameID) at endGame()

// window.requestAnimationFrame()

function startGame() {
    gameStarted = true;
    gameElem.classList.add("game-started");
    document.addEventListener("keydown", handleJump);
    window.requestAnimationFrame(updateGame)
}

// Adding game over class in css for the game end screen and let the javascript understand it's game end state

function endGame() {
    const audio = document.querySelector(".audio-die");
    audio.play();
    gameOver = false;
    gameElem.classList.add("game-over");
    document.removeEventListener("keydown", handleJump);
}

// As long as the game is running, this function is called

function updateGame() {
    setCustomProperty(rootElem, "--game-speed", gameSpeed);
    setCustomProperty(rootElem, "--jump-speed", jumpSpeed);
    setCustomProperty(rootElem, "--max-jump", maxJump);
    setCustomProperty(rootElem, "--speed-scale", speedScale);

    if (SelfPlayMode) {
        if (shouldJump()) {
            handleJump({ code: "Space" });
        }
    }

    // Update the score
    updateScore();

    // Update the cactus
    updateCactus();

    // Check if it's game over
    if (checkGameOver()) {
        endGame();
        return;
    }

    // It stops at return and stop calling the function again

    window.requestAnimationFrame(updateGame)
}

// Return true if overlapping

function isCollision(dinoRect, cactusRect) {
    // AABB - Axis-aligned bounding box
    return (
        dinoRect.x < cactusRect.x + cactusRect.width &&
        dinoRect.x + dinoRect.width > cactusRect.x &&
        dinoRect.y < cactusRect.y + cactusRect.height &&
        dinoRect.y + dinoRect.height > cactusRect.y
    );
}

function checkGameOver() {
    if (gameOver) return true;
    let dinoRect = dinoElem.getBoundingClientRect()
    let cactusRect = cactusElem.getBoundingClientRect()
    if (isCollision(dinoRect, cactusRect)) {
        return true;
    }
    return false;
}

function updateCactus() {
    let cactusXPos = cactusElem.getBoundingClientRect().x;
    let isOffScreen = cactusXPos > window.innerWidth;
    if (!isOffScreen) return;

    const cacti = ["cactus-small-1", "cactus-small-2", "cactus-small-3"];
    let randomNum = Math.floor(Math.random() * cacti.length);
    let cactus = cacti[randomNum];

    cactusElem.classList.remove(
        "cactus-small-1",
        "cactus-small-2",
        "cactus-small-3"
    );
    cactusElem.classList.add(cactus);
}

// Using window.requestAnimationFrame(updateGame) the updateScore() is called too fast. 

const scoreInterval = 10;
let currentScoreInterval = 0;

function updateScore() {
    currentScoreInterval += 1;
    if (currentScoreInterval % scoreInterval !== 0) {
        return;
    }

    score += 1;
    if (score === 0) return;

    if (score % 100 === 0) {
        const audio = document.querySelector(".audio-point");
        audio.play();
        gameSpeed -= speedScale;
        jumpSpeed = (gameSpeed / 10) * 2;
    }

    const currentScoreElem = scoreElem.querySelector(".current-score");
    currentScoreElem.innerText = score.toString().padStart(5, "0");
}

// Automatically adjust game Element size base on user's screen. It execute the function upon onLoad listener

function fitScreen() {
    const width = window.innerWidth;
    const height = window.innerHeight / 2;

    gameElem.style.width = width + "px";
    gameElem.style.height = height + "px";
    gameElem.style.zoom = 1.5;
}

window.addEventListener("load", () => {
    fitScreen();
    window.addEventListener("resize", fitScreen);
    
    const selfPlayElem = document.querySelector("#selfplay")
    selfPlayElem.addEventListener("change", ()=>{
        SelfPlayMode = selfPlayElem.checked
    })

    window.addEventListener("keydown", startGame, { once: true });
});