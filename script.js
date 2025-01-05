let gifElement = document.querySelector('.dancing-gif');
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioContext.createAnalyser();
let microphone;
let scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        scriptProcessor.onaudioprocess = function() {
            let bufferLength = analyser.frequencyBinCount;
            let dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);
            
            let sum = dataArray.reduce((a, b) => a + b, 0);
            let average = sum / bufferLength;

            if (average > 50) {  // Threshold for sound detection
                gifElement.style.display = 'block';  // Show the GIF when sound is detected
            } else {
                gifElement.style.display = 'none';   // Hide the GIF when no sound is detected
            }
        };
    })
    .catch(function(err) {
        console.error("Error accessing microphone: ", err);
    });
