// libs
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableContainer } from '@mui/material';
import { ChangeEvent, useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
// types
import { ISku } from '@/types/productCart';
import IProduct from '@/types/product';
// components
import Button from '@/components/Button';
// apis
import { updateQuantityProduct } from '@/apis/productApi';
// others
import { convertNumberToVND } from '@/utils/convertData';

const ModalQuantity = ({
    open,
    handleClose,
    product,
    setBehaviorGetProducts,
}: {
    open: boolean;
    handleClose: () => void;
    product?: IProduct;
    setBehaviorGetProducts: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [sku, setSku] = useState<ISku[]>([]);

    const handleChangeQuantity = (id: number, e: ChangeEvent<HTMLInputElement>) => {
        let value: string = e.target.value;

        if (e.target.value === '') {
            value = '0';
        }

        if (Number.isNaN(+value)) {
            return;
        }

        setSku((prev) => {
            const newArray = [...prev];

            const updateArray = newArray.map((item, index) => {
                if (index === id) {
                    return {
                        ...item,
                        quantity: parseInt(value),
                    };
                }
                return item;
            });

            return updateArray;
        });
    };

    const handleAddQuantityProduct = async () => {
        if (product) {
            try {
                const response = await updateQuantityProduct(
                    product.id,
                    sku.filter((item) => item.quantity !== 0),
                );

                if (response.status === 200) {
                    toast.success('Cập nhật thành công');
                    setBehaviorGetProducts((prev) => !prev);
                    setSku((prev) => prev.map((item) => ({ ...item, quantity: 0 })));
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                toast.error(`${error}`);
            } finally {
                handleClose();
            }
        }
    };

    useEffect(() => {
        product &&
            setSku(
                product?.skus.map((item) => ({
                    ...item,
                    quantity: 0,
                })),
            );
    }, [product]);

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-h-[90%] overflow-y-auto bg-gray-100 border border-black rounded-lg shadow-lg p-8 space-y-3">
                    <div className="font-semibold text-lg truncate pb-3">{product?.name}</div>
                    <div className="bg-white rounded-lg p-4 space-y-5">
                        <div className="bg-white p-4 rounded-lg">
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">STT</TableCell>
                                            <TableCell align="center">Kích thước</TableCell>
                                            <TableCell align="center">Màu</TableCell>
                                            <TableCell align="center">Giá gốc</TableCell>
                                            <TableCell align="center">Giá hiện thị</TableCell>
                                            <TableCell align="center">Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sku.map((item, index) => (
                                            <TableRow key={index} className="hover:!bg-black/5">
                                                <TableCell align="center">{index + 1}</TableCell>
                                                {item.optionValues.map((item2, index2) => (
                                                    <TableCell key={index2} align="center">
                                                        {item2.valueName}
                                                    </TableCell>
                                                ))}
                                                <TableCell align="center">
                                                    {convertNumberToVND(item.originalPrice)}
                                                </TableCell>
                                                <TableCell align="center">{convertNumberToVND(item.price)} đ</TableCell>
                                                <TableCell align="center">
                                                    <input
                                                        className="w-32 h-8 p-2 rounded-lg border-2 focus:border-primary-100"
                                                        value={item.quantity}
                                                        onChange={(e) => handleChangeQuantity(index, e)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button className="w-40" onClick={handleClose} variant="outline">
                                Hủy
                            </Button>
                            <Button className="w-40" onClick={handleAddQuantityProduct} variant="fill">
                                Thêm
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModalQuantity;
