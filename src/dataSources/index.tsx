// libs
import Home from '@mui/icons-material/Home';
import Inventory from '@mui/icons-material/Inventory';
import Category from '@mui/icons-material/Category';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import Receipt from '@mui/icons-material/Receipt';
import TrendingUp from '@mui/icons-material/TrendingUp';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
// others
import config from '../config';

export const LIST_MENU_NAVBAR = [
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

export const X_LABELS_YEAR = ['T 1', 'T 2', 'T 3', 'T 4', 'T 5', 'T 6', 'T 7', 'T 8', 'T 9', 'T 10', 'T 11', 'T 12'];
