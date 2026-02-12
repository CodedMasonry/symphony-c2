import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { StandardIdentity } from "@/generated/base";
import { getIdentityName } from "@/lib/proto_api";
import {
  IDENTITY_ORDER,
  IDENTITY_CONFIG,
  DEFAULT_SELECTED_IDENTITIES,
} from "../../lib/constants";

interface DesignationFilterProps {
  onToggleDesignation: (identity: StandardIdentity) => void;
  isDesignationChecked: (identity: StandardIdentity) => boolean;
}

export function DesignationFilter({
  onToggleDesignation,
  isDesignationChecked,
}: DesignationFilterProps) {
  const checkedCount = IDENTITY_ORDER.filter(isDesignationChecked).length;
  const isFiltered = checkedCount !== DEFAULT_SELECTED_IDENTITIES.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={[
            "w-full justify-start gap-2 text-xs",
            isFiltered
              ? "border-primary/50 text-primary"
              : "text-muted-foreground",
          ].join(" ")}
        >
          <HugeiconsIcon
            icon={Filter}
            strokeWidth={2}
            className="h-3.5 w-3.5 shrink-0"
          />
          <span className="flex-1 text-left">Filter</span>

          {/* Show how many identity types are active */}
          <Badge
            variant={isFiltered ? "default" : "secondary"}
            className="h-4 px-1.5 text-[10px] font-normal ml-auto"
          >
            {checkedCount}/{IDENTITY_ORDER.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel className="text-[10px] font-normal text-muted-foreground uppercase tracking-wider pb-1">
          Standard Identity (2525E)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {IDENTITY_ORDER.map((identity) => {
            const config = IDENTITY_CONFIG[identity];
            if (!config) return null;

            return (
              <DropdownMenuCheckboxItem
                key={identity}
                checked={isDesignationChecked(identity)}
                onCheckedChange={() => onToggleDesignation(identity)}
                className="gap-2 text-xs cursor-pointer"
              >
                {/* Solid dot from the dedicated `dot` field — no string splitting */}
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${config.dot}`}
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
