import React from "react";
import type { Product } from "../../../constants/types.ts";
import { FiPlus } from "react-icons/fi";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";

interface RowProps {
  product: Product;
  selected: boolean;
  onToggle: (id: number) => void;
}

export const ProductRow = React.memo(
  ({ product, selected, onToggle }: RowProps) => {
    return (
      <tr key={product.id} className="border-t border-gray-300">
        <td className="p-3 truncate">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle(product.id)}
            className="w-5 h-5"
          />
        </td>
        <td className="p-3 flex gap-3 items-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-12 h-12 object-cover"
          />
          <div className="text-left">
            <div className="font-medium">{product.title}</div>
            <div className="text-sm text-gray-500">{product.description}</div>
          </div>
        </td>

        <td className="p-3 font-medium truncate">{product.brand}</td>
        <td className="p-3 truncate">{product.sku}</td>
        <td
          className={`p-3 truncate ${product.rating < 3 ? "text-red-500" : ""}`}
        >
          {product.rating}/5
        </td>
        <td className="p-3 truncate">
          {product.price.toLocaleString("ru-RU")} ₽
        </td>

        <td className="p-3 flex gap-6 truncate">
          <button className="bg-blue-500 text-white px-3 rounded-full w-12 text-2xl flex items-center justify-center">
            <FiPlus size={24} />
          </button>
          <button className="text-gray-500 text-3xl flex items-center justify-center">
            <HiOutlineDotsCircleHorizontal />
          </button>
        </td>
      </tr>
    );
  },
);
