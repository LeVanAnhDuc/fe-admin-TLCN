import { BarChart } from '@mui/x-charts/BarChart';
const xLabels = ['T 1', 'T 2', 'T 3', 'T 4', 'T 5', 'T 6', 'T 7', 'T 8', 'T 9', 'T 10', 'T 11', 'T 12'];

export default function BasicBars() {
    return (
        <>
            <BarChart
                xAxis={[{ scaleType: 'band', data: xLabels }]}
                series={[
                    {
                        data: [24, 8.5, 20, 8.5, 15, 5, 24, 55, 22, 8.5, 15, 5],
                        label: 'Số đơn hàng thành công',
                    },
                ]}
                height={300}
            />
            <div className="w-full text-center font-semibold text-lg">Biểu đồ đơn hàng thành công</div>
        </>
    );
}
