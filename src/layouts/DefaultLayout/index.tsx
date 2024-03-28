import { ReactNode } from 'react';
import Navbar from '../../components/Navbar';

interface DefaultLayoutProps {
    children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div>
            <div className="flex relative">
                <Navbar />
                <div className="w-full p-5 overflow-y-auto scroll-smooth">{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
