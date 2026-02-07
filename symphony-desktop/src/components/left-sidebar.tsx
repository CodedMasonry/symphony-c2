// components/LeftSidebar/ObjectListSidebar.tsx
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useObjectsStore } from "@/lib/stores/objectsStore";
import { SidebarHeader } from "./left-sidebar/sidebar-header";
import { SidebarContent } from "./left-sidebar/sidebar-content";
import { useSidebarState } from "./left-sidebar/useSidebarState";

export function ObjectListSidebar({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
      className={cn("flex flex-col h-full bg-background", className)}
      {...props}
    >
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
  );
}
