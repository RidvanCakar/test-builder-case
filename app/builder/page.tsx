"use client";

import Sidebar from "../../components/Sidebar";
import Canvas from "../../components/Canvas";

export default function BuilderPage() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <Canvas />
    </div>
  );
}