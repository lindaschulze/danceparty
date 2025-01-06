document.addEventListener("DOMContentLoaded", async () => {
    const soundBar = document.getElementById("sound-bar");
    const gif = document.getElementById("dancing-gif");

    // Adjust this threshold to control when the gif should stop
    const soundThreshold = 20; // The percentage of sound to trigger gif play

    try {
        console.log("Requesting microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted!");

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 512; // Higher sensitivity
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function updateSoundBar() {
            analyser.getByteFrequencyData(dataArray);

            // Calculate the average volume
            const averageVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

            // Log average volume for debugging
            console.log("Average Volume:", averageVolume);

            // Map the average volume to a percentage (0-100%)
            const percentage = Math.min((averageVolume / 128) * 100, 100); // Adjust for sensitivity
            soundBar.style.width = `${percentage}%`;

            // If the average volume exceeds the threshold, play the gif
            if (percentage >= soundThreshold) {
                gif.style.display = "block";  // Show the gif
                gif.play();  // Start playing the gif (if it's an animated gif)
            } else {
                gif.style.display = "none";  // Hide the gif if there's no sound
                gif.pause();  // Stop playing the gif
            }

            requestAnimationFrame(updateSoundBar);
        }

        updateSoundBar();
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access to test sound levels.");
    }
});
