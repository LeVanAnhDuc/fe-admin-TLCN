// libs
import { toast } from 'react-toastify';
import { useEffect, useMemo } from 'react';
// types
import IUser from '@/types/user';
// apis
import { getAllUserWithinPaginationSearch } from '@/apis/userApi';

const GetUsers = ({
    firstLoadingAPIGet,
    setLoadingAPI,
    page,
    search,
    setFirstLoadingAPIGet,
    setCustomers,
    setTotalPages,
    setPage,
    setErrorAPI,
    behaviorGetUsers,
}: {
    firstLoadingAPIGet: boolean;
    setLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    page: number;
    search: string;
    setFirstLoadingAPIGet: React.Dispatch<React.SetStateAction<boolean>>;
    setCustomers: React.Dispatch<React.SetStateAction<IUser[]>>;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    behaviorGetUsers: boolean;
}) => {
    const itemsPerPage = useMemo(() => 20, []);
    const getCustomers = async () => {
        try {
            firstLoadingAPIGet && setLoadingAPI(true);

            const [response] = await Promise.all([
                getAllUserWithinPaginationSearch(page, itemsPerPage, search),
                firstLoadingAPIGet && new Promise((resolve) => setTimeout(resolve, 250)),
            ]);

            firstLoadingAPIGet && setLoadingAPI(false);

            if (response.status === 200) {
                setFirstLoadingAPIGet(false);
                const { content, totalPages } = response.data;

                setCustomers(content);
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
        getCustomers();
    }, [page, search, behaviorGetUsers]);

    return null;
};

export default GetUsers;
