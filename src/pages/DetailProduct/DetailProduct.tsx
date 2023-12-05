import { useForm, SubmitHandler } from 'react-hook-form';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
import OptionColor from './OptionColor/OptionColor';
import OptionSize from './OptionSize/OptionSize';
import { ISku } from '../../interface/productCart';
import ICategory from '../../interface/category';
import { getAllCategory } from '../../apis/categoryApii';
import { getSingleProduct, updateProduct } from '../../apis/productApi';
import { toast } from 'react-toastify';
import { uploadProductImages } from '../../apis/uploadImageApi';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';

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

const DetailProduct = () => {
    const navigate = useNavigate();
    // handle get id
    const location = useLocation();
    const idProduct = location.hash.substring(1);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IProduct>({});

    // get list cate
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

    // handle biến thể
    const [isLoading, setLoading] = useState<boolean>(false);
    const [optionsSize, setOptionsSize] = useState<IOption>({ optionId: 0, optionName: '', values: [] });
    const [optionsColor, setOptionsColor] = useState<IOption>({ optionId: 0, optionName: '', values: [] });

    const handleSetOptionsSize = (optionName: string, values: Array<IValue>) => {
        setOptionsSize({ optionName, values });
        setLoading((prev) => !prev);
    };
    const handleSetOptionsColor = (optionName: string, values: Array<IValue>) => {
        setOptionsColor({ optionName, values });
        setLoading((prev) => !prev);
    };

    // auto create sku by biến thể
    const [SkuNoneUpdate, setSkuNoneUpdate] = useState<Array<ISku>>([]);
    const [Sku, setSku] = useState<Array<ISku>>([]);
    useEffect(() => {
        setSku([]);
        const combinedArray = [];
        for (let i = 0; i < optionsSize?.values.length; i++) {
            for (let j = 0; j < optionsColor?.values.length; j++) {
                combinedArray.push([optionsSize.values[i], optionsColor.values[j]]);
                setSku((prev) => [
                    ...prev,
                    { optionValues: [optionsColor.values[j], optionsSize.values[i]], price: 0 },
                ]);
            }
        }
        setLoadingSetSku((prev) => !prev);
    }, [isLoading]);

    const [isLoadingSetSku, setLoadingSetSku] = useState<boolean>(false);
    useEffect(() => {
        const updatedSku = Sku.map((sku) => {
            const matchingSkuNoneUpdate = SkuNoneUpdate.find((skuNoneUpdate) => {
                return JSON.stringify(skuNoneUpdate.optionValues) === JSON.stringify(sku.optionValues);
            });

            if (matchingSkuNoneUpdate) {
                return { ...sku, price: matchingSkuNoneUpdate.price };
            }

            return sku;
        });
        setSku(updatedSku);
    }, [isLoadingSetSku]);

    // handle change price in sku
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
    // cate current
    const [cateCurrent, setCateCurrent] = useState<string>('');

    // handle get data
    const getProduct = async (id: number) => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                // tồn tai ma san pham và phải là số
                const response = await getSingleProduct(id);

                if (response.status === 200) {
                    await setCateCurrent(response.data.categoryName);

                    await setValue('category', response.data.category);
                    await setValue('name', response.data.name);
                    await setValue('quantity', response.data.quantity);
                    await setValue('price', response.data.price);
                    await setValue('promotionalPrice', response.data.promotionalPrice);

                    await setValue('sold', response.data.sold);
                    await setValue('quantityAvailable', response.data.quantityAvailable);

                    await setValue('createdBy', response.data.createdBy);
                    await setValue('createdDate', response.data.createdDate);
                    await setValue('lastModifiedBy', response.data.lastModifiedBy);
                    await setValue('lastModifiedDate', response.data.lastModifiedDate);

                    await setValue('description', response.data.description);

                    setDisplayedImages(response.data.listImages);
                    setListImageCurrent(response.data.listImages);

                    await setOptionsSize(
                        response.data.options.filter((item: IOption) => item.optionName === 'Size')[0],
                    );
                    await setOptionsColor(
                        response.data.options.filter((item: IOption) => item.optionName === 'Màu')[0],
                    );

                    setSku(response.data.skus);
                    setSkuNoneUpdate(response.data.skus);
                } else {
                    toast.error(response.data.message);
                    navigate(config.Routes.listProduct);
                }
            } else {
                navigate(config.Routes.listProduct);
            }
        } catch {
            toast.error('Đang bảo trì');
        }
    };
    useEffect(() => {
        getProduct(+idProduct);
    }, [idProduct]);
    // submit form
    const onSubmit: SubmitHandler<IProduct> = async (data) => {
        if (data.quantity < 0) {
            toast.error('Số lượng sản phẩm không được nhỏ hơn 1');
            return;
        }
        if (data.price < 0) {
            toast.error('Số tiền không được nhỏ hơn 1');
            return;
        }
        const object: IProduct = {
            name: data.name,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            listImages: listImageCurrent,
            category: {
                name: cateCurrent,
            },
            options: [optionsSize, optionsColor],
            skus: Sku,
            // no value
            id: 0,
        };

        setIsLoadingDialog(true);
        const response = await updateProduct(+idProduct, object);

        setIsLoadingDialog(false);
        if (response.status === 200) {
            handleUpload(response.data.id);
            toast.success('Sửa thành công');
        } else {
            toast.error(response.data.message || response.data);
        }
    };

    // handle change image list product
    const [listImageCurrent, setListImageCurrent] = useState<Array<string>>([]);
    const [selectedImages, setSelectedImages] = useState<FileList | null>();
    const [displayedImages, setDisplayedImages] = useState<string[]>([]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImages(e.target.files);

            const imageUrls = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
            // setDisplayedImages((prev) => [...prev, ...imageUrls]);
            setDisplayedImages(imageUrls);
        }
    };
    useEffect(() => {
        selectedImages;
    }, []);
    const handleUpload = async (idProduct: number) => {
        if (!selectedImages || selectedImages.length === 0) {
            return;
        }

        try {
            const formData = new FormData();

            for (let i = 0; i < selectedImages.length; i++) {
                formData.append('images', selectedImages[i]);
            }

            // Đặt đường dẫn API lưu danh sách ảnh của bạn
            setIsLoadingDialog(true);
            const response = await uploadProductImages(+idProduct, formData);
            setIsLoadingDialog(false);

            if (response.status === 200) {
                toast.success('Cập nhật ảnh thành công');
            } else {
                toast.error(response.data.message || response.data);
            }
            setSelectedImages(null);
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    const [isLoadingDialog, setIsLoadingDialog] = useState(false);

    return (
        <>
            <Dialog onClose={() => setIsLoadingDialog(false)} open={isLoadingDialog} fullWidth maxWidth="sm">
                <DialogTitle>Xác thực </DialogTitle>
                <DialogContent>
                    <LinearProgress color="success" />
                </DialogContent>
            </Dialog>
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
                            <InputLabel required>Chọn danh mục sản phẩm</InputLabel>
                            <Select
                                label="Chọn danh mục sản phẩm"
                                value={cateCurrent}
                                onChange={(e) => {
                                    setCateCurrent(e.target.value);
                                }}
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
                            labelInput="Giá bán VNĐ"
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
                    {/* start input quantityAvailable and promotionalPrice */}
                    <div className="grid grid-cols-2 gap-5">
                        <InputText
                            labelInput="Số lượng có sẵn"
                            register={{
                                ...register('quantityAvailable'),
                            }}
                            readOnly
                        />

                        <InputText
                            labelInput="Giá khuyến mại VNĐ"
                            register={{
                                ...register('promotionalPrice'),
                            }}
                            readOnly
                        />
                    </div>
                    {/* end input quantityAvailable and promotionalPrice*/}
                    {/* start input createdDate and lastModifiedDate */}
                    <div className="grid grid-cols-2 gap-5">
                        <InputText
                            labelInput="Ngày tạo"
                            register={{
                                ...register('createdDate'),
                            }}
                            readOnly
                        />

                        <InputText
                            labelInput="Ngày chỉnh sửa cuối"
                            register={{
                                ...register('lastModifiedDate'),
                            }}
                            readOnly
                        />
                    </div>
                    {/* end input createdDate and lastModifiedDate*/}
                    <div className="mb-5 font-semibold text-xl">Danh sách ảnh</div>
                    {/* start list image */}
                    <div className="relative">
                        <div className="flex flex-wrap gap-3 h-full pb-3">
                            {displayedImages.map((imageUrl, index) => (
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
                    <OptionSize handleSetOptionsSize={handleSetOptionsSize} optionsSize={optionsSize} />
                    <OptionColor handleSetOptionsColor={handleSetOptionsColor} optionsColor={optionsColor} />
                    {/* end bien the */}

                    {/* start table */}
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer>
                            <Table stickyHeader aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">Stt</StyledTableCell>
                                        <StyledTableCell align="center">Kích thước</StyledTableCell>
                                        <StyledTableCell align="center">Màu</StyledTableCell>
                                        <StyledTableCell align="center">Giá (VNĐ)</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Sku.map((item, index) => (
                                        <StyledTableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <StyledTableCell align="center" component="th" scope="row">
                                                {index}
                                            </StyledTableCell>
                                            {item.optionValues.map((item2, index2) => (
                                                <StyledTableCell key={index2} align="center">
                                                    {item2.valueName}
                                                </StyledTableCell>
                                            ))}
                                            <StyledTableCell align="center">
                                                <input
                                                    className="bg-stone-200 w-32 text-center"
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

export default DetailProduct;
