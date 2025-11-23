// src/context/BuilderContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BuilderElement, ElementType, ElementPosition } from '../types/builder';

interface BuilderContextType {
  elements: BuilderElement[];
  addElement: (type: ElementType, position: ElementPosition) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void; // YENİ: Genel güncelleme fonksiyonu
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const addElement = (type: ElementType, position: ElementPosition) => {
    const newId = `elem_${type}_${Date.now()}`;

    let defaultSize = { width: 200, height: 100 };
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
        zIndex: elements.length + 1,
      },
      content: {
        text: `${type.toUpperCase()} Element`,
        title: 'Card Title',
        description: 'Description text goes here...',
      }
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedElement(newId);
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  // YENİ: Her türlü güncellemeyi yapan fonksiyon
  const updateElement = (id: string, updates: Partial<BuilderElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  return (
    <BuilderContext.Provider
      value={{
        elements,
        addElement,
        removeElement,
        updateElement, // updateElementPosition yerine bunu kullanacağız
        selectedElement,
        setSelectedElement,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}