// libs
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableContainer } from '@mui/material';
import { ChangeEvent } from 'react';
// types
import { ISkuCreate } from '@/types/productCart';
// components
import PopConfirm from '@/components/PopConfirm';
import Button from '@/components/Button';
// others
import { convertNumberToVND } from '@/utils/convertData';

const TableSKU = ({
    Sku,
    setSku,
    valuePercentDiscount,
}: {
    Sku: ISkuCreate[];
    setSku: React.Dispatch<React.SetStateAction<ISkuCreate[]>>;
    valuePercentDiscount: number;
}) => {
    const handleChangePrice = (id: number, e: ChangeEvent<HTMLInputElement>) => {
        let value: string = e.target.value;

        if (e.target.value === '') {
            value = '0';
        }

        if (Number.isNaN(+value)) {
            return;
        }

        setSku((prev) => {
            const newArray = prev.map((item, index) => {
                if (index === id) {
                    return {
                        ...item,
                        price: parseInt(value) - (parseInt(value) * valuePercentDiscount) / 100,
                        originalPrice: parseInt(value),
                    };
                }
                return item;
            });
            return newArray;
        });
    };

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

    const handleDeleteItemSKU = (item: ISkuCreate) => {
        setSku((prev) => {
            const newArray = [...prev];

            const updateArray = newArray.filter((itemSKU) => itemSKU !== item);

            return updateArray;
        });
    };

    return (
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
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Sku.map((item, index) => (
                            <TableRow key={index} className="hover:!bg-black/5">
                                <TableCell align="center">{index + 1}</TableCell>
                                {item.optionValues.map((item2, index2) => (
                                    <TableCell key={index2} align="center">
                                        {item2.valueName}
                                    </TableCell>
                                ))}
                                <TableCell align="center">
                                    <input
                                        className="w-32 h-8 p-2 !rounded-lg border-2 focus:border-primary-100"
                                        value={item.originalPrice}
                                        onChange={(e) => handleChangePrice(index, e)}
                                    />
                                </TableCell>
                                <TableCell align="center">{convertNumberToVND(item.price)} đ</TableCell>
                                <TableCell align="center">
                                    <input
                                        className="w-32 h-8 p-2 rounded-lg border-2 focus:border-primary-100"
                                        value={item.quantity}
                                        onChange={(e) => handleChangeQuantity(index, e)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <PopConfirm
                                        title="Xác nhận xóa biến thể?"
                                        content=""
                                        onConfirm={() => handleDeleteItemSKU(item)}
                                    >
                                        <Button className="text-sm font-semibold rounded-3xl text-[#ff3131] hover:bg-black/10">
                                            Xóa
                                        </Button>
                                    </PopConfirm>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TableSKU;
