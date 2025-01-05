const gifContainer = document.querySelector('.gif-container');

// Function to handle microphone access and sound detection
async function startListening() {
  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone access granted");

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    analyser.smoothingTimeConstant = 0.7;
    analyser.fftSize = 512;

    microphone.connect(analyser);

    // Monitor sound levels
    function monitorSound() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      console.log("Volume:", volume);

      if (volume > 10) {
        gifContainer.style.display = 'block'; // Show GIF when sound is detected
      } else {
        gifContainer.style.display = 'none'; // Hide GIF when silent
      }

      requestAnimationFrame(monitorSound);
    }

    monitorSound();
  } catch (error) {
    console.error("Error accessing microphone:", error);
    alert("Microphone access is required for the dancing fat guy to work. Please allow microphone access and refresh the page.");
  }
}

// Start listening for sound input
startListening();
