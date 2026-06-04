// Add or update leaderboard function
function addOrUpdateLeaderboard(user) {

    console.log("Adding/Updating User:", user); // Check the user object
    
    // Retrieve the leaderboard data from localStorage
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    console.log("Current Leaderboard Before Update:", leaderboard);

    // Use user.name or sessionStorage.loggedinUsrName as a fallback
    const userName = user.name || sessionStorage.loggedinUsrName;
    if (!userName) {
        console.error("User name is undefined. Cannot add to leaderboard.");
        return;
    }

    // Check if user is already on the leaderboard
    let existingUser = leaderboard.find(entry => entry.username === userName);
    
    if (existingUser) {
        // Update score if necessary (assuming the user has a score property)
        existingUser.score = Math.max(existingUser.score, user.score || 0);
    } else {
        // If the user is not on the leaderboard, add a new entry
        leaderboard.push({ username: userName, score: user.score || 0 }); 
    }

    // Sort the leaderboard based on score in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    // Save the updated leaderboard back to localStorage
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    console.log("Updated Leaderboard:", leaderboard); // Log after update
}

// Function to display the leaderboard on the page
function displayLeaderboard() {
    const leaderboardDisplay = document.getElementById("leaderboard-body"); // Check this ID in your HTML

    if (!leaderboardDisplay) {
        console.error("Leaderboard element not found in HTML");
        return;
    }

    // Retrieve and sort leaderboard from local storage
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.sort((a, b) => b.score - a.score);

    // Clear current display
    leaderboardDisplay.innerHTML = "";

    // Populate leaderboard table
    leaderboard.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.username}</td>
            <td>${entry.score}</td>
        `;
        leaderboardDisplay.appendChild(row);
    });
}

// Function to render the leaderboard
function renderLeaderboard() {
    displayLeaderboard();
}

// Ensure renderLeaderboard only runs after the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    renderLeaderboard();
});

