import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { fetchObjects, ObjectWithUlid } from "@/lib/proto_api";
import { ObjectDesignation } from "../generated/base";

interface ObjectsStore {
  // State
  objects: ObjectWithUlid[];
  objectsById: Map<string, ObjectWithUlid>;
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;

  // Actions
  setObjects: (objects: ObjectWithUlid[]) => void;
  addObject: (object: ObjectWithUlid) => void;
  updateObject: (object: ObjectWithUlid) => void;
  removeObject: (ulid: string) => void;
  loadObjects: () => Promise<void>;
  clearError: () => void;

  // Selectors (optional helpers)
  getObjectByUlid: (ulid: string) => ObjectWithUlid | undefined;
  getObjectsByDesignation: (designation: ObjectDesignation) => ObjectWithUlid[];
  getObjectsByDesignationList: (
    designation: ObjectDesignation[],
  ) => ObjectWithUlid[];
}

export const useObjectsStore = create<ObjectsStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      objects: [],
      objectsById: new Map(),
      loading: false,
      error: null,
      lastFetch: null,

      // Set all objects (replaces existing)
      setObjects: (objects) => {
        const objectsById = new Map(
          objects.map((obj) => [obj.ulidString, obj]),
        );
        set({
          objects,
          objectsById,
          loading: false,
          lastFetch: new Date(),
        });
      },

      // Add a single object
      addObject: (object) => {
        set((state) => {
          // Check if object already exists
          if (state.objectsById.has(object.ulidString)) {
            console.warn(`Object ${object.ulidString} already exists`);
            return state;
          }

          const newObjectsById = new Map(state.objectsById);
          newObjectsById.set(object.ulidString, object);

          return {
            objects: [...state.objects, object],
            objectsById: newObjectsById,
          };
        });
      },

      // Update existing object
      updateObject: (object) => {
        set((state) => {
          if (!state.objectsById.has(object.ulidString)) {
            console.warn(`Object ${object.ulidString} not found for update`);
            return state;
          }

          const newObjectsById = new Map(state.objectsById);
          newObjectsById.set(object.ulidString, object);

          return {
            objects: state.objects.map((obj) =>
              obj.ulidString === object.ulidString ? object : obj,
            ),
            objectsById: newObjectsById,
          };
        });
      },

      // Remove object by ULID
      removeObject: (ulid) => {
        set((state) => {
          const newObjectsById = new Map(state.objectsById);
          newObjectsById.delete(ulid);

          return {
            objects: state.objects.filter((obj) => obj.ulidString !== ulid),
            objectsById: newObjectsById,
          };
        });
      },

      // Load objects from API
      loadObjects: async () => {
        set({ loading: true, error: null });
        try {
          const data = await fetchObjects();
          get().setObjects(data);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
          console.error("Failed to load objects:", err);
          set({
            error: errorMessage,
            loading: false,
          });
          throw err; // Re-throw so components can handle if needed
        }
      },

      // Clear error state
      clearError: () => set({ error: null }),

      // Helper: Get single object by ULID
      getObjectByUlid: (ulid: string) => {
        return get().objectsById.get(ulid);
      },

      // Helper: Filter objects by designation
      getObjectsByDesignation: (designation: ObjectDesignation) => {
        return get().objects.filter((obj) => obj.designation === designation);
      },

      // Helper: Filter objects by array of designation
      getObjectsByDesignationList: (designationList: ObjectDesignation[]) => {
        return get().objects.filter((obj) =>
          designationList.includes(obj.designation),
        );
      },
    }),
    { name: "objects-store" }, // For Redux DevTools
  ),
);
