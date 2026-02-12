import { Badge } from "@/components/ui/badge";
import { ObjectWithUlid } from "@/lib/proto_api";
import { SymbolSet, StandardIdentity } from "@/generated/base";

interface ObjectHoverCardProps {
  object: ObjectWithUlid;
  position: { x: number; y: number };
}

/* ───────────────────────── Helpers ───────────────────────── */

function getSymbolSetLabel(symbolSet: SymbolSet): string {
  switch (symbolSet) {
    case SymbolSet.SYMBOL_SET_AIR:
      return "AIR";
    case SymbolSet.SYMBOL_SET_AIR_MISSILE:
      return "MSL";
    case SymbolSet.SYMBOL_SET_SPACE:
      return "SPC";
    case SymbolSet.SYMBOL_SET_LAND_UNIT:
      return "LND";
    case SymbolSet.SYMBOL_SET_LAND_CIVILIAN:
      return "CIV";
    case SymbolSet.SYMBOL_SET_LAND_EQUIPMENT:
      return "EQP";
    case SymbolSet.SYMBOL_SET_SEA_SURFACE:
      return "SEA";
    case SymbolSet.SYMBOL_SET_SEA_SUBSURFACE:
      return "SUB";
    case SymbolSet.SYMBOL_SET_ACTIVITIES:
      return "ACT";
    case SymbolSet.SYMBOL_SET_INSTALLATIONS:
      return "INS";
    default:
      return "UNK";
  }
}

function getIdentityBadgeVariant(identity: StandardIdentity) {
  switch (identity) {
    case StandardIdentity.STANDARD_IDENTITY_HOSTILE:
      return "destructive" as const;
    case StandardIdentity.STANDARD_IDENTITY_FRIEND:
    case StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND:
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function getIdentityColor(identity: StandardIdentity): string {
  switch (identity) {
    case StandardIdentity.STANDARD_IDENTITY_HOSTILE:
      return "text-destructive";
    case StandardIdentity.STANDARD_IDENTITY_FRIEND:
      return "bg-blue-500/20 text-blue-400";
    case StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND:
      return "bg-sky-500/20 text-sky-400";
    case StandardIdentity.STANDARD_IDENTITY_NEUTRAL:
      return "bg-green-500/20 text-green-400";
    case StandardIdentity.STANDARD_IDENTITY_PENDING:
      return "bg-yellow-500/20 text-yellow-400";
    case StandardIdentity.STANDARD_IDENTITY_SUSPECT:
      return "bg-red-500/10 text-red-400";
    default:
      return "";
  }
}

/* ───────────────────────── Component ───────────────────────── */

export function ObjectHoverCard({ object, position }: ObjectHoverCardProps) {
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x + 16}px`,
        top: `${position.y + 16}px`,
      }}
    >
      <div className="bg-background/90 backdrop-blur-sm border rounded-md shadow-lg px-2.5 py-1.5 space-y-1 max-w-50">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium truncate">
            {object.callsign || object.model || "Unnamed Object"}
          </span>

          <Badge
            variant={getIdentityBadgeVariant(object.standardIdentity)}
            className={`${getIdentityColor(
              object.standardIdentity,
            )} text-[10px] px-1 py-0 h-4`}
          >
            {getSymbolSetLabel(object.symbolSet)}
          </Badge>
        </div>

        {object.model && (
          <p className="text-[10px] text-muted-foreground truncate">
            {object.model}
          </p>
        )}

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{object.altitude.toFixed(0)} ft</span>
          <span>{object.heading.toFixed(0)}°</span>
        </div>
      </div>
    </div>
  );
}
