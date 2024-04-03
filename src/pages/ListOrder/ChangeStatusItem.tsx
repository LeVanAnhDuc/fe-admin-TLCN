import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { toast } from 'react-toastify';

import config from '../../config';
import { updateOrderStatusByID } from '../../apis/orderApi';

interface Iprops {
    status: string;
    idOrder: number;
    getAllOrder: () => Promise<void>;
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case config.StatusOrder.ORDERED:
            return 'bg-blue-300';
        case config.StatusOrder.PROCESSING:
            return 'bg-gray-300';
        case config.StatusOrder.DELIVERED:
            return 'bg-green-300';
        case config.StatusOrder.CANCELED:
            return 'bg-red-300';
        case config.StatusOrder.WAITFORPAY:
            return 'bg-yellow-300';
        case config.StatusOrder.SHIPPED:
            return 'bg-white';
        default:
            return 'bg-black';
    }
};

const SelectStatus = (props: Iprops) => {
    const { status, idOrder, getAllOrder } = props;

    const handleChangeStatus = async (e: SelectChangeEvent) => {
        const userConfirmed = window.confirm(`Bạn có chắc chắn muốn đổi sang trạng thái sang ${e.target.value} không?`);
        if (userConfirmed) {
            try {
                const response = await updateOrderStatusByID(idOrder, e.target.value);
                if (response.status === 200) {
                    getAllOrder();
                    toast.success(`Cập nhật đơn hàng ${response.data.id} : ${response.data.status}`);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        }
    };

    return (
        <FormControl>
            <Select
                className={`${getStatusStyles(status)} !min-w-40 !h-9 text-center`}
                value={status}
                onChange={handleChangeStatus}
            >
                <MenuItem value={config.StatusOrder.ORDERED} disabled>
                    {config.StatusOrder.ORDERED}
                </MenuItem>
                <MenuItem
                    value={config.StatusOrder.PROCESSING}
                    disabled={
                        status === config.StatusOrder.DELIVERED ||
                        status === config.StatusOrder.CANCELED ||
                        status === config.StatusOrder.WAITFORPAY
                            ? true
                            : false
                    }
                >
                    {config.StatusOrder.PROCESSING}
                </MenuItem>
                <MenuItem
                    value={config.StatusOrder.SHIPPED}
                    disabled={status === config.StatusOrder.WAITFORPAY ? true : false}
                >
                    {config.StatusOrder.SHIPPED}
                </MenuItem>
                <MenuItem
                    value={config.StatusOrder.DELIVERED}
                    disabled={
                        status === config.StatusOrder.SHIPPED || status === config.StatusOrder.CANCELED ? false : true
                    }
                >
                    {config.StatusOrder.DELIVERED}
                </MenuItem>
                <MenuItem
                    value={config.StatusOrder.CANCELED}
                    disabled={
                        status === config.StatusOrder.SHIPPED || status === config.StatusOrder.DELIVERED ? false : true
                    }
                >
                    {config.StatusOrder.CANCELED}
                </MenuItem>
                <MenuItem value={config.StatusOrder.WAITFORPAY} disabled>
                    {config.StatusOrder.WAITFORPAY}
                </MenuItem>
            </Select>
        </FormControl>
    );
};

export default SelectStatus;
