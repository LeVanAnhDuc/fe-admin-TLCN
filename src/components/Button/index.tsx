import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link, LinkProps } from 'react-router-dom';

import { useEffect } from 'react';

const cx = classNames.bind(styles);

// ... passProps là gồm tất cả các giá trị mà cha truyền vào

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    to?: string;
    href?: string;
    onClick?: () => void;
    disable?: boolean;
    custom?: boolean;
  }

function Button({
    children,
    className,
    to,
    href,
    onClick,
    disable = false,
    custom = false,
    ...passProps
}:ButtonProps) {
    let Comp: string | React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>> = 'button';

/* eslint-disable @typescript-eslint/no-explicit-any */
    const props: any = {
        onClick,
        ...passProps,
    };

    // Remove event handle when button is disable
    if (disable) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    // Handle switch router dom or export
    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }

    // Add class by ES6
    const classs = {
        disable,
    };

    useEffect(() => {
        // Cuộn về đầu trang khi component đã mount
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Cuộn mượt hơn
        });
    }, []);

    return (
        <>
            {custom ? (
                <Comp className={cx('button', classs, className)} {...props}>
                    <span className={cx('button_lg')}>
                        <span className={cx('button_sl')}></span>
                        <span className={cx('button_text')}>{children}</span>
                    </span>
                </Comp>
            ) : (
                <Comp className={cx('cssbuttons-io-button', classs, className)} {...props}>
                    {children}
                    <div className={cx('icon')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                                fill="currentColor"
                                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                            ></path>
                        </svg>
                    </div>
                </Comp>
            )}
        </>
    );
}

export default Button;
