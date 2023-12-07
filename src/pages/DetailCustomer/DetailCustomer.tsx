import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';

import InputText from '../../components/InputText/InputText';
import config from '../../config';
import IUser from '../../interface/user';
import { getSingleUserByID } from '../../apis/userApi';
import Avatar from '@mui/material/Avatar';

const DetailCustomer = () => {
    const navigate = useNavigate();
    // handle get id
    const location = useLocation();
    const idUser = location.hash.substring(1);

    // avatar
    const [avatar, setAvatar] = useState<string>('');

    // handle get data
    const getCustomer = async (id: number) => {
        try {
            if (idUser && !isNaN(+idUser)) {
                // tồn tai ma san pham và phải là số
                const response = await getSingleUserByID(id);
                if (response.status === 200) {
                    setAvatar(response.data.avatarUrl);

                    setValue('createdDate', response.data.createdDate);
                    setValue('email', response.data.email);
                    setValue('gender', response.data.gender);
                    if (response.data.isEnabled) {
                        setValue('isEnabled', 'Đã kích hoạt');
                    } else {
                        setValue('isEnabled', 'Chưa kích hoạt ');
                    }
                    setValue('lastModifiedBy', response.data.lastModifiedBy);
                    setValue('lastModifiedDate', response.data.lastModifiedDate);
                    if (response.data.locked) {
                        setValue('locked', 'Đang bị khóa');
                    } else {
                        setValue('locked', 'Không khóa');
                    }
                    setValue('name', response.data.name);
                    setValue('phoneNumber', response.data.phoneNumber);
                    setValue('username', response.data.username);
                } else {
                    toast.error(response.data.message);
                    navigate(config.Routes.listCustomer);
                }
            } else {
                navigate(config.Routes.listCustomer);
            }
        } catch {
            toast.error('Đang bảo trì');
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<{ [key: string]: string | number | boolean } | IUser>({});

    // submit form
    const onSubmit: SubmitHandler<{ [key: string]: string | number | boolean } | IUser> = () => {};

    useEffect(() => {
        getCustomer(+idUser);
    }, [idUser]);
    return (
        <>
            <div className="flex flex-wrap justify-between pb-3 gap-5">
                <Link to={config.Routes.listCustomer}>
                    <Button variant="contained">
                        <KeyboardArrowLeft />
                        <span className="normal-case">Danh sách KH</span>
                    </Button>
                </Link>
            </div>
            <div className="w-full flex place-content-center my-5">
                <Avatar src={avatar} sx={{ width: 200, height: 200 }} />
            </div>
            <div className="my-5">
                {/* start info user */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <InputText
                            labelInput="Tên tài khoản"
                            errorInput={errors.username ? true : false}
                            errorFormMessage={errors.username?.message}
                            register={{
                                ...register('username', {
                                    required: 'username is required',
                                }),
                            }}
                            readOnly
                        />
                        <InputText
                            labelInput="Tên"
                            errorInput={errors.name ? true : false}
                            errorFormMessage={errors.name?.message}
                            register={{
                                ...register('name'),
                            }}
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <InputText
                            labelInput="Email"
                            errorInput={errors.email ? true : false}
                            errorFormMessage={errors.email?.message}
                            register={{
                                ...register('email'),
                            }}
                            readOnly
                        />

                        <InputText
                            labelInput="Giới tính"
                            errorInput={errors.gender ? true : false}
                            errorFormMessage={errors.gender?.message}
                            register={{
                                ...register('gender'),
                            }}
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <InputText
                            labelInput="Số điện thoại"
                            errorInput={errors.phoneNumber ? true : false}
                            errorFormMessage={errors.phoneNumber?.message}
                            register={{
                                ...register('phoneNumber', {
                                    required: 'phoneNumber is required',
                                }),
                            }}
                            readOnly
                        />

                        <InputText
                            labelInput="Ngày tạo"
                            errorInput={errors.createdDate ? true : false}
                            errorFormMessage={errors.createdDate?.message}
                            register={{
                                ...register('createdDate', {
                                    required: 'createdDate is required',
                                }),
                            }}
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <InputText
                            labelInput="Trạng thái khóa tài khoản"
                            errorInput={errors.locked ? true : false}
                            errorFormMessage={errors.locked?.message}
                            register={{
                                ...register('locked', {
                                    required: 'locked is required',
                                }),
                            }}
                            readOnly
                        />
                        <InputText
                            labelInput="Trạng thái kích hoạt"
                            errorInput={errors.isEnabled ? true : false}
                            errorFormMessage={errors.isEnabled?.message}
                            register={{
                                ...register('isEnabled', {
                                    required: 'isEnabled is required',
                                }),
                            }}
                            readOnly
                        />
                    </div>
                    {/* end input isEnabled  */}
                    {/* start input  lastModifiedBy and lastModifiedDate  */}
                    {/* <InputText
                        labelInput="Người chỉnh sửa cuối"
                        errorInput={errors.lastModifiedBy ? true : false}
                        errorFormMessage={errors.lastModifiedBy?.message}
                        register={{
                            ...register('lastModifiedBy', {
                                required: 'lastModifiedBy is required',
                            }),
                        }}
                        readOnly
                    />
                    <InputText
                        labelInput="Ngày chỉnh sửa cuối"
                        errorInput={errors.lastModifiedDate ? true : false}
                        errorFormMessage={errors.lastModifiedDate?.message}
                        register={{
                            ...register('lastModifiedDate', {
                                required: 'lastModifiedDate is required',
                            }),
                        }}
                        readOnly
                    /> */}
                    {/* end input lastModifiedBy and lastModifiedDate */}
                </form>
            </div>
            {/* end info user */}
        </>
    );
};

export default DetailCustomer;
