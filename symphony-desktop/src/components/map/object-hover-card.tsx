import { Badge } from "@/components/ui/badge";
import { ObjectWithUlid } from "@/lib/proto_api";
import { SymbolSet, StandardIdentity } from "@/generated/base";
import { IDENTITY_CONFIG, SYMBOL_SET_CONFIG } from "@/lib/constants";

interface ObjectHoverCardProps {
  object: ObjectWithUlid;
  position: { x: number; y: number };
}

export function ObjectHoverCard({ object, position }: ObjectHoverCardProps) {
  const identity =
    IDENTITY_CONFIG[object.standardIdentity] ??
    IDENTITY_CONFIG[StandardIdentity.STANDARD_IDENTITY_UNSPECIFIED];
  const symbolSet =
    SYMBOL_SET_CONFIG[object.symbolSet] ??
    SYMBOL_SET_CONFIG[SymbolSet.SYMBOL_SET_UNSPECIFIED];

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x + 16}px`,
        top: `${position.y + 16}px`,
      }}
    >
      <div
        className={[
          "bg-background/95 backdrop-blur-sm shadow-xl rounded-md",
          "border border-border/60 border-l-[3px]",
          identity.border,
          "px-2.5 py-2 space-y-1.5 min-w-35 max-w-50",
        ].join(" ")}
      >
        {/* Row 1: name + affiliation (dominant) */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold leading-snug truncate">
            {object.callsign || object.model || "Unnamed"}
          </span>
          <Badge
            variant="outline"
            className={`shrink-0 text-[10px] px-1.5 py-0 h-4 ${identity.badge}`}
          >
            {identity.label}
          </Badge>
        </div>

        {/* Row 2: model + domain type (secondary) */}
        <div className="flex items-center justify-between gap-2">
          {object.model && (
            <span className="text-[10px] text-muted-foreground truncate">
              {object.model}
            </span>
          )}
          <Badge
            variant="outline"
            className={`shrink-0 ml-auto text-[9px] px-1.5 py-0 h-3.5 ${symbolSet.badge}`}
          >
            {symbolSet.shortLabel}
          </Badge>
        </div>

        {/* Row 3: kinematics */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5 border-t border-border/30">
          <span>{object.altitude.toFixed(0)} ft</span>
          <span>{object.heading.toFixed(0)}°</span>
          {object.speed != null && <span>{object.speed.toFixed(0)} kts</span>}
        </div>
      </div>
    </div>
  );
}
