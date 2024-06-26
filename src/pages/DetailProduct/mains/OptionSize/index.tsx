// libs
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Add from '@mui/icons-material/Add';
import { ChangeEvent, useEffect, useState } from 'react';
// types
import { IValue } from '@/types/productCart';
import { IOption } from '@/types/product';
// components
import Button from '@/components/Button';
import PopConfirm from '@/components/PopConfirm';
// others
import config from '@/config';

interface Iprops {
    optionsSize: IOption;
    handleSetOptionsSize?: (optionName: string, values: Array<IValue>) => void;
}

const OptionSize = (props: Iprops) => {
    const { optionsSize, handleSetOptionsSize } = props;

    const [valueOptionSize, setOptionSize] = useState<Array<IValue>>([]);

    const handleAddValueName = () => {
        setOptionSize((prev) => [...prev, { valueName: '' }]);
    };

    const handleDeleteValueName = (index: number) => {
        setOptionSize((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChangeValueName = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        setOptionSize((prev) => {
            const updatedArray = [...prev];

            updatedArray[index]
                ? (updatedArray[index].valueName = newValue)
                : (updatedArray[index] = { valueName: newValue });

            return updatedArray;
        });
    };

    const handleSave = () => {
        handleSetOptionsSize && handleSetOptionsSize(config.TypeOption.Size, valueOptionSize);
    };

    useEffect(() => {
        setOptionSize(optionsSize.values);
    }, [optionsSize]);

    return (
        <div className="border-2 px-5 py-6 rounded-md shadow space-y-5">
            <div className="font-semibold">Tên biến thể</div>
            <TextField
                label="Tên biến thể"
                fullWidth
                value={config.TypeOption.Size}
                inputProps={{ readOnly: true }}
                variant="filled"
            />
            <div className="font-semibold">Tùy chọn</div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {valueOptionSize.map((item, index) => (
                    <div className="flex items-center gap-2" key={index}>
                        <TextField
                            label={`Tên tùy chọn ${index + 1}`}
                            fullWidth
                            value={item.valueName || ''}
                            onChange={(e) => handleChangeValueName(index, e)}
                        />
                        <PopConfirm
                            content="Nếu xóa dữ liệu sẽ mất đi và không thể hoàn lại"
                            title={`Xóa ${config.TypeOption.Size}`}
                            onConfirm={() => handleDeleteValueName(index)}
                        >
                            <IconButton>
                                <DeleteTwoTone className="text-red-500 " />
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

export default OptionSize;
