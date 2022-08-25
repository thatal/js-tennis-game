var canvas;
var canvasContext
var leftPaddleDetails = {
    initialXAxis: 0,
    initialYAxis: 250,
}
var rightPaddleDetails = {
    initialXAxis: 0,
    initialYAxis: 250,
}
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
var showingWinScreen = false;
window.onload = function () {
    console.log("window.onload  loaded.");
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    let framesPerSecond = 30;
    setInterval(moveAndDraw, 1000 / framesPerSecond);
}
moveAndDraw = function () {
    moveEverything();
    drawEverything();
}
calculateMousePos = function (evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}
function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.clientWidth / 2;
    ballY = canvas.clientHeight / 2;
}
function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}
function computerMovement() {
    let paddleRightCenter = rightPaddleDetails.initialYAxis + (PADDLE_HEIGHT / 2)
    if (paddleRightCenter < ballY - 35) {
        rightPaddleDetails.initialYAxis += 6;
    } else if (paddleRightCenter > ballY + 35) {
        rightPaddleDetails.initialYAxis -= 6;
    }
}
moveEverything = function () {
    if (showingWinScreen) {
        return;
    }
    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballX < 0) {
        if (ballY > leftPaddleDetails.initialYAxis && ballY < (leftPaddleDetails.initialYAxis + PADDLE_HEIGHT)) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (leftPaddleDetails.initialYAxis + (PADDLE_HEIGHT / 2))
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++; //must be before ballReset
            ballReset();
        }
    }
    if (ballX > canvas.clientWidth) {
        if (ballY > rightPaddleDetails.initialYAxis && ballY < (rightPaddleDetails.initialYAxis + PADDLE_HEIGHT)) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (leftPaddleDetails.initialYAxis + (PADDLE_HEIGHT / 2))
            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score ++;
            ballReset();
        }
    }
    if (ballY > canvas.clientHeight) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
}
function drawNet(){
    for (let i = 0; i < canvas.clientHeight; i +=40) {
        colorRect(canvas.clientWidth/2, i, 2, 20, "white");
    }
}
drawEverything = function () {
    // blanks out the screen with black
    colorRect(0, 0, canvas.clientWidth, canvas.clientHeight, "black");
    if (showingWinScreen) {
        canvasContext.fillStyle = "white";
        canvasContext.font = "14px Verdana";
        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Left Player Won!", 350, 200);
        } else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Right Player Won!", 350, 200);
        }
        canvasContext.fillText("Click to continue", 350, 500);
        return;
    }
    drawNet();
    // left player paddle
    colorRect(leftPaddleDetails.initialXAxis, leftPaddleDetails.initialYAxis, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
    // computer paddle
    colorRect(canvas.clientWidth - PADDLE_THICKNESS, rightPaddleDetails.initialYAxis, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
    // draw the ball
    canvasContext.font = "30px Verdana";
    colorCircle(ballX, ballY, 10, "white");
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.clientWidth - 100, 100);
    canvas.addEventListener("mousedown", handleMouseClick);
    canvas.addEventListener("mousemove", function (evt) {
        var mousePos = calculateMousePos(evt);
        leftPaddleDetails.initialYAxis = mousePos.y - PADDLE_HEIGHT / 2;
    })
}
colorCircle = function (centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}
function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}