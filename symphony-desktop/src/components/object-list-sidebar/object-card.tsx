import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Compass01Icon, MapPin } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Object as ProtoObject } from "@/generated/base";
import { getDesignationName } from "@/lib/proto_api";
import {
  getDesignationVariant,
  getDesignationColor,
  getDesignationBadge,
  formatTimestamp,
} from "./utils";

interface ObjectCardProps {
  object: ProtoObject & { ulidString: string };
}

export function ObjectCard({ object }: ObjectCardProps) {
  return (
    <Card className="bg-accent/20 hover:bg-accent/40 transition-colors cursor-default">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium">
            {object.callsign || getDesignationName(object.designation)}
          </CardTitle>
          <Badge
            variant={getDesignationVariant(object.designation)}
            className={getDesignationColor(object.designation)}
          >
            {getDesignationBadge(object.designation)}
          </Badge>
        </div>
        <div className="space-y-1">
          {object.model && (
            <p className="text-xs text-muted-foreground">{object.model}</p>
          )}
          <code className="text-xs text-muted-foreground font-mono">
            {object.ulidString.slice(0, 6)}...
            {object.ulidString.slice(
              object.ulidString.length - 6,
              object.ulidString.length,
            )}
          </code>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
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
            {object.altitude.toFixed(0)}ft
          </span>
        </div>
        <Separator />
        <p className="text-xs text-muted-foreground">
          {formatTimestamp(object.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
}
