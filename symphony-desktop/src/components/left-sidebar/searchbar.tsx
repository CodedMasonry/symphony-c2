import { Input } from "@/components/ui/input";
import { Search, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search objects...",
}: SearchBarProps) {
  return (
    <div className="relative">
      <HugeiconsIcon
        icon={Search}
        strokeWidth={2}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange("")}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            strokeWidth={2}
            className="h-4 w-4"
          />
        </Button>
      )}
    </div>
  );
}
