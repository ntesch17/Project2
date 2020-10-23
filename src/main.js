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
    allpass = false,
    highpass = false,
    lowpass = false,
    bandpass = false,
    peaking = false,
    notch = false;


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
    showPhyllotaxis: false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/Sing it Loud.mp3"
});

function init() {
    console.log("init called");


    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element

    audioElement = document.querySelector('audio');



    audio.setupWebaudio(DEFAULTS.sound1);



    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);





    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}

function setupUI(canvasElement) {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");


    audioElement.addEventListener('play', function() {
        if (audio.audioCtx.state == "suspended") {

            audio.audioCtx.resume();

        }
        //audioElement.volume = 0
        audio.playCurrentSound();

    });
    audioElement.addEventListener('pause', function() {

        audio.pauseCurrentSound();

    });

    // let biquidSelect = document.querySelector("#biquidSelect");
    // //add .onchange event to <select>

    // biquidSelect.onchange = e => {
    //     document.querySelector('#soundFilterSlider').value = 0
    //     audio.toggleHighshelf(e.target.value);

    // };


    document.querySelector('#highshelfRB').checked = highshelf; // `highshelf` is a boolean we will declare in a second

    // II. change the value of `highshelf` every time the high shelf checkbox changes state
    document.querySelector('#highshelfRB').onchange = e => {
        highshelf = e.target.value
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleHighshelf(highshelf, "highshelf"); // turn on or turn off the filter, depending on the value of `highshelf`!
    };

    // III. 

    // I. set the initial state of the high shelf checkbox
    document.querySelector('#lowshelfRB').checked = lowshelf; // `highshelf` is a boolean we will declare in a second

    // II. change the value of `highshelf` every time the high shelf checkbox changes state
    document.querySelector('#lowshelfRB').onchange = e => {
        lowshelf = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleHighshelf(lowshelf, "lowshelf"); // turn on or turn off the filter, depending on the value of `highshelf`!
    };

    document.querySelector('#highpassRB').checked = highpass;

    document.querySelector('#highpassRB').onchange = e => {
        highpass = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleHighshelf(highpass, "highpass"); // turn on or turn off the filter, depending on the value of `highshelf`!
    };

    document.querySelector('#lowpassRB').checked = lowpass;

    document.querySelector('#lowpassRB').onchange = e => {
        lowpass = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleHighshelf(lowpass, "lowpass"); // turn on or turn off the filter, depending on the value of `highshelf`!
    };

    document.querySelector('#bandpassRB').checked = bandpass;

    document.querySelector('#lowpassRB').onchange = e => {
        bandpass = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleHighshelf(bandpass, "bandpass"); // turn on or turn off the filter, depending on the value of `highshelf`!
    };

    document.querySelector('#peakingRB').checked = peaking;


    document.querySelector('#peakingRB').onchange = e => {
        peaking = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleHighshelf(peaking, "peaking"); // turn on or turn off the filter, depending on the value of `highshelf`!
    };

    document.querySelector('#notchRB').checked = notch;


    document.querySelector('#notchRB').onchange = e => {
        notch = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleHighshelf(notch, "notch"); // turn on or turn off the filter, depending on the value of `highshelf`!
    };

    document.querySelector('#allpassRB').checked = allpass;


    document.querySelector('#allpassRB').onchange = e => {
        allpass = e.target.value;
        document.querySelector('#soundFilterSlider').value = 0;
        document.querySelector("#soundFilterValue").value = 0;
        audio.toggleHighshelf(allpass, "allpass"); // turn on or turn off the filter, depending on the value of `highshelf`!
    };
    // // III. 
    // audio.toggleHighshelf(highshelf); // when the app starts up, turn on or turn off the filter, depending on the value of `highshelf`!
    // // document.querySelector('#echoCB').checked = echo; // `highshelf` is a boolean we will declare in a second

    // // II. change the value of `highshelf` every time the high shelf checkbox changes state
    // document.querySelector('#echoCB').onchange = e => {
    //     echo = e.target.checked;
    //     audio.toggleEcho(echo); // turn on or turn off the filter, depending on the value of `highshelf`!
    // };

    // audio.toggleEcho(echo);

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };



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


    document.querySelector("#circlesCB").onchange = function(e) {
        drawParams.showCircleBarDisplay = e.target.checked;
        canvas.draw(drawParams.showCircleBarDisplay);
    };

    document.querySelector("#rectanglesCB").onchange = function(e) {
        drawParams.showRectangleBarDisplay = e.target.checked;
        canvas.draw(drawParams.showRectangleBarDisplay);
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

    document.querySelector(".tintCB").onchange = function(e) {
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

    document.querySelector("#circleBackgroundCB").onchange = function(e) {
        drawParams.showCircleBackground = e.target.checked;

        canvas.draw(drawParams.showCircleBackground);
    };

    document.querySelector("#phyllotaxisCB").onchange = function(e) {
        drawParams.showPhyllotaxis = e.target.checked;

        canvas.draw(drawParams.showPhyllotaxis);
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




    drawParams.showLineBackground = true;

    canvas.draw(drawParams.showLineBackground);
    drawParams.showBarDisplay = true;
    canvas.draw(drawParams.showBarDisplay);

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