'use client';

import React, { useState, useRef, useEffect } from 'react';

/** CASE DOKÜMANINA GÖRE TİPLER **/

type ElementType = 'header' | 'footer' | 'card' | 'text-content' | 'slider';

interface Position {
  x: number;                // canvas içi px
  y: number;                // canvas içi px
  width: number | string;   // px veya %
  height: number | string;  // px veya auto
  zIndex: number;
}

interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
}

interface HeaderElement extends BaseElement {
  type: 'header';
  content: {
    text: string;
    style: string;
  };
}

interface CardElement extends BaseElement {
  type: 'card';
  content: {
    title: string;
    description: string;
    image: string | null;
  };
}

interface TextContentElement extends BaseElement {
  type: 'text-content';
  content: {
    html: string;
    plainText: string;
  };
}

interface FooterElement extends BaseElement {
  type: 'footer';
  content: {
    copyright: string;
    links: string[];
  };
}

interface SliderElement extends BaseElement {
  type: 'slider';
  content: {
    images: string[];
  };
}

type BuilderElement =
  | HeaderElement
  | CardElement
  | TextContentElement
  | FooterElement
  | SliderElement;

/** SIDEBAR İÇİN LİSTE **/

const PALETTE_ITEMS: { label: string; type: ElementType }[] = [
  { label: 'Header', type: 'header' },
  { label: 'Card', type: 'card' },
  { label: 'Text Content', type: 'text-content' },
  { label: 'Slider', type: 'slider' },
  { label: 'Footer', type: 'footer' },
];

/** TYPE’A GÖRE DEFAULT ELEMENT OLUŞTURMA **/

function createDefaultElement(
  type: ElementType,
  dropX: number,
  dropY: number,
  nextZ: number
): BuilderElement {
  const id = `elem_${type}_${crypto.randomUUID().slice(0, 4)}`;

  // header / footer için case’teki varsayılan davranış
  if (type === 'header') {
    const element: HeaderElement = {
      id,
      type,
      content: {
        text: 'Site Başlığı',
        style: 'default',
      },
      position: {
        x: 0,
        y: 0,
        width: '100%',
        height: 80,
        zIndex: nextZ,
      },
    };
    return element;
  }

  if (type === 'footer') {
    const element: FooterElement = {
      id,
      type,
      content: {
        copyright: '© 2024 Test Builder',
        links: [],
      },
      position: {
        x: 0,
        y: dropY, // previewde nereye bırakırsan oraya ama width/height sabit
        width: '100%',
        height: 60,
        zIndex: nextZ,
      },
    };
    return element;
  }

  if (type === 'card') {
    const element: CardElement = {
      id,
      type,
      content: {
        title: 'Card Title',
        description: 'İçerik açıklaması buraya gelecek',
        image: null,
      },
      position: {
        x: dropX,
        y: dropY,
        width: 300,
        height: 200,
        zIndex: nextZ,
      },
    };
    return element;
  }

  if (type === 'text-content') {
    const element: TextContentElement = {
      id,
      type,
      content: {
        html: '<p>Metin içeriği buraya gelecek</p>',
        plainText: 'Metin içeriği buraya gelecek',
      },
      position: {
        x: dropX,
        y: dropY,
        width: 'auto/flexible',
        height: 'auto',
        zIndex: nextZ,
      },
    };
    return element;
  }

  // slider
  const element: SliderElement = {
    id,
    type: 'slider',
    content: {
      images: [],
    },
    position: {
      x: 0,
      y: dropY,
      width: '100%',
      height: 400,
      zIndex: nextZ,
    },
  };
  return element;
}

/** ANA COMPONENT **/

