import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import Add from '@mui/icons-material/Add';

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { IValue } from '../../interface/productCart';
import { IOption } from '../../interface/product';
import { uploadImage } from '../../apis/uploadImageApi';
import SnackBarLoading from '../../components/SnackBarLoading';
import Button from '../../components/Button';
import PopConfirm from '../../components/PopConfirm';
import MouseOverPopover from '../../components/MouseOverPopover/MouseOverPopover';

interface Iprops {
    handleSetOptionsColor?: (title: string, arrayValue: Array<IValue>) => void;
    optionsColor: IOption;
}

const OptionColor = (props: Iprops) => {
    const { handleSetOptionsColor, optionsColor } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const [loadingUpdateImage, setLoadingUpdateImage] = useState(false);
    const [nameTitle, setNameTitle] = useState<string>('');
    const [valueName, setValueName] = useState<Array<IValue>>([]);
    const [uploadedImages, setUploadedImages] = useState<Array<IValue>>([]);

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setNameTitle(e.target.value);
    };

    const handleAddValueName = () => {
        setValueName((prev) => [...prev, { valueName: '', imageUrl: '' }]);
        setUploadedImages((prev) => [...prev, { valueName: '', imageUrl: '' }]);
    };

    const handleDeleteValueName = (index: number) => {
        setValueName((prev) => prev.filter((_, i) => i !== index));
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChangeValueName = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValueName((prev) => {
            const updatedArray = [...prev];
            if (updatedArray[index]) {
                updatedArray[index].valueName = newValue;
            } else {
                updatedArray[index] = { valueName: newValue, imageUrl: '' };
            }
            return updatedArray;
        });
        setUploadedImages((prev) => {
            const updatedArray = [...prev];
            if (updatedArray[index]) {
                updatedArray[index].valueName = newValue;
            } else {
                updatedArray[index] = { valueName: newValue, imageUrl: '' };
            }
            return updatedArray;
        });
    };

    const handleImageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setValueName((prev) => {
                const updatedArray = [...prev];
                const imageURL = URL.createObjectURL(file);

                if (updatedArray[index]) {
                    updatedArray[index].imageUrl = imageURL;
                } else {
                    updatedArray[index] = { valueName: '', imageUrl: imageURL };
                }
                return updatedArray;
            });
            setUploadedImages((prev) => {
                const updatedArray = [...prev];
                if (updatedArray[index]) {
                    updatedArray[index].imageUrl = file;
                } else {
                    updatedArray[index] = { valueName: '', imageUrl: file };
                }
                return updatedArray;
            });
        }
    };

    const handleSave = () => {
        const filteredValues = uploadedImages.filter((item) => item.imageUrl !== '');
        filteredValues.forEach(async (item, index) => {
            try {
                if (!item.imageUrl || (typeof item.imageUrl === 'string' && !item.imageUrl.startsWith('blob:'))) {
                    return;
                }
                const formData = new FormData();
                formData.append('image', item.imageUrl);

                setLoadingUpdateImage(true);
                const response = await uploadImage(formData);
                setLoadingUpdateImage(false);

                setUploadedImages((prev) => {
                    const updatedArray = [...prev];
                    if (updatedArray[index]) {
                        updatedArray[index].imageUrl = response.data;
                    } else {
                        updatedArray[index] = { valueName: '', imageUrl: response.data };
                    }
                    return updatedArray;
                });
            } catch (error) {
                console.error(error);
            }
        });
        handleSetOptionsColor && handleSetOptionsColor(nameTitle, valueName);
    };

    useEffect(() => {
        setNameTitle(optionsColor.optionName);
        setValueName(optionsColor.values);
        setUploadedImages(optionsColor.values);
    }, [optionsColor]);

    return (
        <div className="border-2 px-5 py-6 rounded-md shadow space-y-5">
            <SnackBarLoading open={loadingUpdateImage} content={'Đang cập nhật tùy chọn'} />
            <div className="font-semibold">Tên biến thể</div>
            <TextField
                label="Tên biến thể"
                fullWidth
                value={nameTitle}
                onChange={handleChangeName}
                inputProps={{ readOnly: true }}
                variant="filled"
            />
            <div className="font-semibold pt-4">Tùy chọn</div>
            <div className="grid lg:grid-cols-2 items-center  gap-5">
                {valueName.map((item, index) => (
                    <div className="flex items-center gap-2" key={index}>
                        <div className="group size-fit rounded-lg relative overflow-hidden flex justify-center items-center  cursor-pointer">
                            <input
                                ref={inputRef}
                                className="absolute bottom-0 left-0 hidden size-full"
                                type="file"
                                onChange={(e) => handleImageChange(index, e)}
                            />
                            <img
                                src={
                                    typeof item.imageUrl === 'object'
                                        ? URL.createObjectURL(item.imageUrl)
                                        : item.imageUrl
                                }
                                alt="hình chưa có"
                                className="h-16 w-24 object-cover object-center"
                            />
                            <div
                                className="absolute bottom-0 size-full backdrop-blur-sm bg-white/10 transition hidden group-hover:block"
                                onClick={() => inputRef.current && inputRef.current.click()}
                            ></div>
                            <div
                                className="absolute bottom-0 transition duration-300 translate-y-full group-hover:-translate-y-1/3"
                                onClick={() => inputRef.current && inputRef.current.click()}
                            >
                                <span className="text-primary-500 text-3xl font-bold select-none">+</span>
                            </div>
                        </div>

                        <TextField
                            label={`Tên tùy chọn ${index + 1}`}
                            fullWidth
                            value={valueName[index]?.valueName || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeValueName(index, e)}
                        />

                        <PopConfirm
                            content="Nếu xóa dữ liệu sẽ mất đi và không thể hoàn lại"
                            title={`Xóa ${nameTitle}`}
                            onConfirm={() => handleDeleteValueName(index)}
                        >
                            <MouseOverPopover content={`Xóa tùy chọn ${index + 1}`}>
                                <IconButton>
                                    <DeleteTwoTone className="text-red-500 " />
                                </IconButton>
                            </MouseOverPopover>
                        </PopConfirm>
                    </div>
                ))}
                <div className="flex m-auto">
                    <Button onClick={handleAddValueName} variant="outline" className="size-12 !rounded-full">
                        <Add />
                    </Button>
                </div>
            </div>
            <div className="flex justify-center">
                <Button onClick={handleSave} className="w-32 text-sm h-9 text-white bg-[#493bc0]">
                    Lưu tùy chọn
                </Button>
            </div>
        </div>
    );
};

export default OptionColor;
