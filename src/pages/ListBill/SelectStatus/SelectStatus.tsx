import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { toast } from 'react-toastify';

import config from '../../../config';
import { updateOrderStatusByID } from '../../../apis/orderApi';

interface Iprops {
    status: string;
    idOrder: number;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case config.StatusOrder.ORDERED:
            return { bgcolor: '#96EFFF', color: '#7B66FF', maxHeight: '32px', borderRadius: '7px', };
        case config.StatusOrder.PROCESSING:
            return { bgcolor: '#bfc8d1', color: 'black', maxHeight: '32px', borderRadius: '7px', }; 
        case config.StatusOrder.DELIVERED:
            return { bgcolor: '#C5E898', color: '#748E63', maxHeight: '32px', borderRadius: '7px',  };
        case config.StatusOrder.CANCELED:
            return { bgcolor: '#FF8F8F', color: '#994D1C', maxHeight: '32px', borderRadius: '7px', }; 
        case config.StatusOrder.WAITFORPAY:
            return { bgcolor: '#F2F1EB', color: '#186F65', maxHeight: '32px', borderRadius: '7px',  };
        case config.StatusOrder.SHIPPED:
            return { bgcolor: '#F2F1EB', color: '#607274', maxHeight: '32px', borderRadius: '7px',  };
        default:
            return { bgcolor: '#ffffff', color: 'black', maxHeight: '32px', borderRadius: '7px',  }; 
    }
};


const SelectStatus = (props: Iprops) => {
    const { status, idOrder, setIsLoading } = props;

    const handleChangeStatus = async (e: SelectChangeEvent) => {
        const userConfirmed = window.confirm(`Bạn có chắc chắn muốn đổi sang trạng thái sang ${e.target.value} không?`);
        if (userConfirmed) {
            try {
                const response = await updateOrderStatusByID(idOrder, e.target.value);
                if (response.status === 200) {
                    setIsLoading((prev) => !prev);
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
        <FormControl className='w-70'>
            <Select 
                sx={{
                    ...getStatusStyles(status),
                    '& .MuiSelect-select': {
                        border: 'none', // Loại bỏ viền của Select
                        padding: '10px', // Thêm padding cho nút Select
                    },
                    '& .MuiSelect-outlined': {
                        border: 'none', // Loại bỏ viền của Select ở dạng outlined
                    },
                }} 
                variant="standard" 
                value={status} 
                onChange={handleChangeStatus}
            >
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
