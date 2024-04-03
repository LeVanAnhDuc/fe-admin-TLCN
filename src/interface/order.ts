import IAddress from './address';
import IProductCart from './productCart';
import IUser from './user';
export interface IOrderCheckOut {
    total: number;
    paymentType: string; //(VNPay) OR (Cash on Delivery)
    note: string;
    addressId: number;
}

export default interface IOrder {
    address: IAddress;
    createdDate: string;
    id: number;
    isPaidBefore: boolean | string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    note: string;
    orderItems: IProductCart;
    paymentType: string;
    status: string;
    total: number | string;
    totalItems: number;
    user: Pick<IUser, 'id' | 'name' | 'username'>;
}
