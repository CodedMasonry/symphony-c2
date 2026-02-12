import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { StandardIdentity } from "@/generated/base";
import { getIdentityName } from "@/lib/proto_api";
import { IDENTITY_ORDER, IDENTITY_CONFIG } from "./constants";
import { cn } from "@/lib/utils";

interface DesignationFilterProps {
  // Using StandardIdentity to match your updated useSidebarState hook
  onToggleDesignation: (identity: StandardIdentity) => void;
  isDesignationChecked: (identity: StandardIdentity) => boolean;
}

export function DesignationFilter({
  onToggleDesignation,
  isDesignationChecked,
}: DesignationFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <HugeiconsIcon
            icon={Filter}
            strokeWidth={2}
            className="h-4 w-4 mr-2"
          />
          Filter Identities
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Standard Identity (2525E)</DropdownMenuLabel>
          {IDENTITY_ORDER.map((identity) => {
            const config = IDENTITY_CONFIG[identity];

            return (
              <DropdownMenuCheckboxItem
                key={identity}
                checked={isDesignationChecked(identity)}
                onCheckedChange={() => onToggleDesignation(identity)}
                className="flex items-center"
              >
                {/* Visual indicator using the colors from your constants */}
                <span
                  className={cn(
                    "h-2 w-2 rounded-full mr-2 shrink-0",
                    // We extract the background color from your config
                    config.color.split(" ")[0],
                  )}
                />
                <span className="flex-1">{getIdentityName(identity)}</span>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
