import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SymbolSet, StandardIdentity } from "@/generated/base";
import { DesignationSection } from "./designation-section";
import { SYMBOL_SET_ORDER } from "../constants";
import { ObjectWithUlid as ObjectWithId } from "@/lib/proto_api";

interface SidebarContentProps {
  loading: boolean;
  error: string | null;
  objectCount: number;
  groupedObjects: Map<SymbolSet, ObjectWithId[]>;
  selectedIdentities: StandardIdentity[]; // Prop type fixed
  selectedObjectId?: string | null;
  isSectionOpen: (symbolSet: SymbolSet) => boolean;
  onToggleSection: (symbolSet: SymbolSet) => void;
  onRetry: () => void;
  onObjectSelect?: (objectId: string | null) => void;
  onObjectFlyTo?: (object: ObjectWithId) => void;
}

export function SidebarContent({
  loading,
  error,
  objectCount,
  groupedObjects,
  selectedObjectId,
  isSectionOpen,
  onToggleSection,
  onRetry,
  onObjectSelect,
  onObjectFlyTo,
}: SidebarContentProps) {
  if (loading && objectCount === 0) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="py-8 flex items-center justify-center">
          <HugeiconsIcon
            icon={LoaderCircle}
            className="h-6 w-6 animate-spin text-muted-foreground"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-hidden p-4">
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-destructive mb-4">{error}</p>
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (objectCount === 0) {
    return (
      <div className="flex-1 overflow-hidden py-8 text-center text-muted-foreground text-sm">
        No objects found
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full px-4">
        <div className="py-4 space-y-2">
          {SYMBOL_SET_ORDER.map((symbolSet) => {
            const objectsInGroup = groupedObjects.get(symbolSet);
            // We only show the section if it has objects that passed the identity/search filter
            if (!objectsInGroup?.length) return null;

            return (
              <DesignationSection
                key={symbolSet}
                symbolSet={symbolSet}
                objects={objectsInGroup}
                isOpen={isSectionOpen(symbolSet)}
                onToggle={() => onToggleSection(symbolSet)}
                selectedObjectId={selectedObjectId}
                onObjectSelect={onObjectSelect}
                onObjectFlyTo={onObjectFlyTo}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
