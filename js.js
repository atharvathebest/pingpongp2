// Start of the complete JavaScript game logic
let pagehiight = 1200;
let pagewidth = 640;
let p1scorer =1000000 ;
let p2scorer = 1 ;
// Player 1 (Top Paddle - Green)
let character = {
    x: pagewidth / 2 - 50, // Center the paddle horizontally
    y: 125,
    width: 100,
    height: 5,
    speed: 15
};

// Player 2 (Bottom Paddle - Red)
let character2 = {
    x: pagewidth / 2 - 50, // Center the paddle horizontally
    y: pagehiight - 100,
    width: 100,
    height: 5,
    speed: 15
};

// Ping Pong Ball
let pingpong = {
    radii: 10,
    speed: 10,
    x: pagewidth / 2, // Start in the center
    y: pagehiight / 2, // Start in the center
    dx: 5, // velocity x
    dy: 5, // velocity y
};

let context;
let gamepageCanvas;
let scoreElement;
let p1Score = 0;
let p2Score = 0;
let keys = {};

window.onload = function() {
    gamepageCanvas = document.getElementById("gamepage");
    // Getting the score display element by its ID "scores"
    scoreElement = document.getElementById("scores"); 
    
    gamepageCanvas.height = pagehiight;
    gamepageCanvas.width = pagewidth;

    context = gamepageCanvas.getContext("2d");

    // Initialize ball position and start game loop
    resetBall();
    gameLoop();
};

function gameLoop() {
    // 1. Clear the canvas
    context.clearRect(0, 0, pagewidth, pagehiight);

    // 2. Handle Continuous Movement based on pressed keys
    handleMovement();

    // 3. Update the ball's position and handle physics
    updatePingPong();

    // 4. Draw all elements
    drawElements();

    // 5. Update the score display
    updateScore();

    requestAnimationFrame(gameLoop);
}

function updatePingPong() {
    // Move the ball
    pingpong.x += pingpong.dx;
    pingpong.y += pingpong.dy;

    // Ball collision with left/right walls
    if (pingpong.x + pingpong.radii > pagewidth || pingpong.x - pingpong.radii < 0) {
        pingpong.dx *= -1; 
    }

    // --- FIXED: Ball collision with paddles (Player 1 - Top) ---
    // Check if ball is moving UP and its bottom is past the paddle's top edge
    if (pingpong.dy < 0 &&
        pingpong.y - pingpong.radii <= character.y + character.height && // Vertical collision range
        pingpong.y - pingpong.radii > character.y && // Prevents multiple bounces per hit
        pingpong.x + pingpong.radii >= character.x && // Horizontal check: ball's right edge past paddle's left edge
        pingpong.x - pingpong.radii <= character.x + character.width // Horizontal check: ball's left edge past paddle's right edge
    ) {
        pingpong.dy *= -1; 
    }

    // --- FIXED: Ball collision with paddles (Player 2 - Bottom) ---
    // Check if ball is moving DOWN and its top is past the paddle's bottom edge
    if (pingpong.dy > 0 &&
        pingpong.y + pingpong.radii >= character2.y && // Vertical collision range
        pingpong.y + pingpong.radii < character2.y + character2.height && // Prevents multiple bounces per hit
        pingpong.x + pingpong.radii >= character2.x && // Horizontal check: ball's right edge past paddle's left edge
        pingpong.x - pingpong.radii <= character2.x + character2.width // Horizontal check: ball's left edge past paddle's right edge
    ) {
        pingpong.dy *= -1; 
    }

    // Ball out of bounds (Scoring)

    // Player 2 scores (Ball hits top)
    if (pingpong.y - pingpong.radii < 0) {
        p2Score+=p2scorer;
        resetBall();
    }

    // Player 1 scores (Ball hits bottom)
    if (pingpong.y + pingpong.radii > pagehiight) {
        p1Score+=p1scorer;
        resetBall();
    }
}

function resetBall() {
    pingpong.x = pagewidth / 2;
    pingpong.y = pagehiight / 2;
    // Set a new random vertical and horizontal direction
    let initialSpeed = 5;
    pingpong.dy = (Math.random() < 0.5 ? -1 : 1) * initialSpeed; 
    pingpong.dx = (Math.random() < 0.5 ? -1 : 1) * initialSpeed; 
}

function handleMovement() {
    // Player 1 movement (Arrow Keys)
    if (keys["ArrowLeft"]) {
        character.x -= character.speed;
    }
    if (keys["ArrowRight"]) {
        character.x += character.speed;
    }

    // Player 2 movement (A and D)
    if (keys["a"] || keys["A"]) {
        character2.x -= character2.speed;
    }
    if (keys["d"] || keys["D"]) {
        character2.x += character2.speed;
    }

    // Clamp Player 1 position
    if (character.x < 0) character.x = 0;
    if (character.x + character.width > pagewidth) character.x = pagewidth - character.width;

    // Clamp Player 2 position
    if (character2.x < 0) character2.x = 0;
    if (character2.x + character2.width > pagewidth) character2.x = pagewidth - character2.width;
}

function drawElements() {
    // Draw Player 1 (Green Paddle)
    context.fillStyle = "green";
    context.fillRect(character.x, character.y, character.width, character.height);

    // Draw Player 2 (Red Paddle)
    context.fillStyle = "red";
    context.fillRect(character2.x, character2.y, character2.width, character2.height);

    // Draw Ping Pong Ball
    context.beginPath();
    context.arc(pingpong.x, pingpong.y, pingpong.radii, 0, 2 * Math.PI); 
    context.fillStyle = "white";
    context.fill();
    context.stroke();
}

function updateScore() {
    // Updates the HTML element with ID "scores"
    if (scoreElement) {
        scoreElement.innerHTML = `Player 1 (Green, Arrow Keys): ${p1Score} | Player 2 (Red, A/D Keys): ${p2Score}`;
    }
}

// --- Event Listeners for Input ---

// Track keydown for continuous movement
window.addEventListener("keydown", function(event) {
    keys[event.key] = true;

    // Prevent default scroll behavior for relevant keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "a", "d", "A", "D"].includes(event.key)) {
        event.preventDefault();
    }
    
    // Reset game positions and score on 'R' press
    if (event.key === "r" || event.key === "R"){
        character.x = pagewidth / 2 - character.width / 2;
        character2.x = pagewidth / 2 - character2.width / 2;
        p1Score = 0;
        p2Score = 0;
        resetBall();
    }
});

// Track keyup to stop movement
window.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});
