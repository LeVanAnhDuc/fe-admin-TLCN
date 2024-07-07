// libs
import VolunteerActivismTwoTone from '@mui/icons-material/VolunteerActivismTwoTone';
import InventoryTwoTone from '@mui/icons-material/InventoryTwoTone';
import AirportShuttleTwoTone from '@mui/icons-material/AirportShuttleTwoTone';
import ShoppingBagTwoTone from '@mui/icons-material/ShoppingBagTwoTone';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// types
import { IStatisticCount } from '@/types/statistic';
// components
import LineChart from './mains/LineChart';
import BasicPie from './mains/PieChart';
import BarChart from './mains/BarChart';
import CardStatictis from '@/components/CardStatictis';
import AnimationScale from '@/components/AnimationScale';
// apis
import { getCountStatistic } from '@/apis/statisticApi';
// others
import config from '@/config';

const Home = () => {
    const [statictis, setData] = useState<IStatisticCount>();
    const handleGetDataStatistic = async () => {
        try {
            const response = await getCountStatistic();
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
            <div className="size-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <CardStatictis
                    icon={VolunteerActivismTwoTone}
                    data={statictis?.registeredCount}
                    content={'Số người dùng'}
                    link={config.Routes.listCustomer}
                    className="bg-orange-200 dark:bg-orange-300"
                />
                <CardStatictis
                    icon={InventoryTwoTone}
                    data={statictis?.orderedCount}
                    content={'Hóa đơn đã đặt'}
                    link={config.Routes.listBill}
                    className="bg-red-200 dark:bg-red-300"
                    delay={0.1}
                />
                <CardStatictis
                    icon={AirportShuttleTwoTone}
                    data={statictis?.shippingCount}
                    content={'Hóa đơn đang giao'}
                    link={config.Routes.listBill}
                    className="bg-green-200 dark:bg-green-300"
                    delay={0.2}
                />
                <CardStatictis
                    icon={ShoppingBagTwoTone}
                    data={statictis?.deliveredCount}
                    content={'Hóa đơn đã giao'}
                    link={config.Routes.listBill}
                    className="bg-blue-200 dark:bg-blue-300"
                    delay={0.3}
                />
            </div>
            <AnimationScale scale={0.8} className="p-5 bg-white">
                <LineChart />
            </AnimationScale>
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                <AnimationScale scale={0.8} className="p-5 col-span-1 xl:col-span-3 rounded bg-white">
                    <BarChart />
                </AnimationScale>
                <AnimationScale scale={0.8} className="p-5 flex flex-col col-span-1 xl:col-span-2 rounded bg-white">
                    <BasicPie />
                </AnimationScale>
            </div>
        </div>
    );
};

export default Home;
