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
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import InfoTwoTone from '@mui/icons-material/InfoTwoTone';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import AddCircle from '@mui/icons-material/AddCircle';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import config from '../../config';
import IProduct from '../../interface/product';
import {
    getAllProductSearchWithinPagination,
    toggleIsActiveProduct,
    toggleIsSellingProduct,
} from '../../apis/productApi';
import Search from '../../components/Search/Search';
import MouseOverPopover from '../../components/MouseOverPopover/MouseOverPopover';
import ModalQuantity from './ModalQuantity/ModalQuantity';
import ICategory from '../../interface/category';
import { getAllCategory } from '../../apis/categoryApi';

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
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState<boolean>(false);
    // get list cate
    const [listCate, setListCate] = useState<Array<ICategory>>([]);
    const handleGetListCate = async () => {
        const res = await getAllCategory();
        if (res.status === 200) {
            setListCate(res.data.content);
        }
    };
    useEffect(() => {
        handleGetListCate();
    }, []);
    // change page
    const [data, setData] = useState<Array<IProduct>>([]); // Dữ liệu từ API
    const [page, setPage] = useState<number>(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState<number>(0); // Tổng số trang
    const [search, setSearch] = useState<string>('');
    const [cate, setCate] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const itemsPerPage = 20;

    const getAllProducts = async (pageNo: number) => {
        try {
            const response = await getAllProductSearchWithinPagination(pageNo, itemsPerPage, search, cate, sortBy);

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
    }, [page, isLoading, search, cate, sortBy]);

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

    // quantity
    const [IDProduct, setIDProduct] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const handleAddQuantityProduct = (idProduct: number) => {
        setIDProduct(idProduct);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    // change cate
    const handleChangeCate = (event: SelectChangeEvent) => {
        setCate(event.target.value as string);
    };
    // change sortBy
    const handleChangeSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };

    return (
        <div>
            <ModalQuantity open={open} handleClose={handleClose} IDProduct={IDProduct} setLoading={setLoading} />

            <div className="flex justify-between">
                <div className="text-lg font-semibold flex items-center">Danh sách sản phẩm</div>
                <Link to={config.Routes.addProduct}>
                    <Button variant="contained">Thêm mới</Button>
                </Link>
            </div>
            <div className="flex justify-center my-4 gap-5">
                <Search setSearch={setSearch} placeHolder="Tìm theo theo tên sản phẩm" />
                <FormControl sx={{ width: 600 }}>
                    <InputLabel>Lọc theo danh mục</InputLabel>
                    <Select value={cate} label="Lọc theo danh mục" onChange={handleChangeCate}>
                        <MenuItem value={''}>Tất cả</MenuItem>
                        {listCate.map((item, index) => (
                            <MenuItem key={index} value={item.name}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 600 }}>
                    <InputLabel>Sắp xếp</InputLabel>
                    <Select value={sortBy} label="Sắp xếp" onChange={handleChangeSortBy}>
                        <MenuItem value={''}>Không sắp xếp</MenuItem>
                        <MenuItem value={config.SearchFilterProduct.priceAsc}>Giá tăng dần</MenuItem>
                        <MenuItem value={config.SearchFilterProduct.priceDesc}>Giá giảm dần</MenuItem>

                        <MenuItem value={config.SearchFilterProduct.idAsc}>Ngày tạo cũ nhất</MenuItem>
                        <MenuItem value={config.SearchFilterProduct.idDesc}>Ngày tạo mới nhất</MenuItem>

                        <MenuItem value={config.SearchFilterProduct.soldAsc}>Số lượng đã bán tăng dần</MenuItem>
                        <MenuItem value={config.SearchFilterProduct.soldDesc}>Số lượng đã bán giảm dần</MenuItem>

                        <MenuItem value={config.SearchFilterProduct.availableAsc}>Số lượng có sẵn tăng dần</MenuItem>
                        <MenuItem value={config.SearchFilterProduct.availableDesc}>Số lượng có sẵn giảm dần</MenuItem>

                        <MenuItem value={config.SearchFilterProduct.reviewAsc}>Số lượt đánh giá tăng dần</MenuItem>
                        <MenuItem value={config.SearchFilterProduct.reviewDesc}>Số lượt đánh giá giảm dần</MenuItem>

                        <MenuItem value={config.SearchFilterProduct.favoriteAsc}>Số yêu thích tăng dần</MenuItem>
                        <MenuItem value={config.SearchFilterProduct.favoriteDesc}>Số yêu thích giảm dần</MenuItem>

                        <MenuItem value={config.SearchFilterProduct.ratingAsc}>Số sao tăng dần</MenuItem>
                        <MenuItem value={config.SearchFilterProduct.ratingDesc}>Số sao giảm dần</MenuItem>
                    </Select>
                </FormControl>
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
                                            navigate(config.Routes.detailProduct + '#' + item.id);
                                        }}
                                    >
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
                                        onClick={() => {
                                            navigate(config.Routes.detailProduct + '#' + item.id);
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
                                        onClick={() => {
                                            navigate(config.Routes.detailProduct + '#' + item.id);
                                        }}
                                    >
                                        {item.name}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="center"
                                        onClick={() => {
                                            navigate(config.Routes.detailProduct + '#' + item.id);
                                        }}
                                    >
                                        {item.sold}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="center"
                                        onClick={() => {
                                            navigate(config.Routes.detailProduct + '#' + item.id);
                                        }}
                                    >
                                        {item.quantityAvailable}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="left"
                                        onClick={() => {
                                            navigate(config.Routes.detailProduct + '#' + item.id);
                                        }}
                                    >
                                        {item.price.toLocaleString('vi-VN')}
                                    </StyledTableCell>
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
                                        <IconButton onClick={() => handleAddQuantityProduct(item.id)}>
                                            <MouseOverPopover content="Nhập thêm hàng">
                                                <AddCircle sx={{ color: '#E74646', fontSize: 26 }} />
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

export default ListProduct;
