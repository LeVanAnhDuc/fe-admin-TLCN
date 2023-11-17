import { useForm, SubmitHandler } from 'react-hook-form';

import InputText from '../../components/InputText/InputText';
import Image from '../../components/Image';
import config from '../../config';

import React, { ChangeEvent, useCallback, useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';
import { Link } from 'react-router-dom';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

enum AlertColor {
    Error = 'error',
    Success = 'success',
    Info = 'info',
    Warning = 'warning',
}
interface IToast {
    message: string;
    alert: AlertColor;
}
interface IInfoProduct {
    id: string;
    categoryID: string;
    name: string;
    description: string;
    quantity: number;
    quantityAvaiable: number;
    sold: number;
    price: number;
    image: Array<string>;
    createBy: string;
    lastModifiedBy: string;
    createDate: string;
    lastModifiedDate: string;
}

const product: IInfoProduct = {
    id: 'string',
    categoryID: 'string',
    name: 'string',
    description: 'string',
    quantity: 4,
    quantityAvaiable: 4,
    sold: 4,
    price: 4,
    image: [],
    createBy: 'string',
    lastModifiedBy: 'string',
    createDate: 'string',
    lastModifiedDate: 'string',
};
const DetailProduct = () => {
    const {
        register: registerForm1,
        handleSubmit: handleSubmitForm1,
        formState: formStateForm1,
        setValue,
    } = useForm<IInfoProduct>({
        defaultValues: product,
    });
    // submit form
    const [textToast, setTextToast] = useState<IToast>({ message: 'Lỗi kìa', alert: AlertColor.Error });
    const onSubmit1: SubmitHandler<IInfoProduct> = (data) => {
        console.log(data);
        handleToggleToast();
        setTextToast((prev) => ({
            ...prev,
            alert: AlertColor.Success,
            message: 'Cập nhật thông tin thành công',
        }));
        //  call api doi update thong tin
        //
        //
    };
    // handle show toast
    const [showToast, setShowToast] = useState(false);
    const handleToggleToast = useCallback(() => {
        setShowToast((prev) => !prev);
    }, []);

    // handle change image
    const [selectedImage, setSelectedImage] = useState<string[]>([]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const images = Array.from(files).map((file) => URL.createObjectURL(file));
            setSelectedImage(images);
            setValue('image', images);
        }
        handleToggleToast();
        setTextToast((prev) => ({
            ...prev,
            alert: AlertColor.Success,
            message: 'Cập nhật ảnh thành công',
        }));
        // call api update anh
        //
        //
        //
    };

    // handle biến thể
    const [bienThe, setBienTher] = useState([{ title: '', value: [] }]);
    return (
        <>
            {/* toast */}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={showToast}
                onClose={handleToggleToast}
            >
                <Alert severity={textToast.alert}>
                    <AlertTitle className="uppercase w-52 md:w-80">{textToast.alert}</AlertTitle>
                    {textToast.message}
                </Alert>
            </Snackbar>
            {/* end toast */}
            <div className="flex justify-between pb-3">
                <div className="text-lg font-semibold flex items-center ">Thông tin loại hàng</div>
                <Link to={config.Routes.listProduct}>
                    <Button variant="outlined">
                        <KeyboardArrowLeft />
                    </Button>
                </Link>
            </div>
            {/* start section 1 */}
            <div className="my-10 ">
                {/* start product setting */}
                <form className="space-y-6" onSubmit={handleSubmitForm1(onSubmit1)}>
                    <div className="mb-5 font-semibold text-xl">Mã sản phẩm : {product.id}</div>
                    {/* start input id and Name */}
                    <div className="grid grid-cols-2 gap-5">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label" required>
                                CategoryID
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="CategoryID"
                                {...registerForm1('categoryID', {
                                    required: 'categoryID is required',
                                })}
                                required
                                defaultValue={''}
                            >
                                <MenuItem value={10}>Ten (10)</MenuItem>
                                <MenuItem value={20}>Twenty (20)</MenuItem>
                                <MenuItem value={30}>Thirty (30)</MenuItem>
                            </Select>
                        </FormControl>
                        <InputText
                            labelInput="Name"
                            errorInput={formStateForm1.errors.name ? true : false}
                            isRequired
                            errorFormMessage={formStateForm1.errors.name?.message}
                            register={{
                                ...registerForm1('name', {
                                    required: 'Name is required',
                                }),
                            }}
                        />
                    </div>
                    {/* end input id and  Name*/}
                    {/* start input quantity and quantityAvaiable */}
                    <div className="grid grid-cols-2 gap-5">
                        <InputText
                            labelInput="Quantity"
                            typeInput="number"
                            errorInput={formStateForm1.errors.quantity ? true : false}
                            isRequired
                            errorFormMessage={formStateForm1.errors.quantity?.message}
                            register={{
                                ...registerForm1('quantity', {
                                    required: 'quantity is required',
                                }),
                            }}
                        />
                        <InputText
                            labelInput="QuantityAvaiable"
                            typeInput="number"
                            errorInput={formStateForm1.errors.quantityAvaiable ? true : false}
                            isRequired
                            errorFormMessage={formStateForm1.errors.quantityAvaiable?.message}
                            register={{
                                ...registerForm1('quantityAvaiable', {
                                    required: 'quantityAvaiable is required',
                                }),
                            }}
                        />
                    </div>
                    {/* end input quantity and quantityAvaiable*/}
                    {/* start input sold and price */}
                    <div className="grid grid-cols-2 gap-5">
                        <InputText
                            labelInput="Sold"
                            typeInput="number"
                            errorInput={formStateForm1.errors.sold ? true : false}
                            isRequired
                            errorFormMessage={formStateForm1.errors.sold?.message}
                            register={{
                                ...registerForm1('sold', {
                                    required: 'sold is required',
                                }),
                            }}
                        />
                        <InputText
                            labelInput="Price"
                            typeInput="number"
                            errorInput={formStateForm1.errors.price ? true : false}
                            isRequired
                            errorFormMessage={formStateForm1.errors.price?.message}
                            register={{
                                ...registerForm1('price', {
                                    required: 'price is required',
                                }),
                            }}
                        />
                    </div>
                    {/* end input sold and price*/}
                    {/* start input  createBy and createDate  */}
                    <div className="grid grid-cols-2 gap-5">
                        <InputText
                            labelInput="CreateBy"
                            errorInput={formStateForm1.errors.createBy ? true : false}
                            isRequired
                            errorFormMessage={formStateForm1.errors.createBy?.message}
                            register={{
                                ...registerForm1('createBy', {
                                    required: 'createBy is required',
                                }),
                            }}
                        />
                        <InputText
                            labelInput="CreateDate"
                            errorInput={formStateForm1.errors.createDate ? true : false}
                            isRequired
                            errorFormMessage={formStateForm1.errors.createDate?.message}
                            register={{
                                ...registerForm1('createDate', {
                                    required: 'CreateDate is required',
                                }),
                            }}
                        />
                    </div>

                    {/* end input createBy and createDate */}
                    {/* start input  lastModifiedBy and lastModifiedDate  */}
                    <div className="grid grid-cols-2 gap-5">
                        <InputText
                            labelInput="LastModifiedBy"
                            errorInput={formStateForm1.errors.lastModifiedBy ? true : false}
                            isRequired
                            errorFormMessage={formStateForm1.errors.lastModifiedBy?.message}
                            register={{
                                ...registerForm1('lastModifiedBy', {
                                    required: 'lastModifiedBy is required',
                                }),
                            }}
                        />
                        <InputText
                            labelInput="LastModifiedDate"
                            errorInput={formStateForm1.errors.lastModifiedDate ? true : false}
                            isRequired
                            errorFormMessage={formStateForm1.errors.lastModifiedDate?.message}
                            register={{
                                ...registerForm1('lastModifiedDate', {
                                    required: 'lastModifiedDate is required',
                                }),
                            }}
                        />
                    </div>
                    {/* end input lastModifiedBy and lastModifiedDate */}
                    <div className="mb-5 font-semibold text-xl">Danh sách ảnh</div>
                    {/* start list image */}
                    <div className="relative">
                        <div className="flex gap-3 h-20">
                            {selectedImage.map((imageUrl, index) => (
                                <React.Fragment key={index}>
                                    <input type="hidden" {...registerForm1(`image`)} value={imageUrl} />
                                    <Image src={imageUrl} alt={`Image ${index}`} className="w-20 h-20 " />
                                </React.Fragment>
                            ))}
                        </div>

                        <Button
                            component="label"
                            variant="outlined"
                            fullWidth
                            startIcon={<CloudUploadIcon />}
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                '&:hover': {
                                    color: 'black',
                                    backgroundColor: '#fff',
                                },
                            }}
                        >
                            Upload file
                            <VisuallyHiddenInput type="file" multiple onChange={handleImageChange} />
                        </Button>
                    </div>
                    {/* end list image */}
                    <div className="mb-5 font-semibold text-xl">Mô tả sản phẩm</div>
                    <TextareaAutosize
                        minRows={9}
                        style={{ border: '1px solid #000', width: '100%', padding: '8px 12px' }}
                    />

                    <Button
                        style={{ float: 'right', width: '100px' }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Save
                    </Button>
                </form>
                {/* end product setting */}

                {/* start bien the */}
                <div className="mb-5 font-semibold text-xl">Thông tin biến thể</div>

                {/* end bien the */}
            </div>
            {/* end section 1 */}
        </>
    );
};

export default DetailProduct;
