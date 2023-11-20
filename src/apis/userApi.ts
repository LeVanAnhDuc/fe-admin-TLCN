/* eslint-disable no-useless-catch */
import IUser from '../interface/user.js';
import axios from './axiosConfig.js';

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

export const updateAccountProfileByToken = async (data: IUser) => {
    try {
        const response = await axios.put(`/users/profile`, {
            username: data.username,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            avatarUrl: data.avatarUrl,
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
