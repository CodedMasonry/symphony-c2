import { useState } from "react";
import CesiumMap from "@/map/cesium-map";
import { TopBar } from "./components/top-bar";
import { ObjectListSidebar } from "./components/left-sidebar";

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col bg-background text-foreground w-full h-screen overflow-hidden">
      <TopBar className="h-fit z-20" /> {/* Higher z-index to stay on top */}
      <div className="relative flex-1 overflow-hidden">
        <ObjectListSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          className="z-10"
        />

        <div className="absolute inset-0">
          <CesiumMap className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default App;
