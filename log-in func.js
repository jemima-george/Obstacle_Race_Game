// Log in function

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("logform");

    if (form) {
        form.addEventListener("submit", login);
    }
});

function login(event){
    event.preventDefault(); //to stop the form from submitting because it refreshes page

    const email = document.getElementById("lemail").value;
    const loginFailureMsg = document.getElementById("loginfailure");

    // Check if the email exists in localStorage
    if (!localStorage[email]) {
        if (loginFailureMsg) {
            loginFailureMsg.innerHTML = "Email is not recognized. Do you have an account? Register now!";
        }
        alert("Email is not recognized. Do you have an account? Register now!");
        return;
    } else {
        // Parse the user object from localStorage
        const usrObj = JSON.parse(localStorage[email]);
        console.log("Parsed User Object:", usrObj);
        
        const password = document.getElementById("lpass").value;
        
        // Check if the password matches
        if(password === usrObj.password){
            alert("Hello " + usrObj.email + ". You are logged in");
            if (loginFailureMsg) loginFailureMsg.innerHTML = "";

            // Store user info in sessionStorage
            sessionStorage.loggedinUsrEmail = usrObj.email;
            sessionStorage.loggedinUsrName = usrObj.name;

            // Update the display for logged-in user if the element exists
            const loggedIn = document.getElementById("logged-in");
            if (loggedIn) {
                loggedIn.innerHTML = "Player " + usrObj.name;
            }

            // Hide the login form if it exists
            const logForm = document.getElementById("logform");
            if (logForm) {
                logForm.style.display = "none";
            }

            // Ensure the user has a score (initialize to 0 if not present)
            usrObj.score = usrObj.score || 0;

            // Add user to the leaderboard
            addOrUpdateLeaderboard(usrObj);
            
            // Redirect to the leaderboard page
            window.location.href = "./leaderboard.html"; 

            if (loggedIn) {
                console.log("After setting logged-in:", loggedIn.innerHTML);
            }
        } else {
            alert("Password is not correct. Try again");
        }
    }
}
