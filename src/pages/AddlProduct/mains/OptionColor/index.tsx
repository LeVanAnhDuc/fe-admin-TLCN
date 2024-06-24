// libs
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import Add from '@mui/icons-material/Add';
import { ChangeEvent, useEffect, useState } from 'react';
// types
import { IValue, IValueColorCreate } from '@/types/product';
// components
import SnackBarLoading from '@/components/SnackBarLoading';
import PopConfirm from '@/components/PopConfirm';
import Button from '@/components/Button';
// apis
import { uploadImage } from '@/apis/uploadImageApi';
// others
import config from '@/config';

const OptionColor = ({
    handleSetOptionsColor,
}: {
    handleSetOptionsColor: (optionName: string, values: Array<IValue>) => void;
}) => {
    const [loadingUpdateImage, setLoadingUpdateImage] = useState<boolean>(false);
    const [valueOptionColor, setValueOptionColor] = useState<Array<IValueColorCreate>>([]);
    const [postActionUploadImage, setPostActionUploadImage] = useState<boolean>(false);

    const handleAddValueName = () => {
        setValueOptionColor((prev) => [...prev, { valueName: '', imageFile: undefined, imageString: '' }]);
    };

    const handleDeleteValueName = (index: number) => {
        setValueOptionColor((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChangeValueName = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValueOptionColor((prev) => {
            const updatedArray = [...prev];
            updatedArray[index]
                ? (updatedArray[index].valueName = newValue)
                : (updatedArray[index] = { valueName: newValue, imageString: '', imageFile: undefined });

            return updatedArray;
        });
    };

    const handleImageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setValueOptionColor((prev) => {
                const updatedArray = [...prev];
                const imageURL = URL.createObjectURL(file);

                updatedArray[index]
                    ? ((updatedArray[index].imageString = imageURL), (updatedArray[index].imageFile = file))
                    : (updatedArray[index] = { valueName: '', imageString: imageURL, imageFile: file });

                return updatedArray;
            });
        }
    };

    const handleSave = async () => {
        const filteredValues = valueOptionColor.filter((item) => item.imageFile !== undefined);
        const uploadPromises = filteredValues.map(async (item, index) => {
            if (!item.imageFile) {
                return;
            }

            const formData = new FormData();
            formData.append('image', item.imageFile);

            try {
                setLoadingUpdateImage(true);
                const response = await uploadImage(formData);

                if (response.status === 200) {
                    setValueOptionColor((prev) => {
                        const updatedArray = [...prev];
                        if (updatedArray[index]) {
                            updatedArray[index].imageString = response.data;
                        } else {
                            updatedArray[index] = { valueName: '', imageString: response.data };
                        }
                        return updatedArray;
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingUpdateImage(false);
            }
        });
        await Promise.all(uploadPromises);
        setPostActionUploadImage((prev) => !prev);
    };
    useEffect(() => {
        handleSetOptionsColor(
            config.TypeOption.Color,
            valueOptionColor.map((item) => ({
                valueName: item.valueName,
                imageUrl: item.imageString,
            })),
        );
    }, [postActionUploadImage]);

    return (
        <div className="border-2 px-5 py-6 rounded-md shadow space-y-5">
            <SnackBarLoading open={loadingUpdateImage} content={'Đang cập nhật tùy chọn'} />
            <div className="font-semibold">Tên biến thể</div>
            <TextField
                label="Tên biến thể"
                fullWidth
                value={config.TypeOption.Color}
                inputProps={{ readOnly: true }}
                variant="filled"
            />
            <div className="font-semibold">Tùy chọn</div>
            <div className="grid lg:grid-cols-2 items-center  gap-5">
                {valueOptionColor.map((item, index) => (
                    <div className="flex items-center gap-2" key={index}>
                        <label
                            htmlFor={`dropzone-file-${index}`}
                            className="group size-fit rounded-lg relative overflow-hidden flex justify-center items-center  cursor-pointer"
                        >
                            <input
                                id={`dropzone-file-${index}`}
                                className="absolute bottom-0 left-0 hidden size-1"
                                type="file"
                                onChange={(e) => handleImageChange(index, e)}
                            />
                            {item.imageString ? (
                                <img
                                    src={
                                        typeof item.imageString === 'object'
                                            ? URL.createObjectURL(item.imageString)
                                            : item.imageString
                                    }
                                    alt="Hình"
                                    className="h-14 w-24 object-cover object-center"
                                />
                            ) : (
                                <div className="text-sm font-medium truncate h-14 w-24 border-[1px] flex justify-center items-center rounded-lg">
                                    Thêm hình
                                </div>
                            )}
                            <div className="absolute bottom-0 size-full backdrop-blur-sm bg-white/10 transition hidden group-hover:block"></div>
                            <div className="absolute bottom-0 transition duration-300 translate-y-full group-hover:-translate-y-1/3">
                                <span className="text-primary-500 text-3xl font-bold select-none">+</span>
                            </div>
                        </label>
                        <TextField
                            label={`Tên tùy chọn ${index + 1}`}
                            fullWidth
                            value={valueOptionColor[index]?.valueName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeValueName(index, e)}
                        />
                        <PopConfirm
                            content="Nếu xóa dữ liệu sẽ mất đi và không thể hoàn lại"
                            title={`Xóa ${config.TypeOption.Color}`}
                            onConfirm={() => handleDeleteValueName(index)}
                        >
                            <IconButton>
                                <DeleteTwoTone className="text-red-500" />
                            </IconButton>
                        </PopConfirm>
                    </div>
                ))}
                <Button onClick={handleAddValueName} variant="outline" className="size-12 !rounded-full">
                    <Add />
                </Button>
            </div>
            <div className="flex justify-center">
                <Button variant="fill" size="small" onClick={handleSave}>
                    Lưu tùy chọn
                </Button>
            </div>
        </div>
    );
};

export default OptionColor;
