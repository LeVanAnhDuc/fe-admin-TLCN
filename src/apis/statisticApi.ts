/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const getCountStatistic = async () => {
    try {
        const response = await axios.get(`/statistic/count`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getRegisterCompleteStatisticByYear = async (year: number) => {
    try {
        const response = await axios.get(`/statistic/account/yearly?year=${year}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getOrderCompleteStatisticByYear = async (year: number) => {
    try {
        const response = await axios.get(`/statistic/order_complete/yearly?year=${year}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getOrderStatisticByDaily = async (date: string) => {
    try {
        const response = await axios.get(`/statistic/order/daily?date=${date}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getOrderStatisticByMonth = async (month: number, year: number) => {
    try {
        const response = await axios.get(`/statistic/order/monthly?month=${month}&year=${year}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getOrderStatisticByYear = async (year: number) => {
    try {
        const response = await axios.get(`/statistic/order/yearly?year=${year}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getTotalProductSoldByYear = async (year: number) => {
    try {
        const response = await axios.get(`/statistic/product/sold?year=${year}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getTotalPriceSoldByYear = async (year: number) => {
    try {
        const response = await axios.get(`/statistic/revenue?year=${year}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getNumberTotalPriceSoldAndTotalProductSoldByYear = async () => {
    try {
        const response = await axios.get(`statistic/revenue-count`);

        return response;
    } catch (error) {
        throw error;
    }
};
