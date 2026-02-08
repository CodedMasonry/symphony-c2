// Icon asset imports - ONE per unit type
import FixedWingIcon from "@/assets/icons/fixed-wing.svg";
import RotaryWingIcon from "@/assets/icons/rotary-wing.svg";
import UavIcon from "@/assets/icons/uav.svg";
import GroundVehicleIcon from "@/assets/icons/ground-vehicle.svg";
import InfantryIcon from "@/assets/icons/infantry.svg";
import NavalIcon from "@/assets/icons/naval.svg";
import MissileIcon from "@/assets/icons/missile.svg";
import StructureIcon from "@/assets/icons/structure.svg";

import { ObjectType, ObjectDesignation } from "@/generated/base";

/**
 * Map of object types to their base SVG icons
 */
export const ICON_ASSETS: Partial<Record<ObjectType, string>> = {
  [ObjectType.OBJECT_TYPE_FIXED_WING]: FixedWingIcon,
  [ObjectType.OBJECT_TYPE_ROTARY_WING]: RotaryWingIcon,
  [ObjectType.OBJECT_TYPE_UAV]: UavIcon,
  [ObjectType.OBJECT_TYPE_GROUND_VEHICLE]: GroundVehicleIcon,
  [ObjectType.OBJECT_TYPE_INFANTRY]: InfantryIcon,
  [ObjectType.OBJECT_TYPE_NAVAL]: NavalIcon,
  [ObjectType.OBJECT_TYPE_MISSILE]: MissileIcon,
  [ObjectType.OBJECT_TYPE_STRUCTURE]: StructureIcon,
};

/**
 * Tailwind-compatible color classes for designations
 * Use these in your UI components with shadcn/ui
 */
export const DESIGNATION_COLORS = {
  [ObjectDesignation.OBJECT_DESIGNATION_HOSTILE]: {
    fill: "fill-red-500",
    stroke: "stroke-red-600",
    bg: "bg-red-500",
    text: "text-red-500",
    border: "border-red-500",
    hex: "#ef4444", // red-500
  },
  [ObjectDesignation.OBJECT_DESIGNATION_FRIENDLY]: {
    fill: "fill-blue-500",
    stroke: "stroke-blue-600",
    bg: "bg-blue-500",
    text: "text-blue-500",
    border: "border-blue-500",
    hex: "#3b82f6", // blue-500
  },
  [ObjectDesignation.OBJECT_DESIGNATION_ALLY]: {
    fill: "fill-green-500",
    stroke: "stroke-green-600",
    bg: "bg-green-500",
    text: "text-green-500",
    border: "border-green-500",
    hex: "#22c55e", // green-500
  },
  [ObjectDesignation.OBJECT_DESIGNATION_CIVILIAN]: {
    fill: "fill-orange-500",
    stroke: "stroke-orange-600",
    bg: "bg-orange-500",
    text: "text-orange-500",
    border: "border-orange-500",
    hex: "#f97316", // orange-500
  },
  [ObjectDesignation.OBJECT_DESIGNATION_UNSPECIFIED]: {
    fill: "fill-gray-500",
    stroke: "stroke-gray-600",
    bg: "bg-gray-500",
    text: "text-gray-500",
    border: "border-gray-500",
    hex: "#6b7280", // gray-500
  },
  [ObjectDesignation.UNRECOGNIZED]: {
    fill: "fill-gray-500",
    stroke: "stroke-gray-600",
    bg: "bg-gray-500",
    text: "text-gray-500",
    border: "border-gray-500",
    hex: "#6b7280", // gray-500
  },
} as const;

/**
 * Get the base icon URL for an object type
 */
export function getBaseIcon(objectType: ObjectType): string | undefined {
  return ICON_ASSETS[objectType];
}

/**
 * Get the color hex value for a designation
 */
export function getDesignationColor(designation: ObjectDesignation): string {
  return (
    DESIGNATION_COLORS[designation]?.hex ??
    DESIGNATION_COLORS[ObjectDesignation.OBJECT_DESIGNATION_UNSPECIFIED].hex
  );
}
