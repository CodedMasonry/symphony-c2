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

    const { scene } = viewer;
    const { globe } = scene;

    // ── Rendering mode ────────────────────────────────────────────────────────
    // Disable requestRenderMode entirely. With requestRenderMode=true +
    // maximumRenderTimeChange=Infinity, Cesium skips frames while idle so
    // newly-loaded tiles never actually paint until the next user input —
    // that's the "pop-in flash" you were seeing. Continuous rendering at a
    // capped frame rate is smoother on common laptops.
    scene.requestRenderMode = false;
    viewer.targetFrameRate = 60;

    // ── Tile loading & cache ──────────────────────────────────────────────────
    // tileCacheSize default is 100 — far too small for a full-screen map.
    // Panning back to a visited area immediately re-fetches everything.
    globe.tileCacheSize = 400;

    // maximumScreenSpaceError controls tile LOD. Default is 2 (high detail).
    // 4 loads ~half the tiles with slightly coarser terrain — a good laptop
    // trade-off. Lower back to 2 if you need sharp close-up terrain.
    globe.maximumScreenSpaceError = 4;

    // Keep parent tiles resident so zooming in never shows a blank gap
    // while children load.
    globe.preloadAncestors = true;

    // Pre-fetch tiles adjacent to the current view while the camera is still.
    // Costs a little bandwidth upfront but eliminates pop-in during slow pans.
    globe.preloadSiblings = true;

    // How many tile children to load per frame. Lower values reduce frame
    // spikes; higher values resolve tiles faster. 20 is a balanced default.
    globe.loadingDescendantLimit = 20;

    // ── Tile request concurrency ──────────────────────────────────────────────
    // Default is 18. CDN-backed terrain/imagery can handle more; raise to 24
    // for faster initial load. Drop back to 12 if your tile server is
    // self-hosted and you see 429s.
    Cesium.RequestScheduler.maximumRequestsPerServer = 24;

    // ── Fog to hide unloaded distant tiles ───────────────────────────────────
    // Fog gracefully conceals tiles that haven't loaded yet at the horizon
    // and also raises the SSE for fogged geometry → fewer tiles needed there.
    scene.fog.enabled = true;
    scene.fog.density = 0.0002;
    scene.fog.screenSpaceErrorFactor = 4.0;

    // ── Scene quality ─────────────────────────────────────────────────────────
    globe.depthTestAgainstTerrain = true;

    // MSAA — smooths terrain edges on discrete GPUs. Set to 1 if you see
    // frame rate issues on integrated graphics (Intel Iris, etc.).
    scene.msaaSamples = 4;

    // FXAA is cheap post-process AA — good fallback for integrated GPUs.
    scene.postProcessStages.fxaa.enabled = true;

    // ── Disable expensive cosmetic features ───────────────────────────────────
    // Sun, moon, and skybox lighting are recalculated every frame. Disabling
    // them saves meaningful CPU/GPU time on common laptops. Re-enable if you
    // need accurate day/night or a star field.
    if (scene.sun) scene.sun.show = false;
    if (scene.moon) scene.moon.show = false;
    if (scene.skyBox) scene.skyBox.show = false;

    // Keep atmosphere — it's cheap and makes the globe look good.
    if (scene.skyAtmosphere) scene.skyAtmosphere.show = true;
    globe.showGroundAtmosphere = true;

    // ── Initial camera ────────────────────────────────────────────────────────
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-75.0, 25.0, 2_000_000),
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

  // ── Interaction handlers ───────────────────────────────────────────────────

  const handleClick = useCallback(
    (obj: ObjectWithUlid | null) => {
      setHoveredObject(null);
      onObjectSelect?.(obj?.ulidString ?? null);
    },
    [onObjectSelect],
  );

  const handleDoubleClick = useCallback(
    (obj: ObjectWithUlid | null) => {
      if (!obj || !viewerRef.current) return;
      setHoveredObject(null);
      onObjectSelect?.(obj.ulidString);

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
            Cesium.Math.toRadians(-75),
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
