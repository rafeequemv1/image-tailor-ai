
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface IconGalleryProps {
  icons: {
    id: string;
    url: string;
    prompt: string;
  }[];
  isLoading?: boolean;
}

const IconGallery: React.FC<IconGalleryProps> = ({ icons, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20 mt-8">
        <h3 className="text-lg font-medium mb-2">No icons generated yet</h3>
        <p className="text-muted-foreground">
          Enter a prompt above to create your first scientific icon
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
      {icons.map((icon) => (
        <Card key={icon.id} className="overflow-hidden group">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-muted">
              <img 
                src={icon.url} 
                alt={icon.prompt} 
                className="w-full h-full object-contain"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-xs text-white line-clamp-3">{icon.prompt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IconGallery;
