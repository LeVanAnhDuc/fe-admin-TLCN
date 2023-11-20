import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';

import InputText from '../../components/InputText/InputText';
import config from '../../config';
import ICategory, { IUpdateCategory } from '../../interface/category';
import { getCategoryByIDOrSlug, updateCategory } from '../../apis/categoryApii';

const DetailCategory = () => {
    const navigate = useNavigate();
    // handle get id
    const location = useLocation();
    const idProduct = location.hash.substring(1);

    // handle get data
    const getCategory = async (id: number) => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                // tồn tai ma san pham và phải là số
                const response = await getCategoryByIDOrSlug(id);
                console.log(response.data);

                if (response.status === 200) {
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
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ICategory>({});

    // submit form
    const onSubmit: SubmitHandler<ICategory> = async (data) => {
        const objectUpdate: IUpdateCategory = {
            name: data.name,
            description: data.description,
            parentId: data.parentId || null,
        };

        //  call api doi update thong tin
        const response = await updateCategory(+idProduct, objectUpdate);
        if (response.status === 200) {
            toast.success('Cập nhật thành công');
        } else {
            toast.error(response.data.message || response.data);
        }
    };

    return (
        <>
            <div className="flex justify-between pb-3">
                <div className="text-2xl font-semibold flex items-center ">Thông tin mã loại : {idProduct}</div>
                <Link to={config.Routes.listCategory}>
                    <Button variant="contained">
                        <KeyboardArrowLeft />
                        <span className="normal-case">Danh sách loại hàng</span>
                    </Button>
                </Link>
            </div>
            <div className="my-5">
                {/* start account setting */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* start input id and Name */}

                    <InputText
                        labelInput="Name"
                        errorInput={errors.name ? true : false}
                        isRequired
                        errorFormMessage={errors.name?.message}
                        register={{
                            ...register('name', {
                                required: 'Name is required',
                            }),
                        }}
                    />
                    {/* end input id and  Name*/}
                    {/* starr description */}
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
                    {/* end description */}
                    {/* start input parentId  */}
                    <InputText
                        labelInput="ID Parent"
                        errorInput={errors.parentId ? true : false}
                        errorFormMessage={errors.parentId?.message}
                        register={{
                            ...register('parentId'),
                        }}
                    />
                    {/* end input parentId */}
                    {/* starr slug */}
                    <InputText
                        labelInput="Slug"
                        errorInput={errors.slug ? true : false}
                        isRequired
                        errorFormMessage={errors.slug?.message}
                        register={{
                            ...register('slug', {
                                required: 'slug is required',
                            }),
                        }}
                        disabled
                    />
                    {/* end slug */}

                    {/* start input  createdBy and createdDate  */}
                    <InputText
                        labelInput="Người tạo"
                        errorInput={errors.createdBy ? true : false}
                        isRequired
                        errorFormMessage={errors.createdBy?.message}
                        register={{
                            ...register('createdBy', {
                                required: 'createdBy is required',
                            }),
                        }}
                        disabled
                    />
                    <InputText
                        labelInput="Ngày tạo"
                        errorInput={errors.createdDate ? true : false}
                        isRequired
                        errorFormMessage={errors.createdDate?.message}
                        register={{
                            ...register('createdDate', {
                                required: 'CreateDate is required',
                            }),
                        }}
                        disabled
                    />
                    {/* end input createdBy and createdDate */}
                    {/* start input  lastModifiedBy and lastModifiedDate  */}
                    <InputText
                        labelInput="Người chỉnh sửa cuối"
                        errorInput={errors.lastModifiedBy ? true : false}
                        isRequired
                        errorFormMessage={errors.lastModifiedBy?.message}
                        register={{
                            ...register('lastModifiedBy', {
                                required: 'lastModifiedBy is required',
                            }),
                        }}
                        disabled
                    />
                    <InputText
                        labelInput="Ngày chỉnh sửa cuối"
                        errorInput={errors.lastModifiedDate ? true : false}
                        isRequired
                        errorFormMessage={errors.lastModifiedDate?.message}
                        register={{
                            ...register('lastModifiedDate', {
                                required: 'lastModifiedDate is required',
                            }),
                        }}
                        disabled
                    />
                    {/* end input lastModifiedBy and lastModifiedDate */}

                    <Button fullWidth type="submit" variant="contained" size="large">
                        Cập nhật
                    </Button>
                </form>
            </div>
            {/* end account setting */}
        </>
    );
};

export default DetailCategory;
