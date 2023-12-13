import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
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
import InfoTwoTone from '@mui/icons-material/InfoTwoTone';

import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import IOrder from '../../interface/order';
import { deleteOrderByAdmin, getAllOrderWithinPaginationSearch } from '../../apis/orderApi';
import { toast } from 'react-toastify';
import SelectStatus from './SelectStatus/SelectStatus';
import Search from '../../components/Search/Search';
import MouseOverPopover from '../../components/MouseOverPopover/MouseOverPopover';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#B3A492',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: 3,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ListBill = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // change page
    const [data, setData] = useState<Array<IOrder>>([]); // Dữ liệu từ API
    const [page, setPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(11); // Tổng số trang
    const [search, setSearch] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');

    const itemsPerPage = 20;

    // get all Order
    const getAllOrder = async (pageNo: number, statusValue: string, sortByValue: string) => {
        try {
            const response = await getAllOrderWithinPaginationSearch(
                pageNo,
                itemsPerPage,
                sortByValue,
                search,
                statusValue,
            );

            if (response.status === 200) {
                const { content, totalPages } = response.data;

                setData(content);
                setTotalPages(totalPages);
                if (totalPages > 0 && content.length <= 0) {
                    setPage((prev) => prev - 1);
                }
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error('Đang bảo trì quay lại sau');
        }
    };
    // delete order
    const handleDeleteOrder = async (idOrder: number) => {
        const userConfirmed = window.confirm('Bạn có chắc chắn muốn xóa không?');
        if (userConfirmed) {
            try {
                const response = await deleteOrderByAdmin(idOrder);

                if (response.status === 200) {
                    toast.success(response.data);
                } else {
                    toast.error(response.data.message || response.data);
                }
                setIsLoading((prev) => !prev);
            } catch (error) {
                toast.error(`Lỗi xóa: ${error} `);
            }
        } else {
            toast.info('Hủy xóa');
        }
    };

    // change status
    const handleChangeStatus = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };
    // change sort status
    const handleChangeSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        getAllOrder(page, status, sortBy);
    }, [page, isLoading, search, status, sortBy]);
    return (
        <div>
            <div className="flex justify-between">
                <div className="text-lg font-semibold flex items-center">Danh sách đơn hàng</div>
            </div>
            <div className="flex justify-center my-4  gap-5">
                <Search setSearch={setSearch} placeHolder="Tìm theo tên người mua nhận hàng hoặc tên sản phẩm" />
                <FormControl sx={{ width: 400 }}>
                    <InputLabel>Lọc</InputLabel>
                    <Select value={status} label="Lọc" onChange={handleChangeStatus}>
                        <MenuItem value={''}>Tất cả</MenuItem>
                        <MenuItem value={config.StatusOrder.ORDERED}>{config.StatusOrder.ORDERED}</MenuItem>
                        <MenuItem value={config.StatusOrder.PROCESSING}>{config.StatusOrder.PROCESSING}</MenuItem>
                        <MenuItem value={config.StatusOrder.SHIPPED}>{config.StatusOrder.SHIPPED}</MenuItem>
                        <MenuItem value={config.StatusOrder.DELIVERED}>{config.StatusOrder.DELIVERED}</MenuItem>
                        <MenuItem value={config.StatusOrder.CANCELED}>{config.StatusOrder.CANCELED}</MenuItem>
                        <MenuItem value={config.StatusOrder.WAITFORPAY}>{config.StatusOrder.WAITFORPAY}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 400 }}>
                    <InputLabel>Sắp xếp</InputLabel>
                    <Select value={sortBy} label="Sắp xếp" onChange={handleChangeSortBy}>
                        <MenuItem value={''}>Không lọc</MenuItem>
                        <MenuItem value={config.SearchFilterOrder.dateAsc}>Thời gian: Cũ nhất đến Mới nhất</MenuItem>
                        <MenuItem value={config.SearchFilterOrder.dateDesc}>Thời gian: Mới nhất đến Cũ nhất</MenuItem>
                        {/* <MenuItem value={config.SearchFilterOrder.idAsc}>Mã hóa đơn: Thấp đến Cao</MenuItem>
                            <MenuItem value={config.SearchFilterOrder.idDesc}>Mã hóa đơn: Cao đến Thấp</MenuItem> */}
                        {/* <MenuItem value={config.SearchFilterOrder.statusAsc}>Trạng thái: Thấp đến Cao</MenuItem>
                        <MenuItem value={config.SearchFilterOrder.statusDesc}>Trạng thái: Cao đến Thấp</MenuItem> */}
                        <MenuItem value={config.SearchFilterOrder.totalAsc}>Tổng tiền: Thấp đến Cao</MenuItem>
                        <MenuItem value={config.SearchFilterOrder.totalDesc}>Tổng tiền: Cao đến Thấp</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">ID</StyledTableCell>
                                <StyledTableCell align="center" sx={{ minWidth: '100px' }}>
                                    Người đặt hàng
                                </StyledTableCell>
                                <StyledTableCell align="center">Thành tiền</StyledTableCell>
                                <StyledTableCell align="center">Thời gian đặt</StyledTableCell>
                                <StyledTableCell align="center" sx={{ minWidth: '120px' }}>
                                    Trạng thái
                                </StyledTableCell>
                                <StyledTableCell align="center" sx={{ minWidth: '120px' }}>
                                    Thao tác
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <StyledTableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                >
                                    <StyledTableCell
                                        align="center"
                                        component="th"
                                        scope="row"
                                        onClick={() => {
                                            navigate(config.Routes.detailBill + '#' + item.id);
                                        }}
                                    >
                                        {item.id}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="center"
                                        onClick={() => {
                                            navigate(config.Routes.detailBill + '#' + item.id);
                                        }}
                                    >
                                        {item.user.username}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="center"
                                        onClick={() => {
                                            navigate(config.Routes.detailBill + '#' + item.id);
                                        }}
                                    >
                                        {item.total.toLocaleString('vi-VN')}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="center"
                                        sx={{ minWidth: '10rem' }}
                                        onClick={() => {
                                            navigate(config.Routes.detailBill + '#' + item.id);
                                        }}
                                    >
                                        {item.createdDate}
                                    </StyledTableCell>

                                    {/* start select status */}
                                    <StyledTableCell align="center">
                                        <SelectStatus
                                            status={item.status}
                                            idOrder={item.id}
                                            setIsLoading={setIsLoading}
                                        />
                                    </StyledTableCell>
                                    {/*end select status */}

                                    <StyledTableCell align="center">
                                        <Link to={config.Routes.detailBill + '#' + item.id}>
                                            <IconButton>
                                                <MouseOverPopover content="Xem thông tin chi tiết">
                                                    <InfoTwoTone sx={{ color: '#0802A3', fontSize: 26 }} />
                                                </MouseOverPopover>
                                            </IconButton>
                                        </Link>
                                        <IconButton onClick={() => handleDeleteOrder(item.id)}>
                                            <MouseOverPopover content="Xóa đơn hàng">
                                                <DeleteTwoTone sx={{ color: '#E74646', fontSize: 26 }} />
                                            </MouseOverPopover>
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
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

export default ListBill;
