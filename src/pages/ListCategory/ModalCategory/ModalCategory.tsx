import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

import { IUpdateCategory } from '../../../interface/category';
import InputText from '../../../components/InputText/InputText';
import { createNewCategory } from '../../../apis/categoryApii';

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
    // get info address

    // form
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IUpdateCategory>();
    const onSubmit: SubmitHandler<IUpdateCategory> = async (data) => {
        const objectUpdate: IUpdateCategory = {
            name: data.name,
            description: data.description,
            parentId: data.parentId || null,
        };
        const response = await createNewCategory(objectUpdate);
        if (response.status === 201) {
            toast.success('Thêm thành công');
            setValue('description', '');
            setValue('name', '');
            setValue('parentId', null);
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
                            isRequired
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
                        <InputText
                            labelInput="Mã sản phẩm cha"
                            errorInput={errors.parentId ? true : false}
                            errorFormMessage={errors.parentId?.message}
                            register={{
                                ...register('parentId'),
                            }}
                        />

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
