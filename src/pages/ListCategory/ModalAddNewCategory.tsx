import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import ICategory, { IUpdateCategory } from '../../interface/category';
import { createNewCategory, getAllCategory } from '../../apis/categoryApi';
import Button from '../../components/Button';

interface IPropsAddress {
    open: boolean;
    handleClose: () => void;
    setCallAPICategories: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddNewCategory = (props: IPropsAddress) => {
    const { open, handleClose, setCallAPICategories } = props;

    const [categories, setCategories] = useState<Array<ICategory>>([]);

    const schema = yup.object().shape({
        name: yup.string().required('Tên danh mục đang trống'),
        description: yup.string().required('Mô tả danh mục đang trống'),
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IUpdateCategory>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<IUpdateCategory> = async (data) => {
        const objectUpdate: IUpdateCategory = {
            name: data.name,
            description: data.description,
            parentName: data.parentName || null,
        };
        try {
            const response = await createNewCategory(objectUpdate);
            if (response.status === 201) {
                toast.success('Thêm thành công');
                setValue('description', '');
                setValue('name', '');
                setValue('parentName', '');
                setCallAPICategories((prev) => !prev);
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
        const handleGetListCate = async () => {
            const res = await getAllCategory();
            if (res.status === 200) {
                setCategories(res.data.content);
            }
        };

        handleGetListCate();
    }, []);

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 bg-gray-100 border border-black rounded-lg shadow-lg p-6 space-y-3">
                <div className="text-lg font-semibold flex items-center">Thêm Danh mục mới</div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 bg-white p-4 rounded-lg shadow">
                    <div>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    error={errors.name ? true : false}
                                    fullWidth
                                    label="Tên danh mục"
                                />
                            )}
                        />
                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.name?.message}</p>
                    </div>

                    <div>
                        <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    error={errors.description ? true : false}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Mô tả"
                                />
                            )}
                        />
                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.description?.message}</p>
                    </div>

                    <Controller
                        name="parentName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Thuộc danh mục</InputLabel>
                                <Select {...field} fullWidth label="Thuộc danh mục">
                                    <MenuItem value={''}>Không thuộc danh mục nào</MenuItem>
                                    {categories.map((item, index) => (
                                        <MenuItem key={index} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button className="min-w-40" onClick={handleClose}>
                            Trở lại
                        </Button>
                        <Button className="min-w-40" variant="fill" type="submit">
                            Thêm
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ModalAddNewCategory;
