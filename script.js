document.addEventListener("DOMContentLoaded", async () => {
    const gif = document.getElementById("dancingGif");

    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function detectSound() {
            analyser.getByteFrequencyData(dataArray);

            // Calculate the average volume
            const averageVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

            // Threshold to trigger the GIF animation
            if (averageVolume > 20) {
                gif.style.animationPlayState = 'running';
            } else {
                gif.style.animationPlayState = 'paused';
            }

            requestAnimationFrame(detectSound);
        }

        detectSound();
    } catch (error) {
        console.error("Microphone access denied or unavailable.", error);
        alert("Please allow microphone access to activate the GIF.");
    }
});
