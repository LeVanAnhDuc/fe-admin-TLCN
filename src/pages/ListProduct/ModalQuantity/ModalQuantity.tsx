import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { ChangeEvent, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { updateQuantityProduct } from '../../../apis/productApi';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'white',
    border: '1px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
};

interface IProps {
    open: boolean;
    handleClose: () => void;
    IDProduct: number;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalQuantity(props: IProps) {
    const { open, handleClose, IDProduct, setLoading } = props;
    const [value, setValue] = useState<number>(0);
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setValue(+e.target.value);
        },
        [value],
    );

    const handleAddQuantityProduct = async () => {
        if (+value < 0) {
            toast.error('Không được âm');
            return;
        }
        const response = await updateQuantityProduct(IDProduct, value);
        if (response.status === 200) {
            toast.success('Cập nhật thành công');
            setLoading((prev) => !prev);
            setValue(0);
            handleClose();
        } else {
            toast.success(response.data.message || response.data);
        }
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <div className="py-5 font-semibold">Sản phẩm: {IDProduct}</div>
                    <TextField
                        type="number"
                        fullWidth
                        label="Số lượng thêm"
                        variant="outlined"
                        value={value}
                        onChange={handleChange}
                    />
                    <div className="flex justify-end pt-5 gap-4">
                        <Button onClick={handleClose} sx={{ width: 150 }}>
                            Hủy
                        </Button>
                        <Button onClick={handleAddQuantityProduct} variant="contained" sx={{ width: 150 }}>
                            Thêm
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
