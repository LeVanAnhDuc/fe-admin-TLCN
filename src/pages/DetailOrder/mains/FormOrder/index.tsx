// libs
import { Control, Controller, UseFormGetValues } from 'react-hook-form';
import TextField from '@mui/material/TextField';
// types
import IOrder from '@/types/order';

const FormOrder = ({
    getValues,
    control,
}: {
    getValues: UseFormGetValues<IOrder>;
    control: Control<IOrder, unknown>;
}) => {
    const getAddressValue = () => {
        return `${getValues('address.orderDetails')}, ${getValues('address.ward')}, ${getValues(
            'address.district',
        )}, ${getValues('address.city')}`;
    };

    return (
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
                                variant="filled"
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
                                variant="filled"
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
                                variant="filled"
                                label="Tổng tiền (VNĐ)"
                                InputProps={{
                                    readOnly: true,
                                    className: '!text-red-500',
                                }}
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
                                variant="filled"
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
                                variant="filled"
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
                                variant="filled"
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
                                variant="filled"
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
                                variant="filled"
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
                                variant="filled"
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
                            variant="filled"
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
    );
};

export default FormOrder;
