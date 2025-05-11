
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, PencilLine, Undo2, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface DrawingCanvasProps {
  onSave: (file: File) => void;
  width?: number;
  height?: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  onSave, 
  width = 400, 
  height = 400 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        setContext(ctx);
        
        // Save initial blank canvas
        const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialState]);
        setHistoryIndex(0);
      }
    }
  }, []);
  
  // Update context when color or brush size changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      context.lineWidth = brushSize;
    }
  }, [color, brushSize, context, tool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !context) return;
    
    setIsDrawing(true);
    
    // Get position
    let x, y;
    if ('touches' in e) {
      const rect = canvasRef.current.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !context) return;
    
    let x, y;
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling when drawing
      const rect = canvasRef.current.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    context.lineTo(x, y);
    context.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing || !canvasRef.current || !context) return;
    
    context.closePath();
    setIsDrawing(false);
    
    // Save state to history
    const canvas = canvasRef.current;
    const newState = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // If we're not at the end of the history, truncate it
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newState]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0 && canvasRef.current && context) {
      const newIndex = historyIndex - 1;
      const imageData = history[newIndex];
      context.putImageData(imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const handleClear = () => {
    if (canvasRef.current && context) {
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Save the cleared state
      const clearedState = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHistory([...history, clearedState]);
      setHistoryIndex(history.length);
    }
  };

  const handleSave = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "drawing.png", { type: "image/png" });
          onSave(file);
        }
      }, "image/png");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between items-center mb-2">
        <div className="flex space-x-2">
          <Button 
            variant={tool === "pencil" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setTool("pencil")}
          >
            <PencilLine className="h-4 w-4 mr-1" /> Pencil
          </Button>
          <Button 
            variant={tool === "eraser" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setTool("eraser")}
          >
            <Eraser className="h-4 w-4 mr-1" /> Eraser
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleUndo}>
            <Undo2 className="h-4 w-4 mr-1" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <RotateCcw className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 items-center">
        <label htmlFor="brushSize" className="text-sm">Brush Size:</label>
        <Slider
          id="brushSize"
          min={1}
          max={30}
          step={1}
          value={[brushSize]}
          onValueChange={(value) => setBrushSize(value[0])}
          className="w-[100px]"
        />
        <span className="text-sm">{brushSize}px</span>
        
        {tool === "pencil" && (
          <>
            <label htmlFor="colorPicker" className="text-sm ml-4">Color:</label>
            <input
              type="color"
              id="colorPicker"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded-md cursor-pointer"
            />
          </>
        )}
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          style={{ 
            backgroundColor: "white", 
            touchAction: "none",
            width: "100%",
            height: "auto",
          }}
          className="cursor-crosshair"
        />
      </div>
      
      <Button onClick={handleSave} className="mt-2">
        Use Drawing as Reference
      </Button>
    </div>
  );
};

export default DrawingCanvas;
