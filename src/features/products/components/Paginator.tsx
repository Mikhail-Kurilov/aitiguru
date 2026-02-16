import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

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

  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, currentPage - half);
  let end = start + maxVisible - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-between items-center mt-6">
      <div>
        <span className="text-gray-500">Показано</span>{" "}
        {(currentPage - 1) * limit + 1}-
        {Math.min(currentPage * limit, total)}{" "}
        <span className="text-gray-500">из</span> {total}
      </div>

      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="text-2xl text-gray-500 disabled:opacity-30"
        >
          <MdKeyboardArrowLeft />
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="text-2xl text-gray-500 disabled:opacity-30"
        >
          <MdKeyboardArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Paginator;
