import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Add from '@mui/icons-material/Add';

import { ChangeEvent, useEffect, useState } from 'react';

import { IValue } from '../../interface/productCart';
import { IOption } from '../../interface/product';
import Button from '../../components/Button';
import PopConfirm from '../../components/PopComfirm';
import MouseOverPopover from '../../components/MouseOverPopover/MouseOverPopover';

interface Iprops {
    optionsSize: IOption;
    handleSetOptionsSize?: (title: string, arrayValue: Array<IValue>) => void;
}

const OptionColor = (props: Iprops) => {
    const { optionsSize, handleSetOptionsSize } = props;

    const [nameTitle, setNameTitle] = useState<string>('');
    const [valueName, setValueName] = useState<Array<IValue>>([]);

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setNameTitle(e.target.value);
    };

    const handleAddValueName = () => {
        setValueName((prev) => [...prev, { valueName: '' }]);
    };

    const handleDeleteValueName = (index: number) => {
        setValueName((prev) => prev.filter((_, i) => i !== index));
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
        handleSetOptionsSize && handleSetOptionsSize(nameTitle, valueName);
    };

    useEffect(() => {
        setNameTitle(optionsSize.optionName);
        setValueName(optionsSize.values);
    }, [optionsSize]);

    return (
        <div className="border-2 px-5 py-6 rounded-md shadow space-y-5">
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
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {valueName.map((_, index) => (
                    <div className="flex items-center gap-2" key={index}>
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
                <Button onClick={handleSave} className="w-32 text-sm h-9 text-white bg-[#4a39e6]">
                    Lưu tùy chọn
                </Button>
            </div>
        </div>
    );
};

export default OptionColor;
