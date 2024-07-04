// libs
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
// types
import ICategory from '@/types/category';
// apis
import { getAllCategoryWithinPaginationSearch } from '@/apis/categoryApi';

const GetCategories = ({
    page,
    sortBy,
    search,
    setLoadingAPI,
    setCategories,
    setTotalPages,
    setPage,
    setErrorAPI,
    behaviorGetCategories,
}: {
    page: number;
    sortBy: string;
    search: string;
    setLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    behaviorGetCategories: boolean;
}) => {
    const itemsPerPage = useMemo(() => 20, []);

    const getCategories = async () => {
        try {
            setLoadingAPI(true);
            const response = await getAllCategoryWithinPaginationSearch(page, itemsPerPage, sortBy, search);
            setLoadingAPI(false);

            if (response.status === 200) {
                const { content, totalPages } = response.data;

                setCategories(content);
                setTotalPages(totalPages);
                if (totalPages > 0 && content.length <= 0) {
                    setPage((prev) => prev - 1);
                }
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    useEffect(() => {
        getCategories();
    }, [page, search, sortBy, behaviorGetCategories]);
    return null;
};

export default GetCategories;
