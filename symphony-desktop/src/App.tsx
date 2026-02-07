import CesiumMap from "@/map/cesium-map";
import { TopBar } from "./components/top-bar";
import { ObjectListSidebar } from "./components/left-sidebar";

export function App() {
  return (
    <div className="flex flex-col bg-background text-foreground w-full h-screen overflow-hidden">
      <TopBar className="h-fit" />
      <div className="grid grid-cols-12 overflow-hidden h-full">
        <ObjectListSidebar className="col-span-2" />
        <CesiumMap className="col-span-10" />
      </div>
    </div>
  );
}

export default App;
