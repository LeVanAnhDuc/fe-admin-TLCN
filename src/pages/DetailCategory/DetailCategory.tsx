import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';

import InputText from '../../components/InputText/InputText';
import config from '../../config';
import ICategory, { IUpdateCategory } from '../../interface/category';
import { getAllCategory, getCategoryByIDOrSlug, updateCategory } from '../../apis/categoryApii';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const DetailCategory = () => {
    const navigate = useNavigate();
    // handle get id
    const location = useLocation();
    const idProduct = location.hash.substring(1);
    // list cate
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
    // cate origan
    const [cateCurrent, setCateCurrent] = useState<string>('');

    // handle get data
    const getCategory = async (id: number) => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                // tồn tai ma san pham và phải là số
                const response = await getCategoryByIDOrSlug(id);
                console.log(response);

                if (response.status === 200) {
                    await setValue('id', response.data.id);
                    await setValue('name', response.data.name);
                    await setValue('createdBy', response.data.createdBy);
                    await setValue('createdDate', response.data.createdDate);
                    await setValue('description', response.data.description);
                    await setValue('lastModifiedBy', response.data.lastModifiedBy);
                    await setValue('lastModifiedDate', response.data.lastModifiedDate);
                    await setValue('name', response.data.name);

                    await setCateCurrent(response.data.parentName);

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
            parentName: data.parentName || null,
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
            <div className="flex flex-wrap justify-between pb-3 gap-5">
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
                    {/* start input parentName  */}

                    <FormControl fullWidth>
                        <InputLabel>Tên loại cha</InputLabel>
                        <Select
                            label="parentName"
                            {...register('parentName')}
                            value={cateCurrent}
                            onChange={(e) => {
                                setCateCurrent(e.target.value);
                            }}
                        >
                            <MenuItem value={''}>None</MenuItem>
                            {listCate.map((item, index) => (
                                <MenuItem key={index} value={item.name}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* end input parentName */}
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
