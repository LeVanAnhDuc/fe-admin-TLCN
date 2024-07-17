// libs
import { useCallback, useEffect, useState } from 'react';
import { Popover } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// types
import IProduct from '@/types/product';
// components
import PopConfirm from '@/components/PopConfirm';
import Button from '@/components/Button';
import ModalQuantity from '../ModalQuantity';
// apis
import { toggleIsActiveProduct, toggleIsSellingProduct } from '@/apis/productApi';
// others
import config from '@/config';

const ActionProduct = ({ product }: { product?: IProduct }) => {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [openModalQuantity, setOpenModalQuantity] = useState<boolean>(false);
    const [textSellingProduct, setTextSellingProduct] = useState<string>('');

    const handleCloseModal = useCallback(() => {
        setOpenModalQuantity(false);
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleAddQuantityProduct = () => setOpenModalQuantity(true);

    const handleDeleteProduct = async () => {
        if (!product) return;
        try {
            const response = await toggleIsActiveProduct(product.id);
            if (response.status === 200) {
                toast.success('Xóa thành công');
                navigate(config.Routes.listProduct);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            handleClose();
        }
    };

    const handleToggleSellProduct = async () => {
        if (!product) return;

        try {
            const response = await toggleIsSellingProduct(product.id);
            if (response.status === 200) {
                if (response.data.isSelling) {
                    setTextSellingProduct('Dừng đăng bán');
                    toast.success('Mở bán thành công');
                } else {
                    setTextSellingProduct('Đăng bán ngay');
                    toast.success('Ẩn bán thành công');
                }
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            handleClose();
        }
    };

    useEffect(() => {
        setTextSellingProduct(product?.isSelling ? 'Dừng đăng bán' : 'Đăng bán ngay');
    }, [product]);

    return (
        <>
            <ModalQuantity open={openModalQuantity} handleClose={handleCloseModal} product={product} />

            <Button onClick={handleClick} size="small" variant="fill" endIcon={<ExpandMore />}>
                Thao tác
            </Button>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className="bg-gray-white py-2 px-1 space-y-1">
                    <Button size="small" variant="text" onClick={handleAddQuantityProduct}>
                        Nhập thêm hàng
                    </Button>
                    <Button size="small" variant="text" onClick={handleToggleSellProduct}>
                        {textSellingProduct}
                    </Button>
                    <PopConfirm title="Xác nhận xóa sản phẩm?" content="" onConfirm={handleDeleteProduct}>
                        <Button size="small" variant="text">
                            Xóa sản phẩm
                        </Button>
                    </PopConfirm>
                </div>
            </Popover>
        </>
    );
};

export default ActionProduct;
