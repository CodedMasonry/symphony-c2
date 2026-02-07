import { ObjectDesignation } from "@/lib/generated/base";

export const DESIGNATION_ORDER: ObjectDesignation[] = [
  ObjectDesignation.OBJECT_DESIGNATION_HOSTILE,
  ObjectDesignation.OBJECT_DESIGNATION_FRIENDLY,
  ObjectDesignation.OBJECT_DESIGNATION_ALLY,
  ObjectDesignation.OBJECT_DESIGNATION_CIVILIAN,
  ObjectDesignation.OBJECT_DESIGNATION_UNSPECIFIED,
];

export const DEFAULT_SELECTED_DESIGNATIONS: ObjectDesignation[] = [
  ObjectDesignation.OBJECT_DESIGNATION_HOSTILE,
  ObjectDesignation.OBJECT_DESIGNATION_FRIENDLY,
  ObjectDesignation.OBJECT_DESIGNATION_ALLY,
  ObjectDesignation.OBJECT_DESIGNATION_CIVILIAN,
  ObjectDesignation.OBJECT_DESIGNATION_UNSPECIFIED,
];

export const DESIGNATION_CONFIG = {
  [ObjectDesignation.OBJECT_DESIGNATION_HOSTILE]: {
    badge: "HST",
    variant: "destructive" as const,
    color: "",
    indicatorColor: "text-destructive",
  },
  [ObjectDesignation.OBJECT_DESIGNATION_FRIENDLY]: {
    badge: "FRD",
    variant: "secondary" as const,
    color: "bg-blue-500/20 text-blue-400",
    indicatorColor: "text-blue-400",
  },
  [ObjectDesignation.OBJECT_DESIGNATION_ALLY]: {
    badge: "ALY",
    variant: "secondary" as const,
    color: "bg-blue-500/20 text-blue-400",
    indicatorColor: "text-blue-400",
  },
  [ObjectDesignation.OBJECT_DESIGNATION_CIVILIAN]: {
    badge: "CIV",
    variant: "secondary" as const,
    color: "bg-gray-500/20 text-gray-400",
    indicatorColor: "text-gray-400",
  },
  [ObjectDesignation.OBJECT_DESIGNATION_UNSPECIFIED]: {
    badge: "UNK",
    variant: "outline" as const,
    color: "",
    indicatorColor: "text-muted-foreground",
  },
} as const;
