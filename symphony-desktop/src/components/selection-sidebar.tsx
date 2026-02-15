import { cn } from "@/lib/utils";
import { ObjectWithUlid } from "@/lib/proto_api";
import { IDENTITY_CONFIG } from "@/lib/colors";
import { HugeiconsIcon } from "@hugeicons/react";
import { Close, Eye } from "@hugeicons/core-free-icons";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface SelectionSideBarProps extends React.ComponentProps<"div"> {
  selectedObject: ObjectWithUlid;
  onSelectObject: (id: string | null) => void;
  onObjectFlyTo: (object: ObjectWithUlid) => void;
}

/*
<button onClick={() => selectObject(null)}>✕</button>
<ObjectCard object={selectedObject} />
*/
export function SelectionSideBar({
  className,
  selectedObject,
  onSelectObject,
  onObjectFlyTo,
  ...props
}: SelectionSideBarProps) {
  return (
    <div
      className={cn(
        "absolute top-4 bottom-64 right-4 z-40 w-80 animate-in fade-in slide-in-from-right-4",
        className,
      )}
      {...props}
    >
      <div className="relative flex flex-col h-full w-80 bg-background/95 border-2 border-border/95 overflow-hidden">
        {/* Top Bar */}
        <div className="flex h-8 border-b border-border/95 items-center px-1">
          <p className="text-xs font-thin">SELECTED TRACK</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onObjectFlyTo(selectedObject)}
                className="ml-auto mr-2"
              >
                <HugeiconsIcon icon={Eye} strokeWidth={4} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Fly To Object</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onSelectObject(null)}
          >
            <HugeiconsIcon icon={Close} strokeWidth={4} />
          </Button>
        </div>
      </div>
    </div>
  );
}
