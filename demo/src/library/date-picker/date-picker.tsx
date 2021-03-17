import {
    useState,
    useEffect,
    useRef,
    ChangeEventHandler,
    FocusEventHandler,
    ChangeEvent,
    FocusEvent,
    RefObject,
} from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { DatePicker as AntdDatePicker } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@library/input';
import { EventKeys } from '@util/event-keys';
import {
    YYYYMMDDHHmmssFormat,
    dddMMMDDYYYYHHmmssGMTZZ,
    format,
    formatYearToCentury,
} from './date-picker.validator';
import './date-picker.scss';

export interface IDatePickerProps {
    name?: string;
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    className?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    dateOnly?: boolean;
}

export const DatePicker = ({
    name,
    value,
    onChange,
    onFocus,
    onBlur,
    className,
    disabled,
    autoFocus,
    dateOnly = true,
}: IDatePickerProps) => {
    const [visiblePlaceholder, setVisiblePlaceholder] = useState(true);
    const [visibleDatePicker, setVisibleDatePicker] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const controlContainer = useRef() as RefObject<HTMLInputElement>;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        // todo: earlier commented
        // handleValueChange(formatEvent(event, event.target.value));
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        validate(event);
        const value = event.target.value;
        const parsedDate = parseDate(value);
        let newValue = parsedDate ? parsedDate : !value ? null : (value as any);
        if (dateOnly && newValue && newValue.format) {
            newValue = newValue.format(YYYYMMDDHHmmssFormat);
        }
        setVisiblePlaceholder(true);
        setVisibleDatePicker(false);
        // todo: added new
        setInputValue(formatDate(newValue) as any);
        if (onBlur) {
            onBlur(formatEvent(event, newValue));
        }
    };

    const handleFocus = (event: any) => {
        setVisiblePlaceholder(true);
        //setVisibleDatePicker(true);
        if (onFocus) {
            onFocus(event);
        }
    };

    const handleKeyDown = (event: any) => {
        if (EventKeys.isDelete(event)) {
            clearValue(event);
        }
        if (EventKeys.isTab(event)) {
            validate(event);
        } else if (EventKeys.isEnter(event)) {
            validate(event);
        }
    };

    const clearValue = (event?: any) => {
        setVisiblePlaceholder(true);
        setInputValue('');
        if (event) {
            handleValueChange(formatEvent(event, null));
        }
    };

    const validate = (event: any) => {
        let value = formatYearToCentury(event.target.value);
        const parsedDate = parseDate(value);
        const newValue = parsedDate ? parsedDate : !value ? null : value;
        handleValueChange(formatEvent(event, newValue));
    };

    const handleValueChange = (event?: any) => {
        if (onChange) {
            onChange(event);
        }
    };

    const formatEvent = (event: any, value: any) => {
        return {
            ...event,
            name: name,
            target: {
                ...event.target,
                name: name,
                item: event.target.value,
                value: value,
            },
            value: value,
        };
    };

    const handleEndIconClick = () => {
        if (visibleDatePicker) {
            setVisibleDatePicker(false);
        } else {
            setVisibleDatePicker(true);
        }
    };

    const handleDatePickerChange = (date: any, dateString: any) => {
        const _date =
            date && dateOnly
                ? moment(dateString, format, true).format(YYYYMMDDHHmmssFormat)
                : date;
        // todo: added new
        setInputValue(formatDate(_date) as any);
        if (onChange) {
            onChange({
                target: {
                    value: _date,
                    name: name,
                },
            } as any);
        }
    };

    const handleDatePickerOpenChange = (open: boolean) => {
        setVisibleDatePicker(open);
    };

    const parseDate = (value: string) => {
        if (value) {
            const date = moment(value, format, true);
            if (date.isValid()) {
                return date;
            }
        }
        return null;
    };

    const formatDate = (value: string) => {
        const momentDate = parseMoment(value);
        return momentDate ? momentDate.format(format[0]) : null;
    };

    const parseMoment = (value: any) => {
        return typeof value === 'string' &&
            moment(value, YYYYMMDDHHmmssFormat, true).isValid()
            ? moment(value, format)
            : value && (moment.isMoment(value) || moment.isDate(value))
            ? moment(value, format)
            : null;
    };

    const isDate = (value: any) => {
        return value && (moment.isMoment(value) || moment.isDate(value));
    };

    const datePickerValue = () => {
        return parseMoment(value);
    };

    const isValiddddMMMDDYYYYHHmmssGMTZZDate = () => {
        return moment(value, dddMMMDDYYYYHHmmssGMTZZ, true).isValid();
    };

    useEffect(() => {
        if (value) {
            let updatedValue = value;
            if (isValiddddMMMDDYYYYHHmmssGMTZZDate()) {
                updatedValue = moment(value, format, true).format(
                    YYYYMMDDHHmmssFormat,
                );
                if (onChange) {
                    onChange({
                        target: {
                            value: updatedValue,
                            name: name,
                        },
                    } as any);
                }
            }
            const formattedDate = formatDate(updatedValue);
            if (formattedDate) {
                setInputValue(formattedDate);
            } else {
                setInputValue(updatedValue);
            }
        } else {
            if (value === null) {
                clearValue();
            }
        }
    }, [value]);

    return (
        <span
            ref={controlContainer}
            className={classNames(
                'date-picker',
                { invalid: !moment(value, format).isValid() },
                className,
            )}
        >
            {/* Uncomment to test */}
            {/* {JSON.stringify(value)} */}
            <Input
                name={`date-picker-${name}`}
                className="date-picker-input"
                value={inputValue}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={visiblePlaceholder ? format[0] : ''}
                endIcon={
                    <FontAwesomeIcon icon={faCalendarAlt}></FontAwesomeIcon>
                }
                onEndIconClick={handleEndIconClick}
                disabled={disabled}
                autoFocus={autoFocus}
            />
            <AntdDatePicker
                format={format}
                open={visibleDatePicker}
                name={name}
                value={datePickerValue()}
                onChange={handleDatePickerChange}
                onOpenChange={handleDatePickerOpenChange}
                inputReadOnly={disabled}
                disabled={disabled}
                showToday={false}
                //getPopupContainer={trigger => trigger.parentElement}
            />
        </span>
    );
};
