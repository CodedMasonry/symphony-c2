import { Badge } from "@/components/ui/badge";
import { ObjectWithUlid } from "@/lib/proto_api";
import { getDesignationName } from "@/lib/proto_api";
import {
  getDesignationVariant,
  getDesignationColor,
  getDesignationBadge,
} from "../object-list-sidebar/utils";

interface ObjectHoverCardProps {
  object: ObjectWithUlid;
  position: { x: number; y: number };
}

export function ObjectHoverCard({ object, position }: ObjectHoverCardProps) {
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x + 16}px`,
        top: `${position.y + 16}px`,
      }}
    >
      <div className="bg-background/90 backdrop-blur-sm border rounded-md shadow-lg px-2.5 py-1.5 space-y-1 max-w-[200px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium truncate">
            {object.callsign || getDesignationName(object.designation)}
          </span>
          <Badge
            variant={getDesignationVariant(object.designation)}
            className={`${getDesignationColor(object.designation)} text-[10px] px-1 py-0 h-4`}
          >
            {getDesignationBadge(object.designation)}
          </Badge>
        </div>
        {object.model && (
          <p className="text-[10px] text-muted-foreground truncate">
            {object.model}
          </p>
        )}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{object.altitude.toFixed(0)}ft</span>
          <span>{object.heading.toFixed(0)}°</span>
        </div>
      </div>
    </div>
  );
}
