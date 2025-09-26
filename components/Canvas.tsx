
import React from 'react';
import { Shape, ShapeType } from '../types';
import ResizableShape from './ResizableShape';

interface CanvasProps {
  shapes: Shape[];
  selectedShapeId: string | null;
  onAddShape: (type: ShapeType, x: number, y: number) => void;
  onUpdateShape: (id: string, newProps: Partial<Shape>) => void;
  onSelectShape: (id: string | null) => void;
}

const Canvas = React.forwardRef<HTMLDivElement, CanvasProps>(
  ({ shapes, selectedShapeId, onAddShape, onUpdateShape, onSelectShape }, ref) => {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const shapeType = e.dataTransfer.getData('shapeType') as ShapeType;
      if (shapeType) {
        onAddShape(shapeType, e.clientX, e.clientY);
      }
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onSelectShape(null);
        }
    };

    return (
      <main className="flex-1 bg-white relative overflow-hidden" ref={ref} onClick={handleCanvasClick} onDragOver={handleDragOver} onDrop={handleDrop}>
        {shapes.map((shape) => (
          <ResizableShape
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedShapeId}
            onUpdate={onUpdateShape}
            onSelect={onSelectShape}
          />
        ))}
      </main>
    );
  }
);

export default Canvas;
