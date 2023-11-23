import { LineChart } from '@mui/x-charts/LineChart';
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
    return (
        <>
            <LineChart
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                series={[
                    {
                        data: [24, 8.5, 20, 8.5, 15, 5, 24, 55, 22, 8.5, 15, 5],
                        label: 'Số account được tạo',
                    },
                ]}
                height={400}
            />
            <div className="w-full text-center font-semibold text-lg">
                Biểu đồ số lượng account đã đăng kí thành công
            </div>
        </>
    );
}
