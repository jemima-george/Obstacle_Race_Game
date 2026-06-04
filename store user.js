// Store usrObject into local storage
function storeUser(){
    var usrObject = {}
    usrObject.name = document.getElementById("rname").value
    usrObject.email = document.getElementById("remail").value
    usrObject.password = document.getElementById("rpass").value
    usrObject.phone = document.getElementById("rnum").value
    usrObject.score = 0

    localStorage[usrObject.email] = JSON.stringify(usrObject);

    document.getElementById("feedback").innerHTML = "<b>Registration successful <b>"
    alert("Registration successful")
}   