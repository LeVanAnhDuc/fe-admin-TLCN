import { useState, useCallback } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import Home from '@mui/icons-material/Home';
import Inventory from '@mui/icons-material/Inventory';
import Category from '@mui/icons-material/Category';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import Receipt from '@mui/icons-material/Receipt';
import TrendingUp from '@mui/icons-material/TrendingUp';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import Logout from '@mui/icons-material/Logout';
import KeyboardDoubleArrowLeft from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRight from '@mui/icons-material/KeyboardDoubleArrowRight';
import config from '../../../config';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hook/AuthContext';

const LIST_MENU_NAVBAR = [
    {
        title: 'Trang chủ',
        children: [
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
        ],
    },
    {
        title: 'Sản phẩm',
        children: [
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
        ],
    },
    {
        title: 'Khách hàng',
        children: [
            {
                title: 'Khách hàng',
                icon: <PeopleAlt />,
                to: config.Routes.listCustomer,
            },
            {
                title: 'Hóa đơn',
                icon: <Receipt />,
                to: config.Routes.listBill,
            },
        ],
    },
    {
        title: 'Cài đặt',
        children: [
            {
                title: 'Tài khoản',
                icon: <AdminPanelSettings />,
                to: config.Routes.profileSetting,
            },
        ],
    },
];

const Navbar = () => {
    const [selectElement, setSelectElement] = useState({ title: '', value: 0 });
    const [toggleNavbar, setToggleNavbar] = useState(false);
    const handleChangeSelet = (title: string, number: number) => {
        setSelectElement({ title, value: number });
    };
    const handleChangeToggle = useCallback(() => {
        setToggleNavbar((prev) => !prev);
    }, []);

    // logout
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => {
        localStorage.removeItem('tokenType');
        localStorage.removeItem('accessToken');
        navigate(config.Routes.logIn);
        logout();
    };

    const userName = localStorage.getItem('userNameUser');

    return (
        <>
            <div
                className={`${
                    toggleNavbar ? 'w-[110px] sm:w-[100px]' : 'w-full sm:w-80'
                }   h-screen shadow-md overflow-y-auto scroll-smooth hide-scrollbar pt-3 bg-navbar`}
            >
                <div className="flex justify-end pr-2 md:pr-3">
                    <Button
                        sx={{
                            backgroundColor: 'white',
                        }}
                        variant="outlined"
                        onClick={handleChangeToggle}
                    >
                        {toggleNavbar ? <KeyboardDoubleArrowRight /> : <KeyboardDoubleArrowLeft />}
                    </Button>
                </div>
                <div className="py-5 flex place-content-center place-items-center text-lg">
                    {!toggleNavbar && <span className="pr-1">Xin chào </span>}
                    <span className="font-bold">{userName}</span>
                </div>
                <Divider />
                {LIST_MENU_NAVBAR.map((item, index) => (
                    <List key={index} component="nav">
                        <div className="pl-5 text-gray-400 text-xs">{item.title}</div>
                        {item.children.map((item2, index2) => (
                            <Link to={item2.to} key={index2}>
                                <ListItem>
                                    <ListItemButton
                                        selected={selectElement.title === item.title && selectElement.value === index2}
                                        onClick={() => handleChangeSelet(item.title, index2)}
                                    >
                                        <ListItemIcon>{item2.icon}</ListItemIcon>
                                        {!toggleNavbar && <span className="font-medium">{item2.title}</span>}
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                ))}
                <Divider />
                <List component="nav">
                    <div className="pl-5 text-gray-400 text-xs">Đăng xuất</div>
                    <ListItem>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            {!toggleNavbar && <span className="font-medium">Đăng xuất</span>}
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </>
    );
};

export default Navbar;
