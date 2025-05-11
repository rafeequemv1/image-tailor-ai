
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, PencilLine, Undo2, RotateCcw, Upload, Trash2, Type, Move } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { fabric } from 'fabric';
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
  const [tool, setTool] = useState<"select" | "pencil" | "eraser" | "text">("pencil");
  const [uploadedImages, setUploadedImages] = useState<fabric.Image[]>([]);
  const [textInput, setTextInput] = useState("");

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
      canvas.isDrawingMode = true;
      
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
    
    fabricCanvas.isDrawingMode = tool === "pencil" || tool === "eraser";
    
    if (tool === "pencil") {
      fabricCanvas.freeDrawingBrush.color = color;
    } else if (tool === "eraser") {
      fabricCanvas.freeDrawingBrush.color = "#FFFFFF"; // White color to act as eraser
    } else if (tool === "select") {
      // Make all objects selectable when in select mode
      fabricCanvas.forEachObject(obj => {
        obj.selectable = true;
        obj.evented = true;
      });
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
                  selectable: true,
                  evented: true,
                });
                
                // Add image to canvas
                fabricCanvas.add(img);
                setUploadedImages(prev => [...prev, img]);
                fabricCanvas.setActiveObject(img);
                fabricCanvas.renderAll();
                
                // Automatically switch to select mode when image is added
                setTool("select");
                
                toast({
                  title: "Image added",
                  description: "You can now move, resize, or draw on top of the image",
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

  const handleTextTool = () => {
    setTool("text");
    toast({
      title: "Text tool activated",
      description: "Click anywhere on the canvas to add text",
    });
  };

  const addText = (pointer: { x: number, y: number }) => {
    if (!fabricCanvas) return;
    
    const text = new fabric.IText("Click to edit text", {
      left: pointer.x,
      top: pointer.y,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: color,
      selectable: true,
      editable: true
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.isDrawingMode = false;
    text.enterEditing();
    fabricCanvas.renderAll();
    
    // Switch to select mode after adding text
    setTool("select");
  };
  
  // Function to add text directly on canvas click when text tool is active
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== "text" || !fabricCanvas) return;
    
    // Calculate the position on the canvas accounting for any scaling
    const pointer = fabricCanvas.getPointer(e.nativeEvent);
    addText(pointer);
  };

  // Make text rotatable by adding controls
  useEffect(() => {
    if (fabricCanvas) {
      fabricCanvas.on('text:editing:exited', function(e) {
        // Switch to select mode when text editing is done
        setTool("select");
      });
      
      // Set default controls for text objects to enable rotation
      fabric.IText.prototype.setControlsVisibility({
        mt: true, // middle-top
        mb: true, // middle-bottom
        ml: true, // middle-left
        mr: true, // middle-right
        mtr: true, // middle-top-rotation
      });

      // Add context menu event handlers
      fabricCanvas.on('mouse:down', function(opt) {
        const evt = opt.e as MouseEvent;
        if (evt.button === 2 && opt.target) { // Right click and there's a target
          // The context menu will be handled by the ContextMenu component
        }
      });
    }
  }, [fabricCanvas]);

  // Context menu action handlers
  const handleDuplicateObject = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) return;

    // Clone the object
    activeObject.clone((cloned: fabric.Object) => {
      // Offset the position slightly
      cloned.set({
        left: activeObject.left! + 10,
        top: activeObject.top! + 10,
        evented: true,
      });

      // Add to canvas
      fabricCanvas.add(cloned);
      fabricCanvas.setActiveObject(cloned);
      fabricCanvas.renderAll();

      // If it's an image, track it
      if (cloned instanceof fabric.Image) {
        setUploadedImages(prev => [...prev, cloned]);
      }

      toast({
        title: "Object duplicated",
        description: "A copy has been created",
      });
    });
  };

  const handleSendBackward = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.sendBackwards(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const handleSendForward = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.bringForward(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const handleBringToFront = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.bringToFront(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const handleSendToBack = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.sendToBack(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const handleDeleteObject = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      
      // If it's an image, remove from tracking array
      if (activeObject instanceof fabric.Image) {
        setUploadedImages(prev => prev.filter(img => img !== activeObject));
      }
      
      fabricCanvas.renderAll();
      toast({
        title: "Object deleted",
        description: "The selected object has been removed",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1">
        <Button 
          variant={tool === "select" ? "default" : "outline"} 
          size="sm" 
          onClick={handleSelectTool}
          className="h-7 px-2"
          title="Select/Move"
        >
          <Move className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant={tool === "pencil" ? "default" : "outline"} 
          size="sm" 
          onClick={handlePencilTool}
          className="h-7 px-2"
          title="Draw"
        >
          <PencilLine className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant={tool === "eraser" ? "default" : "outline"} 
          size="sm" 
          onClick={handleEraserTool}
          className="h-7 px-2"
          title="Erase"
        >
          <Eraser className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant={tool === "text" ? "default" : "outline"} 
          size="sm" 
          onClick={handleTextTool}
          className="h-7 px-2"
          title="Add Text"
        >
          <Type className="h-3.5 w-3.5" />
        </Button>

        <div className="h-7 border-l mx-1"></div>
        
        <Button variant="outline" size="sm" onClick={handleUndo} className="h-7 px-2" title="Undo">
          <Undo2 className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear} className="h-7 px-2" title="Clear Canvas">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        
        <div className="h-7 border-l mx-1"></div>
        
        <Button variant="outline" size="sm" onClick={handleImageUpload} className="h-7" title="Upload Image">
          <Upload className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Image</span>
        </Button>
        {uploadedImages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleRemoveBackground} className="h-7 px-2" title="Remove Image">
            <Trash2 className="h-3.5 w-3.5" />
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
        
        <div className="h-7 border-l mx-1"></div>
        
        {(tool === "pencil" || tool === "text") && (
          <input
            type="color"
            id="colorPicker"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded-md cursor-pointer border-none p-0"
            title="Select Color"
          />
        )}
        
        {tool === "pencil" && (
          <div className="flex items-center ml-1 gap-1">
            <Slider
              id="brushSize"
              min={1}
              max={30}
              step={1}
              value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
              className="w-16"
            />
            <span className="text-xs text-muted-foreground">{brushSize}px</span>
          </div>
        )}
      </div>
      
      {tool === "text" && (
        <p className="text-xs text-muted-foreground mt-0 mb-1">Click on canvas to add text</p>
      )}
      
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="border rounded-md overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onContextMenu={(e) => {
                // Only prevent default if there's an active object
                if (fabricCanvas && fabricCanvas.getActiveObject()) {
                  e.preventDefault();
                }
              }}
              style={{ 
                width: "100%",
                height: "auto",
                touchAction: "none",
              }}
              className={`cursor-${tool === "text" ? "text" : tool === "select" ? "move" : "crosshair"}`}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleDuplicateObject}>Duplicate</ContextMenuItem>
          <ContextMenuItem onClick={handleSendBackward}>Send Backward</ContextMenuItem>
          <ContextMenuItem onClick={handleSendForward}>Bring Forward</ContextMenuItem>
          <ContextMenuItem onClick={handleBringToFront}>Bring to Front</ContextMenuItem>
          <ContextMenuItem onClick={handleSendToBack}>Send to Back</ContextMenuItem>
          <ContextMenuItem onClick={handleDeleteObject} className="text-red-500">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      
      <Button onClick={handleSave} className="mt-1">
        Use Drawing as Reference
      </Button>
    </div>
  );
};

export default DrawingCanvas;
