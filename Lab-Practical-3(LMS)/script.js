// ==========================================================
// LMS - script.js
// Greeting + live date/time, footer year, and "Add Class" form
// ==========================================================

// ---------- Greeting and date/time ----------
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();

    let greeting = "Good evening";
    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 17) {
        greeting = "Good afternoon";
    }

    document.getElementById("greeting").textContent = greeting + "!";
    document.getElementById("now").textContent = now.toLocaleString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

updateGreeting();
setInterval(updateGreeting, 30000); // refresh every 30 seconds

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

