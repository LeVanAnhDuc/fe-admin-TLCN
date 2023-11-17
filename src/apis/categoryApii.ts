/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const getAllCategoryWithPagination = async () => {
    try {
        const response = await axios.get(`/categories`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCategoryByIDOrSlug = async (idOrSlug: string) => {
    try {
        const response = await axios.get(`/categories/${idOrSlug}`);
        return response;
    } catch (error) {
        throw error;
    }
};
