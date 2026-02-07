import { ObjectDesignation } from "@/generated/base";
import { DESIGNATION_CONFIG } from "./constants";

type DesignationConfigKey = keyof typeof DESIGNATION_CONFIG;

export function getDesignationVariant(
  designation: ObjectDesignation,
): "default" | "destructive" | "outline" | "secondary" {
  const config = DESIGNATION_CONFIG[designation as DesignationConfigKey];
  return config?.variant ?? "outline";
}

export function getDesignationColor(designation: ObjectDesignation): string {
  const config = DESIGNATION_CONFIG[designation as DesignationConfigKey];
  return config?.color ?? "";
}

export function getDesignationBadge(designation: ObjectDesignation): string {
  const config = DESIGNATION_CONFIG[designation as DesignationConfigKey];
  return config?.badge ?? "UNK";
}

export function getDesignationIndicatorColor(
  designation: ObjectDesignation,
): string {
  const config = DESIGNATION_CONFIG[designation as DesignationConfigKey];
  return config?.indicatorColor ?? "text-muted-foreground";
}

export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000; // Convert Unix timestamp to milliseconds
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}
