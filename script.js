// Selektiere das GIF-Element
const gif = document.getElementById('gif');

// Timer, um das GIF nach einer Verzögerung auszublenden
let hideGifTimeout;

// Lautstärkeschwelle und Debugging
const VOLUME_THRESHOLD = 50; // Mindestlautstärke, um das GIF zu aktivieren
const DEBUG = true; // Zeigt Lautstärke in der Konsole an

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

      // Debugging: Zeige
