import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie() {
    return (
        <>
            <PieChart
                series={[
                    {
                        data: [
                            { id: 0, value: 10, label: 'Chờ thanh toán' },
                            { id: 1, value: 10, label: 'Đã đặt hàng' },
                            { id: 2, value: 15, label: 'Đang xử lý' },
                            { id: 3, value: 20, label: 'Đang giao' },
                            { id: 4, value: 20, label: 'Đã giao' },
                            { id: 5, value: 20, label: 'Đã hủy' },
                        ],
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
            <div className="w-full text-center font-semibold text-lg">Biểu đồ thông kê đơn hàng</div>
        </>
    );
}
