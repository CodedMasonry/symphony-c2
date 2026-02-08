import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { useObjectsStore } from "@/stores/objectsStore";
import { ObjectWithUlid } from "@/lib/proto_api";
import { ObjectDesignation, ObjectStatus, ObjectType } from "@/generated/base";
import { getBaseIcon, getDesignationColor } from "@/lib/icon-assets";

/**
 * Creates a canvas overlay for state indicators (targeted, engaged)
 * Selected state is shown via the ObjectCard UI instead
 */
function createStateOverlay(
  isTargeted: boolean,
  isEngaged: boolean,
  size: number = 64,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 6;

  // Targeted: Dashed circle
  if (isTargeted) {
    ctx.strokeStyle = "#FF6B6B"; // Red
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]); // Reset
  }

  // Engaged: Pulsing solid circle (animated via Cesium properties)
  if (isEngaged) {
    ctx.strokeStyle = "#FF3333"; // Bright red
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 2, 0, 2 * Math.PI);
    ctx.stroke();
  }

  return canvas;
}

/**
 * Composites the base icon with designation color and state overlays
 */
async function createCompositeIcon(
  baseIconUrl: string,
  designationColor: string,
  isTargeted: boolean,
  isEngaged: boolean,
): Promise<HTMLCanvasElement> {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Load base SVG
  const img = await loadImage(baseIconUrl);

  // Draw with designation color tint
  ctx.save();

  // Draw the icon
  ctx.drawImage(img, 0, 0, size, size);

  // Apply color overlay using composite operation
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = designationColor;
  ctx.fillRect(0, 0, size, size);

  ctx.restore();

  // Draw state overlay if needed (targeted or engaged)
  if (isTargeted || isEngaged) {
    const overlay = createStateOverlay(isTargeted, isEngaged, size);
    ctx.drawImage(overlay, 0, 0);
  }

  return canvas;
}

/**
 * Helper to load an image
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

interface IconConfig {
  image: HTMLCanvasElement | string;
  scale: number;
}

/**
 * Get icon configuration for an object
 */
async function getIconForObject(
  obj: ObjectWithUlid,
  isTargeted: boolean,
): Promise<IconConfig> {
  const baseIcon = getBaseIcon(obj.objectType);

  if (!baseIcon) {
    // Fallback to simple canvas icon if no SVG available
    const canvas = createFallbackIcon(obj.designation, obj.objectType);
    return { image: canvas, scale: 1.0 };
  }

  const designationColor = getDesignationColor(obj.designation);
  const isEngaged = obj.status === ObjectStatus.OBJECT_STATUS_ENGAGED;

  const compositeIcon = await createCompositeIcon(
    baseIcon,
    designationColor,
    isTargeted,
    isEngaged,
  );

  return {
    image: compositeIcon,
    scale: 1.0,
  };
}

/**
 * Fallback icon when SVG not available
 */
