// libs
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
// types
import ICategory from '@/types/category';
import IProduct from '@/types/product';
// components
import Pagination from '@/components/Pagination';
import Button from '@/components/Button';
import Error404 from '../Error404';
import ModalQuantity from './mains/ModalQuantity';
import TableProducts from './mains/TableProducts';
import FilterProducts from './mains/FilterProducts';
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
    const [openModalQuantity, setOpenModalQuantity] = useState(false);
    const [behaviorGetCategories, setBehaviorGetCategories] = useState<boolean>(false);

    const handleCloseModal = useCallback(() => setOpenModalQuantity(false), []);

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
                open={openModalQuantity}
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
                    <FilterProducts {...{ setSearch, setCate, setSortBy, cate, categories, sortBy }} />
                </div>

                <TableProducts
                    {...{
                        loadingAPIGetProducts,
                        categories,
                        products,
                        setBehaviorGetCategories,
                        setProductAddQuantity,
                        setOpenModalQuantity,
                    }}
                />

                <div className="w-full flex justify-center mt-5">
                    <Pagination
                        {...{
                            totalPages,
                            page,
                            setPage,
                        }}
                    />
                </div>
            </section>
        </>
    );
};

export default ListProduct;
