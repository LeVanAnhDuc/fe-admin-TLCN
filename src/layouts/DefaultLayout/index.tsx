import Header from '../components/Header/Header';
import Navbar from '../components/Navbar/Navbar';
import { ReactNode } from 'react';

interface DefaultLayoutProps {
    children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div>
            <Header />
            <div className="flex flex-row ">
                <Navbar />
                <div className="w-full p-5 h-156 overflow-y-auto scroll-smooth">{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
