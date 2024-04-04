import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

import { ChangeEvent, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { updateQuantityProduct } from '../../apis/productApi';
import Button from '../../components/Button';

interface IProps {
    open: boolean;
    handleClose: () => void;
    IDProduct: number;
    getAllProducts: () => Promise<void>;
}

export default function ModalQuantity(props: IProps) {
    const { open, handleClose, IDProduct, getAllProducts } = props;

    const [quantityAddProduct, setQuantityAddProduct] = useState<number>(0);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setQuantityAddProduct(+e.target.value);
        },
        [quantityAddProduct],
    );

    const handleAddQuantityProduct = async () => {
        if (quantityAddProduct <= 0) {
            toast.info('Số lượng không hợp lệ');
            return;
        }

        try {
            const response = await updateQuantityProduct(IDProduct, quantityAddProduct);

            if (response.status === 200) {
                toast.success('Cập nhật thành công');
                getAllProducts();
                setQuantityAddProduct(0);
            } else {
                toast.success(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            handleClose();
        }
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 bg-gray-100 border border-black rounded-lg shadow-lg p-6 space-y-3">
                    <div className="font-semibold text-lg">Sản phẩm: {IDProduct}</div>
                    <div className="bg-white rounded-lg p-4 space-y-5">
                        <TextField
                            type="number"
                            fullWidth
                            label="Số lượng thêm"
                            value={quantityAddProduct}
                            onChange={handleChange}
                        />
                        <div className="flex justify-end gap-4">
                            <Button className="w-32" onClick={handleClose}>
                                Hủy
                            </Button>
                            <Button className="w-32" onClick={handleAddQuantityProduct} variant="fill">
                                Thêm
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
