// src/components/PropertiesPanel.tsx
import React from 'react';
import { useBuilder } from '../context/BuilderContext';

export default function PropertiesPanel() {
  const { selectedElement, elements, updateElement, removeElement } = useBuilder();

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

  const handleChange = (field: string, value: any, isPosition = false, isContent = false) => {
    let finalValue = value;
    // Sayısal değer kontrolü
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

  // --- KATMAN (Z-INDEX) YÖNETİMİ ---
  const handleBringToFront = () => {
    const maxZ = Math.max(...elements.map((el) => el.position.zIndex), 0);
    updateElement(element.id, {
      position: { ...element.position, zIndex: maxZ + 1 }
    });
  };

  const handleSendToBack = () => {
    const minZ = Math.min(...elements.map((el) => el.position.zIndex), 1);
    const newZ = minZ > 1 ? minZ - 1 : 1;
    updateElement(element.id, {
      position: { ...element.position, zIndex: newZ }
    });
  };

  return (
    <div className="w-72 bg-white border-l border-gray-200 h-screen p-4 overflow-y-auto shadow-xl z-50 flex flex-col">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="font-bold text-gray-800">Özellikler</h2>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded uppercase">
          {element.type}
        </span>
      </div>

      <div className="space-y-6 flex-1">
        
        {/* --- İÇERİK DÜZENLEME KISSMI --- */}
        <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase">İçerik</label>
            
            {/* Metin Alanı */}  
            {(element.type === 'text-content' || element.type === 'header' || element.type === 'footer' || element.type === 'slider') && (
                <div className="space-y-1">
                    <span className="text-xs text-gray-400">Yazı İçeriği</span>
                    <input
                        type="text"
                        value={element.content.text || ''}
                        onChange={(e) => handleChange('text', e.target.value, false, true)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Metin giriniz"
                    />
                </div>
            )}

            {/* RESİM URL ALANI (Card ve Slider için) */}
            {(element.type === 'card' || element.type === 'slider') && (
                <div className="space-y-2 pt-2">
                    <span className="text-xs text-gray-400">Görsel URL (Link)</span>
                    <input
                        type="text"
                        value={element.content.image || ''}
                        onChange={(e) => handleChange('image', e.target.value, false, true)}
                        className="w-full p-2 border rounded text-sm bg-gray-50"
                        placeholder="https://ornek.com/resim.jpg"
                    />
                    <p className="text-[10px] text-gray-400">Not: .jpg, .png gibi doğrudan resim linki girin.</p>
                </div>
            )}

            {/* Card Özel Alanları */}
            {element.type === 'card' && (
                <>
                    <div className="space-y-1 pt-2">
                        <span className="text-xs text-gray-400">Kart Başlığı</span>
                        <input
                            type="text"
                            value={element.content.title || ''}
                            onChange={(e) => handleChange('title', e.target.value, false, true)}
                            className="w-full p-2 border rounded text-sm"
                            placeholder="Başlık"
                        />
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-400">Açıklama</span>
                        <textarea
                            value={element.content.description || ''}
                            onChange={(e) => handleChange('description', e.target.value, false, true)}
                            className="w-full p-2 border rounded text-sm"
                            placeholder="Açıklama"
                            rows={3}
                        />
                    </div>
                </>
            )}
        </div>

        {/* --- BOYUT VE KONUM --- */}
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
                value={element.position.y}
                onChange={(e) => handleChange('y', e.target.value, true)}
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

        {/* --- KATMAN YÖNETİMİ --- */}
        <div className="space-y-3 pt-4 border-t">
            <label className="text-xs font-semibold text-gray-500 uppercase">Katman (Z-Index)</label>
            <div className="flex gap-2">
                <button 
                    onClick={handleSendToBack}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
                >
                    Arkaya Gönder
                </button>
                <button 
                    onClick={handleBringToFront}
                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded transition-colors"
                >
                    Öne Getir
                </button>
            </div>
             <div className="text-center text-xs text-gray-400 mt-1">
                Mevcut Değer: {element.position.zIndex}
            </div>
        </div>

        {/* --- SİLME BUTONU --- */}
        <button
          onClick={() => removeElement(element.id)}
          className="w-full py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors text-sm font-medium mt-4"
        >
          Elementi Sil
        </button>

      </div>
    </div>
  );
}