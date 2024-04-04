import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import AddCircle from '@mui/icons-material/AddCircle';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
import ModalQuantity from './ModalQuantity';
import ICategory from '../../interface/category';
import { getAllCategory } from '../../apis/categoryApi';
import { convertNumberToVND } from '../../utils/convertData';
import Button from '../../components/Button';
import Error404 from '../Error404';
import Skeleton from '../../components/Skeleton';
import PopConfirm from '../../components/PopComfirm';

const TableRowCustom = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ListProduct = () => {
    const navigate = useNavigate();
    const itemsPerPage = 20;

    const [categories, setCategories] = useState<Array<ICategory>>([]);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [loadingAPIGetProducts, setLoadingAPIGetProducts] = useState<boolean>(false);
    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [cate, setCate] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [IDProductAddQuantity, setIDProductAddQuantity] = useState<number>(0);
    const [openModal, setOpenModal] = useState(false);

    const getAllProducts = async () => {
        try {
            setLoadingAPIGetProducts(true);
            const response = await getAllProductSearchWithinPagination(page, itemsPerPage, search, cate, sortBy);
            setLoadingAPIGetProducts(false);
            if (response.status === 200) {
                const { content, totalPages } = response.data;

                setProducts(content);
                setTotalPages(totalPages);

                if (totalPages > 0 && content.length <= 0) {
                    setPage((prev) => prev - 1);
                }
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    const handleDeleteProduct = async (idProduct: number) => {
        try {
            const response = await toggleIsActiveProduct(idProduct);
            if (response.status === 200) {
                toast.success('Xóa thành công');
                getAllProducts();
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleToggleSellProduct = async (idProduct: number) => {
        const response = await toggleIsSellingProduct(idProduct);
        try {
            if (response.status === 200) {
                if (response.data.isSelling) {
                    toast.success('Mở bán thành công');
                } else {
                    toast.success('Ẩn bán thành công');
                }
                getAllProducts();
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleAddQuantityProduct = (idProduct: number) => {
        setIDProductAddQuantity(idProduct);
        setOpenModal(true);
    };

    const handleCloseModal = useCallback(() => setOpenModal(false), []);

    const handleFilterCategory = (event: SelectChangeEvent) => {
        setCate(event.target.value as string);
    };

    const handleFilterSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setPage(newPage);
    };

    const handleNavigateDetailProduct = (productDetail: IProduct) => {
        navigate(`${config.Routes.detailProduct}/${productDetail.id}`);
    };

    useEffect(() => {
        getAllProducts();
    }, [page, search, cate, sortBy]);

    useEffect(() => {
        const handleGetListCate = async () => {
            try {
                const res = await getAllCategory();
                if (res.status === 200) {
                    setCategories(res.data.content);
                }
            } catch {
                setErrorAPI(true);
            }
        };
        handleGetListCate();
    }, []);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <ModalQuantity
                open={openModal}
                handleClose={handleCloseModal}
                IDProduct={IDProductAddQuantity}
                getAllProducts={getAllProducts}
            />

            <section className="space-y-5">
                <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold flex items-center">Danh sách sản phẩm</div>
                    <Link to={config.Routes.addProduct}>
                        <Button variant="fill">Thêm mới</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-lg">
                    <div className="col-span-2">
                        <Search setSearch={setSearch} placeHolder="Tìm theo theo tên sản phẩm" />
                    </div>

                    <FormControl className="col-span-2 sm:col-span-1">
                        <InputLabel>Lọc theo danh mục</InputLabel>
                        <Select value={cate} label="Lọc theo danh mục" onChange={handleFilterCategory} defaultValue="">
                            <MenuItem value={''}>Tắt lọc</MenuItem>
                            {categories.map((item, index) => (
                                <MenuItem key={index} value={item.name}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl className="col-span-2 sm:col-span-1">
                        <InputLabel>Sắp xếp</InputLabel>
                        <Select value={sortBy} label="Sắp xếp" onChange={handleFilterSortBy}>
                            <MenuItem value={''}>Tắt sắp xếp</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.priceAsc}>Giá tăng dần</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.priceDesc}>Giá giảm dần</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.idAsc}>Ngày tạo cũ nhất</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.idDesc}>Ngày tạo mới nhất</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.soldAsc}>Số lượng đã bán tăng dần</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.soldDesc}>Số lượng đã bán giảm dần</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.availableAsc}>
                                Số lượng có sẵn tăng dần
                            </MenuItem>
                            <MenuItem value={config.SearchFilterProduct.availableDesc}>
                                Số lượng có sẵn giảm dần
                            </MenuItem>
                            <MenuItem value={config.SearchFilterProduct.reviewAsc}>Số lượt đánh giá tăng dần</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.reviewDesc}>Số lượt đánh giá giảm dần</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.favoriteAsc}>Số yêu thích tăng dần</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.favoriteDesc}>Số yêu thích giảm dần</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.ratingAsc}>Số sao tăng dần</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.ratingDesc}>Số sao giảm dần</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead className="!bg-primary-200">
                                <TableRow>
                                    <TableCell align="center" className="!font-bold">
                                        ID
                                    </TableCell>
                                    <TableCell className="!font-bold"></TableCell>
                                    <TableCell className="!font-bold">Tên sản phẩm</TableCell>
                                    <TableCell className="!font-bold">Đã bán</TableCell>
                                    <TableCell className="!font-bold">Có sẵn</TableCell>
                                    <TableCell className="!font-bold">Giá (VNĐ)</TableCell>
                                    <TableCell align="center" className="!font-bold">
                                        Thao tác
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loadingAPIGetProducts
                                    ? Array(10)
                                          .fill(null)
                                          .map((_, index) => (
                                              <TableRowCustom key={index}>
                                                  {Array(7)
                                                      .fill(null)
                                                      .map((_, index) => (
                                                          <TableCell key={index}>
                                                              <Skeleton className="h-12" />
                                                          </TableCell>
                                                      ))}
                                              </TableRowCustom>
                                          ))
                                    : products.map((item) => (
                                          <TableRowCustom key={item.id} className="hover:!bg-primary-50">
                                              <TableCell
                                                  align="center"
                                                  className="cursor-pointer"
                                                  onClick={() => handleNavigateDetailProduct(item)}
                                              >
                                                  #{item.id}
                                              </TableCell>
                                              <TableCell
                                                  className="cursor-pointer"
                                                  onClick={() => handleNavigateDetailProduct(item)}
                                              >
                                                  <Avatar
                                                      variant="rounded"
                                                      src={item.listImages[0]}
                                                      alt="Sản phẩm"
                                                      className="object-cover object-center size-full"
                                                  />
                                              </TableCell>
                                              <TableCell
                                                  className="max-w-40 lg:max-w-96 truncate cursor-pointer"
                                                  onClick={() => handleNavigateDetailProduct(item)}
                                              >
                                                  {item.name}
                                              </TableCell>
                                              <TableCell
                                                  className="cursor-pointer"
                                                  onClick={() => handleNavigateDetailProduct(item)}
                                              >
                                                  {item.sold}
                                              </TableCell>
                                              <TableCell
                                                  className="cursor-pointer"
                                                  onClick={() => handleNavigateDetailProduct(item)}
                                              >
                                                  {item.quantityAvailable}
                                              </TableCell>
                                              <TableCell
                                                  className="cursor-pointer"
                                                  onClick={() => handleNavigateDetailProduct(item)}
                                              >
                                                  {convertNumberToVND(item.price)}
                                              </TableCell>

                                              <TableCell align="center" className="min-w-40">
                                                  <IconButton onClick={() => handleAddQuantityProduct(item.id)}>
                                                      <MouseOverPopover content="Nhập thêm hàng">
                                                          <AddCircle className="text-blue-400" />
                                                      </MouseOverPopover>
                                                  </IconButton>
                                                  <IconButton onClick={() => handleToggleSellProduct(item.id)}>
                                                      {item.isSelling ? (
                                                          <MouseOverPopover content="Không đăng bán">
                                                              <Visibility className="text-gray-500" />
                                                          </MouseOverPopover>
                                                      ) : (
                                                          <MouseOverPopover content="Đăng bán ngay">
                                                              <VisibilityOff className="text-gray-500" />
                                                          </MouseOverPopover>
                                                      )}
                                                  </IconButton>
                                                  <div className="inline-block">
                                                      <PopConfirm
                                                          content="Nếu xóa dữ liệu sẽ mất đi và không thể hoàn lại"
                                                          title="Xóa sản phẩm"
                                                          onConfirm={() => handleDeleteProduct(item.id)}
                                                      >
                                                          <MouseOverPopover content="Xóa sản phẩm">
                                                              <IconButton>
                                                                  <DeleteTwoTone className="text-red-500" />
                                                              </IconButton>
                                                          </MouseOverPopover>
                                                      </PopConfirm>
                                                  </div>
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
            </section>
        </>
    );
};

export default ListProduct;
