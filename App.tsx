import React, { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { Shape, ShapeType } from './types';
import ShapePalette from './components/ShapePalette';
import Canvas from './components/Canvas';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddShape = (type: ShapeType, x: number, y: number) => {
    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newShape: Shape = {
      id: `${type}-${Date.now()}`,
      type,
      x: x - canvasRect.left - 50, // Center shape on cursor
      y: y - canvasRect.top - 50,
      width: 100,
      height: 100,
      color: '#4ECDC4',
      rotation: 0,
    };
    setShapes((prevShapes) => [...prevShapes, newShape]);
    setSelectedShapeId(newShape.id);
  };

  const handleUpdateShape = useCallback((id: string, newProps: Partial<Shape>) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === id ? { ...shape, ...newProps } : shape
      )
    );
  }, []);

  const handleSelectShape = useCallback((id: string | null) => {
    setSelectedShapeId(id);
  }, []);

  const handleDeleteShape = () => {
    if (!selectedShapeId) return;
    setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== selectedShapeId));
    setSelectedShapeId(null);
  };

  const handleChangeColor = (color: string) => {
    if (!selectedShapeId) return;
    handleUpdateShape(selectedShapeId, { color });
  };

  const handleChangeRotation = (rotation: number) => {
    if (!selectedShapeId) return;
    handleUpdateShape(selectedShapeId, { rotation });
  };

  const handleSaveImage = () => {
    if (!canvasRef.current) return;

    const canvasElement = canvasRef.current;
    const previouslySelectedId = selectedShapeId;

    // Deselect shape to hide controls before taking screenshot
    setSelectedShapeId(null);

    // Allow DOM to update before capturing
    setTimeout(() => {
      html2canvas(canvasElement, {
          backgroundColor: null, // Set a transparent background for the image
          logging: false,
          useCORS: true,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = '모양놀이터-그림.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Restore selection after screenshot
        if (previouslySelectedId) {
          setSelectedShapeId(previouslySelectedId);
        }
      }).catch((err) => {
        console.error("oops, something went wrong!", err);
        // Restore selection if something goes wrong
        if (previouslySelectedId) {
          setSelectedShapeId(previouslySelectedId);
        }
      });
    }, 100); // A small delay to ensure re-render without selection outline
  };
  
  const selectedShape = shapes.find(s => s.id === selectedShapeId);

  return (
    <div className="h-screen w-screen flex flex-col font-sans antialiased overflow-hidden">
      <header className="bg-white p-4 text-center z-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-700">🎨 모양 놀이터</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ShapePalette />
        <Canvas
          ref={canvasRef}
          shapes={shapes}
          selectedShapeId={selectedShapeId}
          onAddShape={handleAddShape}
          onUpdateShape={handleUpdateShape}
          onSelectShape={handleSelectShape}
        />
        <Controls
          selectedShape={selectedShape}
          onColorChange={handleChangeColor}
          onDelete={handleDeleteShape}
          onRotationChange={handleChangeRotation}
          onSaveImage={handleSaveImage}
        />
      </div>
    </div>
  );
};

export default App;
