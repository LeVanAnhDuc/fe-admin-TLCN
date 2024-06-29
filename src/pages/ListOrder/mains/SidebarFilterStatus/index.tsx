// components
import Button from '@/components/Button';
// others
import config from '@/config';

const changeStatus = (nameStatus: string) => {
    switch (nameStatus) {
        case '':
            return 'Tất cả';
        default:
            return nameStatus;
    }
};

const arrayStatus: string[] = [
    'Tất cả',
    config.StatusOrder.ORDERED,
    config.StatusOrder.PROCESSING,
    config.StatusOrder.SHIPPED,
    config.StatusOrder.DELIVERED,
    config.StatusOrder.CANCELED,
    config.StatusOrder.WAITFORPAY,
];

interface Iprops {
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const SidebarFilterStatus = (props: Iprops) => {
    const { status, setStatus } = props;

    const handleChangeStatus = (status: string) => {
        if (arrayStatus.some((item) => item === status)) {
            if (status === 'Tất cả') {
                status = '';
            }
            setStatus(status);
        }
    };
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 rounded-lg">
            {arrayStatus.map((item, index) => (
                <Button
                    key={index}
                    className="!rounded !text-base truncate"
                    variant={changeStatus(status) === item ? 'fill' : 'outline'}
                    fullWidth
                    onClick={() => handleChangeStatus(item)}
                >
                    {item}
                </Button>
            ))}
        </div>
    );
};

export default SidebarFilterStatus;
