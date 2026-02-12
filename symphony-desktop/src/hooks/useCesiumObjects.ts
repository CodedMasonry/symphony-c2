import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import ms from "milsymbol";

import { useObjectsStore } from "@/stores/objectsStore";
import { ObjectWithUlid } from "@/lib/proto_api";

import {
  StandardIdentity,
  SymbolSet,
  ObjectStatus,
  AirEntity,
  LandEquipmentEntity,
  SeaEntity,
} from "@/generated/base";

/* ───────────────────────── 2525E SIDC HELPERS ───────────────────────── */

/**
 * MIL-STD-2525E SIDC structure (milsymbol v2+):
 *
 *   Pos  1    : Version        "1"  (always 1 for 2525E in milsymbol)
 *   Pos  2    : Context        0=Reality 1=Exercise 2=Simulation
 *   Pos  3    : Standard Identity (Affiliation)
 *   Pos  4-5  : Symbol Set     two-digit code (01=Air, 10=LandUnit, etc.)
 *   Pos  6    : Status         0=Present 1=Anticipated
 *   Pos  7    : HQ/TF/Dummy    0=none
 *   Pos  8-9  : Echelon / Mobility  00=none
 *   Pos 10-11 : Entity         two-digit
 *   Pos 12-13 : Entity Type    two-digit
 *   Pos 14-15 : Entity Subtype two-digit
 *   Pos 16-17 : Mod1           two-digit (00=none)
 *   Pos 18-19 : Mod2           two-digit (00=none)
 *
 * milsymbol accepts the 20-character string directly.
 */

function identityCode(identity: StandardIdentity): string {
  switch (identity) {
    case StandardIdentity.STANDARD_IDENTITY_FRIEND:
      return "3";
    case StandardIdentity.STANDARD_IDENTITY_HOSTILE:
      return "6";
    case StandardIdentity.STANDARD_IDENTITY_NEUTRAL:
      return "4";
    case StandardIdentity.STANDARD_IDENTITY_SUSPECT:
      return "5";
    case StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND:
      return "2";
    case StandardIdentity.STANDARD_IDENTITY_PENDING:
      return "1";
    default:
      return "0"; // Unknown
  }
}

function statusCode(status: ObjectStatus): string {
  return status === ObjectStatus.OBJECT_STATUS_ANTICIPATED ? "1" : "0";
}

/** Symbol Set → 2-digit 2525E code */
function symbolSetCode(set: SymbolSet): string {
  switch (set) {
    case SymbolSet.SYMBOL_SET_AIR:
      return "01";
    case SymbolSet.SYMBOL_SET_AIR_MISSILE:
      return "02";
    case SymbolSet.SYMBOL_SET_SPACE:
      return "05";
    case SymbolSet.SYMBOL_SET_LAND_UNIT:
      return "10";
    case SymbolSet.SYMBOL_SET_LAND_CIVILIAN:
      return "11";
    case SymbolSet.SYMBOL_SET_LAND_EQUIPMENT:
      return "15";
    case SymbolSet.SYMBOL_SET_SEA_SURFACE:
      return "30";
    case SymbolSet.SYMBOL_SET_SEA_SUBSURFACE:
      return "35";
    case SymbolSet.SYMBOL_SET_ACTIVITIES:
      return "40";
    case SymbolSet.SYMBOL_SET_INSTALLATIONS:
      return "45";
    default:
      return "10";
  }
}

/**
 * Returns a 6-character entity code: Entity(2) + EntityType(2) + EntitySubtype(2)
 * These map directly to the MIL-STD-2525E Appendix A entity tables.
 */
function entityCode(obj: ObjectWithUlid): string {
  switch (obj.symbolSet) {
    case SymbolSet.SYMBOL_SET_AIR:
      switch (obj.airEntity) {
        case AirEntity.AIR_ENTITY_MILITARY_AIRCRAFT:
          return "110000"; // Fixed Wing
        case AirEntity.AIR_ENTITY_CIVILIAN_AIRCRAFT:
          return "120000";
        case AirEntity.AIR_ENTITY_MILITARY_HELICOPTER:
          return "130000"; // Rotary Wing
        case AirEntity.AIR_ENTITY_CIVILIAN_HELICOPTER:
          return "140000";
        case AirEntity.AIR_ENTITY_UAV_FIXED_WING:
          return "110100"; // UAS Fixed Wing
        case AirEntity.AIR_ENTITY_UAV_ROTARY_WING:
          return "110200"; // UAS Rotary Wing
        case AirEntity.AIR_ENTITY_MISSILE:
          return "200000";
        case AirEntity.AIR_ENTITY_MISSILE_DECOY:
          return "210000";
        default:
          return "000000";
      }

    case SymbolSet.SYMBOL_SET_LAND_EQUIPMENT:
      switch (obj.landEquipmentEntity) {
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_ARMORED_VEHICLE:
          return "120000";
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_TANK:
          return "130000";
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_APC:
          return "140000";
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_TRUCK:
          return "310000";
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_GROUND_STATION:
          return "190000";
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_LAUNCHER:
          return "410000";
        default:
          return "000000";
      }

    case SymbolSet.SYMBOL_SET_SEA_SURFACE:
      switch (obj.seaEntity) {
        case SeaEntity.SEA_ENTITY_COMBATANT:
          return "110000";
        case SeaEntity.SEA_ENTITY_CARRIER:
          return "120000";
        case SeaEntity.SEA_ENTITY_CRUISER:
          return "130000";
        case SeaEntity.SEA_ENTITY_DESTROYER:
          return "140000";
        case SeaEntity.SEA_ENTITY_FRIGATE:
          return "150000";
        case SeaEntity.SEA_ENTITY_PATROL_CRAFT:
          return "510000";
        case SeaEntity.SEA_ENTITY_USV:
          return "180000";
        default:
          return "110000";
      }

    default:
      return "000000";
  }
}

