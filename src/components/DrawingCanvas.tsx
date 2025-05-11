
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, PencilLine, Undo2, RotateCcw, Upload, Trash2, Move, Scale, Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { fabric } from 'fabric';

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
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"select" | "pencil" | "eraser">("select");
  const [uploadedImages, setUploadedImages] = useState<fabric.Image[]>([]);

  // Initialize fabric canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: width,
        height: height,
        backgroundColor: '#FFFFFF'
      });
      
      // Setup free drawing brush
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = brushSize;
      
      // Set the initial interaction mode
      canvas.isDrawingMode = false;
      
      setFabricCanvas(canvas);
      
      return () => {
        canvas.dispose();
      };
    }
  }, []);

  // Update drawing brush when color or size changes
  useEffect(() => {
    if (fabricCanvas) {
      if (tool === "eraser") {
        // For eraser, we set color to white (or the canvas background color)
        fabricCanvas.freeDrawingBrush.color = "#FFFFFF";
      } else {
        fabricCanvas.freeDrawingBrush.color = color;
      }
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  }, [color, brushSize, fabricCanvas, tool]);
  
  // Update canvas mode based on the selected tool
  useEffect(() => {
    if (!fabricCanvas) return;
    
    if (tool === "select") {
      fabricCanvas.isDrawingMode = false;
      // Make all objects selectable and movable
      fabricCanvas.forEachObject(obj => {
        obj.selectable = true;
        obj.evented = true;
      });
    } else if (tool === "pencil") {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.color = color;
    } else if (tool === "eraser") {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.color = "#FFFFFF"; // White color to act as eraser
    }
    
    fabricCanvas.renderAll();
  }, [tool, fabricCanvas, color]);

  const handleClear = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.setBackgroundColor('#FFFFFF', fabricCanvas.renderAll.bind(fabricCanvas));
    setUploadedImages([]);
    
    toast({
      title: "Canvas cleared",
      description: "All content has been removed from the canvas",
    });
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      const lastObject = objects[objects.length - 1];
      fabricCanvas.remove(lastObject);
      fabricCanvas.renderAll();
      
      // Check if the removed object was an image
      if (lastObject instanceof fabric.Image) {
        setUploadedImages(prev => prev.filter(img => img !== lastObject));
      }
    }
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      filesArray.forEach(file => {
        // Basic validation
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target && event.target.result && fabricCanvas) {
              // Create fabric image from the loaded file
              fabric.Image.fromURL(event.target.result as string, (img) => {
                // Scale image to fit within the canvas while maintaining aspect ratio
                const maxDimension = Math.min(fabricCanvas.width!, fabricCanvas.height!) * 0.8;
                if (img.width! > img.height!) {
                  // Width is larger, scale based on width
                  if (img.width! > maxDimension) {
                    const scale = maxDimension / img.width!;
                    img.scale(scale);
                  }
                } else {
                  // Height is larger or equal, scale based on height
                  if (img.height! > maxDimension) {
                    const scale = maxDimension / img.height!;
                    img.scale(scale);
                  }
                }
                
                // Position image in the center of the canvas
                img.set({
                  left: fabricCanvas.width! / 2 - (img.width! * img.scaleX!) / 2,
                  top: fabricCanvas.height! / 2 - (img.height! * img.scaleY!) / 2,
                });
                
                // Make the image interactive
                img.set({
                  selectable: tool === "select",
                  evented: tool === "select",
                });
                
                // Add image to canvas
                fabricCanvas.add(img);
                setUploadedImages(prev => [...prev, img]);
                fabricCanvas.setActiveObject(img);
                fabricCanvas.renderAll();
                
                toast({
                  title: "Image added",
                  description: "You can now draw on top of the image",
                });
              });
            }
          };
          reader.readAsDataURL(file);
        } else {
          toast({
            title: "Invalid file",
            description: "Please select an image file",
            variant: "destructive",
          });
        }
      });
      
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleRemoveBackground = () => {
    if (fabricCanvas && uploadedImages.length > 0) {
      // Remove the selected image if any
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject && uploadedImages.includes(activeObject as fabric.Image)) {
        fabricCanvas.remove(activeObject);
        setUploadedImages(prev => prev.filter(img => img !== activeObject));
        toast({
          title: "Image removed",
          description: "Selected image has been removed from the canvas",
        });
      } else {
        // If no image is selected, remove the last added image
        const lastImage = uploadedImages[uploadedImages.length - 1];
        if (lastImage) {
          fabricCanvas.remove(lastImage);
          setUploadedImages(prev => prev.filter(img => img !== lastImage));
          toast({
            title: "Image removed",
            description: "Last added image has been removed from the canvas",
          });
        }
      }
      fabricCanvas.renderAll();
    }
  };

  const handleSave = () => {
    if (fabricCanvas) {
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      const dataURL = fabricCanvas.toDataURL({ format: 'png', quality: 1.0 });
      
      // Convert data URL to blob
      fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "drawing.png", { type: "image/png" });
          onSave(file);
        });
    }
  };

  const handleSelectTool = () => {
    setTool("select");
  };

  const handlePencilTool = () => {
    setTool("pencil");
  };

  const handleEraserTool = () => {
    setTool("eraser");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between items-center mb-2">
        <div className="flex space-x-2">
          <Button 
            variant={tool === "select" ? "default" : "outline"} 
            size="sm" 
            onClick={handleSelectTool}
          >
            <Move className="h-4 w-4 mr-1" /> Select/Move
          </Button>
          <Button 
            variant={tool === "pencil" ? "default" : "outline"} 
            size="sm" 
            onClick={handlePencilTool}
          >
            <PencilLine className="h-4 w-4 mr-1" /> Draw
          </Button>
          <Button 
            variant={tool === "eraser" ? "default" : "outline"} 
            size="sm" 
            onClick={handleEraserTool}
          >
            <Eraser className="h-4 w-4 mr-1" /> Erase
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
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={handleImageUpload} className="flex items-center">
          <Upload className="h-4 w-4 mr-1" /> Add Image
        </Button>
        {uploadedImages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleRemoveBackground} className="flex items-center">
            <Trash2 className="h-4 w-4 mr-1" /> Remove Image
          </Button>
        )}
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          multiple
        />
        <span className="text-xs text-muted-foreground ml-2 self-center">
          {uploadedImages.length > 0 ? `${uploadedImages.length} image(s) added` : ''}
        </span>
      </div>
      
      <div className="border rounded-md overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          style={{ 
            width: "100%",
            height: "auto",
            touchAction: "none",
          }}
          className={`cursor-${tool === "select" ? "move" : "crosshair"}`}
        />
      </div>
      
      <Button onClick={handleSave} className="mt-2">
        Use Drawing as Reference
      </Button>
    </div>
  );
};

export default DrawingCanvas;
