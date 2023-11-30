import { BarChart } from '@mui/x-charts/BarChart';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getTotalPriceSoldByYear } from '../../../apis/statisticApi';
import { IStaticMonth } from '../../../interface/statistic';
const xLabels = ['T 1', 'T 2', 'T 3', 'T 4', 'T 5', 'T 6', 'T 7', 'T 8', 'T 9', 'T 10', 'T 11', 'T 12'];

export default function LinePriceSold() {
    const [data, setData] = useState<IStaticMonth>();
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

    // Kiểm tra nếu data không tồn tại hoặc có giá trị undefined
    if (!data) {
        return null; // Hoặc hiển thị thông báo, hoặc render một thứ gì đó khác tùy thuộc vào yêu cầu của bạn
    }
    return (
        <>
            <BarChart
                yAxis={[{ scaleType: 'band', data: xLabels }]}
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
                        label: 'Tổng doanh thu (VNĐ)',
                    },
                ]}
                height={600}
                layout="horizontal"
            />
            <div className="w-full text-center font-semibold text-lg">
                Biểu Đồ Phân Tích Doanh Thu Trong Năm {currentYear}
            </div>
        </>
    );
}
