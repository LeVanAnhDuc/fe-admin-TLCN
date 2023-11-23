import config from '../config/index';
import DetailBill from '../pages/DetailBill/DetailBill';
import DetailCategory from '../pages/DetailCategory/DetailCategory';
import DetailCustomer from '../pages/DetailCustomer/DetailCustomer';
import DetailProduct from '../pages/DetailProduct/DetailProduct';
import Home from '../pages/Home/Home';
import ListBill from '../pages/ListBill/ListBill';
import ListCategory from '../pages/ListCategory/ListCategory';
import ListCustomer from '../pages/ListCustomer/ListCustomer';
import ListProduct from '../pages/ListProduct/ListProduct';
import LogIn from '../pages/LogIn/LogIn';

import Error404 from '../pages/Error404';
import AddProduct from '../pages/AddlProduct/AddProduct';
type TRouters = {
    path: string;
    component: React.ComponentType;
    layout?: React.ComponentType | null;
};
const publishRoute: Array<TRouters> = [
    { path: config.Routes.home, component: Home },

    { path: config.Routes.detailBill, component: DetailBill },
    { path: config.Routes.detailCategory, component: DetailCategory },
    { path: config.Routes.detailCustomer, component: DetailCustomer },

    { path: config.Routes.detailProduct, component: DetailProduct },
    { path: config.Routes.addProduct, component: AddProduct },

    { path: config.Routes.listBill, component: ListBill },
    { path: config.Routes.listCategory, component: ListCategory },
    { path: config.Routes.listCustomer, component: ListCustomer },
    { path: config.Routes.listProduct, component: ListProduct },

    { path: config.Routes.logIn, component: LogIn, layout: null },

    { path: config.Routes.error, component: Error404, layout: null },
];

// required sign in
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const privateRoute: any[] = [
    { path: config.Routes.logIn, component: LogIn, layout: null },

    { path: config.Routes.error, component: Error404, layout: null },
];

export { publishRoute, privateRoute };
