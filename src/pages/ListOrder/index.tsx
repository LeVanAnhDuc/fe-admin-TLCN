import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import { styled } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import config from '../../config';
import IOrder from '../../interface/order';
import { deleteOrderByAdmin, getAllOrderWithinPaginationSearch } from '../../apis/orderApi';
import SelectStatus from './ChangeStatusItem';
import Search from '../../components/Search/Search';
import MouseOverPopover from '../../components/MouseOverPopover/MouseOverPopover';
import Error404 from '../Error404';
import Skeleton from '../../components/Skeleton';
import SidebarFilterStatus from './SidebarFilterStatus';
import PopConfirm from '../../components/PopComfirm';
import Button from '@mui/material/Button';

const TableRowCustom = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ListOrder = () => {
    const navigate = useNavigate();
    const itemsPerPage = 20;

    const [loadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [orders, setOrders] = useState<Array<IOrder>>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');

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

    const handleDeleteOrder = async (idOrder: number) => {
        try {
            const response = await deleteOrderByAdmin(idOrder);

            if (response.status === 200) {
                toast.success(response.data);
                getAllOrder();
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleChangeSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleNavigateDetailOrders = (orderDetail: IOrder) => {
        navigate(`${config.Routes.detailOrder}/${orderDetail.id}`, { state: { orderDetail: orderDetail } });
    };

    useEffect(() => {
        getAllOrder();
    }, [page, search, status, sortBy]);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <div className="space-y-4 min-h-screen">
            <div className="flex justify-between">
                <div className="text-lg font-semibold flex items-center">Danh sách đơn hàng</div>
            </div>
            <div className="bg-white p-4 rounded-lg space-y-4">
                <SidebarFilterStatus status={status} setStatus={setStatus} />
                <div className="flex justify-center gap-2">
                    <Search setSearch={setSearch} placeHolder="Tìm theo tên người mua nhận hàng hoặc tên sản phẩm" />

                    <FormControl sx={{ width: 400 }}>
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
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead className="!bg-primary-200 ">
                            <TableRow>
                                <TableCell align="center" className="!font-bold">
                                    ID
                                </TableCell>
                                <TableCell align="left" className="!font-bold">
                                    Người đặt hàng
                                </TableCell>
                                <TableCell align="left" className="!font-bold">
                                    Thành tiền
                                </TableCell>
                                <TableCell align="left" className="!font-bold">
                                    Thời gian đặt
                                </TableCell>
                                <TableCell align="left" className="!font-bold">
                                    Địa chỉ nhận hàng
                                </TableCell>
                                <TableCell align="center" className="!font-bold">
                                    Trạng thái
                                </TableCell>
                                <TableCell align="center" className="!font-bold">
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loadingAPI
                                ? Array(10)
                                      .fill(null)
                                      .map((_, index) => (
                                          <TableRowCustom key={index}>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                          </TableRowCustom>
                                      ))
                                : orders.map((item, index) => (
                                      <TableRowCustom key={index} className="hover:!bg-primary-50">
                                          <TableCell
                                              align="center"
                                              className="cursor-pointer"
                                              onClick={() => handleNavigateDetailOrders(item)}
                                          >
                                              #{item.id}
                                          </TableCell>
                                          <TableCell
                                              align="left"
                                              className="cursor-pointer"
                                              onClick={() => handleNavigateDetailOrders(item)}
                                          >
                                              {item.user.username}
                                          </TableCell>
                                          <TableCell
                                              align="left"
                                              className="cursor-pointer"
                                              onClick={() => handleNavigateDetailOrders(item)}
                                          >
                                              {item.total.toLocaleString('vi-VN')}đ
                                          </TableCell>
                                          <TableCell
                                              align="left"
                                              className="truncate cursor-pointer"
                                              onClick={() => handleNavigateDetailOrders(item)}
                                          >
                                              {item.createdDate}
                                          </TableCell>

                                          <TableCell
                                              align="left"
                                              className="truncate cursor-pointer"
                                              onClick={() => handleNavigateDetailOrders(item)}
                                          >
                                              {item.address.ward}, {item.address.district}, {item.address.city}
                                          </TableCell>

                                          <TableCell align="center">
                                              <SelectStatus
                                                  status={item.status}
                                                  idOrder={item.id}
                                                  getAllOrder={getAllOrder}
                                              />
                                          </TableCell>

                                          <TableCell align="center">
                                              <PopConfirm
                                                  content=""
                                                  title="Xác nhận xóa đơn hàng?"
                                                  onConfirm={() => handleDeleteOrder(item.id)}
                                              >
                                                  {/* <MouseOverPopover content="Xóa đơn hàng">
                                                      <IconButton>
                                                          <DeleteTwoTone className="text-red-500" />
                                                      </IconButton>
                                                  </MouseOverPopover> */}
                                                  <Button className='text-sm scale-40 h-6 w-10 px-1 rounded-sm text-red-500 text-lowercase ' variant='outlined'>Xóa</Button>
                                                
                                              </PopConfirm>
                                          </TableCell>
                                      </TableRowCustom>
                                  ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
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
    );
};

export default ListOrder;
