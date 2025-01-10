// Selektiere das GIF-Element
const gif = document.getElementById('gif');

// Funktion, um das Mikrofon zu aktivieren und Audio-Daten zu analysieren
async function startListening() {
  try {
    // Zugriff auf das Mikrofon
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 256; // Genauigkeit erhöhen
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectSound() {
      analyser.getByteFrequencyData(dataArray);

      // Berechne die durchschnittliche Lautstärke
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const volume = sum / dataArray.length;

      // Lautstärke-Schwelle: Passe den Wert nach Bedarf an
      if (volume > 50) {
        gif.style.display = 'block'; // GIF anzeigen
      } else {
        gif.style.display = 'none'; // GIF ausblenden
      }

      requestAnimationFrame(detectSound);
    }

    detectSound();
  } catch (err) {
    console.error('Fehler beim Zugriff auf das Mikrofon:', err);
  }
}

// Starte die Mikrofonüberwachung
startListening();
