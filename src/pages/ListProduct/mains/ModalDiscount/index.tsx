// libs
import { TextField, Modal } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
// types
import IProduct from '@/types/product';
// components
import Button from '@/components/Button';
// apis
import { updateDiscountProduct } from '@/apis/productApi';

interface IProductCustom extends Pick<IProduct, 'percentDiscount'> {}

const schema = yup.object().shape({
    percentDiscount: yup
        .number()
        .required('Giá giảm đang thiếu')
        .min(0, 'Phần trăm không âm')
        .max(100, 'Phần trăm nhỏ hơn 100%'),
});

const ModalDiscount = ({
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
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
    } = useForm<IProductCustom>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<IProductCustom> = async (data) => {
        if (!product) return;

        try {
            const response = await updateDiscountProduct(product.id, data.percentDiscount);

            if (response.status === 200) {
                toast.success('Cập nhật thành công');
                setBehaviorGetProducts((prev) => !prev);
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
        product && setValue('percentDiscount', product.percentDiscount);
    }, [product]);

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-h-[90%] overflow-y-auto bg-gray-100 border border-black rounded-lg shadow-lg p-8 space-y-3">
                    <div className="font-semibold text-lg truncate pb-3">{product?.name}</div>
                    <div className="bg-white rounded-lg p-4 space-y-5">
                        <div className="bg-white p-4 rounded-lg">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    name="percentDiscount"
                                    control={control}
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.percentDiscount ? true : false}
                                            fullWidth
                                            label="Phần trăm giảm"
                                            type="number"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.percentDiscount?.message}
                                </p>

                                <div className="flex justify-end gap-4">
                                    <Button className="w-40" onClick={handleClose} variant="outline">
                                        Hủy
                                    </Button>
                                    <Button className="w-40" type="submit" variant="fill">
                                        Thêm
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModalDiscount;
