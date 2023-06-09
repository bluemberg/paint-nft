import React, { useRef, useState, useEffect } from "react";
import { LazyBrush, Point } from "lazy-brush";
import { getCatenaryCurve, drawResult } from "catenary-curve";

interface MousePos {
  x: number;
  y: number;
}

interface Stroke {
  paths: MousePos[];
  strokeSize: number;
  strokeColor: string;
}

const Canvas = () => {
  const canvasBgRef = useRef<HTMLCanvasElement>(null);
  const canvasFgRef = useRef<HTMLCanvasElement>(null);

  const inputCanvasColorRef = useRef<HTMLInputElement>(null);
  const inputStrokeColorRef = useRef<HTMLInputElement>(null);
  const inputFillColorRef = useRef<HTMLInputElement>(null);
  const inputStrokeSizeRef = useRef<HTMLInputElement>(null);

  const buttonCanvasColorRef = useRef<HTMLButtonElement>(null);
  const buttonStrokeColorRef = useRef<HTMLButtonElement>(null);
  const buttonFillColorRef = useRef<HTMLButtonElement>(null);

  // states for drawing
  const [canvasBgContext, setCanvasBgContext] =
    useState<CanvasRenderingContext2D>();
  const [canvasBgRect, setCanvasBgRect] = useState<DOMRect>();
  const [canvasFgContext, setCanvasFgContext] =
    useState<CanvasRenderingContext2D>();
  const [canvasFgRect, setCanvasFgRect] = useState<DOMRect>();

  const [canvasColor, setCanvasColor] = useState<string>("white");
  const [strokeColor, setStrokeColor] = useState<string>("pink");
  const [fillColor, setFillColor] = useState<string>("white");
  const [strokeSize, setStrokeSize] = useState<number>(6);
  const [mode, setMode] = useState<string>("stroke"); // either stroke, erase, or shape

  const [lazyBrush, setLazyBrush] = useState<LazyBrush>();
  const [mousePos, setMousePos] = useState<MousePos>();
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  useEffect(() => {
    if (buttonCanvasColorRef.current) {
      buttonCanvasColorRef.current.style.backgroundColor = canvasColor;
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
    if (canvasBgRef.current) {
      const bgContext = canvasBgRef.current.getContext("2d");
      if (bgContext) {
        const bgRect = canvasBgRef.current.getBoundingClientRect();
        canvasBgRef.current.width = bgRect.width;
        canvasBgRef.current.height = (2 / 3) * bgRect.width;

        setCanvasBgContext(bgContext);
        setCanvasBgRect(bgRect);
      }
    }
  }, [canvasBgRef]);

  useEffect(() => {
    if (canvasFgRef.current) {
      const fgContext = canvasFgRef.current.getContext("2d");
      if (fgContext) {
        const fgRect = canvasFgRef.current.getBoundingClientRect();
        canvasFgRef.current.width = fgRect.width;
        canvasFgRef.current.height = (2 / 3) * fgRect.width;

        setCanvasFgContext(fgContext);
        setCanvasFgRect(fgRect);

        const lazyBrush = new LazyBrush({
          enabled: true,
          radius: 30,
          initialPoint: {
            x: 0,
            y: 0,
          },
        });
        setLazyBrush(lazyBrush);
      }
    }
  }, [canvasFgRef]);

  const onMouseMove = (event: React.MouseEvent) => {
    if (canvasFgRect && canvasBgRect) {
      setMousePos({
        x: event.clientX - canvasFgRect.left,
        y: event.clientY - canvasFgRect.top,
      });
    }
  };

  const onMouseDown = (event: React.MouseEvent) => {
    setIsMouseDown(true);
    if (canvasBgContext && mousePos) {
      canvasBgContext.beginPath();
      const brush = lazyBrush!.getBrushCoordinates();
      canvasBgContext.moveTo(brush.x, brush.y);
    }
  };

  const onMouseUp = (event: React.MouseEvent) => {
    setIsMouseDown(false);
    if (canvasBgContext) {
      canvasBgContext.closePath();
    }
  };

  const drawCursor = () => {
    const brush = lazyBrush!.getBrushCoordinates();
    canvasFgContext!.clearRect(
      0,
      0,
      canvasFgContext!.canvas.width,
      canvasFgContext!.canvas.height
    );

    canvasFgContext!.beginPath();
    canvasFgContext!.fillStyle = strokeColor;
    canvasFgContext!.arc(brush.x, brush.y, strokeSize, 0, Math.PI * 2, true);
    canvasFgContext!.fill();

    canvasFgContext!.beginPath();
    canvasFgContext!.fillStyle = "black";
    canvasFgContext!.arc(mousePos!.x, mousePos!.y, 4, 0, Math.PI * 2, true);
    canvasFgContext!.fill();

    canvasFgContext!.beginPath();
    const result = getCatenaryCurve(brush, mousePos!, lazyBrush!.radius);
    drawResult(result, canvasFgContext!);
    canvasFgContext!.stroke();
  };

  const draw = () => {};

  const update = () => {
    if (mousePos && lazyBrush && canvasFgContext && canvasBgContext) {
      lazyBrush.update(mousePos);

      drawCursor();

      if (isMouseDown && lazyBrush.brushHasMoved()) {
        const brush = lazyBrush!.getBrushCoordinates();
        canvasBgContext.lineCap = "round";
        canvasBgContext.lineJoin = "round";
        canvasBgContext.lineWidth = strokeSize;
        canvasBgContext.strokeStyle = strokeColor;
        canvasBgContext.lineTo(brush.x, brush.y);
        canvasBgContext.stroke();
      }
    }
  };

  useEffect(() => {
    update();
  }, [mousePos]);

  return (
    <>
      <div className="container py-2 my-2 mx-auto text-center">
        <div className="grid grid-cols-8 ">
          <div className="w-full border col-span-1 p-2 ">
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
                min={"6"}
                max={"24"}
                className="range"
                step="2"
                ref={inputStrokeSizeRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setStrokeSize(parseInt(event.target.value))
                }
              ></input>
            </div>
          </div>
          <div className="col-span-6 relative">
            <canvas
              className="border w-full absolute"
              ref={canvasBgRef}
            ></canvas>
            <canvas
              className="border w-full absolute cursor-none"
              ref={canvasFgRef}
              onMouseMove={onMouseMove}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
            ></canvas>
          </div>
          <div className="col-span-1 border"></div>
        </div>
      </div>
    </>
  );
};

export default Canvas;
