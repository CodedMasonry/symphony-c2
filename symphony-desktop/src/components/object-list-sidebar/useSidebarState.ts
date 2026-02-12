import { useState, useMemo } from "react";
import { SymbolSet, StandardIdentity } from "@/generated/base";
import { ObjectWithUlid as ObjectWithId } from "@/lib/proto_api";
import { DEFAULT_SELECTED_IDENTITIES } from "../constants";

export function useSidebarState(objects: ObjectWithId[]) {
  const [selectedIdentities, setSelectedIdentities] = useState<
    StandardIdentity[]
  >(DEFAULT_SELECTED_IDENTITIES);

  const [collapsedSections, setCollapsedSections] = useState<Set<SymbolSet>>(
    new Set(),
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleIdentity = (identity: StandardIdentity) => {
    setSelectedIdentities((prev) =>
      prev.includes(identity)
        ? prev.filter((i) => i !== identity)
        : [...prev, identity],
    );
  };

  const isIdentityChecked = (identity: StandardIdentity) => {
    return selectedIdentities.includes(identity);
  };

  const toggleSection = (symbolSet: SymbolSet) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(symbolSet)) newSet.delete(symbolSet);
      else newSet.add(symbolSet);
      return newSet;
    });
  };

  const isSectionOpen = (symbolSet: SymbolSet) => {
    return !collapsedSections.has(symbolSet);
  };

  const filteredObjects = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase().trim();

    return objects.filter((obj) => {
      // 1. Filter by Affiliation (StandardIdentity)
      if (!selectedIdentities.includes(obj.standardIdentity)) return false;

      // 2. Filter by Search Query
      if (!lowerQuery) return true;
      return (
        obj.callsign?.toLowerCase().includes(lowerQuery) ||
        obj.model?.toLowerCase().includes(lowerQuery) ||
        obj.unit?.toLowerCase().includes(lowerQuery) ||
        obj.ulidString.toLowerCase().includes(lowerQuery)
      );
    });
  }, [objects, searchQuery, selectedIdentities]);

  const groupedObjects = useMemo(() => {
    const sortedObjects = [...filteredObjects].sort(
      (a, b) => Number(b.createdAt) - Number(a.createdAt),
    );

    const groups = new Map<SymbolSet, ObjectWithId[]>();

    sortedObjects.forEach((obj) => {
      const set = obj.symbolSet as SymbolSet;
      if (!groups.has(set)) groups.set(set, []);
      groups.get(set)!.push(obj);
    });

    return groups;
  }, [filteredObjects]);

  return {
    selectedIdentities,
    searchQuery,
    setSearchQuery,
    toggleIdentity,
    isIdentityChecked,
    toggleSection,
    isSectionOpen,
    groupedObjects,
    filteredCount: filteredObjects.length,
  };
}
