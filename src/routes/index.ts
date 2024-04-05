import config from '../config/index';
import DetailOrder from '../pages/DetailOrder';
import DetailCategory from '../pages/DetailCategory';
import DetailCustomer from '../pages/DetailCustomer';
import DetailProduct from '../pages/DetailProduct';
import Home from '../pages/Home';
import ListOrder from '../pages/ListOrder';
import ListCategory from '../pages/ListCategory';
import ListCustomer from '../pages/ListCustomer';
import ListProduct from '../pages/ListProduct';
import LogIn from '../pages/LogIn';

import Error404 from '../pages/Error404';
import AddProduct from '../pages/AddlProduct';
import RevenueStatistics from '../pages/RevenueStatistics';
import Profile from '../pages/Profile';
import ForgotPassWord from '../pages/ForgotPassWord/ForgotPassWord';
type TRouters = {
    path: string;
    component: React.ComponentType;
    layout?: React.ComponentType | null;
};

const publishRoute: Array<TRouters> = [
    { path: config.Routes.home, component: Home },
    { path: config.Routes.revenue, component: RevenueStatistics },

    { path: config.Routes.detailOrderID, component: DetailOrder },
    { path: config.Routes.detailCategoryID, component: DetailCategory },
    { path: config.Routes.detailCustomerID, component: DetailCustomer },

    { path: config.Routes.detailProductID, component: DetailProduct },
    { path: config.Routes.addProduct, component: AddProduct },

    { path: config.Routes.listBill, component: ListOrder },
    { path: config.Routes.listCategory, component: ListCategory },
    { path: config.Routes.listCustomer, component: ListCustomer },
    { path: config.Routes.listProduct, component: ListProduct },

    { path: config.Routes.profileSetting, component: Profile },

    { path: config.Routes.logIn, component: LogIn, layout: null },
    { path: config.Routes.forgotPass, component: ForgotPassWord, layout: null },

    { path: config.Routes.error, component: Error404, layout: null },
];

const privateRoute: Array<TRouters> = [
    { path: config.Routes.logIn, component: LogIn, layout: null },
    { path: config.Routes.forgotPass, component: ForgotPassWord, layout: null },
    { path: config.Routes.error, component: Error404, layout: null },
];

export { publishRoute, privateRoute };
