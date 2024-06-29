// libs
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
// types
import { IInfoProfileUserInputUpdate } from '@/types/user';
// components
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Error404 from '../Error404';
// apis
import { updateAccountProfileOfSignedInAccount } from '@/apis/userApi';
// ghosts
import GetUserInformation from './ghosts/GetUserInformation';
// others
import config from '@/config';
import { objectsAreEqual } from '@/utils/checkData';

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

const Settings = () => {
    const [firstLoadingAPIGet, setFirstLoadingAPIGet] = useState<boolean>(true);
    const [isLoadingAPIGet, setLoadingAPIGet] = useState<boolean>(false);
    const [isLoadingAPIUpdate, setLoadingAPIUpdate] = useState<boolean>(false);
    const [info, setInfo] = useState<IInfoProfileUserInputUpdate>();
    const [errorAPI, setErrorAPI] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IInfoProfileUserInputUpdate>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<IInfoProfileUserInputUpdate> = async (data) => {
        const dataProfile: IInfoProfileUserInputUpdate = {
            username: data.username.trim(),
            name: data.name.trim(),
            email: data.email.trim(),
            phoneNumber: data.phoneNumber.trim(),
            gender: data.gender,
        };
        if (info && objectsAreEqual(info, dataProfile)) {
            toast.warning('Thông tin chưa thay đổi');
            return;
        }

        setLoadingAPIUpdate(true);
        const response = await updateAccountProfileOfSignedInAccount(dataProfile);
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
            <GetUserInformation
                {...{
                    firstLoadingAPIGet,
                    setLoadingAPIGet,
                    setFirstLoadingAPIGet,
                    setValue,
                    setInfo,
                    setErrorAPI,
                }}
            />
            {isLoadingAPIGet ? (
                <Loading />
            ) : (
                <section className="bg-white m-auto max-w-[768px] p-10 rounded-lg min-h-full dark:bg-dark-600">
                    <div className="space-y-5">
                        <div className="font-bold text-xl text-center">Thông tin tài khoản</div>
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
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
                                            <InputLabel>{'Chọn giới tính'}</InputLabel>
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
