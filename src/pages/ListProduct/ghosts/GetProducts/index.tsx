// libs
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
// types
import IProduct from '@/types/product';
// apis
import { getAllProductSearchWithinPagination } from '@/apis/productApi';

const GetProducts = ({
    setLoadingAPIGetProducts,
    page,
    search,
    cate,
    sortBy,
    setProducts,
    setTotalPages,
    setPage,
    setErrorAPI,
    behaviorGetProducts,
}: {
    setLoadingAPIGetProducts: React.Dispatch<React.SetStateAction<boolean>>;
    page: number;
    search: string;
    cate: string;
    sortBy: string;
    setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    behaviorGetProducts: boolean;
}) => {
    const itemsPerPage = useMemo(() => 24, []);

    const getAllProducts = async () => {
        try {
            setLoadingAPIGetProducts(true);
            const response = await getAllProductSearchWithinPagination(page, itemsPerPage, search, cate, sortBy);
            setLoadingAPIGetProducts(false);
            if (response.status === 200) {
                const { content, totalPages } = response.data;

                setProducts(content);
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
        getAllProducts();
    }, [page, search, cate, sortBy, behaviorGetProducts]);

    return null;
};

export default GetProducts;
