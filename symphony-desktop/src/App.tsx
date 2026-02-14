import { useState, useRef } from "react";
import * as Cesium from "cesium";
import CesiumMap from "@/components/map/cesium-map";
import { TopBar } from "./components/top-bar";
import { ObjectListSidebar } from "./components/object-list-sidebar";
import { useObjectsStore } from "@/stores/objectsStore";
import { useSidebarState } from "./components/object-list-sidebar/useSidebarState";
import { useObjectSelection } from "@/hooks/useObjectSelection";
import { SelectionSideBar } from "./components/selection-sidebar";

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  const objects = useObjectsStore((state) => state.objects);
  const { filteredCount } = useSidebarState(objects);

  const { selectedObjectId, selectObject, flyToObject } = useObjectSelection({
    viewer: viewerRef.current,
  });

  const selectedObject = objects.find(
    (obj) => obj.ulidString === selectedObjectId,
  );

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
        <ObjectListSidebar
          isOpen={isSidebarOpen}
          className="z-10"
          selectedObjectId={selectedObjectId}
          onObjectSelect={selectObject}
          onObjectFlyTo={flyToObject}
        />
        <div className="absolute inset-0">
          <CesiumMap
            className="w-full h-full"
            selectedObjectId={selectedObjectId}
            onObjectSelect={selectObject}
            viewerRef={viewerRef}
          />
        </div>
        {selectedObject && (
          <SelectionSideBar
            selectedObject={selectedObject}
            selectObject={selectObject}
          />
        )}
      </div>
    </div>
  );
}

export default App;
