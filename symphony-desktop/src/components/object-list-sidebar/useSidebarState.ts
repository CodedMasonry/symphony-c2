import { useState, useMemo } from "react";
import { ObjectDesignation, Object as ProtoObject } from "@/generated/base";
import { DEFAULT_SELECTED_DESIGNATIONS } from "./constants";

export function useSidebarState(objects: ProtoObject[]) {
  const [selectedDesignations, setSelectedDesignations] = useState<
    ObjectDesignation[]
  >(DEFAULT_SELECTED_DESIGNATIONS);

  const [collapsedSections, setCollapsedSections] = useState<
    Set<ObjectDesignation>
  >(new Set(DEFAULT_SELECTED_DESIGNATIONS));

  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Filter objects by search query
  const filteredObjects = useMemo(() => {
    if (!searchQuery.trim()) return objects;

    const lowerQuery = searchQuery.toLowerCase().trim();

    return objects.filter((obj) => {
      // Search by callsign (if available)
      if (obj.callsign && obj.callsign.toLowerCase().includes(lowerQuery))
        return true;

      // Search by model (if available)
      if (obj.model && obj.model.toLowerCase().includes(lowerQuery))
        return true;

      // Search by unit (if available)
      if (obj.unit && obj.unit.toLowerCase().includes(lowerQuery)) return true;

      // Search by coordinates (latitude, longitude)
      if (obj.latitude.toString().includes(lowerQuery)) return true;
      if (obj.longitude.toString().includes(lowerQuery)) return true;

      // Search by altitude
      if (obj.altitude.toString().includes(lowerQuery)) return true;

      // Search by heading
      if (obj.heading.toString().includes(lowerQuery)) return true;

      // Search by speed (if available)
      if (obj.speed && obj.speed.toString().includes(lowerQuery)) return true;

      return false;
    });
  }, [objects, searchQuery]);

  // Group and sort objects by designation
  const groupedObjects = useMemo(() => {
    const sortedObjects = [...filteredObjects].sort(
      (a, b) => b.createdAt - a.createdAt,
    );

    const groups = new Map<ObjectDesignation, ProtoObject[]>();

    sortedObjects.forEach((obj) => {
      if (!groups.has(obj.designation)) {
        groups.set(obj.designation, []);
      }
      groups.get(obj.designation)!.push(obj);
    });

    return groups;
  }, [filteredObjects]);

  return {
    selectedDesignations,
    collapsedSections,
    searchQuery,
    setSearchQuery,
    toggleDesignation,
    isDesignationChecked,
    toggleSection,
    isSectionOpen,
    groupedObjects,
    filteredCount: filteredObjects.length,
  };
}
