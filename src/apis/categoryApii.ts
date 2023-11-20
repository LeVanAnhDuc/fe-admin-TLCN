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

export const createNewCategory = async (objectUpdate: IUpdateCategory) => {
    try {
        const response = await axios.post(`/categories`, {
            name: objectUpdate.name,
            description: objectUpdate.description,
            parentId: objectUpdate.parentId,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateCategory = async (idCategory: number, objectUpdate: IUpdateCategory) => {
    try {
        const response = await axios.put(`/categories/${idCategory}`, {
            name: objectUpdate.name,
            description: objectUpdate.description,
            parentId: objectUpdate.parentId,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const deteleASingleCategory = async (idCategory: number) => {
    try {
        const response = await axios.delete(`/categories/${idCategory}`);
        return response;
    } catch (error) {
        throw error;
    }
};
