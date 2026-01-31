import { cn } from "@/lib/utils";

function LeftSidebar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      hi
    </div>
  );
}

export { LeftSidebar };
