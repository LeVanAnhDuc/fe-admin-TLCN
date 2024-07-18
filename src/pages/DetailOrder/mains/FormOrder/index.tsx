// libs
import TextField from '@mui/material/TextField';
// types
import IOrder from '@/types/order';

const FormOrder = ({ order }: { order?: IOrder }) => {
    const getAddressValue = (): string => {
        return `${order?.address.orderDetails}, ${order?.address.ward}, ${order?.address.district}, ${order?.address.province}`;
    };

    return (
        <form className="space-y-4 bg-white rounded-lg p-5">
            <div className="font-semibold text-lg">Thông tin đơn hàng</div>
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <TextField
                        value={order?.address.fullName}
                        fullWidth
                        variant="filled"
                        label="Tên người nhận"
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        value={order?.address.phoneNumber}
                        fullWidth
                        variant="filled"
                        label="Số điện thoại"
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        value={order?.total}
                        fullWidth
                        variant="filled"
                        label="Tổng tiền (VNĐ)"
                        InputProps={{
                            readOnly: true,
                            className: '!text-red-500',
                        }}
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <TextField
                        fullWidth
                        variant="filled"
                        value={getAddressValue()}
                        label="Địa chỉ nhận hàng"
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        value={order?.status}
                        fullWidth
                        variant="filled"
                        label="Trạng thái đơn hàng"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TextField
                        value={order?.paymentType}
                        fullWidth
                        variant="filled"
                        label="Hình thức thanh toán"
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        value={order?.isPaidBefore}
                        fullWidth
                        variant="filled"
                        label="Thanh toán hóa đơn"
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        value={order?.createdDate}
                        fullWidth
                        variant="filled"
                        label="Ngày tạo đơn"
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        value={order?.lastModifiedDate}
                        fullWidth
                        variant="filled"
                        label="Ngày cập nhật cuối"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </div>

                <TextField
                    value={order?.note}
                    fullWidth
                    variant="filled"
                    label="Ghi chú"
                    multiline
                    rows={6}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </div>
        </form>
    );
};

export default FormOrder;
