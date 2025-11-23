"use client";

import Sidebar from "../../components/Sidebar";
import Canvas from "../../components/Canvas";
import PropertiesPanel from "../../components/PropertiesPanel";
import TopBar from "../../components/TopBar"; 
export default function BuilderPage() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Üst Menü (Sabit) */}
      <TopBar />
      
      {/* Alt Kısım (Paneller ve Canvas) */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}