export default function BuilderPage() {
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [isOver, setIsOver] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [nextZIndex, setNextZIndex] = useState(1);

  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Sidebar’dan sürükleme
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    type: ElementType
  ) => {
    e.dataTransfer.setData('element-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Canvas üzerinde sürüklerken
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  // Canvas’a bırakınca
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);

    const type = e.dataTransfer.getData('element-type') as ElementType | '';
    if (!type) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement = createDefaultElement(type, x, y, nextZIndex);

    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
    setNextZIndex((prev) => prev + 1);
  };

  // Seçim
  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  // Delete tuşu ile sil
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) {
        setElements((prev) => prev.filter((el) => el.id !== selectedId));
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId]);

  // Sidebar’daki delete butonu
  const handleDeleteClick = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  // JSON export (şimdilik ham state; bir sonraki adımda case formatına sokacağız)
  const handleExport = () => {
    const exported = JSON.stringify(elements, null, 2);
    navigator.clipboard.writeText(exported);
    console.log('EXPORT JSON (raw elements):', exported);
    alert('✅ JSON export edildi ve panoya kopyalandı!');
  };

  return (
    <div className="h-screen flex">
      {/* SIDEBAR */}
      <aside className="w-72 border-r bg-white p-4">
        <h2 className="font-semibold text-lg mb-4">Elementler</h2>

        <div className="space-y-3 mb-6">
          {PALETTE_ITEMS.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              className="border rounded px-3 py-2 cursor-grab active:cursor-grabbing hover:bg-gray-50 text-sm"
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className="border-t pt-4 text-xs space-y-2">
          <div className="font-semibold">Selection</div>
          <div>
            {selectedElement ? (
              <>
                <div>
                  Type: <b>{selectedElement.type.toUpperCase()}</b>
                </div>
                <div className="text-[11px] text-gray-500">
                  X:{' '}
                  {Math.round(
                    typeof selectedElement.position.x === 'number'
                      ? selectedElement.position.x
                      : 0
                  )}{' '}
                  / Y:{' '}
                  {Math.round(
                    typeof selectedElement.position.y === 'number'
                      ? selectedElement.position.y
                      : 0
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-500">No element selected</div>
            )}
          </div>

          <button
            onClick={handleDeleteClick}
            disabled={!selectedId}
            className={`mt-2 w-full rounded px-2 py-1 text-xs border ${
              selectedId
                ? 'border-red-500 text-red-600 hover:bg-red-50'
                : 'border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            Delete selected (Del)
          </button>

          <button
            onClick={handleExport}
            disabled={elements.length === 0}
            className={`mt-3 w-full rounded px-2 py-1 text-xs border ${
              elements.length > 0
                ? 'border-green-600 text-green-600 hover:bg-green-50'
                : 'border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            Export Layout as JSON
          </button>
        </div>
      </aside>

      {/* CANVAS */}
      <main className="flex-1 bg-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Canvas</h2>
          <div className="text-xs text-gray-500">
            İpucu: Bir elementi tıkla → seç, sürükle → taşı, Delete ile sil
          </div>
        </div>

        <div
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onMouseMove={(e) => {
            if (!draggingId) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - offset.x;
            const y = e.clientY - rect.top - offset.y;

            setElements((prev) =>
              prev.map((el) =>
                el.id === draggingId
                  ? {
                      ...el,
                      position: {
                        ...el.position,
                        x,
                        y,
                      },
                    }
                  : el
              )
            );
          }}
          onMouseUp={() => {
            setDraggingId(null);
          }}
          className={`relative w-full h-[80vh] rounded border-2 border-dashed transition-colors ${
            isOver ? 'border-blue-500 bg-blue-50/40' : 'border-gray-400 bg-white'
          }`}
        >
          {elements.map((el) => {
            const isSelected = el.id === selectedId;

            const style: React.CSSProperties = {
              position: 'absolute',
              left: el.position.x,
              top: el.position.y,
              width:
                typeof el.position.width === 'number'
                  ? `${el.position.width}px`
                  : el.position.width,
              height:
                typeof el.position.height === 'number'
                  ? `${el.position.height}px`
                  : el.position.height,
              zIndex: el.position.zIndex,
            };

            const baseClasses =
              'absolute border bg-white rounded shadow text-xs cursor-move transition-colors flex items-center justify-center';

            // Header render
            if (el.type === 'header') {
              const h = el as HeaderElement;
              return (
                <div
                  key={el.id}
                  style={style}
                  onMouseDown={(e) => {
                    handleSelect(el.id);
                    setDraggingId(el.id);
                    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
                    setOffset({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }}
                  className={`${baseClasses} px-4 font-semibold ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-300 bg-slate-900 text-white'
                      : 'border-gray-300 bg-slate-900 text-white'
                  }`}
                >
                  {h.content.text}
                </div>
              );
            }

            // Card render
            if (el.type === 'card') {
              const c = el as CardElement;
              return (
                <div
                  key={el.id}
                  style={style}
                  onMouseDown={(e) => {
                    handleSelect(el.id);
                    setDraggingId(el.id);
                    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
                    setOffset({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }}
                  className={`${baseClasses} flex-col items-start px-3 py-2 ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-300'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-xs mb-1">{c.content.title}</div>
                  <div className="text-[11px] text-gray-600">
                    {c.content.description}
                  </div>
                </div>
              );
            }

            // Text content render
            if (el.type === 'text-content') {
              const t = el as TextContentElement;
              return (
                <div
                  key={el.id}
                  style={style}
                  onMouseDown={(e) => {
                    handleSelect(el.id);
                    setDraggingId(el.id);
                    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
                    setOffset({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }}
                  className={`${baseClasses} px-3 py-2 justify-start text-[11px] ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-300'
                      : 'border-gray-300'
                  }`}
                >
                  {t.content.plainText}
                </div>
              );
            }

            // Footer & Slider: basit placeholder
            return (
              <div
                key={el.id}
                style={style}
                onMouseDown={(e) => {
                  handleSelect(el.id);
                  setDraggingId(el.id);
                  const rect = (e.target as HTMLDivElement).getBoundingClientRect();
                  setOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }}
                className={`${baseClasses} px-3 py-2 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-300'
                    : 'border-gray-300'
                }`}
              >
                {el.type.toUpperCase()}
              </div>
            );
          })}

          {elements.length === 0 && (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">
              Sağdan bir element sürükleyip bırak
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
