
// Script to check password

let feedbackPara = document.getElementById("feedback");

var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
// Regular expressions are particularly useful for defining filters.
// new keyword is used to create an instance of an object that has a constructor function

let isValid = true;

function checkPassword(){
    let password = document.getElementById("rpass").value;
    let username =  document.getElementById("rname").value;
    let email =  document.getElementById("remail").value;
    let phone = document.getElementById("rnum").value;
    
    // trim method in JavaScript is a built-in string method that removes whitespace characters from the beginning and end of a string. The whitespace characters include spaces, tabs, and newline characters.

    // Check if phone number is provided
    if (phone.trim() === "") {
        feedbackPara.innerHTML = "<b>Phone number is required.</b>";
        alert("Please enter a phone number.");
        isValid = false;
    }

    // Validate password based on Regex format
    if(!passwordRegex.test(password)){
        feedbackPara.innerHTML = "'" + password + "' is not secure";
        alert("Password is not secure. Use lower case letters, capital letters, numbers");
        isValid = false;
    }

    // Check if a user with the same name already exists
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let existingUser = JSON.parse(localStorage.getItem(key));
        
        // If a user with the same name is found, show an error message and exit
        if (existingUser && existingUser.name === username) {
            feedbackPara.innerHTML = "<b>Username already exists. Please choose a different name.</b>";
            alert("Username already exists. Please choose a different name. Registration was unsuccessful");
            isValid = false;
            break;
        }

        // If email exisits in the local storage, show an error message and exit
        if (existingUser && existingUser.email === email) {
            feedbackPara.innerHTML = "<b>Account with this email already exists. Login instead.</b>";
            alert("Account with this email already exists. Login instead.");
            isValid = false;
            break;
        }
    }

    // Only proceed if isValid is still true
    // === used for comparison
    if(isValid === true){
        feedbackPara.innerHTML = "Password is secure";
        alert("Your form is subbmitted.");
        storeUser();
        return true;
    }
    return false;
}


