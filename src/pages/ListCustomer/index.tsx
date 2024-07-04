// libs
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
// types
import IUser from '@/types/user';
// components
import Search from '@/components/Search/Search';
import TableUsers from './mains/TableUsers';
import Error404 from '../Error404';
// ghosts
import GetUsers from './ghosts/GetUsers';
// others

const ListCustomer = () => {
    const [loadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [firstLoadingAPIGet, setFirstLoadingAPIGet] = useState<boolean>(true);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [customers, setCustomers] = useState<Array<IUser>>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [behaviorGetUsers, setBehaviorGetUsers] = useState<boolean>(false);

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setPage(newPage);
    };

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetUsers
                {...{
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
                }}
            />
            <section className="space-y-5">
                <div className="flex justify-between">
                    <div className="text-2xl font-bold flex items-center">Quản lý người dùng</div>
                </div>
                <div className="flex justify-start bg-white p-3 rounded-lg shadow">
                    <Search
                        setSearch={setSearch}
                        placeHolder="Tìm theo theo Tên tài khoản, họ tên, số điện thoại của người dùng"
                    />
                </div>

                <TableUsers {...{ loadingAPI, customers, setBehaviorGetUsers, setErrorAPI }} />

                <div className="w-full flex justify-center mt-5 ">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        variant="outlined"
                        boundaryCount={1}
                    />
                </div>
            </section>
        </>
    );
};

export default ListCustomer;
