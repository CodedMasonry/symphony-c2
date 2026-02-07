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
import { ObjectDesignation } from "@/lib/generated/base";
import { getDesignationName } from "@/lib/proto_api";
import { DESIGNATION_ORDER } from "./constants";
import { getDesignationIndicatorColor } from "./utils";

interface DesignationFilterProps {
  selectedCount: number;
  onToggleDesignation: (designation: ObjectDesignation) => void;
  isDesignationChecked: (designation: ObjectDesignation) => boolean;
}

export function DesignationFilter({
  selectedCount,
  onToggleDesignation,
  isDesignationChecked,
}: DesignationFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <HugeiconsIcon
            icon={Filter}
            strokeWidth={2}
            className="h-4 w-4 mr-2"
          />
          Filter ({selectedCount})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Object Types</DropdownMenuLabel>
          {DESIGNATION_ORDER.map((designation) => (
            <DropdownMenuCheckboxItem
              key={designation}
              checked={isDesignationChecked(designation)}
              onCheckedChange={() => onToggleDesignation(designation)}
            >
              <span className={getDesignationIndicatorColor(designation)}>
                ●
              </span>
              <span className="ml-2">{getDesignationName(designation)}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
