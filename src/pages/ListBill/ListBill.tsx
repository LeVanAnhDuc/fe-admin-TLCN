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

import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import InfoTwoTone from '@mui/icons-material/InfoTwoTone';

import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import config from '../../config';
import IOrder from '../../interface/order';
import { deleteOrderByAdmin, getAllOrderWithinPagination } from '../../apis/orderApi';
import { toast } from 'react-toastify';
import SelectStatus from './SelectStatus/SelectStatus';
import Search from '../../components/Search/Search';

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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // change page
    const [data, setData] = useState<Array<IOrder>>([]); // Dữ liệu từ API
    const [page, setPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(11); // Tổng số trang
    const itemsPerPage = 4;

    // get all Order
    const getAllOrder = async (pageNo: number) => {
        try {
            const response = await getAllOrderWithinPagination(pageNo, itemsPerPage);

            if (response.status === 200) {
                const { content, totalPages } = response.data;

                setData(content);
                setTotalPages(totalPages);
                if (content.length <= 0) {
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
        const response = await deleteOrderByAdmin(idOrder);
        if (response.status === 200) {
            toast.success(response.data);
        } else {
            toast.error(response.data.message || response.data);
        }
        setIsLoading((prev) => !prev);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        getAllOrder(page);
    }, [page, isLoading]);
    return (
        <div>
            <div className="flex justify-between">
                <div className="text-lg font-semibold flex items-center">Danh sách hóa đơn</div>
            </div>
            <div className="flex justify-center m-auto my-4 md:w-7/12">
                <Search />
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
                                <StyledTableCell align="left">Ghi chú</StyledTableCell>
                                <StyledTableCell align="center" sx={{ minWidth: '120px' }}>
                                    Trạng thái
                                </StyledTableCell>
                                <StyledTableCell align="center" sx={{ minWidth: '120px' }}></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <StyledTableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell align="center" component="th" scope="row">
                                        {item.id}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{item.address.fullName}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {item.total.toLocaleString('vi-VN')}
                                    </StyledTableCell>
                                    <StyledTableCell align="left" sx={{ minWidth: '10rem' }}>
                                        {item.note}
                                    </StyledTableCell>

                                    {/* start select status */}
                                    <StyledTableCell align="center">
                                        <SelectStatus status={item.status} idOrder={item.id} />
                                    </StyledTableCell>
                                    {/*end select status */}

                                    <StyledTableCell align="center">
                                        <Link to={config.Routes.detailBill + '#' + item.id}>
                                            <IconButton>
                                                <InfoTwoTone sx={{ color: '#0802A3', fontSize: 26 }} />
                                            </IconButton>
                                        </Link>
                                        <IconButton onClick={() => handleDeleteOrder(item.id)}>
                                            <DeleteTwoTone sx={{ color: '#E74646', fontSize: 26 }} />
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
