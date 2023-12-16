import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import InfoTwoTone from '@mui/icons-material/InfoTwoTone';
import { styled } from '@mui/material/styles';

import config from '../../config';
import ICategory from '../../interface/category';
import { deteleASingleCategory, getAllCategoryWithinPaginationSearch } from '../../apis/categoryApi';
import Search from '../../components/Search/Search';
import ModalCategory from './ModalCategory/ModalCategory';
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

const ListCategory = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // change page
    const [data, setData] = useState<Array<ICategory>>([]); // Dữ liệu từ API
    const [page, setPage] = useState<number>(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState<number>(0); // Tổng số trang
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const itemsPerPage = 20;
    // panigation
    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };
    // get all category
    const getAllProducts = async (pageNo: number) => {
        try {
            const response = await getAllCategoryWithinPaginationSearch(pageNo, itemsPerPage, sortBy, search);
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

    // delete item
    const handleDeleteItem = async (idItem: number) => {
        const userConfirmed = window.confirm('Bạn có chắc chắn muốn xóa không?');
        if (userConfirmed) {
            try {
                const response = await deteleASingleCategory(idItem);
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
    const handleChangesetSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };

    // modal
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        getAllProducts(page);
    }, [page, open, isLoading, search, sortBy]);
    return (
        <>
            <ModalCategory open={open} handleClose={handleClose} />
            <div className="flex justify-between">
                <div className="text-lg font-semibold flex items-center">Danh sách danh mục sản phẩm</div>
                <Button variant="contained" onClick={handleOpen}>
                    Thêm mới
                </Button>
            </div>
            <div className="flex justify-center my-4 gap-5">
                <Search setSearch={setSearch} placeHolder="Tìm theo theo tên danh mục" />
                <FormControl sx={{ width: 400 }}>
                    <InputLabel>Lọc</InputLabel>
                    <Select value={sortBy} label="Lọc" onChange={handleChangesetSortBy}>
                        <MenuItem value={''}>Không lọc</MenuItem>
                        <MenuItem value={config.SearchFilterCategory.idAsc}>Ngày tạo: Thấp đến Cao</MenuItem>
                        <MenuItem value={config.SearchFilterCategory.idDesc}>Ngày tạo: Cao đến Thấp</MenuItem>
                        <MenuItem value={config.SearchFilterCategory.prod_countAsc}>
                            Số lượng sản phẩm: Thấp đến Cao
                        </MenuItem>
                        <MenuItem value={config.SearchFilterCategory.prod_countDesc}>
                            Số lượng sản phẩm: Cao đến Thấp
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">ID</StyledTableCell>
                                <StyledTableCell align="left">Tên loại</StyledTableCell>
                                <StyledTableCell align="center">Mô tả</StyledTableCell>
                                <StyledTableCell align="center">Tổng sản phẩm</StyledTableCell>
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
                                            navigate(config.Routes.detailCategory + '#' + item.id);
                                        }}
                                    >
                                        {item.id}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="left"
                                        onClick={() => {
                                            navigate(config.Routes.detailCategory + '#' + item.id);
                                        }}
                                    >
                                        <div className="">{item.name}</div>
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="left"
                                        onClick={() => {
                                            navigate(config.Routes.detailCategory + '#' + item.id);
                                        }}
                                    >
                                        {item.description}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="center"
                                        onClick={() => {
                                            navigate(config.Routes.detailCategory + '#' + item.id);
                                        }}
                                    >
                                        {item.productNumber}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Link to={config.Routes.detailCategory + '#' + item.id}>
                                            <IconButton>
                                                <MouseOverPopover content="Xem thông tin chi tiết">
                                                    <InfoTwoTone sx={{ color: '#0802A3', fontSize: 26 }} />
                                                </MouseOverPopover>
                                            </IconButton>
                                        </Link>
                                        <IconButton onClick={() => handleDeleteItem(item.id)}>
                                            <MouseOverPopover content="Xóa loại">
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
        </>
    );
};

export default ListCategory;
