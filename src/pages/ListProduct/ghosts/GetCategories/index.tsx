// libs
import { useEffect } from 'react';
// types
import ICategory from '@/types/category';
// apis
import { getAllCategory } from '@/apis/categoryApi';

const GetCategories = ({
    setCategories,
    setErrorAPI,
}: {
    setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const handleGetListCate = async () => {
        try {
            const res = await getAllCategory();
            if (res.status === 200) {
                setCategories(res.data.content);
            }
        } catch {
            setErrorAPI(true);
        }
    };

    useEffect(() => {
        handleGetListCate();
    }, []);

    return null;
};

export default GetCategories;
