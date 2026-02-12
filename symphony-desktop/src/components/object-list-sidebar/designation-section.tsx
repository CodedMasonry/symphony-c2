import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SymbolSet, Object as ProtoObject } from "@/generated/base";
import { ObjectCard } from "./object-card";

type ObjectWithId = ProtoObject & { ulidString: string };

interface DesignationSectionProps {
  symbolSet: SymbolSet;
  objects: ObjectWithId[];
  isOpen: boolean;
  onToggle: () => void;
  selectedObjectId?: string | null;
  onObjectSelect?: (objectId: string | null) => void;
  onObjectFlyTo?: (object: ObjectWithId) => void;
}

function getSymbolSetName(symbolSet: SymbolSet): string {
  switch (symbolSet) {
    case SymbolSet.SYMBOL_SET_AIR:
      return "Air";
    case SymbolSet.SYMBOL_SET_LAND_EQUIPMENT:
      return "Land Equipment";
    case SymbolSet.SYMBOL_SET_SEA_SURFACE:
      return "Sea Surface";
    case SymbolSet.SYMBOL_SET_SPACE:
      return "Space";
    case SymbolSet.SYMBOL_SET_ACTIVITIES:
      return "Activities";
    case SymbolSet.SYMBOL_SET_INSTALLATIONS:
      return "Installations";
    default:
      return "Other";
  }
}

export function DesignationSection({
  symbolSet,
  objects,
  isOpen,
  onToggle,
  selectedObjectId,
  onObjectSelect,
  onObjectFlyTo,
}: DesignationSectionProps) {
  const handleCardClick = (obj: ObjectWithId) => {
    onObjectSelect?.(obj.ulidString);
    onObjectFlyTo?.(obj);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="space-y-2">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-2 py-1 h-auto"
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={isOpen ? ChevronDown : ChevronRight}
                strokeWidth={2}
                className="h-4 w-4"
              />
              <span className="font-semibold text-sm">
                {getSymbolSetName(symbolSet)}
              </span>
              <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs">
                {objects.length}
              </Badge>
            </div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-2 px-1">
          {objects.map((obj) => (
            <ObjectCard
              key={obj.ulidString}
              object={obj}
              isSelected={selectedObjectId === obj.ulidString}
              onClick={() => handleCardClick(obj)}
            />
          ))}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
