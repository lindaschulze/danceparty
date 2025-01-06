document.addEventListener("DOMContentLoaded", async () => {
    const soundBar = document.getElementById("sound-bar");
    const gif = document.getElementById("dancing-gif");

    // Adjust this threshold to control when the gif should stop
    const soundThreshold = 20; // The percentage of sound to trigger gif play

    try {
        console.log("Requesting microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("
