import React from 'react';
import { forwardRef, useState } from 'react';
// import classNames from 'classnames';

// import images from '../../assets/images';
// import styles from './Image.module.scss';

// fallback: customImage = images.noImage
// fallback: customImage : đổi tên để kh trùng. Gắn mặc định là images.noImage nếu không truyền từ ngoài vào

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
    fallback?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Sử dụng [key: string]: any để chấp nhận bất kỳ props nào
  }

  const Image = forwardRef(({
    src,
    alt,
    className,
    fallback: customImage = 'images.noImage', // Đặt mặc định nếu không được truyền
    ...props
  }: ImageProps, ref: React.Ref<HTMLImageElement>) => {
    const [fallback, setFallBack] = useState('');

    const handleError = () => {
        setFallBack(customImage);
    };

    return <img className={className} ref={ref} src={fallback || src} alt={alt} {...props} onError={handleError} />;
});

export default Image;
