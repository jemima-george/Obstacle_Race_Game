// Wait for the DOM to load before running game setup
document.addEventListener("DOMContentLoaded", function() {
    // Display leaderboard after DOM content is fully loaded
    displayLeaderboard();

    // Get HTML game page elements only after DOM is loaded
    const scoreValue = document.getElementById("scoreValue");
    const gameoverInstructions = document.getElementById("gameoverInstructions");
    const world = document.getElementById("world");

    // Check if the user is logged in
    const loggedInName = sessionStorage.loggedinUsrName;
    const loggedInElement = document.getElementById("logged-in");
    if (loggedInName && loggedInElement) {
        loggedInElement.innerHTML = "Player " + loggedInName;
    }

    // Only set up the game if we are on the game page
    if (scoreValue && gameoverInstructions && world) {
        setupGame();

        // Ensure the restart button exists before adding the event listener
        const restartButton = document.getElementById("restartButton");
        if (restartButton) {
            restartButton.addEventListener("click", restartGame);
        } else {
            console.error("Restart button not found on the game page");
        }
    }
});


// Game settings
let score = 0;
let isGameOver = false;
let mouseY = 200; // position of mouse along y axis 
let mouseVelocity = 0;  // initiates vertical velocity to be zero
let gravity = 0.5; // gravity setsts a constant force that pulls the mouse character downward
let isJumping = false;
let cheesePosition = { x: 800, y: 200 };
let catPosition = { x: 800, y: 200 };
let gameInterval; // Store the interval ID 

// Get HTML game page elements
const scoreValue = document.getElementById("scoreValue");
const gameoverInstructions = document.getElementById("gameoverInstructions");
const world = document.getElementById("world");

// Set up the game
function setupGame() {
    // Reset game settings
    score = 0;
    isGameOver = false;
    mouseY = 200;
    mouseVelocity = 0;
    cheesePosition = { x: 800, y: 200 };
    catPosition = { x: 800, y: 200 };

    // Create game elements only if they don’t already exist
    if (!document.getElementById("mouse")) {
        createGameElement("mouse", "100px", "200px", "50px", "50px", "../Images/mouse_mc.png");
    }
    if (!document.getElementById("cheese")) {
        createGameElement("cheese", "800px", "200px", "30px", "30px", "../Images/cheese.png");
    }
    if (!document.getElementById("cat")) {
        createGameElement("cat", "800px", "200px", "60px", "60px", "../Images/cat.jpg");
    }

    // Start the game loop
    gameInterval = setInterval(gameLoop, 20);
}

// Helper function to create a game element
function createGameElement(id, left, bottom, width, height, backgroundImage) {
    let element = document.createElement("div");
    element.id = id;
    element.style.position = "absolute";
    element.style.left = left;
    element.style.bottom = bottom;
    element.style.width = width;
    element.style.height = height;
    element.style.backgroundImage = `url('${backgroundImage}')`;
    element.style.backgroundSize = "cover";
    world.appendChild(element);
}

// Game Loop
function gameLoop() {
    if (isGameOver) return;

    const mouse = document.getElementById("mouse");
    const cheese = document.getElementById("cheese");
    const cat = document.getElementById("cat");

    // Gravity effect
    // if not jumping = true
    if (!isJumping) {
        mouseVelocity -= gravity;
    } else {
        isJumping = false;
    }

    // Update mouse position
    mouseY += mouseVelocity;
    mouseY = Math.max(0, mouseY);
    mouse.style.bottom = mouseY + "px";

    // Move cheese and cat
    moveGameElement(cheese, cheesePosition, 4);
    moveGameElement(cat, catPosition, 5);

    // Check for collisions
    if (detectCollision(mouse, cheese)) {
        score++;
        scoreValue.textContent = score.toString().padStart(3, '0');
        cheesePosition.x = 800; // Reset cheese position
    }

    if (detectCollision(mouse, cat)) {
        endGame();
    }
}

// Helper function to move game elements
function moveGameElement(element, position, speed) {
    position.x -= speed;
    if (position.x < -50) {
        position.x = 800;
        position.y = Math.random() * 400;
    }
    element.style.left = position.x + "px";
}

// Collision detection
function detectCollision(elementA, elementB) {
    // Get the bounding rectangles of the elements
    const rectA = elementA.getBoundingClientRect();
    const rectB = elementB.getBoundingClientRect();

    // Check if the rectangles overlap
    return !(
        rectA.top > rectB.bottom ||
        rectA.bottom < rectB.top ||
        rectA.left > rectB.right ||
        rectA.right < rectB.left
    );
}


// Mouse Jump
function jump() {
    if (!isGameOver && mouseY < 400) {
        mouseVelocity = 8;
        isJumping = true;
    }
}

// Update Leaderboard item in local storage
function updateLeaderboard(username, newScore) {
    // Retrieve existing leaderboard from local storage
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Find the player's existing score
    const playerIndex = leaderboard.findIndex(player => player.username === username);

    if (playerIndex !== -1) {
        // If the player exists, update their score
        if (newScore > leaderboard[playerIndex].score) {
            leaderboard[playerIndex].score = newScore; // Update to new score if it's higher
        }
    } else {
        // If the player doesn't exist, add them to the leaderboard
        leaderboard.push({ username: username, score: newScore });
    }

    // Sort the leaderboard by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    // Save the updated leaderboard back to local storage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Display Leaderboard
function displayLeaderboard() {
    const leaderboardDisplay = document.getElementById("leaderboard-body"); // Element to display the leaderboard

    if (!leaderboardDisplay) {
        // Do not proceed if the leaderboard element is not found
        console.error("Leaderboard element not found");
        return;
    }

    // Proceed with displaying the leaderboard
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Clear current display
    leaderboardDisplay.innerHTML = "";

   // Populate the leaderboard table
   leaderboard.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.username || entry.name}</td>
        <td>${entry.score}</td>
    `;
    leaderboardDisplay.appendChild(row);
});
}

// End Game
function endGame() {
    isGameOver = true;
    if (gameoverInstructions) gameoverInstructions.style.opacity = "1"; // make it visible

    clearInterval(gameInterval); // Stop the game loop

    // Show the restart button
    const restartButton = document.getElementById("restartButton");
    if (restartButton) restartButton.classList.add("visible");

    // Get the username from session storage
    const username = sessionStorage.loggedinUsrName;

    // Update the leaderboard with the new score
    if (username) {
        updateLeaderboard(username, score);
        displayLeaderboard();
    }
}

function restartGame() {
    // Clear existing game loop if any
    clearInterval(gameInterval); // Ensure any existing interval is cleared
    setupGame();
    // Reset the game state
    isGameOver = false;
    score = 0;
    scoreValue.textContent = "000";
    gameoverInstructions.style.opacity = "0";

    const restartButton = document.getElementById("restartButton");
    restartButton.classList.remove("visible");
}

// Event Listeners
document.addEventListener("click", jump);

// On page load, initialize game
window.onload = function() {
    setupGame();
    if (sessionStorage.loggedinUsrName) {
        const loggedIn = document.getElementById("logged-in");
        if (loggedIn) {
            loggedIn.innerHTML = "Player " + sessionStorage.loggedinUsrName;
        }
    }
};