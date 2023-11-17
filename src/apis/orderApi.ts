/* eslint-disable no-useless-catch */
import { IOrderCheckOut } from '../interface/order.js';
import axios from './axiosConfig.js';

export const getHistoryOrderForCurrentUser = async () => {
    try {
        const response = await axios.get(`/orders/token`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCheckOutDataForPage = async () => {
    try {
        const response = await axios.get(`/orders/checkout-data`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOrderByID = async (idOrder: string) => {
    try {
        const response = await axios.get(`/orders/${idOrder}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getListOrderByUserName = async (userName: string) => {
    try {
        const response = await axios.get(`/orders/user?username=${userName}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getListOrderByUserID = async (idUserName: string) => {
    try {
        const response = await axios.get(`/orders/user/${idUserName}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addOrderByToken = async (data: IOrderCheckOut) => {
    try {
        const response = await axios.post('/orders', {
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

export const updateOrderStatusByID = async (idOrder: string, status: string) => {
    try {
        const response = await axios.put(`/orders/${idOrder}/status?status=${status}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteOrderByUser = async (idOrder: string) => {
    try {
        const response = await axios.delete(`/orders/${idOrder}`);
        return response;
    } catch (error) {
        throw error;
    }
};
