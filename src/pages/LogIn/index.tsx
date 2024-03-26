import config from '../../config';
import InputText from '../../components/InputText/InputText';
import { checkExpiredToken, loginApiAdmin } from '../../apis/authApi';

import { useForm, SubmitHandler } from 'react-hook-form';

import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../hook/AuthContext';

type FormData = {
    email: string;
    passWord: string;
};

const LogIn = () => {
    const navigate = useNavigate();
    // useContext
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            passWord: '',
        },
    });
    // check token
    const { logout } = useAuth();

    const handleCheckToken = async (token: string) => {
        const response = await checkExpiredToken(token);
        if (response.status === 200) {
            navigate(config.Routes.home);
        } else {
            navigate(config.Routes.logIn);
            logout();
        }
    };
    // handle successful login
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            handleCheckToken(accessToken);
        }
    }, []);
    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        const regexEmailOrUserName = /^(?=.*[A-Za-z0-9])[A-Za-z0-9@._-]{4,}$/;
        const regexPass = /^[a-zA-Z0-9]{8,}$/;
        if (!regexEmailOrUserName.test(data.email)) {
            toast.error('Email chưa đúng định dạng');
        } else if (!regexPass.test(data.passWord)) {
            toast.error('Mật khẩu phải trên 8 kí tự và không chứa kí tự đặc biệt');
        } else {
            const response = await loginApiAdmin(data.email, data.passWord);
            console.log(response);

            if (response.status === 200) {
                if (response?.data?.jwt) {
                    toast.success('Đăng nhập thành công');
                    // set local
                    login(response.data.user.username);

                    // chuyen next page home
                    navigate(config.Routes.home);
                }
            } else {
                toast.error(response.data.message || response.data);
            }
            // error
        }
    };
    return (
        <div className="m-auto bg-slate-100 h-screen">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        <strong>Đăng nhập</strong>
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mt-2">
                            <InputText
                                labelInput="Email hoặc username"
                                errorInput={errors.email ? true : false}
                                isRequired
                                errorFormMessage={errors.email?.message}
                                register={{
                                    ...register('email', {
                                        required: 'email is required',
                                    }),
                                }}
                                autoComplete="username"
                            />
                        </div>

                        <div className="mt-2">
                            <InputText
                                labelInput="Password"
                                errorInput={errors.passWord ? true : false}
                                isRequired
                                typeInput="password"
                                errorFormMessage={errors.passWord?.message}
                                register={{
                                    ...register('passWord', {
                                        required: 'passWord is required',
                                    }),
                                }}
                                autoComplete="password"
                            />
                        </div>
                        <Link
                            to={config.Routes.forgotPass}
                            className="text-sm font-semibold  text-gray-600 hover:text-black float-right"
                        >
                            Quên mật khẩu
                        </Link>

                        <Button
                            style={{ background: 'black' }}
                            type="submit"
                            variant="contained"
                            fullWidth
                            color="primary"
                            size="large"
                        >
                            Đăng nhập
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
