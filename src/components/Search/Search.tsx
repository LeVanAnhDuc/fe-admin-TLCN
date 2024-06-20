import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import useDebounceCustom from '../../hook/useDebounceCustom';
interface Iprops {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    placeHolder?: string;
}

const Search = (props: Iprops) => {
    const { setSearch, placeHolder = 'Search...' } = props;

    const [valueSearch, setValueSearch] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValueSearch(e.target.value);
    };

    const debounce = useDebounceCustom(valueSearch, 500);

    useEffect(() => {
        if (!debounce.trim()) {
            setSearch && setSearch('');
            return;
        }
        setSearch && setSearch(debounce);
    }, [debounce]);

    return (
        <div className="w-full relative">
            <TextField label={placeHolder} variant="outlined" value={valueSearch} onChange={handleChange} fullWidth />
        </div>
    );
};

export default Search;
