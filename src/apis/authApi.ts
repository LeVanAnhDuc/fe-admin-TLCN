/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

const registerApi = async (username: string, email: string, password: string) => {
    try {
        const response = await axios.post('/auth/signup', {
            username,
            email,
            password,
        });

        return response;
    } catch (error) {
        throw error;
    }
};

const loginApi = async (email: string, password: string) => {
    try {
        const response = await axios.post('/auth/signin', {
            usernameOrEmail: email,
            password,
        });
        // handle save token
        if (response.data.jwt) {
            localStorage.setItem('accessToken', response.data.jwt.accessToken);
            localStorage.setItem('tokenType', response.data.jwt.tokenType);
        }

        return response;
    } catch (error) {
        throw error;
    }
};

const verifyOTPRegister = async (email: string, otp: string) => {
    try {
        const response = await axios.post('/auth/otp/verify', {
            email,
            otp,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

const sendOTPRegister = async (email: string) => {
    try {
        const response = await axios.post(`auth/otp/send?email=${email}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export {
    registerApi,
    loginApi,
    verifyOTPRegister,
    sendOTPRegister,
    // forgotpass_SendOTP,
    // forgotpass_CheckOTP,
    // forgotpass,
};
