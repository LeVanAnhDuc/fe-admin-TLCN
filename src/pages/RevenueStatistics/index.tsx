import InventoryTwoTone from '@mui/icons-material/InventoryTwoTone';
import VolunteerActivismTwoTone from '@mui/icons-material/VolunteerActivismTwoTone';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import BarPriceSold from './BarPriceSold';
import LineProductSold from './LineProductSold';
import { getNumberTotalPriceSoldAndTotalProductSoldByYear } from '../../apis/statisticApi';
import CardStatictis from '../../components/CardStatictis';
import { convertNumberToVND } from '../../utils/convertData';
import AnimationScale from '../../components/AnimationScale';

const RevenueStatistics = () => {
    const [data, setData] = useState<{
        countRevenue: number;
        countSold: number;
    }>({ countRevenue: 0, countSold: 0 });
    const handleGetDataStatistic = async () => {
        try {
            const response = await getNumberTotalPriceSoldAndTotalProductSoldByYear();
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
        <div className="space-y-5">
            <div className="w-full grid grid-cols-2 gap-4">
                <CardStatictis
                    icon={VolunteerActivismTwoTone}
                    data={`${convertNumberToVND(data.countRevenue)} đ`}
                    content={'Tổng doanh thu'}
                    className="bg-orange-200 dark:bg-orange-300"
                />
                <CardStatictis
                    icon={InventoryTwoTone}
                    data={`${convertNumberToVND(data.countSold)}`}
                    content={'Tổng doanh số sản phẩm'}
                    className="bg-purple-200 dark:bg-purple-300"
                    delay={0.1}
                />
            </div>
            <div className="grid lg:grid-cols-2 gap-5">
                <AnimationScale scale={0.9} className="p-5 rounded-lg bg-white">
                    <BarPriceSold />
                </AnimationScale>
                <AnimationScale scale={0.9} className="p-5 rounded-lg bg-white">
                    <LineProductSold />
                </AnimationScale>
            </div>
        </div>
    );
};

export default RevenueStatistics;
