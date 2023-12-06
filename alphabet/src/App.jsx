import { useRef, useState } from "react";

import "./App.css";

const CanvasAction = {
  DRAWING: "DRAWING",
  IDLE: "IDLE",
};

const IdleMessage = "Draw on canvas";
const DrawingMessage = "Click submit once you are done";

function App() {
  const canvasRef = useRef();

  const [canvasAction, setCanvasAction] = useState(CanvasAction.IDLE);
  const [message, setMessage] = useState(IdleMessage);

  const canvasMouseDown = () => {
    setMessage(DrawingMessage);
    setCanvasAction(CanvasAction.DRAWING);
  };

  const canvasMouseMove = (event) => {
    if (canvasAction === CanvasAction.IDLE) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.f;

    ctx.lineTo(
      event.clientX - canvas.offsetLeft,
      event.clientY - canvas.offsetTop
    );
    ctx.stroke();
  };

  const canvasMouseUp = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setCanvasAction(CanvasAction.IDLE);
    ctx.stroke();
    ctx.beginPath();
  };

  const reset = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log("RESET");
    setMessage(IdleMessage);
  };

  const submitImage = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const myImageData = context
      .getImageData(0, 0, canvas.width, canvas.height)
      .data.filter((currentVal, index) => index % 4 == 3);
    console.log(myImageData);

    const cellSize = Math.floor(canvas.width / 28);
    const pooledImage = Array.from(Array(28), () => new Array(28));
    for (let i = 0; i < 28; i += 1) {
      for (let j = 0; j < 28; j += 1) {
        pooledImage[i][j] = 0;
      }
    }
    for (let i = 0; i < canvas.width; i += 1) {
      const pooledI = Math.floor(i / cellSize);
      for (let j = 0; j < canvas.height; j += 1) {
        const pooledJ = Math.floor(j / cellSize);
        const imageIndex = i * canvas.width + j;
        if (myImageData[imageIndex] > 0) {
          pooledImage[pooledI][pooledJ] += 1;
        }
      }
    }

    for (let i = 0; i < 28; i += 1) {
      for (let j = 0; j < 28; j += 1) {
        pooledImage[i][j] = Math.min(
          1,
          pooledImage[i][j] / (cellSize * cellSize * 0.8)
        );
      }
    }
    const data = pooledImage.map((e) => e.join(", ")).join("\n");
    console.log();

    const res = await fetch("http://localhost:8080/letter", {
      method: "POST",
      body: data,
    });
    const letter = await res.text();
    console.log(letter);
    setMessage(`The predicted letter is ${letter}`);
  };

  return (
    <>
      <p>{message}</p>
      <canvas
        ref={canvasRef}
        onMouseDown={canvasMouseDown}
        onMouseMove={canvasMouseMove}
        onMouseUp={canvasMouseUp}
        height={28 * 8}
        width={28 * 8}
        style={{ border: "1px solid red" }}
      ></canvas>
      <div>
        <button type="button" onClick={reset}>
          Reset
        </button>
        <button type="button" onClick={submitImage}>
          Submit
        </button>
      </div>
    </>
  );
}

export default App;
