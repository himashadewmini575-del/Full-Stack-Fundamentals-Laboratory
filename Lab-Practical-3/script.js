
let now = new Date();

let hours = now.getHours();
let minutes = now.getMinutes();
let seconds = now.getSeconds();

if (hours < 12) {
    document.getElementById("greeting").innerHTML =
        "Good Morning!";
} 
else if (hours < 18) {
    document.getElementById("greeting").innerHTML =
        "Good Afternoon!";
} 
else {
    document.getElementById("greeting").innerHTML =
        "Good Evening!";
}
