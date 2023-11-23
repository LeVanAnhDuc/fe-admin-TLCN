import InputText from '../../../components/InputText/InputText';
import Button from '@mui/material/Button';
import { ChangeEvent, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { IValue } from '../../../interface/productCart';
import { IOption } from '../../../interface/product';
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
    handleSetOptionsSize?: (title: string, arrayValue: Array<IValue>) => void;
    optionsSize: IOption;
}

const OptionSize = (props: Iprops) => {
    // prop
    const { handleSetOptionsSize, optionsSize } = props;

    const [nameTitle, setNameTitle] = useState<string>('');
    const [valueName, setValueName] = useState<Array<IValue>>([]);

    // get data
    useEffect(() => {
        setNameTitle(optionsSize.optionName);
        setValueName(optionsSize.values);
    }, [optionsSize]);
    // title
    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setNameTitle(e.target.value);
    };
    // list
    const handleAddValueName = () => {
        setValueName((prev) => [...prev, { valueName: '', imageUrl: '' }]);
    };
    const handleDeleteValueName = (index: number) => {
        setValueName((prev) => {
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
        }

        // call api update anh
        //
        //
        //
    };

    const handleSave = () => {
        handleSetOptionsSize && handleSetOptionsSize(nameTitle, valueName);
    };

    return (
        <div className="mt-5 bg-gray-100 p-4 rounded">
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
                        <img src={item.imageUrl} className="w-10 h-14 " />
                    </Button>

                    <Button onClick={() => handleDeleteValueName(index)}>Xóa </Button>
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

export default OptionSize;
