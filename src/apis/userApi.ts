/* eslint-disable no-useless-catch */
// libs
import axios from './axiosConfig.js';
// types
import { IInfoProfileUserInputUpdate } from '../types/user.js';

export const getAllUserWithinPaginationSearch = async (pageNo: number, pageSize: number, key?: string) => {
    try {
        const params: Record<string, string | number | undefined> = {
            pageNo: pageNo,
            pageSize: pageSize,
        };
        if (key !== undefined && key !== null && key !== '') {
            params['key'] = key;
        }
        const url = '/users/search?' + new URLSearchParams(params as Record<string, string>).toString();

        const response = await axios.get(url);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllUserWithinPanigation = async (pageNo: number, pageSize: number) => {
    try {
        const response = await axios.get(`/users?pageNo=${pageNo}&pageSize=${pageSize}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getSingleUserByID = async (idUser: number) => {
    try {
        const response = await axios.get(`/users/id/${idUser}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUserByUserNameOrEmail = async (userNameOrEmail: string) => {
    try {
        const response = await axios.get(`/users/${userNameOrEmail}`);
        return response;
    } catch (error) {
        throw error;
    }
};
export const changePassWordByToken = async (oldPassword: string, newPassword: string) => {
    try {
        const response = await axios.put(`/users/password/change`, {
            oldPassword,
            newPassword,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const forgotPassWord = async (email: string, newPassword: string) => {
    try {
        const response = await axios.put(`/users/password/forgot?email=${email}&newPassword=${newPassword}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateAccountProfileOfSignedInAccount = async (data: IInfoProfileUserInputUpdate) => {
    try {
        const response = await axios.put(`/users/profile`, {
            username: data.username,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const changeLockUnlockUserAccountByIDUser = async (idUser: number) => {
    try {
        const response = await axios.put(`/users/${idUser}/status`);
        return response;
    } catch (error) {
        throw error;
    }
};
