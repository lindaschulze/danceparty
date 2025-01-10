// Selektiere das GIF-Element
const gif = document.getElementById('gif');

// Timer, um das GIF nach einer Verzögerung auszublenden
let hideGifTimeout;

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

      // Lautstärke-Schwelle: Passe den Wert an (hier: > 50)
      if (volume > 50) {
        gif.style.display = 'block'; // GIF anzeigen

        // Falls ein Ausblende-Timer aktiv ist, lösche ihn
        if (hideGifTimeout) {
          clearTimeout(hideGifTimeout);
        }
      } else {
        // GIF nach 1 Sekunde ausblenden
        if (!hideGifTimeout) {
          hideGifTimeout = setTimeout(() => {
            gif.style.display = 'none';
            hideGifTimeout = null; // Timer zurücksetzen
          }, 1000); // Verzögerung in Millisekunden
        }
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
