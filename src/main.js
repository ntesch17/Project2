/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!
import * as canvas from './visualizer.js';
import * as audio from './audio.js';
import * as utils from './utils.js';

let audioElement;

let highshelf = false,
    lowshelf = false,
    highpass = false,
    lowpass = false,
    bandpass = false,
    peaking = false;

const drawParams = {
    showGradientBackground: false,
    showBarDisplay: false,
    showCircleBarDisplay: false,
    showNoise: false,
    showInvert: false,
    showEmboss: false,
    showTint: false,
    showSepia: false,
    showDesaturation: false,
    showFrequency: false,
    showWaveform: false,
    showShiftRGB: false,
    showCircleBackground: false,
    showQuadraticCurve: false,
    showRectangleBarDisplay: false,
    showLineBackground: false,
    showModes: false,
    showPhyllotaxis: false,
};

const DEFAULTS = Object.freeze({
    sound1: "media/Sing it Loud.mp3"
});

function init() {
    //Hooking up canvas element.
    let canvasElement = document.querySelector("canvas");

    //Hooking up audio element.
    audioElement = document.querySelector('audio');

    //Setting up web audio to first song until track change.
    audio.setupWebaudio(DEFAULTS.sound1);

    //Managing UI according to user input
    setupUI(canvasElement);

    //Setting up canvas
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}

//Checks if the user checks any input choices, if so the visuals appear.
function setupUI(canvasElement) {
    const fsButton = document.querySelector("#fsButton");

    audioElement.addEventListener('play', function() {
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        audio.playCurrentSound();

    });
    audioElement.addEventListener('pause', function() {
        audio.pauseCurrentSound();
    });

    document.querySelector('#highshelfRB').checked = highshelf;

    document.querySelector('#highshelfRB').onchange = e => {
        highshelf = e.target.value
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleSoundModes(highshelf, "highshelf");
    };

    document.querySelector('#lowshelfRB').checked = lowshelf;

    document.querySelector('#lowshelfRB').onchange = e => {
        lowshelf = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleSoundModes(lowshelf, "lowshelf");
    };

    document.querySelector('#highpassRB').checked = highpass;

    document.querySelector('#highpassRB').onchange = e => {
        highpass = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleSoundModes(highpass, "highpass");
    };

    document.querySelector('#lowpassRB').checked = lowpass;

    document.querySelector('#lowpassRB').onchange = e => {
        lowpass = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleSoundModes(lowpass, "lowpass");
    };

    document.querySelector('#bandpassRB').checked = bandpass;

    document.querySelector('#bandpassRB').onchange = e => {
        bandpass = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleSoundModes(bandpass, "bandpass");
    };

    document.querySelector('#peakingRB').checked = peaking;

    document.querySelector('#peakingRB').onchange = e => {
        peaking = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleSoundModes(peaking, "peaking");
    };

    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };

    let trackSelect = document.querySelector("#trackSelect");
    trackSelect.onchange = e => {
        audioControls(audioElement, e.target.value);
        audio.loadSoundFile(e.target.value);
    };

    document.querySelector("#gradientCB").onchange = function(e) {
        drawParams.showGradientBackground = e.target.checked;
        canvas.draw(drawParams.showGradient);
    };

    document.querySelector("#circlesRB").onchange = function(e) {
        drawParams.showCircleBarDisplay = e.target.checked;
        drawParams.showRectangleBarDisplay = false;
        drawParams.showCircleBackground = false;
        drawParams.showPhyllotaxis = false;
        drawParams.showQuadraticCurve = false;
        canvas.draw(drawParams.showCircleBarDisplay);
    };

    document.querySelector("#rectanglesRB").onchange = function(e) {
        drawParams.showRectangleBarDisplay = e.target.checked;
        drawParams.showCircleBarDisplay = false;
        drawParams.showCircleBackground = false;
        drawParams.showPhyllotaxis = false;
        drawParams.showQuadraticCurve = false;
        canvas.draw(drawParams.showRectangleBarDisplay);
    };

    document.querySelector("#circleBackgroundRB").onchange = function(e) {
        drawParams.showCircleBackground = e.target.checked;
        drawParams.showCircleBarDisplay = false;
        drawParams.showRectangleBarDisplay = false;
        drawParams.showPhyllotaxis = false;
        drawParams.showQuadraticCurve = false;
        canvas.draw(drawParams.showCircleBackground);
    };

    document.querySelector("#phyllotaxisRB").onchange = function(e) {
        drawParams.showPhyllotaxis = e.target.checked;
        drawParams.showCircleBarDisplay = false;
        drawParams.showRectangleBarDisplay = false;
        drawParams.showCircleBackground = false;
        drawParams.showQuadraticCurve = false;
        canvas.draw(drawParams.showPhyllotaxis);
    };

    document.querySelector("#quadraticCurveRB").onchange = function(e) {
        drawParams.showQuadraticCurve = e.target.checked;
        drawParams.showCircleBarDisplay = false;
        drawParams.showRectangleBarDisplay = false;
        drawParams.showCircleBackground = false;
        drawParams.showPhyllotaxis = false;
        canvas.draw(drawParams.showQuadraticCurve);
    };

    document.querySelector("#modesCB").onchange = function(e) {
        drawParams.showModes = e.target.checked;
        canvas.draw(drawParams.showModes);
    };

    document.querySelector("#noiseCB").onchange = function(e) {
        drawParams.showNoise = e.target.checked;
        canvas.draw(drawParams.showNoise);
    };

    document.querySelector("#invertCB").onchange = function(e) {
        drawParams.showInvert = e.target.checked;
        canvas.draw(drawParams.showInvert);
    };

    document.querySelector("#embossCB").onchange = function(e) {
        drawParams.showEmboss = e.target.checked;
        canvas.draw(drawParams.showEmboss);
    };

    document.querySelector("#tintCB").onchange = function(e) {
        drawParams.showTint = e.target.checked;
        canvas.draw(drawParams.showTint);
    };

    document.querySelector("#sepiaCB").onchange = function(e) {
        drawParams.showSepia = e.target.checked;
        canvas.draw(drawParams.showSepia);
    };

    document.querySelector("#shiftRgbCB").onchange = function(e) {
        drawParams.showShiftRGB = e.target.checked;
        canvas.draw(drawParams.showShiftRGB);
    };

    document.querySelector("#waveform").onchange = function(e) {
        drawParams.showWaveform = e.target.checked;
        drawParams.showFrequency = false
    };

    document.querySelector("#frequency").onchange = function(e) {

        drawParams.showFrequency = e.target.checked;
        drawParams.showWaveform = false
    };
}

//Looping the visuals
function loop() {
    requestAnimationFrame(loop);
    drawParams.showLineBackground = true;
    canvas.draw(drawParams.showLineBackground);
    drawParams.showBarDisplay = true;
    canvas.draw(drawParams.showBarDisplay);
    canvas.draw(drawParams);
}

//When there is a track change, change filepath
function audioControls(audioElement, filePath) {
    audioElement.src = filePath;
}

export { init };