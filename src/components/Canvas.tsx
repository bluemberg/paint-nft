import React, { useRef, useState, useEffect } from "react";
import { LazyBrush, Point } from "lazy-brush";
import { getCatenaryCurve, drawResult } from "catenary-curve";

interface Stroke {
  points: Point[];
  strokeSize: number;
  strokeColor: string;
  type: string; // either stroke or erase
}

const Canvas = () => {
  /* 
  Canvases:
  1. canvasMain (what is actually saved and will be minted)
  2. canvasDraw (where all the strokes are drawn)
  3. canvasTemp (where currStroke is drawn)
  4. canvasCursor (where the cursor is drawn)
  */

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
  const [strokeColor, setStrokeColor] = useState<string>("slategray");
  const [fillColor, setFillColor] = useState<string>("lavender");
  const [strokeSize, setStrokeSize] = useState<number>(25);
  const [lazyRadius, setLazyRadius] = useState<number>(15);
  const [friction, setFriction] = useState<number>(0);
  const [mode, setMode] = useState<string>("stroke"); // either stroke, erase, or square (shape)

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
        changeCanvasBG();
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
        radius: lazyRadius,
        initialPoint: {
          x: 0,
          y: 0,
        },
      });
      setLazyBrush(lazyBrush);
      changeCanvasBG();
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
        strokeColor: mode === "stroke" ? strokeColor : canvasColor,
        type: mode,
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
      const tempCtx = canvasTempRef.current!.getContext("2d")!;
      tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
    }
  };

  const changeCanvasBG = () => {
    const mainCtx = canvasMainRef.current!.getContext("2d")!;
    mainCtx.fillStyle = canvasColor;
    mainCtx.fillRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);

    // redraw all strokes
    const drawCtx = canvasDrawRef.current!.getContext("2d")!;
    drawCtx.clearRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);

    for (let stroke of strokes) {
      if (stroke.type === "erase") {
        stroke.strokeColor = canvasColor;
      }
      drawStroke(stroke, drawCtx, false);
    }
  };

  const drawCursor = () => {
    const brush = lazyBrush!.getBrushCoordinates();
    const cursorCtx = canvasCursorRef.current!.getContext("2d")!;
    cursorCtx.clearRect(0, 0, cursorCtx.canvas.width, cursorCtx.canvas.height);

    cursorCtx.beginPath();
    cursorCtx.fillStyle = "black";
    cursorCtx.arc(brush.x, brush.y, strokeSize / 2, 0, Math.PI * 2, true);
    cursorCtx.fill();

    cursorCtx.beginPath();
    cursorCtx.fillStyle = mode === "stroke" ? strokeColor : canvasColor;
    cursorCtx.arc(brush.x, brush.y, strokeSize / 2 - 0.5, 0, Math.PI * 2, true);
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

  const drawStroke = (
    stroke: Stroke,
    context: CanvasRenderingContext2D,
    clear: boolean
  ) => {
    // Smoothing algorithm using quadratic curves
    // taken from: https://github.com/dulnan/lazy-brush/blob/master/demo/components/Scene.vue#L281
    if (stroke.points.length >= 2) {
      if (clear) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      }

      let p1 = stroke.points[0];
      let p2 = stroke.points[1];
      context.moveTo(p2.x, p2.y);
      context.beginPath();
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = stroke.strokeSize;
      context.strokeStyle = stroke.strokeColor;

      for (let i = 1; i < stroke.points.length; i++) {
        const midPoint = {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2,
        };
        context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = stroke.points[i];
        p2 = stroke.points[i + 1];
      }
      context.lineTo(p1.x, p1.y);
      context.stroke();
    }
  };

  const undo = () => {
    setCurrStroke(null);
    const drawCtx = canvasDrawRef.current!.getContext("2d")!;
    drawCtx.clearRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);

    for (let stroke of strokes.slice(0, -1)) {
      if (stroke.type === "erase") {
        stroke.strokeColor = canvasColor;
      }
      drawStroke(stroke, drawCtx, false);
    }

    setStrokes(strokes.slice(0, -1));
  };

  const clearCanvas = () => {
    setCurrStroke(null);
    setStrokes([]);
    const drawCtx = canvasDrawRef.current!.getContext("2d")!;
    drawCtx.clearRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);
  };

  const drawCurrStroke = () => {
    if (
      lazyBrush!.brushHasMoved() &&
      isMouseDown &&
      (mode === "stroke" || mode === "erase")
    ) {
      const brush = lazyBrush!.getBrushCoordinates();
      const tempCtx = canvasTempRef.current!.getContext("2d");
      if (currStroke && tempCtx) {
        setCurrStroke({
          ...currStroke,
          points: [...currStroke.points, brush],
        });

        drawStroke(currStroke, tempCtx, true);
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
          <div className="w-full col-span-1 p-2 select-none">
            <div className="my-3 ">
              <label className="block">Canvas Color</label>
              <button
                className="btn btn-circle btn-outline border"
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
                className="btn btn-circle btn-outline border"
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
            <div className="my-3 hidden">
              <label className="block">Fill Color</label>
              <button
                className="btn btn-circle btn-outline border"
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
                max={"50"}
                className="range range-primary"
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
                className="range range-secondary"
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
                min={"0.01"}
                max={"0.99"}
                className="range range-accent"
                step="0.01"
                ref={inputFrictionRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFriction(parseFloat(event.target.value))
                }
              ></input>
            </div>
          </div>
          <div className="col-span-8 relative">
            <canvas
              className="border w-full absolute cursor-pointer"
              ref={canvasMainRef}
            ></canvas>
            <canvas
              className="border w-full absolute cursor-pointer"
              ref={canvasDrawRef}
            ></canvas>
            <canvas
              className="border w-full absolute cursor-pointer"
              ref={canvasTempRef}
            ></canvas>
            <canvas
              className="border border-slate-300 w-full absolute cursor-pointer"
              ref={canvasCursorRef}
              onMouseMove={onMouseMove}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
            ></canvas>
          </div>
          <div className="col-span-1 select-none p-2">
            <div className="mt-3 mb-8">
              <div className="tooltip" data-tip="Paint">
                <button
                  className={
                    "btn btn-circle btn-outline" +
                    (mode === "stroke" ? " btn-active" : "")
                  }
                  onClick={() => setMode("stroke")}
                >
                  <span className="material-symbols-outlined">
                    format_paint
                  </span>
                </button>
              </div>
            </div>
            <div className="my-8">
              <div className="tooltip" data-tip="Erase">
                <button
                  className={
                    "btn btn-circle btn-outline" +
                    (mode === "erase" ? " btn-active" : "")
                  }
                  onClick={() => setMode("erase")}
                >
                  <span className="material-symbols-outlined">ink_eraser</span>
                </button>
              </div>
            </div>
            <div className="my-8 hidden">
              <div className="tooltip" data-tip="Square">
                <button
                  className={
                    "btn btn-circle btn-outline" +
                    (mode === "square" ? " btn-active" : "")
                  }
                  onClick={() => setMode("square")}
                >
                  <span className="material-symbols-outlined">square</span>
                </button>
              </div>
            </div>
            <div className="my-8">
              <button className="btn btn-primary" onClick={() => undo()}>
                Undo
              </button>
            </div>
            <div className="my-8">
              <button
                className="btn btn-secondary"
                onClick={() => clearCanvas()}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Canvas;
