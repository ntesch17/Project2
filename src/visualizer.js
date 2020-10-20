/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as audio from './audio.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;
let red, blue, green;
let r, g, b;

function setupCanvas(canvasElement, analyserNodeRef) {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: 0, color: "blue" }, { percent: .25, color: "green" }, { percent: .5, color: "yellow" }, { percent: .75, color: "red" }, { percent: 1, color: "magenta" }]);
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
}

function draw(params = {}) {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
    if (params.showWaveform) {
        analyserNode.getByteTimeDomainData(audioData);

    }
    if (params.showWaveform == false) {
        analyserNode.getByteFrequencyData(audioData);
    }

    // if (params.showWaveform) {
    //     audio.setupWebaudioWav(DEFAULTS.sound1);

    // }
    // if (params.showWaveform == false) {
    //     audio.setupWebaudioFreq(DEFAULTS.sound1);

    // }

    // 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .3;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();


    if (params.showTint) {
        ctx.save();
        document.querySelector("#redRange").onchange = function(e) {

            red = e.target.value;
            let redOutput = document.querySelector("#redValue");
            let redSlider = document.querySelector("#redRange");
            redOutput.innerHTML = redSlider.value;

            redSlider.oninput = function() {
                redOutput.innerHTML = e.target.value;
            }
        };
        document.querySelector("#blueRange").onchange = function(e) {

            blue = e.target.value;
            let blueOutput = document.querySelector("#blueValue");
            let blueSlider = document.querySelector("#blueRange");
            blueOutput.innerHTML = blueSlider.value;

            blueSlider.oninput = function() {
                blueOutput.innerHTML = e.target.value;
            }
        };
        document.querySelector("#greenRange").onchange = function(e) {

            green = e.target.value;
            let greenOutput = document.querySelector("#greenValue");
            let greenSlider = document.querySelector("#greenRange");
            greenOutput.innerHTML = greenSlider.value;

            greenSlider.oninput = function() {
                greenOutput.innerHTML = e.target.value;
            }
        };

        ctx.fillStyle = utils.makeColor(red, green, blue, .2);
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore()
    }

    //3 - draw gradient
    if (params.showGradientBackground && params.showWaveform) {
        ctx.save();
        let rgb;

        //ctx.fillStyle = gradient;
        for (let i = 0; i < audioData.length; i++) {
            if (audioData[i] > 210) {
                r = 10;
                g = 10;
                b = 255;
            } else if (audioData[i] > 200) {
                r = 255;
                g = 255;
                b = 0;
            } else if (audioData[i] > 190) {
                r = 204;
                g = 255;
                b = 0;
            } else if (audioData[i] > 180) {
                r = 0;
                g = 0;
                b = 255;
            } else if (audioData[i] > 130) {
                r = 252;
                g = 175;
                b = 60;
            } else if (audioData[i] > 90) {
                r = 60;
                g = 252;
                b = 73;
            } else if (audioData[i] > 50) {
                r = 207;
                g = 60;
                b = 252;
            } else {
                r = 150;
                g = 150;
                b = 255;
            }

            rgb = `rgb(${r},${g},${b})`;
            let grd = ctx.createLinearGradient(0, 0, 0, canvasHeight);
            grd.addColorStop(0, rgb);
            grd.addColorStop(0.2, rgb);
            grd.addColorStop(0.4, rgb);
            grd.addColorStop(0.6, rgb);
            grd.addColorStop(0.8, rgb);
            grd.addColorStop(1, rgb);
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = grd;

            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        }

        ctx.restore();
    } else if (params.showGradientBackground && params.showFrequency) {
        ctx.save();

        let grd = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        grd.addColorStop(0, utils.getRandomColor());
        grd.addColorStop(0.2, utils.getRandomColor());
        grd.addColorStop(0.4, utils.getRandomColor());
        grd.addColorStop(0.6, utils.getRandomColor());
        grd.addColorStop(0.8, utils.getRandomColor());
        grd.addColorStop(1, utils.getRandomColor());
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = grd;

        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    if (params.showQuadraticCurve) {
        let averageLoudness = 0;
        let range = canvasHeight;
        for (let i = 0; i < audioData.length; i++) {
            averageLoudness += audioData[i] / canvasHeight / 2;
            averageLoudness /= utils.getRandom(0, 255);
            ctx.save();
            ctx.lineWidth = 2;
            if (audioData[i] > 210) {
                r = 10;
                g = 10;
                b = 255;
            } else if (audioData[i] > 200) {
                r = 255;
                g = 255;
                b = 0;
            } else if (audioData[i] > 190) {
                r = 204;
                g = 255;
                b = 0;
            } else if (audioData[i] > 180) {
                r = 0;
                g = 0;
                b = 255;
            } else if (audioData[i] > 130) {
                r = 252;
                g = 175;
                b = 60;
            } else if (audioData[i] > 90) {
                r = 60;
                g = 252;
                b = 73;
            } else if (audioData[i] > 50) {
                r = 207;
                g = 60;
                b = 252;
            } else {
                r = 150;
                g = 150;
                b = 255;
            }


            ctx.strokeStyle = `rgb(${r},${g},${b})`;
            ctx.beginPath();
            ctx.moveTo(-20, canvasHeight - 415);
            ctx.quadraticCurveTo(canvasWidth / 2, range * averageLoudness * 2, canvasWidth + 20, canvasHeight - 415);

            ctx.stroke();
            ctx.restore();
        }
    }

    // 4 - draw bars
    if (params.showBarDisplay) {

        let barWidth = (canvasWidth / audioData.length);
        let barHeight;
        let x = 0;
        ctx.save();

        let bars = 118 // Set total number of bars you want per frame

        for (let i = 0; i < bars; i++) {
            barHeight = audioData[i];

            if (audioData[i] > 210) {
                r = 10;
                g = 10;
                b = 255;
            } else if (audioData[i] > 200) {
                r = 255;
                g = 255;
                b = 0;
            } else if (audioData[i] > 190) {
                r = 204;
                g = 255;
                b = 0;
            } else if (audioData[i] > 180) {
                r = 0;
                g = 0;
                b = 255;
            } else if (audioData[i] > 130) {
                r = 252;
                g = 175;
                b = 60;
            } else if (audioData[i] > 90) {
                r = 60;
                g = 252;
                b = 73;
            } else if (audioData[i] > 50) {
                r = 207;
                g = 60;
                b = 252;
            } else {
                r = 150;
                g = 150;
                b = 255;
            }

            ctx.fillStyle = `rgb(${r},${g},${b})`;

            ctx.fillRect(x, (canvasHeight - barHeight), barWidth, barHeight);

            x += barWidth + 10 // Gives 10px space between each bar
        }
        ctx.restore();
    }


    if (params.showRectangleBarDisplay) {
        let center_x = canvasWidth / 2 - 200;
        let center_y = canvasHeight / 2;
        let center_x2 = canvasWidth / 2 + 200;

        let radius = utils.getRandom(50, 250);
        ctx.save();
        for (let i = 0; i < audioData.length; i++) {
            let rads = Math.PI * 6 + audioData[i];

            let x = center_x + Math.cos(rads * i) * (radius);
            let x2 = center_x2 + Math.cos(rads * i) * (radius);
            let y = center_y + Math.sin(rads * i) * (radius);

            if (audioData[i] > 210) {
                r = 10;
                g = 10;
                b = 255;
            } else if (audioData[i] > 200) {
                r = 255;
                g = 255;
                b = 0;
            } else if (audioData[i] > 190) {
                r = 204;
                g = 255;
                b = 0;
            } else if (audioData[i] > 180) {
                r = 0;
                g = 0;
                b = 255;
            } else if (audioData[i] > 130) {
                r = 252;
                g = 175;
                b = 60;
            } else if (audioData[i] > 90) {
                r = 60;
                g = 252;
                b = 73;
            } else if (audioData[i] > 50) {
                r = 207;
                g = 60;
                b = 252;
            } else {
                r = 150;
                g = 150;
                b = 255;
            }
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.lineWidth = 10;
            ctx.fillRect(x, y, 20, 20)
            ctx.fillRect(x2, y, 20, 20)
            ctx.fill();
        }

        let maxRadius = canvasHeight / 3;

        ctx.globalAlpha = 0.5;
        for (let i = 0; i < audioData.length; i++) {

            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.getRandomColor();
            ctx.arc(canvasWidth / 2 - 190, canvasHeight / 2 + 10, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 255, .10 - percent / 10.0);
            ctx.arc(canvasWidth / 2 - 190, canvasHeight / 2 + 10, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();


            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent / 5.0);
            ctx.arc(canvasWidth / 2 - 190, canvasHeight / 2 + 10, circleRadius * .50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.getRandomColor();
            ctx.arc(canvasWidth / 2 + 210, canvasHeight / 2 + 10, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 255, .10 - percent / 10.0);
            ctx.arc(canvasWidth / 2 + 210, canvasHeight / 2 + 10, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent / 5.0);
            ctx.arc(canvasWidth / 2 + 210, canvasHeight / 2 + 10, circleRadius * .50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        }
        ctx.restore();
    }

    if (params.showCircleBarDisplay) {

        let bars = 118 // Set total number of bars you want per frame
        let center_x = canvasWidth / 2;
        let center_y = canvasHeight / 2;
        let radius = 75;
        ctx.save();
        //draw a circle
        ctx.beginPath();
        ctx.arc(center_x, center_y, radius, 0, 2 * Math.PI);
        ctx.stroke();

        for (let i = 0; i < bars; i++) {
            let barHeight = audioData[i];
            let rads = Math.PI * 2 / bars;


            let bar_width = 2;

            let x = center_x + Math.cos(rads * i) * (radius);
            let y = center_y + Math.sin(rads * i) * (radius);
            let x_end = center_x + Math.cos(rads * i) * (radius + barHeight);
            let y_end = center_y + Math.sin(rads * i) * (radius + barHeight);
            if (audioData[i] > 210) {
                r = 10;
                g = 10;
                b = 255;
            } else if (audioData[i] > 200) {
                r = 255;
                g = 255;
                b = 0;
            } else if (audioData[i] > 190) {
                r = 204;
                g = 255;
                b = 0;
            } else if (audioData[i] > 180) {
                r = 0;
                g = 0;
                b = 255;
            } else if (audioData[i] > 130) {
                r = 252;
                g = 175;
                b = 60;
            } else if (audioData[i] > 90) {
                r = 60;
                g = 252;
                b = 73;
            } else if (audioData[i] > 50) {
                r = 207;
                g = 60;
                b = 252;
            } else {
                r = 150;
                g = 150;
                b = 255;
            }

            ctx.strokeStyle = `rgb(${r},${g},${b})`;
            ctx.lineWidth = bar_width;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x_end, y_end);
            ctx.stroke();
        }
        let maxRadius = canvasHeight / 4;

        ctx.globalAlpha = 0.5;
        for (let i = 0; i < audioData.length; i++) {
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.getRandomColor();
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 255, .10 - percent / 10.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent / 5.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * .50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }

    if (params.showCircleBackground) {
        let r, g, b;
        ctx.save();

        for (let i = 0; i < audioData.length; i++) {
            if (audioData[i] > 210) {
                r = 10;
                g = 10;
                b = 255;
            } else if (audioData[i] > 200) {
                r = 255;
                g = 255;
                b = 0;
            } else if (audioData[i] > 190) {
                r = 204;
                g = 255;
                b = 0;
            } else if (audioData[i] > 180) {
                r = 0;
                g = 0;
                b = 255;
            } else if (audioData[i] > 130) {
                r = 252;
                g = 175;
                b = 60;
            } else if (audioData[i] > 90) {
                r = 60;
                g = 252;
                b = 73;
            } else if (audioData[i] > 50) {
                r = 207;
                g = 60;
                b = 252;
            } else {
                r = 150;
                g = 150;
                b = 255;
            }
            let maxRadius = canvasHeight / 10;
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.arc(utils.getRandom(utils.getRandom(1, 800), audioData[i]), utils.getRandom(utils.getRandom(1, 400), audioData[i]), circleRadius, 0, 2 * Math.PI, false);
            ctx.globalAlpha = 0.5;
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        }
        ctx.restore();
    }

    if (params.showLineBackground) {
        let r, g, b;
        ctx.save();
        let width = canvasWidth / audioData.length;
        let height = canvasHeight / audioData.length;
        for (let i = 0; i < audioData.length; i++) {
            if (audioData[i] > 210) {
                r = 10;
                g = 10;
                b = 255;
            } else if (audioData[i] > 200) {
                r = 255;
                g = 255;
                b = 0;
            } else if (audioData[i] > 190) {
                r = 204;
                g = 255;
                b = 0;
            } else if (audioData[i] > 180) {
                r = 0;
                g = 0;
                b = 255;
            } else if (audioData[i] > 130) {
                r = 252;
                g = 175;
                b = 60;
            } else if (audioData[i] > 90) {
                r = 60;
                g = 252;
                b = 73;
            } else if (audioData[i] > 50) {
                r = 207;
                g = 60;
                b = 252;
            } else {
                r = 150;
                g = 150;
                b = 255;
            }
            let rads = Math.PI * 2 / canvasWidth;




            let x = canvasWidth / 25 + rads * i * (1500);
            let y = canvasHeight / 25 + rads * i * (1500);
            let x_end = canvasWidth / 25 + rads * i * (1500 + width);
            let y_end = canvasHeight / 25 + rads * i * (1500 + height);

            ctx.strokeStyle = `rgb(${r},${g},${b})`;
            ctx.lineWidth = 1500;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x_end, y_end);
            ctx.stroke();
            ctx.restore();
        }


        ctx.restore();
    }


    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {
        // C) randomly change every 20th pixel to red
        if (params.showNoise && Math.random() < .01) {
            // data[i] is the red channel
            // data[i+1] is the green channel
            // data[i+2] is the blue channel
            // data[i+3] is the alpha channel


            data[i] = data[i + 1] = data[i + 2] = utils.getRandom(0, 255) // zero out the red and green and blue channels
            data[i + 1] = utils.getRandom(0, 255); // make the red channel 100% red

        } // end if
        if (params.showInvert) {
            let red = data[i],
                green = data[i + 1],
                blue = data[i + 2];
            data[i] = 200 - red;
            data[i + 1] = utils.getRandom(200, 255) - green;
            data[i + 2] = 200 - blue;
        } // end if
    } // end for


    for (let i = 0; i < length; i++) {
        if (params.showEmboss) {
            if (i % 4 == 3) continue; //Skip alpha channel
            data[i] = 180 + 2 * data[i + 3] - data[i + 4] - data[i + width * 4];
        }
    }

    if (params.showSepia) {
        ctx.save();

        for (let i = 0; i < length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            data[i] = (r * .671) + (g * .769) + (b * .189);
            data[i + 1] = (r * .349) + (g * .686) + (b);
            data[i + 2] = (r * .272) + (g) + (b * .131);
        }
        ctx.restore();
    }

    if (params.showDesaturation) {
        ctx.save();
        for (let i = 0; i < length; i++) {
            let red = data[i],
                green = data[i + 1],
                blue = data[i + 2];

            let rgb = red * 0.21 + green * 0.71 + blue * 0.07;
            data[i] = rgb;
            data[i + 1] = rgb;
            data[i + 2] = rgb;
        }
        ctx.restore();
    }

    if (params.showShiftRGB) {
        ctx.save();
        for (let i = 0; i < length; i += 4) {
            let red = data[i],
                green = data[i + 1],
                blue = data[i + 2];


            data[i] = green;
            data[i + 1] = blue;
            data[i + 2] = red;
        }
        ctx.restore();
    }

    //Copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}



export { setupCanvas, draw };