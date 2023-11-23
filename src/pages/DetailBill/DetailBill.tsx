import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';

import InputText from '../../components/InputText/InputText';
import config from '../../config';
import { getOrderByID } from '../../apis/orderApi';
import IOrder from '../../interface/order';
import IProductCart from '../../interface/productCart';
import DetailOrder from './DetailOrder/DetailOrder';
import IAddress from '../../interface/address';

const DetailBill = () => {
    const navigate = useNavigate();
    // handle get id
    const location = useLocation();
    const idProduct = location.hash.substring(1);
    // set product
    const [products, setProducts] = useState<Array<IProductCart>>([]);
    const [address, setAddress] = useState<IAddress>();

    // handle get data
    const getOrder = async (id: number) => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                // tồn tai ma san pham và phải là số
                const response = await getOrderByID(id);

                if (response.status === 200) {
                    //  set address
                    setAddress(response.data.address);

                    await setValue('createdDate', response.data.createdDate);
                    await setValue('isPaidBefore', response.data.isPaidBefore);
                    await setValue('lastModifiedBy', response.data.lastModifiedBy);
                    await setValue('lastModifiedDate', response.data.lastModifiedDate);
                    await setValue('note', response.data.note);
                    // ds item
                    setProducts(response.data.orderItems);
                    //
                    await setValue('paymentType', response.data.paymentType);
                    await setValue('status', response.data.status);
                    await setValue('total', response.data.total.toLocaleString('vi-VN'));
                    await setValue('userId', response.data.userId);
                } else {
                    toast.error(response.data.message);
                    navigate(config.Routes.listCategory);
                }
            } else {
                navigate(config.Routes.listCategory);
            }
        } catch {
            toast.error('Đang bảo trì');
        }
    };
    useEffect(() => {
        getOrder(+idProduct);
    }, [idProduct]);

    const { register, handleSubmit, setValue } = useForm<IOrder>({});

    // submit form
    const onSubmit: SubmitHandler<IOrder> = () => {};

    return (
        <>
            <div className="flex flex-wrap justify-between pb-3 gap-5">
                <Link to={config.Routes.listBill}>
                    <Button variant="contained">
                        <KeyboardArrowLeft />
                        <span className="normal-case">Danh sách hóa đơn</span>
                    </Button>
                </Link>
            </div>
            <div className="my-5">
                {/* start account setting */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* start input userId*/}
                    <InputText labelInput="Tên người đặt" value={`${address?.fullName}`} readOnly />
                    {/* end input userId*/}

                    {/* start input addressId*/}
                    <InputText
                        labelInput="Địa chỉ"
                        value={`${address?.orderDetails}, ${address?.ward}, ${address?.district}, ${address?.city}`}
                        readOnly
                    />
                    {/* end input addressId*/}

                    {/* start input phone*/}
                    <InputText labelInput="Số điện thoại" value={`${address?.phoneNumber}`} readOnly />
                    {/* end input phone*/}

                    {/* starr createdDate */}
                    <InputText
                        labelInput="Ngày tạo"
                        register={{
                            ...register('createdDate', {
                                required: 'createdDate is required',
                            }),
                        }}
                        readOnly
                    />
                    {/* end createdDate */}
                    {/* start input isPaidBefore  */}
                    <InputText
                        labelInput="isPaidBefore"
                        register={{
                            ...register('isPaidBefore'),
                        }}
                        readOnly
                    />
                    {/* end input isPaidBefore */}
                    {/* start input  lastModifiedDate  */}
                    <InputText
                        labelInput="Ngày chỉnh sửa cuối"
                        register={{
                            ...register('lastModifiedDate', {
                                required: 'lastModifiedDate is required',
                            }),
                        }}
                        readOnly
                    />
                    {/* end input lastModifiedDate */}
                    {/* starr note */}
                    <InputText
                        labelInput="Ghi chú"
                        register={{
                            ...register('note', {
                                required: 'note is required',
                            }),
                        }}
                        readOnly
                    />
                    {/* end note */}

                    {/* start input  paymentType*/}
                    <InputText
                        labelInput="Hình thức thanh toán"
                        register={{
                            ...register('paymentType', {
                                required: 'createdBy is required',
                            }),
                        }}
                        readOnly
                    />
                    {/* end input paymentType */}
                    {/* start input  status*/}
                    <InputText
                        labelInput="Trạng thái"
                        register={{
                            ...register('status', {
                                required: 'status is required',
                            }),
                        }}
                        readOnly
                    />
                    {/* end input status*/}
                    {/* start input total*/}
                    <InputText
                        labelInput="Tổng tiền"
                        register={{
                            ...register('total', {
                                required: 'total is required',
                            }),
                        }}
                        readOnly
                    />
                    {/* end input total*/}
                </form>
                <DetailOrder products={products} />
            </div>

            {/* end account setting */}
        </>
    );
};

export default DetailBill;
