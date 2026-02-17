import type { ProductsResponse } from "../../../constants/types";

interface GetProductsParams {
  page: number;
  limit: number;
  search?: string;
}

export const getProducts = async ({
  page,
  limit,
  search,
}: GetProductsParams): Promise<ProductsResponse> => {
  const skip = (page - 1) * limit;
  const url = search
    ? `https://dummyjson.com/products/search?q=${search}&limit=${limit}&skip=${skip}`
    : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
  const res = await fetch(url);
  if (!res.ok || page < 1) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};
