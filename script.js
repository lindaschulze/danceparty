document.addEventListener("DOMContentLoaded", async () => {
    const soundBar = document.getElementById("sound-bar");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function updateSoundBar() {
            analyser.getByteFrequencyData(dataArray);

            // Calculate the average volume
            const averageVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

            // Map the average volume to a percentage (0-100%)
            const percentage = Math.min((averageVolume / 256) * 100, 100);

            // Update the sound bar width
            soundBar.style.width = `${percentage}%`;

            requestAnimationFrame(updateSoundBar);
        }

        updateSoundBar();
    } catch (error) {
        console.error("Microphone access denied or unavailable.", error);
        alert("Please allow microphone access to visualize sound levels.");
    }
});
