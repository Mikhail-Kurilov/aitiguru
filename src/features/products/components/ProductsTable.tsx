import type {Product} from "../../../constants/types";

interface Props {
  products: Product[];
}

const ProductsTable: React.FC<Props> = ({ products }) => {
  return (
    <table className="w-full border-collapse p-6">
      <thead>
      <tr className="bg-gray-100 text-left">
        <th className="p-3">
          <input type="checkbox" />
        </th>
        <th className="p-3">Наименование</th>
        <th className="p-3">Вендор</th>
        <th className="p-3">Артикул</th>
        <th className="p-3">Оценка</th>
        <th className="p-3">Цена, ₽</th>
        <th className="p-3"></th>
      </tr>
      </thead>

      <tbody>
      {products.map((product) => (
        <tr key={product.id} className="border-t">
          <td className="p-3">
            <input type="checkbox" />
          </td>

          <td className="p-3 flex gap-3 items-center">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-12 h-12 object-cover"
            />
            <div>
              <div className="font-medium">
                {product.title}
              </div>
              <div className="text-sm text-gray-500">
                {product.description}
              </div>
            </div>
          </td>

          <td className="p-3">{product.brand}</td>
          <td className="p-3">{product.sku}</td>
          <td className="p-3">
            {product.rating}/5
          </td>
          <td className="p-3">
            {product.price.toLocaleString("ru-RU")} ₽
          </td>

          <td className="p-3 flex gap-2">
            <button className="bg-blue-500 text-white px-3 py-1 rounded-full">
              +
            </button>

            <button className="bg-gray-300 px-3 py-1 rounded-full">
              ...
            </button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;