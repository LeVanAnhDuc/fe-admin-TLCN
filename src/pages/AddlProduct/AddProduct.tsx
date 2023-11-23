import { useForm, SubmitHandler } from 'react-hook-form';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import IProduct, { IOption, IValue } from '../../interface/product';
import InputText from '../../components/InputText/InputText';
import Image from '../../components/Image';
import config from '../../config';
import OptionSize from './OptionSize/OptionSize';
import OptionColor from './OptionColor/OptionColor';
import { ISku } from '../../interface/productCart';
import ICategory from '../../interface/category';
import { getAllCategory } from '../../apis/categoryApii';
import { createNewProduct } from '../../apis/productApi';
import { toast } from 'react-toastify';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#B3A492',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: 6,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

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

const AddProduct = () => {
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
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IProduct>({});

    // handle change image list product
    const [selectedImage, setSelectedImage] = useState<string[]>([]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const images = Array.from(files).map((file) => URL.createObjectURL(file));
            setSelectedImage(images);
            setValue('listImages', images);
        }

        // call api update anh
        //
        //
        //
    };
    // handle biến thể
    const [isLoading, setLoading] = useState<boolean>(false);
    const [optionsSize, setOptionsSize] = useState<IOption>({ optionName: '', values: [] });
    const [optionsColor, setOptionsColor] = useState<IOption>({ optionName: '', values: [] });

    const handleSetOptionsSize = (optionName: string, values: Array<IValue>) => {
        setOptionsSize({ optionName, values });
        setLoading((prev) => !prev);
    };
    const handleSetOptionsColor = (optionName: string, values: Array<IValue>) => {
        setOptionsColor({ optionName, values });
        setLoading((prev) => !prev);
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
    }, [isLoading]);

    const handleChangePrice = (id: number, e: ChangeEvent<HTMLInputElement>) => {
        setSku((prev) => {
            const newArray = prev.map((item, index) => {
                if (index === id) {
                    // Tạo một đối tượng mới để tránh thay đổi trực tiếp trên state
                    return { ...item, price: +e.target.value };
                }
                return item;
            });
            return newArray;
        });
    };
    // submit form
    const onSubmit: SubmitHandler<IProduct> = async (data) => {
        const object: IProduct = {
            name: data.name,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            listImages: selectedImage,
            category: data.category,
            options: [optionsSize, optionsColor],
            skus: Sku,
            // not value
            id: '',
            quantityAvailable: 0,
            slug: '',
            promotionalPrice: '',
            sold: 0,
            rating: 0,
            numberOfRatings: 0,
            favoriteCount: 0,
            isActive: false,
            isSelling: false,
            createdDate: '',
            lastModifiedDate: '',
            createdBy: '',
            lastModifiedBy: '',
        };

        const response = await createNewProduct(object);
        if (response.status === 201) {
            toast.success('Tạo thành công');
        } else {
            toast.error(response.data.message || response.data);
        }
    };
    return (
        <>
            <div className="flex justify-between pb-3">
                <div className="text-lg font-semibold flex items-center ">Thông tin sản phẩm</div>
                <Link to={config.Routes.listProduct}>
                    <Button variant="outlined">
                        <KeyboardArrowLeft />
                    </Button>
                </Link>
            </div>
            {/* start section 1 */}
            <div className="my-10 ">
                {/* start product setting */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-5 font-semibold text-xl">Mã sản phẩm : </div>
                    {/* start input id and Name */}
                    <div className="grid grid-cols-2 gap-5">
                        <FormControl fullWidth>
                            <InputLabel required>CategoryName</InputLabel>
                            <Select
                                label="CategoryName"
                                {...register('category.name', {
                                    required: 'categoryName is required',
                                })}
                                required
                                defaultValue={''}
                            >
                                {listCate.map((item, index) => (
                                    <MenuItem key={index} value={item.name}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <InputText
                            labelInput="Tên sản phẩm"
                            errorInput={errors.name ? true : false}
                            isRequired
                            register={{
                                ...register('name', {
                                    required: 'Name is required',
                                }),
                            }}
                        />
                    </div>
                    {/* end input id and  Name*/}
                    {/* start input quantity and price */}
                    <div className="grid grid-cols-2 gap-5">
                        <InputText
                            labelInput="Số lượng"
                            typeInput="number"
                            errorInput={errors.quantity ? true : false}
                            isRequired
                            register={{
                                ...register('quantity', {
                                    required: 'quantity is required',
                                }),
                            }}
                        />
                        <InputText
                            labelInput="Giá bán"
                            typeInput="number"
                            errorInput={errors.price ? true : false}
                            isRequired
                            register={{
                                ...register('price', {
                                    required: 'price is required',
                                }),
                            }}
                        />
                    </div>
                    {/* end input quantity and price*/}

                    <div className="mb-5 font-semibold text-xl">Danh sách ảnh</div>
                    {/* start list image */}
                    <div className="relative">
                        <div className="flex flex-wrap gap-3 h-full pb-3">
                            {selectedImage.map((imageUrl, index) => (
                                <React.Fragment key={index}>
                                    <input type="hidden" value={imageUrl} />
                                    <Image src={imageUrl} alt={`Image ${index}`} className="w-20 h-20 " />
                                </React.Fragment>
                            ))}
                        </div>

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
                            <VisuallyHiddenInput type="file" multiple onChange={handleImageChange} />
                        </Button>
                    </div>
                    {/* end list image */}
                    <div className="mb-5 font-semibold text-xl">Mô tả sản phẩm</div>
                    <TextareaAutosize
                        minRows={9}
                        style={{ border: '1px solid #000', width: '100%', padding: '8px 12px' }}
                        {...register(`description`, {
                            required: 'description is required',
                        })}
                    />
                    {/* start bien the */}
                    <div className="font-semibold text-xl my-5">Thông tin biến thể</div>
                    <OptionSize type={config.TypeOption.Size} handleSetOptionsSize={handleSetOptionsSize} />
                    <OptionColor type={config.TypeOption.Color} handleSetOptionsColor={handleSetOptionsColor} />
                    {/* end bien the */}

                    {/* start table */}
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer>
                            <Table stickyHeader aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>ID</StyledTableCell>
                                        <StyledTableCell align="center">Size</StyledTableCell>
                                        <StyledTableCell align="center">Color</StyledTableCell>
                                        <StyledTableCell align="center">Price</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Sku.map((item, index) => (
                                        <StyledTableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <StyledTableCell component="th" scope="row">
                                                {index}
                                            </StyledTableCell>
                                            {item.optionValues.map((item2, index2) => (
                                                <StyledTableCell key={index2} align="center">
                                                    {item2.valueName}
                                                </StyledTableCell>
                                            ))}
                                            <StyledTableCell align="center">
                                                <input
                                                    className="bg-stone-300 w-20 text-center"
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => handleChangePrice(index, e)}
                                                />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    {/* end table */}

                    <Button fullWidth type="submit" variant="contained" color="primary" size="large">
                        Lưu
                    </Button>
                </form>
                {/* end product setting */}
            </div>
            {/* end section 1 */}
        </>
    );
};

export default AddProduct;