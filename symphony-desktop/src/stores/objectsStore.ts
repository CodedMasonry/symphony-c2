import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { fetchObjects, ObjectWithUlid } from "@/lib/proto_api";
import { SymbolSet, StandardIdentity } from "@/generated/base";

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

  // Selectors
  getObjectByUlid: (ulid: string) => ObjectWithUlid | undefined;

  getObjectsBySymbolSet: (symbolSet: SymbolSet) => ObjectWithUlid[];
  getObjectsBySymbolSetList: (symbolSets: SymbolSet[]) => ObjectWithUlid[];

  getObjectsByIdentity: (identity: StandardIdentity) => ObjectWithUlid[];
  getObjectsByIdentityList: (
    identities: StandardIdentity[],
  ) => ObjectWithUlid[];
}

export const useObjectsStore = create<ObjectsStore>()(
  devtools(
    (set, get) => ({
      // ─────────────────────────
      // Initial state
      // ─────────────────────────
      objects: [],
      objectsById: new Map(),
      loading: false,
      error: null,
      lastFetch: null,

      // ─────────────────────────
      // Set all objects
      // ─────────────────────────
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

      // ─────────────────────────
      // Add object
      // ─────────────────────────
      addObject: (object) => {
        set((state) => {
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

      // ─────────────────────────
      // Update object
      // ─────────────────────────
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

      // ─────────────────────────
      // Remove object
      // ─────────────────────────
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

      // ─────────────────────────
      // Load from API
      // ─────────────────────────
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

          throw err;
        }
      },

      // ─────────────────────────
      // Clear error
      // ─────────────────────────
      clearError: () => set({ error: null }),

      // ─────────────────────────
      // Selectors
      // ─────────────────────────
      getObjectByUlid: (ulid: string) => {
        return get().objectsById.get(ulid);
      },

      getObjectsBySymbolSet: (symbolSet: SymbolSet) => {
        return get().objects.filter((obj) => obj.symbolSet === symbolSet);
      },

      getObjectsBySymbolSetList: (symbolSets: SymbolSet[]) => {
        return get().objects.filter((obj) =>
          symbolSets.includes(obj.symbolSet),
        );
      },

      getObjectsByIdentity: (identity: StandardIdentity) => {
        return get().objects.filter((obj) => obj.standardIdentity === identity);
      },

      getObjectsByIdentityList: (identities: StandardIdentity[]) => {
        return get().objects.filter((obj) =>
          identities.includes(obj.standardIdentity),
        );
      },
    }),
    { name: "objects-store" },
  ),
);
