import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Refresh } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DesignationFilter } from "./designation-filter";
import { ObjectDesignation } from "@/lib/generated/base";

interface SidebarHeaderProps {
  objectCount: number;
  loading: boolean;
  onRefresh: () => void;
  onToggleDesignation: (designation: ObjectDesignation) => void;
  isDesignationChecked: (designation: ObjectDesignation) => boolean;
}

export function SidebarHeader({
  objectCount,
  loading,
  onRefresh,
  onToggleDesignation,
  isDesignationChecked,
}: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-lg font-semibold">Objects</h2>
          <p className="text-sm text-muted-foreground">{objectCount} active</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
        >
          <HugeiconsIcon
            icon={Refresh}
            strokeWidth={2}
            className={cn("h-4 w-4", loading && "animate-spin")}
          />
        </Button>
      </div>

      <DesignationFilter
        onToggleDesignation={onToggleDesignation}
        isDesignationChecked={isDesignationChecked}
      />
    </div>
  );
}
