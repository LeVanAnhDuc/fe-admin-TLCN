import LinePriceSold from './LinePriceSold/LinePriceSold';
import LineProductSold from './LineProductSold/LineProductSold';

const RevenueStatistics = () => {
    return (
        <div className="w-full overflow-y-auto scroll-smooth">
            <div className="bg-chart mt-5 p-5">
                <LineProductSold />
            </div>
            <div className="bg-chart mt-5 p-5">
                <LinePriceSold />
            </div>
        </div>
    );
};

export default RevenueStatistics;
