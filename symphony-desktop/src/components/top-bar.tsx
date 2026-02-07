import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Close,
  Expand,
  HelpCircleIcon,
  Logout,
  Minus,
  SettingsIcon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getCurrentWindow } from "@tauri-apps/api/window";

interface TopBarProps extends React.ComponentProps<"div"> {
  isObjectListOpen?: boolean;
  onToggleObjectList?: () => void;
  objectCount?: number;
  filteredObjectCount?: number;
}

function TopBar({
  className,
  isObjectListOpen = false,
  onToggleObjectList,
  objectCount = 0,
  filteredObjectCount = 0,
  ...props
}: TopBarProps) {
  const appWindow = getCurrentWindow();

  return (
    <div
      data-tauri-drag-region
      className={cn(
        "flex align-middle px-2 border-b-2 border-border",
        className,
      )}
      {...props}
    >
      <Menubar className="border-0">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
                Settings
              </MenubarItem>
              <MenubarItem>
                <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
                Help
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive">
                <HugeiconsIcon icon={Logout} strokeWidth={2} />
                Logout
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>

        {/* Object List Toggle - styled like a MenubarTrigger */}
        {onToggleObjectList && (
          <button
            onClick={onToggleObjectList}
            className={cn(
              "hover:bg-muted rounded-none ml-1 px-1.5 py-[calc(--spacing(0.8))] text-xs font-medium flex items-center outline-hidden select-none gap-1.5",
              isObjectListOpen && "bg-muted",
            )}
          >
            <HugeiconsIcon icon={Layers01Icon} size={14} strokeWidth={2} />
            <span>Objects</span>
            <Badge
              variant="secondary"
              className="text-[10px] px-1 h-4 min-w-4 flex items-center justify-center"
            >
              {filteredObjectCount}
            </Badge>
          </button>
        )}
      </Menubar>

      <div className="flex ml-auto my-auto space-x-2">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => appWindow.toggleMaximize()}
        >
          <HugeiconsIcon icon={Expand} strokeWidth={4} />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => appWindow.minimize()}
        >
          <HugeiconsIcon icon={Minus} strokeWidth={4} />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => appWindow.close()}
        >
          <HugeiconsIcon icon={Close} strokeWidth={4} />
        </Button>
      </div>
    </div>
  );
}

export { TopBar };
