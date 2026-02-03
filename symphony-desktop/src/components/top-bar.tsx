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
import { cn } from "@/lib/utils";

import {
  Close,
  Expand,
  HelpCircleIcon,
  Logout,
  Maximize,
  Maximize01Icon,
  Minimize,
  Minus,
  SettingsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getCurrentWindow } from "@tauri-apps/api/src/window";

function TopBar({ className, ...props }: React.ComponentProps<"div">) {
  const appWindow = getCurrentWindow();

  return (
    <div
      data-tauri-drag-region
      className={cn("flex align-middle px-2 border-b border-border", className)}
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
