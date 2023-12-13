import { useEffect, useState } from 'react';
import LinePriceSold from './LinePriceSold/LinePriceSold';
import LineProductSold from './LineProductSold/LineProductSold';
import InventoryTwoTone from '@mui/icons-material/InventoryTwoTone';
import VolunteerActivismTwoTone from '@mui/icons-material/VolunteerActivismTwoTone';
import { getNumberTotalPriceSoldAndTotalProductSoldByYear } from '../../apis/statisticApi';
import { toast } from 'react-toastify';

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
        <div className="w-full overflow-y-auto scroll-smooth">
            <div className="w-full grid grid-cols-2 gap-4 mt-10">
                <div className="bg-[#FFEEE8] h-28 rounded grid grid-cols-3 items-center">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                        <VolunteerActivismTwoTone sx={{ fontSize: 35, color: '#FF6636' }} />
                    </div>
                    <div className="col-span-2">
                        <div className="font-medium">{data.countRevenue.toLocaleString('vi-VN')} VNĐ</div>
                        <div className="font-semibold">Tổng doanh thu</div>
                    </div>
                </div>
                <div className="bg-[#EBEBFF] h-28 rounded grid grid-cols-3 items-center">
                    <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                        <InventoryTwoTone sx={{ fontSize: 35, color: '#564FFD' }} />
                    </div>
                    <div className="col-span-2">
                        <div className="font-medium">{data.countSold.toLocaleString('vi-VN')}</div>
                        <div className="font-semibold">Tổng doanh số sản phẩm</div>
                    </div>
                </div>
            </div>
            <div className="bg-chart mt-5 p-5 rounded">
                <LineProductSold />
            </div>
            <div className="bg-chart mt-5 p-5 rounded">
                <LinePriceSold />
            </div>
        </div>
    );
};

export default RevenueStatistics;
