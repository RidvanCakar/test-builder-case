// src/context/BuilderContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BuilderElement, ElementType, ElementPosition } from '../types/builder';

// Context üzerinden erişeceğimiz veriler ve fonksiyonlar
interface BuilderContextType {
  elements: BuilderElement[];
  addElement: (type: ElementType, position: ElementPosition) => void;
  removeElement: (id: string) => void;
  updateElementPosition: (id: string, newPosition: ElementPosition) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Yeni element ekleme fonksiyonu (PDF Varsayılanlarına göre)
  const addElement = (type: ElementType, position: ElementPosition) => {
    const newId = `elem_${type}_${Date.now()}`; // Benzersiz ID oluşturma

    // PDF Tablo 1'deki Varsayılan Boyutlar 
    let defaultSize = { width: 200, height: 100 }; // Genel fallback
    if (type === 'card') defaultSize = { width: 300, height: 200 };
    if (type === 'header') defaultSize = { width: '100%', height: 80 };
    if (type === 'footer') defaultSize = { width: '100%', height: 60 };
    if (type === 'slider') defaultSize = { width: '100%', height: 400 };

    const newElement: BuilderElement = {
      id: newId,
      type,
      position: {
        ...position,
        width: defaultSize.width,
        height: defaultSize.height,
        zIndex: elements.length + 1, // Her yeni element üste gelir
      },
      content: {
        text: `${type.toUpperCase()} Element`, // Varsayılan içerik
      }
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedElement(newId); // Eklenen elementi otomatik seç
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  const updateElementPosition = (id: string, newPosition: ElementPosition) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, position: newPosition } : el))
    );
  };

  return (
    <BuilderContext.Provider
      value={{
        elements,
        addElement,
        removeElement,
        updateElementPosition,
        selectedElement,
        setSelectedElement,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

// Hook: Diğer dosyalardan context'i kolayca kullanmak için
export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}