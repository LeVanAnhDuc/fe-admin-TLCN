// libs
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Avatar from '@mui/material/Avatar';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// types
import IUser from '@/types/user';
// others
import config from '@/config';

const DetailCustomer = () => {
    const navigate = useNavigate();
    const { idUser } = useParams();
    const location = useLocation();

    const [avatar, setAvatar] = useState<string>('');

    const getCustomer = () => {
        if (location.state.userDetail) {
            const dataUserDetail = location.state.userDetail;

            setAvatar(dataUserDetail.avatarUrl);
            setValue('createdDate', dataUserDetail.createdDate);
            setValue('email', dataUserDetail.email);
            setValue('gender', dataUserDetail.gender || ' ');
            setValue('isEnabled', dataUserDetail.isEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt');
            setValue('lastModifiedBy', dataUserDetail.lastModifiedBy);
            setValue('lastModifiedDate', dataUserDetail.lastModifiedDate);
            setValue('locked', dataUserDetail.locked ? 'Đang bị khóa' : 'Đang sử dụng');
            setValue('name', dataUserDetail.name || ' ');
            setValue('phoneNumber', dataUserDetail.phoneNumber || ' ');
            setValue('username', dataUserDetail.username);
        } else {
            navigate(config.Routes.listCustomer);
        }
    };

    const { control, setValue } = useForm<IUser>();

    useEffect(() => {
        getCustomer();
    }, []);

    return (
        <>
            <section className="space-y-5 max-w-[1240px] m-auto">
                <div className="flex flex-wrap justify-between items-center gap-2">
                    <Breadcrumbs className="!font-medium">
                        <Link
                            to={config.Routes.listCustomer}
                            className="font-semibold decoration-primary-700 decoration-1 underline-offset-2 transition hover:underline hover:text-primary-700"
                        >
                            <ArrowBackIcon fontSize="small" className="mr-2 mb-1" />
                            Người dùng
                        </Link>
                        <div>{idUser}</div>
                    </Breadcrumbs>
                </div>

                <div className="flex flex-col items-center sm:items-start sm:flex-row  gap-4 space-y-2 sm:space-y-0">
                    <Avatar
                        src={avatar}
                        alt="avatar"
                        className="!size-36 sm:!size-40 !rounded-lg shadow object-cover object-center bg-white p-1"
                    />
                    <form className="space-y-5 size-full bg-white p-5 rounded-lg">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Controller
                                name="username"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="filled"
                                        label="Tên tài khoản"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="filled"
                                        label="Tên người dùng"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="gender"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="filled"
                                        label="Giới tính"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="filled"
                                        label="Email người dùng"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="phoneNumber"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="filled"
                                        label="Số điện thoại"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Controller
                                name="createdDate"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="filled"
                                        label="Ngày tạo tài khoản"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="locked"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="filled"
                                        label="Trạng thái tài khoản"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="isEnabled"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="filled"
                                        label="Trạng thái kích hoạt"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default DetailCustomer;
