import { useForm, SubmitHandler } from 'react-hook-form';

import InputText from '../../components/InputText/InputText';
import Image from '../../components/Image';
import config from '../../config';

import React, { ChangeEvent, useEffect, useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import ICategory, { IUpdateCategory } from '../../interface/category';
import { getCategoryByIDOrSlug, updateCategory } from '../../apis/categoryApii';

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

const DetailCategory = () => {
    const navigate = useNavigate();
    // handle get id
    const location = useLocation();
    const idProduct = location.hash.substring(1);

    // handle get data
    const [category, setCategory] = useState<ICategory>({}); // Dữ liệu từ API
    const getCategory = async (id: number) => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                // tồn tai ma san pham và phải là số
                const response = await getCategoryByIDOrSlug(id);

                if (response.status === 200) {
                    setCategory(response.data);
                    await setValue('id', response.data.id);
                    await setValue('name', response.data.name);
                    await setValue('createdBy', response.data.createdBy);
                    await setValue('createdDate', response.data.createdDate);
                    await setValue('description', response.data.description);
                    await setValue('lastModifiedBy', response.data.lastModifiedBy);
                    await setValue('lastModifiedDate', response.data.lastModifiedDate);
                    await setValue('name', response.data.name);
                    await setValue('parentId', response.data.parentId);
                    await setValue('slug', response.data.slug);
                } else {
                    toast.error(response.data.message);
                    navigate(config.Routes.listCategory);
                }
            } else {
                navigate(config.Routes.listCategory);
            }
        } catch {
            toast.error('Đang bảo trì');
        }
    };
    useEffect(() => {
        getCategory(+idProduct);
    }, [idProduct]);

    const {
        register: registerForm1,
        handleSubmit: handleSubmitForm1,
        formState: formStateForm1,
        setValue,
    } = useForm<ICategory>({});

    // submit form
    const onSubmit1: SubmitHandler<ICategory> = async (data) => {
        console.log(data);
        // const objectUpdate: IUpdateCategory = {
        //     name: data.name,
        //     description: data.description,
        //     parentId: data.parentId,
        //     slug: data.slug,
        // };
        // //  call api doi update thong tin
        // const response = await updateCategory(+idProduct, objectUpdate);
        // console.log(response);
    };

    // handle change image
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setValue('image', URL.createObjectURL(file));
        }

        // call api update anh
        //
        //
        //
    };
    return (
        <>
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
                        <Image src={selectedImage} className="w-full xs:h-96 h-52 " />

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
                        <div className="mb-5 font-semibold text-xl">Chi tiết loại : {category?.id}</div>
                        <form className="space-y-6" onSubmit={handleSubmitForm1(onSubmit1)}>
                            {/* start input id and Name */}
                            <div className="grid grid-cols-2 gap-5">
                                <InputText
                                    labelInput="CategoryID"
                                    errorInput={formStateForm1.errors.id ? true : false}
                                    isRequired
                                    errorFormMessage={formStateForm1.errors.id?.message}
                                    register={{
                                        ...registerForm1('id', {
                                            required: 'categoryID is required',
                                        }),
                                    }}
                                    disabled
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
                            {/* starr description */}
                            <InputText
                                labelInput="Mô tả"
                                errorInput={formStateForm1.errors.description ? true : false}
                                isRequired
                                errorFormMessage={formStateForm1.errors.description?.message}
                                register={{
                                    ...registerForm1('description', {
                                        required: 'description is required',
                                    }),
                                }}
                            />
                            {/* end description */}
                            {/* starr slug */}
                            <InputText
                                labelInput="sSlug"
                                errorInput={formStateForm1.errors.slug ? true : false}
                                isRequired
                                errorFormMessage={formStateForm1.errors.slug?.message}
                                register={{
                                    ...registerForm1('slug', {
                                        required: 'slug is required',
                                    }),
                                }}
                            />
                            {/* end slug */}
                            {/* start input parentId  */}
                            <InputText
                                labelInput="ID Parent"
                                errorInput={formStateForm1.errors.parentId ? true : false}
                                isRequired
                                errorFormMessage={formStateForm1.errors.parentId?.message}
                                register={{
                                    ...registerForm1('parentId', {
                                        required: 'parentId is required',
                                    }),
                                }}
                            />
                            {/* end input parentId */}
                            {/* start input  createdBy and createdDate  */}
                            <InputText
                                labelInput="Người tạo"
                                errorInput={formStateForm1.errors.createdBy ? true : false}
                                isRequired
                                errorFormMessage={formStateForm1.errors.createdBy?.message}
                                register={{
                                    ...registerForm1('createdBy', {
                                        required: 'createdBy is required',
                                    }),
                                }}
                                disabled
                            />
                            <InputText
                                labelInput="Ngày tạo"
                                errorInput={formStateForm1.errors.createdDate ? true : false}
                                isRequired
                                errorFormMessage={formStateForm1.errors.createdDate?.message}
                                register={{
                                    ...registerForm1('createdDate', {
                                        required: 'CreateDate is required',
                                    }),
                                }}
                                disabled
                            />
                            {/* end input createdBy and createdDate */}
                            {/* start input  lastModifiedBy and lastModifiedDate  */}
                            <InputText
                                labelInput="Người chỉnh sửa cuối"
                                errorInput={formStateForm1.errors.lastModifiedBy ? true : false}
                                isRequired
                                errorFormMessage={formStateForm1.errors.lastModifiedBy?.message}
                                register={{
                                    ...registerForm1('lastModifiedBy', {
                                        required: 'lastModifiedBy is required',
                                    }),
                                }}
                                disabled
                            />
                            <InputText
                                labelInput="Ngày chỉnh sửa cuối"
                                errorInput={formStateForm1.errors.lastModifiedDate ? true : false}
                                isRequired
                                errorFormMessage={formStateForm1.errors.lastModifiedDate?.message}
                                register={{
                                    ...registerForm1('lastModifiedDate', {
                                        required: 'lastModifiedDate is required',
                                    }),
                                }}
                                disabled
                            />
                            {/* end input lastModifiedBy and lastModifiedDate */}

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
