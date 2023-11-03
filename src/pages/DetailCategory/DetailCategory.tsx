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

interface IInfoCategory {
    id: string;
    categoryID: string;
    name: string;
    image: string;
    createBy: string;
    lastModifiedBy: string;
    createDate: string;
    lastModifiedDate: string;
}

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

const user: IInfoCategory = {
    id: 'ID01',
    categoryID: 'C03',
    name: 'Giày Nam',
    image: '',
    createBy: 'LeVanAnhDuc',
    createDate: '17/4/2002',
    lastModifiedBy: 'ChauChinHua',
    lastModifiedDate: '18/4/2002',
};

const DetailCategory = () => {
    const {
        register: registerForm1,
        handleSubmit: handleSubmitForm1,
        formState: formStateForm1,
        setValue,
    } = useForm<IInfoCategory>({
        defaultValues: user,
    });

    // submit form
    const [textToast, setTextToast] = useState<IToast>({ message: 'Lỗi kìa', alert: AlertColor.Error });
    const onSubmit1: SubmitHandler<IInfoCategory> = (data) => {
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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setValue('image', URL.createObjectURL(file));
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
                <Link to={config.Routes.listCategory}>
                    <Button variant="outlined">
                        <KeyboardArrowLeft />
                    </Button>
                </Link>
            </div>
            <div className="my-10 ">
                {/* start section 1 */}
                <div className="grid grid-cols-12 relative gap-10">
                    {/* start avatar */}
                    <div className="col-span-12 sm:col-span-5 lg:col-span-4 xl:col-span-3 relative">
                        <Image
                            src={selectedImage}
                            className="w-full xs:h-96 h-52 "
                            register={{
                                ...registerForm1('image'),
                            }}
                        />

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
                            <VisuallyHiddenInput type="file" onChange={handleImageChange} />
                        </Button>
                    </div>
                    {/* end avatar */}
                    {/* start account setting */}
                    <div className="col-span-12 sm:col-span-7 lg:col-span-8 xl:col-span-9">
                        <div className="mb-5 font-semibold text-xl">Chi tiết loại : {user.id}</div>
                        <form className="space-y-6" onSubmit={handleSubmitForm1(onSubmit1)}>
                            {/* start input id and Name */}
                            <div className="grid grid-cols-2 gap-5">
                                <InputText
                                    labelInput="CategoryID"
                                    errorInput={formStateForm1.errors.categoryID ? true : false}
                                    isRequired
                                    errorFormMessage={formStateForm1.errors.categoryID?.message}
                                    register={{
                                        ...registerForm1('categoryID', {
                                            required: 'categoryID is required',
                                        }),
                                    }}
                                />
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
                            {/* start input  createBy and createDate  */}
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
                            {/* end input createBy and createDate */}
                            {/* start input  lastModifiedBy and lastModifiedDate  */}
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
                            {/* end input lastModifiedBy and lastModifiedDate */}
                            {/* end input phone */}
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
                    </div>
                    {/* end account setting */}
                </div>
                {/* end section 1 */}
            </div>
        </>
    );
};

export default DetailCategory;
