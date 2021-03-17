import moment from 'moment';

export const YYYYMMDDHHmmssFormat = 'YYYY-MM-DDTHH:mm:ss';
export const dddMMMDDYYYYHHmmssGMTZZ = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ';

export const format = [
    'MM/DD/YYYY',
    'MM/DD/YY',
    'M/D/YYYY',
    'M/D/YY',
    'MMDDYY',
    'MMDDYYYY',
    'MDYY',
    'MDYYYY',
    dddMMMDDYYYYHHmmssGMTZZ,
    YYYYMMDDHHmmssFormat,
];

/*
export const addDateValidator = (Yup) => {
    Yup.addMethod(Yup.string, 'isDate', function (fieldName) {
        return this.test({
            name: 'name',
            message: `Please Enter a valid ${fieldName}`,
            test: (value) => {
                return value ? isDate(value) : true;
            },
        });
    });
    Yup.addMethod(Yup.date, 'isDate', function (fieldName) {
        return this.test({
            name: 'name',
            message: `Please Enter a valid ${fieldName}`,
            test: (value) => {
                return value ? isDate(value) : true;
            },
        });
    });
};
*/

export const isDate = (value: any, strict = true) => {
    //TODO: Need to check Valid format of new Date()
    if (moment(value, format, true).isValid()) {
        return true;
    } else if (value && value.length > 30) {
        return moment(value).isValid();
    } else {
        return false;
    }
    // return !strict
    //     ? moment(value).isValid()
    //     : moment(value, format, true).isValid();
};

export const formatYearToCentury = (value: any) => {
    if (value && (value.length === 6 || value.length === 8)) {
        let year;
        if (value.length === 8 && !value.includes('/')) {
            year = value.toString().substring(value.length - 4, value.length);
        } else {
            year = value.toString().substring(value.length - 2, value.length);
        }

        if (!isNaN(year) && year.length !== 4) {
            let currentCentury = Math.floor(new Date().getFullYear() / 100);
            if (year >= 50) {
                currentCentury--;
            }
            return `${value
                .toString()
                .substring(0, value.length - 2)}${currentCentury}${year}`;
        }
    }
    return value;
};
