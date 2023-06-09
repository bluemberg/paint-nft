import React, { useRef, useState, useEffect } from "react";
import { LazyBrush, Point } from "lazy-brush";
import { getCatenaryCurve, drawResult } from "catenary-curve";

interface Stroke {
  points: Point[];
  strokeSize: number;
  strokeColor: string;
}

const Canvas = () => {
  // canvases:
  // 1. canvasMain (what is actually saved; before saving, set BG color, then transfer canvasDraw to this, afterwards, set remove alldrawings then set BG color)
  // 2. canvasDraw (what is actually saved)
  // 3. canvasTemp (where currStroke is drawn)
  // 4. canvasCursor (where the cursor is drawn)

  const canvasMainRef = useRef<HTMLCanvasElement>(null);
  const canvasDrawRef = useRef<HTMLCanvasElement>(null);
  const canvasTempRef = useRef<HTMLCanvasElement>(null);
  const canvasCursorRef = useRef<HTMLCanvasElement>(null);

  const canvasesRef = [
    canvasMainRef,
    canvasDrawRef,
    canvasTempRef,
    canvasCursorRef,
  ];

  const inputCanvasColorRef = useRef<HTMLInputElement>(null);
  const inputStrokeColorRef = useRef<HTMLInputElement>(null);
  const inputFillColorRef = useRef<HTMLInputElement>(null);
  const inputStrokeSizeRef = useRef<HTMLInputElement>(null);
  const inputLazyRadiusRef = useRef<HTMLInputElement>(null);
  const inputFrictionRef = useRef<HTMLInputElement>(null);

  const buttonCanvasColorRef = useRef<HTMLButtonElement>(null);
  const buttonStrokeColorRef = useRef<HTMLButtonElement>(null);
  const buttonFillColorRef = useRef<HTMLButtonElement>(null);

  const [canvasColor, setCanvasColor] = useState<string>("white");
  const [strokeColor, setStrokeColor] = useState<string>("pink");
  const [fillColor, setFillColor] = useState<string>("white");
  const [strokeSize, setStrokeSize] = useState<number>(15);
  const [lazyRadius, setLazyRadius] = useState<number>(1);
  const [friction, setFriction] = useState<number>(0);
  const [mode, setMode] = useState<string>("stroke"); // either stroke, erase, or shape

  const [lazyBrush, setLazyBrush] = useState<LazyBrush>();
  const [mousePos, setMousePos] = useState<Point>();
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currStroke, setCurrStroke] = useState<Stroke | null>(null);

  const [canvasesReady, setCanvasesReady] = useState<boolean>(false);

  useEffect(() => {
    if (buttonCanvasColorRef.current) {
      buttonCanvasColorRef.current.style.backgroundColor = canvasColor;
      if (canvasesReady) {
        const mainCtx = canvasMainRef.current!.getContext("2d");
        mainCtx!.fillStyle = canvasColor;
        mainCtx!.fillRect(
          0,
          0,
          canvasMainRef.current!.width,
          canvasMainRef.current!.height
        );
      }
    }
  }, [canvasColor]);

  useEffect(() => {
    if (buttonStrokeColorRef.current) {
      buttonStrokeColorRef.current.style.backgroundColor = strokeColor;
    }
  }, [strokeColor]);

  useEffect(() => {
    if (buttonFillColorRef.current) {
      buttonFillColorRef.current.style.backgroundColor = fillColor;
    }
  }, [fillColor]);

  useEffect(() => {
    if (inputStrokeSizeRef.current) {
      inputStrokeSizeRef.current.value = strokeSize.toString();
    }
  }, [strokeSize]);

  useEffect(() => {
    if (inputLazyRadiusRef.current) {
      inputLazyRadiusRef.current.value = lazyRadius.toString();
      if (lazyBrush) {
        lazyBrush!.setRadius(lazyRadius);
      }
    }
  }, [lazyRadius]);

  useEffect(() => {
    if (inputFrictionRef.current) {
      inputFrictionRef.current.value = friction.toString();
    }
  }, [friction]);

  useEffect(() => {
    if (canvasesRef.every((canvasRef) => canvasRef.current)) {
      for (let canvasRef of canvasesRef) {
        const rect = canvasRef.current?.getBoundingClientRect();
        canvasRef.current!.width = rect?.width || 0;
        canvasRef.current!.height = (4 / 5) * (rect?.width || 0);
      }
      setCanvasesReady(true);
      const lazyBrush = new LazyBrush({
        enabled: true,
        radius: 10,
        initialPoint: {
          x: 0,
          y: 0,
        },
      });
      setLazyBrush(lazyBrush);
    }
  }, canvasesRef);

  const onMouseMove = (event: React.MouseEvent) => {
    if (canvasesReady) {
      const rect = canvasCursorRef.current!.getBoundingClientRect();
      setMousePos({
        x: event.clientX - rect!.left,
        y: event.clientY - rect!.top,
      });
    }
  };

  const onMouseDown = (event: React.MouseEvent) => {
    setIsMouseDown(true);
    if (canvasesReady && mousePos && lazyBrush) {
      const brush = lazyBrush.getBrushCoordinates();
      setCurrStroke({
        points: [brush],
        strokeSize: strokeSize,
        strokeColor: strokeColor,
      });
    }
  };

  const onMouseUp = (event: React.MouseEvent) => {
    setIsMouseDown(false);
    if (canvasesReady && mousePos && currStroke) {
      setStrokes([...strokes, currStroke]);
      setCurrStroke(null);
      const drawCtx = canvasDrawRef.current!.getContext("2d")!;
      drawCtx.drawImage(canvasTempRef.current!, 0, 0);
    }
  };

  const drawCursor = () => {
    const brush = lazyBrush!.getBrushCoordinates();
    const cursorCtx = canvasCursorRef.current!.getContext("2d")!;
    cursorCtx.clearRect(
      0,
      0,
      canvasCursorRef.current!.width,
      canvasCursorRef.current!.height
    );

    cursorCtx.beginPath();
    cursorCtx.fillStyle = strokeColor;
    cursorCtx.arc(brush.x, brush.y, strokeSize / 2, 0, Math.PI * 2, true);
    cursorCtx.fill();

    cursorCtx.beginPath();
    cursorCtx.fillStyle = "black";
    cursorCtx.arc(mousePos!.x, mousePos!.y, 4, 0, Math.PI * 2, true);
    cursorCtx.fill();

    cursorCtx.beginPath();
    const result = getCatenaryCurve(brush, mousePos!, lazyBrush!.radius);
    drawResult(result, cursorCtx!);
    cursorCtx.stroke();
  };

  const drawCurrStroke = () => {
    if (lazyBrush!.brushHasMoved() && isMouseDown) {
      const brush = lazyBrush!.getBrushCoordinates();
      const tempCtx = canvasTempRef.current!.getContext("2d");
      if (currStroke && tempCtx) {
        setCurrStroke({
          ...currStroke,
          points: [...currStroke.points, brush],
        });
        tempCtx.lineCap = "round";
        tempCtx.lineJoin = "round";
        tempCtx.lineWidth = currStroke.strokeSize;
        tempCtx.strokeStyle = currStroke.strokeColor;

        // Smoothing algorithm using quadratic curves
        // taken from: https://github.com/dulnan/lazy-brush/blob/master/demo/components/Scene.vue#L281
        if (currStroke.points.length >= 2) {
          tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
          let p1 = currStroke.points[0];
          let p2 = currStroke.points[1];
          tempCtx.moveTo(p2.x, p2.y);
          tempCtx.beginPath();
          for (let i = 1, len = currStroke.points.length; i < len; i++) {
            const midPoint = {
              x: (p1.x + p2.x) / 2,
              y: (p1.y + p2.y) / 2,
            };
            tempCtx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            p1 = currStroke.points[i];
            p2 = currStroke.points[i + 1];
          }
          tempCtx.lineTo(p1.x, p1.y);
          tempCtx.stroke();
        }
      }
    }
  };

  const update = () => {
    if (mousePos && lazyBrush && canvasesReady) {
      lazyBrush.update(mousePos, { friction: friction });
      drawCursor();
      drawCurrStroke();
    }
  };

  useEffect(() => {
    update();
  }, [mousePos]);

  return (
    <>
      <div className="container py-2 my-2 mx-auto text-center">
        <div className="grid grid-cols-10 ">
          <div className="w-full border col-span-1 p-2 select-none">
            <div className="my-3 ">
              <label className="block">Canvas Color</label>
              <button
                className="btn btn-circle border"
                onClick={() => {
                  inputCanvasColorRef.current?.click();
                }}
                ref={buttonCanvasColorRef}
              >
                <input
                  type="color"
                  className="invisible"
                  ref={inputCanvasColorRef}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setCanvasColor(event.target.value)
                  }
                ></input>
              </button>
            </div>
            <div className="my-3">
              <label className="block">Stroke Color</label>
              <button
                className="btn btn-circle border"
                onClick={() => {
                  inputStrokeColorRef.current?.click();
                }}
                ref={buttonStrokeColorRef}
              >
                <input
                  type="color"
                  className="invisible"
                  ref={inputStrokeColorRef}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setStrokeColor(event.target.value)
                  }
                ></input>
              </button>
            </div>
            <div className="my-3">
              <label className="block">Fill Color</label>
              <button
                className="btn btn-circle border"
                onClick={() => {
                  inputFillColorRef.current?.click();
                }}
                ref={buttonFillColorRef}
              >
                <input
                  type="color"
                  className="invisible"
                  ref={inputFillColorRef}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFillColor(event.target.value)
                  }
                ></input>
              </button>
            </div>
            <div className="my-3">
              <label className="block">Stroke Size</label>
              <input
                type="range"
                min={"4"}
                max={"30"}
                className="range"
                step="1"
                ref={inputStrokeSizeRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setStrokeSize(parseInt(event.target.value))
                }
              ></input>
            </div>
            <div className="my-3">
              <label className="block">Lazy Radius</label>
              <input
                type="range"
                min={"1"}
                max={"60"}
                className="range"
                step="1"
                ref={inputLazyRadiusRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setLazyRadius(parseInt(event.target.value))
                }
              ></input>
            </div>
            <div className="my-3">
              <label className="block">Friction</label>
              <input
                type="range"
                min={"0"}
                max={"1"}
                className="range"
                step="0.05"
                ref={inputFrictionRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFriction(parseFloat(event.target.value))
                }
              ></input>
            </div>
          </div>
          <div className="col-span-8 relative">
            <canvas
              className="border w-full absolute"
              ref={canvasMainRef}
            ></canvas>
            <canvas
              className="border w-full absolute"
              ref={canvasDrawRef}
            ></canvas>
            <canvas
              className="border w-full absolute"
              ref={canvasTempRef}
            ></canvas>
            <canvas
              className="border w-full absolute"
              ref={canvasCursorRef}
              onMouseMove={onMouseMove}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
            ></canvas>
          </div>
          <div className="col-span-1 border select-none"></div>
        </div>
      </div>
    </>
  );
};

export default Canvas;
