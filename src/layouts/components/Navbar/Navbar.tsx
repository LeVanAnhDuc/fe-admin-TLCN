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
import Logout from '@mui/icons-material/Logout';
import KeyboardDoubleArrowLeft from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRight from '@mui/icons-material/KeyboardDoubleArrowRight';
import config from '../../../config';
import { Link } from 'react-router-dom';

const LIST_MENU_NAVBAR = [
    {
        title: 'Dashboard',
        children: [
            {
                title: 'Dashboard',
                icon: <Home />,
                to: config.Routes.home,
            },
        ],
    },
    {
        title: 'Product',
        children: [
            {
                title: 'Product',
                icon: <Inventory />,
                to: config.Routes.listProduct,
            },
            {
                title: 'Category',
                icon: <Category />,
                to: config.Routes.listCategory,
            },
        ],
    },
    {
        title: 'Customer',
        children: [
            {
                title: 'Customer',
                icon: <PeopleAlt />,
                to: config.Routes.listCustomer,
            },
            {
                title: 'Receipt',
                icon: <Receipt />,
                to: config.Routes.listBill,
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
    return (
        <>
            <div
                className={`${
                    toggleNavbar ? 'w-[110px] sm:w-[100px]' : 'w-full sm:w-80'
                }  h-156 shadow-md overflow-y-auto scroll-smooth hide-scrollbar pt-3 bg-navbar`}
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
                {LIST_MENU_NAVBAR.map((item, index) => (
                    <List key={index} component="nav">
                        <div className="pl-5 text-gray-400 text-xs">{item.title}</div>
                        {item.children.map((item2, index2) => (
                            <Link to={item2.to}>
                                <ListItem key={index2}>
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
                    <div className="pl-5 text-gray-400 text-xs">Log out</div>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            {!toggleNavbar && <span className="font-medium">Logout</span>}
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </>
    );
};

export default Navbar;
