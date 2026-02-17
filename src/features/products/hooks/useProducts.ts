import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/api.ts";

interface ProductsParams {
  page: number;
  limit: number;
  search: string;
}

export const useProducts = ({ page, limit, search }: ProductsParams) => {
  return useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: () => getProducts({ page, limit, search }),
    placeholderData: (prev) => prev,
  });
};
