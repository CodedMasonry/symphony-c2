import { useState, useMemo } from "react";
import { ObjectDesignation } from "@/lib/generated/base";
import { DEFAULT_SELECTED_DESIGNATIONS } from "./constants";

interface ObjectType {
  designation: ObjectDesignation;
  createdAt: Date;
}

export function useSidebarState(objects: ObjectType[]) {
  const [selectedDesignations, setSelectedDesignations] = useState<
    ObjectDesignation[]
  >(DEFAULT_SELECTED_DESIGNATIONS);

  const [collapsedSections, setCollapsedSections] = useState<
    Set<ObjectDesignation>
  >(new Set());

  const toggleDesignation = (designation: ObjectDesignation) => {
    setSelectedDesignations((prev) =>
      prev.includes(designation)
        ? prev.filter((d) => d !== designation)
        : [...prev, designation],
    );
  };

  const isDesignationChecked = (designation: ObjectDesignation) => {
    return selectedDesignations.includes(designation);
  };

  const toggleSection = (designation: ObjectDesignation) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(designation)) {
        newSet.delete(designation);
      } else {
        newSet.add(designation);
      }
      return newSet;
    });
  };

  const isSectionOpen = (designation: ObjectDesignation) => {
    return !collapsedSections.has(designation);
  };

  // Group and sort objects by designation
  const groupedObjects = useMemo(() => {
    const sortedObjects = [...objects].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    const groups = new Map<ObjectDesignation, ObjectType[]>();

    sortedObjects.forEach((obj) => {
      if (!groups.has(obj.designation)) {
        groups.set(obj.designation, []);
      }
      groups.get(obj.designation)!.push(obj);
    });

    return groups;
  }, [objects]);

  return {
    selectedDesignations,
    collapsedSections,
    toggleDesignation,
    isDesignationChecked,
    toggleSection,
    isSectionOpen,
    groupedObjects,
  };
}
