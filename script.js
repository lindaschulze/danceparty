let dancingGif = document.getElementById('dancingGif');

// Request microphone access
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let analyser = audioContext.createAnalyser();
        let microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);

        analyser.fftSize = 256;  // Increase this for better frequency resolution
        function checkSound() {
            analyser.getByteFrequencyData(dataArray);
            let soundLevel = 0;
            for (let i = 0; i < bufferLength; i++) {
                soundLevel += dataArray[i];
            }
            soundLevel /= bufferLength;  // Average sound level

            if (soundLevel > 20) {  // Adjust this threshold for more sensitivity
                if (dancingGif.style.display === "none") {
                    dancingGif.style.display = "block";  // Show the gif
                }
            } else {
                if (dancingGif.style.display !== "none") {
                    dancingGif.style.display = "none";  // Hide the gif
                }
            }
        }

        // Continuously check for sound
        setInterval(checkSound, 100);  // Check every 100ms
    })
    .catch(function(err) {
        console.log("Error accessing microphone: ", err);
    });
