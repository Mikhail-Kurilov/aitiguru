import { RiGlobalLine } from "react-icons/ri";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaRegEnvelope } from "react-icons/fa";
import { RiSoundModuleLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";

interface Props {
  search: string;
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<Props> = ({ search, onSearch }) => {
  return (
    <div className="py-8 bg-gray-100">
      <div className="p-6 bg-white">
        <div className=" flex w-full justify-between items-center">
          <h2 className="text-lg font-semibold grow-3 text-left">Товары</h2>
          <div className="relative grow-7">
            <CiSearch className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Найти"
              className="pl-8 pr-3 py-3 rounded bg-gray-100 w-full "
            />
          </div>
          <div className="flex flex-row gap-2 items-center text-2xl grow-3 justify-end">
            <button>
              <RiGlobalLine />
            </button>
            <IoIosNotificationsOutline />
            <FaRegEnvelope />
            <RiSoundModuleLine />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
