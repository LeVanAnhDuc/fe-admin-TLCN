import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getOrderStatisticByYear } from '../../apis/statisticApi';
import { IStatisticStatusOrder } from '../../interface/statistic';

export default function BasicPie() {
    const [data, setData] = useState<IStatisticStatusOrder>();
    const currentYear = new Date().getFullYear();

    const handleGetDataStatistic = async () => {
        try {
            const response = await getOrderStatisticByYear();

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
            <PieChart
                series={[
                    {
                        data: [
                            { id: 0, value: data.wait_for_pay, label: 'Chờ thanh toán' },
                            { id: 1, value: data.ordered, label: 'Đã đặt hàng' },
                            { id: 2, value: data.processing, label: 'Đang xử lý' },
                            { id: 3, value: data.shipping, label: 'Đang giao' },
                            { id: 4, value: data.deliveried, label: 'Đã giao' },
                            { id: 5, value: data.canceled, label: 'Đã hủy' },
                        ],
                        cornerRadius: 5,
                        innerRadius: 30,
                        outerRadius: 100,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                ]}
                slotProps={{
                    legend: {
                        labelStyle: {
                            fontSize: 16,
                            fontWeight: 600,
                        },
                    },
                }}
                height={200}
            />
            <div className="w-full text-center font-semibold text-lg">Biểu đồ thông kê đơn hàng năm {currentYear}</div>
        </>
    );
}
