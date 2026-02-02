import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { cn } from "@/lib/utils";
import {
  HelpCircleIcon,
  Logout,
  SettingsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

function TopBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("px-1 border-b border-border", className)} {...props}>
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
    </div>
  );
}

export { TopBar };
