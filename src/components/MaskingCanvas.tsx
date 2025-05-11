
import React, { useRef, useEffect, useState } from "react";
import { Brush, Eraser, Undo, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MaskingCanvasProps {
  image: string;
  onMaskChange: (maskBlob: Blob | null) => void;
}

const BRUSH_SIZES = [5, 15, 30, 45];
const BRUSH_COLOR = "#9b87f5"; // Primary mask color

const MaskingCanvas: React.FC<MaskingCanvasProps> = ({ image, onMaskChange }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [brushSize, setBrushSize] = useState(15);
  const [history, setHistory] = useState<ImageData[]>([]);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    
    setCtx(context);
    
    // Set initial canvas size
    if (imageRef.current && imageRef.current.complete) {
      resizeCanvas();
    }
  }, []);
  
  // Update canvas when image loads
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = resizeCanvas;
    }
  }, [image]);
  
  // Save history on tool change for undo
  useEffect(() => {
    saveCurrentStateToHistory();
  }, [tool]);
  
  // Resize canvas to match image dimensions
  const resizeCanvas = () => {
    if (!imageRef.current || !canvasRef.current || !ctx) return;
    
    const { naturalWidth, naturalHeight } = imageRef.current;
    const { clientWidth, clientHeight } = imageRef.current;
    
    canvasRef.current.width = clientWidth;
    canvasRef.current.height = clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, clientWidth, clientHeight);
    
    // Notify parent that mask is empty
    generateMaskBlob();
  };
  
  // Save current canvas state to history
  const saveCurrentStateToHistory = () => {
    if (!ctx || !canvasRef.current) return;
    
    const currentState = ctx.getImageData(
      0, 0, 
      canvasRef.current.width, 
      canvasRef.current.height
    );
    
    setHistory(prev => [...prev, currentState]);
    
    // Limit history size
    if (history.length > 20) {
      setHistory(prev => prev.slice(1));
    }
  };
  
  // Undo last action
  const handleUndo = () => {
    if (!history.length || !ctx || !canvasRef.current) return;
    
    const previousState = history[history.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(prev => prev.slice(0, -1));
    
    generateMaskBlob();
  };
  
  // Clear the entire mask
  const clearMask = () => {
    if (!ctx || !canvasRef.current) return;
    
    saveCurrentStateToHistory();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    generateMaskBlob();
  };
  
  // Generate mask blob to send to API
  const generateMaskBlob = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      onMaskChange(blob);
    }, "image/png");
  };
  
  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    setIsDrawing(true);
    saveCurrentStateToHistory();
    
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    if (tool === "brush") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = BRUSH_COLOR;
    } else {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    }
    
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    
    // Handle both mouse and touch events
    const point = getEventPoint(e);
    if (point) {
      ctx.moveTo(point.x, point.y);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    // Prevent scrolling when drawing on touch devices
    e.preventDefault();
    
    const point = getEventPoint(e);
    if (point) {
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  };
  
  const stopDrawing = () => {
    if (!isDrawing || !ctx) return;
    
    ctx.closePath();
    setIsDrawing(false);
    generateMaskBlob();
  };
  
  // Helper to get coordinates from both mouse and touch events
  const getEventPoint = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return null;
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return null;
      
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };
  
  return (
    <div className="relative w-full">
      {/* Hidden image for reference */}
      <img
        ref={imageRef}
        src={image}
        alt="Source for masking"
        className="w-full rounded-lg"
        style={{ visibility: 'hidden', position: 'absolute' }}
      />
      
      {/* Visible image */}
      <img
        src={image}
        alt="Image to edit"
        className="w-full rounded-lg"
      />
      
      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-crosshair rounded-lg"
        style={{ opacity: 0.7 }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      {/* Toolbar */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg border space-x-1">
        <Toggle
          pressed={tool === "brush"}
          onPressedChange={() => setTool("brush")}
          aria-label="Brush tool"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Brush className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          pressed={tool === "eraser"}
          onPressedChange={() => setTool("eraser")}
          aria-label="Eraser tool"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Eraser className="h-4 w-4" />
        </Toggle>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <div 
                className="rounded-full bg-primary" 
                style={{ 
                  width: Math.min(brushSize, 16), 
                  height: Math.min(brushSize, 16) 
                }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" side="top">
            <div className="flex gap-1">
              {BRUSH_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={cn(
                    "rounded-full border-2 flex items-center justify-center",
                    brushSize === size ? "border-primary" : "border-transparent"
                  )}
                  style={{ width: size + 8, height: size + 8 }}
                >
                  <div
                    className="rounded-full bg-primary"
                    style={{ width: size, height: size }}
                  />
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={handleUndo}
          disabled={history.length === 0}
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={clearMask}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MaskingCanvas;
