/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const changeItemQuantity = async (idItem: number, quantity: number) => {
    try {
        const response = await axios.put(`/cart/items/${idItem}?quantity=${quantity}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteCartItemByID = async (idItem: number) => {
    try {
        const response = await axios.delete(`/cart/items/${idItem}`);
        return response;
    } catch (error) {
        throw error;
    }
};
