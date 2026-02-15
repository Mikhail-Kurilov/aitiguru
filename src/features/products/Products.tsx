import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductsTable from "./components/ProductsTable";
import SearchBar from "./components/SearchBar";
import Paginator from "./components/Paginator";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";

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

const Products = () => {
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
      />
      <div className="flex justify-between w-full items-center p-6">
        <h3 className="font-semibold">Все позиции</h3>
        <div className="flex gap-2">
          <button
            onClick={() => refetch}
            className="text-2xl w-10 border border-gray-200 rounded inline-flex items-center justify-center"
          >
            <PiArrowsCounterClockwise />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            <CiCirclePlus /> Добавить
          </button>
        </div>

      </div>
      <ProductsTable products={data.products}/>
      <Paginator
        total={data.total}
        currentPage={page}
        limit={LIMIT}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Products;
