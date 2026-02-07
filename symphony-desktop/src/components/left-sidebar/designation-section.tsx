import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ObjectDesignation } from "@/lib/generated/base";
import { getDesignationName } from "@/lib/proto_api";
import { ObjectCard } from "./object-card";
import {
  getDesignationVariant,
  getDesignationColor,
  getDesignationBadge,
} from "./utils";

interface DesignationSectionProps {
  designation: ObjectDesignation;
  objects: Array<{
    ulidString: string;
    designation: ObjectDesignation;
    latitude: number;
    longitude: number;
    heading: number;
    altitude: number;
    createdAt: Date;
  }>;
  isOpen: boolean;
  onToggle: () => void;
}

export function DesignationSection({
  designation,
  objects,
  isOpen,
  onToggle,
}: DesignationSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="space-y-2">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-2 py-1 h-auto hover:bg-accent/50 data-[state=open]:bg-transparent"
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={isOpen ? ChevronDown : ChevronRight}
                strokeWidth={2}
                className="h-4 w-4"
              />
              <span className="font-semibold text-sm">
                {getDesignationName(designation)}
              </span>
              <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs">
                {objects.length}
              </Badge>
            </div>
            <Badge
              variant={getDesignationVariant(designation)}
              className={cn("text-xs", getDesignationColor(designation))}
            >
              {getDesignationBadge(designation)}
            </Badge>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pl-2">
          {objects.map((obj) => (
            <ObjectCard key={obj.ulidString} object={obj} />
          ))}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
