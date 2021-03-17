import { CSSProperties, MouseEventHandler } from 'react';
import classNames from 'classnames';
import './label.scss';

export interface ILabelProps {
    name?: string;
    title: string;
    required?: string;
    link?: boolean;
    href?: string;
    className?: string;
    style?: CSSProperties;
    disabled?: boolean;
    onClick?:
        | MouseEventHandler<HTMLAnchorElement>
        | MouseEventHandler<HTMLLabelElement>;
}

export const Label = ({
    name,
    title,
    required,
    link,
    className,
    style,
    disabled,
    onClick,
    href,
}: ILabelProps) => {
    className = link ? classNames('link', className) : classNames('label', className);

    return link ? (
        <a
            onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
            href={href}
            className={className}
            style={style}
        >
            {title} {required ? <span>*</span> : null}
        </a>
    ) : (
        <label
            htmlFor={name}
            onClick={onClick as MouseEventHandler<HTMLLabelElement>}
            className={className}
            style={style}
        >
            {title} {required ? <span>*</span> : null}{' '}
        </label>
    );
};
