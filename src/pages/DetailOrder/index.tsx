// libs
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Breadcrumbs from '@mui/material/Breadcrumbs';
// types
import IOrder from '@/types/order';
import IProductCart from '@/types/productCart';
// components
import FormOrder from './mains/FormOrder';
import ItemsOrder from './mains/ItemsOrder';
// ghosts
import GetOrder from './ghosts/GetOrder';
// others
import config from '@/config';

const DetailOrder = () => {
    const { idOrder } = useParams();

    const [products, setProducts] = useState<Array<IProductCart>>([]);
    const [order, setOrder] = useState<IOrder>();

    return (
        <>
            <GetOrder {...{ setProducts, setOrder }} />
            <section className="space-y-5 max-w-[1240px] m-auto">
                <div className="flex flex-wrap justify-between items-center gap-5">
                    <Breadcrumbs className="!font-medium">
                        <Link
                            to={config.Routes.listBill}
                            className="font-semibold decoration-primary-700 decoration-1 underline-offset-2 transition hover:underline hover:text-primary-700"
                        >
                            <ArrowBackIcon fontSize="small" className="mr-2 mb-1" />
                            Danh sách đơn hàng
                        </Link>
                        <div>{idOrder}</div>
                    </Breadcrumbs>
                </div>
                <FormOrder {...{ order }} />

                <ItemsOrder products={products} />
            </section>
        </>
    );
};

export default DetailOrder;
