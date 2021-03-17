import {
    useState,
    useEffect,
    useRef,
    ReactNode,
    ChangeEventHandler,
    FocusEventHandler,
    FocusEvent,
    KeyboardEventHandler,
    KeyboardEvent,
    RefObject,
    MouseEventHandler,
    ChangeEvent,
} from 'react';
import classNames from 'classnames';
import { useDebounce } from '@util/debounce';
import { EventKeys } from '@util/event-keys';
import './input.scss';

export enum InputType {
    Text = 'text',
    Hidden = 'hidden',
}

export enum InputSize {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
}

export interface InputProps {
    id?: string;
    type?: InputType;
    name?: string;
    value?: any;
    maxLength?: number;
    className?: string;
    size?: InputSize;
    placeholder?: string | undefined;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onTextChange?: (value: any) => {};
    onDebouncedValueChange?: (value: any) => {};
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
    disabled?: boolean;
    preEndIcon?: ReactNode;
    onPreEndIconClick?: MouseEventHandler<HTMLSpanElement>;
    endIcon?: ReactNode;
    onEndIconClick?: MouseEventHandler<HTMLSpanElement>;
    tabIndex?: number;
    alwaysVisiblePlaceholder?: boolean;
    lock?: boolean;
    autoFocus?: boolean;
    onRef?: any;
}

export const Input = ({
    id,
    type = InputType.Text,
    name,
    value,
    maxLength,
    className,
    size,
    placeholder,
    onChange,
    onTextChange,
    onDebouncedValueChange,
    onFocus,
    onBlur,
    onKeyUp,
    onKeyDown,
    disabled,
    preEndIcon,
    onPreEndIconClick,
    endIcon,
    onEndIconClick,
    tabIndex,
    alwaysVisiblePlaceholder,
    lock,
    autoFocus,
    onRef,
}: InputProps) => {
    placeholder = placeholder || 'Enter text';
    const [inputValue, setInputValue] = useState('');
    const [visiblePlaceholder, setVisiblePlaceholder] = useState(true);
    const control = useRef() as RefObject<HTMLInputElement>;
    const isFirstRun = useRef(true);
    const debouncedValue = useDebounce(value, 300);

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        if (!alwaysVisiblePlaceholder) {
            setVisiblePlaceholder(false);
        }
        if (onFocus) {
            onFocus(event);
        }
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        setVisiblePlaceholder(true);
        if (onBlur) {
            onBlur(event);
        }
    };

    const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (lock && !EventKeys.isTab(event)) {
            event.preventDefault();
            return;
        }
        if (EventKeys.isDelete(event)) {
            clearValue();
        }
        if (onKeyDown) {
            onKeyDown(event);
        }
    };

    const clearValue = () => {
        setInputValue('');
    };

    const hasNoValue = (value: any) => {
        return value === null || value === undefined || value === '';
    };

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (onDebouncedValueChange) {
            onDebouncedValueChange(debouncedValue);
        }
    }, [debouncedValue]);

    useEffect(() => {
        if (autoFocus) {
            control.current?.focus();
        }
        if (onRef) {
            onRef(control);
        }
    }, [autoFocus]);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <div
            className={classNames(
                'input-container',
                size ? size : '',
                className,
            )}
        >
            <div
                className={classNames(
                    'input',
                    { 'no-value': hasNoValue(inputValue) },
                    { ellipsis: endIcon },
                )}
            >
                <input
                    ref={control}
                    id={id}
                    type={type}
                    name={name}
                    value={inputValue}
                    placeholder={visiblePlaceholder ? placeholder : undefined}
                    maxLength={maxLength}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeydown}
                    onKeyUp={onKeyUp}
                    disabled={disabled}
                    autoComplete="new-password"
                    autoCorrect="off"
                    spellCheck="false"
                    tabIndex={tabIndex}
                    autoFocus={autoFocus}
                />
                {preEndIcon ? (
                    <span
                        className="input-icon end pre"
                        onClick={onPreEndIconClick}
                    >
                        {preEndIcon}
                    </span>
                ) : null}
                {endIcon ? (
                    <span
                        className="input-icon end post"
                        onClick={onEndIconClick}
                    >
                        {endIcon}
                    </span>
                ) : null}
            </div>
        </div>
    );
};
