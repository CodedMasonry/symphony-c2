import { cn } from "@/lib/utils";

function RightSideBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      hi
    </div>
  );
}

export { RightSideBar };
