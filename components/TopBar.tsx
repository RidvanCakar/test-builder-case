// src/components/TopBar.tsx
import React from 'react';
import { useBuilder } from '../context/BuilderContext';
import { BuilderData } from '../types/builder';

export default function TopBar() {
  const { elements } = useBuilder();

  const handleExport = () => {
    const exportData: BuilderData = {
      project: {
        name: "Test Builder Project",
        version: "1.0.0",
        created: new Date().toISOString(), // Şu anki zaman
        lastModified: new Date().toISOString()
      },
      canvas: {
        width: 1200,
        height: 800, // Varsayılan canvas boyutu
        grid: {
          enabled: true,
          size: 10,
          snap: true
        }
      },
      elements: elements, // Bizim state'imizdeki güncel elementler
      metadata: {
        totalElements: elements.length,
        exportFormat: "json",
        exportVersion: "2.0"
      }
    };

    // JSON dosyasını oluştur ve indir
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 relative">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          B
        </div>
        <h1 className="font-bold text-gray-700 text-lg">Page Builder</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {elements.length} Element
        </span>
        
        <button
          onClick={handleExport}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <span>💾</span> Export JSON
        </button>
      </div>
    </div>
  );
}