/**
 * Builds a valid 20-character MIL-STD-2525E SIDC for milsymbol v2+.
 *
 * Layout: V CC I SS T HH EE EEEEEE MM MM
 *         1  2  3  4 5  6   7      8  9
 *
 *   V  (1)  = "1" (version, always 1)
 *   CC (2)  = context  "00" = reality
 *   I  (3)  = standard identity  (1 char)
 *   SS (4)  = symbol set         (2 chars)
 *   T  (5)  = status             (1 char)
 *   HH (6)  = HQ/TF/Dummy        "0"
 *   EE (7)  = echelon/mobility   "00"
 *   EEEEEE  = entity+type+subtype (6 chars)
 *   MM (8)  = modifier 1         "00"
 *   MM (9)  = modifier 2         "00"
 *   Total   = 1+2+1+2+1+1+2+6+2+2 = 20 chars  ✓
 */
function buildSIDC(obj: ObjectWithUlid): string {
  const version = "1";
  const context = "00"; // Reality
  const identity = identityCode(obj.standardIdentity);
  const symSet = symbolSetCode(obj.symbolSet);
  const status = statusCode(obj.status);
  const hqTfDmy = "0"; // No HQ/TF/Dummy modifier
  const echelon = "00"; // Echelon encoded separately if needed
  const entity = entityCode(obj); // 6 chars
  const mod1 = "00";
  const mod2 = "00";

  const sidc = `${version}${context}${identity}${symSet}${status}${hqTfDmy}${echelon}${entity}${mod1}${mod2}`;
  // Should always be exactly 20 characters
  return sidc;
}

/* ───────────────────────── ICON CACHE ───────────────────────── */

const iconCache = new Map<string, HTMLCanvasElement>();

function iconKey(obj: ObjectWithUlid, selected: boolean): string {
  return [
    obj.standardIdentity,
    obj.symbolSet,
    obj.airEntity ?? "",
    obj.landEquipmentEntity ?? "",
    obj.seaEntity ?? "",
    obj.status,
    selected,
  ].join("|");
}

function buildIcon(obj: ObjectWithUlid, selected: boolean): HTMLCanvasElement {
  const key = iconKey(obj, selected);
  if (iconCache.has(key)) return iconCache.get(key)!;

  const sidc = buildSIDC(obj);

  const symbol = new ms.Symbol(sidc, {
    size: 60,
    outlineWidth: selected ? 6 : 2,
    // ── Icon-only: disable all text labels and movement arrows ──
    uniqueDesignation: "",
    additionalInformation: "",
    higherFormation: "",
    speed: undefined,
    direction: undefined, // No speed-leader / directional arrow
    type: "",
    dtg: "",
    location: "",
    staffComments: "",
    combatEffectiveness: "",
    signatureEquipment: "",
    headquartersElement: "",
  });

  const canvas = symbol.asCanvas();
  iconCache.set(key, canvas);
  return canvas;
}

/* ───────────────────────── HOOK ───────────────────────── */

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

  // ── Sync objects into Cesium entities ──
  useEffect(() => {
    if (!viewer) return;

    // Track which IDs are still present to remove stale entities
    const liveIds = new Set<string>();

    for (const obj of objects) {
      liveIds.add(obj.ulidString);

      const cartesian = Cesium.Cartesian3.fromDegrees(
        obj.longitude,
        obj.latitude,
        obj.altitude * 0.3048, // feet → metres
      );

      const position = new Cesium.ConstantPositionProperty(cartesian);
      const isSelected = obj.ulidString === selectedObjectId;
      const icon = buildIcon(obj, isSelected);

      let entity = entityMap.current.get(obj.ulidString);

      if (!entity) {
        entity = viewer.entities.add({
          id: obj.ulidString,
          position,
          billboard: {
            image: new Cesium.ConstantProperty(icon),
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            disableDepthTestDistance: Infinity,
            scale: new Cesium.ConstantProperty(1.0),
            scaleByDistance: new Cesium.NearFarScalar(2000, 1.5, 600000, 0.5),
          },
          properties: { objectData: obj },
        });

        entityMap.current.set(obj.ulidString, entity);
      } else {
        entity.position = position;
        entity.billboard!.image = new Cesium.ConstantProperty(icon);
        // Keep objectData fresh so click handlers return current state
        entity.properties!.objectData = obj;
      }
    }

    // Remove entities whose objects have been deleted
    for (const [id, entity] of entityMap.current) {
      if (!liveIds.has(id)) {
        viewer.entities.remove(entity);
        entityMap.current.delete(id);
      }
    }

    viewer.scene.requestRender();
  }, [viewer, objects, selectedObjectId]);

  // ── Input handlers ──
  useEffect(() => {
    if (!viewer || clickHandler.current) return;

    clickHandler.current = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas,
    );

    clickHandler.current.setInputAction(
      (click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = viewer.scene.pick(click.position);
        const obj = picked?.id?.properties?.objectData?.getValue() ?? null;
        onObjectClickRef.current?.(obj);
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    );

    clickHandler.current.setInputAction(
      (click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = viewer.scene.pick(click.position);
        const obj = picked?.id?.properties?.objectData?.getValue() ?? null;
        onObjectDoubleClickRef.current?.(obj);
      },
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    );

    clickHandler.current.setInputAction(
      (move: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        const picked = viewer.scene.pick(move.endPosition);
        const obj = picked?.id?.properties?.objectData?.getValue() ?? null;
        onObjectHoverRef.current?.(
          obj,
          obj ? { x: move.endPosition.x, y: move.endPosition.y } : null,
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
