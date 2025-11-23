"use client";

import Sidebar from "../../components/Sidebar";
import Canvas from "../../components/Canvas";
import PropertiesPanel from "../../components/PropertiesPanel"; 
export default function BuilderPage() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <Canvas />
      <PropertiesPanel /> {}
    </div>
  );
}