interface Props {
  total: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<Props> = ({
                                      total,
                                      currentPage,
                                      limit,
                                      onPageChange,
                                    }) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex justify-between items-center mt-6">
      <div>
        Показано {(currentPage - 1) * limit + 1}-
        {Math.min(currentPage * limit, total)} из {total}
      </div>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Paginator;
