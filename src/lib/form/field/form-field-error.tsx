import { CSSProperties, Fragment } from 'react';
import { FieldError, FieldErrors } from 'react-hook-form/dist/types/errors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export class Error {
    name: string = '';
    errorText: string = '';
}

export const FormFieldError = ({
    name,
    error,
    showIcon = false,
    style,
}: {
    name: string;
    error: any;
    showIcon?: boolean;
    style?: CSSProperties;
}) => {
    const getErrors = () => {
        if (!error) {
            return [];
        }
        const errors = [];
        if (typeof error === 'string') {
            errors.push({
                name: name,
                errorText: error,
            });
        } else if (Array.isArray(error)) {
            const fieldErrors: Error[] = [];
            (error as FieldErrors).forEach((x: FieldError, index: number) => {
                for (const key in x) {
                    if (key !== 'type') {
                        fieldErrors.push({
                            name: key,
                            errorText: error[key as any],
                        });
                    }
                }
            });
            errors.push(
                ...[
                    {
                        name: name,
                        errorText: `Kindly resolve errors with ${fieldErrors
                            .map((x) => x.name)
                            .filter(
                                (
                                    value: string,
                                    index: number,
                                    self: string[],
                                ) => self.indexOf(value) === index,
                            )
                            .join(',')}`,
                    },
                ],
                ...fieldErrors,
            );
        } else if (typeof error === 'object') {
            for (const key in error) {
                if (key !== 'type') {
                    errors.push({
                        name: key,
                        errorText: error[key],
                    });
                }
            }
        }
        return errors;
    };

    const errors = getErrors();

    return (
        <Fragment>
            {errors.length ? (
                <div className="form-error" style={style}>
                    <div className="form-error-content">
                        <i className="arrow up"></i>
                        {showIcon && (
                            <span className="icon">
                                <FontAwesomeIcon
                                    size={'lg'}
                                    icon={faExclamationTriangle}
                                />
                            </span>
                        )}
                        {errors.map((error, index) => {
                            return (
                                <div key={index} className="text">
                                    {error.errorText}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </Fragment>
    );
};
