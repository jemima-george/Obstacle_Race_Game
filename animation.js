let position = 20;

// Function to animate each cheese image
function animateCheese() {
    position += 10;
    if (position > 1100)
        position = 20

    document.getElementById("animateCheese").style.left = position + "px"
    
}

// Set the animation to repeat every 0.1 second
setInterval(animateCheese, 100);