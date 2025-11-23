// src/components/Canvas.tsx
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { ElementType } from '../types/builder';
import RenderElement from './RenderElement';

// Etkileşim durumunu tutmak için tip
interface InteractionState {
  mode: 'drag' | 'resize' | null;
  elementId: string | null;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
}

export default function Canvas() {
  const { elements, addElement, removeElement, updateElement, selectedElement, setSelectedElement } = useBuilder();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // INTERACTION STATE: Mouse hareketlerini yöneten state
  const [interaction, setInteraction] = useState<InteractionState>({
    mode: null,
    elementId: null,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    initialWidth: 0,
    initialHeight: 0,
  });

  // --- KLAVYE İLE SİLME ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Delete' && selectedElement) removeElement(selectedElement);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, removeElement]);

  // --- MOUSE START (DRAG & RESIZE) ---
  const handleInteractionStart = (e: React.MouseEvent, id: string, mode: 'drag' | 'resize') => {
    e.stopPropagation(); // Canvas click'i engelle
    
    const element = elements.find(el => el.id === id);
    if (!element) return;

    setSelectedElement(id);

    // Elementin genişliği "100%" (string) ise bunu piksele çeviriyor
    let currentPixelWidth = 0;
    
    if (typeof element.position.width === 'number') {
        currentPixelWidth = element.position.width;
    } else if (typeof element.position.width === 'string' && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        if (element.position.width === '100%') {
            currentPixelWidth = canvasRect.width;
        } else {
            currentPixelWidth = parseFloat(element.position.width); 
            // Eğer "50%" gibi bir değerse hesapla
            if (element.position.width.includes('%')) {
                 currentPixelWidth = (canvasRect.width * currentPixelWidth) / 100;
            }
        }
    }

    setInteraction({
      mode,
      elementId: id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: element.position.x,
      initialY: Number(element.position.y) || 0,
      initialWidth: currentPixelWidth || 100, // Hata olursa en az 100px olsun
      initialHeight: Number(element.position.height) || 0,
    });
  };

  // --- MOUSE HAREKETİ  ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interaction.mode || !interaction.elementId) return;

    const deltaX = e.clientX - interaction.startX;
    const deltaY = e.clientY - interaction.startY;
    
    // Grid Snap Fonksiyonu (10px)
    const snap = (val: number) => Math.round(val / 10) * 10;

    if (interaction.mode === 'drag') {
      updateElement(interaction.elementId, {
        position: {
            ...elements.find(el => el.id === interaction.elementId)!.position,
            x: snap(interaction.initialX + deltaX),
            y: snap(interaction.initialY + deltaY),
        }
      });
    } 
    else if (interaction.mode === 'resize') {
      updateElement(interaction.elementId, {
        position: {
            ...elements.find(el => el.id === interaction.elementId)!.position,
            width: snap(interaction.initialWidth + deltaX),
            height: snap(interaction.initialHeight + deltaY),
        }
      });
    }
  };

  // --- MOUSE UP (STOP) ---
  const handleMouseUp = () => {
    if (interaction.mode) {
      setInteraction(prev => ({ ...prev, mode: null, elementId: null }));
    }
  };

  // --- SIDEBAR DRAG & DROP ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const type = e.dataTransfer.getData('elementType') as ElementType;
    if (!type || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const snap = (val: number) => Math.round(val / 10) * 10;
    addElement(type, { 
        x: snap(e.clientX - rect.left), 
        y: snap(e.clientY - rect.top), 
        width: 0, height: 0, zIndex: 1 
    });
  };

  return (
    <div 
        className="flex-1 bg-gray-100 p-8 h-screen overflow-auto" 
        onClick={() => setSelectedElement(null)}
        onMouseMove={handleMouseMove} // Tüm canvas üzerinde mouse hareketini dinle
        onMouseUp={handleMouseUp}     // Mouse bırakılınca işlemi bitir
        onMouseLeave={handleMouseUp}  // Canvas dışına çıkarsa da bitir
    >
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        className={`w-full h-[1200px] bg-white shadow-lg relative rounded overflow-hidden mx-auto transition-colors ${
          isDraggingOver ? 'border-2 border-green-500 bg-green-50' : 'border border-transparent'
        }`}
        style={{ 
            width: '100%', 
            maxWidth: '1200px',
            backgroundImage: isDraggingOver ? 'none' : 'radial-gradient(#e5e7eb 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {elements.map((el) => (
          <RenderElement
            key={el.id}
            element={el}
            isSelected={el.id === selectedElement}
            onSelect={(e) => {
                e.stopPropagation();
                setSelectedElement(el.id);
            }}
            // YENİ: Mouse olaylarını Canvas'a BİLDİR
            onDragStart={(e) => handleInteractionStart(e, el.id, 'drag')}
            onResizeStart={(e) => handleInteractionStart(e, el.id, 'resize')}
          />
        ))}

        {elements.length === 0 && !isDraggingOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none select-none">
            <p className="text-xl font-medium">Canvas Boş</p>
            <p className="text-sm">Soldan bir bileşen sürükleyin</p>
          </div>
        )}
        
        {isDraggingOver && (
           <div className="absolute inset-0 flex items-center justify-center text-green-600 bg-green-50/50 pointer-events-none z-40">
             <p className="text-2xl font-bold animate-pulse">+ Buraya Bırak</p>
           </div>
        )}
      </div>
    </div>
  );
}