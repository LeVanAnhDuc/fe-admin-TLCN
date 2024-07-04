// libs
import { toast } from 'react-toastify';
import { useEffect, useMemo } from 'react';
// types
import IOrder from '@/types/order';
// apis
import { getAllOrderWithinPaginationSearch } from '@/apis/orderApi';

const GetProducts = ({
    page,
    sortBy,
    search,
    status,
    setLoadingAPI,
    setOrders,
    setTotalPages,
    setPage,
    setErrorAPI,
    behaviorGetProducts,
}: {
    page: number;
    sortBy: string;
    search: string;
    status: string;
    setLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    behaviorGetProducts: boolean;
}) => {
    const itemsPerPage = useMemo(() => 20, []);

    const getAllOrder = async () => {
        try {
            setLoadingAPI(true);
            const response = await getAllOrderWithinPaginationSearch(page, itemsPerPage, sortBy, search, status);
            setLoadingAPI(false);

            if (response.status === 200) {
                const { content, totalPages } = response.data;

                setOrders(content);
                setTotalPages(totalPages);
                if (totalPages > 0 && content.length <= 0) {
                    setPage((prev) => prev - 1);
                }
            } else {
                toast.error(response.data.message || response.data);
                setErrorAPI(true);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    useEffect(() => {
        getAllOrder();
    }, [page, search, status, sortBy, behaviorGetProducts]);

    return null;
};

export default GetProducts;
