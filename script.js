const dancingGuy = document.querySelector('.dancing-guy');

// Access microphone
navigator.mediaDevices.getUserMedia({ audio: true })
  .then((stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    analyser.smoothingTimeConstant = 0.7;
    analyser.fftSize = 512;

    microphone.connect(analyser);

    function monitorSound() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      if (volume > 10) {
        dancingGuy.style.animation = 'dance 0.5s infinite'; // Start animation
      } else {
        dancingGuy.style.animation = 'none'; // Stop animation
      }

      requestAnimationFrame(monitorSound);
    }

    monitorSound();
  })
  .catch((err) => {
    console.error('Microphone access denied:', err);
  });
