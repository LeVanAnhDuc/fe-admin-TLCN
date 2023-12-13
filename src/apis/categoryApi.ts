/* eslint-disable no-useless-catch */
import { IUpdateCategory } from '../interface/category.js';
import axios from './axiosConfig.js';

export const getAllCategoryWithinPaginationSearch = async (
    pageNo: number,
    pageSize: number,
    sort: string = 'id:desc',
    key?: string,
) => {
    try {
        const params: Record<string, string | number | undefined> = {
            pageNo: pageNo,
            pageSize: pageSize,
            sort: sort,
        };
        // Thêm key vào đối tượng nếu key không rỗng
        if (key !== undefined && key !== null && key !== '') {
            params['key'] = key;
        }
        const url = '/categories/search?' + new URLSearchParams(params as Record<string, string>).toString();
        const response = await axios.get(url);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllCategoryWithPagination = async (pageNo: number, pageSize: number) => {
    try {
        const response = await axios.get(`/categories?pageNo=${pageNo}&pageSize=${pageSize}`);
        return response;
    } catch (error) {
        throw error;
    }
};
export const getAllCategory = async () => {
    try {
        const response = await axios.get(`/categories`);
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
            parentName: objectUpdate.parentName,
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
            parentName: objectUpdate.parentName,
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
