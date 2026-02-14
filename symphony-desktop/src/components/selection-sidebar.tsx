import { cn } from "@/lib/utils";
import { ObjectCard } from "./object-list-sidebar/object-card";
import { ObjectWithUlid } from "@/lib/proto_api";

interface SelectionSideBarProps extends React.ComponentProps<"div"> {
  selectedObject: ObjectWithUlid | undefined;
  selectObject: (id: string | null) => void;
}

export function SelectionSideBar({
  className,
  selectedObject,
  selectObject,
  ...props
}: SelectionSideBarProps) {
  return (
    <div
      className={cn(
        "fixed top-20 right-4 z-40 w-80 animate-in fade-in slide-in-from-right-4",
        className,
      )}
      {...props}
    >
      <div className="relative">
        <button onClick={() => selectObject(null)}>✕</button>
        {selectedObject && <ObjectCard object={selectedObject} />}
      </div>
    </div>
  );
}
