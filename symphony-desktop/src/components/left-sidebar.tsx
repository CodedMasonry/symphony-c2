import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useObjectsStore } from "@/lib/stores/objectsStore";
import { SidebarHeader } from "./left-sidebar/sidebar-header";
import { SidebarContent } from "./left-sidebar/sidebar-content";
import { useSidebarState } from "./left-sidebar/useSidebarState";

interface ObjectListSidebarProps extends React.ComponentProps<"div"> {
  isOpen: boolean;
}

export function ObjectListSidebar({
  className,
  isOpen,
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
        "absolute top-4 bottom-4 left-4 z-30 transition-transform duration-300 ease-in-out",
        !isOpen && "-translate-x-90",
        className,
      )}
      {...props}
    >
      {/* Main Sidebar Panel */}
      <div className="flex flex-col h-full w-80 bg-background/95 border-2 border-border/95 overflow-hidden">
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
          isSectionOpen={isSectionOpen}
          onToggleSection={toggleSection}
          onRetry={loadObjects}
        />
      </div>
    </div>
  );
}
