import React, {
    ChangeEventHandler,
    cloneElement,
    CSSProperties,
    FocusEventHandler,
    useEffect,
    useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import { IForm } from '../form';
import { FormFieldHandlers } from './form-field.handlers';
import { FormFieldError } from './form-field-error';
import { formFieldExcludeWatchComponents } from './form-field.watch.config';

export interface IFormFieldProps {
    name: string;
    watch?: boolean;
    className?: string;
    label?: string;
    endLabel?: string;
    required?: string;
    children?: any;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    hasChild?: boolean;
    style?: CSSProperties;
}

export const FormField = ({
    name,
    watch = true,
    className,
    label,
    endLabel,
    required,
    children,
    onChange,
    onBlur,
    hasChild,
    style,
    ...props
}: IFormFieldProps) => {
    const formContext = useFormContext() as IForm;
    const formFieldHandlers = new FormFieldHandlers(children?.props);
    const [touched, setTouched] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const properties: any = {};

    if (hasChild) {
        return (
            <FormFieldRenderer
                name={name}
                formContext={formContext}
                touched={touched}
                className={className}
                endLabel={endLabel}
                label={label}
                required={required}
                renderChildrenAsFunctionChild={false}
                hasChild={hasChild}
                style={style}
            >
                {children}
            </FormFieldRenderer>
        );
    }

    const setDataProps = () => {
        if (!children.props.data) {
            properties.data = formFieldHandlers.getValues(name);
        }
    };

    setDataProps();

    const isDirty = (value: any) => {
        return value !== null || value !== undefined || value !== '';
    };

    const reRender = (e: any) => {
        const isValueChanged = formContext.getValues(name) !== e.target.value;
        if (!getFieldError(formContext.errors, name) && !watchField()) {
            formContext.unregister(name);
            formContext.register({ name: name });
            return true;
        }
        return false;
    };

    const watchField = () => {
        const componentName = children.type.name;
        return !formFieldExcludeWatchComponents.includes(componentName);
    };

    const registerOnChange = () => {
        const existingOnChange = children.props.onChange;
        properties.onChange = (e: any) => {
            if (!touched) {
                setTouched(true);
            }
            if (existingOnChange) {
                existingOnChange(e);
            }

            const value =
                e.target.type === 'checkbox'
                    ? e.target.checked
                    : e.target.value;

            if (!inputValue && !value) {
                return;
            } else if (inputValue !== value) {
                setFormContextValue(value);
            }
        };
    };

    const registerOnBlur = () => {
        const existingOnBlur = children.props.onBlur;
        properties.onBlur = (e: any) => {
            if (!touched) {
                setTouched(true);
            }
            if (existingOnBlur) {
                existingOnBlur(e);
            }

            const type = e.target.type;
            const value =
                type === 'checkbox' ? e.target.checked : e.target.value;

            formFieldHandlers.setValues(name, value);
            setDataProps();

            if (required || type === 'tel') {
                setFormContextValue(value);
            }
        };
    };

    const setFormContextValue = (value: any) => {
        setInputValue(value);
        formContext.setValue(name, value, {
            shouldValidate: true,
            shouldDirty: typeof value === 'boolean' ? value : isDirty(value),
        });
    };

    registerOnChange();
    registerOnBlur();

    (props as any).name = name;
    (props as any).value = inputValue;

    if (watch) {
        (props as any).watch = formContext.watch(name);
    }

    children = cloneElement(children, {
        ...props,
        ...children.props,
        ...properties,
    });

    useEffect(() => {
        formContext.register({ name: name });
    }, [formContext.register]);

    useEffect(() => {
        formContext.unregister(name);
    }, [formContext.unregister]);

    useEffect(() => {
        setInputValue(formContext.getValues(name));
    }, [formContext.getValues(name)]);

    return (
        <FormFieldRenderer
            name={name}
            formContext={formContext}
            touched={touched}
            className={className}
            endLabel={endLabel}
            label={label}
            required={required}
            hasChild={hasChild}
            style={style}
        >
            {children}
        </FormFieldRenderer>
    );
};

const FormFieldRenderer = ({
    name,
    formContext,
    touched,
    className,
    endLabel,
    label,
    required,
    children,
    renderChildrenAsFunctionChild = true,
    hasChild,
    style,
}: any) => {
    const [isTouched, setTouched] = useState(touched);
    useEffect(() => {
        setTouched(touched);
    }, [touched]);
    return (
        <div
            className={classNames(
                'form-field' +
                    (isTouched && getFieldError(formContext.errors, name)
                        ? ' invalid'
                        : ''),
                className,
            )}
            style={style}
        >
            {!endLabel && label ? (
                <RenderLabel name={name} label={label} required={required} />
            ) : null}
            {hasChild && (
                <FormFieldError
                    key={name}
                    name={name}
                    error={getFieldError(formContext.errors, name)}
                    showIcon={true}
                    style={{
                        marginBottom: '1em',
                    }}
                />
            )}
            <div className="form-control">
                <div className="form-input">
                    {!renderChildrenAsFunctionChild
                        ? children
                        : renderChildren(children)}
                </div>
            </div>
            {!hasChild && (
                <FormFieldError
                    key={name}
                    name={name}
                    error={getFieldError(formContext.errors, name)}
                    showIcon={true}
                />
            )}
        </div>
    );
};

const RenderLabel = ({
    name,
    label,
    required,
}: {
    name: string;
    label: any;
    required: any;
}) => {
    return (
        <div className="form-label">
            <label htmlFor={name}>
                {label} {required ? <span>*</span> : null}{' '}
            </label>
        </div>
    );
};

const renderChildren = (children: any) => {
    return children ? (
        typeof children === 'function' ? (
            children(children.props)
        ) : Array.isArray(children) ? (
            children.map((child, index) => {
                return renderChild(child, index.toString());
            })
        ) : (
            renderChild(children)
        )
    ) : (
        <input
            type="text"
            {...children.props.field}
            placeholder={children.props.title}
        />
    );
};

const renderChild = (child: any, key?: string) => {
    return <React.Fragment key={key}>{child}</React.Fragment>;
};

const getFieldError = (errors: any, name: string): any => {
    if (!errors || !name) {
        return undefined;
    }
    if (errors[name]) {
        return errors[name];
    }
    const names = name.split(new RegExp(/[,[\].]+?/)).filter((x) => x);
    if (errors[names[0]]) {
        return getRecursiveError(errors, names, 0);
    }
    return undefined;
};

const getRecursiveError = (
    errors: any,
    names: string[],
    counter: number,
): any => {
    const error = errors[names[counter]];
    if (error && error.message) {
        return error;
    } else if (error) {
        return getRecursiveError(error, names, counter + 1);
    }
    return undefined;
};
