import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ObjectDesignation } from "@/lib/generated/base";
import { DesignationSection } from "./designation-section";
import { DESIGNATION_ORDER } from "./constants";

interface SidebarContentProps {
  loading: boolean;
  error: string | null;
  objectCount: number;
  groupedObjects: Map<ObjectDesignation, any[]>;
  selectedDesignations: ObjectDesignation[];
  isSectionOpen: (designation: ObjectDesignation) => boolean;
  onToggleSection: (designation: ObjectDesignation) => void;
  onRetry: () => void;
}

export function SidebarContent({
  loading,
  error,
  objectCount,
  groupedObjects,
  selectedDesignations,
  isSectionOpen,
  onToggleSection,
  onRetry,
}: SidebarContentProps) {
  if (loading && objectCount === 0) {
    return (
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex items-center justify-center py-8">
            <HugeiconsIcon
              icon={LoaderCircle}
              strokeWidth={2}
              className="h-6 w-6 animate-spin text-muted-foreground"
            />
          </div>
        </div>
      </ScrollArea>
    );
  }

  if (error) {
    return (
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive mb-4">{error}</p>
              <Button onClick={onRetry} variant="outline" className="w-full">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }

  if (objectCount === 0) {
    return (
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No objects found</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-2">
        {DESIGNATION_ORDER.map((designation) => {
          const objectsInGroup = groupedObjects.get(designation);
          const isVisible = selectedDesignations.includes(designation);

          if (!objectsInGroup || objectsInGroup.length === 0 || !isVisible) {
            return null;
          }

          return (
            <DesignationSection
              key={designation}
              designation={designation}
              objects={objectsInGroup}
              isOpen={isSectionOpen(designation)}
              onToggle={() => onToggleSection(designation)}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}
