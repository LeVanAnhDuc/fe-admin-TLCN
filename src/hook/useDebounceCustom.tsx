import { useEffect, useState } from 'react';

function useDebounceCustom(value: string, wait: number) {
    const [debounceValue, setDebounceValue] = useState<string>(value);

    useEffect(() => {
        const handle = setTimeout(() => setDebounceValue(value), wait);

        return () => clearTimeout(handle);
    }, [value]);

    return debounceValue;
}

export default useDebounceCustom;
