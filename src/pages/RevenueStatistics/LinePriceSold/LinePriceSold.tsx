import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getTotalPriceSoldByYear } from '../../../apis/statisticApi';
import { IStaticMonth } from '../../../interface/statistic';
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
    const [data, setData] = useState<IStaticMonth>({
        apr: 0,
        aug: 0,
        dec: 0,
        feb: 0,
        jan: 0,
        jul: 0,
        jun: 0,
        mar: 0,
        may: 0,
        nov: 0,
        oct: 0,
        sep: 0,
    });
    const currentYear = new Date().getFullYear();
    const handleGetDataStatistic = async () => {
        try {
            const response = await getTotalPriceSoldByYear(currentYear);

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
        handleGetDataStatistic();
    }, []);

    return (
        <>
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
                        label: `Tổng doanh thu (VNĐ)`,
                    },
                ]}
                height={600}
                margin={{ top: 50, right: 0, bottom: 30, left: 120 }}
            />
            <div className="w-full text-center font-semibold text-lg">
                Biểu Đồ Phân Tích Doanh Thu Trong Năm {currentYear}
            </div>
        </>
    );
}
