/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const getAllProductWithinPagination = async (pageNo: number, pageSize: number) => {
    try {
        const response = await axios.get(`/products?pageNo=${pageNo}&pageSize=${pageSize}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getSingleProduct = async (id: number) => {
    try {
        const response = await axios.get(`/products/${id}`);

        return response;
    } catch (error) {
        throw error;
    }
};
