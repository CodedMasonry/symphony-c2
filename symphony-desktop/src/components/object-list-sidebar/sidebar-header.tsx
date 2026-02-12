import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Refresh } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DesignationFilter } from "./designation-filter"; // Keeping this import as requested
import { SearchBar } from "./searchbar";
import { StandardIdentity } from "@/generated/base"; // Using the new Enum

interface SidebarHeaderProps {
  objectCount: number;
  filteredCount: number;
  loading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  // Updated props to reflect StandardIdentity
  onToggleDesignation: (identity: StandardIdentity) => void;
  isDesignationChecked: (identity: StandardIdentity) => boolean;
}

export function SidebarHeader({
  objectCount,
  filteredCount,
  loading,
  searchQuery,
  onSearchChange,
  onRefresh,
  onToggleDesignation,
  isDesignationChecked,
}: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b space-y-3 bg-background/95">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Tactical Objects
          </h2>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {searchQuery || filteredCount !== objectCount
              ? `${filteredCount} Matches`
              : `${objectCount} Total Tracks`}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onRefresh}
          disabled={loading}
        >
          <HugeiconsIcon
            icon={Refresh}
            strokeWidth={2}
            className={cn("h-4 w-4 text-foreground", loading && "animate-spin")}
          />
        </Button>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Filter by Callsign, ULID, Model..."
      />

      <DesignationFilter
        onToggleDesignation={onToggleDesignation}
        isDesignationChecked={isDesignationChecked}
      />
    </div>
  );
}
