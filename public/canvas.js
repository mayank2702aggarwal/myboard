let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth; //value is in px
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");


let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoRedoTracker = []; //data 
let track = 0; //represent , which data we want to display, from tracker array

let mouseDown = false;

//API
let tool = canvas.getContext('2d'); //we can say this tool is a api with the help of this we will perform our graphics tasks

tool.strokeStyle = penColor; //cahnge color
tool.lineWidth = penWidth; //increase thickness on drawed line

//mousedown -> start new path, mousemove -> path fill(graphics)
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    beginPath({
        x: e.clientX,
        y: e.clientY
    })
})
canvas.addEventListener("mousemove", (e) => {
    if (mouseDown)
        drawStroke({
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth,
        });

})
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    //for undo-redo
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
})

undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    // perform action
    let trackObj = {
        trackValue: track,
        undoRedoTracker,
    }
    undoRedoCanvas(trackObj);
})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) track++;
    //action
    let trackObj = {
        trackValue: track,
        undoRedoTracker,
    }
    undoRedoCanvas(trackObj);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); //new image refrence is created
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

}

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y); //clientX is the X axis(horizontal) point where our mouse is down
}

function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;

    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}


pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})
eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

// //socket
// //listner on m computer
// socket.on("beginPath", (data) => {
//     //data -> data from server
//     beginPath(data);
// })
// socket.on("drawStroke", (data) => {
//     drawStroke(data);
// })
// socket.on("redoUndo", (data) => {
//     undoRedoCanvas(data);
// })