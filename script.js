// Selektiere das GIF-Element und den Text
const gif = document.getElementById('gif');
const text = document.getElementById('text');  // Text hinzugefügt

// Timer, um das GIF nach einer Verzögerung auszublenden
let hideGifTimeout;

// Schwellenwert und Puffer für Lautstärkedaten
const VOLUME_THRESHOLD = 70; // Erhöhter Schwellenwert für Lautstärke
const SAMPLES = 5; // Anzahl der Messungen für Glättung
const volumeBuffer = []; // Speichert die letzten Lautstärkewerte

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

      // Speichere die Lautstärke in den Puffer
      volumeBuffer.push(volume);
      if (volumeBuffer.length > SAMPLES) {
        volumeBuffer.shift(); // Ältesten Wert entfernen
      }

      // Berechne den Durchschnitt der letzten Lautstärkewerte
      const averageVolume = volumeBuffer.reduce((a, b) => a + b, 0) / volumeBuffer.length;

      if (averageVolume > VOLUME_THRESHOLD) {
        // Lautstärke über Schwelle -> GIF anzeigen und Text ausblenden
        gif.style.display = 'block';
        text.style.display = 'none';  // Text sofort ausblenden

        // Lösche den Ausblende-Timer, falls aktiv
        if (hideGifTimeout) {
          clearTimeout(hideGifTimeout);
          hideGifTimeout = null;
        }
      } else {
        // Lautstärke unter Schwelle -> GIF nach 700 Millisekunden ausblenden
        if (!hideGifTimeout) {
          hideGifTimeout = setTimeout(() => {
            gif.style.display = 'none';
            text.style.display = 'block';  // Text wieder anzeigen
            hideGifTimeout = null; // Timer zurücksetzen
          }, 700); // Verzögerung auf 700 Millisekunden angepasst
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
