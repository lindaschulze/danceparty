const gifContainer = document.querySelector('.dancing-gif');

navigator.mediaDevices.getUserMedia({ audio: true })
  .then((stream) => {
    console.log("Microphone access granted!");

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    analyser.fftSize = 512;
    microphone.connect(analyser);

    function monitorSound() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      console.log("Volume level:", volume); // Log volume for debugging

      if (volume > 10) {
        gifContainer.style.display = 'block'; // Show GIF when sound is detected
      } else {
        gifContainer.style.display = 'none'; // Hide GIF when silent
      }

      requestAnimationFrame(monitorSound);
    }

    monitorSound();
  })
  .catch((error) => {
    console.error("Error accessing microphone:", error);
    alert("Please allow microphone access for this feature to work.");
  });
