// libs
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// types
import ICategory, { IUpdateCategory } from '@/types/category';
// components
import Button from '@/components/Button';
// apis
import { updateCategory } from '@/apis/categoryApi';
// ghosts
import GetCategories from './ghosts/GetCategories';
// others
import config from '@/config';
import { objectsAreEqual } from '@/utils/checkData';

const schema = yup.object().shape({
    name: yup.string().required('Tên danh mục đang trống'),
    description: yup.string().required('Mô tả danh mục đang trống'),
    lastModifiedDate: yup.string(),
    parentName: yup.string().nullable(),
});

const DetailCategory = () => {
    const { idCategory } = useParams();
    const location = useLocation();
    const category: ICategory = location.state.category;

    const [categories, setCategories] = useState<Array<ICategory>>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IUpdateCategory>({ resolver: yupResolver(schema), defaultValues: category });

    const onSubmit: SubmitHandler<IUpdateCategory> = async (data) => {
        if (category) {
            const objectUpdate: IUpdateCategory = {
                name: data.name,
                description: data.description,
                parentName: data.parentName,
            };

            const categoryCurrent: IUpdateCategory = {
                name: category.name,
                description: category.description,
                parentName: category.parentName,
            };

            if (objectsAreEqual(objectUpdate, categoryCurrent)) {
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
        }
    };

    return (
        <>
            <GetCategories {...{ setCategories }} />
            <section className="space-y-5 max-w-[1240px] m-auto">
                <div className="flex flex-wrap justify-between items-center gap-5">
                    <Breadcrumbs className="!font-medium">
                        <Link
                            to={config.Routes.listCategory}
                            className="font-semibold decoration-primary-700 text-lg decoration-1 underline-offset-2 transition hover:text-primary-700"
                        >
                            <ArrowBackIcon fontSize="small" className="mr-2 mb-1" />
                            Danh mục sản phẩm
                        </Link>
                        <div>{idCategory}</div>
                    </Breadcrumbs>
                </div>
                <form className="space-y-2 bg-white p-5 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
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
                        <p className="text-red-600 text-sm py-1 h-5 dark:text-red-500">{errors.name?.message}</p>
                    </div>
                    <div>
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
                        <p className="text-red-600 text-sm py-1 h-5 dark:text-red-500">{errors.name?.message}</p>
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
                        <p className="text-red-600 text-sm py-1 h-5 dark:text-red-500">{errors.description?.message}</p>
                    </div>
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

                    <div className="flex justify-center pt-5">
                        <Button variant="fill" type="submit" className="min-w-40 ">
                            Cập nhật
                        </Button>
                    </div>
                </form>
            </section>
        </>
    );
};

export default DetailCategory;
