import InputText from '../../../components/InputText/InputText';
import Button from '@mui/material/Button';
import { ChangeEvent, useEffect, useState } from 'react';
import { IValue } from '../../../interface/productCart';
import { IOption } from '../../../interface/product';

interface Iprops {
    optionsColor: IOption;
    handleSetOptionsColor?: (title: string, arrayValue: Array<IValue>) => void;
}

const OptionColor = (props: Iprops) => {
    // prop
    const { optionsColor, handleSetOptionsColor } = props;

    const [nameTitle, setNameTitle] = useState<string>('');
    const [valueName, setValueName] = useState<Array<IValue>>([]);
    // get data
    useEffect(() => {
        setNameTitle(optionsColor.optionName);
        setValueName(optionsColor.values);
    }, [optionsColor]);
    // title
    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setNameTitle(e.target.value);
    };
    // list
    const handleAddValueName = () => {
        setValueName((prev) => [...prev, { valueName: '' }]);
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
                updatedArray[index] = { valueName: newValue };
            }
            return updatedArray;
        });
    };

    const handleSave = () => {
        handleSetOptionsColor && handleSetOptionsColor(nameTitle, valueName);
    };

    return (
        <div className="mt-5 bg-gray-100 p-4 rounded">
            <InputText labelInput="Tên biến thể" value={nameTitle} onChange={handleChangeName} />
            <div className="py-2 font-semibold">Tùy chọn</div>
            {valueName.map((_, index) => (
                <div className="flex justify-center items-center pb-2" key={index}>
                    <InputText
                        labelInput="Tên tùy chọn "
                        value={valueName[index]?.valueName || ''} // Display the value from the array if it exists
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeValueName(index, e)}
                        sx={{ pb: 1 }}
                    />

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

export default OptionColor;