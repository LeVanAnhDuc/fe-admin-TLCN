// libs
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { UseFormSetValue } from 'react-hook-form';
// types
import IProductCart from '@/types/productCart';
import IOrder from '@/types/order';
// others
import config from '@/config';
import { convertNumberToVND } from '@/utils/convertData';

const GetOrder = ({
    setProducts,
    setValue,
}: {
    setProducts: React.Dispatch<React.SetStateAction<IProductCart[]>>;
    setValue: UseFormSetValue<IOrder>;
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const getOrder = () => {
        try {
            if (location.state.orderDetail) {
                const dataOrder = location.state.orderDetail;

                setProducts(dataOrder.orderItems);

                setValue('address', dataOrder.address);
                setValue('createdDate', dataOrder.createdDate);
                setValue('isPaidBefore', dataOrder.isPaidBefore ? 'Đã thanh toán' : 'Chưa thanh toán');
                setValue('lastModifiedBy', dataOrder.lastModifiedBy);
                setValue('lastModifiedDate', dataOrder.lastModifiedDate);
                setValue('note', dataOrder.note || 'Không có ghi chú');
                setValue('paymentType', dataOrder.paymentType);
                setValue('status', dataOrder.status);
                setValue('total', convertNumberToVND(dataOrder.total));
                setValue('user', dataOrder.userId);
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
