// src/components/RenderElement.tsx
import React from 'react';
import { BuilderElement } from '../types/builder';

interface RenderElementProps {
  element: BuilderElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  // Mouse olaylarını yukarı taşımak için prop'lar
  onDragStart: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent) => void;
}

export default function RenderElement({ 
  element, 
  isSelected, 
  onSelect,
  onDragStart, 
  onResizeStart
}: RenderElementProps) {

  // ÇAKIŞMA KONTROLÜ
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'none';
  };

  const borderStyle = isSelected 
    ? 'border-2 border-blue-500 ring-2 ring-blue-200 z-50' 
    : 'border border-transparent hover:border-gray-300';

  const commonStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.position.width,
    height: element.position.height,
    zIndex: element.position.zIndex,
    transition: 'none', // Mouse ile sürüklerken akıcı olması için animasyonu kapattık
  };

  const renderContent = () => {
    switch (element.type) {
      case 'header':
        return (
          <div className="w-full h-full bg-slate-800 text-white flex items-center justify-between px-8 shadow-md overflow-hidden">
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
          <div className="w-full h-full bg-gray-900 text-gray-400 flex items-center justify-center text-sm overflow-hidden">
            {element.content.text || '© 2024 Footer Content'}
          </div>
        );

      case 'card':
        return (
          <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
            {/* RESİM VARSA GÖSTER, YOKSA GRİ KUTU */}
            {element.content.image ? (
                <img 
                    src={element.content.image} 
                    alt="Card" 
                    className="h-32 w-full object-cover pointer-events-none" 
                />
            ) : (
                <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                    Image Area
                </div>
            )}
            <div className="p-4 overflow-hidden">
              <h3 className="font-bold text-gray-800 mb-2">{element.content.title || 'Card Title'}</h3>
              <p className="text-gray-500 text-xs">{element.content.description || 'Description...'}</p>
            </div>
          </div>
        );

      case 'slider':
        return (
            <div className="w-full h-full bg-gray-800 relative flex items-center justify-center overflow-hidden">
                {/* SLIDER RESMİ ARKA PLAN */}
                {element.content.image ? (
                    <img 
                        src={element.content.image} 
                        alt="Slider" 
                        className="w-full h-full object-cover pointer-events-none absolute inset-0" 
                    />
                ) : (
                    <div className="text-white opacity-50">Slider Image Placeholder</div>
                )}
                <h2 className="text-3xl font-bold text-white z-10 drop-shadow-md pointer-events-none">
                    {element.content.text || 'Slider Başlığı'}
                </h2>
            </div>
        );

      case 'text-content':
        return (
          <div className="w-full h-full p-4 border-2 border-dashed border-gray-300 bg-white/50 rounded flex items-center justify-center text-gray-500 overflow-hidden">
            <p className="text-center pointer-events-none select-none">
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
      onDragOver={handleDragOver}
      onMouseDown={onDragStart} // Taşıma Başlat
      style={commonStyle}
      className={`cursor-move select-none ${borderStyle}`}
    >
      {renderContent()}
      
      {/* Seçiliyse Boyutlandırma Tutamacını Göster */}
      {isSelected && (
        <div 
            onMouseDown={(e) => {
                e.stopPropagation();
                onResizeStart(e); // Boyutlandırma Başlat
            }}
            className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 cursor-se-resize rounded-tl flex items-center justify-center z-[60]"
        >
            <span className="text-white text-[8px]">↘</span>
        </div>
      )}
    </div>
  );
}