import Home from '@mui/icons-material/Home';
import Inventory from '@mui/icons-material/Inventory';
import Category from '@mui/icons-material/Category';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import Receipt from '@mui/icons-material/Receipt';
import TrendingUp from '@mui/icons-material/TrendingUp';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import Logout from '@mui/icons-material/Logout';

import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import config from '../../config';
import { useAuth } from '../../hook/AuthContext';

const LIST_MENU_NAVBAR = [
    {
        title: 'Trang chủ',
        icon: <Home />,
        to: config.Routes.home,
    },
    {
        title: 'Doanh thu',
        icon: <TrendingUp />,
        to: config.Routes.revenue,
    },
    {
        title: 'Sản phẩm',
        icon: <Inventory />,
        to: config.Routes.listProduct,
    },
    {
        title: 'Danh mục',
        icon: <Category />,
        to: config.Routes.listCategory,
    },

    {
        title: 'Người dùng',
        icon: <PeopleAlt />,
        to: config.Routes.listCustomer,
    },
    {
        title: 'Đơn hàng',
        icon: <Receipt />,
        to: config.Routes.listBill,
    },

    {
        title: 'Tài khoản',
        icon: <AdminPanelSettings />,
        to: config.Routes.profileSetting,
    },
];

const Navbar = () => {
    const navigate = useNavigate();
    const { setLogout } = useAuth();

    const handleLogout = () => {
        navigate(config.Routes.logIn);
        setLogout();
    };

    return (
        <>
            <div className="group h-screen space-y-6 bg-primary-200 overflow-hidden py-16 w-24 rounded-r-3xl sticky top-0 hover:w-80 transition-all duration-500 ">
                <div className="pl-4">
                    {LIST_MENU_NAVBAR.map((item, index) => (
                        <NavLink to={item.to} key={index}>
                            {({ isActive }) => (
                                <div
                                    className={`${
                                        isActive ? 'bg-gray-100 shadow' : ' hover:bg-white/20 z-10 transition'
                                    } flex items-center gap-5 p-4 rounded-l-3xl  relative`}
                                >
                                    {isActive && (
                                        <div className="absolute -top-6 right-0 h-6 w-6 rounded-br-full bg-primary-200 shadow-gray-100 shadow-button-sidebar-t"></div>
                                    )}
                                    {item.icon}
                                    <div className="font-semibold  hidden group-hover:block truncate">{item.title}</div>
                                    {isActive && (
                                        <div className="absolute -bottom-6 right-0 h-6 w-6 rounded-tr-full bg-primary-200 shadow-gray-100 shadow-button-sidebar-b"></div>
                                    )}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
                <div className="h-0.5 w-full bg-dark-200"></div>
                <div
                    className="flex items-center gap-5  pl-8 p-4 relative cursor-pointer hover:bg-white/20 transition-all"
                    onClick={handleLogout}
                >
                    <Logout />
                    <div className="font-semibold  hidden group-hover:block truncate">Đăng xuất</div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
