// src/components/Canvas.tsx
"use client";

import React, { useRef } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { ElementType } from '../types/builder';

export default function Canvas() {
  const { elements, addElement } = useBuilder();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Bu çok önemli! Drop işleminin gerçekleşmesi için zorunlu.
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('elementType') as ElementType;

    if (!type || !canvasRef.current) return;

    // PDF TC-003: MouseX - PreviewOffsetX formülü 
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    addElement(type, { x, y, width: 0, height: 0, zIndex: 1 });
  };

  return (
    <div className="flex-1 bg-gray-100 p-8 h-screen overflow-auto">
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full h-[800px] bg-white shadow-lg relative rounded overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)', backgroundSize: '20px 20px' }} // Grid efekti
      >
        {elements.map((el) => (
          <div
            key={el.id}
            className="absolute bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-blue-800 font-bold rounded"
            style={{
              left: el.position.x,
              top: el.position.y,
              width: el.position.width,
              height: el.position.height,
              zIndex: el.position.zIndex,
            }}
          >
            {el.type}
          </div>
        ))}
        
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
            Elementleri buraya sürükleyip bırakın
          </div>
        )}
      </div>
    </div>
  );
}