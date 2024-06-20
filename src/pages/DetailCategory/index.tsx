import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import config from '../../config';
import ICategory, { IUpdateCategory } from '../../interface/category';
import { getAllCategory, getCategoryByIDOrSlug, updateCategory } from '../../apis/categoryApi';
import Button from '../../components/Button';
import { objectsAreEqual } from '../../utils/checkData';

const DetailCategory = () => {
    const navigate = useNavigate();
    const { idCategory } = useParams();

    const [categories, setCategories] = useState<Array<ICategory>>([]);
    const [category, setCategory] = useState<IUpdateCategory>({
        name: '',
        description: '',
        parentName: '',
    });

    const schema = yup.object().shape({
        name: yup.string().required('Tên danh mục đang trống'),
        description: yup.string().required('Mô tả danh mục đang trống'),
        lastModifiedDate: yup.string(),
    });

    const getCategoryAPI = async () => {
        try {
            if (idCategory && !isNaN(+idCategory)) {
                const response = await getCategoryByIDOrSlug(+idCategory);
                if (response.status === 200) {
                    setCategory({
                        name: response.data.name,
                        description: response.data.description,
                        parentName: response.data.parentName,
                    });

                    setValue('name', response.data.name);
                    setValue('lastModifiedDate', response.data.lastModifiedDate);
                    setValue('description', response.data.description);
                    setValue('parentName', response.data.parentName);
                }
            } else {
                navigate(config.Routes.listCategory);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IUpdateCategory>({ resolver: yupResolver(schema) });

    const onSubmit: SubmitHandler<IUpdateCategory> = async (data) => {
        const objectUpdate: IUpdateCategory = {
            name: data.name,
            description: data.description,
            parentName: data.parentName,
        };

        if (objectsAreEqual(objectUpdate, category)) {
            toast.info('Thông tin chưa thay đổi');
            return;
        }

        try {
            if (idCategory) {
                const response = await updateCategory(+idCategory, objectUpdate);

                if (response.status === 200) {
                    toast.success('Cập nhật thành công');
                } else {
                    toast.error(response.data.message || response.data);
                }
            }
        } catch (error) {
            toast.error(`${error}`);
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
        getCategoryAPI();
    }, []);

    return (
        <section className="space-y-5 mx-40">
            <div className="flex flex-wrap justify-between items-center gap-5">
                <Breadcrumbs className="!font-medium">
                    <Link
                        to={config.Routes.listCategory}
                        className="font-semibold decoration-primary-700 text-lg decoration-1 underline-offset-2 transition hover:text-primary-700"
                    >
                        <ArrowBackIcon fontSize="small" className='mr-2 mb-1' />
                        Danh mục sản phẩm
                    </Link>
                    <div>
                        {idCategory}
                    </div>
                </Breadcrumbs>

            </div>
            <form className="space-y-5 bg-white p-4 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-5 mx-24 mt-5'>
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
                        <p
                            className={`${errors.name ? 'block' : 'hidden'
                                }text-red-600 text-sm py-1  dark:text-red-500`}
                        >
                            {errors.name?.message}
                        </p>
                    </div>
                    <div>
                        <Controller
                            name="parentName"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Danh mục cha</InputLabel>
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
                                    rows={6}
                                    label="Mô tả"
                                />
                            )}
                        />
                        <p
                            className={`${errors.description ? 'block' : 'hidden'
                                }text-red-600 text-sm py-1  dark:text-red-500`}
                        >
                            {errors.description?.message}
                        </p>
                    </div>
                    <div>
                        <Controller
                            name="lastModifiedDate"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant="filled"
                                    fullWidth
                                    label="Lần chỉnh sửa cuối"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>


                <div className="flex justify-center space-x-4">
                    <Button type="submit" className="min-w-40 bg-[#493bc0] text-white">
                        Cập nhật
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default DetailCategory;
