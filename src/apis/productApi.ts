/* eslint-disable no-useless-catch */
// types
import { IProductCreate, IProductUpdate } from '@/types/product.js';
// others
import axios from './axiosConfig.js';

export const getAllProductSearchWithinPagination = async (
    pageNo: number,
    pageSize: number,
    key: string,
    cate: string,
    sort: string,
) => {
    try {
        const params: { [key: string]: string | number | boolean } = {
            pageNo: pageNo,
            pageSize: pageSize,
        };

        // Thêm key vào đối tượng nếu key không rỗng
        if (key !== '') {
            params['key'] = key;
        }

        // Thêm sort vào đối tượng nếu sort không rỗng
        if (sort !== '') {
            params['sort'] = sort;
        } else {
            params['sort'] = 'id:desc';
        }

        // Thêm cate vào đối tượng nếu cate không rỗng
        if (cate !== '') {
            params['cate'] = cate;
        }
        const url = '/products/search?' + new URLSearchParams(params as Record<string, string>).toString();

        const response = await axios.get(url);
        // const response = await axios.get(
        //     `/products/search?key=${key}&cate=${cate}&sort=${sort}&pageSize=${pageSize}&pageNo=${pageNo}&sell=true`,
        // );

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

export const createNewProduct = async (object: IProductCreate) => {
    try {
        const response = await axios.post(`/products`, {
            name: object.name,
            description: object.description,
            listImages: object.listImages,
            originalPrice: object.originalPrice,
            percentDiscount: object.percentDiscount,
            category: { name: object.categoryName },
            options: object.options,
            skus: object.skus,
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (idProduct: number, object: IProductUpdate) => {
    try {
        const response = await axios.put(`/products/${idProduct}`, {
            name: object.name,
            description: object.description,
            originalPrice: object.originalPrice,
            percentDiscount: object.percentDiscount,
            listImages: object.listImages,
            category: { name: object.categoryName },
            options: object.options,
            skus: object.skus,
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const updateQuantityProduct = async (idProduct: number, quantity: number) => {
    try {
        const response = await axios.put(`/products/add-quantity?productId=${idProduct}&quantity=${quantity}`);

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
