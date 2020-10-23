// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx, audioNodes = {},
    sourceBuffer, impulseResponseBuffers = [];;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element, sourceNode, analyserNode, gainNode;

let isPlaying = false;

const soundData = [
    { "soundName": "Source", "url": "media/Sing It Loud.mp3" },
    { "soundName": "Source", "url": "media/One More Time.mp3" },
    { "soundName": "Source", "url": "media/Beautiful Disaster.mp3" },
    { "soundName": "Echo", "url": "media/sound.wav" },
];


const soundPaths = ["media/Sing It Loud.mp3", "media/sound.wav"];

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});
const DEFAULTS2 = Object.freeze({
    gain: .5,
    numSamples: 2048
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples);
let audioElement = document.querySelector('audio');

let biquadFilter, convolver;
// **Next are "public" methods - we are going to export all of these at the bottom of this file**
function setupWebaudio() {
    // 1 - The || is because WebAudio has not been standardized across browsers yet

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = document.querySelector("audio");


    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // 5 - create an analyser node
    // note the UK spelling of "Analyser"
    analyserNode = audioCtx.createAnalyser();

    // https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
    biquadFilter = audioCtx.createBiquadFilter();

    biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);

    var convolver = audioCtx.createConvolver();



    // grab audio track via XHR for convolver node




    let loader = new BufferLoader(audioCtx, soundPaths, onLoaded);

    function onLoaded(buffers) {
        sourceBuffer = buffers[0]; // first sound is our "Convolutee" that we will be distorting
        impulseResponseBuffers = buffers.splice(1); // rest of sounds are impulse response sounds
        //play();
    }

    loader.load();
    // let loader = new BufferLoader(audioCtx, soundPaths, onLoaded);

    // function onLoaded(buffers) {
    //     sourceBuffer = buffers[0]; // first sound is our "Convolutee" that we will be distorting
    //     impulseResponseBuffers = buffers.splice(1); // rest of sounds are impulse response sounds
    //     toggleEcho();
    // }

    // loader.load();

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;
    sourceNode.connect(biquadFilter);
    biquadFilter.connect(analyserNode);
    biquadFilter.connect(gainNode);
    // 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

}

function toggleHighshelf(type, typeString) {
    if (type) {
        document.querySelector("#soundFilterValue").value = 0;
        document.querySelector('#soundFilterSlider').onchange = e => {
            biquadFilter.type = typeString;
            biquadFilter.frequency.setValueAtTime(2000, audioCtx.currentTime); // we created the `biquadFilter` (i.e. "treble") node last time
            // biquadFilter.frequency.value = 1000;
            biquadFilter.gain.setValueAtTime(e.target.value, audioCtx.currentTime);

            let soundFilterOutput = document.querySelector("#soundFilterValue");
            let soundFilterSlider = document.querySelector("#soundFilterSlider");
            soundFilterOutput.innerHTML = soundFilterSlider.value;

            soundFilterSlider.oninput = function() {
                soundFilterOutput.innerHTML = e.target.value;
            }
        };
    }

}

function play() {
    //autoplayFix();
    //let index = getRadioGroupValue("radioIR");
    audioNodes.source = audioCtx.createBufferSource();
    audioNodes.source.buffer = sourceBuffer;


    audioNodes.convolver = audioCtx.createConvolver();
    audioNodes.convolver.buffer = impulseResponseBuffers[soundPaths.splice[1]];
    sourceNode.connect(audioNodes.convolver);
    audioNodes.convolver.connect(audioCtx.destination);


    audioNodes.source.start();
}


window.BufferLoader = function() {
    "use strict";

    function BufferLoader(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
    }

    BufferLoader.prototype.loadBuffer = function(url, index) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        var loader = this;
        request.onload = function() {
            loader.context.decodeAudioData(request.response, function(buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount == loader.urlList.length) loader.onload(loader.bufferList);
                },
                function(error) {
                    console.error('decodeAudioData error', error);
                });
        };

        request.onerror = function() {
            alert('BufferLoader: XHR error');
        }

        request.send();
    }

    BufferLoader.prototype.load = function() {
        for (var i = 0; i < this.urlList.length; ++i) {
            this.loadBuffer(this.urlList[i], i);
        }
    }

    return BufferLoader;
}();

// make sure that it's a Number rather than a String
function loadSoundFile(filePath) {
    element.src = filePath;

}

function playCurrentSound() {
    element.play();
}

function pauseCurrentSound() {
    element.pause();
}

export { audioCtx, setupWebaudio, toggleHighshelf, playCurrentSound, pauseCurrentSound, loadSoundFile, analyserNode };