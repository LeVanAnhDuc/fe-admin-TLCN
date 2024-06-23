/* eslint-disable no-useless-catch */
import { IOrderCheckOut } from '../types/order.js';
import axios from './axiosConfig.js';
export const checkOutVNPay = async (data: IOrderCheckOut) => {
    try {
        const response = await axios.post('/vnpay/submit-order', {
            total: data.total,
            paymentType: data.paymentType,
            note: data.note,
            addressId: data.addressId,
        });
        return response;
    } catch (error) {
        throw error;
    }
};
