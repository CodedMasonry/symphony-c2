import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Compass01Icon, MapPin } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ObjectDesignation } from "@/lib/generated/base";
import { getDesignationName } from "@/lib/proto_api";
import {
  getDesignationVariant,
  getDesignationColor,
  getDesignationBadge,
  formatTimestamp,
} from "./utils";

interface ObjectCardProps {
  object: {
    ulidString: string;
    designation: ObjectDesignation;
    latitude: number;
    longitude: number;
    heading: number;
    altitude: number;
    createdAt: Date;
  };
}

export function ObjectCard({ object }: ObjectCardProps) {
  return (
    <Card className="bg-accent/20 hover:bg-accent/40 transition-colors cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium">
            {getDesignationName(object.designation)}
          </CardTitle>
          <Badge
            variant={getDesignationVariant(object.designation)}
            className={getDesignationColor(object.designation)}
          >
            {getDesignationBadge(object.designation)}
          </Badge>
        </div>
        <code className="text-xs text-muted-foreground font-mono">
          {object.ulidString.slice(0, 13)}...
        </code>
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
