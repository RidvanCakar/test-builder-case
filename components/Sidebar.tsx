// src/components/Sidebar.tsx
import React from 'react';
import { ElementType } from '../types/builder';

export default function Sidebar() {
  const draggableItems: { type: ElementType; label: string; icon: string }[] = [
    { type: 'header', label: 'Header', icon: '🛑' },
    { type: 'footer', label: 'Footer', icon: '🦶' },
    { type: 'card', label: 'Card', icon: '🃏' },
    { type: 'text-content', label: 'Text', icon: '📝' },
    { type: 'slider', label: 'Slider', icon: '🖼️' },
  ];

  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    // PDF TC-001: Element datası dataTransfer'a eklenmeli [cite: 9]
    e.dataTransfer.setData('elementType', type);
    e.dataTransfer.effectAllowed = 'copy'; // Cursor 'copy' ikonu göstersin
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="font-bold text-gray-700 mb-4">Components</h2>
      {draggableItems.map((item) => (
        <div
          key={item.type}
          draggable
          onDragStart={(e) => handleDragStart(e, item.type)}
          className="p-4 bg-white border border-gray-200 rounded shadow-sm cursor-grab active:cursor-grabbing active:opacity-50 hover:shadow-md transition-all flex items-center gap-3"
        >
          <span className="text-xl">{item.icon}</span>
          <span className="font-medium text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}