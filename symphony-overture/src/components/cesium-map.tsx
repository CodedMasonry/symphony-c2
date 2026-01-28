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
        baseLayerPicker: false,
        geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        scene3DOnly: true,
        globe: false,
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

      // Enable skybox
      if (viewerRef.current?.scene.skyAtmosphere) {
        viewerRef.current.scene.skyAtmosphere.show = true;
      }

      // Add Photorealistic 3D Tiles
      const addTileset = async () => {
        try {
          const tileset = await Cesium.createGooglePhotorealistic3DTileset({
            onlyUsingWithGoogleGeocoder: true,
          });
          // Corrected: Reference viewer.scene instead of a global scene
          viewerRef.current!.scene.primitives.add(tileset);
        } catch (error) {
          console.error("Error loading Photorealistic 3D Tiles:", error);
        }
      };

      addTileset();
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
