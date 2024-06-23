// libs
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import Add from '@mui/icons-material/Add';
import { ChangeEvent, useState } from 'react';
// types
import { IValue } from '@/types/productCart';
import { IValueSizeCreate } from '@/types/product';
// components
import PopConfirm from '@/components/PopConfirm';
import Button from '@/components/Button';
// others
import config from '@/config';

interface Iprops {
    handleSetOptionsSize?: (optionName: string, values: Array<IValue>) => void;
}

const OptionSize = (props: Iprops) => {
    const { handleSetOptionsSize } = props;

    const [nameTitle, setNameTitle] = useState<string>(config.TypeOption.Size || '');
    const [valueName, setValueName] = useState<Array<IValueSizeCreate>>([]);

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setNameTitle(e.target.value);
    };

    const handleAddValueName = () => {
        setValueName((prev) => [...prev, { valueName: '' }]);
    };

    const handleDeleteValueName = (index: number) => {
        setValueName((prev) => {
            const updatedArray = prev.filter((_, i) => i !== index);
            return updatedArray;
        });
    };

    const handleChangeValueName = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            <div className="font-semibold">Tùy chọn</div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {valueName.map((_, index) => (
                    <div className="flex items-center gap-2" key={index}>
                        <TextField
                            label={`Tên tùy chọn ${index + 1}`}
                            fullWidth
                            value={valueName[index]?.valueName || ''}
                            onChange={(e) => handleChangeValueName(index, e)}
                        />
                        <PopConfirm
                            content="Nếu xóa dữ liệu sẽ mất đi và không thể hoàn lại"
                            title={`Xóa ${nameTitle}`}
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
