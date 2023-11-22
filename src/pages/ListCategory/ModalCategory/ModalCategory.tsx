import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

import ICategory, { IUpdateCategory } from '../../../interface/category';
import InputText from '../../../components/InputText/InputText';
import { createNewCategory, getAllCategory } from '../../../apis/categoryApii';
import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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

interface IPropsAddress {
    open: boolean;
    handleClose: () => void;
}

const ModalCategory = (propsCh: IPropsAddress) => {
    const { open, handleClose } = propsCh;
    const [listCate, setListCate] = useState<Array<ICategory>>([]);
    const handleGetListCate = async () => {
        const res = await getAllCategory();
        if (res.status === 200) {
            setListCate(res.data.content);
        }
    };
    useEffect(() => {
        handleGetListCate();
    }, []);

    // form
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IUpdateCategory>({});
    const onSubmit: SubmitHandler<IUpdateCategory> = async (data) => {
        console.log(data);

        const objectUpdate: IUpdateCategory = {
            name: data.name,
            description: data.description,
            parentName: data.parentName || null,
        };
        const response = await createNewCategory(objectUpdate);
        if (response.status === 201) {
            toast.success('Thêm thành công');
            setValue('description', '');
            setValue('name', '');
            setValue('parentName', '');
        } else {
            toast.error(response.data.message || response.data);
        }

        handleClose();
    };
    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <div className="text-lg mb-4">Thêm loại sản phẩm mới</div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <InputText
                            labelInput="Tên loại"
                            errorInput={errors.name ? true : false}
                            errorFormMessage={errors.name?.message}
                            register={{
                                ...register('name', {
                                    required: 'name is required',
                                }),
                            }}
                        />

                        <InputText
                            labelInput="Mô tả"
                            errorInput={errors.description ? true : false}
                            isRequired
                            errorFormMessage={errors.description?.message}
                            register={{
                                ...register('description', {
                                    required: 'description is required',
                                }),
                            }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Tên loại cha</InputLabel>
                            <Select label="parentName" {...register('parentName')} defaultValue={''}>
                                <MenuItem value={''}>None</MenuItem>
                                {listCate.map((item, index) => (
                                    <MenuItem key={index} value={item.name}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <div className="float-right">
                            <Button sx={{ width: 140 }} onClick={handleClose}>
                                Trở lại
                            </Button>
                            <Button sx={{ width: 140 }} variant="contained" type="submit">
                                Thêm
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalCategory;
