// libs
import { Link } from 'react-router-dom';
// components
import Image from '@/components/Image';
import Button from '@/components/Button';
// others
import config from '@/config';
import images from '@/assets/img';

const Error404 = () => (
    <section className="size-full rounded-lg bg-white dark:bg-dark-600 flex flex-col items-center justify-center gap-5 p-10">
        <Image src={images.noFound} alt="noFound" className="size-96" />
        <Link to={config.Routes.home}>
            <Button variant="fill">Quay lại trang chủ</Button>
        </Link>
    </section>
);

export default Error404;
