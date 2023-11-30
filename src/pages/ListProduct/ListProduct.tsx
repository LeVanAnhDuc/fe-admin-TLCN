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
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';

import config from '../../config';
import IProduct from '../../interface/product';
import {
    getAllProductWithinPaginationSearch,
    toggleIsActiveProduct,
    toggleIsSellingProduct,
} from '../../apis/productApi';
import Search from '../../components/Search/Search';
import MouseOverPopover from '../../components/MouseOverPopover/MouseOverPopover';
import Avatar from '@mui/material/Avatar';

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
    const [isLoading, setLoading] = useState<boolean>(false);
    // change page
    const [data, setData] = useState<Array<IProduct>>([]); // Dữ liệu từ API
    const [page, setPage] = useState<number>(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState<number>(0); // Tổng số trang
    const [search, setSearch] = useState<string>('');
    const itemsPerPage = 20;

    const getAllProducts = async (pageNo: number) => {
        try {
            const response = await getAllProductWithinPaginationSearch(pageNo, itemsPerPage, search);
            console.log(search);

            const { content, totalPages } = response.data;

            setData(content);
            setTotalPages(totalPages);
            if (totalPages > 0 && content.length <= 0) {
                setPage((prev) => prev - 1);
            }
        } catch (error) {
            toast.error('Đang bảo trì quay lại sau');
        }
    };

    useEffect(() => {
        getAllProducts(page);
    }, [page, isLoading, search]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    // handle delete

    const handleDeleteProduct = async (idProduct: number) => {
        const userConfirmed = window.confirm('Bạn có chắc chắn muốn xóa không?');

        if (userConfirmed) {
            try {
                const response = await toggleIsActiveProduct(idProduct);
                if (response.status === 200) {
                    toast.success('Xóa thành công');
                } else {
                    toast.error('Thất bại');
                }
                setLoading((prev) => !prev);
            } catch (error) {
                toast.error(`Lỗi xóa: ${error} `);
            }
        } else {
            toast.info('Hủy xóa');
        }
    };

    const handleIsSellingProduct = async (idProduct: number) => {
        const response = await toggleIsSellingProduct(idProduct);

        if (response.status === 200) {
            if (response.data.isSelling) {
                toast.success('Mở bán thành công');
            } else {
                toast.success('Ẩn bán thành công');
            }
        } else {
            toast.error('Thất bại');
        }
        setLoading((prev) => !prev);
    };

    return (
        <div>
            <div className="flex justify-between">
                <div className="text-lg font-semibold flex items-center">Danh sách sản phẩm</div>
                <Link to={config.Routes.addProduct}>
                    <Button variant="contained">Thêm mới</Button>
                </Link>
            </div>
            <div className="flex justify-center m-auto my-4 md:w-7/12">
                <Search setSearch={setSearch} placeHolder="Tìm theo theo tên sản phẩm" />
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">ID</StyledTableCell>
                                <StyledTableCell align="center">Hình ảnh</StyledTableCell>
                                <StyledTableCell align="left">Tên sản phẩm</StyledTableCell>
                                <StyledTableCell align="center">Đã bán</StyledTableCell>
                                <StyledTableCell align="center">Có sẵn</StyledTableCell>
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
                                        align="center"
                                        component="th"
                                        scope="row"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Avatar variant="rounded" src={item.listImages[0]} alt="Sản phẩm" />
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
                                        <Link to={config.Routes.detailProduct + '#' + item.id}>
                                            <IconButton>
                                                <MouseOverPopover content="Xem thông tin chi tiết">
                                                    <InfoTwoTone sx={{ color: '#0802A3', fontSize: 26 }} />
                                                </MouseOverPopover>
                                            </IconButton>
                                        </Link>
                                        <IconButton onClick={() => handleDeleteProduct(item.id)}>
                                            <MouseOverPopover content="Xóa sản phẩm">
                                                <DeleteTwoTone sx={{ color: '#E74646', fontSize: 26 }} />
                                            </MouseOverPopover>
                                        </IconButton>
                                        <IconButton onClick={() => handleIsSellingProduct(item.id)}>
                                            {item.isSelling ? (
                                                <MouseOverPopover content="Không đăng bán">
                                                    <Visibility sx={{ color: '#E74646', fontSize: 26 }} />
                                                </MouseOverPopover>
                                            ) : (
                                                <MouseOverPopover content="Đăng bán ngay">
                                                    <VisibilityOff sx={{ color: '#E74646', fontSize: 26 }} />
                                                </MouseOverPopover>
                                            )}
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
