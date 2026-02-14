import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GoodsTable from "./GoodsTable";
import SearchBar from "./SearchBar";
import Paginator from "./Paginator";

const LIMIT = 20;

const fetchProducts = async (page: number, search: string) => {
  const skip = (page - 1) * LIMIT;

  const url = search
    ? `https://dummyjson.com/products/search?q=${search}&limit=${LIMIT}&skip=${skip}`
    : `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
};

const Goods = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", page, search],
    queryFn: () => fetchProducts(page, search),
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <SearchBar
        search={search}
        onSearch={setSearch}
        onRefresh={refetch}
      />

      <GoodsTable products={data.products} />

      <Paginator
        total={data.total}
        currentPage={page}
        limit={LIMIT}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Goods;
