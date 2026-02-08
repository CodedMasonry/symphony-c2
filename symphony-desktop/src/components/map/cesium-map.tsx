import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { cn } from "@/lib/utils";
import { useCesiumObjects } from "@/hooks/useCesiumObjects";
import { ObjectWithUlid } from "@/lib/proto_api";

interface CesiumMapProps extends React.ComponentProps<"div"> {
  onObjectSelect?: (obj: ObjectWithUlid | null) => void;
  selectedObjectId?: string | null;
}

function HoverTooltip({
  object,
  position,
}: {
  object: ObjectWithUlid;
  position: { x: number; y: number };
}) {
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: `${position.x + 15}px`, top: `${position.y + 15}px` }}
    >
      <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3 max-w-xs">
        <p className="font-semibold text-sm">
          {object.callsign || object.model || "Unknown"}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <span>{object.altitude.toFixed(0)} ft</span>
          <span>{object.heading.toFixed(0)}°</span>
          {object.speed && <span>{object.speed.toFixed(0)} kts</span>}
        </div>
      </div>
    </div>
  );
}

function CesiumMap({
  className,
  onObjectSelect,
  selectedObjectId,
  ...props
}: CesiumMapProps) {
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredObject, setHoveredObject] = useState<ObjectWithUlid | null>(
    null,
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    window.CESIUM_BASE_URL = "/cesiumStatic";
    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

    if (cesiumContainerRef.current && !viewerRef.current) {
      viewerRef.current = new Cesium.Viewer(cesiumContainerRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        selectionIndicator: false, // Disables the green box
        infoBox: false, // Disables the default "Tab" UI
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
      });

      viewerRef.current.scene.globe.depthTestAgainstTerrain = true;
      viewerRef.current.scene.requestRenderMode = true;
      viewerRef.current.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-115.0, 36.0, 500000),
      });
    }

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, []);

  const handleObjectClick = (obj: ObjectWithUlid) => {
    onObjectSelect?.(obj);
    if (viewerRef.current) {
      // Prevent Cesium from "locking on" and orbiting the object
      viewerRef.current.trackedEntity = undefined;

      const altitudeMeters = obj.altitude * 0.3048;
      const objectPosition = Cesium.Cartesian3.fromDegrees(
        obj.longitude,
        obj.latitude,
        altitudeMeters,
      );

      viewerRef.current.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(objectPosition, 10000),
        {
          duration: 1.5,
          offset: new Cesium.HeadingPitchRange(
            0,
            Cesium.Math.toRadians(-45),
            15000,
          ),
        },
      );
    }
  };

  useCesiumObjects({
    viewer: viewerRef.current,
    selectedObjectId,
    onObjectClick: handleObjectClick,
    onObjectHover: setHoveredObject,
  });

  return (
    <>
      <div
        ref={cesiumContainerRef}
        className={cn("w-full h-full", className)}
        {...props}
      />
      {hoveredObject && (
        <HoverTooltip object={hoveredObject} position={mousePosition} />
      )}
    </>
  );
}

export default CesiumMap;
