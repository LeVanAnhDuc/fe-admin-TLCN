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
import { TextField } from '@mui/material';

import { toast } from 'react-toastify';
import { useForm, SubmitHandler } from 'react-hook-form';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import IProduct, { IOption, IValue } from '../../interface/product';
import Image from '../../components/Image';
import config from '../../config';
import OptionColor from './OptionColor';
import OptionSize from './OptionSize';
import { ISku } from '../../interface/productCart';
import ICategory from '../../interface/category';
import { getAllCategory } from '../../apis/categoryApi';
import { createNewProduct } from '../../apis/productApi';
import { uploadProductImages } from '../../apis/uploadImageApi';
import SnackBarLoading from '../../components/SnackBarLoading';
import Button from '../../components/Button';
import TextEditer from '../../components/TextEditer';
import { convertNumberToVND } from '../../utils/convertData';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TableRowCustom = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const AddProduct = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [listCate, setListCate] = useState<Array<ICategory>>([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [description, setDescription] = useState<string>('');
    const [loadingSKU, setLoadingSKU] = useState<boolean>(false);
    const [optionsSize, setOptionsSize] = useState<IOption>({ optionName: '', values: [] });
    const [optionsColor, setOptionsColor] = useState<IOption>({ optionName: '', values: [] });
    const [imagesTypeFileList, setImagesTypeFileList] = useState<FileList | null>(null);
    const [imagesDisplay, setDisplayedImages] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IProduct>({});

    const handleSetOptionsSize = (optionName: string, values: Array<IValue>) => {
        setOptionsSize({ optionName, values });
        setLoadingSKU((prev) => !prev);
    };
    const handleSetOptionsColor = (optionName: string, values: Array<IValue>) => {
        setOptionsColor({ optionName, values });
        setLoadingSKU((prev) => !prev);
    };

    const [Sku, setSku] = useState<Array<ISku>>([]);

    useEffect(() => {
        setSku([]);
        const combinedArray = [];
        for (let i = 0; i < optionsSize?.values.length; i++) {
            for (let j = 0; j < optionsColor?.values.length; j++) {
                combinedArray.push([optionsSize.values[i], optionsColor.values[j]]);
                setSku((prev) => [...prev, { optionValues: [optionsSize.values[i], optionsColor.values[j]] }]);
            }
        }
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

    const onSubmit: SubmitHandler<IProduct> = async (data) => {
        const object: IProduct = {
            name: data.name,
            description: description,
            price: data.price,
            quantity: data.quantity,
            category: data.category,
            options: [optionsSize, optionsColor],
            skus: Sku,
            listImages: [],
            id: 0,
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

    useEffect(() => {
        const handleGetListCate = async () => {
            const res = await getAllCategory();
            if (res.status === 200) {
                setListCate(res.data.content);
            }
        };

        handleGetListCate();
    }, []);

    return (
        <section className="space-y-5 mx-40">
            <SnackBarLoading open={loadingSubmit} content={'Đang cập nhật sản phẩm'} />
            <div>
                <Link
                    to={config.Routes.listProduct}
                    className="font-semibold decoration-primary-700 decoration-1 underline-offset-2 transition hover:underline hover:text-primary-700"
                >
                    <ArrowBackIcon fontSize="small" className='mr-2 mb-1' />
                    Quay lại
                </Link>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-5 bg-white p-4 rounded-lg">
                    <div className="font-semibold text-lg">Thông tin sản phẩm</div>
                    <div>
                        <TextField
                            label="Tên sản phẩm"
                            error={errors.name ? true : false}
                            fullWidth
                            {...register('name', { required: 'Tên sản phẩm hiện đang trống' })}
                        />
                        <p
                            className={`${errors.name ? 'block' : 'hidden'
                                } text-red-600 text-sm py-1  dark:text-red-500`}
                        >
                            {errors.name?.message}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        <div>
                            <FormControl fullWidth>
                                <InputLabel error={errors.category?.name ? true : false}>
                                    Chọn danh mục sản phẩm
                                </InputLabel>
                                <Select
                                    label="Chọn danh mục sản phẩm"
                                    error={errors.category?.name ? true : false}
                                    {...register('category.name', {
                                        required: 'Danh mục cha đang trống',
                                    })}
                                    defaultValue={''}
                                >
                                    {listCate.map((item, index) => (
                                        <MenuItem key={index} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <p
                                className={`${errors.category?.name ? 'block' : 'hidden'
                                    } text-red-600 text-sm py-1  dark:text-red-500`}
                            >
                                {errors.category?.name?.message}
                            </p>
                        </div>

                        <div>
                            <TextField
                                label="Số lượng"
                                error={errors.quantity ? true : false}
                                fullWidth
                                {...register('quantity', {
                                    required: 'Số lượng đang trống',
                                    min: {
                                        value: 1,
                                        message: 'Giá bán phải lớn hơn 1 VNĐ',
                                    },
                                })}
                            />
                            <p
                                className={`${errors.quantity ? 'block' : 'hidden'
                                    } text-red-600 text-sm py-1  dark:text-red-500`}
                            >
                                {errors.quantity?.message}
                            </p>
                        </div>

                        <div>
                            <TextField
                                label="Giá bán (VNĐ)"
                                error={errors.price ? true : false}
                                type="number"
                                fullWidth
                                {...register('price', {
                                    required: 'Số lượng đang trống',
                                    min: {
                                        value: 1,
                                        message: 'Giá bán phải lớn hơn 1 VNĐ',
                                    },
                                })}
                            />
                            <p
                                className={`${errors.price ? 'block' : 'hidden'
                                    } text-red-600 text-sm py-1  dark:text-red-500`}
                            >
                                {errors.price?.message}
                            </p>
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
                    <div className="font-semibold text-xl my-5">Thông tin biến thể</div>
                    <OptionSize handleSetOptionsSize={handleSetOptionsSize} />
                    <OptionColor handleSetOptionsColor={handleSetOptionsColor} />
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

                <div className="flex justify-center gap-5 py-10">
                    <Link to={config.Routes.listProduct}>
                        <Button className="w-30 text-black border border-gray-300">
                            Hủy bỏ
                        </Button>
                    </Link>
                    <Button className="w-40 text-white bg-[#493bc0]" type="submit">
                        Lưu sản phẩm
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddProduct;
