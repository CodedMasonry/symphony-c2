import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

import { useObjectsStore } from "@/stores/objectsStore";
import { ObjectWithUlid } from "@/lib/proto_api";
import { buildIcon } from "./icons";

interface Options {
  viewer: Cesium.Viewer | null;
  selectedObjectId?: string | null;
  onObjectClick?: (o: ObjectWithUlid | null) => void;
  onObjectDoubleClick?: (o: ObjectWithUlid | null) => void;
  onObjectHover?: (
    o: ObjectWithUlid | null,
    position: { x: number; y: number } | null,
  ) => void;
}

// Reusable scratch Cartesian3 — avoids allocating a new object every sync cycle
const scratchCartesian = new Cesium.Cartesian3();

export function useCesiumObjects({
  viewer,
  selectedObjectId,
  onObjectClick,
  onObjectDoubleClick,
  onObjectHover,
}: Options) {
  const objects = useObjectsStore((s) => s.objects);
  const entityMap = useRef(new Map<string, Cesium.Entity>());
  const clickHandler = useRef<Cesium.ScreenSpaceEventHandler | null>(null);

  // Keep stable refs so event handlers never need to be re-registered when
  // callbacks change identity (e.g. on parent re-render).
  const onObjectClickRef = useRef(onObjectClick);
  const onObjectDoubleClickRef = useRef(onObjectDoubleClick);
  const onObjectHoverRef = useRef(onObjectHover);

  useEffect(() => {
    onObjectClickRef.current = onObjectClick;
    onObjectDoubleClickRef.current = onObjectDoubleClick;
    onObjectHoverRef.current = onObjectHover;
  });

  // ── Sync objects → Cesium entities ──────────────────────────────────────
  useEffect(() => {
    if (!viewer) return;

    const liveIds = new Set<string>();
    const toAdd: Cesium.Entity.ConstructorOptions[] = [];
    const toRemove: Cesium.Entity[] = [];

    for (const obj of objects) {
      liveIds.add(obj.ulidString);

      // Compute position into scratch to avoid a heap allocation per object.
      // We only copy it into a new Cartesian3 when we actually need to store it.
      Cesium.Cartesian3.fromDegrees(
        obj.longitude,
        obj.latitude,
        obj.altitude * 0.3048,
        Cesium.Ellipsoid.WGS84,
        scratchCartesian,
      );

      const isSelected = obj.ulidString === selectedObjectId;
      const icon = buildIcon(obj, isSelected);

      const entity = entityMap.current.get(obj.ulidString);

      if (!entity) {
        // Queue for batched add rather than calling viewer.entities.add in a loop
        toAdd.push({
          id: obj.ulidString,
          position: new Cesium.ConstantPositionProperty(
            Cesium.Cartesian3.clone(scratchCartesian),
          ),
          billboard: {
            image: new Cesium.ConstantProperty(icon),
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            disableDepthTestDistance: Infinity,
            scaleByDistance: new Cesium.NearFarScalar(2_000, 1.4, 800_000, 0.4),
          },
          properties: { objectData: obj },
        });
      } else {
        // Mutate the underlying value instead of replacing the whole property
        // object — avoids triggering Cesium's internal change-detection cascade.
        (entity.position as Cesium.ConstantPositionProperty).setValue(
          Cesium.Cartesian3.clone(scratchCartesian),
        );

        // Only rebuild the icon when selection state or object data actually
        // changed — buildIcon likely does canvas work so skip it when possible.
        const currentIcon = (
          entity.billboard!.image as Cesium.ConstantProperty
        ).getValue(Cesium.JulianDate.now());
        if (currentIcon !== icon) {
          (entity.billboard!.image as Cesium.ConstantProperty).setValue(icon);
        }

        entity.properties!.objectData = obj;
      }
    }

    // Collect stale entities for batched removal
    for (const [id, entity] of entityMap.current) {
      if (!liveIds.has(id)) {
        toRemove.push(entity);
        entityMap.current.delete(id);
      }
    }

    // Batch all adds and removes inside suspendEvents so Cesium only rebuilds
    // its internal scene graph once rather than once per entity.
    if (toAdd.length > 0 || toRemove.length > 0) {
      viewer.entities.suspendEvents();

      for (const def of toAdd) {
        const entity = viewer.entities.add(def);
        entityMap.current.set(def.id as string, entity);
      }

      for (const entity of toRemove) {
        viewer.entities.remove(entity);
      }

      viewer.entities.resumeEvents();
    }

    viewer.scene.requestRender();
  }, [viewer, objects, selectedObjectId]);

  // ── Input handlers ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!viewer || clickHandler.current) return;

    clickHandler.current = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas,
    );

    clickHandler.current.setInputAction(
      (e: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = viewer.scene.pick(e.position);
        const obj = picked?.id?.properties?.objectData?.getValue() ?? null;
        onObjectClickRef.current?.(obj);
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    );

    clickHandler.current.setInputAction(
      (e: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = viewer.scene.pick(e.position);
        const obj = picked?.id?.properties?.objectData?.getValue() ?? null;
        onObjectDoubleClickRef.current?.(obj);
      },
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    );

    // Throttle hover hit-testing to 40ms (~25fps). scene.pick() does a GPU
    // readback which is expensive — firing it on every mousemove (potentially
    // 200+ times/sec) is a significant frame budget drain on integrated GPUs.
    let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

    clickHandler.current.setInputAction(
      (e: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        if (hoverTimeout !== null) return;

        hoverTimeout = setTimeout(() => {
          hoverTimeout = null;
        }, 40);

        const picked = viewer.scene.pick(e.endPosition);
        const obj = picked?.id?.properties?.objectData?.getValue() ?? null;
        onObjectHoverRef.current?.(
          obj,
          obj ? { x: e.endPosition.x, y: e.endPosition.y } : null,
        );
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    );

    return () => {
      if (hoverTimeout !== null) clearTimeout(hoverTimeout);
      clickHandler.current?.destroy();
      clickHandler.current = null;
    };
  }, [viewer]);
}
