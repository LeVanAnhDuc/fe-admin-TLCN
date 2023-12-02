import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

import InputText from '../../components/InputText/InputText';
import config from '../../config';
import { IInfoProfileUser } from '../../interface/user';
import { getUserByUserNameOrEmail, updateAccountProfileOfSignedinAccount } from '../../apis/userApi';

const Profile = () => {
    // change gender
    const [genderUser, setGenderUser] = useState<string>('');
    const handleChangeGender = (e: SelectChangeEvent) => {
        setGenderUser(e.target.value);
    };
    // get data info user
    const handlegetInfoUser = async () => {
        const savedInfoUser = localStorage.getItem('userNameUser');

        if (savedInfoUser) {
            try {
                const response = await getUserByUserNameOrEmail(savedInfoUser);

                if (response.status === 200) {
                    await setValue('username', response.data.username);
                    await setValue('name', response.data.name);
                    await setValue('email', response.data.email);
                    await setValue('phoneNumber', response.data.phoneNumber);
                    await setValue('gender', response.data.gender);

                    await setGenderUser(response.data.gender);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error('Đang bảo trì');
            }
        }
    };
    useEffect(() => {
        handlegetInfoUser();
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IInfoProfileUser>();
    // submit form
    const onSubmit: SubmitHandler<IInfoProfileUser> = async (data) => {
        //  call api doi update thong tin
        const response = await updateAccountProfileOfSignedinAccount(data);

        if (response.status === 200) {
            toast.success('Cập nhật thông tin thành công');
        } else {
            toast.error(response.data.message || response.data.phoneNumber);
        }
    };

    return (
        <>
            <div className=" relative  my-10">
                {/* start account setting */}
                <div className="mb-5 font-semibold text-xl">Thông tin cá nhân</div>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* start input FullName */}
                    <InputText
                        labelInput="Name"
                        errorInput={errors.name ? true : false}
                        isRequired
                        errorFormMessage={errors.name?.message}
                        register={{
                            ...register('name', {
                                required: ' Name is required',
                            }),
                        }}
                    />

                    {/* end input FullName */}
                    {/* start input Username */}
                    <InputText
                        labelInput="User Name"
                        errorInput={errors.username ? true : false}
                        isRequired
                        errorFormMessage={errors.username?.message}
                        register={{
                            ...register('username', {
                                required: 'User Name is required',
                                pattern: /^[A-Za-z0-9]{4,}$/,
                            }),
                        }}
                        disabled
                    />

                    {/* end input Username */}
                    {/* start input email */}
                    <InputText
                        labelInput="Email"
                        errorInput={errors.email ? true : false}
                        isRequired
                        typeInput="email"
                        errorFormMessage={errors.email?.message}
                        autoComplete="username"
                        register={{
                            ...register('email', {
                                required: 'Email is required',
                                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            }),
                        }}
                    />

                    {/* end input email */}
                    {/* start input gender */}
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">Giới tính</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                            input={<OutlinedInput label="Giới tính" />}
                            fullWidth
                            error={errors.gender ? true : false}
                            {...register('gender')}
                            value={genderUser}
                            onChange={handleChangeGender}
                        >
                            <MenuItem value={config.Gender.NAM}>{config.Gender.NAM}</MenuItem>
                            <MenuItem value={config.Gender.NU}>{config.Gender.NU}</MenuItem>
                            <MenuItem value={config.Gender.ORTHER}>{config.Gender.ORTHER}</MenuItem>
                        </Select>
                    </FormControl>
                    {/* end input gender */}
                    {/* start input phone */}
                    <InputText
                        labelInput="Phone must contain 10 digits"
                        typeInput="number"
                        errorInput={errors.phoneNumber ? true : false}
                        isRequired
                        errorFormMessage={errors.phoneNumber?.message}
                        autoComplete="phone"
                        register={{
                            ...register('phoneNumber', {
                                required: 'Phone is required',
                                pattern: /^[0-9]{10,}$/,
                            }),
                        }}
                    />
                    {/* end input phone */}
                    <Button
                        style={{ float: 'right' }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                    >
                        Cập nhật
                    </Button>
                </form>
            </div>
            {/* end account setting */}
        </>
    );
};

export default Profile;
