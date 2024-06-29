// libs
import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
// types
import { IInfoProfileUserInputUpdate } from '@/types/user';
// apis
import { getUserByUserNameOrEmail } from '@/apis/userApi';

const GetUserInformation = ({
    firstLoadingAPIGet,
    setLoadingAPIGet,
    setFirstLoadingAPIGet,
    setValue,
    setInfo,
    setErrorAPI,
}: {
    firstLoadingAPIGet: boolean;
    setLoadingAPIGet: React.Dispatch<React.SetStateAction<boolean>>;
    setFirstLoadingAPIGet: React.Dispatch<React.SetStateAction<boolean>>;
    setValue: UseFormSetValue<IInfoProfileUserInputUpdate>;
    setInfo: React.Dispatch<React.SetStateAction<IInfoProfileUserInputUpdate | undefined>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const handleGetInfoUser = async () => {
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
                    setInfo({
                        username: response.data.username,
                        name: response.data.name,
                        email: response.data.email,
                        phoneNumber: response.data.phoneNumber,
                        gender: response.data.gender,
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
        handleGetInfoUser();
    }, []);

    return null;
};

export default GetUserInformation;
