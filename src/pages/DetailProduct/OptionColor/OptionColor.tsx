import InputText from '../../../components/InputText/InputText';
import Button from '@mui/material/Button';
import { ChangeEvent, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { IValue } from '../../../interface/productCart';
import { IOption } from '../../../interface/product';
import { uploadImage } from '../../../apis/uploadImageApi';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import DialogContent from '@mui/material/DialogContent';
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
interface Iprops {
    handleSetOptionsColor?: (title: string, arrayValue: Array<IValue>) => void;
    optionsColor: IOption;
}

const OptionColor = (props: Iprops) => {
    // prop
    const { handleSetOptionsColor, optionsColor } = props;
    const [isLoading, setIsLoading] = useState(false);

    const [nameTitle, setNameTitle] = useState<string>('');
    // hiện thị ra màn hình
    const [valueName, setValueName] = useState<Array<IValue>>([]);
    // dùng để lấy dữ liệu call api
    const [uploadedImages, setUploadedImages] = useState<Array<IValue>>([]);

    // get data
    useEffect(() => {
        setNameTitle(optionsColor.optionName);
        setValueName(optionsColor.values);
        setUploadedImages(optionsColor.values);
    }, [optionsColor]);
    // title
    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setNameTitle(e.target.value);
    };
    // list
    const handleAddValueName = () => {
        setValueName((prev) => [...prev, { valueName: '', imageUrl: '' }]);
        setUploadedImages((prev) => [...prev, { valueName: '', imageUrl: '' }]);
    };
    const handleDeleteValueName = (index: number) => {
        setValueName((prev) => {
            const updatedArray = prev.filter((_, i) => i !== index);
            return updatedArray;
        });
        setUploadedImages((prev) => {
            const updatedArray = prev.filter((_, i) => i !== index);
            return updatedArray;
        });
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
        const file = e.target.files && e.target.files[0];

        if (file) {
            setValueName((prev) => {
                const updatedArray = [...prev];
                const imageURL = URL.createObjectURL(file);

                if (updatedArray[index]) {
                    // Assuming only one file is accepted
                    updatedArray[index].imageUrl = imageURL;
                } else {
                    // If the item doesn't exist in the array, create a new one
                    updatedArray[index] = { valueName: '', imageUrl: imageURL };
                }
                return updatedArray;
            });
            setUploadedImages((prev) => {
                const updatedArray = [...prev];
                if (updatedArray[index]) {
                    // Assuming only one file is accepted
                    updatedArray[index].imageUrl = file;
                } else {
                    // If the item doesn't exist in the array, create a new one
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
                setIsLoading(true);

                const response = await uploadImage(formData);
                setIsLoading(false);

                // Thêm URL ảnh đã tải lên vào state uploadedImages
                setUploadedImages((prev) => {
                    const updatedArray = [...prev];
                    if (updatedArray[index]) {
                        // Assuming only one file is accepted
                        updatedArray[index].imageUrl = response.data;
                    } else {
                        // If the item doesn't exist in the array, create a new one
                        updatedArray[index] = { valueName: '', imageUrl: response.data };
                    }
                    return updatedArray;
                });
            } catch (error) {
                console.error('Upload failed:', error);
            }
        });
        handleSetOptionsColor && handleSetOptionsColor(nameTitle, valueName);
    };

    return (
        <div className="mt-5 bg-gray-100 p-4 rounded">
            <Dialog onClose={() => setIsLoading(false)} open={isLoading} fullWidth maxWidth="sm">
                <DialogTitle>Đang lưu tùy chọn</DialogTitle>
                <DialogContent>
                    <LinearProgress color="success" />
                </DialogContent>
            </Dialog>
            <InputText labelInput="Tên biến thể" value={nameTitle} onChange={handleChangeName} />
            <div className="py-2 font-semibold">Tùy chọn</div>
            {valueName.map((item, index) => (
                <div className="flex justify-center items-center pb-2" key={index}>
                    <InputText
                        labelInput="Tên tùy chọn "
                        value={valueName[index]?.valueName || ''} // Display the value from the array if it exists
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeValueName(index, e)}
                    />

                    <Button component="label" variant="text" fullWidth sx={{ width: '56px' }}>
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleImageChange(index, e)}
                        />
                        <img src={typeof item.imageUrl === 'string' ? item.imageUrl : ''} className="w-10 h-14 " />
                    </Button>

                    <Button onClick={() => handleDeleteValueName(index)} sx={{ color: 'red' }}>
                        Xóa{' '}
                    </Button>
                </div>
            ))}
            <div className="flex justify-between">
                <Button onClick={handleAddValueName} variant="outlined">
                    Thêm tùy chọn
                </Button>
                <Button onClick={handleSave} variant="contained">
                    Lưu
                </Button>
            </div>
        </div>
    );
};

export default OptionColor;
