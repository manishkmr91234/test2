document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const eraserButton = document.getElementById('eraserButton');
    const clearButton = document.getElementById('clearButton');
    const undoButton = document.getElementById('undoButton');

    let drawing = false;
    let currentColor = colorPicker.value;
    let currentSize = brushSize.value;
    let isEraser = false;
    let history = [];

    // Set up canvas dimensions
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 200;

    function startDrawing(e) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        saveState();
    }

    function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = isEraser ? '#ffffff' : currentColor;
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
    }

    function stopDrawing() {
        drawing = false;
        ctx.closePath();
    }

    function saveState() {
        if (history.length > 10) {
            history.shift();
        }
        history.push(canvas.toDataURL());
    }

    function undoDrawing() {
        if (history.length > 0) {
            const lastState = history.pop();
            const img = new Image();
            img.src = lastState;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }

    colorPicker.addEventListener('input', () => {
        currentColor = colorPicker.value;
        isEraser = false;
    });

    brushSize.addEventListener('input', () => {
        currentSize = brushSize.value;
    });

    eraserButton.addEventListener('click', () => {
        isEraser = true;
    });

    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        history = [];
    });

    undoButton.addEventListener('click', undoDrawing);

    // Handle drawing on the canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Save initial state
    saveState();
});
