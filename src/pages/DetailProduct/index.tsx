// libs
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { ChangeEvent, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// types
import { IOption, IProductInputUpdate, IProductUpdate, IValue } from '@/types/product';
import { ISkuCreate } from '@/types/productCart';
import ICategory from '@/types/category';
// components
import Image from '@/components/Image';
import Button from '@/components/Button';
import SnackBarLoading from '@/components/SnackBarLoading';
import TextEditer from '@/components/TextEditer';
import Error404 from '../Error404';
import OptionSize from './mains/OptionSize';
import OptionColor from './mains/OptionColor';
import TableSKU from './mains/TableSKU';
// apis
import { updateProduct } from '@/apis/productApi';
import { uploadProductImages } from '@/apis/uploadImageApi';
// ghosts
import GenerateSKU from './ghosts/GenerateSKU';
import GetProduct from './ghosts/GetProduct';
// others
import config from '@/config';

const schema = yup.object().shape({
    name: yup.string().required('Tên sản phẩm đang thiếu'),
    originalPrice: yup.number().required('Giá sản phẩm đang thiếu').min(0, 'Giá không âm'),
    price: yup.number(),
    percentDiscount: yup
        .number()
        .required('Giá giảm đang thiếu')
        .min(0, 'Phần trăm không âm')
        .max(100, 'Phần trăm nhỏ hơn 100%'),
    categoryName: yup.string().required('Phân loại đang thiếu'),
    description: yup.string(),
    quantity: yup.number(),
    quantityAvailable: yup.number(),
    sold: yup.number(),
    createdDate: yup.string(),
    lastModifiedDate: yup.string(),
});

const DetailProduct = () => {
    const { idProduct } = useParams();
    const location = useLocation();

    const categories: Array<ICategory> = location.state.categories;

    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [listImageCurrent, setListImageCurrent] = useState<Array<string>>([]);
    const [imagesTypeFileList, setImagesTypeFileList] = useState<FileList | null>();
    const [imagesDisplay, setImagesDisplay] = useState<string[]>([]);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [description, setDescription] = useState<string>('');
    const [optionsSize, setOptionsSize] = useState<IOption>({ optionId: 0, optionName: '', values: [] });
    const [optionsColor, setOptionsColor] = useState<IOption>({ optionId: 0, optionName: '', values: [] });
    const [Sku, setSku] = useState<Array<ISkuCreate>>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<IProductInputUpdate>({
        resolver: yupResolver(schema),
    });

    const handleGetImageByClient = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImagesTypeFileList(e.target.files);
            const imageUrls = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
            setImagesDisplay(imageUrls);
        }
    };

    const handleUpload = async (idProduct: number) => {
        if (!imagesTypeFileList || imagesTypeFileList.length === 0) {
            setIsLoadingUpdate(false);
            toast.success('Cập thành công');
            return;
        }

        try {
            const formData = new FormData();

            for (let i = 0; i < imagesTypeFileList.length; i++) {
                formData.append('images', imagesTypeFileList[i]);
            }

            const response = await uploadProductImages(idProduct, formData);

            if (response.status === 200) {
                toast.success('Cập nhật thành công');
            } else {
                toast.error(response.data.message || response.data);
            }

            setImagesTypeFileList(null);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    const handleSetOptionsSize = (optionName: string, values: Array<IValue>) => {
        setOptionsSize({ optionName, values });
    };
    const handleSetOptionsColor = (optionName: string, values: Array<IValue>) => {
        setOptionsColor({ optionName, values });
    };

    const onSubmit: SubmitHandler<IProductInputUpdate> = async (data) => {
        const object: IProductUpdate = {
            name: data.name,
            description: description,
            originalPrice: data.originalPrice,
            percentDiscount: data.percentDiscount,
            listImages: listImageCurrent,
            categoryName: data.categoryName,
            options: [optionsSize, optionsColor],
            skus: Sku,
        };

        setIsLoadingUpdate(true);
        try {
            if (idProduct && !isNaN(+idProduct)) {
                const response = await updateProduct(+idProduct, object);
                if (response.status === 200) {
                    handleUpload(response.data.id);
                } else {
                    toast.error(response.data.message || response.data);
                    setIsLoadingUpdate(false);
                }
            }
        } catch (error) {
            setIsLoadingUpdate(false);
        }
    };

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetProduct
                {...{
                    idProduct,
                    setValue,
                    setDescription,
                    setImagesDisplay,
                    setListImageCurrent,
                    setOptionsSize,
                    setOptionsColor,
                    setSku,
                    setErrorAPI,
                }}
            />
            <GenerateSKU {...{ optionsColor, optionsSize, setSku }} />
            <section className="space-y-2 ">
                <SnackBarLoading open={isLoadingUpdate} content={'Đang cập nhật sản phẩm'} />

                <div className="flex flex-wrap justify-between items-center gap-5">
                    <Breadcrumbs className="!font-medium">
                        <Link
                            to={config.Routes.listProduct}
                            className="font-semibold decoration-primary-700 decoration-1 underline-offset-2 transition hover:text-primary-700"
                        >
                            <ArrowBackIcon fontSize="small" className="mr-2 mb-1" />
                            Sản phẩm
                        </Link>
                        <div>{idProduct}</div>
                    </Breadcrumbs>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-3 bg-white p-4 rounded-lg mt-4">
                        <div className="font-semibold text-lg">Thông tin sản phẩm</div>
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
                                        label="Tên sản phẩm"
                                    />
                                )}
                            />
                            <p className="text-red-600 text-sm py-1 dark:text-red-500">{errors.name?.message}</p>
                        </div>
                        <div className="grid lg:grid-cols-6 gap-4">
                            <div className="col-span-1 lg:col-span-1">
                                <Controller
                                    name="categoryName"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel required>Danh mục sản phẩm</InputLabel>
                                            <Select
                                                {...field}
                                                label="Danh mục sản phẩm"
                                                error={errors.categoryName ? true : false}
                                            >
                                                {categories.map((item, index) => (
                                                    <MenuItem key={index} value={item.name}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 dark:text-red-500">
                                    {errors.categoryName?.message}
                                </p>
                            </div>

                            <div className="col-span-1 lg:col-span-5 grid md:grid-cols-5 gap-4">
                                <Controller
                                    name="quantity"
                                    control={control}
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="filled"
                                            error={errors.quantity ? true : false}
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            label="Số lượng"
                                        />
                                    )}
                                />

                                <Controller
                                    name="quantityAvailable"
                                    control={control}
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="filled"
                                            error={errors.quantityAvailable ? true : false}
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            label="Số lượng có sẵn"
                                        />
                                    )}
                                />

                                <Controller
                                    name="sold"
                                    control={control}
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="filled"
                                            error={errors.sold ? true : false}
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            label="Đã bán"
                                        />
                                    )}
                                />
                                <Controller
                                    name="createdDate"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="filled"
                                            error={errors.createdDate ? true : false}
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            label="Ngày tạo"
                                        />
                                    )}
                                />
                                <Controller
                                    name="lastModifiedDate"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="filled"
                                            error={errors.lastModifiedDate ? true : false}
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            label="Lần cập nhật cuối"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="col-span-1 grid md:grid-cols-3 gap-4 lg:col-span-3">
                                <div>
                                    <Controller
                                        name="originalPrice"
                                        control={control}
                                        defaultValue={0}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.originalPrice ? true : false}
                                                fullWidth
                                                required
                                                type="number"
                                                label="Giá gốc (VNĐ)"
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 dark:text-red-500">
                                        {errors.originalPrice?.message}
                                    </p>
                                </div>
                                <div>
                                    <Controller
                                        name="percentDiscount"
                                        control={control}
                                        defaultValue={0}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.percentDiscount ? true : false}
                                                fullWidth
                                                required
                                                label="Phần trăm giảm"
                                                type="number"
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 dark:text-red-500">
                                        {errors.percentDiscount?.message}
                                    </p>
                                </div>

                                <TextField
                                    variant="filled"
                                    fullWidth
                                    label="Giá bán (VNĐ)"
                                    value={
                                        watch('originalPrice') -
                                        (watch('originalPrice') * watch('percentDiscount')) / 100
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
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
                        <div className="font-semibold text-lg">Thông tin biến thể</div>
                        <OptionSize {...{ handleSetOptionsSize, optionsSize }} />
                        <OptionColor {...{ handleSetOptionsColor, optionsColor }} />
                    </div>

                    <TableSKU Sku={Sku} setSku={setSku} valuePercentDiscount={watch('percentDiscount')} />

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

export default DetailProduct;
