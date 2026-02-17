import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SortField = "brand" | "sku" | "rating" | "price" | null;
type SortOrder = "asc" | "desc";

interface ProductTableState {
  sortField: SortField;
  sortOrder: SortOrder;
  setSort: (field: SortField) => void;
  resetSort: () => void;
}

export const useProductTableStore = create<ProductTableState>()(
  persist(
    (set, get) => ({
      sortField: null,
      sortOrder: "asc",
      setSort: (field) => {
        const current = get();
        if (current.sortField === field) {
          set({ sortOrder: current.sortOrder === "asc" ? "desc" : "asc" });
        } else {
          set({ sortField: field, sortOrder: "asc" });
        }
      },
      resetSort: () => set({ sortField: null, sortOrder: "asc" }),
    }),
    {
      name: "products-table-preferences",
      storage: createJSONStorage(() => localStorage), // ключ в localStorage
      partialize: (state) => ({
        sortField: state.sortField,
        sortOrder: state.sortOrder,
      }),
    },
  ),
);
