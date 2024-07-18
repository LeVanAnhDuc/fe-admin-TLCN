// libs
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
// types
import IProductCart from '@/types/productCart';
import IOrder from '@/types/order';
// others
import config from '@/config';
import { convertNumberToVND } from '@/utils/convertData';

const GetOrder = ({
    setProducts,
    setOrder,
}: {
    setProducts: React.Dispatch<React.SetStateAction<IProductCart[]>>;
    setOrder: React.Dispatch<React.SetStateAction<IOrder | undefined>>;
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const getOrder = () => {
        try {
            if (location.state.orderDetail) {
                const dataOrder = location.state.orderDetail;
                setOrder({
                    ...dataOrder,
                    note: dataOrder.note || 'Không có ghi chú',
                    isPaidBefore: dataOrder.isPaidBefore ? 'Đã thanh toán' : 'Chưa thanh toán',
                    total: convertNumberToVND(dataOrder.total),
                });
                setProducts(dataOrder.orderItems);
            } else {
                navigate(config.Routes.listBill);
            }
        } catch (error) {
            toast.error(`${error}`);
            navigate(config.Routes.listBill);
        }
    };

    useEffect(() => {
        getOrder();
    }, []);

    return null;
};

export default GetOrder;
