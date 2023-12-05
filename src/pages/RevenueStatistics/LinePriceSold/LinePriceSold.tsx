import { BarChart } from '@mui/x-charts/BarChart';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getTotalPriceSoldByYear } from '../../../apis/statisticApi';
import { IStaticMonth } from '../../../interface/statistic';
import MenuItem from '@mui/material/MenuItem';
const xLabels = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
];

export default function LinePriceSold() {
    const [filterBy, setFilterBy] = useState<string>('1000000');
    const [data, setData] = useState<IStaticMonth>();
    const currentYear = new Date().getFullYear();
    const handleGetDataStatistic = async () => {
        try {
            const response = await getTotalPriceSoldByYear(currentYear);

            if (response.status === 200) {
                const formattedData = Object.fromEntries(
                    Object.entries(response.data).map(([key, value]) => [key, value / +filterBy]),
                );

                setData(formattedData);
            } else {
                toast.error(response.data.message | response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    useEffect(() => {
        handleGetDataStatistic();
    }, [filterBy]);

    // Kiểm tra nếu data không tồn tại hoặc có giá trị undefined
    if (!data) {
        return null; // Hoặc hiển thị thông báo, hoặc render một thứ gì đó khác tùy thuộc vào yêu cầu của bạn
    }
    // handleChangeFilterBy
    const handleChangeFilterBy = (event: SelectChangeEvent) => {
        setFilterBy(event.target.value);
    };

    function formatNumberToVietnamese(number: number) {
        const units = ['', 'nghìn', 'triệu', 'tỷ'];

        let result = '';
        let unitIndex = 0;

        while (number > 0) {
            const part = number % 1000;
            if (part > 0) {
                result = `${units[unitIndex]}`;
            }

            number = Math.floor(number / 1000);
            unitIndex++;
        }

        return result.trim();
    }

    return (
        <>
            <FormControl fullWidth>
                <InputLabel>Phân tích theo số tiền</InputLabel>
                <Select value={filterBy} label="Phân tích theo số tiền" onChange={handleChangeFilterBy}>
                    <MenuItem value={'1000000000'}>Tỷ (1 : 1.000.000.000)</MenuItem>
                    <MenuItem value={'1000000'}>Triệu (1 : 1.000.000)</MenuItem>
                    <MenuItem value={'1000'}>Nghìn (1 : 1.000)</MenuItem>
                    <MenuItem value={'1'}>(1 : 1)</MenuItem>
                </Select>
            </FormControl>
            <BarChart
                xAxis={[{ scaleType: 'band', data: xLabels }]}
                series={[
                    {
                        data: [
                            data?.jan,
                            data?.feb,
                            data?.mar,
                            data?.apr,
                            data?.may,
                            data?.jun,
                            data?.jul,
                            data?.aug,
                            data?.sep,
                            data?.oct,
                            data?.nov,
                            data?.dec,
                        ],
                        label: `Tổng doanh thu (${formatNumberToVietnamese(+filterBy)} VNĐ)`,
                    },
                ]}
                height={600}
            />
            <div className="w-full text-center font-semibold text-lg">
                Biểu Đồ Phân Tích Doanh Thu Trong Năm {currentYear}
            </div>
        </>
    );
}
