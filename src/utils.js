//Utility functions for random numbers, colors, gradients, and specific shape types
const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};

const getRandomColor = () => {
    const floor = 35;
    const getByte = () => getRandom(floor, 255 - floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
    let lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
};

const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
};

const drawRectangle = (ctx, x, y, width, height, color) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};

const drawRectangleOutlines = (ctx, x, y, x2, y2, color) => {

    ctx.save();
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, x2, y2);
    ctx.restore();
};

const drawCircleOutlines = (ctx, x, y, radius, color) => {

    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
};

const drawCircle = (ctx, x, y, radius, color) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};

const drawLine = (ctx, mX, mY, mX2, mY2, color) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(mX, mY);
    ctx.lineTo(mX2, mY2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

const drawQuadraticCurve = (ctx, x, y, x2, y2, width, height, color) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x2, y2, width, height);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

export { makeColor, getRandom, getRandomColor, getLinearGradient, drawQuadraticCurve, drawRectangleOutlines, drawCircleOutlines, drawCircle, drawLine, drawRectangle, goFullscreen };