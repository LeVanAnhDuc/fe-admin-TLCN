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
import Button from '@mui/material/Button';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import InfoTwoTone from '@mui/icons-material/InfoTwoTone';
import { styled } from '@mui/material/styles';

import config from '../../config';
import ICategory from '../../interface/category';
import { deteleASingleCategory, getAllCategoryWithPagination } from '../../apis/categoryApii';
import Search from '../../components/Search/Search';
import ModalCategory from './ModalCategory/ModalCategory';

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

const ListCategory = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // change page
    const [data, setData] = useState<Array<ICategory>>([]); // Dữ liệu từ API
    const [page, setPage] = useState<number>(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState<number>(0); // Tổng số trang
    const itemsPerPage = 5;
    // panigation
    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };
    // get all category
    const getAllProducts = async (pageNo: number) => {
        try {
            const response = await getAllCategoryWithPagination(pageNo, itemsPerPage);
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

    // delete item
    const handleDeleteItem = async (idItem: number) => {
        const response = await deteleASingleCategory(idItem);
        if (response.status === 200) {
            toast.success(response.data);
        } else {
            toast.error(response.data.message || response.data);
        }
        setIsLoading((prev) => !prev);
    };

    // modal
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        getAllProducts(page);
    }, [page, open, isLoading]);
    return (
        <>
            <ModalCategory open={open} handleClose={handleClose} />
            <div className="flex justify-between">
                <div className="text-lg font-semibold flex items-center">Danh sách loại sản phẩm</div>
                <Button variant="contained" onClick={handleOpen}>
                    Thêm mới
                </Button>
            </div>
            <div className="flex justify-center m-auto my-4 md:w-7/12">
                <Search />
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 460 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell align="left">Tên loại</StyledTableCell>
                                <StyledTableCell align="center">Mô tả</StyledTableCell>
                                <StyledTableCell align="center">Total Products</StyledTableCell>
                                <StyledTableCell align="center" sx={{ minWidth: '120px' }}>
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <StyledTableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell component="th" scope="row">
                                        {item.id}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        <div className="">{item.name}</div>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{item.description}</StyledTableCell>
                                    <StyledTableCell align="center">{item.productNumber}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Link to={config.Routes.detailCategory + '#' + item.id}>
                                            <IconButton>
                                                <InfoTwoTone sx={{ color: '#0802A3', fontSize: 26 }} />
                                            </IconButton>
                                        </Link>
                                        <IconButton onClick={() => handleDeleteItem(item.id)}>
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
        </>
    );
};

export default ListCategory;
