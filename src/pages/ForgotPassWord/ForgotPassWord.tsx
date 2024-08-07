// libs
import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
// components
import SnackBarLoading from '@/components/SnackBarLoading';
import AnimationTran from '@/components/AnimationTran';
import InputPassword from '@/components/InputPassword';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
// apis
import { sendOTPRegister, verifyOTPRegister } from '@/apis/authApi';
import { forgotPassWord } from '@/apis/userApi';
// others
import config from '@/config';

type FormDataForgotPassword = {
    otp: string;
    email: string;
    passWord: string;
    comfirmPassWord: string;
};

const ForgotPassWord = () => {
    const navigate = useNavigate();

    const [inputPass, setInputPass] = useState<boolean>(false);
    const [inputOTP, setInputOTP] = useState<boolean>(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [isLoadingGetOTP, setIsLoadingGetOTP] = useState(false);
    const [titleDialog, setTitleDialog] = useState<string>('');

    const schema = yup.object().shape({
        email: yup.string().required('Email đang trống').email('Email không đúng định dạng'),
        otp: yup
            .string()
            .required('OTP đang trống')
            .min(4, 'OTP lớn hơn 4 kí tư')
            .test('is-OTP', 'OTP không đúng định dạng', function (value) {
                if (!value) return true;

                const numericRegex = /^[a-zA-Z0-9]+$/;
                return numericRegex.test(value);
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
        comfirmPassWord: yup
            .string()
            .required('Mật khẩu đang trống')
            .test('is-passWord', 'Mật khẩu chưa đúng định dạng', function (value) {
                if (!value) return true;

                const regexUserName = /^[a-zA-Z0-9]+$/;

                return regexUserName.test(value);
            })
            .min(8, 'Mật khẩu lớn hơn 8 kí tư')
            .oneOf([yup.ref('passWord')], 'Mật khẩu xác nhận phải giống với mật khẩu mới'),
    });

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FormDataForgotPassword>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormDataForgotPassword> = async (data) => {
        try {
            setIsLoadingSubmit(true);
            setTitleDialog('Tiến hành đổi mật khẩu');
            const response = await forgotPassWord(data.email, data.passWord);
            setIsLoadingSubmit(false);

            if (response.status === 200) {
                toast.success(response.data);
                setInputPass(false);
                setInputOTP(false);
                navigate(config.Routes.logIn);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleSendOTPAgain = async () => {
        if (getValues().email) {
            setIsLoadingGetOTP(true);
            setTitleDialog('Tiến hành gửi OTP');
            const response = await sendOTPRegister(getValues().email);
            setIsLoadingGetOTP(false);

            if (response.status === 200) {
                setInputOTP(true);
                toast.success('Gửi OTP thành công');
            } else {
                toast.error(response.data.message || response.data);
            }
        } else {
            toast.error('Email đang rỗng');
        }
    };

    const handleCheckOTP = async () => {
        try {
            setIsLoadingSubmit(true);
            setTitleDialog('Tiến hành kiếm tra OTP');
            const response = await verifyOTPRegister(getValues('email'), getValues('otp'));
            setIsLoadingSubmit(false);

            if (response.status === 200) {
                toast.success(response.data);
                setInputPass(true);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <>
            <SnackBarLoading open={isLoadingSubmit || isLoadingGetOTP} content={titleDialog} />
            <div className="bg-gradient-to-r from-primary-200 via-primary-700 to-primary-500 flex place-content-center dark:from-primary-700 dark:via-primary-900 dark:to-primary-800">
                <div className="w-10/12 xl:w-8/12 flex gap-3 bg-gray-100 my-20 py-8 px-6 rounded-xl shadow dark:bg-dark-600">
                    <section className="w-full flex flex-col justify-start gap-6 shadow py-7 px-5 bg-gray-50 rounded-lg dark:bg-dark-400">
                        <AnimationTran tranX={100} className="text-2xl font-bold">
                            Quên mật khẩu
                        </AnimationTran>
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            <AnimationTran tranX={100} delay={0.1}>
                                <>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.email ? true : false}
                                                fullWidth
                                                label="Nhập email"
                                                autoComplete="email"
                                                disabled={inputOTP ? true : false}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.email?.message}
                                    </p>
                                </>
                            </AnimationTran>

                            {inputOTP && (
                                <AnimationTran tranY={-100}>
                                    <>
                                        <Controller
                                            name="otp"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    error={errors.otp ? true : false}
                                                    fullWidth
                                                    label="Nhập OTP"
                                                    disabled={inputPass ? true : false}
                                                />
                                            )}
                                        />
                                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                            {errors.otp?.message}
                                        </p>
                                    </>
                                </AnimationTran>
                            )}

                            {inputPass && (
                                <>
                                    <AnimationTran tranY={-100}>
                                        <>
                                            <Controller
                                                name="passWord"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputPassword
                                                        field={{ ...field }}
                                                        error={errors.passWord ? true : false}
                                                        label="Nhập mật khẩu mới"
                                                    />
                                                )}
                                            />
                                            <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                                {errors.passWord?.message}
                                            </p>
                                        </>
                                    </AnimationTran>
                                    <AnimationTran tranY={-100} delay={0.1}>
                                        <>
                                            <Controller
                                                name="comfirmPassWord"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputPassword
                                                        field={{ ...field }}
                                                        error={errors.comfirmPassWord ? true : false}
                                                        label="Nhập lại mật khẩu mới"
                                                    />
                                                )}
                                            />
                                            <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                                {errors.comfirmPassWord?.message}
                                            </p>
                                        </>
                                    </AnimationTran>
                                </>
                            )}

                            {inputOTP &&
                                (inputPass ? (
                                    <AnimationTran tranY={-100} delay={0.1}>
                                        <Button type="submit" variant="fill" fullWidth loading={isLoadingSubmit}>
                                            Xác nhận mật khẩu mới
                                        </Button>
                                    </AnimationTran>
                                ) : (
                                    <AnimationTran tranY={-100} delay={0.1}>
                                        <Button
                                            variant="fill"
                                            fullWidth
                                            loading={isLoadingSubmit}
                                            onClick={handleCheckOTP}
                                        >
                                            Xác thực OTP
                                        </Button>
                                    </AnimationTran>
                                ))}

                            {!inputPass && (
                                <AnimationTran tranX={100} delay={0.3}>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        onClick={handleSendOTPAgain}
                                        loading={isLoadingGetOTP}
                                    >
                                        {!inputOTP ? 'Gửi mã OTP' : 'Gửi lại mã OTP'}
                                    </Button>
                                </AnimationTran>
                            )}
                        </form>
                    </section>

                    <section className="min-h-[31rem] w-full flex-col items-center lg:flex hidden">
                        <Logo />
                        <AnimationTran tranY={-100} className="m-auto">
                            <h5 className="leading-7 tracking-tight">
                                Đừng lo lắng khi quên mật khẩu. Chỉ cần thực hiện các bước sau để có thể đổi mật khẩu
                                của bạn.
                            </h5>
                        </AnimationTran>
                        <div className="bg-forgotPassword-banner bg-contain bg-no-repeat bg-center w-full h-full"></div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default ForgotPassWord;
