// src/components/Canvas.tsx
"use client";

import React, { useRef } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { ElementType } from '../types/builder';
import RenderElement from './RenderElement'; // Yeni bileşeni import ettik

export default function Canvas() {
  const { elements, addElement, selectedElement, setSelectedElement } = useBuilder();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('elementType') as ElementType;

    if (!type || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Grid Snapping (PDF TC-003) - 10px Grid
    const rawX = e.clientX - canvasRect.left;
    const rawY = e.clientY - canvasRect.top;
    const snapToGrid = (val: number) => Math.round(val / 10) * 10;

    const x = snapToGrid(rawX);
    const y = snapToGrid(rawY);

    addElement(type, { x, y, width: 0, height: 0, zIndex: 1 });
  };

  // Boş alana tıklayınca seçimi kaldır
  const handleBackgroundClick = () => {
    setSelectedElement(null);
  };

  return (
    <div className="flex-1 bg-gray-100 p-8 h-screen overflow-auto" onClick={handleBackgroundClick}>
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full h-[1200px] bg-white shadow-lg relative rounded overflow-hidden mx-auto transition-all"
        // Grid deseni
        style={{ 
            width: '100%', 
            maxWidth: '1200px',
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
        }} 
        onClick={(e) => e.stopPropagation()} // Canvas'a tıklayınca seçimi kaldırmasın, sadece arka plana tıklayınca kalksın
      >
        {elements.map((el) => (
          <RenderElement
            key={el.id}
            element={el}
            isSelected={el.id === selectedElement}
            onSelect={(e) => {
              e.stopPropagation(); // Arka planın click eventini durdur
              setSelectedElement(el.id);
            }}
          />
        ))}

        {elements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
            <p className="text-xl font-medium">Canvas Boş</p>
            <p className="text-sm">Soldan bir bileşen sürükleyin</p>
          </div>
        )}
      </div>
    </div>
  );
}