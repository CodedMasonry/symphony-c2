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

    for (const obj of objects) {
      liveIds.add(obj.ulidString);

      const cartesian = Cesium.Cartesian3.fromDegrees(
        obj.longitude,
        obj.latitude,
        obj.altitude * 0.3048, // ft → metres
      );

      const isSelected = obj.ulidString === selectedObjectId;
      const icon = buildIcon(obj, isSelected);

      let entity = entityMap.current.get(obj.ulidString);

      if (!entity) {
        entity = viewer.entities.add({
          id: obj.ulidString,
          position: new Cesium.ConstantPositionProperty(cartesian),
          billboard: {
            image: new Cesium.ConstantProperty(icon),
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            disableDepthTestDistance: Infinity,
            scaleByDistance: new Cesium.NearFarScalar(2_000, 1.4, 800_000, 0.4),
          },
          properties: { objectData: obj },
        });

        entityMap.current.set(obj.ulidString, entity);
      } else {
        entity.position = new Cesium.ConstantPositionProperty(cartesian);
        entity.billboard!.image = new Cesium.ConstantProperty(icon);
        entity.properties!.objectData = obj;
      }
    }

    // Remove stale entities
    for (const [id, entity] of entityMap.current) {
      if (!liveIds.has(id)) {
        viewer.entities.remove(entity);
        entityMap.current.delete(id);
      }
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

    clickHandler.current.setInputAction(
      (e: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
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
      clickHandler.current?.destroy();
      clickHandler.current = null;
    };
  }, [viewer]);
}
