import { useEffect, useRef, useState, useCallback } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { cn } from "@/lib/utils";
import { useCesiumObjects } from "@/hooks/useCesiumObjects";
import { ObjectWithUlid } from "@/lib/proto_api";
import { ObjectHoverCard } from "@/components/map/object-hover-card";

interface CesiumMapProps extends React.ComponentProps<"div"> {
  selectedObjectId?: string | null;
  onObjectSelect?: (objectId: string | null) => void;
  viewerRef?: { current: Cesium.Viewer | null };
}

export default function CesiumMap({
  className,
  selectedObjectId,
  onObjectSelect,
  viewerRef: externalViewerRef,
  ...props
}: CesiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalViewerRef = useRef<Cesium.Viewer | null>(null);

  // Use external ref if provided, otherwise use internal
  const viewerRef = externalViewerRef || internalViewerRef;

  const [hoveredObject, setHoveredObject] = useState<{
    object: ObjectWithUlid;
    position: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;
    (window as any).CESIUM_BASE_URL = "/cesiumStatic";
    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
    const viewer = new Cesium.Viewer(containerRef.current, {
      terrain: Cesium.Terrain.fromWorldTerrain(),
      selectionIndicator: false,
      infoBox: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
    });
    viewer.scene.requestRenderMode = true;
    viewer.scene.maximumRenderTimeChange = Infinity;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-75.0, 25.0, 2000000), // Long, Lat, Height (meters)
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-60.0),
        roll: 0.0,
      },
    });
    viewerRef.current = viewer;
    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [viewerRef]);

  // Handle single click - just select
  const handleClick = useCallback(
    (obj: ObjectWithUlid | null) => {
      setHoveredObject(null);
      onObjectSelect?.(obj?.ulidString ?? null);
    },
    [onObjectSelect],
  );

  // Handle double click - select and fly to
  const handleDoubleClick = useCallback(
    (obj: ObjectWithUlid | null) => {
      if (!obj || !viewerRef.current) return;
      setHoveredObject(null);

      // Select the object
      onObjectSelect?.(obj.ulidString);

      // Fly to the object
      const viewer = viewerRef.current;
      const position = Cesium.Cartesian3.fromDegrees(
        obj.longitude,
        obj.latitude,
        obj.altitude * 0.3048,
      );
      viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(position, 12_000),
        {
          duration: 1.1,
          offset: new Cesium.HeadingPitchRange(
            viewer.camera.heading,
            Cesium.Math.toRadians(-35),
            20_000,
          ),
        },
      );
    },
    [onObjectSelect, viewerRef],
  );

  const handleHover = useCallback(
    (obj: ObjectWithUlid | null, position: { x: number; y: number } | null) => {
      if (obj && position) {
        setHoveredObject({ object: obj, position });
      } else {
        setHoveredObject(null);
      }
    },
    [],
  );

  useCesiumObjects({
    viewer: viewerRef.current,
    selectedObjectId,
    onObjectClick: handleClick,
    onObjectDoubleClick: handleDoubleClick,
    onObjectHover: handleHover,
  });

  return (
    <>
      <div
        ref={containerRef}
        className={cn("w-full h-full", className)}
        {...props}
      />
      {hoveredObject && (
        <ObjectHoverCard
          object={hoveredObject.object}
          position={hoveredObject.position}
        />
      )}
    </>
  );
}
