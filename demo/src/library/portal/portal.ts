import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

const containerId = 'portal';

interface IProps {
    children: ReactNode[];
}

export const Portal = ({ children }: IProps) => {
    /*
    const mount = document.getElementById(containerId);
    const el = document.createElement('div');

    useEffect(() => {
        mount.appendChild(el);
        return () => mount.removeChild(el);
    }, [el, mount]);
    */

    return createPortal(children, (<any>document).getElementById(containerId));
};
