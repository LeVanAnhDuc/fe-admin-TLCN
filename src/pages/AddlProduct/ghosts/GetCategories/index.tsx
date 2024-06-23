// libs
import { useEffect } from 'react';
// types
import ICategory from '@/types/category';
// apis
import { getAllCategory } from '@/apis/categoryApi';

const GetCategories = ({ setListCate }: { setListCate: React.Dispatch<React.SetStateAction<ICategory[]>> }) => {
    const handleGetListCate = async () => {
        const res = await getAllCategory();
        if (res.status === 200) {
            setListCate(res.data.content);
        }
    };

    useEffect(() => {
        handleGetListCate();
    }, []);

    return null;
};

export default GetCategories;
