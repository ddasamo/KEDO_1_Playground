
import React from 'react';
import { ShapeType } from '../types';
import { SquareIcon, CircleIcon, TriangleIcon } from './icons';

const DraggableShape: React.FC<{ type: ShapeType }> = ({ type }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('shapeType', type);
  };

  const getIcon = () => {
    switch (type) {
      case 'square':
        return <SquareIcon className="w-16 h-16 text-blue-500" />;
      case 'circle':
        return <CircleIcon className="w-16 h-16 text-red-500" />;
      case 'triangle':
        return <TriangleIcon className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getName = () => {
     switch (type) {
      case 'square':
        return "네모";
      case 'circle':
        return "동그라미";
      case 'triangle':
        return "세모";
    }
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col items-center justify-center p-4 m-2 bg-white rounded-xl cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
    >
      {getIcon()}
      <p className="mt-2 text-sm font-semibold text-gray-600">{getName()}</p>
    </div>
  );
};

const ShapePalette: React.FC = () => {
  return (
    <aside className="w-48 bg-gray-200 p-4 flex flex-col items-center border-r border-gray-300">
      <h2 className="text-xl font-bold text-gray-700 mb-4">모양</h2>
      <DraggableShape type="square" />
      <DraggableShape type="circle" />
      <DraggableShape type="triangle" />
    </aside>
  );
};

export default ShapePalette;
