import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { useObjectsStore } from "@/stores/objectsStore";
import { ObjectWithUlid } from "@/lib/proto_api";
import { ObjectStatus } from "@/generated/base";
import { getBaseIcon, getDesignationColor } from "@/lib/icon-assets";

/* ───────────────────────── ICON CACHE ───────────────────────── */

const iconCache = new Map<string, HTMLCanvasElement>();

function iconKey(obj: ObjectWithUlid, selected: boolean) {
  return [obj.objectType, obj.designation, obj.status, selected].join("|");
}

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

async function buildIcon(obj: ObjectWithUlid, selected: boolean) {
  const key = iconKey(obj, selected);
  if (iconCache.has(key)) return iconCache.get(key)!;

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  const base = getBaseIcon(obj.objectType);
  if (base) {
    const img = await loadImage(base);
    ctx.drawImage(img, 0, 0, 64, 64);
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = getDesignationColor(obj.designation);
    ctx.fillRect(0, 0, 64, 64);
    ctx.globalCompositeOperation = "source-over";
  }

  if (selected) {
    const fg = getComputedStyle(document.documentElement)
      .getPropertyValue("--foreground")
      .trim();

    ctx.strokeStyle = fg || "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (obj.status === ObjectStatus.OBJECT_STATUS_ENGAGED) {
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, 32, 24, 0, Math.PI * 2);
    ctx.stroke();
  }

  iconCache.set(key, canvas);
  return canvas;
}

/* ───────────────────────── HOOK ───────────────────────── */

interface Options {
  viewer: Cesium.Viewer | null;
  selectedObjectId?: string | null;
  onObjectClick?: (o: ObjectWithUlid | null) => void;
  onObjectHover?: (
    o: ObjectWithUlid | null,
    position: { x: number; y: number } | null,
  ) => void;
}

export function useCesiumObjects({
  viewer,
  selectedObjectId,
  onObjectClick,
  onObjectHover,
}: Options) {
  const objects = useObjectsStore((s) => s.objects);
  const entityMap = useRef(new Map<string, Cesium.Entity>());
  const clickHandler = useRef<Cesium.ScreenSpaceEventHandler | null>(null);

  // Use refs to avoid recreating event handlers when callbacks change
  const onObjectClickRef = useRef(onObjectClick);
  const onObjectHoverRef = useRef(onObjectHover);

  useEffect(() => {
    onObjectClickRef.current = onObjectClick;
    onObjectHoverRef.current = onObjectHover;
  });

  useEffect(() => {
    if (!viewer) return;
    let cancelled = false;

    (async () => {
      for (const obj of objects) {
        if (cancelled) return;

        const position = Cesium.Cartesian3.fromDegrees(
          obj.longitude,
          obj.latitude,
          obj.altitude * 0.3048,
        );

        const isSelected = obj.ulidString === selectedObjectId;
        const icon = await buildIcon(obj, isSelected);
        if (cancelled) return;

        let entity = entityMap.current.get(obj.ulidString);

        if (!entity) {
          entity = viewer.entities.add({
            id: obj.ulidString,
            position: new Cesium.ConstantPositionProperty(position),
            billboard: {
              image: icon,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              disableDepthTestDistance: Infinity,
              scale: new Cesium.ConstantProperty(1.0),
              scaleByDistance: new Cesium.NearFarScalar(
                2_000,
                1.1,
                600_000,
                0.25,
              ),
            },
            properties: { objectData: obj },
          });

          entityMap.current.set(obj.ulidString, entity);
        } else {
          entity.position = new Cesium.ConstantPositionProperty(position);
          entity.billboard!.image = icon;
        }
      }

      viewer.scene.requestRender();
    })();

    return () => {
      cancelled = true;
    };
  }, [viewer, objects, selectedObjectId]);

  /* ───────────── Click & Hover Handling ───────────── */

  useEffect(() => {
    if (!viewer || clickHandler.current) return;

    clickHandler.current = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas,
    );

    let hoveredEntity: Cesium.Entity | null = null;

    // Click handler
    clickHandler.current.setInputAction((m) => {
      // Clear hover state on click
      if (hoveredEntity) {
        hoveredEntity.billboard!.scale = new Cesium.ConstantProperty(1.0);
        if (onObjectHoverRef.current) {
          onObjectHoverRef.current(null, null);
        }
        hoveredEntity = null;
      }

      const picked = viewer.scene.pick(m.position);
      const obj = picked?.id?.properties?.objectData?.getValue() ?? null;
      if (onObjectClickRef.current) {
        onObjectClickRef.current(obj);
      }
      viewer.scene.requestRender();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Hover handler
    clickHandler.current.setInputAction((movement) => {
      viewer.scene.requestRender();

      const picked = viewer.scene.pick(movement.endPosition);
      const newHovered = picked?.id ?? null;

      if (hoveredEntity !== newHovered) {
        // Mouse moved to different entity or empty space
        if (hoveredEntity) {
          hoveredEntity.billboard!.scale = new Cesium.ConstantProperty(1.0);
        }

        if (newHovered && newHovered.billboard) {
          // Mouse entered new entity
          newHovered.billboard.scale = new Cesium.ConstantProperty(1.15);
          viewer.scene.canvas.style.cursor = "pointer";

          const obj = newHovered.properties?.objectData?.getValue();
          if (obj && onObjectHoverRef.current) {
            onObjectHoverRef.current(obj, {
              x: movement.endPosition.x,
              y: movement.endPosition.y,
            });
          }
        } else {
          viewer.scene.canvas.style.cursor = "default";
          if (onObjectHoverRef.current) {
            onObjectHoverRef.current(null, null);
          }
        }

        hoveredEntity = newHovered;
      } else if (newHovered && onObjectHoverRef.current) {
        // Same entity, update position
        const obj = newHovered.properties?.objectData?.getValue();
        if (obj) {
          onObjectHoverRef.current(obj, {
            x: movement.endPosition.x,
            y: movement.endPosition.y,
          });
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    return () => {
      if (viewer.scene.canvas) {
        viewer.scene.canvas.style.cursor = "default";
      }
      if (onObjectHoverRef.current) {
        onObjectHoverRef.current(null, null);
      }
      clickHandler.current?.destroy();
      clickHandler.current = null;
    };
  }, [viewer]);
}
