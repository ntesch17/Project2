import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;
let red, blue, green;
let r, g, b;
let n = 0,
    c = 0,
    a = 0,
    r1 = 0,
    x1 = 0,
    y1 = 0;
let audioElement;
const drawParams = Object.freeze({
    "zero": 0,
    "four": 4,
    "twenty": 20,
    "twentyFive": 25,
    "onePointFive": 1.5,
    "pointFive": .50,
    "ten": 10,
    "five": 5,
    "twoHundred": 200,
    "twoHundredTen": 210,
    "oneHundredNinty": 190,
    "oneThousandFiveHundred": 1500,
    "eightHundred": 800,
    "fourHundred": 400,
    "two": 2,
    "Div1": -137.5,

});
let modes = ["source-over", "exclusion", "luminosity", "xor", "multiply", "hard-light", "difference", "hue", "saturation", "color"];

function setupCanvas(canvasElement, analyserNodeRef) {
    // create drawing context.
    ctx = canvasElement.getContext("2d");

    //Gathering canvas width and height.
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;

    //Grabbing audio tag.
    audioElement = document.querySelector('audio');

    //Setting up analyser node for visuals.
    analyserNode = analyserNodeRef;

    //Audio data being put inside of an array per sound.
    audioData = new Uint8Array(analyserNode.fftSize / drawParams.two);
}

