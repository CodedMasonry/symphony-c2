import { useEffect, useRef, useState, useCallback } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { cn } from "@/lib/utils";
import { useCesiumObjects } from "@/hooks/useCesiumObjects";
import { ObjectWithUlid } from "@/lib/proto_api";
import { ObjectHoverCard } from "@/components/map/object-hover-card";

interface CesiumMapProps extends React.ComponentProps<"div"> {
  onObjectSelect?: (obj: ObjectWithUlid | null) => void;
  selectedObjectId?: string | null;
}

export default function CesiumMap({
  className,
  onObjectSelect,
  selectedObjectId,
  ...props
}: CesiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [hoveredObject, setHoveredObject] = useState<{
    object: ObjectWithUlid;
    position: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;
    window.CESIUM_BASE_URL = "/cesiumStatic";
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
      destination: Cesium.Cartesian3.fromDegrees(-119, 30, 800_000),
      orientation: {
        pitch: Cesium.Math.toRadians(-45),
      },
    });
    viewerRef.current = viewer;
    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);

  const handleSelect = useCallback(
    (obj: ObjectWithUlid | null) => {
      setHoveredObject(null);

      onObjectSelect?.(obj);
      if (!obj || !viewerRef.current) return;
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
    [onObjectSelect],
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
    onObjectClick: handleSelect,
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
