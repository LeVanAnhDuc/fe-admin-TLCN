import { LineChart } from '@mui/x-charts/LineChart';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getTotalProductSoldByYear } from '../../apis/statisticApi';
import { IStaticMonth } from '../../interface/statistic';
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

export default function LineProductSold() {
    const [data, setData] = useState<IStaticMonth>();
    const currentYear = new Date().getFullYear();
    const handleGetDataStatistic = async () => {
        try {
            const response = await getTotalProductSoldByYear(currentYear);

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

    if (!data) {
        return null;
    }
    return (
        <>
            <LineChart
                xAxis={[{ scaleType: 'point', data: xLabels }]}
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
            <div className="w-full text-center font-semibold text-lg">
                Biểu Đồ Thống Kê Doanh Số Sản Phẩm Bán Ra Trong Năm {currentYear}
            </div>
        </>
    );
}
