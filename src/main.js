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
let progress;
let audioElement;
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
    showLineBackground: false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/Sing it Loud.mp3"
});

function init() {
    console.log("init called");

    // if (drawParams.showWaveform) {
    //     audio.setupWebaudioWav(DEFAULTS.sound1);

    // } else {
    //     audio.setupWebaudioFreq(DEFAULTS.sound1);

    // }
    audio.setupWebaudio(DEFAULTS.sound1);

    //audio.setupWebaudioWav(DEFAULTS.sound1);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element

    audioElement = document.querySelector('audio');

    audioControls(audioElement, DEFAULTS.sound1);




    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}

function setupUI(canvasElement) {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };



    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    audioElement.addEventListener('play', function() {
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        audio.playCurrentSound();
    });
    audioElement.addEventListener('pause', function() {

        audio.pauseCurrentSound();
        utils.clearCanvas();
    });


    //D-hookup track <select>
    let trackSelect = document.querySelector("#trackSelect");
    //add .onchange event to <select>
    trackSelect.onchange = e => {

        audioControls(audioElement, e.target.value);
        audio.loadSoundFile(e.target.value);
    };

    document.querySelector("#gradientCB").onchange = function(e) {
        drawParams.showGradientBackground = e.target.checked;
        canvas.draw(drawParams.showGradient);
    };

    document.querySelector("#barsCB").onchange = function(e) {
        drawParams.showBarDisplay = e.target.checked;
        canvas.draw(drawParams.showBarDisplay);
    };

    document.querySelector("#circlesCB").onchange = function(e) {
        drawParams.showCircleBarDisplay = e.target.checked;
        canvas.draw(drawParams.showCircleBarDisplay);
    };

    document.querySelector("#rectanglesCB").onchange = function(e) {
        drawParams.showRectangleBarDisplay = e.target.checked;
        canvas.draw(drawParams.showRectangleBarDisplay);
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

    document.querySelector(".tintCB").onchange = function(e) {
        drawParams.showTint = e.target.checked;
        canvas.draw(drawParams.showTint);
    };

    document.querySelector("#sepiaCB").onchange = function(e) {
        drawParams.showSepia = e.target.checked;
        canvas.draw(drawParams.showSepia);
    };

    document.querySelector("#desaturationCB").onchange = function(e) {
        drawParams.showDesaturation = e.target.checked;
        canvas.draw(drawParams.showDesaturation);
    };

    document.querySelector("#shiftRgbCB").onchange = function(e) {
        drawParams.showShiftRGB = e.target.checked;
        canvas.draw(drawParams.showShiftRGB);
    };

    document.querySelector("#circleBackgroundCB").onchange = function(e) {
        drawParams.showCircleBackground = e.target.checked;
        canvas.draw(drawParams.showCircleBackground);
    };

    document.querySelector("#lineBackgroundCB").onchange = function(e) {
        drawParams.showLineBackground = e.target.checked;
        canvas.draw(drawParams.showLineBackground);
    };

    document.querySelector("#quadraticCurveCB").onchange = function(e) {
        drawParams.showQuadraticCurve = e.target.checked;
        canvas.draw(drawParams.showQuadraticCurve);
    };

    document.querySelector(".waveform").onchange = function(e) {

        drawParams.showWaveform = e.target.checked;
        drawParams.showFrequency = false
    };

    document.querySelector(".frequency").onchange = function(e) {

        drawParams.showFrequency = e.target.checked;
        drawParams.showWaveform = false
    };

} // end setupUI

function loop() {
    /* NOTE: This is temporary testing code that we will delete in Part II */
    requestAnimationFrame(loop);

    canvas.draw(drawParams);


    // 1) create a byte array (values of 0-255) to hold the audio data
    // normally, we do this once when the program starts up, NOT every frame
    // if (drawParams.showWaveform) {

    // let audioData = new Uint8Array(audio.analyserNode.fftSize / 2);

    // //     // // 2) populate the array of audio data *by reference* (i.e. by its address)
    // audio.analyserNode.getByteFrequencyData(audioData);
    // }

    // // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
    // // console.log(audioData);

    // // console.log("-----Audio Stats-----");
    // let totalLoudness = audioData.reduce((total, num) => total + num);
    // let averageLoudness = totalLoudness / (audio.analyserNode.fftSize / 2);
    // let minLoudness = Math.min(...audioData); // ooh - the ES6 spread operator is handy!
    // let maxLoudness = Math.max(...audioData); // ditto!
    // // Now look at loudness in a specific bin
    // // 22050 kHz divided by 128 bins = 172.23 kHz per bin
    // // the 12th element in array represents loudness at 2.067 kHz
    // let loudnessAt2K = audioData[11];
    // // console.log(`averageLoudness = ${averageLoudness}`);
    // // console.log(`minLoudness = ${minLoudness}`);
    // // console.log(`maxLoudness = ${maxLoudness}`);
    // // console.log(`loudnessAt2K = ${loudnessAt2K}`);
    // // console.log("---------------------");
}

function audioControls(audioElement, filePath) {
    audioElement.src = filePath;
}

export { init };