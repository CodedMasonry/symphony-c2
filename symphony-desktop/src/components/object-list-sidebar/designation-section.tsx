import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SymbolSet,
  StandardIdentity,
  Object as ProtoObject,
} from "@/generated/base";
import { ObjectCard } from "./object-card";
import { SYMBOL_SET_CONFIG, IDENTITY_CONFIG } from "../../lib/constants";

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

/**
 * Renders compact identity indicator dots next to the count badge.
 * Shows up to 3 distinct identity types present in the section so the
 * operator can immediately see "this Air group has both friend + hostile".
 */
function IdentityDots({ objects }: { objects: ObjectWithId[] }) {
  const identityCounts = new Map<StandardIdentity, number>();
  for (const obj of objects) {
    identityCounts.set(
      obj.standardIdentity,
      (identityCounts.get(obj.standardIdentity) ?? 0) + 1,
    );
  }

  // Sort by hostility priority: hostile first, then suspect, then others
  const priority: StandardIdentity[] = [
    StandardIdentity.STANDARD_IDENTITY_HOSTILE,
    StandardIdentity.STANDARD_IDENTITY_SUSPECT,
    StandardIdentity.STANDARD_IDENTITY_PENDING,
    StandardIdentity.STANDARD_IDENTITY_NEUTRAL,
    StandardIdentity.STANDARD_IDENTITY_ASSUMED_FRIEND,
    StandardIdentity.STANDARD_IDENTITY_FRIEND,
  ];

  const sorted = [...identityCounts.entries()].sort(
    ([a], [b]) => priority.indexOf(a) - priority.indexOf(b),
  );

  return (
    <div className="flex items-center gap-0.5">
      {sorted.map(([identity, count]) => {
        const cfg = IDENTITY_CONFIG[identity];
        if (!cfg) return null;
        return (
          <div
            key={identity}
            title={`${cfg.label}: ${count}`}
            className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
          />
        );
      })}
    </div>
  );
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

  const cfg =
    SYMBOL_SET_CONFIG[symbolSet] ??
    SYMBOL_SET_CONFIG[SymbolSet.SYMBOL_SET_UNSPECIFIED];

  // Check if section contains hostiles/suspects for accent treatment
  const hasThreat = objects.some(
    (o) =>
      o.standardIdentity === StandardIdentity.STANDARD_IDENTITY_HOSTILE ||
      o.standardIdentity === StandardIdentity.STANDARD_IDENTITY_SUSPECT,
  );

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="space-y-1">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={[
              "w-full justify-between px-2 py-1 h-auto rounded-sm",
              "hover:bg-accent/40",
              hasThreat ? "hover:bg-red-950/30" : "",
            ].join(" ")}
          >
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={isOpen ? ChevronDown : ChevronRight}
                strokeWidth={2}
                className="h-3.5 w-3.5 text-muted-foreground shrink-0"
              />

              {/* Domain label */}
              <span className="font-semibold text-xs text-foreground/80">
                {cfg.label}
              </span>

              {/* Identity composition dots — tells you at a glance what's in here */}
              <IdentityDots objects={objects} />

              {/* Count */}
              <Badge
                variant="secondary"
                className={[
                  "ml-0.5 h-4 px-1.5 text-[10px] font-normal",
                  hasThreat
                    ? "bg-red-950/60 text-red-400 border-red-800/40"
                    : "",
                ].join(" ")}
              >
                {objects.length}
              </Badge>
            </div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-1 pl-2 pr-0.5">
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
