import TextField from '@mui/material/TextField';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../hook/AuthContext';
import config from '../../config';
import { checkExpiredToken, loginApiAdmin } from '../../apis/authApi';
import SnackBarLoading from '../../components/SnackBarLoading';
import AnimationTran from '../../components/AnimationTran';
import InputPassword from '../../components/InputPassword';
import Button from '../../components/Button';
import AnimationScale from '../../components/AnimationScale';
import Logo from '../../components/Logo';

type FormData = {
    emailOrUserName: string;
    passWord: string;
};

const LogIn = () => {
    const navigate = useNavigate();
    const { setLogin, setLogout } = useAuth();

    const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);

    const schema = yup.object().shape({
        emailOrUserName: yup
            .string()
            .required('Tên tài khoản đang trống')
            .test('is-emailOrUserName', 'Tên đăng nhập chưa đúng định dạng', function (value) {
                if (!value) return true;

                const regexUserName = /^(?:(?:\w{4,})|(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/;

                return regexUserName.test(value);
            }),
        passWord: yup
            .string()
            .required('Mật khẩu đang trống')
            .test('is-passWord', 'Mật khẩu chưa đúng định dạng', function (value) {
                if (!value) return true;

                const regexUserName = /^[a-zA-Z0-9]+$/;

                return regexUserName.test(value);
            })
            .min(8, 'Mật khẩu lớn hơn 8 kí tư'),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try {
            setIsLoadingLogin(true);
            const response = await loginApiAdmin(data.emailOrUserName, data.passWord);
            setIsLoadingLogin(false);

            if (response.status === 200) {
                if (response?.data?.jwt) {
                    const data = response?.data;
                    setLogin(data.user.username, data.jwt.tokenType, data.jwt.accessToken);
                    navigate(config.Routes.home);
                }
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error('Đăng nhập thất bại');
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const handleCheckToken = async (token: string) => {
                const response = await checkExpiredToken(token);
                if (response.status === 200) {
                    navigate(config.Routes.home);
                } else {
                    navigate(config.Routes.logIn);
                    setLogout();
                }
            };

            handleCheckToken(accessToken);
        }
    }, []);

    return (
        <>
            <SnackBarLoading open={isLoadingLogin} content={'Xác nhận đăng nhập'} />
            <div className="min-h-screen bg-gradient-to-r from-primary-400 via-primary-600 to-primary-500 flex place-content-center dark:from-primary-700 dark:via-primary-900 dark:to-primary-800">
                <div className="w-10/12 xl:w-8/12 flex gap-3 bg-gray-100 my-20 py-8 px-6 rounded-xl shadow dark:bg-dark-600">
                    <section className="w-full flex flex-col justify-center gap-6 shadow py-7 px-5 bg-gray-50 rounded-lg dark:bg-dark-400">
                        <AnimationTran tranX={100} className="text-2xl font-bold">
                            Đăng nhập
                        </AnimationTran>
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            <AnimationTran tranX={100} delay={0.1}>
                                <>
                                    <Controller
                                        name="emailOrUserName"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.emailOrUserName ? true : false}
                                                fullWidth
                                                label={'Nhập email hoặc tên tài khoản'}
                                                autoComplete="username"
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.emailOrUserName?.message}
                                    </p>
                                </>
                            </AnimationTran>
                            <AnimationTran tranX={100} delay={0.2}>
                                <>
                                    <Controller
                                        name="passWord"
                                        control={control}
                                        render={({ field }) => (
                                            <InputPassword
                                                field={{ ...field }}
                                                error={errors.passWord ? true : false}
                                                label={'Nhập mật khẩu'}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.passWord?.message}
                                    </p>
                                </>
                            </AnimationTran>
                            <AnimationTran tranX={100} delay={0.3} className="w-full flex justify-end">
                                <Button variant="text" size="small">
                                    <Link to={config.Routes.forgotPass} className="text-sm font-semibold">
                                        Quên mật khẩu
                                    </Link>
                                </Button>
                            </AnimationTran>
                            <AnimationTran tranX={100} delay={0.4}>
                                <Button type="submit" variant="fill" fullWidth loading={isLoadingLogin}>
                                    Đăng nhập
                                </Button>
                            </AnimationTran>
                        </form>
                    </section>
                    <section className="w-full h-full flex-col lg:flex hidden">
                        <AnimationScale className="m-auto">
                            <Logo />
                        </AnimationScale>
                        <div className="bg-login-banner bg-contain bg-no-repeat bg-center w-full h-full "></div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default LogIn;
