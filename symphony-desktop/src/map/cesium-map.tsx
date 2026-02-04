import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { cn } from "@/lib/utils";

// Extend Window interface for CESIUM_BASE_URL
declare global {
  interface Window {
    CESIUM_BASE_URL: string;
  }
}

function CesiumMap({ className, ...props }: React.ComponentProps<"div">) {
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const cesiumContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Base URL for Cesium static assets
    window.CESIUM_BASE_URL = "/cesiumStatic";

    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

    // Initialize the Cesium Viewer
    if (cesiumContainerRef.current && !viewerRef.current) {
      viewerRef.current = new Cesium.Viewer(cesiumContainerRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
      });

      // Default position
      viewerRef.current.camera.setView({
        destination: new Cesium.Cartesian3(
          -2710292.813384663,
          -4360657.061518585,
          3793571.786860543,
        ),
        orientation: new Cesium.HeadingPitchRoll(
          5.794062761901799,
          -0.30293409742984756,
          0.0009187098191985044,
        ),
      });

      // Set initial camera position
      viewerRef.current.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-74.006, 40.7128, 3000000), // NYC
      });
    }

    // Cleanup on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={cesiumContainerRef}
      className={cn("w-full h-full m-0 p-0", className)}
      {...props}
    />
  );
}

export default CesiumMap;
