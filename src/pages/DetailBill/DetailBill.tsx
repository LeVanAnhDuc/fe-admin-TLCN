import { Button } from '@mui/material';
import React from 'react';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { Link } from 'react-router-dom';
import config from '../../config';

enum EStatusOrder {
    PENDING_PROCESSING = 'Đang chờ xử lý',
    PROCESSING = 'Đang xử lý',
    SHIPPED = 'Đã gửi',
    DELIVERED = 'Đã giao',
    CANCELED = 'Đã hủy',
}

interface IInfoCustomer {
    id: string;
    userID: string;
    Address: string;
    status: EStatusOrder;
    total: number;
    note: string;
    paymentType: string;
    createBy: string;
    createDate: string;
}

const user: IInfoCustomer = {
    id: 'InfoCustomer',
    userID: 'InfoCustomer',
    Address: 'InfoCustomer',
    status: EStatusOrder.DELIVERED,
    total: 100,
    paymentType: 'InfoCustomer',
    createBy: 'InfoCustomer',
    createDate: 'InfoCustomer',
    note: 'InfoCustomer',
};
const DetailBill = () => {
    return (
        <div>
            <div className="flex justify-between pb-3">
                <div className="text-lg font-semibold flex items-center ">Thông tin hóa đơn</div>
                <Link to={config.Routes.listBill}>
                    <Button variant="outlined">
                        <KeyboardArrowLeft />
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-12 gap-x-2 gap-y-1">
                {Object.keys(user).map((item, index) => (
                    <React.Fragment key={index}>
                        <div className="col-span-4 md:col-span-2 h-max rounded-lg border-2 flex items-center p-3">
                            {item}
                        </div>
                        <div
                            className={`${
                                user[item as keyof IInfoCustomer] === EStatusOrder.PENDING_PROCESSING && 'bg-[#E5D9B6]'
                            }
                                ${user[item as keyof IInfoCustomer] === EStatusOrder.PROCESSING && 'bg-[#FFD460]'}
                                ${user[item as keyof IInfoCustomer] === EStatusOrder.SHIPPED && 'bg-[#93B5C6]'}
                                ${user[item as keyof IInfoCustomer] === EStatusOrder.DELIVERED && 'bg-[#5F8D4E]'}
                                ${user[item as keyof IInfoCustomer] === EStatusOrder.CANCELED && 'bg-[#E23E57]'}
                        } col-span-8 md:col-span-10 h-max rounded-lg border-2 flex items-center p-3 break-all`}
                        >
                            {user[item as keyof IInfoCustomer]}
                            {item === 'total' ? ' $' : ''}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DetailBill;
