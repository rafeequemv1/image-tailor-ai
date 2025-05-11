
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DrawingCanvas from "./DrawingCanvas";

interface DrawingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveDrawing: (file: File) => void;
}

const DrawingModal: React.FC<DrawingModalProps> = ({ 
  open, 
  onOpenChange, 
  onSaveDrawing 
}) => {
  const handleSave = (file: File) => {
    onSaveDrawing(file);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-sm">Create a Drawing</DialogTitle>
          <DialogDescription className="text-xs">
            Draw an image to use as a reference
          </DialogDescription>
        </DialogHeader>
        <DrawingCanvas onSave={handleSave} width={550} height={400} />
      </DialogContent>
    </Dialog>
  );
};

export default DrawingModal;
