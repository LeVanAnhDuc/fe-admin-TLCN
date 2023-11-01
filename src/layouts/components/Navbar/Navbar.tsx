import { useState, useCallback } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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

const LIST_MENU_NAVBAR = [
    {
        title: 'Dashboard',
        children: [
            {
                title: 'Dashboard',
                icon: <Home />,
            },
        ],
    },
    {
        title: 'Product',
        children: [
            {
                title: 'Product',
                icon: <Inventory />,
            },
            {
                title: 'Category',
                icon: <Category />,
            },
        ],
    },
    {
        title: 'Customer',
        children: [
            {
                title: 'Customer',
                icon: <PeopleAlt />,
            },
            {
                title: 'Receipt',
                icon: <Receipt />,
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
                }  h-156 shadow-md overflow-y-auto scroll-smooth hide-scrollbar pt-3`}
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
                            <ListItem key={index2}>
                                <ListItemButton
                                    selected={selectElement.title === item.title && selectElement.value === index2}
                                    onClick={() => handleChangeSelet(item.title, index2)}
                                >
                                    <ListItemIcon>{item2.icon}</ListItemIcon>
                                    {!toggleNavbar && <ListItemText primary={item2.title} />}
                                </ListItemButton>
                            </ListItem>
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
                            {!toggleNavbar && <ListItemText primary="Logout" />}
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </>
    );
};

export default Navbar;
