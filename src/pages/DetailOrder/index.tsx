import { useForm, Controller } from 'react-hook-form';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import TextField from '@mui/material/TextField';

import config from '../../config';
import IOrder from '../../interface/order';
import IProductCart from '../../interface/productCart';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '../../components/Button';
import { convertNumberToVND } from '../../utils/convertData';
import Image from '../../components/Image';

const DetailOrder = () => {
    const navigate = useNavigate();
    const { idOrder } = useParams();
    const location = useLocation();

    const [products, setProducts] = useState<Array<IProductCart>>([]);

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

    const getAddressValue = () => {
        return `${getValues('address.orderDetails')}, ${getValues('address.ward')}, ${getValues(
            'address.district',
        )}, ${getValues('address.city')}`;
    };

    useEffect(() => {
        getOrder();
    }, []);

    const { control, setValue, getValues } = useForm<IOrder>({});

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-5">
                <Breadcrumbs className="!font-medium">
                    <Link
                        to={config.Routes.listBill}
                        className="font-semibold decoration-primary-700 decoration-1 underline-offset-2 transition hover:underline hover:text-primary-700"
                    >
                        Danh sách đơn hàng
                    </Link>
                    <div>{idOrder}</div>
                </Breadcrumbs>
                <Link to={config.Routes.listBill}>
                    <Button variant="fill">
                        <span className="normal-case">Quay lại</span>
                    </Button>
                </Link>
            </div>
            <form className="space-y-4 bg-white rounded-lg p-5">
                <div className="font-semibold text-lg">Thông tin đơn hàng</div>
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Controller
                            name="address.fullName"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Tên người nhận"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="address.phoneNumber"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Số điện thoại"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="total"
                            control={control}
                            defaultValue={0}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Tổng tiền (VNĐ)"
                                    InputProps={{
                                        readOnly: true,
                                        className: '!text-red-500',
                                    }}
                                    error
                                />
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Controller
                            name="address.orderDetails"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    value={getAddressValue()}
                                    label="Địa chỉ nhận hàng"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="status"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Trạng thái đơn hàng"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Controller
                            name="paymentType"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Hình thức thanh toán"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="isPaidBefore"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Thanh toán hóa đơn"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="createdDate"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Ngày tạo đơn"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="lastModifiedDate"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Ngày cập nhật cuối"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        />
                    </div>
                    <Controller
                        name="note"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Ghi chú"
                                multiline
                                rows={6}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        )}
                    />
                </div>
            </form>

            <div className="bg-white rounded-lg p-5 space-y-4">
                <div className="font-semibold text-lg">Danh sách sản phẩm</div>
                {products.map((item: IProductCart) => (
                    <React.Fragment key={item.id}>
                        <div className="h-0.5 bg-gray-200"></div>
                        <div className="size-full flex gap-5 bg-white rounded overflow-hidden p-2 dark:bg-dark-600">
                            <>
                                <Image
                                    src={item.imageUrl}
                                    alt={'image' + item.product.name}
                                    className="object-cover object-center size-28 cursor-pointer"
                                />
                                <div className="text-sm flex flex-col justify-between ">
                                    <div className="line-clamp-1 font-semibold mb-3">{item.product.name}</div>
                                    <div className="flex justify-between items-center flex-wrap gap-1">
                                        <aside>
                                            <div className="flex gap-1">
                                                <span className="font-bold w-18">Phân loại:</span>
                                                <span className="font-medium">
                                                    {item.sku?.optionValues?.map((option, index) => (
                                                        <React.Fragment key={index}>
                                                            {option.valueName}
                                                            {index < item.sku.optionValues.length - 1 ? ' - ' : ''}
                                                        </React.Fragment>
                                                    ))}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <span className="font-bold w-18">Đơn giá: </span>
                                                <span className="not-italic font-medium text-red-500 flex gap-1">
                                                    {convertNumberToVND(item.price)}
                                                    <span className="text-xs"> đ</span>
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <span className="font-bold w-18">Số lượng: </span>
                                                {convertNumberToVND(item.quantity)}
                                            </div>
                                            <div className="flex gap-1">
                                                <span className="font-bold w-18">Tổng giá:</span>
                                                <div className="not-italic font-medium text-red-500 flex gap-1">
                                                    {convertNumberToVND(item.subTotal)}
                                                    <span className="text-xs">đ</span>
                                                </div>
                                            </div>
                                        </aside>
                                    </div>
                                </div>
                            </>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default DetailOrder;
