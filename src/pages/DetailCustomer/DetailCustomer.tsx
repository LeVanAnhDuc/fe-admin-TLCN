import config from '../../config';

import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';

interface IInfoCustomer {
    id: string;
    username: string;
    passWord: string;
    fName: string;
    lName: string;
    email: string;
    id_card: string;
    phone: string;
    gender: string;
    createDate: string;
    lastModifiedDate: string;
}

const user: IInfoCustomer = {
    id: 'InfoCustomer',
    username: 'InfoCustomer',
    passWord: 'InfoCustomer',
    fName: 'InfoCustomer',
    lName: 'InfoCustomer',
    email: 'InfoCustomer',
    id_card: 'InfoCustomer',
    phone: 'InfoCustomer',
    gender: 'InfoCustomer',
    createDate: 'InfoCustomer',
    lastModifiedDate: 'InfoCustomer',
};
const DetailCustomer = () => {
    return (
        <div>
            <div className="flex justify-between pb-3">
                <div className="text-lg font-semibold flex items-center ">Thông tin khách hàng</div>
                <Link to={config.Routes.listCustomer}>
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
                        <div className="col-span-8 md:col-span-10 h-max rounded-lg border-2 flex items-center p-3">
                            {user[item as keyof IInfoCustomer]}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DetailCustomer;
