import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import useDebounceCustom from '../../hook/useDebounceCustom';
interface Iprops {
    setSearch?: React.Dispatch<React.SetStateAction<string>>;
}

const Search = (props: Iprops) => {
    const { setSearch } = props;

    const [valueSearch, setValueSearch] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValueSearch(e.target.value);
    };
    // optimize
    // handle set thời gian chờ để tránh việc nhập 1 kí tự sẽ loading liên tục
    const debounce = useDebounceCustom(valueSearch, 500);
    useEffect(() => {
        // Nếu không có dữ liệu sẽ không call API
        if (!debounce.trim()) {
            setSearch && setSearch('');
            return;
        }
        setSearch && setSearch(debounce);
    }, [debounce]);

    return (
        <div className="w-full relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon sx={{ color: 'gray' }} />
            </div>
            <input
                type="search"
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Search..."
                required
                value={valueSearch}
                onChange={handleChange}
            />
        </div>
    );
};

export default Search;
