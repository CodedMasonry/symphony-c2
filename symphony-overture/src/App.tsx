import CesiumMap from "./components/cesium-map";
import { LeftSidebar } from "./components/left-sidebar";
import { RightSideBar } from "./components/right-sidebar";
import { TopBar } from "./components/top-bar";

export function App() {
  return (
    <div className="dark flex flex-col bg-background w-full h-screen overflow-hidden">
      <TopBar className="h-8" />
      <div className="grid grid-cols-12 overflow-hidden h-full pb-8">
        <LeftSidebar className="col-span-1" />
        <CesiumMap className="col-span-10" />
        <RightSideBar className="col-span-1" />
      </div>
    </div>
  );
}

export default App;