function createFallbackIcon(
  designation: ObjectDesignation,
  objectType: ObjectType,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const size = 48;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const centerX = size / 2;
  const centerY = size / 2;

  // Color by designation
  let color = "#ff4444";
  switch (designation) {
    case ObjectDesignation.OBJECT_DESIGNATION_FRIENDLY:
      color = "#4444ff";
      break;
    case ObjectDesignation.OBJECT_DESIGNATION_ALLY:
      color = "#44ff44";
      break;
    case ObjectDesignation.OBJECT_DESIGNATION_CIVILIAN:
      color = "#ffff44";
      break;
  }

  ctx.fillStyle = color;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;

  // Simple shape based on type
  switch (objectType) {
    case ObjectType.OBJECT_TYPE_FIXED_WING:
    case ObjectType.OBJECT_TYPE_ROTARY_WING:
    case ObjectType.OBJECT_TYPE_UAV:
      // Triangle pointing up (aircraft)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 15);
      ctx.lineTo(centerX - 12, centerY + 12);
      ctx.lineTo(centerX + 12, centerY + 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case ObjectType.OBJECT_TYPE_GROUND_VEHICLE:
    case ObjectType.OBJECT_TYPE_INFANTRY:
      // Square (ground units)
      ctx.fillRect(centerX - 12, centerY - 12, 24, 24);
      ctx.strokeRect(centerX - 12, centerY - 12, 24, 24);
      break;
    case ObjectType.OBJECT_TYPE_NAVAL:
      // Pentagon (naval)
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = centerX + 15 * Math.cos(angle);
        const y = centerY + 15 * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    default:
      // Circle (default)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
  }

  return canvas;
}

export interface ObjectRelationship {
  fromObjectId: string;
  toObjectId: string;
  type: "attacking" | "supporting" | "targeting" | "escorting";
  color?: Cesium.Color;
}

export interface UseCesiumObjectsOptions {
  viewer: Cesium.Viewer | null;
  selectedObjectId?: string | null;
  targetedObjectIds?: Set<string>;
  relationships?: ObjectRelationship[];
  onObjectClick?: (obj: ObjectWithUlid) => void;
  onObjectHover?: (obj: ObjectWithUlid | null) => void;
}

/**
 * Custom hook to manage Cesium entities with proper altitude, SVG icons, and relationships
 */
export function useCesiumObjects({
  viewer,
  selectedObjectId,
  targetedObjectIds = new Set(),
  relationships = [],
  onObjectClick,
  onObjectHover,
}: UseCesiumObjectsOptions) {
  const objects = useObjectsStore((state) => state.objects);
  const entityMapRef = useRef<Map<string, Cesium.Entity>>(new Map());
  const polylineMapRef = useRef<Map<string, Cesium.Entity>>(new Map());
  const clickHandlerRef = useRef<Cesium.ScreenSpaceEventHandler | null>(null);
  const hoverHandlerRef = useRef<Cesium.ScreenSpaceEventHandler | null>(null);

  // Set up click handler
  useEffect(() => {
    if (!viewer || !onObjectClick) return;

    clickHandlerRef.current = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas,
    );

    clickHandlerRef.current.setInputAction((movement: any) => {
      const pickedObject = viewer.scene.pick(movement.position);
      if (
        Cesium.defined(pickedObject) &&
        pickedObject.id &&
        pickedObject.id.properties
      ) {
        const objectData = pickedObject.id.properties.objectData?.getValue();
        if (objectData) {
          onObjectClick(objectData);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      if (clickHandlerRef.current) {
        clickHandlerRef.current.destroy();
        clickHandlerRef.current = null;
      }
    };
  }, [viewer, onObjectClick]);

  // Set up hover handler
  useEffect(() => {
    if (!viewer || !onObjectHover) return;

    hoverHandlerRef.current = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas,
    );

    hoverHandlerRef.current.setInputAction(
      (movement: { endPosition: Cesium.Cartesian2 }) => {
        const pickedObject = viewer.scene.pick(movement.endPosition);

        if (Cesium.defined(pickedObject) && pickedObject.id?.properties) {
          const objectData = pickedObject.id.properties.objectData?.getValue();
          if (objectData) {
            onObjectHover(objectData);
            viewer.canvas.style.cursor = "pointer";
            return; // Prevent it from hitting the null reset below
          }
        }

        // Clear hover if we didn't pick anything
        onObjectHover(null);
        viewer.canvas.style.cursor = "default";
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    );

    return () => {
      hoverHandlerRef.current?.destroy();
      if (viewer?.canvas) viewer.canvas.style.cursor = "default";
    };
  }, [viewer, onObjectHover]);

  // Sync objects with entities
  useEffect(() => {
    if (!viewer) return;

    const entityMap = entityMapRef.current;
    const currentObjectIds = new Set(objects.map((obj) => obj.ulidString));

    // Remove entities for objects that no longer exist
    const entitiesToRemove: string[] = [];
    entityMap.forEach((entity, ulid) => {
      if (!currentObjectIds.has(ulid)) {
        viewer.entities.remove(entity);
        entitiesToRemove.push(ulid);
      }
    });
    entitiesToRemove.forEach((ulid) => entityMap.delete(ulid));

    // Add or update entities for current objects
    objects.forEach(async (obj) => {
      const isTargeted = targetedObjectIds.has(obj.ulidString);
      const existingEntity = entityMap.get(obj.ulidString);

      // Get icon (async due to image loading)
      const iconConfig = await getIconForObject(obj, isTargeted);

      // Position at actual altitude (MSL in feet, convert to meters)
      const altitudeMeters = obj.altitude * 0.3048; // feet to meters
      const position = Cesium.Cartesian3.fromDegrees(
        obj.longitude,
        obj.latitude,
        altitudeMeters,
      );

      if (existingEntity) {
        // Update existing entity
        existingEntity.position = new Cesium.ConstantPositionProperty(position);
        if (existingEntity.billboard) {
          existingEntity.billboard.image = new Cesium.ConstantProperty(
            iconConfig.image,
          );
          existingEntity.billboard.scale = new Cesium.ConstantProperty(
            iconConfig.scale,
          );

          // Add pulsing animation for engaged units
          if (obj.status === ObjectStatus.OBJECT_STATUS_ENGAGED) {
            existingEntity.billboard.color = new Cesium.CallbackProperty(() => {
              const time = Date.now() / 1000;
              const pulse = (Math.sin(time * 3) + 1) / 2; // 0 to 1
              return Cesium.Color.WHITE.withAlpha(0.7 + pulse * 0.3);
            }, false);
          } else {
            existingEntity.billboard.color = new Cesium.ConstantProperty(
              Cesium.Color.WHITE,
            );
          }
        }
      } else {
        // Create new entity
        const entity = viewer.entities.add({
          id: obj.ulidString,
          position: position,
          billboard: {
            image: iconConfig.image,
            scale: iconConfig.scale,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            heightReference: Cesium.HeightReference.NONE,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            // Scale down icons based on camera distance
            scaleByDistance: new Cesium.NearFarScalar(
              1000, // At 1km, use full scale
              1.0,
              500000, // At 500km, scale down to 0.3
              0.3,
            ),
            color:
              obj.status === ObjectStatus.OBJECT_STATUS_ENGAGED
                ? new Cesium.CallbackProperty(() => {
                    const time = Date.now() / 1000;
                    const pulse = (Math.sin(time * 3) + 1) / 2;
                    return Cesium.Color.WHITE.withAlpha(0.7 + pulse * 0.3);
                  }, false)
                : Cesium.Color.WHITE,
          },
          // Remove label - we'll use React UI instead
          properties: {
            objectData: obj,
            designation: obj.designation,
            status: obj.status,
          },
        });

        entityMap.set(obj.ulidString, entity);
      }
    });
  }, [viewer, objects, targetedObjectIds]);

  // Manage relationship lines
  useEffect(() => {
    if (!viewer) return;

    const polylineMap = polylineMapRef.current;
    const entityMap = entityMapRef.current;
    const currentRelationshipIds = new Set(
      relationships.map((r) => `${r.fromObjectId}-${r.toObjectId}`),
    );

    // Remove old polylines
    const polylinesToRemove: string[] = [];
    polylineMap.forEach((polyline, id) => {
      if (!currentRelationshipIds.has(id)) {
        viewer.entities.remove(polyline);
        polylinesToRemove.push(id);
      }
    });
    polylinesToRemove.forEach((id) => polylineMap.delete(id));

    // Add or update polylines
    relationships.forEach((rel) => {
      const relId = `${rel.fromObjectId}-${rel.toObjectId}`;
      const fromEntity = entityMap.get(rel.fromObjectId);
      const toEntity = entityMap.get(rel.toObjectId);

      if (!fromEntity || !toEntity) return;

      // Determine line color and style based on relationship type
      let color = Cesium.Color.YELLOW;
      let dashPattern = undefined;
      let width = 2;

      switch (rel.type) {
        case "attacking":
          color = Cesium.Color.RED;
          width = 3;
          break;
        case "supporting":
          color = Cesium.Color.GREEN;
          dashPattern = 16;
          break;
        case "targeting":
          color = Cesium.Color.ORANGE;
          dashPattern = 8;
          break;
        case "escorting":
          color = Cesium.Color.CYAN;
          dashPattern = 4;
          break;
      }

      if (rel.color) {
        color = rel.color;
      }

      const existingPolyline = polylineMap.get(relId);

      if (existingPolyline) {
        // Update existing
        if (existingPolyline.polyline) {
          existingPolyline.polyline.positions = new Cesium.CallbackProperty(
            () => {
              const fromPos = fromEntity.position?.getValue(
                Cesium.JulianDate.now(),
              );
              const toPos = toEntity.position?.getValue(
                Cesium.JulianDate.now(),
              );
              if (fromPos && toPos) {
                return [fromPos, toPos];
              }
              return [];
            },
            false,
          );
        }
      } else {
        // Create new polyline
        const polyline = viewer.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              const fromPos = fromEntity.position?.getValue(
                Cesium.JulianDate.now(),
              );
              const toPos = toEntity.position?.getValue(
                Cesium.JulianDate.now(),
              );
              if (fromPos && toPos) {
                return [fromPos, toPos];
              }
              return [];
            }, false),
            width: width,
            material: dashPattern
              ? new Cesium.PolylineDashMaterialProperty({
                  color: color,
                  dashLength: dashPattern,
                })
              : color,
            clampToGround: false,
            arcType: Cesium.ArcType.NONE, // Straight line in 3D space
          },
        });

        polylineMap.set(relId, polyline);
      }
    });
  }, [viewer, relationships, objects]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (viewer) {
        entityMapRef.current.forEach((entity) => {
          viewer.entities.remove(entity);
        });
        entityMapRef.current.clear();

        polylineMapRef.current.forEach((polyline) => {
          viewer.entities.remove(polyline);
        });
        polylineMapRef.current.clear();
      }
    };
  }, [viewer]);

  return {
    entityMap: entityMapRef.current,
    polylineMap: polylineMapRef.current,
  };
}
