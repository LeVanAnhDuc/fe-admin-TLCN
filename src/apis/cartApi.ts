/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const addToCart = async (quantity: number, productId: number, valueNames: Array<string>) => {
    try {
        const response = await axios.post('/cart', {
            quantity,
            productId,
            valueNames,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCartByToken = async () => {
    try {
        const response = await axios.get(`/cart`);
        return response;
    } catch (error) {
        throw error;
    }
};
export const getCountOfItems = async () => {
    try {
        const response = await axios.get(`/cart/items/count`);
        return response;
    } catch (error) {
        throw error;
    }
};
export const clearAllCartItemForSignedInUser = async () => {
    try {
        const response = await axios.delete(`/cart/clear`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const removeListCartItemForSignedInUser = async () => {
    try {
        const response = await axios.delete(`/cart/remove`);
        return response;
    } catch (error) {
        throw error;
    }
};
