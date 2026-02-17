import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormValues {
  title: string;
  price: string;
  brand: string;
  sku: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newProduct: {
    title: string;
    price: number;
    brand: string;
    sku: string;
  }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      price: "",
      brand: "",
      sku: "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: FormValues) => {
    const newProduct = {
      title: data.title.trim(),
      price: Number(data.price),
      brand: data.brand.trim(),
      sku: data.sku.trim(),
    };

    onAdd(newProduct);
    toast.success(
      `Товар успешно добавлен! ${newProduct.title} (${newProduct.sku})`,
      { duration: 4000 },
    );

    reset(); // сброс формы
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Добавить новый товар</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Наименование *
            </label>
            <input
              type="text"
              {...register("title", { required: "Обязательное поле" })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="Например: iPhone 15 Pro"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена (₽) *
            </label>
            <input
              type="text"
              {...register("price", {
                required: "Обязательное поле",
                validate: (value) =>
                  !isNaN(Number(value)) || "Введите корректную цену",
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.price
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="99990"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Вендор (бренд) *
            </label>
            <input
              type="text"
              {...register("brand", { required: "Обязательное поле" })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.brand
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="Apple"
            />
            {errors.brand && (
              <p className="mt-1 text-sm text-red-600">
                {errors.brand.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Артикул (SKU) *
            </label>
            <input
              type="text"
              {...register("sku", { required: "Обязательное поле" })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.sku
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="MTP63RU/A"
            />
            {errors.sku && (
              <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Добавить товар
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
