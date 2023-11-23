import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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

import config from '../../config';
import IProduct from '../../interface/product';
import { getAllProductWithinPagination } from '../../apis/productApi';
import Button from '@mui/material/Button';
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

const ListProduct = () => {
    // change page
    const [data, setData] = useState<Array<IProduct>>([]); // Dữ liệu từ API
    const [page, setPage] = useState<number>(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState<number>(0); // Tổng số trang
    const itemsPerPage = 20;

    const getAllProducts = async (pageNo: number) => {
        try {
            const response = await getAllProductWithinPagination(pageNo, itemsPerPage);
            const { content, totalPages } = response.data;
            console.log(content);

            setData(content);
            setTotalPages(totalPages);
        } catch (error) {
            toast.error('Đang bảo trì quay lại sau');
        }
    };

    useEffect(() => {
        getAllProducts(page);
    }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            <div className="flex justify-between">
                <div className="text-lg font-semibold flex items-center">Danh sách sản phẩm</div>
                <Button variant="contained">Thêm mới</Button>
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
                                <StyledTableCell align="left">Tên sản phẩm</StyledTableCell>
                                <StyledTableCell align="center">Đã bán</StyledTableCell>
                                <StyledTableCell align="center">SLCL</StyledTableCell>
                                <StyledTableCell align="left" sx={{ minWidth: '90px' }}>
                                    Giá
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
                                    <StyledTableCell
                                        align="left"
                                        sx={{
                                            maxWidth: '300px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {item.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{item.sold}</StyledTableCell>
                                    <StyledTableCell align="center">{item.quantityAvailable}</StyledTableCell>
                                    <StyledTableCell align="left">{item.price.toLocaleString('vi-VN')}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Link to={config.Routes.detailProduct}>
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

export default ListProduct;
