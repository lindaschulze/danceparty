const gifContainer = document.querySelector('.gif-container');

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
        gifContainer.style.display = 'block'; // Show GIF when sound detected
      } else {
        gifContainer.style.display = 'none'; // Hide GIF when silent
      }

      requestAnimationFrame(monitorSound);
    }

    monitorSound();
  })
  .catch((err) => {
    console.error('Microphone access denied:', err);
  });
