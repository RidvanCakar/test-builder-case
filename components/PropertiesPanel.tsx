// src/components/PropertiesPanel.tsx
import React from 'react';
import { useBuilder } from '../context/BuilderContext';

export default function PropertiesPanel() {
  const { selectedElement, elements, updateElement, removeElement } = useBuilder();

  // Seçili elementi bul
  const element = elements.find((el) => el.id === selectedElement);

  if (!element) {
    return (
      <div className="w-64 bg-white border-l border-gray-200 h-screen p-4">
        <p className="text-gray-400 text-sm text-center mt-10">
          Düzenlemek için bir element seçin.
        </p>
      </div>
    );
  }

  // Input değiştiğinde çalışacak
  const handleChange = (field: string, value: any, isPosition = false, isContent = false) => {
    // DÜZELTME: Eğer değer sadece sayıdan oluşuyorsa (örn "300"), bunu Number türüne çeviriyoruz.
    // Böylece React bunu "300px" olarak algılayıp css'i düzeltecek.
    // Ama "100%" gibi değerler gelirse string olarak kalacak.
    let finalValue = value;
    if (isPosition && !isNaN(Number(value)) && value !== '') {
        finalValue = Number(value);
    }

    if (isPosition) {
      updateElement(element.id, {
        position: { ...element.position, [field]: finalValue }
      });
    } else if (isContent) {
      updateElement(element.id, {
        content: { ...element.content, [field]: finalValue }
      });
    }
  };

  return (
    <div className="w-72 bg-white border-l border-gray-200 h-screen p-4 overflow-y-auto shadow-xl z-50">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="font-bold text-gray-800">Özellikler</h2>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded uppercase">
          {element.type}
        </span>
      </div>

      <div className="space-y-6">
        
        {/* İçerik Düzenleme */}
        <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase">İçerik</label>
            
            {(element.type === 'text-content' || element.type === 'header') && (
                <input
                type="text"
                value={element.content.text || ''}
                onChange={(e) => handleChange('text', e.target.value, false, true)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Metin giriniz"
                />
            )}

            {element.type === 'card' && (
                <>
                    <input
                    type="text"
                    value={element.content.title || ''}
                    onChange={(e) => handleChange('title', e.target.value, false, true)}
                    className="w-full p-2 border rounded text-sm mb-2"
                    placeholder="Başlık"
                    />
                    <textarea
                    value={element.content.description || ''}
                    onChange={(e) => handleChange('description', e.target.value, false, true)}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Açıklama"
                    rows={3}
                    />
                </>
            )}
        </div>

        {/* Boyut ve Konum */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-500 uppercase">Boyut & Konum</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-gray-400">X</span>
              <input
                type="number"
                value={element.position.x}
                onChange={(e) => handleChange('x', e.target.value, true)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <span className="text-xs text-gray-400">Y</span>
              <input
                type="number"
                value={element.position.y} // DÜZELTME: readOnly kalktı
                onChange={(e) => handleChange('y', e.target.value, true)} // onChange eklendi
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <span className="text-xs text-gray-400">Genişlik</span>
              <input
                type="text"
                value={element.position.width}
                onChange={(e) => handleChange('width', e.target.value, true)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <span className="text-xs text-gray-400">Yükseklik</span>
              <input
                type="text"
                value={element.position.height}
                onChange={(e) => handleChange('height', e.target.value, true)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Silme Butonu */}
        <button
          onClick={() => removeElement(element.id)}
          className="w-full py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors text-sm font-medium mt-8"
        >
          Elementi Sil
        </button>

      </div>
    </div>
  );
}