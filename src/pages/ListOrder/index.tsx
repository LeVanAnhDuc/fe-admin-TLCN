// libs
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
// types
import IOrder from '@/types/order';
// components
import Search from '@/components/Search/Search';
import Error404 from '../Error404';
import SidebarFilterStatus from './mains/SidebarFilterStatus';
import TableOrders from './mains/TableOrders';
// ghosts
import GetProducts from './ghosts/GetProducts';
// others
import config from '@/config';

const ListOrder = () => {
    const [loadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [orders, setOrders] = useState<Array<IOrder>>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [behaviorGetProducts, setBehaviorGetProducts] = useState<boolean>(false);

    const handleChangeSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setPage(newPage);
    };

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetProducts
                {...{
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
                }}
            />
            <div className="space-y-4 min-h-screen">
                <div className="flex justify-between">
                    <div className="text-2xl font-bold flex items-center">Quản lý đơn hàng</div>
                </div>
                <div className="bg-white p-4 rounded-lg space-y-4">
                    <SidebarFilterStatus status={status} setStatus={setStatus} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 justify-center gap-4">
                        <Search
                            className="sm:col-span-2"
                            setSearch={setSearch}
                            placeHolder="Tìm theo tên người đặt hàng hoặc tên sản phẩm"
                        />

                        <FormControl>
                            <InputLabel>Sắp xếp</InputLabel>
                            <Select value={sortBy} label="Sắp xếp" onChange={handleChangeSortBy}>
                                <MenuItem value={''}>Không lọc</MenuItem>
                                <MenuItem value={config.SearchFilterOrder.dateAsc}>Cũ nhất</MenuItem>
                                <MenuItem value={config.SearchFilterOrder.dateDesc}>Mới nhất</MenuItem>
                                <MenuItem value={config.SearchFilterOrder.totalAsc}>Tổng giá tiền ↑</MenuItem>
                                <MenuItem value={config.SearchFilterOrder.totalDesc}>Tổng giá tiền ↓</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <TableOrders
                    {...{
                        loadingAPI,
                        orders,
                        setBehaviorGetProducts,
                    }}
                />

                <div className="w-full flex justify-center mt-5">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        variant="outlined"
                        boundaryCount={1}
                    />
                </div>
            </div>
        </>
    );
};

export default ListOrder;
