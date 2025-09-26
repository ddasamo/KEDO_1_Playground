
import React from 'react';
import { Shape } from '../types';
import { TrashIcon, ImageIcon } from './icons';

interface ControlsProps {
  selectedShape: Shape | undefined;
  onColorChange: (color: string) => void;
  onDelete: () => void;
  onRotationChange: (rotation: number) => void;
  onSaveImage: () => void;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766',
  '#F06595', '#74B816', '#1E90FF', '#9B59B6',
  '#F39C12', '#34495E', '#E74C3C', '#BDC3C7'
];

const ColorPicker: React.FC<{ onColorChange: (color: string) => void, selectedColor?: string }> = ({ onColorChange, selectedColor }) => {
  return (
    <div>
      <h3 className="text-md font-semibold text-gray-600 mb-2">색깔</h3>
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            style={{ backgroundColor: color }}
            aria-label={`Change color to ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

const RotationControl: React.FC<{ rotation: number; onRotationChange: (rotation: number) => void }> = ({ rotation, onRotationChange }) => {
  return (
    <div>
      <h3 className="text-md font-semibold text-gray-600 mb-2">회전</h3>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => onRotationChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-700 w-12 text-center">{rotation}°</span>
      </div>
    </div>
  );
};


const Controls: React.FC<ControlsProps> = ({ selectedShape, onColorChange, onDelete, onRotationChange, onSaveImage }) => {
  return (
    <aside className="w-64 bg-gray-200 p-4 border-l border-gray-300 flex flex-col">
      <h2 className="text-xl font-bold text-gray-700 text-center mb-6">도구</h2>
      
      <div className="flex-1 min-h-0">
        {selectedShape ? (
          <div className="flex flex-col gap-6">
            <ColorPicker onColorChange={onColorChange} selectedColor={selectedShape.color}/>
            <RotationControl rotation={selectedShape.rotation} onRotationChange={onRotationChange} />
            <div>
              <h3 className="text-md font-semibold text-gray-600 mb-2">삭제</h3>
              <button
                onClick={onDelete}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
                모양 지우기
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">수정할 모양을 선택해주세요!</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-300 flex flex-col gap-2">
         <button
          onClick={onSaveImage}
          className="w-full flex items-center justify-center gap-2 p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
          aria-label="그림 저장하기"
        >
          <ImageIcon className="w-5 h-5" />
          그림 저장하기
        </button>
      </div>
    </aside>
  );
};

export default Controls;
