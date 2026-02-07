import { useState } from "react";
import CesiumMap from "@/components/map/cesium-map";
import { TopBar } from "./components/top-bar";
import { ObjectListSidebar } from "./components/left-sidebar";
import { useObjectsStore } from "@/lib/stores/objectsStore";
import { useSidebarState } from "./components/left-sidebar/useSidebarState";

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const objects = useObjectsStore((state) => state.objects);
  const { filteredCount } = useSidebarState(objects);

  return (
    <div className="flex flex-col bg-background text-foreground w-full h-screen overflow-hidden">
      <TopBar
        className="h-fit z-20"
        isObjectListOpen={isSidebarOpen}
        onToggleObjectList={() => setIsSidebarOpen(!isSidebarOpen)}
        objectCount={objects.length}
        filteredObjectCount={filteredCount}
      />
      <div className="relative flex-1 overflow-hidden">
        <ObjectListSidebar isOpen={isSidebarOpen} className="z-10" />
        <div className="absolute inset-0">
          <CesiumMap className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default App;
