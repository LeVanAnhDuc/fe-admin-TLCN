import { ReactNode } from 'react';
import Navbar from '../../components/Navbar/Navbar';

interface DefaultLayoutProps {
    children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div>
            <div className="flex flex-row min-h-screen">
                <Navbar />
                <div className="w-full p-5 h-screen overflow-y-auto scroll-smooth">{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
