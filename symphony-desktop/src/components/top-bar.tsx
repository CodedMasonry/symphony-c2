import { cn } from "@/lib/utils";

function TopBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      items here
    </div>
  );
}

export { TopBar };
