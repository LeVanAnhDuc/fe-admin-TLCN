// libs
import Logout from '@mui/icons-material/Logout';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// hooks
import { useAuth } from '../../hook/AuthContext';
// dataSources
import { LIST_MENU_NAVBAR } from '../../dataSources';
// others
import config from '../../config';

const Navbar = () => {
    const navigate = useNavigate();
    const { setLogout } = useAuth();

    const handleLogout = () => {
        navigate(config.Routes.logIn);
        setLogout();
    };

    return (
        <>
            <div className="group h-screen space-y-6 bg-primary-200 overflow-hidden py-16 w-24 sticky top-0 hover:w-72 transition-all duration-500 ">
                <div className="pl-4">
                    {LIST_MENU_NAVBAR.map((item, index) => (
                        <NavLink to={item.to} key={index}>
                            {({ isActive }) => (
                                <div
                                    className={`${
                                        isActive ? 'bg-[#f7f5fd] shadow' : ' hover:bg-white/30 z-10 transition'
                                    } flex items-center gap-5 p-4 rounded-l-3xl relative`}
                                >
                                    {isActive && (
                                        <div className="absolute -top-6 right-0 h-6 w-6 rounded-br-full bg-primary-200 shadow-gray-100 shadow-button-sidebar-t"></div>
                                    )}
                                    {item.icon}
                                    <div className="font-semibold hidden group-hover:block truncate">{item.title}</div>
                                    {isActive && (
                                        <div className="absolute -bottom-6 right-0 h-6 w-6 rounded-tr-full bg-primary-200 shadow-gray-100 shadow-button-sidebar-b"></div>
                                    )}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
                <div
                    className="flex items-center gap-5  pl-8 p-4 relative cursor-pointer hover:bg-white/30 transition-all"
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
