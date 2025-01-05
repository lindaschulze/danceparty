const character = document.querySelector('.character');

// Request access to the microphone
navigator.mediaDevices.getUserMedia({ audio: true })
  .then((stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);

    function detectSound() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      if (volume > 20) {
        // Start dancing
        character.style.animation = "dance 0.5s infinite";
      } else {
        // Stop dancing
        character.style.animation = "none";
      }

      requestAnimationFrame(detectSound);
    }

    detectSound();
  })
  .catch((err) => {
    console.error('Microphone access denied:', err);
    alert('Please allow microphone access to see the dancing fat guy!');
  });
