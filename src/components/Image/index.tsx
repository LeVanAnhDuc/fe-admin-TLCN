import React from 'react';
import { forwardRef, useState } from 'react';
import noImage from '../../assets/img/no-image.png';

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
    fallback?: string;
    [key: string]: unknown;
}

const Image = forwardRef(
    (
        { src, alt, className, fallback: customImage = noImage, ...props }: ImageProps,
        ref: React.Ref<HTMLImageElement>,
    ) => {
        const [fallback, setFallBack] = useState('');

        const handleError = () => {
            setFallBack(customImage);
        };

        return <img className={className} ref={ref} src={fallback || src} alt={alt} {...props} onError={handleError} />;
    },
);

export default Image;
