import { LineChart } from '@mui/x-charts/LineChart';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getTotalProductSoldByYear } from '../../apis/statisticApi';
import { IStaticMonth } from '../../types/statistic';

const xLabels = ['T 1', 'T 2', 'T 3', 'T 4', 'T 5', 'T 6', 'T 7', 'T 8', 'T 9', 'T 10', 'T 11', 'T 12'];

export default function LineProductSold() {
    const currentYear = new Date().getFullYear();
    const totalYearSincePay = currentYear - 2023 + 1;

    const [data, setData] = useState<IStaticMonth>();
    const [year, setYear] = useState<number>(currentYear);

    const handleChangeYear = (event: SelectChangeEvent) => {
        setYear(parseInt(event.target.value));
    };

    const handleGetDataStatistic = async (yearSelect: number) => {
        try {
            const response = await getTotalProductSoldByYear(yearSelect);

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
            <div className="w-full flex flex-wrap justify-between items-center gap-5 mb-4">
                <div className="font-bold">Biểu đồ thống kê doanh số sản phẩm bán ra trong năm {year}</div>
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
                xAxis={[{ scaleType: 'point', data: xLabels }]}
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
                        label: 'Tổng sản phẩm bán được',
                    },
                ]}
                height={400}
            />
        </>
    );
}
