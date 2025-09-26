
import React, { useRef } from 'react';
import { Shape } from '../types';

interface ResizableShapeProps {
  shape: Shape;
  isSelected: boolean;
  onUpdate: (id: string, newProps: Partial<Shape>) => void;
  onSelect: (id: string) => void;
}

const ResizableShape: React.FC<ResizableShapeProps> = ({ shape, isSelected, onUpdate, onSelect }) => {
  const shapeRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect(shape.id);
    dragOffset.current = {
      x: e.clientX - shape.x,
      y: e.clientY - shape.y,
    };
    // Use a transparent image to hide default drag preview
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // When clientX/Y is 0, it means drag has ended (e.g., in Firefox)
    if (e.clientX === 0 && e.clientY === 0) return;

    onUpdate(shape.id, {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const { width: startWidth, height: startHeight } = shape;

    const doResize = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(20, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(20, startHeight + (moveEvent.clientY - startY));
      onUpdate(shape.id, { width: newWidth, height: newHeight });
    };

    const stopResize = () => {
      window.removeEventListener('mousemove', doResize);
      window.removeEventListener('mouseup', stopResize);
    };

    window.addEventListener('mousemove', doResize);
    window.addEventListener('mouseup', stopResize);
  };

  const startRotation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!shapeRef.current) return;
    
    const rect = shapeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const doRotate = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - centerX;
        const dy = moveEvent.clientY - centerY;
        const angleRad = Math.atan2(dy, dx) + Math.PI / 2;
        let angleDeg = Math.round(angleRad * 180 / Math.PI);
        if (angleDeg < 0) {
            angleDeg += 360;
        }
      
        onUpdate(shape.id, { rotation: angleDeg });
    };

    const stopRotate = () => {
      window.removeEventListener('mousemove', doRotate);
      window.removeEventListener('mouseup', stopRotate);
    };

    window.addEventListener('mousemove', doRotate);
    window.addEventListener('mouseup', stopRotate);
  };

  const renderShape = () => {
    const { type, color, width, height } = shape;
    switch (type) {
      case 'square':
        return <div className="w-full h-full" style={{ backgroundColor: color, borderRadius: '2%' }}></div>;
      case 'circle':
        return <div className="w-full h-full" style={{ backgroundColor: color, borderRadius: '50%' }}></div>;
      case 'triangle':
        return (
          <div className="w-full h-full"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              backgroundColor: color,
            }}
          ></div>
        );
    }
  };

  return (
    <div
      ref={shapeRef}
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onClick={(e) => {
          e.stopPropagation();
          onSelect(shape.id);
      }}
      className="absolute cursor-move"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.width,
        height: shape.height,
        transform: `rotate(${shape.rotation}deg)`,
        outline: isSelected ? '3px solid #3b82f6' : 'none',
        outlineOffset: '4px',
        borderRadius: '4px',
      }}
    >
      {renderShape()}
      {isSelected && (
        <>
          <div
            onMouseDown={startRotation}
            title="모양 회전하기"
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-5 h-5 bg-yellow-400 border-2 border-white rounded-full cursor-alias"
          >
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-4 bg-blue-500 pointer-events-none" />
          </div>
          <div
            onMouseDown={startResize}
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize"
          />
        </>
      )}
    </div>
  );
};

export default ResizableShape;
