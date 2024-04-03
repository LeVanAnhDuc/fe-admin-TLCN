import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';

import InputText from '../../components/InputText/InputText';
import config from '../../config';
import ICategory, { IUpdateCategory } from '../../interface/category';
import { getAllCategory, getCategoryByIDOrSlug, updateCategory } from '../../apis/categoryApi';
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

                if (response.status === 200) {
                    await setValue('id', response.data.id);
                    await setValue('name', response.data.name);
                    await setValue('createdBy', response.data.createdBy);
                    await setValue('createdDate', response.data.createdDate);
                    await setValue('description', response.data.description);
                    await setValue('lastModifiedBy', response.data.lastModifiedBy);
                    await setValue('lastModifiedDate', response.data.lastModifiedDate);
                    await setValue('name', response.data.name);

                    setCateCurrent(response.data.parentName);

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
            parentName: cateCurrent,
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
                        <span className="normal-case">Quay lại</span>
                    </Button>
                </Link>
            </div>
            <div className="my-5">
                {/* start account setting */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* start input id and Name */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <InputText
                            labelInput="Tên Danh mục"
                            errorInput={errors.name ? true : false}
                            isRequired
                            register={{
                                ...register('name', {
                                    required: 'Name is required',
                                }),
                            }}
                        />
                        <InputText
                            labelInput="Mô tả"
                            errorInput={errors.description ? true : false}
                            isRequired
                            register={{
                                ...register('description', {
                                    required: 'description is required',
                                }),
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FormControl fullWidth>
                            <InputLabel>Tên Danh mục cha</InputLabel>
                            <Select
                                label="Tên Danh mục cha"
                                value={cateCurrent}
                                onChange={(e) => {
                                    setCateCurrent(e.target.value);
                                }}
                            >
                                <MenuItem value={''}>Không có danh mục cha</MenuItem>
                                {listCate.map((item, index) => (
                                    <MenuItem key={index} value={item.name}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <InputText
                            labelInput="Ngày chỉnh sửa cuối"
                            register={{
                                ...register('lastModifiedDate'),
                            }}
                            readOnly
                        />
                    </div>
                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <InputText
                            labelInput="Người tạo"
                            register={{
                                ...register('createdBy'),
                            }}
                            disabled
                        />
                        <InputText
                            labelInput="Ngày tạo"
                            register={{
                                ...register('createdDate'),
                            }}
                            disabled
                        />
                    </div> */}
                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <InputText
                            labelInput="Người chỉnh sửa cuối"
                            register={{
                                ...register('lastModifiedBy'),
                            }}
                            disabled
                        />
                        <InputText
                            labelInput="Slug"
                            register={{
                                ...register('slug'),
                            }}
                            readOnly
                        />
                    </div> */}

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
