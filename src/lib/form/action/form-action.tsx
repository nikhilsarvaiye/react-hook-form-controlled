import { ReactNode } from 'react';

export const FormAction = ({ children }: { children?: any }) => {
    return (
        <div className="form-action">
            <div className="form-control">{children}</div>
        </div>
    );
};
