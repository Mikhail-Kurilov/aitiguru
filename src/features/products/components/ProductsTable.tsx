import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product } from "../../../constants/types";
import { ProductRow } from "./ProductRow";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { useProductTableStore } from "../../../stores/productTableStore.ts";

interface Props {
  products: Product[];
}

const arePropsEqual = (prevProps: Props, nextProps: Props) => {
  return prevProps.products === nextProps.products;
};

const ProductsTable = React.memo(({ products }: Props) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const selectAllRef = useRef<HTMLInputElement>(null);

  const allSelected =
    products.length > 0 &&
    products.every((product) => selectedIds.has(product.id));

  const isIndeterminate =
    products.some((product) => selectedIds.has(product.id)) && !allSelected;

  const { sortField, sortOrder, setSort } = useProductTableStore();

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleToggle = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      const allSelected = products.every((p) => newSet.has(p.id));
      if (allSelected) {
        products.forEach((p) => newSet.delete(p.id));
      } else {
        products.forEach((p) => newSet.add(p.id));
      }
      return newSet;
    });
  }, [products]);

  const handleSort = (field: "brand" | "sku" | "rating" | "price") => {
    setSort(field);
  };

  const sortedProducts = useMemo(() => {
    if (!sortField) return products;

    return [...products].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === "rating" || sortField === "price") {
        // Числовая сортировка
        return sortOrder === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      } else {
        // Строковая сортировка (brand, sku)
        valA = (valA as string) || "";
        valB = (valB as string) || "";
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
    });
  }, [products, sortField, sortOrder]);

  return (
    <table className=" table-fixed border-collapse p-6">
      <thead>
        <tr className="text-left">
          <th className="p-4 w-12">
            <input
              ref={selectAllRef}
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="w-5 h-5"
            />
          </th>
          <th className="p-6 w-[550px] text-gray-500">Наименование</th>
          <th
            className="p-3 w-[200px] text-gray-500"
            onClick={() => handleSort("brand")}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Вендор</span>
              {sortField === "brand" &&
                (sortOrder === "asc" ? <MdArrowUpward /> : <MdArrowDownward />)}
            </div>
          </th>
          <th
            className="p-3 w-[200px] text-gray-500"
            onClick={() => handleSort("sku")}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Артикул</span>
              {sortField === "sku" &&
                (sortOrder === "asc" ? <MdArrowUpward /> : <MdArrowDownward />)}
            </div>
          </th>
          <th
            className="p-3 w-[200px] text-gray-500 text-center"
            onClick={() => handleSort("rating")}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Оценка</span>
              {sortField === "rating" &&
                (sortOrder === "asc" ? <MdArrowUpward /> : <MdArrowDownward />)}
            </div>
          </th>
          <th
            className="p-3 w-[200px] text-gray-500"
            onClick={() => handleSort("price")}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Цена, ₽</span>
              {sortField === "price" &&
                (sortOrder === "asc" ? <MdArrowUpward /> : <MdArrowDownward />)}
            </div>
          </th>
          <th className="p-3 w-[200px]"></th>
        </tr>
      </thead>

      <tbody>
        {sortedProducts.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            selected={selectedIds.has(product.id)}
            onToggle={handleToggle}
          />
        ))}
      </tbody>
    </table>
  );
}, arePropsEqual);

export default ProductsTable;
