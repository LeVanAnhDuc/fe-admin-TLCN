/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const uploadAvatar = async (image: FormData) => {
    try {
        const response = await axios.post(`image/avatar/upload`, image, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const uploadProductImages = async (idProduct: number, images: FormData) => {
    try {
        const response = await axios.post(`image/product/upload/${idProduct}`, images, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const uploadImage = async (image: FormData) => {
    try {
        const response = await axios.post(`image/upload`, image, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};
