// libs
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// types
import ICategory from '@/types/category';
import IProduct from '@/types/product';
// components
import Search from '@/components/Search/Search';
import Button from '@/components/Button';
import Error404 from '../Error404';
import ModalQuantity from './mains/ModalQuantity';
import TableProducts from './mains/TableProducts';
// ghosts
import GetProducts from './ghosts/GetProducts';
import GetCategories from './ghosts/GetCategories';
// others
import config from '@/config';

const ListProduct = () => {
    const [categories, setCategories] = useState<Array<ICategory>>([]);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [loadingAPIGetProducts, setLoadingAPIGetProducts] = useState<boolean>(false);
    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [cate, setCate] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [productAddQuantity, setProductAddQuantity] = useState<IProduct>();
    const [openModal, setOpenModal] = useState(false);
    const [behaviorGetCategories, setBehaviorGetCategories] = useState<boolean>(false);

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

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetProducts
                {...{
                    setLoadingAPIGetProducts,
                    page,
                    search,
                    cate,
                    sortBy,
                    setProducts,
                    setTotalPages,
                    setPage,
                    setErrorAPI,
                    behaviorGetCategories,
                }}
            />
            <GetCategories {...{ setCategories, setErrorAPI }} />

            <ModalQuantity
                open={openModal}
                handleClose={handleCloseModal}
                product={productAddQuantity}
                setBehaviorGetCategories={setBehaviorGetCategories}
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

                <TableProducts
                    {...{
                        loadingAPIGetProducts,
                        categories,
                        products,
                        setBehaviorGetCategories,
                        setProductAddQuantity,
                        setOpenModal,
                    }}
                />

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
