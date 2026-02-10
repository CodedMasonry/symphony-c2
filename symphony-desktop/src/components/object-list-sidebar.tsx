import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useObjectsStore } from "@/stores/objectsStore";
import { SidebarHeader } from "./object-list-sidebar/sidebar-header";
import { SidebarContent } from "./object-list-sidebar/sidebar-content";
import { useSidebarState } from "./object-list-sidebar/useSidebarState";

interface ObjectListSidebarProps extends React.ComponentProps<"div"> {
  isOpen: boolean;
  selectedObjectId?: string | null;
  onObjectSelect?: (objectId: string | null) => void;
  onObjectFlyTo?: (object: any) => void;
}

export function ObjectListSidebar({
  className,
  isOpen,
  selectedObjectId,
  onObjectSelect,
  onObjectFlyTo,
  ...props
}: ObjectListSidebarProps) {
  const objects = useObjectsStore((state) => state.objects);
  const loading = useObjectsStore((state) => state.loading);
  const error = useObjectsStore((state) => state.error);
  const loadObjects = useObjectsStore((state) => state.loadObjects);
  const {
    selectedDesignations,
    searchQuery,
    setSearchQuery,
    toggleDesignation,
    isDesignationChecked,
    toggleSection,
    isSectionOpen,
    groupedObjects,
    filteredCount,
  } = useSidebarState(objects);

  useEffect(() => {
    loadObjects();
  }, [loadObjects]);

  return (
    <div
      className={cn(
        "absolute top-4 bottom-12 left-4 z-30 transition-transform duration-300 ease-in-out",
        !isOpen && "-translate-x-90",
        className,
      )}
      {...props}
    >
      {/* Main Sidebar Panel */}
      <div className="flex flex-col h-full w-80 pb-2 bg-background/95 border-2 border-border/95 overflow-hidden">
        <SidebarHeader
          objectCount={objects.length}
          filteredCount={filteredCount}
          loading={loading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={loadObjects}
          onToggleDesignation={toggleDesignation}
          isDesignationChecked={isDesignationChecked}
        />
        <SidebarContent
          loading={loading}
          error={error}
          objectCount={objects.length}
          groupedObjects={groupedObjects}
          selectedDesignations={selectedDesignations}
          selectedObjectId={selectedObjectId}
          isSectionOpen={isSectionOpen}
          onToggleSection={toggleSection}
          onRetry={loadObjects}
          onObjectSelect={onObjectSelect}
          onObjectFlyTo={onObjectFlyTo}
        />
      </div>
    </div>
  );
}
