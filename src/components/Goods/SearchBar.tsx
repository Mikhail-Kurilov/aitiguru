interface Props {
  search: string;
  onSearch: (value: string) => void;
  onRefresh: () => void;
}

const SearchBar: React.FC<Props> = ({
                                      search,
                                      onSearch,
                                      onRefresh,
                                    }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-4">Товары</h1>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Все товары</h2>

        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="px-3 py-2 bg-gray-200 rounded"
          >
            🔄
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Добавить
          </button>
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Поиск..."
        className="mt-4 w-full p-3 border rounded"
      />
    </div>
  );
};

export default SearchBar;