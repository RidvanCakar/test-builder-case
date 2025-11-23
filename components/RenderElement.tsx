// src/components/RenderElement.tsx
import React from 'react';
import { BuilderElement } from '../types/builder';

interface RenderElementProps {
  element: BuilderElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

export default function RenderElement({ element, isSelected, onSelect }: RenderElementProps) {
  // Seçiliyse etrafında mavi çizgi göster (PDF TC-004)
  const borderStyle = isSelected 
    ? 'border-2 border-blue-500 ring-2 ring-blue-200 z-50' 
    : 'border border-transparent hover:border-gray-300';

  // Ortak stiller (Pozisyonlama)
  const commonStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.position.width,
    height: element.position.height,
    zIndex: element.position.zIndex,
    transition: 'box-shadow 0.2s, border-color 0.2s',
  };

  // Element tipine göre farklı içerik render etme
  const renderContent = () => {
    switch (element.type) {
      case 'header':
        return (
          <div className="w-full h-full bg-slate-800 text-white flex items-center justify-between px-8 shadow-md">
            {/* DÜZELTME: Statik yazı yerine element.content.text */}
            <span className="font-bold text-xl">{element.content.text || 'Logo'}</span>
            <nav className="space-x-4 text-sm">
              <span>Home</span>
              <span>About</span>
              <span>Contact</span>
            </nav>
          </div>
        );
      
      case 'footer':
        return (
          <div className="w-full h-full bg-gray-900 text-gray-400 flex items-center justify-center text-sm">
            {/* DÜZELTME: Statik yazı yerine element.content.text */}
            {element.content.text || '© 2024 Footer Content'}
          </div>
        );

      case 'card':
        return (
          <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
            <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-400">
              Image Area
            </div>
            <div className="p-4 overflow-hidden">
               {/* DÜZELTME: Başlık ve açıklama dinamik hale geldi */}
              <h3 className="font-bold text-gray-800 mb-2">{element.content.title || 'Card Title'}</h3>
              <p className="text-gray-500 text-xs">{element.content.description || 'Description...'}</p>
            </div>
          </div>
        );

      case 'text-content':
        return (
          <div className="w-full h-full p-4 border-2 border-dashed border-gray-300 bg-white/50 rounded flex items-center justify-center text-gray-500 overflow-hidden">
            {/* DÜZELTME: Yazılan metni burada gösteriyoruz */}
            <p className="text-center pointer-events-none">
                {element.content.text || 'Text Content Area (Editable)'}
            </p>
          </div>
        );

      default:
        return <div className="w-full h-full bg-gray-200">Unknown Element</div>;
    }
  };

  return (
    <div
      onClick={onSelect} 
      style={commonStyle}
      className={`cursor-move select-none ${borderStyle}`}
    >
      {renderContent()}
      
      {isSelected && (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize rounded-tl" />
      )}
    </div>
  );
}