/* eslint-disable no-useless-catch */
import IProduct from '../interface/product.js';
import axios from './axiosConfig.js';

export const getAllProductWithinPaginationSearch = async (pageNo: number, pageSize: number, key?: string) => {
    try {
        const response = await axios.get(
            `/products/search?key=${key}&sort=id:desc&pageNo=${pageNo}&pageSize=${pageSize}`,
        );

        return response;
    } catch (error) {
        throw error;
    }
};

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

export const createNewProduct = async (object: IProduct) => {
    try {
        const response = await axios.post(`/products`, {
            name: object.name,
            description: object.description,
            price: object.price,
            quantity: object.quantity,
            listImages: object.listImages,
            category: object.category,
            options: object.options,
            skus: object.skus,
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (idProduct: number, object: IProduct) => {
    try {
        const response = await axios.put(`/products/${idProduct}`, {
            name: object.name,
            description: object.description,
            price: object.price,
            quantity: object.quantity,
            listImages: object.listImages,
            category: object.category,
            options: object.options,
            skus: object.skus,
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const toggleIsActiveProduct = async (idProduct: number) => {
    try {
        const response = await axios.put(`/products/${idProduct}/active`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const toggleIsSellingProduct = async (idProduct: number) => {
    try {
        const response = await axios.put(`/products/${idProduct}/selling`);

        return response;
    } catch (error) {
        throw error;
    }
};
