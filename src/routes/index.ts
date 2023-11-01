import config from '../config/index';

import Error404 from '../pages/Error404';

import Home from '../pages/Home/Home';
import LogIn from '../pages/LogIn/LogIn';

const publishRoute = [
    { path: config.Routes.home, component: Home },

    { path: config.Routes.logIn, component: LogIn },

    { path: config.Routes.error, component: Error404, layout: null },
];

// required sign in
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const privateRoute: any[] = [];

export { publishRoute, privateRoute };
