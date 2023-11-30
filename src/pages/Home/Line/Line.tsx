import { LineChart } from '@mui/x-charts/LineChart';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getRegisterCompleteStatisticByYear } from '../../../apis/statisticApi';
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

export default function BasicLineChart() {
    const [data, setData] = useState<IStaticMonth>();
    const currentYear = new Date().getFullYear();

    const handleGetDataStatistic = async () => {
        try {
            const response = await getRegisterCompleteStatisticByYear();

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

    // Kiểm tra nếu data không tồn tại hoặc có giá trị undefined
    if (!data) {
        return null; // Hoặc hiển thị thông báo, hoặc render một thứ gì đó khác tùy thuộc vào yêu cầu của bạn
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
                        label: 'Số người dùng mới',
                    },
                ]}
                height={400}
            />
            <div className="w-full text-center font-semibold text-lg">
                Biểu đồ thể hiện số lượng người dùng mới trong năm {currentYear}
            </div>
        </>
    );
}
