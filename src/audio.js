let element, sourceNode, analyserNode, gainNode, biquadFilter, audioCtx;

const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

function setupWebaudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    element = document.querySelector("audio");

    sourceNode = audioCtx.createMediaElementSource(element);


    analyserNode = audioCtx.createAnalyser();

    // https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);

    analyserNode.fftSize = DEFAULTS.numSamples;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;
    sourceNode.connect(biquadFilter);
    biquadFilter.connect(analyserNode);
    biquadFilter.connect(gainNode);
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

function toggleSoundModes(type, typeString) {
    if (type) {
        document.querySelector("#soundFilterValue").value = 0;
        document.querySelector('#soundFilterSlider').onchange = e => {
            biquadFilter.type = typeString;
            biquadFilter.frequency.setValueAtTime(2000, audioCtx.currentTime);
            biquadFilter.gain.setValueAtTime(e.target.value, audioCtx.currentTime);

            let soundFilterOutput = document.querySelector("#soundFilterValue");
            let soundFilterSlider = document.querySelector("#soundFilterSlider");
            soundFilterOutput.innerHTML = soundFilterSlider.value;

            soundFilterSlider.oninput = function() {
                soundFilterOutput.innerHTML = e.target.value;
            }
        };
    } else if (typeString == "none") {
        biquadFilter.frequency.setValueAtTime(0, audioCtx.currentTime);
        biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }

}

function loadSoundFile(filePath) {
    element.src = filePath;
}

function playCurrentSound() {
    element.play();
}

function pauseCurrentSound() {
    element.pause();
}

export { audioCtx, setupWebaudio, toggleSoundModes, playCurrentSound, pauseCurrentSound, loadSoundFile, analyserNode };