import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TextField from '@mui/material/TextField';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import IProduct, { IOption, IValue } from '../../interface/product';
import Image from '../../components/Image';
import config from '../../config';
import OptionColor from './OptionColor';
import OptionSize from './OptionSize';
import { ISku } from '../../interface/productCart';
import ICategory from '../../interface/category';
import { getSingleProduct, updateProduct } from '../../apis/productApi';
import { uploadProductImages } from '../../apis/uploadImageApi';
import Button from '../../components/Button';
import { convertNumberToVND } from '../../utils/convertData';
import SnackBarLoading from '../../components/SnackBarLoading';
import Error404 from '../Error404';
import TextEditer from '../../components/TextEditer';

const TableRowCustom = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const DetailProduct = () => {
    const navigate = useNavigate();
    const { idProduct } = useParams();
    const location = useLocation();

    const categories: Array<ICategory> = location.state.categories;

    const inputRef = useRef<HTMLInputElement>(null);

    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [listImageCurrent, setListImageCurrent] = useState<Array<string>>([]);
    const [imagesTypeFileList, setImagesTypeFileList] = useState<FileList | null>();
    const [imagesDisplay, setImagesDisplay] = useState<string[]>([]);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [description, setDescription] = useState<string>('');
    const [loadingSKU, setLoadingSKU] = useState<boolean>(false);
    const [optionsSize, setOptionsSize] = useState<IOption>({ optionId: 0, optionName: '', values: [] });
    const [optionsColor, setOptionsColor] = useState<IOption>({ optionId: 0, optionName: '', values: [] });
    const [SkuNoneUpdate, setSkuNoneUpdate] = useState<Array<ISku>>([]);
    const [Sku, setSku] = useState<Array<ISku>>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm<IProduct>({});

    const getProduct = async () => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                const response = await getSingleProduct(+idProduct);

                if (response.status === 200) {
                    const product: IProduct = response.data;

                    await setValue('categoryName', product.categoryName);
                    await setValue('category', product.category);
                    await setValue('name', product.name);
                    await setValue('quantity', product.quantity);
                    await setValue('price', product.price);
                    await setValue('promotionalPrice', product.promotionalPrice);
                    await setValue('sold', product.sold);
                    await setValue('quantityAvailable', product.quantityAvailable);
                    await setValue('createdDate', product.createdDate);
                    await setValue('lastModifiedDate', product.lastModifiedDate);

                    setDescription(product.description);
                    setImagesDisplay(product.listImages);
                    setListImageCurrent(product.listImages);

                    await setOptionsSize(product.options.filter((item: IOption) => item.optionName === 'Size')[0]);
                    await setOptionsColor(product.options.filter((item: IOption) => item.optionName === 'Màu')[0]);

                    setSku(product.skus);
                    setSkuNoneUpdate(product.skus);
                } else {
                    toast.error(response.data.message || response.data);
                    navigate(config.Routes.listProduct);
                }
            } else {
                navigate(config.Routes.listProduct);
            }
        } catch {
            setErrorAPI(true);
        }
    };

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
                toast.success('Cập thành công');
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
        setLoadingSKU((prev) => !prev);
    };
    const handleSetOptionsColor = (optionName: string, values: Array<IValue>) => {
        setOptionsColor({ optionName, values });
        setLoadingSKU((prev) => !prev);
    };

    useEffect(() => {
        const combinedArray = [];

        for (let i = 0; i < optionsSize?.values.length; i++) {
            for (let j = 0; j < optionsColor?.values.length; j++) {
                combinedArray.push({ optionValues: [optionsSize.values[i], optionsColor.values[j]], price: 0 });
            }
        }

        const updatedSku = combinedArray.map((sku) => {
            const matchingSkuNoneUpdate = SkuNoneUpdate.find((skuNoneUpdate) => {
                return JSON.stringify(skuNoneUpdate.optionValues) === JSON.stringify(sku.optionValues);
            });

            if (matchingSkuNoneUpdate) {
                return { ...sku, price: matchingSkuNoneUpdate.price };
            }
            return sku;
        });
        setSku(updatedSku);
    }, [loadingSKU]);

    const handleChangePrice = (id: number, e: ChangeEvent<HTMLInputElement>) => {
        setSku((prev) => {
            const newArray = prev.map((item, index) => {
                if (index === id) {
                    return { ...item, price: +e.target.value };
                }
                return item;
            });
            return newArray;
        });
    };

    const onSubmit: SubmitHandler<IProduct> = async (data) => {
        if (data.price < 0) {
            toast.error('Số tiền không được nhỏ hơn 1');
            return;
        }

        if (!description) {
            toast.error('Mô tả sản phẩm hiện đang trống');
            return;
        }

        if (!data.name) {
            toast.error('Tên sản phẩm hiện đang trống');
            return;
        }

        const object: IProduct = {
            name: data.name,
            description: description,
            price: data.price,
            quantity: data.quantity,
            listImages: listImageCurrent,
            category: {
                name: getValues('categoryName') || '',
            },
            options: [optionsSize, optionsColor],
            skus: Sku,
            id: 0,
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

    useEffect(() => {
        getProduct();
    }, []);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <section className="space-y-5">
            <SnackBarLoading open={isLoadingUpdate} content={'Đang cập nhật sản phẩm'} />

            <div className="flex flex-wrap justify-between items-center gap-5">
                <Breadcrumbs className="!font-medium">
                    <Link
                        to={config.Routes.listProduct}
                        className="font-semibold decoration-primary-700 decoration-1 underline-offset-2 transition hover:underline hover:text-primary-700"
                    >
                        Danh sách sản phẩm
                    </Link>
                    <div>{idProduct}</div>
                </Breadcrumbs>
                <Link to={config.Routes.listProduct}>
                    <Button variant="fill">
                        <span className="normal-case">Quay lại</span>
                    </Button>
                </Link>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-5 bg-white p-4 rounded-lg">
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
                        <p
                            className={`${
                                errors.name ? 'block' : 'hidden'
                            } text-red-600 text-sm py-1  dark:text-red-500`}
                        >
                            {errors.name?.message}
                        </p>
                    </div>
                    <div className="grid  lg:grid-cols-5 gap-4">
                        <div className="col-span-1 lg:col-span-2">
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
                            <p
                                className={`${
                                    errors.categoryName ? 'block' : 'hidden'
                                }text-red-600 text-sm py-1  dark:text-red-500`}
                            >
                                {errors.categoryName?.message}
                            </p>
                        </div>

                        <div className="col-span-1 lg:col-span-3 grid md:grid-cols-3 gap-4">
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
                                        label="Sản phẩm đã bán"
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="col-span-1 grid md:grid-cols-2 gap-4">
                            <div>
                                <Controller
                                    name="price"
                                    control={control}
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.price ? true : false}
                                            fullWidth
                                            required
                                            type="number"
                                            label="Giá bán (VNĐ)"
                                        />
                                    )}
                                />
                                <p
                                    className={`${
                                        errors.price ? 'block' : 'hidden'
                                    } text-red-600 text-sm py-1 dark:text-red-500`}
                                >
                                    {errors.price?.message}
                                </p>
                            </div>
                            <Controller
                                name="promotionalPrice"
                                control={control}
                                defaultValue={undefined}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="filled"
                                        error={errors.promotionalPrice ? true : false}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        label="Giá khuyến mại (VNĐ)"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-span-1 grid md:grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-5 bg-white p-4 rounded-lg">
                    <div className="font-semibold text-lg">Danh sách ảnh sản phẩm</div>
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
                            <div
                                onClick={() => inputRef.current && inputRef.current.click()}
                                className="flex items-center justify-center size-14 bg-gray-400/60 rounded-full shadow cursor-pointer border-gray-400/60 transition hover:border-2 hover:bg-gray-200"
                            >
                                <input
                                    ref={inputRef}
                                    className="absolute bottom-0 left-0 invisible size-full"
                                    type="file"
                                    multiple
                                    onChange={handleGetImageByClient}
                                />
                                <CloudUploadIcon className="!text-2xl text-gray-800 !font-bold select-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-5 bg-white p-4 rounded-lg">
                    <div className="font-semibold text-lg">Mô tả sản phẩm</div>
                    <TextEditer value={description} setValue={setDescription} />
                </div>

                <div className="space-y-5 bg-white p-4 rounded-lg">
                    <div className="font-semibold text-lg">Thông tin biến thể</div>
                    <OptionSize handleSetOptionsSize={handleSetOptionsSize} optionsSize={optionsSize} />
                    <OptionColor handleSetOptionsColor={handleSetOptionsColor} optionsColor={optionsColor} />
                </div>

                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead className="!bg-primary-200">
                                <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center">Kích thước</TableCell>
                                    <TableCell align="center">Màu</TableCell>
                                    <TableCell align="center">Giá nhập (VNĐ)</TableCell>
                                    <TableCell align="left">Giá hiện thị</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Sku.map((item, index) => (
                                    <TableRowCustom key={index} className="hover:!bg-primary-50">
                                        <TableCell align="center">{index}</TableCell>
                                        {item.optionValues.map((item2, index2) => (
                                            <TableCell key={index2} align="center">
                                                {item2.valueName}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">
                                            <input
                                                className="w-32 h-8 p-2 rounded-lg border-2 focus:border-primary-100"
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handleChangePrice(index, e)}
                                            />
                                        </TableCell>
                                        <TableCell align="left">{convertNumberToVND(item.price)}</TableCell>
                                    </TableRowCustom>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <div className="flex justify-end gap-5">
                    <Link to={config.Routes.listProduct}>
                        <Button className="w-60" variant="outline">
                            Hủy
                        </Button>
                    </Link>
                    <Button className="w-60" type="submit" variant="fill">
                        Lưu
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default DetailProduct;
