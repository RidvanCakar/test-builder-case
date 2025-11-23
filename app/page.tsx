// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between text-white p-8">
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="text-center space-y-6 max-w-2xl px-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Drag & Drop Page Builder
          </h1>
          <p className="text-gray-400 text-lg">
            Frontend Developer Case Çalışması. Next.js, TypeScript ve TailwindCSS ile geliştirilmiştir.
          </p>
          
          <div className="pt-8">
            <Link 
              href="/builder" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
            >
              <span>🚀</span>
              <span>Uygulamayı Başlat</span>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left text-sm text-gray-400">
            <div className="p-4 bg-gray-800 rounded border border-gray-700">
              <h3 className="text-white font-bold mb-2">✅ Drag & Drop</h3>
              <p>HTML5 Native API kullanılarak geliştirilmiş sürükle-bırak motoru.</p>
            </div>
            <div className="p-4 bg-gray-800 rounded border border-gray-700">
              <h3 className="text-white font-bold mb-2">🎨 Özelleştirme</h3>
              <p>Elementleri seçip sağ panelden içerik ve boyutlarını değiştirebilirsin.</p>
            </div>
            <div className="p-4 bg-gray-800 rounded border border-gray-700">
              <h3 className="text-white font-bold mb-2">💾 JSON Export</h3>
              <p>Tasarımı case formatına uygun JSON olarak dışarı aktar.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full text-center py-4 border-t border-gray-800 mt-8">
        <p className="text-gray-500 text-sm">
          Rıdvan Çakar tarafından tasarlandı 2025
        </p>
      </footer>
    </div>
  );
}