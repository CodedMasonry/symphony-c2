import CesiumMap from "./components/cesium-map";
import { LeftSidebar } from "./components/left-sidebar";
import { RightSideBar } from "./components/right-sidebar";
import { TopBar } from "./components/top-bar";

export function App() {
  return (
    <div className="flex flex-col bg-background text-foreground w-full h-screen overflow-hidden">
      <TopBar className="h-fit" />
      <div className="grid grid-cols-12 overflow-hidden h-full">
        <LeftSidebar className="col-span-2" />
        <CesiumMap className="col-span-10" />
      </div>
    </div>
  );
}

export default App;
