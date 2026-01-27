import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const CesiumMap = () => {
  const viewerRef = useRef(null);
  const cesiumContainerRef = useRef(null);

  useEffect(() => {
    // Set the base URL for Cesium static assets
    window.CESIUM_BASE_URL = "/cesiumStatic";

    // Set your Cesium Ion access token from environment variable
    // Get one for free at https://ion.cesium.com/
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

      // Optional: Set initial camera position
      viewerRef.current.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-74.006, 40.7128, 15000000), // NYC
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
      style={{
        width: "100%",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    />
  );
};

export default CesiumMap;
