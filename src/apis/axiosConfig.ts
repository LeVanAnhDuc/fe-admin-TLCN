import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://52.195.234.114:5000/api/v1',
    baseURL: 'http://localhost:5000/api/v1',
    timeout: 50000,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
});

instance.interceptors.request.use(
    function (config) {
        const accessToken = localStorage.getItem('accessToken');
        const tokenType = localStorage.getItem('tokenType');

        if (accessToken) {
            config.headers['Authorization'] = `${tokenType} ${accessToken}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        const res = { data: '', status: '', headers: '' };
        if (error.response) {
            res.data = error.response.data;
            res.status = error.response.status;
            res.headers = error.response.headers;
        } else if (error.request) {
            console.log('check API error >>>', error);
        } else {
            console.log('Error', error.message);
        }

        return res;
    },
);
export default instance;
