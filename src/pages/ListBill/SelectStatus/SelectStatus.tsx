import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useState } from 'react';
import { toast } from 'react-toastify';

import config from '../../../config';
import { updateOrderStatusByID } from '../../../apis/orderApi';

interface Iprops {
    status: string;
    idOrder: number;
}

const SelectStatus = (props: Iprops) => {
    const { status, idOrder } = props;

    const [valueStatus, SetValueStatus] = useState<string>(status);

    const handleChangeStatus = async (e: SelectChangeEvent) => {
        const response = await updateOrderStatusByID(idOrder, e.target.value);
        if (response.status === 200) {
            SetValueStatus(e.target.value);
            toast.success(`Cập nhật hóa đơn ${response.data.id} : ${response.data.status}`);
        }
    };

    return (
        <FormControl fullWidth>
            <Select value={valueStatus} onChange={handleChangeStatus}>
                <MenuItem value={config.StatusOrder.ORDERED} disabled>
                    {config.StatusOrder.ORDERED}
                </MenuItem>
                <MenuItem
                    value={config.StatusOrder.PROCESSING}
                    //  chỉ mở khi là đã đặt hàng hoặc đang giao
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
                    // khóa khi đang chờ thanh toán
                    disabled={status === config.StatusOrder.WAITFORPAY ? true : false}
                >
                    {config.StatusOrder.SHIPPED}
                </MenuItem>
                <MenuItem
                    value={config.StatusOrder.DELIVERED}
                    // dang giao hoặc đã giao thì không khóa
                    disabled={
                        status === config.StatusOrder.SHIPPED || status === config.StatusOrder.CANCELED ? false : true
                    }
                >
                    {config.StatusOrder.DELIVERED}
                </MenuItem>
                <MenuItem
                    value={config.StatusOrder.CANCELED}
                    // dang giao hoặc đã giao thì không khóa
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
