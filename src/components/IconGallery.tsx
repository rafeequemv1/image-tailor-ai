
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

// This would normally fetch from an API or database
const dummyIcons = [
  { id: 1, url: "https://placehold.co/200x200?text=DNA", title: "DNA Structure" },
  { id: 2, url: "https://placehold.co/200x200?text=Molecule", title: "Molecular Model" },
  { id: 3, url: "https://placehold.co/200x200?text=Atom", title: "Atomic Structure" },
  { id: 4, url: "https://placehold.co/200x200?text=Cell", title: "Cell Diagram" },
  { id: 5, url: "https://placehold.co/200x200?text=Beaker", title: "Chemistry Beaker" },
  { id: 6, url: "https://placehold.co/200x200?text=Microscope", title: "Microscope" },
];

const IconGallery: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {dummyIcons.map((icon) => (
        <Card key={icon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <img 
              src={icon.url} 
              alt={icon.title} 
              className="w-full aspect-square object-cover"
            />
            <div className="p-3">
              <h3 className="font-medium text-sm">{icon.title}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IconGallery;
