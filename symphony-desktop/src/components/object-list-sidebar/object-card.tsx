import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Compass01Icon, MapPin } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Object as ProtoObject,
  SymbolSet,
  StandardIdentity,
} from "@/generated/base";
import { IDENTITY_CONFIG, SYMBOL_SET_CONFIG } from "@/lib/constants";
import { formatTimestamp } from "@/lib/utils";

interface ObjectCardProps {
  object: ProtoObject & { ulidString: string };
  isSelected?: boolean;
  onClick?: () => void;
}

export function ObjectCard({ object, isSelected, onClick }: ObjectCardProps) {
  const identity =
    IDENTITY_CONFIG[object.standardIdentity] ??
    IDENTITY_CONFIG[StandardIdentity.STANDARD_IDENTITY_UNSPECIFIED];
  const symbolSet =
    SYMBOL_SET_CONFIG[object.symbolSet] ??
    SYMBOL_SET_CONFIG[SymbolSet.SYMBOL_SET_UNSPECIFIED];

  return (
    <div
      onClick={onClick}
      className={[
        // Base card
        "group relative rounded-md border-l-[3px] border border-border/50 cursor-pointer",
        "bg-card/60 backdrop-blur-sm transition-all duration-150",
        // Identity left-border (primary affiliation color signal)
        identity.border,
        // Selected state uses identity ring
        isSelected
          ? `ring-1 ${identity.ring} bg-card`
          : "hover:bg-card/90 hover:border-border",
      ].join(" ")}
    >
      <div className="px-3 py-2.5 space-y-2">
        {/* ── Row 1: Callsign / name + affiliation badge (PRIMARY) ── */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold leading-tight truncate">
            {object.callsign || object.model || "Unnamed Object"}
          </span>
          {/* Affiliation is the DOMINANT badge */}
          <Badge
            variant="outline"
            className={`shrink-0 text-[10px] font-medium px-1.5 py-0 h-4 ${identity.badge}`}
          >
            {identity.label}
          </Badge>
        </div>

        {/* ── Row 2: Model + symbol-set type badge (SECONDARY) ── */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-muted-foreground truncate">
            {object.model || (
              <code className="font-mono">
                {object.ulidString.slice(0, 6)}…{object.ulidString.slice(-4)}
              </code>
            )}
          </span>
          {/* Symbol set is secondary, smaller, muted */}
          <Badge
            variant="outline"
            className={`shrink-0 text-[9px] font-normal px-1.5 py-0 h-3.5 ${symbolSet.badge}`}
          >
            {symbolSet.shortLabel}
          </Badge>
        </div>

        <Separator className="opacity-30" />

        {/* ── Row 3: Position + heading + altitude ── */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={MapPin}
              strokeWidth={2}
              className="h-2.5 w-2.5 shrink-0"
            />
            <span>
              {object.latitude.toFixed(3)}°,&nbsp;{object.longitude.toFixed(3)}°
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <HugeiconsIcon
                icon={Compass01Icon}
                strokeWidth={2}
                className="h-2.5 w-2.5"
              />
              <span>{object.heading.toFixed(0)}°</span>
            </div>
            <span>{object.altitude.toFixed(0)} ft</span>
          </div>
        </div>

        {/* ── Row 4: Timestamp ── */}
        <p className="text-[9px] text-muted-foreground/60 tabular-nums">
          {formatTimestamp(object.createdAt)}
        </p>
      </div>
    </div>
  );
}
