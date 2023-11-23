import VolunteerActivismTwoTone from '@mui/icons-material/VolunteerActivismTwoTone';
import InventoryTwoTone from '@mui/icons-material/InventoryTwoTone';
import AirportShuttleTwoTone from '@mui/icons-material/AirportShuttleTwoTone';
import ShoppingBagTwoTone from '@mui/icons-material/ShoppingBagTwoTone';

import BasicLineChart from './Line/Line';
import BasicBars from './Bar/Bar';
import BasicPie from './Pie/Pie';

const Home = () => {
    return (
        <div className="w-full overflow-y-auto scroll-smooth">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
                <div className="bg-[#FFEEE8] h-28 rounded grid grid-cols-3 items-center">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                        <VolunteerActivismTwoTone sx={{ fontSize: 35, color: '#FF6636' }} />
                    </div>
                    <div className="col-span-2">
                        <div className="font-medium text-2xl">1804</div>
                        <div className="text-lg font-semibold ">Số người đăng kí</div>
                    </div>
                </div>
                <div className="bg-[#EBEBFF] h-28 rounded grid grid-cols-3 items-center">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                        <InventoryTwoTone sx={{ fontSize: 35, color: '#564FFD' }} />
                    </div>
                    <div className="col-span-2">
                        <div className="font-medium text-2xl">18</div>
                        <div className="text-lg font-semibold ">Hóa đơn đã đặt</div>
                    </div>
                </div>
                <div className="bg-[#E1F7E3] h-28 rounded grid grid-cols-3 items-center">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                        <AirportShuttleTwoTone sx={{ fontSize: 35, color: '#23BD33' }} />
                    </div>
                    <div className="col-span-2">
                        <div className="font-medium text-2xl">4</div>
                        <div className="text-lg font-semibold ">Hóa đơn đang xử lí</div>
                    </div>
                </div>
                <div className="bg-[#FFF2E5] h-28 rounded grid grid-cols-3 items-center">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                        <ShoppingBagTwoTone sx={{ fontSize: 35, color: '#FD8E1F' }} />
                    </div>
                    <div className="col-span-2">
                        <div className="font-medium text-2xl">2002</div>
                        <div className="text-lg font-semibold ">Hóa đơn đang giao</div>
                    </div>
                </div>
            </div>
            <div className="bg-chart mt-5 p-5">
                <BasicLineChart />
            </div>
            <div className="py-5 grid grid-cols-1 2xl:grid-cols-5 gap-5">
                <div className="bg-chart p-5 col-span-1 2xl:col-span-3">
                    <BasicBars />
                </div>
                <div className="bg-chart p-5 flex flex-col col-span-1 2xl:col-span-2">
                    <BasicPie />
                </div>
            </div>
        </div>
    );
};

export default Home;
