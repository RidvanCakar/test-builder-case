'use client';

export default function BuilderPage() {
  return (
    <div className="h-screen flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r bg-white p-4">
        <h2 className="font-semibold text-lg mb-4">Elementler</h2>

        <div className="space-y-2">
          <div className="border rounded px-3 py-2 cursor-pointer hover:bg-gray-50">
            Header
          </div>
          <div className="border rounded px-3 py-2 cursor-pointer hover:bg-gray-50">
            Card
          </div>
          <div className="border rounded px-3 py-2 cursor-pointer hover:bg-gray-50">
            Text
          </div>
          <div className="border rounded px-3 py-2 cursor-pointer hover:bg-gray-50">
            Slider
          </div>
          <div className="border rounded px-3 py-2 cursor-pointer hover:bg-gray-50">
            Footer
          </div>
        </div>
      </aside>

      {/* CANVAS */}
      <main className="flex-1 bg-gray-100 p-4">
        <h2 className="font-semibold text-lg mb-4">Canvas</h2>

        <div className="w-full h-[80vh] bg-white border-2 border-dashed rounded flex items-center justify-center">
          <span className="text-gray-400">
            Elements will be dropped here
          </span>
        </div>
      </main>
      
    </div>
  );
}
