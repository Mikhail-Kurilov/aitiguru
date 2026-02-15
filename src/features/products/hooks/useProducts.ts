import {useQuery} from "@tanstack/react-query";

export const useProducts = (params: {
  page: number;
  limit: number;
  search: string;
}) => {
  return useQuery({
    initialData: undefined,
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    keepPreviousData: true
  });
};