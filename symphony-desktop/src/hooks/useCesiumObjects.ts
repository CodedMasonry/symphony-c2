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

/* ───────────────────────── 2525E MAPPINGS ───────────────────────── */

function identityToAffiliation(identity: StandardIdentity): string {
  switch (identity) {
    case StandardIdentity.STANDARD_IDENTITY_FRIEND:
      return "F";
    case StandardIdentity.STANDARD_IDENTITY_HOSTILE:
      return "H";
    case StandardIdentity.STANDARD_IDENTITY_NEUTRAL:
      return "N";
    case StandardIdentity.STANDARD_IDENTITY_SUSPECT:
      return "S";
    case StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND:
      return "A";
    case StandardIdentity.STANDARD_IDENTITY_PENDING:
      return "P";
    default:
      return "U";
  }
}

function statusToCode(status: ObjectStatus): string {
  switch (status) {
    case ObjectStatus.OBJECT_STATUS_ANTICIPATED:
      return "A";
    default:
      return "P";
  }
}

function symbolSetToBattleDimension(set: SymbolSet): string {
  switch (set) {
    case SymbolSet.SYMBOL_SET_AIR:
    case SymbolSet.SYMBOL_SET_AIR_MISSILE:
      return "A";
    case SymbolSet.SYMBOL_SET_SPACE:
      return "P";
    case SymbolSet.SYMBOL_SET_LAND_UNIT:
    case SymbolSet.SYMBOL_SET_LAND_EQUIPMENT:
      return "G";
    case SymbolSet.SYMBOL_SET_SEA_SURFACE:
      return "S";
    case SymbolSet.SYMBOL_SET_SEA_SUBSURFACE:
      return "U";
    default:
      return "G";
  }
}

/* ───────────────────────── FUNCTION ID MAPPING ───────────────────────── */

function getFunctionId(obj: ObjectWithUlid): string {
  switch (obj.symbolSet) {
    case SymbolSet.SYMBOL_SET_AIR:
      switch (obj.airEntity) {
        case AirEntity.AIR_ENTITY_UAV_FIXED_WING:
          return "110100";
        case AirEntity.AIR_ENTITY_UAV_ROTARY_WING:
          return "110200";
        case AirEntity.AIR_ENTITY_MILITARY_AIRCRAFT:
          return "110000";
        case AirEntity.AIR_ENTITY_MILITARY_HELICOPTER:
          return "120000";
        case AirEntity.AIR_ENTITY_MISSILE:
          return "210000";
        default:
          return "000000";
      }

    case SymbolSet.SYMBOL_SET_LAND_EQUIPMENT:
      switch (obj.landEquipmentEntity) {
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_TANK:
          return "130000";
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_ARMORED_VEHICLE:
          return "120000";
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_APC:
          return "140000";
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_GROUND_STATION:
          return "190000";
        case LandEquipmentEntity.LAND_EQUIPMENT_ENTITY_LAUNCHER:
          return "410000";
        default:
          return "000000";
      }

    case SymbolSet.SYMBOL_SET_SEA_SURFACE:
      switch (obj.seaEntity) {
        case SeaEntity.SEA_ENTITY_CARRIER:
          return "120000";
        case SeaEntity.SEA_ENTITY_DESTROYER:
          return "140000";
        case SeaEntity.SEA_ENTITY_FRIGATE:
          return "150000";
        case SeaEntity.SEA_ENTITY_USV:
          return "180000";
        default:
          return "110000";
      }

    default:
      return "000000";
  }
}

/* ───────────────────────── SIDC BUILDER ───────────────────────── */

function buildSIDC(obj: ObjectWithUlid): string {
  const version = "10";
  const affiliation = identityToAffiliation(obj.standardIdentity);
  const battleDimension = symbolSetToBattleDimension(obj.symbolSet);
  const status = statusToCode(obj.status);
  const functionId = getFunctionId(obj);

  return `${version}${affiliation}${battleDimension}${status}${functionId}0000`;
}

/* ───────────────────────── ICON CACHE ───────────────────────── */

const iconCache = new Map<string, HTMLCanvasElement>();

function iconKey(obj: ObjectWithUlid, selected: boolean) {
  return [
    obj.standardIdentity,
    obj.symbolSet,
    obj.airEntity,
    obj.landEquipmentEntity,
    obj.seaEntity,
    obj.status,
    obj.echelon,
    selected,
  ].join("|");
}

function buildIcon(obj: ObjectWithUlid, selected: boolean) {
  const key = iconKey(obj, selected);
  if (iconCache.has(key)) return iconCache.get(key)!;

  const sidc = buildSIDC(obj);

  const symbol = new ms.Symbol(sidc, {
    size: 60,
    direction: obj.directionOfMovement ?? obj.heading ?? 0,
    uniqueDesignation: obj.callsign,
    higherFormation: obj.unit,
    outlineWidth: selected ? 6 : 2,
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

  useEffect(() => {
    if (!viewer) return;

    for (const obj of objects) {
      const cartesian = Cesium.Cartesian3.fromDegrees(
        obj.longitude,
        obj.latitude,
        obj.altitude * 0.3048,
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
      }
    }

    viewer.scene.requestRender();
  }, [viewer, objects, selectedObjectId]);

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

    return () => {
      clickHandler.current?.destroy();
      clickHandler.current = null;
    };
  }, [viewer]);
}
