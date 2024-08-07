import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import useDebounceCustom from '../../hook/useDebounceCustom';
interface Iprops {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    placeHolder?: string;
    className?: string;
}

const Search = (props: Iprops) => {
    const { setSearch, placeHolder = 'Search...', className } = props;

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
        <div className={`${className} w-full relative`}>
            <TextField label={placeHolder} variant="outlined" value={valueSearch} onChange={handleChange} fullWidth />
        </div>
    );
};

export default Search;