function draw(params = {}) {

    //Checks if frequency or waveform of the data visualizer is checked.
    if (params.showWaveform) {
        analyserNode.getByteTimeDomainData(audioData);
    } else {
        analyserNode.getByteFrequencyData(audioData);
    }

    audioElement.addEventListener('pause', function() {
        n = 0, a = 0, c = 0, x1 = 0, y1 = 0;
    });

    //Checks if color modes are checked. If so it cycles through each mode through for loop.
    if (params.showModes) {
        ctx.save();
        for (let i = 0; i < modes.length; i++) {
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = modes[i];
        }
        utils.drawRectangle(ctx, drawParams.zero, drawParams.zero, canvasWidth, canvasHeight);
        ctx.restore();
    }

    //If tint is checked, users can create there own tint using the scrollers for the R,G,B values
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

        utils.drawRectangle(ctx, drawParams.zero, drawParams.zero, canvasWidth, canvasHeight, utils.makeColor(red, green, blue, 1))
        ctx.restore();
    }

    //Changes the color of each shape created to the frequency of the sound
    //https://medium.com/@gg_gina/how-to-music-visualizer-web-audio-api-aa007f4ea525
    for (let x = 0; x < audioData.length; x++) {
        if (audioData[x] > 210) {
            r = 10;
            g = 10;
            b = 255;
        } else if (audioData[x] > 200) {
            r = 255;
            g = 255;
            b = 0;
        } else if (audioData[x] > 190) {
            r = 204;
            g = 255;
            b = 0;
        } else if (audioData[x] > 180) {
            r = 0;
            g = 0;
            b = 255;
        } else if (audioData[x] > 130) {
            r = 252;
            g = 175;
            b = 60;
        } else if (audioData[x] > 90) {
            r = 60;
            g = 252;
            b = 73;
        } else if (audioData[x] > 50) {
            r = 207;
            g = 60;
            b = 252;
        } else {
            r = 150;
            g = 150;
            b = 255;
        }

        //Creating phyllotaxis that changes colors to the frequency and grows as the song continues. Else if its unchecked it resets all values.
        if (params.showPhyllotaxis) {
            ctx.save();

            n += .1;
            c = audioData[x] / canvasHeight;
            a = n * drawParams.Div1 * (Math.PI / drawParams.twoHundred - 20);
            r1 = c * Math.sqrt(n);

            x1 = r1 * Math.cos(a) + canvasWidth / drawParams.two;
            y1 = r1 * Math.sin(a) + canvasHeight / drawParams.two;

            ctx.globalAlpha = 1;

            utils.drawCircle(ctx, x1 + drawParams.twoHundredTen - x, y1 + drawParams.ten - x, drawParams.ten, `rgb(${r},${g},${b})`);
            utils.drawRectangle(ctx, x1 + drawParams.twoHundredTen + x, y1 + drawParams.ten + x, drawParams.twenty, drawParams.twenty, `rgb(${r},${g},${b})`);
            utils.drawCircle(ctx, x1 + drawParams.twoHundredTen + x, y1 + drawParams.ten - x, drawParams.ten, `rgb(${r},${g},${b})`);
            utils.drawRectangle(ctx, x1 + drawParams.twoHundredTen - x, y1 + drawParams.ten + x, drawParams.twenty, drawParams.twenty, `rgb(${r},${g},${b})`);

            utils.drawRectangle(ctx, x1 - drawParams.twoHundred - x, y1 - x, drawParams.twenty, drawParams.twenty, `rgb(${r},${g},${b})`);
            utils.drawCircle(ctx, x1 - drawParams.twoHundred + x, y1 + x, drawParams.ten, `rgb(${r},${g},${b})`);
            utils.drawRectangle(ctx, x1 - drawParams.twoHundred + x, y1 - x, drawParams.twenty, drawParams.twenty, `rgb(${r},${g},${b})`);
            utils.drawCircle(ctx, x1 - drawParams.twoHundred - x, y1 + x, drawParams.ten, `rgb(${r},${g},${b})`);

            ctx.restore();
        } else if (params.showPhyllotaxis == false) {
            n = 0, a = 0, c = 0, x1 = 0, y1 = 0;
        }

        //If gradient is checked and waveform, create a gradient that moves with the tone of the frequency.
        if (params.showGradientBackground && params.showWaveform) {
            ctx.save();
            gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: 0, color: utils.makeColor(r, g, b, 1) }, { percent: .25, color: utils.makeColor(r, g, b, 1) }, { percent: .5, color: utils.makeColor(r, g, b, 1) }]);
            ctx.globalAlpha = .01;
            ctx.fillStyle = gradient;
            utils.drawRectangle(ctx, drawParams.zero, drawParams.zero, canvasWidth, canvasHeight);
            ctx.restore();
        } else if (params.showGradientBackground) {
            ctx.save();
            gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: 0, color: utils.getRandomColor() }, { percent: .25, color: utils.getRandomColor() }, { percent: .5, color: utils.getRandomColor() }, { percent: .75, color: utils.getRandomColor() }, { percent: 1, color: utils.getRandomColor() }]);
            ctx.fillStyle = gradient;
            ctx.globalAlpha = .02;
            utils.drawRectangle(ctx, drawParams.zero, drawParams.zero, canvasWidth, canvasHeight);
            ctx.restore();
        }

        //Create a quadratic curve if checked that moves to the beat of the frequency and changes colors.
        if (params.showQuadraticCurve) {
            ctx.save();
            let averageLoudness = 0;
            let range = canvasHeight;
            averageLoudness += audioData[x] / canvasHeight / drawParams.two;
            averageLoudness /= utils.getRandom(0, 255) + averageLoudness;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 1;
            utils.drawQuadraticCurve(ctx, canvasWidth / 4, range * averageLoudness * drawParams.two, canvasWidth / drawParams.two, range * averageLoudness / drawParams.two, canvasWidth / drawParams.two, canvasHeight - drawParams.fourHundred, `rgb(${r},${g},${b})`);
            utils.drawQuadraticCurve(ctx, canvasWidth - drawParams.oneHundredNinty, range * averageLoudness * drawParams.two, canvasWidth / drawParams.two, range * averageLoudness / drawParams.two, canvasWidth / drawParams.two, canvasHeight - drawParams.fourHundred, `rgb(${r},${g},${b})`);
            utils.drawQuadraticCurve(ctx, canvasWidth, range * averageLoudness * drawParams.two, canvasWidth / drawParams.two, range * averageLoudness * drawParams.two, canvasWidth + drawParams.twenty, canvasHeight - drawParams.fourHundred + 15, `rgb(${r},${g},${b})`);
            utils.drawQuadraticCurve(ctx, canvasWidth - drawParams.eightHundred, range * averageLoudness * drawParams.two, canvasWidth / drawParams.two, range * averageLoudness * drawParams.two, canvasWidth - drawParams.eightHundred - 15, canvasHeight - drawParams.fourHundred + 15, `rgb(${r},${g},${b})`);
            ctx.restore();
        }

        //Rectangle display that shoots out squares based on the frequency of the sound, the circles are there to replicate speakers.
        if (params.showRectangleBarDisplay) {
            ctx.save();
            let center_x = canvasWidth / drawParams.two - drawParams.twoHundred;
            let center_y = canvasHeight / drawParams.two;
            let center_x2 = canvasWidth / drawParams.two + drawParams.twoHundred;

            let radius = utils.getRandom(50, 250);
            let maxRadius = canvasHeight / drawParams.two + 1;
            let percent = audioData[x] / 255;
            let rads = Math.PI * drawParams.ten + audioData[x];

            let rectX1 = center_x + Math.cos(rads * x) * (radius);
            let rectX2 = center_x2 + Math.cos(rads * x) * (radius);
            let rectY = center_y + Math.sin(rads * x) * (radius);

            let circleRadius = percent * maxRadius;

            ctx.globalAlpha = .2;
            ctx.lineWidth = 1;
            utils.drawRectangle(ctx, rectX1, rectY, drawParams.twenty, drawParams.twenty, `rgb(${r},${g},${b})`);
            utils.drawRectangle(ctx, rectX2, rectY, drawParams.twenty, drawParams.twenty, `rgb(${r},${g},${b})`);

            ctx.globalAlpha = .2;
            ctx.rotate(-.01 * drawParams.two);
            utils.drawCircleOutlines(ctx, canvasWidth / drawParams.two - drawParams.oneHundredNinty - x, canvasHeight / drawParams.two + drawParams.ten, circleRadius, `rgb(${r},${g},${b})`);

            ctx.globalAlpha = .2;

            utils.drawCircleOutlines(ctx, canvasWidth / drawParams.two - drawParams.oneHundredNinty - x, canvasHeight / drawParams.two + drawParams.ten, circleRadius * drawParams.onePointFive, `rgb(${r},${g},${b})`);

            ctx.globalAlpha = .2;

            utils.drawCircleOutlines(ctx, canvasWidth / drawParams.two - drawParams.oneHundredNinty - x, canvasHeight / drawParams.two + drawParams.ten, circleRadius * drawParams.pointFive, `rgb(${r},${g},${b})`);

            ctx.globalAlpha = .2;

            utils.drawCircleOutlines(ctx, canvasWidth / drawParams.two + drawParams.twoHundredTen - x, canvasHeight / drawParams.two + drawParams.ten, circleRadius, `rgb(${r},${g},${b})`);

            ctx.globalAlpha = .2;

            utils.drawCircleOutlines(ctx, canvasWidth / drawParams.two + drawParams.twoHundredTen - x, canvasHeight / drawParams.two + drawParams.ten, circleRadius * drawParams.onePointFive, `rgb(${r},${g},${b})`);

            ctx.globalAlpha = .2;

            utils.drawCircleOutlines(ctx, canvasWidth / drawParams.two + drawParams.twoHundredTen - x, canvasHeight / drawParams.two + drawParams.ten, circleRadius * drawParams.pointFive, `rgb(${r},${g},${b})`);


            ctx.restore();
        }

        //If the circle background is checked, a circle display moves with the audio data and changes colors accordingly.
        if (params.showCircleBackground) {
            ctx.save();

            let maxRadius = canvasHeight / 20;

            utils.drawCircle(ctx, canvasWidth / drawParams.two - audioData[x] - drawParams.twoHundred, canvasHeight - x - drawParams.twoHundred, maxRadius, `rgb(${r},${g},${b})`);

            utils.drawCircle(ctx, canvasWidth / drawParams.two + audioData[x] + drawParams.twoHundred, canvasHeight - x - drawParams.twoHundred, maxRadius, `rgb(${r},${g},${b})`);

            utils.drawCircle(ctx, canvasWidth / drawParams.two - audioData[x] - drawParams.twoHundred, x, maxRadius, `rgb(${r},${g},${b})`);

            utils.drawCircle(ctx, canvasWidth / drawParams.two + audioData[x] + drawParams.twoHundred, x, maxRadius, `rgb(${r},${g},${b})`);

            utils.drawCircle(ctx, canvasWidth / drawParams.two - audioData[x] + drawParams.twoHundred, canvasHeight / drawParams.two - x, maxRadius, `rgb(${r},${g},${b})`);

            utils.drawCircle(ctx, canvasWidth / drawParams.two + audioData[x] - drawParams.twoHundred, canvasHeight / drawParams.two - x, maxRadius, `rgb(${r},${g},${b})`);

            utils.drawCircle(ctx, canvasWidth / drawParams.two - audioData[x] + drawParams.twoHundred, x, maxRadius, `rgb(${r},${g},${b})`);

            utils.drawCircle(ctx, canvasWidth / drawParams.two + audioData[x] - drawParams.twoHundred, x, maxRadius, `rgb(${r},${g},${b})`);

            ctx.restore();
        }

        //Line background is automatically checked, creates the colors in the background that change according to frequency.
        if (params.showLineBackground) {
            ctx.save();
            let width = canvasWidth / audioData.length;
            let height = canvasHeight / audioData.length;

            let rads = Math.PI * drawParams.two / canvasWidth;

            let lineX1 = canvasWidth / drawParams.twentyFive + rads * x * (drawParams.oneThousandFiveHundred);
            let lineY1 = canvasHeight / drawParams.twentyFive + rads * x * (drawParams.oneThousandFiveHundred);
            let x_end = canvasWidth / drawParams.twentyFive + rads * x * (drawParams.oneThousandFiveHundred + width);
            let y_end = canvasHeight / drawParams.twentyFive + rads * x * (drawParams.oneThousandFiveHundred + height);

            ctx.globalAlpha = 0.1;
            ctx.lineWidth = 1500;
            utils.drawLine(ctx, lineX1 - drawParams.ten, lineY1 - drawParams.ten, x_end, y_end, `rgb(${r},${g},${b})`);
            ctx.restore();
        }


        //Circle Display that shows bars along the circle with colors to the frequency
        //https://www.kkhaydarov.com/audio-visualizer/
        if (params.showCircleBarDisplay) {
            ctx.save();
            let bars = 118
            let center_x = canvasWidth / drawParams.two;
            let center_y = canvasHeight / drawParams.two;
            let radius = 75;

            utils.drawCircle(ctx, center_x, center_y, radius, `rgb(${r},${g},${b})`);

            let barHeight = audioData[x];
            let rads = Math.PI * 2 / bars;

            let bar_width = (canvasWidth / audioData.length);

            x1 = center_x + Math.cos(rads * x) * (radius);
            let y = center_y + Math.sin(rads * x) * (radius);
            let x_end = center_x + Math.cos(rads * x) * (radius + barHeight);
            let y_end = center_y + Math.sin(rads * x) * (radius + barHeight);

            let maxRadius = canvasHeight / drawParams.four;
            let percent = audioData[x] / 255;
            let circleRadius = percent * maxRadius;

            ctx.globalAlpha = 1;
            ctx.lineWidth = bar_width;
            utils.drawLine(ctx, x1, y, x_end, y_end, `rgb(${r},${g},${b})`);

            x1 += bar_width + drawParams.five;

            utils.drawCircle(ctx, canvasWidth / drawParams.two, canvasHeight / drawParams.two, circleRadius, `rgb(${r},${g},${b})`);

            utils.drawCircle(ctx, canvasWidth / drawParams.two, canvasHeight / drawParams.two, circleRadius * drawParams.onePointFive, `rgb(${r},${g},${b})`);

            utils.drawCircle(ctx, canvasWidth / drawParams.two, canvasHeight / drawParams.two, circleRadius * drawParams.pointFive, `rgb(${r},${g},${b})`);

            ctx.restore();
        }
    }

    //Default display, changes colors and height according to the audio data
    if (params.showBarDisplay) {
        ctx.save();
        let barWidth = (canvasWidth / audioData.length);
        let barHeight;
        x1 = 0;


        let bars = 200;

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


            ctx.globalAlpha = 1;
            utils.drawRectangle(ctx, x1, (canvasHeight - barHeight), barWidth, barHeight, `rgb(${r},${g},${b})`);

            x1 += barWidth + drawParams.five;
        }
        ctx.restore();
    }

    //Creates image filter based on the frequency of the audio data, which changes the filter colors accordingly.
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    for (let i = 0; i < length; i++) {
        if (data[i] > 210) {
            r = 10;
            g = 10;
            b = 255;
        } else if (data[i] > 200) {
            r = 255;
            g = 255;
            b = 0;
        } else if (data[i] > 190) {
            r = 204;
            g = 255;
            b = 0;
        } else if (data[i] > 180) {
            r = 0;
            g = 0;
            b = 255;
        } else if (data[i] > 130) {
            r = 252;
            g = 175;
            b = 60;
        } else if (data[i] > 90) {
            r = 60;
            g = 252;
            b = 73;
        } else if (data[i] > 50) {
            r = 207;
            g = 60;
            b = 252;
        } else {
            r = 150;
            g = 150;
            b = 255;
        }
    }

    ctx.save();
    for (let i = 0; i < length; i += 4) {
        if (params.showNoise && Math.random() < .1) {
            data[i + r] = data[i + 1 + g] = data[i + 2 + b] = utils.getRandom(0, 255);
            data[i + 1 + g] = 255;

        }
        if (params.showInvert) {
            let red = data[i],
                green = data[i + 1],
                blue = data[i + 2];
            data[i] = 200 - red + r;
            data[i + 1] = red - green + g;
            data[i + 2] = green - blue + b;
        }
    }
    ctx.restore();

    ctx.save();
    for (let i = 0; i < length; i++) {
        if (params.showEmboss) {
            if (i % 4 == 3 || i % 3 == 2) continue;
            data[i] = data[i + 2 + r] - data[i + 4 + g] - data[i + width * 4 + b]
        }
    }
    ctx.restore();

    if (params.showSepia) {
        ctx.save();
        for (let i = 0; i < length; i += 4) {
            let r2 = data[i];
            let g2 = data[i + 1];
            let b2 = data[i + 2];
            let a = data[i + 3];
            data[i + r] = (r2 * .671) + (g2 * .769 + g) + (b2 * .189 - a);
            data[i + g] = (r2 * .349) + (g2 * .686 - a) + (b2 * .531);
            data[i + b] = (r2 * .272) + (g2 * .5) + (b2 * .131 - a);
            data[i + 3] = (r2 * .272) + (g2) + (b2 * .131 - a);
        }
        ctx.globalAlpha = 0.4;
        ctx.restore();
    }

    if (params.showShiftRGB) {
        ctx.save();
        for (let i = 0; i < length; i += 4) {
            let red = data[i],
                green = data[i + 1],
                blue = data[i + 2];
            data[i + r] = green;
            data[i + 1 - g] = blue;
            data[i + 2 - b] = red;
        }
        ctx.restore();
    }
    ctx.putImageData(imageData, 0, 0);
}

export { setupCanvas, draw };