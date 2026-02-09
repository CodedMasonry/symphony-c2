import { useState } from "react";
import CesiumMap from "@/components/map/cesium-map";
import { TopBar } from "./components/top-bar";
import { ObjectListSidebar } from "./components/object-list-sidebar";
import { useObjectsStore } from "@/stores/objectsStore";
import { useSidebarState } from "./components/object-list-sidebar/useSidebarState";
import { ObjectCard } from "@/components/object-list-sidebar/object-card";

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedUlid, setSelectedUlid] = useState<string | null>(null);

  const objects = useObjectsStore((state) => state.objects);
  const selectedObject = objects.find((obj) => obj.ulidString === selectedUlid);
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
          <CesiumMap
            className="w-full h-full"
            selectedObjectId={selectedUlid}
            onObjectSelect={(obj) => setSelectedUlid(obj?.ulidString || null)}
          />
        </div>

        {/* Floating UI Layer for Selected Object */}
        {selectedObject && (
          <div className="fixed top-20 right-4 z-40 w-80 animate-in fade-in slide-in-from-right-4">
            <div className="relative">
              <button
                onClick={() => setSelectedUlid(null)}
                className="absolute -top-2 -right-2 z-50 h-6 w-6 rounded-full bg-background border shadow-md hover:bg-accent flex items-center justify-center text-muted-foreground"
              >
                ✕
              </button>
              <ObjectCard object={selectedObject} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
