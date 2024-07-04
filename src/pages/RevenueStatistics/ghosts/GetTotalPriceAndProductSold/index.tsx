// libs
import { useEffect } from 'react';
import { toast } from 'react-toastify';
// apis
import { getNumberTotalPriceSoldAndTotalProductSoldByYear } from '@/apis/statisticApi';

const GetTotalPriceAndProductSold = ({
    setDataStatistics,
}: {
    setDataStatistics: React.Dispatch<
        React.SetStateAction<{
            countRevenue: number;
            countSold: number;
        }>
    >;
}) => {
    const handleGetDataStatistic = async () => {
        try {
            const response = await getNumberTotalPriceSoldAndTotalProductSoldByYear();
            if (response.status === 200) {
                setDataStatistics(response.data);
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

    return null;
};

export default GetTotalPriceAndProductSold;
