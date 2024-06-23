import { LineChart } from '@mui/x-charts/LineChart';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getRegisterCompleteStatisticByYear } from '../../apis/statisticApi';
import { IStaticMonth } from '../../types/statistic';

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

export default function BasicLineChart() {
    const currentYear = new Date().getFullYear();
    const totalYearSincePay = currentYear - 2023 + 1;

    const [data, setData] = useState<IStaticMonth>();
    const [year, setYear] = useState<number>(currentYear);

    const handleChangeYear = (event: SelectChangeEvent) => {
        setYear(parseInt(event.target.value));
    };

    const handleGetDataStatistic = async (yearSelect: number) => {
        try {
            const response = await getRegisterCompleteStatisticByYear(yearSelect);

            if (response.status === 200) {
                setData(response.data);
            } else {
                toast.error(response.data.message | response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    useEffect(() => {
        handleGetDataStatistic(year);
    }, [year]);

    if (!data) {
        return null;
    }

    return (
        <>
            <div className="size-full flex flex-wrap justify-between items-center gap-5">
                <div className="font-bold">Biểu đồ thể hiện số lượng người dùng mới trong năm {year}</div>

                <FormControl className="w-32">
                    <InputLabel>Năm</InputLabel>
                    <Select className="text-center" value={year.toString()} label="Năm" onChange={handleChangeYear}>
                        {Array(totalYearSincePay)
                            .fill(null)
                            .map((_, index) => {
                                const year = currentYear - index;
                                return (
                                    <MenuItem value={year} key={index}>
                                        {year}
                                    </MenuItem>
                                );
                            })}
                    </Select>
                </FormControl>
            </div>
            <LineChart
                xAxis={[{ scaleType: 'band', data: xLabels }]}
                yAxis={[
                    {
                        valueFormatter: (value) => {
                            const absValue = Math.floor(value);
                            return absValue === value ? absValue.toString() : '';
                        },
                    },
                ]}
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
                        area: true,
                        label: `Số người dùng mới`,
                    },
                ]}
                height={400}
            />
        </>
    );
}
