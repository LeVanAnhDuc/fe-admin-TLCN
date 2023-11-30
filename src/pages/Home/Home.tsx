import VolunteerActivismTwoTone from '@mui/icons-material/VolunteerActivismTwoTone';
import InventoryTwoTone from '@mui/icons-material/InventoryTwoTone';
import AirportShuttleTwoTone from '@mui/icons-material/AirportShuttleTwoTone';
import ShoppingBagTwoTone from '@mui/icons-material/ShoppingBagTwoTone';

import BasicLineChart from './Line/Line';
import BasicBars from './Bar/Bar';
import BasicPie from './Pie/Pie';
import { useEffect, useState } from 'react';
import { getCountStatistic } from '../../apis/statisticApi';
import { IStatisticCount } from '../../interface/statistic';
import { toast } from 'react-toastify';

const Home = () => {
    const [data, setData] = useState<IStatisticCount>();
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
        <div className="w-full overflow-y-auto scroll-smooth">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
                <div className="bg-[#FFEEE8] h-28 rounded grid grid-cols-3 items-center">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                        <VolunteerActivismTwoTone sx={{ fontSize: 35, color: '#FF6636' }} />
                    </div>
                    <div className="col-span-2">
                        <div className="font-medium">{data?.registeredCount}</div>
                        <div className="font-semibold">Số người dùng</div>
                    </div>
                </div>
                <div className="bg-[#EBEBFF] h-28 rounded grid grid-cols-3 items-center">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                        <InventoryTwoTone sx={{ fontSize: 35, color: '#564FFD' }} />
                    </div>
                    <div className="col-span-2">
                        <div className="font-medium">{data?.orderedCount}</div>
                        <div className="font-semibold">Hóa đơn đã đặt</div>
                    </div>
                </div>
                <div className="bg-[#E1F7E3] h-28 rounded grid grid-cols-3 items-center">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                        <AirportShuttleTwoTone sx={{ fontSize: 35, color: '#23BD33' }} />
                    </div>
                    <div className="col-span-2">
                        <div className="font-medium">{data?.shippingCount}</div>
                        <div className="font-semibold">Hóa đơn đang giao</div>
                    </div>
                </div>
                <div className="bg-[#FFF2E5] h-28 rounded grid grid-cols-3 items-center">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                        <ShoppingBagTwoTone sx={{ fontSize: 35, color: '#FD8E1F' }} />
                    </div>
                    <div className="col-span-2">
                        <div className="font-medium">{data?.deliveredCount}</div>
                        <div className="font-semibold">Hóa đơn đã giao</div>
                    </div>
                </div>
            </div>
            <div className="bg-chart mt-5 p-5 rounded">
                <BasicLineChart />
            </div>
            <div className="py-5 grid grid-cols-1 2xl:grid-cols-5 gap-5">
                <div className="bg-chart p-5 col-span-1 2xl:col-span-3 rounded">
                    <BasicBars />
                </div>
                <div className="bg-chart p-5 flex flex-col col-span-1 2xl:col-span-2 rounded">
                    <BasicPie />
                </div>
            </div>
        </div>
    );
};

export default Home;
