/* eslint-disable no-useless-catch */
import { IUpdateCategory } from '../interface/category.js';
import axios from './axiosConfig.js';

export const getAllCategoryWithPagination = async (pageNo: number, pageSize: number) => {
    try {
        const response = await axios.get(`/categories?pageNo=${pageNo}&pageSize=${pageSize}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCategoryByIDOrSlug = async (idOrSlug: number) => {
    try {
        const response = await axios.get(`/categories/${idOrSlug}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const createNewCategory = async (name: string, description: string) => {
    try {
        const response = await axios.post(`/categories`, {
            name: name,
            description: description,
        });
        return response;
    } catch (error) {
        throw error;
    }
};
// viet lai
export const updateCategory = async (idCategory: number, objectUpdate: IUpdateCategory) => {
    try {
        const response = await axios.put(`/categories/${idCategory}`, {
            objectUpdate,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const dateleASingleCategory = async (idCategory: number) => {
    try {
        const response = await axios.post(`/categories/${idCategory}`);
        return response;
    } catch (error) {
        throw error;
    }
};
