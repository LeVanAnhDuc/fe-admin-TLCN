import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../components/Navbar';
import { checkExpiredToken } from '../../apis/authApi';
import { useAuth } from '../../hook/AuthContext';

interface DefaultLayoutProps {
    children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
    const navigate = useNavigate();
    const { setLogout } = useAuth();

    const handleCheckToken = async (token: string) => {
        const response = await checkExpiredToken(token);
        if (response.status !== 200) {
            setLogout();
            navigate('/');
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            handleCheckToken(accessToken);
        }
    }, []);

    return (
        <div>
            <div className="flex relative bg-gray-100">
                <Navbar />
                <div className="w-full p-5 overflow-y-auto scroll-smooth">{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
