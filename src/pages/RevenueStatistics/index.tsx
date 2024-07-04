// libs
import InventoryTwoTone from '@mui/icons-material/InventoryTwoTone';
import VolunteerActivismTwoTone from '@mui/icons-material/VolunteerActivismTwoTone';
import { useState } from 'react';
// components
import CardStatictis from '@/components/CardStatictis';
import AnimationScale from '@/components/AnimationScale';
import LineChartProductSold from './mains/LineChartProductSold';
import BarChartPriceSold from './mains/BarChartPriceSold';
// ghosts
import GetTotalPriceAndProductSold from './ghosts/GetTotalPriceAndProductSold';
// others
import { convertNumberToVND } from '@/utils/convertData';

const RevenueStatistics = () => {
    const [dataStatistics, setDataStatistics] = useState<{
        countRevenue: number;
        countSold: number;
    }>({ countRevenue: 0, countSold: 0 });

    return (
        <>
            <GetTotalPriceAndProductSold setDataStatistics={setDataStatistics} />
            <div className="space-y-5">
                <div className="w-full grid grid-cols-2 gap-4">
                    <CardStatictis
                        icon={VolunteerActivismTwoTone}
                        data={`${convertNumberToVND(dataStatistics.countRevenue)} đ`}
                        content={'Tổng doanh thu'}
                        className="bg-orange-200 dark:bg-orange-300"
                    />
                    <CardStatictis
                        icon={InventoryTwoTone}
                        data={`${convertNumberToVND(dataStatistics.countSold)}`}
                        content={'Tổng doanh số sản phẩm'}
                        className="bg-purple-200 dark:bg-purple-300"
                        delay={0.1}
                    />
                </div>
                <div className="grid lg:grid-cols-2 gap-5">
                    <AnimationScale scale={0.9} className="p-5 rounded-lg bg-white">
                        <BarChartPriceSold />
                    </AnimationScale>
                    <AnimationScale scale={0.9} className="p-5 rounded-lg bg-white">
                        <LineChartProductSold />
                    </AnimationScale>
                </div>
            </div>
        </>
    );
};

export default RevenueStatistics;
