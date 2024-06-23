// libs
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import React, { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// types
import { IOption, IProductInputCreate, IValue } from '@/types/product';
import { ISkuCreate } from '@/types/productCart';
import ICategory from '@/types/category';
// components
import Image from '@/components/Image';
import SnackBarLoading from '@/components/SnackBarLoading';
import Button from '@/components/Button';
import TextEditer from '@/components/TextEditer';
import OptionSize from './mains/OptionSize';
import TableSKU from './mains/TableSKU';
import OptionColor from './mains/OptionColor';
// apis
import { createNewProduct } from '@/apis/productApi';
import { uploadProductImages } from '@/apis/uploadImageApi';
// ghosts
import GetCategories from './ghosts/GetCategories';
import GenerateSKU from './ghosts/GenerateSKU';
// others
import config from '@/config';

const schema = yup.object().shape({
    name: yup.string().required('Tên sản phẩm đang thiếu'),
    originalPrice: yup.number().required('Giá sản phẩm đang thiếu').min(0, 'Giá không âm'),
    percentDiscount: yup
        .number()
        .required('Giá giảm đang thiếu')
        .min(0, 'Phần trăm không âm')
        .max(100, 'Phần trăm nhỏ hơn 100%'),
    categoryName: yup.string().required('Phân loại đang thiếu'),
});

const AddProduct = () => {
    const [listCate, setListCate] = useState<Array<ICategory>>([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [description, setDescription] = useState<string>('');
    const [optionsSize, setOptionsSize] = useState<IOption>({ optionName: '', values: [] });
    const [optionsColor, setOptionsColor] = useState<IOption>({ optionName: '', values: [] });
    const [imagesTypeFileList, setImagesTypeFileList] = useState<FileList | null>(null);
    const [imagesDisplay, setDisplayedImages] = useState<string[]>([]);
    const [Sku, setSku] = useState<Array<ISkuCreate>>([]);

    const {
        handleSubmit,
        formState: { errors },
        control,
        getValues,
    } = useForm<IProductInputCreate>({
        resolver: yupResolver(schema),
    });

    const handleSetOptionsSize = (optionName: string, values: Array<IValue>) => {
        setOptionsSize({ optionName, values });
    };
    const handleSetOptionsColor = (optionName: string, values: Array<IValue>) => {
        setOptionsColor({ optionName, values });
    };

    const handleGetImageByClient = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImagesTypeFileList(e.target.files);

            const imageUrls = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
            setDisplayedImages(imageUrls);
        }
    };

    const handleUploadImages = async (idProduct: number) => {
        if (!imagesTypeFileList || imagesTypeFileList.length === 0) {
            setLoadingSubmit(false);
            toast.success('Thêm sản phẩm thành công');
            return;
        }

        try {
            const formData = new FormData();

            for (let i = 0; i < imagesTypeFileList.length; i++) {
                formData.append('images', imagesTypeFileList[i]);
            }

            const response = await uploadProductImages(+idProduct, formData);

            if (response.status === 200) {
                toast.success('Thêm sản phẩm thành công');
            } else {
                toast.error(response.data.message || response.data);
            }
            setImagesTypeFileList(null);
        } catch (error) {
            toast.error(`${error}`);
        }
        setLoadingSubmit(false);
    };

    const onSubmit: SubmitHandler<IProductInputCreate> = async (data) => {
        const object = {
            name: data.name,
            description: description,
            originalPrice: data.originalPrice,
            percentDiscount: data.percentDiscount,
            categoryName: data.categoryName,
            options: [optionsSize, optionsColor],
            skus: Sku,
            listImages: [],
        };

        setLoadingSubmit(true);
        try {
            const response = await createNewProduct(object);

            if (response.status === 201) {
                handleUploadImages(response.data.id);
            } else {
                toast.error(response.data.message || response.data);
                setLoadingSubmit(false);
            }
        } catch (error) {
            toast.error(`${error}`);
            setLoadingSubmit(false);
        }
    };

    return (
        <>
            <GetCategories setListCate={setListCate} />
            <GenerateSKU {...{ optionsColor, optionsSize, setSku }} />
            <section className="space-y-5 my-5">
                <SnackBarLoading open={loadingSubmit} content={'Đang lưu sản phẩm'} />
                <Link
                    to={config.Routes.listProduct}
                    className="font-semibold decoration-primary-700 decoration-1 underline-offset-2 transition hover:underline hover:text-primary-700"
                >
                    <ArrowBackIcon fontSize="small" className="mr-2 mb-1" />
                    Quay lại
                </Link>

                <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2 bg-white p-4 rounded-lg">
                        <div className="font-semibold text-lg mb-5">Thông tin sản phẩm</div>
                        <div>
                            <>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.name ? true : false}
                                            fullWidth
                                            label="Tên sản phẩm"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-5 dark:text-red-500">
                                    {errors.name?.message}
                                </p>
                            </>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5">
                            <div>
                                <>
                                    <Controller
                                        name="categoryName"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth>
                                                <InputLabel error={errors.categoryName ? true : false}>
                                                    Chọn danh mục sản phẩm
                                                </InputLabel>
                                                <Select
                                                    label="Chọn danh mục sản phẩm"
                                                    error={errors.categoryName ? true : false}
                                                    {...field}
                                                    defaultValue={''}
                                                >
                                                    {listCate.map((item, index) => (
                                                        <MenuItem key={index} value={item.name}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 min-h-6 dark:text-red-500">
                                        {errors.categoryName?.message}
                                    </p>
                                </>
                            </div>

                            <div>
                                <>
                                    <Controller
                                        name="originalPrice"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.originalPrice ? true : false}
                                                fullWidth
                                                label="Giá bán"
                                                type="number"
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.originalPrice?.message}
                                    </p>
                                </>
                            </div>

                            <div>
                                <>
                                    <Controller
                                        name="percentDiscount"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.percentDiscount ? true : false}
                                                fullWidth
                                                label="Phần trăm giảm"
                                                type="number"
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.percentDiscount?.message}
                                    </p>
                                </>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 bg-white p-4 rounded-lg">
                        <div className="font-semibold text-lg">Danh sách ảnh</div>
                        <div className="flex flex-wrap items-center gap-3">
                            {imagesDisplay.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Image
                                        src={item}
                                        alt={`Image ${index}`}
                                        className="size-28 object-cover object-center rounded shadow"
                                    />
                                </React.Fragment>
                            ))}

                            <div className="size-28 flex items-center">
                                <label
                                    htmlFor="input-images"
                                    className="flex items-center justify-center size-14 bg-gray-400/60 rounded-full shadow cursor-pointer border-gray-400/60 transition hover:border-2 hover:bg-gray-200"
                                >
                                    <input
                                        id="input-images"
                                        className="absolute bottom-0 left-0 invisible size-full"
                                        type="file"
                                        multiple
                                        onChange={handleGetImageByClient}
                                    />
                                    <CloudUploadIcon className="!text-2xl text-gray-800 !font-bold select-none" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 bg-white p-4 rounded-lg">
                        <div className="font-semibold text-lg">Mô tả sản phẩm</div>
                        <TextEditer value={description} setValue={setDescription} />
                    </div>

                    <div className="space-y-5 bg-white p-4 rounded-lg">
                        <div className="font-semibold text-xl my-5">Thông tin biến thể</div>
                        <OptionSize handleSetOptionsSize={handleSetOptionsSize} />
                        <OptionColor handleSetOptionsColor={handleSetOptionsColor} />
                    </div>

                    <TableSKU Sku={Sku} setSku={setSku} valuePercentDiscount={getValues('percentDiscount')} />

                    <div className="flex justify-center gap-5 ">
                        <Link to={config.Routes.listProduct}>
                            <Button className="w-40" variant="outline">
                                Hủy bỏ
                            </Button>
                        </Link>
                        <Button className="w-40" variant="fill" type="submit">
                            Lưu sản phẩm
                        </Button>
                    </div>
                </form>
            </section>
        </>
    );
};

export default AddProduct;
