import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Compass01Icon, MapPin } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Object as ProtoObject,
  SymbolSet,
  StandardIdentity,
} from "@/generated/base";
import { formatTimestamp } from "./utils";

interface ObjectCardProps {
  object: ProtoObject & { ulidString: string };
  isSelected?: boolean;
  onClick?: () => void;
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
    case StandardIdentity.STANDARD_IDENTITY_NEUTRAL:
      return "outline" as const;
    case StandardIdentity.STANDARD_IDENTITY_PENDING:
    case StandardIdentity.STANDARD_IDENTITY_SUSPECT:
      return "outline" as const;
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

export function ObjectCard({ object, isSelected, onClick }: ObjectCardProps) {
  return (
    <Card
      className={`transition-colors cursor-pointer ${
        isSelected
          ? "bg-accent/60 border-primary border-2"
          : "bg-accent/20 hover:bg-accent/40"
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium">
            {object.callsign || object.model || "Unnamed Object"}
          </CardTitle>

          {/* Symbol Set Badge */}
          <Badge
            variant={getIdentityBadgeVariant(object.standardIdentity)}
            className={getIdentityColor(object.standardIdentity)}
          >
            {getSymbolSetLabel(object.symbolSet)}
          </Badge>
        </div>

        <div className="space-y-1">
          {object.model && (
            <p className="text-xs text-muted-foreground">{object.model}</p>
          )}

          <code className="text-xs text-muted-foreground font-mono">
            {object.ulidString.slice(0, 6)}...
            {object.ulidString.slice(object.ulidString.length - 6)}
          </code>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Position */}
        <div className="flex items-center text-xs text-muted-foreground">
          <HugeiconsIcon
            icon={MapPin}
            strokeWidth={2}
            className="h-3 w-3 mr-1"
          />
          <span>
            {object.latitude.toFixed(4)}°, {object.longitude.toFixed(4)}°
          </span>
        </div>

        {/* Heading & Altitude */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-muted-foreground">
            <HugeiconsIcon
              icon={Compass01Icon}
              strokeWidth={2}
              className="h-3 w-3 mr-1"
            />
            <span>{object.heading.toFixed(0)}°</span>
          </div>

          <span className="text-muted-foreground">
            {object.altitude.toFixed(0)} ft
          </span>
        </div>

        <Separator />

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground">
          {formatTimestamp(object.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
}
