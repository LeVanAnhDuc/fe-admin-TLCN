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
import Search from '@mui/icons-material/Search';

import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import config from '../../config';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#B3A492',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
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

enum EStatusOrder {
    PENDING_PROCESSING = 'Đang chờ xử lý',
    PROCESSING = 'Đang xử lý',
    SHIPPED = 'Đã gửi',
    DELIVERED = 'Đã giao',
    CANCELED = 'Đã hủy',
}

interface IItemBill {
    id: string;
    fName: string;
    lName: string;
    total: number;
    note: string;
    status: EStatusOrder;
}

const rows: Array<IItemBill> = [
    {
        id: 'asd',
        fName: 'Lê',
        lName: 'Đức',
        total: 1000,
        note: '',
        status: EStatusOrder.PENDING_PROCESSING,
    },
    {
        id: 'cxz',
        fName: 'Lê',
        lName: 'Đức',
        total: 1000,
        note: 'Giao hàng cẩn thậnaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaa',
        status: EStatusOrder.PROCESSING,
    },
    { id: 'rwe', fName: 'Lê', lName: 'Đức', total: 1000, note: 'Giao hàng cẩn thận', status: EStatusOrder.CANCELED },
    { id: 'e34', fName: 'Lê', lName: 'Đức', total: 1000, note: 'Giao hàng cẩn thận', status: EStatusOrder.DELIVERED },
    { id: 'f45', fName: 'Lê', lName: 'Đức', total: 1000, note: 'Giao hàng cẩn thận', status: EStatusOrder.SHIPPED },
    { id: 'scf', fName: 'Lê', lName: 'Đức', total: 1000, note: 'Giao hàng cẩn thận', status: EStatusOrder.DELIVERED },
    {
        id: '123',
        fName: 'Lê',
        lName: 'Đức',
        total: 1000,
        note: '',
        status: EStatusOrder.CANCELED,
    },
];

const ListBill = () => {
    // change page
    // const [data, setData] = useState([]); // Dữ liệu từ API
    const [page, setPage] = useState(1); // Trang hiện tại
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [totalPages, setTotalPages] = useState(11); // Tổng số trang

    useEffect(() => {
        // Gọi API để lấy dữ liệu
    }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        console.log(event);

        setPage(newPage);
    };
    return (
        <div>
            <div className="grid grid-cols-1 pb-3 md:grid-cols-2">
                <div className="text-lg font-semibold flex items-center">Danh sách hóa đơn</div>
                <form>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search sx={{ color: 'gray' }} />
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                            placeholder="Search..."
                            required
                        />
                        <button
                            type="submit"
                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 460 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell align="left" sx={{ minWidth: '100px' }}>
                                    Name Customer
                                </StyledTableCell>
                                <StyledTableCell align="left">Total</StyledTableCell>
                                <StyledTableCell align="left">Note</StyledTableCell>
                                <StyledTableCell align="center" sx={{ minWidth: '120px' }}>
                                    Status
                                </StyledTableCell>
                                <StyledTableCell align="center" sx={{ minWidth: '120px' }}>
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((item, index) => (
                                <StyledTableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell component="th" scope="row">
                                        {item.id}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {item.fName} {item.lName}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{item.total}</StyledTableCell>
                                    <StyledTableCell align="left" sx={{ minWidth: '10rem' }}>
                                        {item.note}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <div
                                            className={`${
                                                item.status === EStatusOrder.PENDING_PROCESSING && 'bg-[#E5D9B6]'
                                            }
                                                    ${item.status === EStatusOrder.PROCESSING && 'bg-[#FFD460]'}
                                                    ${item.status === EStatusOrder.SHIPPED && 'bg-[#93B5C6]'}
                                                    ${item.status === EStatusOrder.DELIVERED && 'bg-[#5F8D4E]'}
                                                    ${item.status === EStatusOrder.CANCELED && 'bg-[#E23E57]'}
                                            } h-10 flex place-content-center items-center text-black font-semibold`}
                                        >
                                            {item.status}
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Link to={config.Routes.detailBill}>
                                            <IconButton>
                                                <InfoTwoTone sx={{ color: '#0802A3', fontSize: 26 }} />
                                            </IconButton>
                                        </Link>
                                        <IconButton>
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
