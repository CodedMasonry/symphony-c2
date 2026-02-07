import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useObjectsStore } from "@/lib/stores/objectsStore";
import { SidebarHeader } from "./left-sidebar/sidebar-header";
import { SidebarContent } from "./left-sidebar/sidebar-content";
import { useSidebarState } from "./left-sidebar/useSidebarState";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface ObjectListSidebarProps extends React.ComponentProps<"div"> {
  isOpen: boolean;
  onToggle: () => void;
}

export function ObjectListSidebar({
  className,
  isOpen,
  onToggle,
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
        "absolute top-4 left-4 z-20 transition-all duration-300 ease-in-out flex items-start gap-2",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%-16px)]", // Slightly peeks out when closed
        className,
      )}
      {...props}
    >
      {/* Floating Panel Container */}
      <div className="flex flex-col h-[calc(100vh-theme(--spacing(24)))] w-80 bg-background/95 backdrop-blur shadow-2xl rounded-xl border overflow-hidden">
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

      {/* Toggle Button - Outside the main panel container */}
      <Button
        variant="secondary"
        size="icon"
        className="mt-2 shadow-md border border-border bg-background"
        onClick={onToggle}
      >
        <HugeiconsIcon
          icon={isOpen ? ArrowLeft01Icon : ArrowRight01Icon}
          size={20}
        />
      </Button>
    </div>
  );
}
