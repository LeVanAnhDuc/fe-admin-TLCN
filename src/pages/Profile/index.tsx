import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import config from '../../config';
import { IInfoProfileUser } from '../../interface/user';
import { getUserByUserNameOrEmail, updateAccountProfileOfSignedinAccount } from '../../apis/userApi';
import Button from '../../components/Button';
import TextField from '@mui/material/TextField';
import { objectsAreEqual } from '../../utils/checkData';
import Error404 from '../Error404';
import Loading from '../../components/Loading';

import Image from '../../components/Image';


interface FormData extends Pick<IInfoProfileUser, 'username' | 'name' | 'email' | 'phoneNumber' | 'gender' | 'avatarUrl' > { }

const Settings = () => {
    const [firstLoadingAPIGet, setFirstLoadingAPIGet] = useState<boolean>(true);
    const [isLoadingAPIGet, setLoadingAPIGet] = useState<boolean>(false);
    const [isLoadingAPIUpdate, setLoadingAPIUpdate] = useState<boolean>(false);
    const [info, setInfo] = useState<IInfoProfileUser>();
    const [errorAPI, setErrorAPI] = useState<boolean>(false);

    const schema = yup.object().shape({
        username: yup.string().required('Tên tài khoản đang trống').min(4, 'Tên tài khoản lớn hơn 4 kí tư'),
        name: yup.string().required('Họ và tên đang trống'),
        email: yup.string().required('Email đang trống').email('Email không đúng định dạng'),
        phoneNumber: yup
            .string()
            .required('Số điện thoại đang trống')
            .test('checkNumber', 'Số điện thoại chưa đúng định dạng', (value) => {
                const regex = /^[0-9]+$/;
                return regex.test(value);
            })
            .min(10, 'Số điện thoại lớn hơn 10 kí tư')
            .max(11, 'Số điện thoại nhỏ hơn 11 kí tư'),
        gender: yup.string().required('Giới tính đang trống'),
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const handlegetInfoUser = async () => {
        const savedUserNameUser = localStorage.getItem('userNameUser');

        if (savedUserNameUser) {
            try {
                firstLoadingAPIGet && setLoadingAPIGet(true);

                const [response] = await Promise.all([
                    getUserByUserNameOrEmail(savedUserNameUser),
                    firstLoadingAPIGet && new Promise((resolve) => setTimeout(resolve, 250)),
                ]);

                firstLoadingAPIGet && setLoadingAPIGet(false);

                if (response.status === 200) {
                    setFirstLoadingAPIGet(false);

                    await setValue('username', response.data.username);
                    await setValue('name', response.data.name);
                    await setValue('email', response.data.email);
                    await setValue('phoneNumber', response.data.phoneNumber);
                    await setValue('gender', response.data.gender);
                    await setValue('avatarUrl', response.data.avatarUrl);
                    setInfo({
                        username: response.data.username,
                        name: response.data.name,
                        email: response.data.email,
                        phoneNumber: response.data.phoneNumber,
                        gender: response.data.gender,
                        avatarUrl: response.data.avatarUrl
                    });
                } else {
                    setErrorAPI(true);
                }
            } catch (error) {
                setErrorAPI(true);
            }
        }
    };
    useEffect(() => {
        handlegetInfoUser();
    }, []);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const dataProfile: IInfoProfileUser = {
            username: data.username.trim(),
            name: data.name.trim(),
            email: data.email.trim(),
            phoneNumber: data.phoneNumber.trim(),
            gender: data.gender,
            avatarUrl: data.avatarUrl
        };
        if (info && objectsAreEqual(info, dataProfile)) {
            toast.warning('Thông tin chưa thay đổi');
            return;
        }

        setLoadingAPIUpdate(true);
        const response = await updateAccountProfileOfSignedinAccount(dataProfile);
        setLoadingAPIUpdate(false);

        if (response.status === 200) {
            setInfo(dataProfile);
            toast.success('Cập nhật thành công');
        } else {
            toast.error(response.data.message || response.data.phoneNumber);
        }
    };

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            {isLoadingAPIGet ? (
                <Loading />
            ) : (
                <section className="bg-white p-7 rounded-lg dark:bg-dark-600">
                    <div className="space-y-5 lg:w-5/12 xl:w-5/12 m-auto">
                        {/* <div className="font-bold text-xl text-center">Thông tin cá nhân</div> */}
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            <div className='flex justify-center'>
                                <Image
                                    src={errors.avatarUrl ? true : false}
                                    alt="avatar"
                                    className="size-20 sm:size-40 rounded-full shadow object-cover object-center"
                                />
                            </div>
                            <div>
                                <Controller
                                    name="username"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="filled"
                                            error={errors.username ? true : false}
                                            fullWidth
                                            label={'Tên tài khoản'}
                                            autoComplete="username"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.username?.message}
                                </p>
                            </div>
                            <div>
                                <Controller
                                    name="name"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.name ? true : false}
                                            fullWidth
                                            label={'Họ và tên'}
                                            autoComplete="name"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.name?.message}
                                </p>
                            </div>
                            <div>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.email ? true : false}
                                            fullWidth
                                            label={'Email'}
                                            autoComplete="email"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.email?.message}
                                </p>
                            </div>
                            <div>
                                <Controller
                                    name="gender"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel>{'Giới tính'}</InputLabel>
                                            <Select
                                                {...field}
                                                fullWidth
                                                error={errors.gender ? true : false}
                                                label={'Chọn giới tính'}
                                            >
                                                <MenuItem value={config.Gender.NAM}>Nam</MenuItem>
                                                <MenuItem value={config.Gender.NU}>Nữ</MenuItem>
                                                <MenuItem value={config.Gender.OTHER}>Khác</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.gender?.message}
                                </p>
                            </div>
                            <div>
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.phoneNumber ? true : false}
                                            fullWidth
                                            label={'Số điện thoại'}
                                            autoComplete="phone"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.phoneNumber?.message}
                                </p>
                            </div>

                            <Button type="submit" variant="fill" fullWidth loading={isLoadingAPIUpdate}>
                                Cập nhật
                            </Button>
                        </form>
                    </div>
                </section>
            )}
        </>
    );
};

export default Settings;
