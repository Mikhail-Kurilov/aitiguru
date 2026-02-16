import {useCallback, useEffect, useMemo, useState} from "react";
import ProductsTable from "./components/ProductsTable";
import SearchBar from "./components/SearchBar";
import Paginator from "./components/Paginator";
import Loading from "../../ui/Loading";
import { ProgressBar } from "../../ui/ProgressBar";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";
import { useProducts } from "./hooks/useProducts.ts";
import { debounce } from "lodash";


const LIMIT = 20;


const Products = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1);
        setSearch(value);
      }, 300),
    []
  );
  const handleSearchChange = useCallback(
    (value: string) => {
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const { data, isLoading, refetch, isError, error, isFetching } = useProducts({
    page,
    limit: LIMIT,
    search
  });

  if (isLoading) return <div className="min-w-full min-h-screen flex justify-center itens-center"><Loading size="lg" /></div>;
  if (isFetching) return <div className="min-w-full min-h-screen flex justify-center itens-center">
    <ProgressBar isActive={isFetching && !isLoading}/></div>;
  if (isError) return <div className="p-6 text-red-500">Ошибка загрузки: {error.message}</div>;
  if (data?.products.length === 0) return <div className="p-6 text-red-500">Нет результатов</div>;

  return (
    <div className="p-6 ">
      <SearchBar
        search={search}
        onSearch={handleSearchChange}
      />
      <div className="flex justify-between w-full items-center p-6">
        <h3 className="font-semibold">Все позиции</h3>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="text-2xl w-10 border border-gray-200 rounded inline-flex items-center justify-center cursor-pointer"
          >
            <PiArrowsCounterClockwise />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded flex flex-nowrap items-center cursor-pointer">
            <CiCirclePlus className="mr-2 w-6 h-6" /> Добавить
          </button>
        </div>

      </div>
      <ProductsTable products={data?.products || []}/>
      <Paginator
        total={data?.total || 0}
        currentPage={page}
        limit={LIMIT}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Products;
