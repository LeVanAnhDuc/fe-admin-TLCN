// libs
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
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
// types
import {
    getAllProductSearchWithinPagination,
    toggleIsActiveProduct,
    toggleIsSellingProduct,
} from '../../apis/productApi';
import ICategory from '../../interface/category';
import IProduct from '../../interface/product';
// components
import Search from '../../components/Search/Search';
import Button from '../../components/Button';
import Skeleton from '../../components/Skeleton';
import PopConfirm from '../../components/PopConfirm';
import Error404 from '../Error404';
import ModalQuantity from './ModalQuantity';
// apis
import { getAllCategory } from '../../apis/categoryApi';
// others
import config from '../../config';
import { convertNumberToVND } from '../../utils/convertData';

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
    const itemsPerPage = 24;

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
        navigate(`${config.Routes.detailProduct}/${productDetail.id}`, { state: { categories: categories } });
    };

    const handleCopy = (item: IProduct, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (item) {
            navigator.clipboard.writeText(`${item.id}`);
        }
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

            <section className="space-y-3">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold flex items-center">Sản phẩm</div>
                    <Link to={config.Routes.addProduct}>
                        <Button variant="fill" className="!h-9 text-sm">
                            Thêm sản phẩm mới
                        </Button>
                    </Link>
                </div>

                <div className="grid sm:grid-cols-3 lg:grid-cols-12 gap-3 bg-white p-2 rounded-lg">
                    <div className="col-span-1 lg:col-span-6">
                        <Search setSearch={setSearch} placeHolder="Tìm theo theo tên sản phẩm" />
                    </div>

                    <FormControl className="col-span-1 lg:col-span-3">
                        <InputLabel>Lọc theo danh mục</InputLabel>
                        <Select value={cate} label="Lọc theo danh mục" onChange={handleFilterCategory} defaultValue="">
                            <MenuItem value={''}>Không lọc</MenuItem>
                            {categories.map((item, index) => (
                                <MenuItem key={index} value={item.name}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl className="col-span-1 lg:col-span-3">
                        <InputLabel>Sắp xếp</InputLabel>
                        <Select value={sortBy} label="Sắp xếp" onChange={handleFilterSortBy}>
                            <MenuItem value={''}>Không sắp xếp</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.idAsc}>Cũ nhất</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.idDesc}>Mới nhất</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.priceAsc}>Giá ↑</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.priceDesc}>Giá ↓</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.ratingAsc}>Số sao ↑</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.ratingDesc}>Số sao ↓</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.soldAsc}> Số lượng đã bán ↑</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.soldDesc}>Số lượng đã bán ↓</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.availableAsc}>Số lượng có sẵn ↑</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.availableDesc}>Số lượng có sẵn ↓</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.reviewAsc}>Lượt đánh giá ↑</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.reviewDesc}>Lượt đánh giá ↓</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.favoriteAsc}>Lượt yêu thích ↑</MenuItem>
                            <MenuItem value={config.SearchFilterProduct.favoriteDesc}>Lượt yêu thích ↓</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <Paper>
                    <TableContainer className="rounded-md">
                        <Table>
                            <TableHead className="">
                                <TableRow>
                                    <TableCell align="center" className="!font-bold text-nowrap">
                                        ID
                                    </TableCell>
                                    <TableCell align="center" className="!font-bold text-nowrap">
                                        Sản phẩm
                                    </TableCell>
                                    <TableCell className="!font-bold text-nowrap">Số lượng</TableCell>
                                    <TableCell className="!font-bold text-nowrap">Đã bán</TableCell>
                                    <TableCell className="!font-bold text-nowrap">Có sẵn</TableCell>
                                    <TableCell className="!font-bold text-nowrap">Giá bán lẻ</TableCell>
                                    <TableCell align="center" className="!font-bold text-nowrap">
                                        Trạng thái
                                    </TableCell>
                                    <TableCell align="center" className="!font-bold text-nowrap">
                                        Thao tác
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loadingAPIGetProducts
                                    ? Array(10)
                                          .fill(null)
                                          .map((_, index) => (
                                              <TableRowCustom key={index} className="h-10 bg-white">
                                                  {Array(8)
                                                      .fill(null)
                                                      .map((_, index) => (
                                                          <TableCell key={index}>
                                                              <Skeleton className="h-10" />
                                                          </TableCell>
                                                      ))}
                                              </TableRowCustom>
                                          ))
                                    : products.map((item) => (
                                          <TableRowCustom key={item.id} className="hover:!bg-primary-50">
                                              <TableCell
                                                  align="left"
                                                  className="cursor-pointer"
                                                  onClick={() => handleNavigateDetailProduct(item)}
                                              >
                                                  <div className="flex items-center">
                                                      <Tooltip title="Copy ID">
                                                          <IconButton size="small" onClick={(e) => handleCopy(item, e)}>
                                                              <FileCopyOutlinedIcon
                                                                  sx={{ width: '16px', height: '16px' }}
                                                              />
                                                          </IconButton>
                                                      </Tooltip>
                                                      <span>{item.id}</span>
                                                  </div>
                                              </TableCell>
                                              <TableCell
                                                  align="left"
                                                  className="cursor-pointer"
                                                  onClick={() => handleNavigateDetailProduct(item)}
                                              >
                                                  <div className="flex items-center gap-2">
                                                      <Avatar
                                                          variant="rounded"
                                                          src={item.listImages[0]}
                                                          alt="Sản phẩm"
                                                          className="object-cover object-center size-full"
                                                      />
                                                      <div className="max-w-52 w-30 lg:max-w-72 truncate">
                                                          {item.name}
                                                      </div>
                                                  </div>
                                              </TableCell>
                                              <TableCell
                                                  className="cursor-pointer"
                                                  onClick={() => handleNavigateDetailProduct(item)}
                                              >
                                                  {item.quantity}
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
                                                  {convertNumberToVND(item.price)}đ
                                              </TableCell>
                                              <TableCell
                                                  className="cursor-pointer"
                                                  onClick={() => handleNavigateDetailProduct(item)}
                                              >
                                                  <span className="font-semibold rounded-md space-x-1 flex items-center">
                                                      {item.status === 'Đang hoạt động' && (
                                                          <span className="inline-block size-2 rounded-full bg-[#7fc066]"></span>
                                                      )}
                                                      <span
                                                          className={` ${
                                                              item.status === 'Đang hoạt động'
                                                                  ? 'text-[#7fc066] bg-[#e8ffdb]'
                                                                  : 'text-gray-400 bg-gray-200'
                                                          } rounded-md items-center px-2 truncate`}
                                                      >
                                                          {item.status}
                                                      </span>
                                                  </span>
                                              </TableCell>
                                              <TableCell align="center">
                                                  <div className="flex items-center justify-center">
                                                      <Button
                                                          className="text-sm font-semibold text-[#5d51a7] rounded-3xl text-nowrap hover:bg-[rgba(0,0,0,0.04)]"
                                                          onClick={() => handleAddQuantityProduct(item.id)}
                                                      >
                                                          Nhập hàng
                                                      </Button>
                                                      <span className="text-gray-400">|</span>
                                                      <PopConfirm
                                                          title="Xác nhận xóa sản phẩm?"
                                                          content=""
                                                          onConfirm={() => handleDeleteProduct(item.id)}
                                                      >
                                                          <Button className="text-sm font-semibold rounded-3xl text-[#ff3131] hover:bg-[rgba(0,0,0,0.04)]">
                                                              Xóa
                                                          </Button>
                                                      </PopConfirm>
                                                      <span className="text-gray-400">|</span>
                                                      <div onClick={() => handleToggleSellProduct(item.id)}>
                                                          {item.isSelling ? (
                                                              <Button className="text-sm font-semibold rounded-3xl bg-gray-400 text-while-500 text-nowrap hover:bg-[rgba(0,0,0,0.04)]">
                                                                  Dừng đăng bán
                                                              </Button>
                                                          ) : (
                                                              <Button className="text-sm font-semibold rounded-3xl bg-blue-400 text-[#5d51a7] text-nowrap hover:bg-[rgba(0,0,0,0.04)]">
                                                                  Đăng bán ngay
                                                              </Button>
                                                          )}
                                                      </div>
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
